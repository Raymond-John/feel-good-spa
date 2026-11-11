/* Feel Good Spa — shared JS (TravelBooking UI patterns) */

const SERVICES = {
  "swedish-massage": {
    id: "swedish-massage",
    name: "Swedish Massage",
    category: "massage",
    duration: "60 / 90 minutes",
    price: "From $85",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    short: "Classic long strokes and gentle kneading to ease tension and encourage deep relaxation.",
    description: "Our Swedish Massage uses flowing strokes, gentle kneading and rhythmic movement to release everyday tension. Ideal if you are new to massage or simply want a calm, restorative experience.",
    expect: ["A quiet consultation about pressure and focus areas", "Warm oils and uninterrupted, unhurried pacing", "Soft lighting and a peaceful treatment room", "Time to rest and rehydrate after your session"],
    benefits: ["Helps ease muscle tightness from daily stress", "Supports circulation and a sense of calm", "Encourages better rest and recovery", "Suitable for most guests seeking gentle care"],
    related: ["aromatherapy", "relaxation-massage", "hot-stone-massage"],
  },
  "deep-tissue-massage": {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    category: "massage",
    duration: "60 / 90 minutes",
    price: "From $105",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
    short: "Focused pressure that works into deeper layers of muscle to ease stubborn tightness.",
    description: "Deep Tissue Massage targets areas of persistent tension with slower, more intentional pressure. Your therapist will check in throughout so the intensity remains comfortable and effective.",
    expect: ["Discussion of problem areas and preferred pressure", "Slower techniques focused on specific muscle groups", "Optional pauses if you need to adjust intensity", "Aftercare guidance for hydration and rest"],
    benefits: ["Helps release deeper muscular tightness", "Useful after physical work or long periods of sitting", "May improve mobility and body awareness", "Can complement a regular wellness routine"],
    related: ["swedish-massage", "hot-stone-massage", "body-scrub"],
  },
  aromatherapy: {
    id: "aromatherapy",
    name: "Aromatherapy",
    category: "massage",
    duration: "75 minutes",
    price: "From $95",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
    short: "A soothing massage blended with carefully selected essential oils for mind and body balance.",
    description: "Aromatherapy combines gentle massage with essential oil blends chosen to support relaxation, clarity or renewal. The scent and touch work together to create a deeply calming atmosphere.",
    expect: ["Guidance on oil blends suited to your preference", "Full-body massage with aromatic oils", "A quiet, scent-softened treatment space", "A few moments to settle before you leave"],
    benefits: ["Supports emotional calm and sensory ease", "Softens muscle tension through gentle touch", "Creates a memorable, restorative ritual", "Ideal before travel or special occasions"],
    related: ["swedish-massage", "facial-treatment", "relaxation-massage"],
  },
  "hot-stone-massage": {
    id: "hot-stone-massage",
    name: "Hot Stone Massage",
    category: "massage",
    duration: "90 minutes",
    price: "From $120",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    short: "Warm smooth stones and skilled hands melt away tension for a deeply grounding session.",
    description: "Heated basalt stones are placed along key points of the body and used as massage tools, allowing warmth to soften tight muscles while your therapist works with steady, calming pressure.",
    expect: ["Warm stones placed and glided with care", "A longer session designed for deep release", "Comfort checks throughout the treatment", "Cool-down time before you rise"],
    benefits: ["Warmth helps muscles soften more readily", "Encourages profound physical relaxation", "Supports relief from cold-weather tightness", "A luxurious option for slower rest days"],
    related: ["deep-tissue-massage", "swedish-massage", "aromatherapy"],
  },
  "body-polish": {
    id: "body-polish",
    name: "Body Polish",
    category: "body",
    duration: "45 minutes",
    price: "From $70",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    short: "A refining polish that smooths the skin and leaves it soft, luminous and refreshed.",
    description: "Body Polish gently buffs away dull surface cells and nourishes the skin with hydrating finishes. It is an excellent preparation before massage or as a standalone skin-renewing treat.",
    expect: ["Skin assessment and product selection", "Even, circular polishing movements", "A hydrating finish to lock in softness", "Advice on aftercare at home"],
    benefits: ["Leaves skin feeling smoother and brighter", "Prepares the body for massage oils", "Supports a polished, cared-for finish", "Quick yet indulgent wellness add-on"],
    related: ["body-scrub", "facial-treatment", "aromatherapy"],
  },
  "facial-treatment": {
    id: "facial-treatment",
    name: "Facial Treatment",
    category: "facial",
    duration: "60 minutes",
    price: "From $90",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    short: "A customised facial that cleanses, nourishes and restores a healthy, calm complexion.",
    description: "Our Facial Treatment is tailored to your skin’s needs with cleansing, gentle exfoliation, a targeted mask and nourishing finish. Expect a quiet hour dedicated entirely to your skin.",
    expect: ["Brief skin consultation", "Cleanse, exfoliate, mask and moisturise", "Optional face and shoulder massage", "Simple home-care recommendations"],
    benefits: ["Refreshes tired or dull-looking skin", "Supports hydration and comfort", "Creates a calm, spa-day ritual", "Complements body treatments beautifully"],
    related: ["body-polish", "aromatherapy", "body-scrub"],
  },
  "body-scrub": {
    id: "body-scrub",
    name: "Body Scrub",
    category: "body",
    duration: "50 minutes",
    price: "From $75",
    image: "https://images.unsplash.com/photo-1515375660635-ccf4f8e7ef57?auto=format&fit=crop&w=1200&q=80",
    short: "Invigorating exfoliation that awakens the senses and softens the skin from head to toe.",
    description: "A full-body scrub using spa-grade exfoliants to refresh the skin’s surface. Followed by a light moisturising finish, this treatment is both energising and deeply pampering.",
    expect: ["Choice of scrub profile where available", "Thorough yet comfortable exfoliation", "Rinse or wipe-down as appropriate", "Hydrating cream or oil finish"],
    benefits: ["Helps skin feel smoother to the touch", "Awakens the senses with texture and scent", "Pairs well with massage packages", "A favourite before special occasions"],
    related: ["body-polish", "swedish-massage", "relaxation-massage"],
  },
  "relaxation-massage": {
    id: "relaxation-massage",
    name: "Relaxation Massage",
    category: "massage",
    duration: "60 minutes",
    price: "From $80",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    short: "Soft, flowing techniques designed purely for calm, comfort and quiet restoration.",
    description: "Relaxation Massage prioritises comfort over intensity. Light-to-medium pressure, steady rhythm and a peaceful room help you unwind when rest is the goal.",
    expect: ["Gentle pressure tailored to your comfort", "Focus on ease rather than deep work", "Calming music and soft lighting", "Unhurried closing moments"],
    benefits: ["Ideal for stress-heavy weeks", "Supports mental quiet and rest", "Welcoming for first-time spa guests", "A lovely gift experience"],
    related: ["swedish-massage", "aromatherapy", "facial-treatment"],
  },
};

(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("mobileToggle");
  const closeBtn = document.getElementById("mobileClose");
  const drawer = document.getElementById("mobileNav");
  const overlay = document.getElementById("mobileOverlay");

  const path = window.location.pathname.split("/").pop() || "index.html";

  const floatLinks = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "services.html", label: "Services" },
    { href: "packages.html", label: "Packages" },
    { href: "gallery.html", label: "Gallery" },
    { href: "booking.html", label: "Booking" },
    { href: "contact.html", label: "Contact" },
  ];

  const floatNav = document.createElement("nav");
  floatNav.className = "float-nav";
  floatNav.id = "floatNav";
  floatNav.setAttribute("aria-label", "Quick navigation");
  floatNav.innerHTML = floatLinks
    .map(function (item) {
      const isActive =
        item.href === path || (path === "" && item.href === "index.html");
      return (
        '<a href="' +
        item.href +
        '"' +
        (isActive ? ' class="active"' : "") +
        ">" +
        "<span>" +
        item.label +
        "</span></a>"
      );
    })
    .join("");
  document.body.appendChild(floatNav);

  function centerActiveFloatLink() {
    const active = floatNav.querySelector("a.active");
    if (!active || typeof active.scrollIntoView !== "function") return;
    active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  function getHeroBottom() {
    const hero = document.querySelector(".hero, .page-hero");
    if (!hero) return 120;
    return hero.offsetTop + hero.offsetHeight;
  }

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    const drawerOpen = drawer && drawer.classList.contains("open");
    const pastHero = window.scrollY > getHeroBottom() - 64;
    const showFloat = pastHero && !drawerOpen;
    const wasVisible = floatNav.classList.contains("is-visible");
    floatNav.classList.toggle("is-visible", showFloat);
    document.body.classList.toggle("has-float-nav", showFloat);
    if (showFloat && !wasVisible) {
      window.requestAnimationFrame(centerActiveFloatLink);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  function openMobile() {
    if (!drawer || !overlay) return;
    drawer.classList.add("open");
    overlay.classList.add("show");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    floatNav.classList.remove("is-visible");
  }
  function closeMobile() {
    if (!drawer || !overlay) return;
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    onScroll();
  }

  if (toggle) toggle.addEventListener("click", openMobile);
  if (closeBtn) closeBtn.addEventListener("click", closeMobile);
  if (overlay) overlay.addEventListener("click", closeMobile);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeMobile();
      if (toggle) toggle.focus();
    }
  });
  document.querySelectorAll("#mobileNav .nav-link").forEach(function (link) {
    link.addEventListener("click", closeMobile);
  });

  document.querySelectorAll(".nav-center a, #mobileNav .nav-link").forEach(function (link) {
    const href = (link.getAttribute("href") || "").split("#")[0];
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // GSAP + ScrollTrigger (animations.js) owns reveals/counters when available
  const useGsapMotion =
    typeof window.gsap !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealEls = document.querySelectorAll(".reveal");
  if (!useGsapMotion) {
    if ("IntersectionObserver" in window && revealEls.length) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  const counters = document.querySelectorAll(".stat-num[data-count]");
  let countersDone = false;
  function animateCounters() {
    if (countersDone) return;
    countersDone = true;
    counters.forEach(function (el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / 1600, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        el.innerHTML = value + '<span class="suffix">' + suffix + "</span>";
        if (progress < 1) requestAnimationFrame(tick);
        else el.innerHTML = target + '<span class="suffix">' + suffix + "</span>";
      }
      requestAnimationFrame(tick);
    });
  }
  if (!useGsapMotion) {
    if ("IntersectionObserver" in window && counters.length) {
      const statsSection = document.querySelector(".stats-strip");
      const counterObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              counterObs.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      if (statsSection) counterObs.observe(statsSection);
    } else if (counters.length) {
      animateCounters();
    }
  }

  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    window.addEventListener(
      "scroll",
      function () {
        backBtn.classList.toggle("visible", window.scrollY > 400);
      },
      { passive: true }
    );
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function bindFilter(btnAttr, itemAttr) {
    const buttons = document.querySelectorAll("[" + btnAttr + "]");
    const items = document.querySelectorAll("[" + itemAttr + "]");
    if (!buttons.length || !items.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute(btnAttr);
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        items.forEach(function (item) {
          const category = item.getAttribute(itemAttr);
          const show = filter === "all" || category === filter;
          item.classList.toggle("hidden", !show);
        });
      });
    });
  }
  bindFilter("data-service-filter", "data-service-category");
  bindFilter("data-gallery-filter", "data-gallery-category");

  const items = Array.from(document.querySelectorAll("[data-lightbox]"));
  const lightbox = document.getElementById("lightbox");
  if (items.length && lightbox) {
    const img = lightbox.querySelector(".lightbox-image");
    const closeL = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    let current = 0;
    const visibleItems = function () {
      return items.filter(function (item) {
        return !item.classList.contains("hidden");
      });
    };
    const open = function (index) {
      const list = visibleItems();
      if (!list.length) return;
      current = index;
      const src = list[current].querySelector("img").getAttribute("src");
      const alt = list[current].querySelector("img").getAttribute("alt") || "";
      img.src = src;
      img.alt = alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    };
    const close = function () {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    };
    const step = function (dir) {
      const list = visibleItems();
      if (!list.length) return;
      current = (current + dir + list.length) % list.length;
      img.src = list[current].querySelector("img").getAttribute("src");
      img.alt = list[current].querySelector("img").getAttribute("alt") || "";
    };
    items.forEach(function (item) {
      item.addEventListener("click", function () {
        const list = visibleItems();
        open(Math.max(0, list.indexOf(item)));
      });
    });
    if (closeL) closeL.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  function isValidPhone(value) {
    return /^[+]?[\d\s()-]{7,20}$/.test(value.trim());
  }
  function showMessage(el, type, text) {
    if (!el) return;
    el.className = "form-message show " + type;
    el.textContent = text;
  }
  function clearInvalid(form) {
    form.querySelectorAll(".is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[name="email"], #newsletterEmail');
      const status = document.getElementById("newsletterMessage") || document.getElementById("newsletterStatus");
      if (!email || !email.value.trim() || !isValidEmail(email.value.trim())) {
        if (email) email.classList.add("is-invalid");
        return showMessage(status, "error", "Please enter a valid email address.");
      }
      showMessage(status, "success", "Thank you for subscribing. Please check your inbox to confirm.");
      newsletterForm.reset();
    });
  }

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get("service");
    const packageParam = params.get("package");
    if (serviceParam && bookingForm.treatment) {
      bookingForm.treatment.value = serviceParam;
    }
    if (packageParam && bookingForm.package) {
      bookingForm.package.value = packageParam;
    }
    const dateInput = document.getElementById("preferredDate");
    if (dateInput) {
      const today = new Date();
      dateInput.min =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
    }
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearInvalid(bookingForm);
      const message = document.getElementById("bookingMessage");
      let valid = true;
      const fields = [
        [bookingForm.fullName, function (v) { return v.trim().length >= 2; }],
        [bookingForm.phone, function (v) { return isValidPhone(v); }],
        [bookingForm.email, function (v) { return isValidEmail(v.trim()); }],
        [bookingForm.treatment, function (v) { return !!v; }],
        [bookingForm.preferredDate, function (v) { return !!v; }],
        [bookingForm.preferredTime, function (v) { return !!v; }],
        [bookingForm.guests, function (v) { return Number(v) >= 1; }],
      ];
      fields.forEach(function (pair) {
        const el = pair[0];
        if (!el || !pair[1](el.value)) {
          if (el) el.classList.add("is-invalid");
          valid = false;
        }
      });
      if (!valid) {
        return showMessage(message, "error", "Please complete all required fields correctly.");
      }
      showMessage(
        message,
        "success",
        "Thank you. Your booking request has been received. We will contact you shortly to confirm."
      );
      bookingForm.reset();
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearInvalid(contactForm);
      const message = document.getElementById("contactFormMessage");
      const name = contactForm.contactName;
      const email = contactForm.contactEmail;
      const subject = contactForm.contactSubject;
      const msg = contactForm.contactMessage;
      let valid = true;
      if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add("is-invalid");
        valid = false;
      }
      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        email.classList.add("is-invalid");
        valid = false;
      }
      if (!subject.value.trim()) {
        subject.classList.add("is-invalid");
        valid = false;
      }
      if (!msg.value.trim() || msg.value.trim().length < 10) {
        msg.classList.add("is-invalid");
        valid = false;
      }
      if (!valid) {
        return showMessage(message, "error", "Please fill in all fields. Message should be at least 10 characters.");
      }
      showMessage(message, "success", "Thank you for your message. We will get back to you shortly.");
      contactForm.reset();
    });
  }

  const container = document.getElementById("serviceDetails");
  if (container) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("service") || "swedish-massage";
    const service = SERVICES[id] || SERVICES["swedish-massage"];
    document.title = service.name + " | Feel Good Spa";
    const setText = function (sel, text) {
      const el = document.getElementById(sel);
      if (el) el.textContent = text;
    };
    setText("serviceTitle", service.name);
    setText("serviceDescription", service.description);
    setText("serviceDuration", service.duration);
    setText("servicePrice", service.price);
    setText("serviceBreadcrumb", service.name);
    const imgEl = document.getElementById("serviceImage");
    if (imgEl) {
      imgEl.src = service.image;
      imgEl.alt = service.name + " at Feel Good Spa";
    }
    const bookBtn = document.getElementById("bookServiceBtn");
    if (bookBtn) bookBtn.href = "booking.html?service=" + encodeURIComponent(service.id);
    const expectEl = document.getElementById("serviceExpect");
    if (expectEl) expectEl.innerHTML = service.expect.map(function (item) { return "<li>" + item + "</li>"; }).join("");
    const benefitsEl = document.getElementById("serviceBenefits");
    if (benefitsEl) benefitsEl.innerHTML = service.benefits.map(function (item) { return "<li>" + item + "</li>"; }).join("");
    const relatedEl = document.getElementById("relatedServices");
    if (relatedEl) {
      relatedEl.innerHTML = service.related
        .map(function (relatedId) {
          const related = SERVICES[relatedId];
          if (!related) return "";
          return (
            '<a href="service-details.html?service=' + related.id + '" class="dest-card">' +
            '<div class="dest-media"><img src="' + related.image + '" alt="' + related.name + '" loading="lazy"></div>' +
            '<div class="dest-body"><h3>' + related.name + '</h3><p>' + related.price + '</p>' +
            '<span class="dest-link">View details <i class="bi bi-arrow-right"></i></span></div></a>'
          );
        })
        .join("");
    }
  }
})();
