/* Feel Good Spa — GSAP cinematic motion system */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";

  window.FGSMotion = {
    active: false,
    reduceMotion: reduceMotion,
  };

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function initHeroSlideshow(forcePause) {
    var hero = document.querySelector(".hero.hero-cinematic");
    if (!hero) return;

    var slides = qsa(".hero-slide", hero);
    var dots = qsa(".hero-dot", hero);
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var pauseBtn = hero.querySelector("[data-hero-pause]");
    if (slides.length < 2) return;

    var index = Math.max(
      0,
      slides.findIndex(function (s) {
        return s.classList.contains("is-active");
      })
    );
    var timer = null;
    var paused = !!forcePause || reduceMotion;
    var DURATION = 7000;

    function setDots(i) {
      dots.forEach(function (dot, di) {
        dot.classList.toggle("is-active", di === i);
        dot.setAttribute("aria-current", di === i ? "true" : "false");
        var fill = dot.querySelector("span");
        if (!fill) return;
        fill.style.animation = "none";
        void fill.offsetWidth;
        if (di === i && !paused) fill.style.removeProperty("animation");
      });
    }

    function goTo(nextIndex) {
      if (nextIndex === index) return;
      var current = slides[index];
      var upcoming = slides[nextIndex];
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      upcoming.classList.add("is-active");
      window.setTimeout(function () {
        current.classList.remove("is-leaving");
      }, 1400);
      index = nextIndex;
      setDots(index);
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

    setDots(index);
    if (!paused) restart();
  }

  function revealAllFallback() {
    qsa(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (!hasGsap || reduceMotion) {
    revealAllFallback();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initHeroSlideshow(true);
      });
    } else {
      initHeroSlideshow(true);
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
              '<span class="word"><' +
                tag +
                ">" +
                node.textContent +
                "</" +
                tag +
                "></span>"
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

    var eyebrow = hero.querySelector(".hero-eyebrow, .eyebrow");
    var title = hero.querySelector("h1");
    var sub = hero.querySelector(".hero-sub");
    var actions = hero.querySelector(".hero-actions");
    var meta = hero.querySelector(".hero-meta");
    var controls = hero.querySelector(".hero-controls");
    var scrollCue = hero.querySelector(".hero-scroll");
    var stage = hero.querySelector(".hero-stage");

    if (title) splitHeadline(title);
    var words = title ? qsa(".word", title) : [];

    gsap.set([eyebrow, sub, actions, meta, controls, scrollCue].filter(Boolean), {
      autoAlpha: 0,
      y: 28,
    });
    gsap.set(words, { yPercent: 110, autoAlpha: 0 });
    if (stage) gsap.set(stage, { clipPath: "inset(10% 6% 10% 6%)", scale: 1.05 });

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (stage) {
      tl.to(
        stage,
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.55, ease: "power2.inOut" },
        0
      );
    }
    if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35);
    if (words.length) {
      tl.to(words, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 0.55);
    }
    if (sub) tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.85 }, 1.05);
    if (actions) tl.to(actions, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.25);
    if (meta) tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.75 }, 1.45);
    if (controls) tl.to(controls, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.55);
    if (scrollCue) tl.to(scrollCue, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.65);

    if (stage && ScrollTrigger) {
      gsap.to(stage, {
        yPercent: 10,
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

      gsap.set(targets, { autoAlpha: 0, y: 36 });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.95,
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
          { scale: 1.12 },
          {
            scale: 1,
            duration: 1.3,
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
            duration: 1.6,
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
    initHeroSlideshow(false);
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
