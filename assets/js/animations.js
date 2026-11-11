/* Feel Good Spa — advanced cinematic GSAP motion */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";

  window.FGSMotion = {
    active: false,
    reduceMotion: reduceMotion,
  };

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function syncHeroHeader() {
    if (!document.body.classList.contains("page-home")) return;
    document.body.classList.toggle("is-hero-scrolled", window.scrollY > 48);
  }

  /* ---------- Slideshow (CSS fallback + GSAP path) ---------- */
  function initHeroSlideshow(options) {
    options = options || {};
    var hero = document.querySelector(".hero.hero-cinematic");
    if (!hero) return;

    var slides = qsa(".hero-slide", hero);
    var dots = qsa(".hero-dot", hero);
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var pauseBtn = hero.querySelector("[data-hero-pause]");
    var caption = hero.querySelector("[data-hero-caption]");
    if (slides.length < 2) return;

    var index = Math.max(
      0,
      slides.findIndex(function (s) {
        return s.classList.contains("is-active");
      })
    );
    var timer = null;
    var paused = !!options.forcePause || reduceMotion;
    var busy = false;
    var DURATION = 8000;
    var useGsap = !!options.useGsap && typeof window.gsap !== "undefined";

    function setCaption(i) {
      if (!caption) return;
      var text = slides[i].getAttribute("data-caption") || "";
      if (useGsap) {
        gsap.to(caption, {
          autoAlpha: 0,
          y: 6,
          duration: 0.25,
          onComplete: function () {
            caption.textContent = text;
            gsap.to(caption, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
          },
        });
      } else {
        caption.textContent = text;
      }
    }

    function setDots(i) {
      dots.forEach(function (dot, di) {
        dot.classList.toggle("is-active", di === i);
        dot.setAttribute("aria-current", di === i ? "true" : "false");
        var fill = dot.querySelector("span");
        if (!fill) return;
        fill.classList.remove("is-running");
        void fill.offsetWidth;
        if (di === i && !paused) fill.classList.add("is-running");
      });
    }

    function goTo(nextIndex) {
      if (nextIndex === index || busy) return;
      var current = slides[index];
      var upcoming = slides[nextIndex];
      busy = true;

      if (useGsap) {
        var img = upcoming.querySelector("img");
        gsap.set(upcoming, {
          autoAlpha: 1,
          visibility: "visible",
          zIndex: 3,
          clipPath: "inset(0% 0% 0% 100%)",
        });
        if (img) gsap.set(img, { scale: 1.18 });

        var tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: function () {
            current.classList.remove("is-active", "is-leaving");
            gsap.set(current, { autoAlpha: 0, visibility: "hidden", zIndex: 0, clipPath: "inset(0 0 0 0)" });
            upcoming.classList.add("is-active");
            gsap.set(upcoming, { zIndex: 1, clearProps: "clipPath" });
            busy = false;
          },
        });

        current.classList.add("is-leaving");
        tl.to(upcoming, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35 }, 0);
        if (img) tl.to(img, { scale: 1.05, duration: 1.6, ease: "power2.out" }, 0);
        tl.to(current, { autoAlpha: 0.35, duration: 1.1 }, 0.15);
      } else {
        current.classList.remove("is-active");
        current.classList.add("is-leaving");
        upcoming.classList.add("is-active");
        window.setTimeout(function () {
          current.classList.remove("is-leaving");
          busy = false;
        }, 1400);
      }

      index = nextIndex;
      setDots(index);
      setCaption(index);
      restart();
    }

    function nextSlide() {
      goTo((index + 1) % slides.length);
    }

    function prevSlide() {
      goTo((index - 1 + slides.length) % slides.length);
    }

    function restart() {
      window.clearInterval(timer);
      timer = null;
      if (paused) {
        setDots(index);
        return;
      }
      timer = window.setInterval(nextSlide, DURATION);
      setDots(index);
    }

    function setPaused(state) {
      paused = state;
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
        var icon = pauseBtn.querySelector("i");
        if (icon) icon.className = paused ? "bi bi-play-fill" : "bi bi-pause-fill";
      }
      restart();
    }

    if (prev) prev.addEventListener("click", prevSlide);
    if (next) next.addEventListener("click", nextSlide);
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        setPaused(!paused);
      });
    }
    dots.forEach(function (dot, di) {
      dot.addEventListener("click", function () {
        goTo(di);
      });
    });

    hero.addEventListener("mouseenter", function () {
      if (!paused) window.clearInterval(timer);
    });
    hero.addEventListener("mouseleave", function () {
      if (!paused) restart();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) window.clearInterval(timer);
      else if (!paused) restart();
    });

    setCaption(index);
    setDots(index);
    if (!paused) restart();
  }

  function revealAllFallback() {
    qsa(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
    qsa(".hero-overlay, .hero-vignette, .hero-grain, .hero-frame, .hero-float, .hero-ornament").forEach(
      function (el) {
        el.style.opacity = "1";
      }
    );
  }

  syncHeroHeader();
  window.addEventListener("scroll", syncHeroHeader, { passive: true });

  if (!hasGsap || reduceMotion) {
    revealAllFallback();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initHeroSlideshow({ forcePause: true, useGsap: false });
      });
    } else {
      initHeroSlideshow({ forcePause: true, useGsap: false });
    }
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("has-gsap");
  window.FGSMotion.active = true;

  function splitHeadline(h1) {
    if (!h1 || h1.dataset.split === "1") return;
    var parts = h1.innerHTML.split(/<br\s*\/?>/i);
    h1.innerHTML = parts
      .map(function (line) {
        var tmp = document.createElement("div");
        tmp.innerHTML = line.trim();
        var words = [];
        tmp.childNodes.forEach(function (node) {
          if (node.nodeType === 3) {
            node.textContent.split(/(\s+)/).forEach(function (chunk) {
              if (!chunk) return;
              if (/^\s+$/.test(chunk)) words.push(chunk);
              else words.push('<span class="word">' + chunk + "</span>");
            });
          } else if (node.nodeType === 1) {
            var tag = node.tagName.toLowerCase();
            words.push(
              '<span class="word"><' + tag + ">" + node.textContent + "</" + tag + "></span>"
            );
          }
        });
        return '<span class="line">' + words.join("") + "</span>";
      })
      .join("");
    h1.dataset.split = "1";
  }

  function initCinematicHero() {
    var hero = document.querySelector(".hero.hero-cinematic");
    if (!hero) return;

    var stage = hero.querySelector(".hero-stage");
    var overlay = hero.querySelector(".hero-overlay");
    var vignette = hero.querySelector(".hero-vignette");
    var grain = hero.querySelector(".hero-grain");
    var frame = hero.querySelector(".hero-frame");
    var floatCard = hero.querySelector(".hero-float");
    var floatImg = hero.querySelector(".hero-float-media img");
    var ornament = hero.querySelector(".hero-ornament");
    var eyebrow = hero.querySelector(".hero-eyebrow, .eyebrow");
    var title = hero.querySelector("h1");
    var sub = hero.querySelector(".hero-sub");
    var actions = hero.querySelector(".hero-actions");
    var actionBtns = actions ? qsa(".btn-lux", actions) : [];
    var meta = hero.querySelector(".hero-meta");
    var controls = hero.querySelector(".hero-controls");
    var scrollCue = hero.querySelector(".hero-scroll");
    var activeImg = hero.querySelector(".hero-slide.is-active img");

    if (title) splitHeadline(title);
    var words = title ? qsa(".word", title) : [];

    gsap.set(
      [eyebrow, sub, meta, controls, scrollCue, frame, floatCard, ornament].filter(Boolean),
      { autoAlpha: 0, y: 28 }
    );
    gsap.set(actionBtns, { autoAlpha: 0, y: 24 });
    gsap.set(words, { yPercent: 120, autoAlpha: 0 });
    gsap.set([overlay, vignette, grain].filter(Boolean), { autoAlpha: 0 });
    if (stage) gsap.set(stage, { clipPath: "inset(14% 10% 14% 10%)", scale: 1.08 });
    if (activeImg) gsap.set(activeImg, { scale: 1.18 });
    if (floatImg) gsap.set(floatImg, { scale: 1.12 });

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (stage) {
      tl.to(
        stage,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.85,
          ease: "power2.inOut",
        },
        0
      );
    }
    if (activeImg) {
      tl.to(activeImg, { scale: 1.05, duration: 2.2, ease: "power2.out" }, 0.05);
    }
    if (overlay) tl.to(overlay, { autoAlpha: 1, duration: 1.1 }, 0.25);
    if (vignette) tl.to(vignette, { autoAlpha: 1, duration: 1.1 }, 0.35);
    if (grain) tl.to(grain, { autoAlpha: 0.045, duration: 1 }, 0.45);
    if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.55);
    if (words.length) {
      tl.to(words, { yPercent: 0, autoAlpha: 1, duration: 1.05, stagger: 0.09, ease: "power3.out" }, 0.75);
    }
    if (sub) tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.25);
    if (actionBtns.length) {
      tl.to(actionBtns, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.45);
    }
    if (meta) tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.75 }, 1.7);
    if (frame) tl.to(frame, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 1.55);
    if (floatCard) {
      tl.to(floatCard, { autoAlpha: 1, y: 0, duration: 1.05, ease: "power2.out" }, 1.75);
      if (floatImg) tl.to(floatImg, { scale: 1, duration: 1.4, ease: "power2.out" }, 1.75);
    }
    if (ornament) tl.to(ornament, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.95);
    if (controls) tl.to(controls, { autoAlpha: 1, y: 0, duration: 0.75 }, 1.9);
    if (scrollCue) tl.to(scrollCue, { autoAlpha: 1, y: 0, duration: 0.7 }, 2.05);

    if (stage && ScrollTrigger) {
      gsap.to(stage, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  function initMouseParallax() {
    if (!canHover || reduceMotion) return;
    var hero = document.querySelector(".hero.hero-immersive");
    if (!hero) return;

    var layers = [
      { el: hero.querySelector('[data-parallax="bg"]'), x: 18, y: 12 },
      { el: hero.querySelector('[data-parallax="mid"]'), x: -12, y: -8 },
      { el: hero.querySelector('[data-parallax="fg"]'), x: -22, y: 16 },
      { el: hero.querySelector(".hero-ornament"), x: 14, y: -18 },
      { el: hero.querySelector('[data-parallax="content"]'), x: -8, y: 6 },
    ].filter(function (item) {
      return item.el;
    });

    if (!layers.length) return;

    var dest = { x: 0, y: 0 };
    var curr = { x: 0, y: 0 };
    var ticking = false;

    function render() {
      curr.x += (dest.x - curr.x) * 0.06;
      curr.y += (dest.y - curr.y) * 0.06;
      layers.forEach(function (layer) {
        gsap.set(layer.el, {
          x: curr.x * layer.x,
          y: curr.y * layer.y,
          force3D: true,
        });
      });
      if (Math.abs(dest.x - curr.x) > 0.001 || Math.abs(dest.y - curr.y) > 0.001) {
        requestAnimationFrame(render);
      } else {
        ticking = false;
      }
    }

    hero.addEventListener(
      "pointermove",
      function (e) {
        var rect = hero.getBoundingClientRect();
        dest.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        dest.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(render);
        }
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", function () {
      dest.x = 0;
      dest.y = 0;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    });
  }

  function initScrollReveals() {
    if (!ScrollTrigger) {
      revealAllFallback();
      return;
    }

    qsa(".reveal").forEach(function (section) {
      var kids = qsa(
        ".section-head, .split-media, .split-content, .dest-card, .service, .testimonial, .check-list li, .stat, .gallery-preview a, .cta-inner > *, .form-panel, .side-panel, .service-card, .value-card, .mv-card, .package-card",
        section
      );
      var targets = kids.length ? kids : [section];

      gsap.set(targets, { autoAlpha: 0, y: 40 });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        onStart: function () {
          section.classList.add("is-visible");
        },
      });
    });

    qsa(".split-media img, .dest-media img, .gallery-preview a img, .gallery-item img").forEach(
      function (img) {
        gsap.fromTo(
          img,
          { scale: 1.14, y: 16 },
          {
            scale: 1,
            y: 0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img.parentElement || img,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    );

    qsa(".section-head h2, .split-content h2").forEach(function (heading) {
      gsap.fromTo(
        heading,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        }
      );
    });
  }

  function initPageHero() {
    var pageHero = document.querySelector(".page-hero");
    if (!pageHero) return;
    var items = qsa(".breadcrumb-lux, .eyebrow, h1, .hero-sub", pageHero);
    if (!items.length) return;
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.08 }
    );
  }

  function initCounters() {
    var nums = qsa(".stat-num[data-count]");
    if (!nums.length || !ScrollTrigger) return;
    var strip = document.querySelector(".stats-strip");
    if (!strip) return;

    var done = false;
    ScrollTrigger.create({
      trigger: strip,
      start: "top 80%",
      once: true,
      onEnter: function () {
        if (done) return;
        done = true;
        nums.forEach(function (el) {
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.7,
            ease: "power2.out",
            onUpdate: function () {
              el.innerHTML =
                Math.floor(obj.val) + '<span class="suffix">' + suffix + "</span>";
            },
            onComplete: function () {
              el.innerHTML = target + '<span class="suffix">' + suffix + "</span>";
            },
          });
        });
      },
    });
  }

  function boot() {
    initCinematicHero();
    initHeroSlideshow({ forcePause: false, useGsap: true });
    initMouseParallax();
    initPageHero();
    initScrollReveals();
    initCounters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
