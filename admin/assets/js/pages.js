/* Feel Good Spa Admin — page controllers */
(function () {
  "use strict";

  const page = document.body.getAttribute("data-page");
  if (!page || page === "login" || page === "dashboard") return;

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.AdminUI || !AdminUI.requireAuth()) return;
    const map = {
      website: initWebsite,
      bookings: initBookings,
      calendar: initCalendar,
      services: initServices,
      packages: initPackages,
      customers: initCustomers,
      therapists: initTherapists,
      gallery: initGallery,
      testimonials: initTestimonials,
      messages: initMessages,
      newsletter: initNewsletter,
      reports: initReports,
      admins: initAdmins,
      settings: initSettings,
    };
    if (map[page]) map[page]();
  });

  function data() { return FGS.load(); }
  function save(d) { FGS.save(d); }
  function el(id) { return document.getElementById(id); }
  function val(form, name) {
    const f = form.elements[name];
    return f ? f.value : "";
  }
  function setVal(form, name, v) {
    const f = form.elements[name];
    if (f) f.value = v == null ? "" : v;
  }

  function openModal(title, bodyHtml, footerHtml) {
    el("entityModalTitle").textContent = title;
    el("entityModalBody").innerHTML = bodyHtml;
    el("entityModalFooter").innerHTML = footerHtml || "";
    return new bootstrap.Modal(el("entityModal"));
  }

  function actionBtn(label, cls, attrs) {
    return '<button type="button" class="btn-admin sm ' + (cls || "ghost") + '" ' + (attrs || "") + ">" + label + "</button>";
  }

  /* ---------- Website ---------- */
  function initWebsite() {
    const d = data();
    const form = el("websiteForm");
    const home = d.website.home;
    const about = d.website.about;
    const contact = d.website.contact;
    const seo = d.website.seo;
    const map = {
      heroHeading: home.heroHeading, heroDescription: home.heroDescription, heroImage: home.heroImage,
      welcomeHeading: home.welcomeHeading, welcomeDescription: home.welcomeDescription,
      whyChooseUs: home.whyChooseUs, promoHeading: home.promoHeading, promoDescription: home.promoDescription,
      ctaHeading: home.ctaHeading, ctaDescription: home.ctaDescription,
      featuredServices: (home.featuredServices || []).join(", "),
      introduction: about.introduction, story: about.story, mission: about.mission, vision: about.vision,
      values: about.values, aboutImage: about.image,
      businessName: contact.businessName, phone: contact.phone, email: contact.email, whatsapp: contact.whatsapp,
      address: contact.address, hours: contact.hours, mapsUrl: contact.mapsUrl, instagram: contact.instagram,
      facebook: contact.facebook, tiktok: contact.tiktok,
      seoTitle: seo.title, seoDescription: seo.description, keywords: seo.keywords,
      socialImage: seo.socialImage, favicon: seo.favicon,
    };
    Object.keys(map).forEach(function (k) { setVal(form, k, map[k]); });
    const heroPrev = el("heroPreview");
    if (home.heroImage) heroPrev.innerHTML = '<img src="' + home.heroImage + '" alt="">';
    const aboutPrev = el("aboutPreview");
    if (about.image) aboutPrev.innerHTML = '<img src="' + about.image + '" alt="">';
    AdminUI.bindImagePreview(el("heroImageFile"), heroPrev);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const cur = data();
      cur.website.home = {
        heroHeading: val(form, "heroHeading"), heroDescription: val(form, "heroDescription"),
        heroImage: (heroPrev && heroPrev.dataset.value) || val(form, "heroImage"),
        welcomeHeading: val(form, "welcomeHeading"), welcomeDescription: val(form, "welcomeDescription"),
        featuredServices: val(form, "featuredServices").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
        whyChooseUs: val(form, "whyChooseUs"), promoHeading: val(form, "promoHeading"),
        promoDescription: val(form, "promoDescription"), ctaHeading: val(form, "ctaHeading"),
        ctaDescription: val(form, "ctaDescription"),
      };
      cur.website.about = {
        introduction: val(form, "introduction"), story: val(form, "story"), mission: val(form, "mission"),
        vision: val(form, "vision"), values: val(form, "values"), image: val(form, "aboutImage"),
      };
      cur.website.contact = {
        businessName: val(form, "businessName"), phone: val(form, "phone"), email: val(form, "email"),
        whatsapp: val(form, "whatsapp"), address: val(form, "address"), hours: val(form, "hours"),
        mapsUrl: val(form, "mapsUrl"), instagram: val(form, "instagram"), facebook: val(form, "facebook"),
        tiktok: val(form, "tiktok"),
      };
      cur.website.seo = {
        title: val(form, "seoTitle"), description: val(form, "seoDescription"), keywords: val(form, "keywords"),
        socialImage: val(form, "socialImage"), favicon: val(form, "favicon"),
      };
      save(cur);
      AdminUI.toast("Website content saved (local demo)", "success");
    });
  }

  /* ---------- Generic table CRUD helpers ---------- */
  function setupCrud(cfg) {
    let state = { page: 1, perPage: cfg.perPage || 8, q: AdminUI.getQuery("q"), filters: {} };
    el("pageActions").innerHTML = cfg.addLabel
      ? '<button class="btn-admin" type="button" id="addBtn"><i class="bi bi-plus-lg"></i> ' + cfg.addLabel + "</button>"
      : "";
    if (cfg.filtersHtml) el("filters").innerHTML = cfg.filtersHtml;
    if (cfg.q && state.q) {
      const s = el("filters").querySelector("[data-filter=q]");
      if (s) s.value = state.q;
    }

    function filtered() {
      return cfg.filter(data()[cfg.key] || [], state);
    }

    function render() {
      const items = filtered();
      const p = AdminUI.paginate(items, state.page, state.perPage);
      state.page = p.page;
      el("tableHead").innerHTML = cfg.head;
      el("tableBody").innerHTML = p.items.map(cfg.row).join("") || '<tr><td colspan="12"><div class="empty-state"><i class="bi bi-inbox"></i><h3>No records</h3><p>No matching demonstration data.</p></div></td></tr>';
      AdminUI.renderPagination(el("pager"), p, function (n) { state.page = n; render(); });
      if (cfg.afterRender) cfg.afterRender(p.items);
      bindRowActions();
    }

    function bindRowActions() {
      AdminUI.qsa("[data-act]", el("tableBody")).forEach(function (btn) {
        btn.addEventListener("click", function () {
          const id = btn.getAttribute("data-id");
          const act = btn.getAttribute("data-act");
          const record = (data()[cfg.key] || []).find(function (r) { return String(r.id) === String(id); });
          if (!record) return;
          if (act === "view") cfg.view(record);
          if (act === "edit") cfg.edit(record, render);
          if (act === "delete") cfg.remove(record, render);
          if (cfg.customAct) cfg.customAct(act, record, render);
        });
      });
    }

    AdminUI.qsa("[data-filter]", el("filters")).forEach(function (input) {
      input.addEventListener("input", function () {
        state.filters[input.getAttribute("data-filter")] = input.value;
        if (input.getAttribute("data-filter") === "q") state.q = input.value;
        state.page = 1;
        render();
      });
      input.addEventListener("change", function () {
        state.filters[input.getAttribute("data-filter")] = input.value;
        state.page = 1;
        render();
      });
    });

    if (el("addBtn")) el("addBtn").addEventListener("click", function () { cfg.add(render); });
    render();
    return { render: render, state: state };
  }

  function field(label, name, value, type, opts) {
    type = type || "text";
    if (type === "textarea") {
      return '<div class="mb-3"><label class="form-label">' + label + '</label><textarea class="form-control" name="' + name + '" rows="3">' + (value || "") + "</textarea></div>";
    }
    if (type === "select") {
      return '<div class="mb-3"><label class="form-label">' + label + '</label><select class="form-select" name="' + name + '">' +
        (opts || []).map(function (o) {
          const v = typeof o === "string" ? o : o.v;
          const t = typeof o === "string" ? o : o.t;
          return '<option value="' + v + '"' + (String(value) === String(v) ? " selected" : "") + ">" + t + "</option>";
        }).join("") + "</select></div>";
    }
    if (type === "checkbox") {
      return '<div class="form-check mb-3"><input class="form-check-input" type="checkbox" name="' + name + '" id="' + name + '"' + (value ? " checked" : "") + '><label class="form-check-label" for="' + name + '">' + label + "</label></div>";
    }
    return '<div class="mb-3"><label class="form-label">' + label + '</label><input class="form-control" type="' + type + '" name="' + name + '" value="' + (value == null ? "" : String(value).replace(/"/g, "&quot;")) + '" /></div>';
  }

  function formValues(form) {
    const out = {};
    AdminUI.qsa("input,select,textarea", form).forEach(function (inp) {
      if (!inp.name) return;
      if (inp.type === "checkbox") out[inp.name] = inp.checked;
      else out[inp.name] = inp.value;
    });
    return out;
  }

  /* ---------- Bookings ---------- */
  function initBookings() {
    const services = data().services.map(function (s) { return s.name; });
    const therapists = data().therapists.map(function (t) { return t.name; });
    const statuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"];
    setupCrud({
      key: "bookings",
      addLabel: "Add booking",
      filtersHtml:
        '<input class="form-control" data-filter="q" placeholder="Search guest, ref, phone…" />' +
        '<input class="form-control" type="date" data-filter="date" />' +
        '<select class="form-select" data-filter="status"><option value="">All statuses</option>' + statuses.map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select>" +
        '<select class="form-select" data-filter="service"><option value="">All services</option>' + services.map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select>",
      head: "<tr><th>Ref</th><th>Customer</th><th>Phone</th><th>Service</th><th>Date</th><th>Time</th><th>Therapist</th><th>Guests</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.q || state.filters.q || "").toLowerCase();
        return rows.filter(function (b) {
          if (q && !(b.id + b.customer + b.phone + b.service).toLowerCase().includes(q)) return false;
          if (state.filters.date && b.date !== state.filters.date) return false;
          if (state.filters.status && b.status !== state.filters.status) return false;
          if (state.filters.service && b.service !== state.filters.service) return false;
          return true;
        });
      },
      row: function (b) {
        return "<tr><td>" + b.id + "</td><td>" + b.customer + "</td><td>" + b.phone + "</td><td>" + b.service + "</td><td>" + FGS.formatDate(b.date) + "</td><td>" + b.time + "</td><td>" + b.therapist + "</td><td>" + b.guests + "</td><td>" + AdminUI.badge(b.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + b.id + '"') +
          actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + b.id + '"') +
          actionBtn("Delete", "danger", 'data-act="delete" data-id="' + b.id + '"') +
          "</td></tr>";
      },
      view: function (b) {
        openModal("Booking " + b.id,
          "<p><strong>Customer:</strong> " + b.customer + "</p><p><strong>Phone:</strong> " + b.phone + "</p><p><strong>Service:</strong> " + b.service + "</p><p><strong>When:</strong> " + FGS.formatDate(b.date) + " at " + b.time + "</p><p><strong>Therapist:</strong> " + b.therapist + "</p><p><strong>Guests:</strong> " + b.guests + "</p><p><strong>Status:</strong> " + b.status + "</p><p><strong>Notes:</strong> " + (b.notes || "—") + "</p>",
          '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>'
        ).show();
      },
      edit: function (b, rerender) { bookingForm(b, rerender); },
      add: function (rerender) { bookingForm(null, rerender); },
      remove: async function (b, rerender) {
        const ok = await AdminUI.confirmModal({ title: "Delete booking", message: "Remove demonstration booking " + b.id + "?", okText: "Delete" });
        if (!ok) return;
        const d = data();
        d.bookings = d.bookings.filter(function (x) { return x.id !== b.id; });
        save(d);
        AdminUI.toast("Booking removed", "success");
        rerender();
      },
    });

    function bookingForm(b, rerender) {
      const isNew = !b;
      b = b || { id: FGS.uid("BK"), customer: "", phone: "", service: services[0], date: "", time: "10:00", therapist: therapists[0], guests: 1, status: "Pending", notes: "" };
      const body =
        '<form id="entityForm" class="row g-2">' +
        '<div class="col-md-6">' + field("Customer name", "customer", b.customer) + "</div>" +
        '<div class="col-md-6">' + field("Phone", "phone", b.phone) + "</div>" +
        '<div class="col-md-6">' + field("Service", "service", b.service, "select", services) + "</div>" +
        '<div class="col-md-6">' + field("Therapist", "therapist", b.therapist, "select", therapists) + "</div>" +
        '<div class="col-md-4">' + field("Date", "date", b.date, "date") + "</div>" +
        '<div class="col-md-4">' + field("Time", "time", b.time, "time") + "</div>" +
        '<div class="col-md-4">' + field("Guests", "guests", b.guests, "number") + "</div>" +
        '<div class="col-md-6">' + field("Status", "status", b.status, "select", statuses) + "</div>" +
        '<div class="col-12">' + field("Notes", "notes", b.notes, "textarea") + "</div></form>";
      const modal = openModal(isNew ? "Add booking" : "Edit booking", body,
        '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" type="button" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        if (!f.customer || !f.date) { AdminUI.toast("Customer and date are required", "error"); return; }
        const d = data();
        const row = Object.assign({}, b, f, { guests: Number(f.guests) || 1 });
        if (isNew) d.bookings.unshift(row);
        else d.bookings = d.bookings.map(function (x) { return x.id === b.id ? row : x; });
        save(d);
        modal.hide();
        AdminUI.toast("Booking saved", "success");
        rerender();
      };
    }
  }

  /* ---------- Calendar ---------- */
  function initCalendar() {
    let view = "month";
    let cursor = new Date(2026, 10, 10);
    el("pageActions").innerHTML = '<button class="btn-admin" type="button" id="addBtn"><i class="bi bi-plus-lg"></i> Add appointment</button>';

    function appointments() { return data().bookings || []; }

    function renderToolbar() {
      el("calToolbar").innerHTML =
        '<button class="btn-admin ghost sm" type="button" id="prev">Prev</button>' +
        '<button class="btn-admin ghost sm" type="button" id="today">Today</button>' +
        '<button class="btn-admin ghost sm" type="button" id="next">Next</button>' +
        "<strong style=\"margin:0 8px;color:var(--navy)\">" + cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric", day: view === "day" ? "numeric" : undefined }) + "</strong>" +
        '<button class="btn-admin sm ' + (view === "month" ? "" : "ghost") + '" data-view="month">Month</button>' +
        '<button class="btn-admin sm ' + (view === "week" ? "" : "ghost") + '" data-view="week">Week</button>' +
        '<button class="btn-admin sm ' + (view === "day" ? "" : "ghost") + '" data-view="day">Day</button>';
      el("prev").onclick = function () {
        if (view === "month") cursor.setMonth(cursor.getMonth() - 1);
        else cursor.setDate(cursor.getDate() - (view === "week" ? 7 : 1));
        paint();
      };
      el("next").onclick = function () {
        if (view === "month") cursor.setMonth(cursor.getMonth() + 1);
        else cursor.setDate(cursor.getDate() + (view === "week" ? 7 : 1));
        paint();
      };
      el("today").onclick = function () { cursor = new Date(2026, 10, 10); paint(); };
      AdminUI.qsa("[data-view]").forEach(function (b) {
        b.onclick = function () { view = b.getAttribute("data-view"); paint(); };
      });
    }

    function ymd(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    function paint() {
      renderToolbar();
      const root = el("calendarView");
      const list = appointments();
      if (view === "month") {
        const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const start = new Date(first);
        start.setDate(1 - ((first.getDay() + 6) % 7));
        let html = '<div class="calendar-grid">' + ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(function (d) { return '<div class="cal-dow">' + d + "</div>"; }).join("");
        for (let i = 0; i < 42; i++) {
          const day = new Date(start);
          day.setDate(start.getDate() + i);
          const key = ymd(day);
          const items = list.filter(function (b) { return b.date === key; });
          html += '<div class="cal-day' + (day.getMonth() !== cursor.getMonth() ? " muted" : "") + (key === "2026-11-10" ? " today" : "") + '" data-day="' + key + '"><div class="num">' + day.getDate() + "</div>" +
            items.slice(0, 3).map(function (b) {
              return '<div class="cal-event ' + AdminUI.statusClass(b.status) + '" data-id="' + b.id + '">' + b.time + " " + b.customer + "</div>";
            }).join("") + "</div>";
        }
        html += "</div>";
        root.innerHTML = html;
      } else if (view === "week") {
        const mon = new Date(cursor);
        mon.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));
        root.innerHTML = '<div class="week-grid">' + Array.from({ length: 7 }, function (_, i) {
          const day = new Date(mon); day.setDate(mon.getDate() + i);
          const key = ymd(day);
          const items = list.filter(function (b) { return b.date === key; });
          return '<div class="panel" style="margin:0"><strong>' + day.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + "</strong>" +
            items.map(function (b) { return '<div class="cal-event ' + AdminUI.statusClass(b.status) + '" data-id="' + b.id + '" style="margin-top:8px">' + b.time + " · " + b.service + " · " + b.therapist + "</div>"; }).join("") +
            (items.length ? "" : '<p class="form-hint mt-2">No appointments</p>') + "</div>";
        }).join("") + "</div>";
      } else {
        const key = ymd(cursor);
        const items = list.filter(function (b) { return b.date === key; }).sort(function (a, b) { return a.time.localeCompare(b.time); });
        root.innerHTML = '<div class="day-schedule">' + (items.map(function (b) {
          return '<div class="schedule-row" data-id="' + b.id + '"><div><strong>' + b.time + "</strong></div><div><strong style=\"color:var(--navy)\">" + b.customer + "</strong><div>" + b.service + " · " + b.therapist + "</div>" + AdminUI.badge(b.status) + "</div></div>";
        }).join("") || '<div class="empty-state"><i class="bi bi-calendar-x"></i><h3>Free day</h3><p>No sample appointments.</p></div>') + "</div>";
      }
      AdminUI.qsa("[data-id]", root).forEach(function (node) {
        node.addEventListener("click", function (e) {
          e.stopPropagation();
          const b = appointments().find(function (x) { return x.id === node.getAttribute("data-id"); });
          if (!b) return;
          openModal(b.id, "<p>" + b.customer + " · " + b.service + "</p><p>" + FGS.formatDate(b.date) + " at " + b.time + "</p><p>" + b.therapist + "</p>" + AdminUI.badge(b.status),
            '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button><button class="btn-admin" id="editAppt">Edit</button>').show();
          el("editAppt").onclick = function () {
            bootstrap.Modal.getInstance(el("entityModal")).hide();
            document.getElementById("addBtn").click();
            setTimeout(function () {
              // reopen via bookings-like quick edit
              quickEditBooking(b);
            }, 300);
          };
        });
      });
    }

    function quickEditBooking(b) {
      const therapists = data().therapists.map(function (t) { return t.name; });
      const services = data().services.map(function (s) { return s.name; });
      const body = '<form id="entityForm">' + field("Customer", "customer", b.customer) + field("Service", "service", b.service, "select", services) + field("Therapist", "therapist", b.therapist, "select", therapists) + field("Date", "date", b.date, "date") + field("Time", "time", b.time, "time") + field("Status", "status", b.status, "select", ["Pending","Confirmed","Completed","Cancelled","Rejected"]) + "</form>";
      const modal = openModal("Edit appointment", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const d = data();
        d.bookings = d.bookings.map(function (x) { return x.id === b.id ? Object.assign({}, x, f) : x; });
        save(d); modal.hide(); AdminUI.toast("Appointment updated", "success"); paint();
      };
    }

    el("addBtn").onclick = function () {
      const therapists = data().therapists.map(function (t) { return t.name; });
      const services = data().services.map(function (s) { return s.name; });
      const body = '<form id="entityForm">' + field("Customer", "customer", "") + field("Phone", "phone", "") + field("Service", "service", services[0], "select", services) + field("Therapist", "therapist", therapists[0], "select", therapists) + field("Date", "date", ymd(cursor), "date") + field("Time", "time", "11:00", "time") + field("Guests", "guests", 1, "number") + field("Status", "status", "Pending", "select", ["Pending","Confirmed","Completed","Cancelled","Rejected"]) + "</form>";
      const modal = openModal("Add appointment", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        if (!f.customer) { AdminUI.toast("Customer required", "error"); return; }
        const d = data();
        d.bookings.unshift(Object.assign({ id: FGS.uid("BK"), notes: "" }, f, { guests: Number(f.guests) || 1 }));
        save(d); modal.hide(); AdminUI.toast("Appointment added", "success"); paint();
      };
    };
    paint();
  }

  /* ---------- Services ---------- */
  function initServices() {
    setupCrud({
      key: "services",
      addLabel: "Add service",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search services…" /><select class="form-select" data-filter="category"><option value="">All categories</option><option>Massage</option><option>Body</option><option>Facial</option></select><select class="form-select" data-filter="status"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>',
      head: "<tr><th>Image</th><th>Name</th><th>Category</th><th>Duration</th><th>Price</th><th>Featured</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (s) {
          if (q && !s.name.toLowerCase().includes(q)) return false;
          if (state.filters.category && s.category !== state.filters.category) return false;
          if (state.filters.status && s.status !== state.filters.status) return false;
          return true;
        });
      },
      row: function (s) {
        return '<tr><td><img class="thumb" src="' + s.image + '" alt=""></td><td><strong style="color:var(--navy)">' + s.name + "</strong></td><td>" + s.category + "</td><td>" + s.duration + "</td><td>" + FGS.formatNaira(s.price) + "</td><td>" + (s.featured ? "Yes" : "No") + "</td><td>" + AdminUI.badge(s.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + s.id + '"') +
          actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + s.id + '"') +
          actionBtn("Delete", "danger", 'data-act="delete" data-id="' + s.id + '"') + "</td></tr>";
      },
      view: function (s) {
        openModal(s.name, '<img class="thumb wide mb-3" src="' + s.image + '" alt=""><p>' + s.description + "</p><p>" + s.category + " · " + s.duration + " · " + FGS.formatNaira(s.price) + "</p>", '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show();
      },
      edit: function (s, r) { serviceForm(s, r); },
      add: function (r) { serviceForm(null, r); },
      remove: async function (s, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete service", message: "Remove " + s.name + " from the demo menu?" }))) return;
        const d = data(); d.services = d.services.filter(function (x) { return x.id !== s.id; }); save(d); AdminUI.toast("Service deleted", "success"); r();
      },
    });
    function serviceForm(s, rerender) {
      const isNew = !s;
      s = s || { id: FGS.uid("svc"), name: "", category: "Massage", duration: "60 min", price: 0, status: "active", featured: false, image: FGS.img.massage, description: "" };
      const body = '<form id="entityForm">' + field("Name", "name", s.name) + field("Category", "category", s.category, "select", ["Massage","Body","Facial"]) + field("Description", "description", s.description, "textarea") + field("Duration", "duration", s.duration) + field("Price (₦)", "price", s.price, "number") + field("Image URL", "image", s.image) + '<div class="mb-3"><label class="form-label">Upload preview</label><input type="file" id="imgFile" accept="image/*" class="form-control"><div class="preview-box mt-2" id="imgPrev">' + (s.image ? '<img src="' + s.image + '" alt="">' : "") + "</div></div>" + field("Featured", "featured", s.featured, "checkbox") + field("Active", "active", s.status === "active", "checkbox") + "</form>";
      const modal = openModal(isNew ? "Add service" : "Edit service", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      AdminUI.bindImagePreview(el("imgFile"), el("imgPrev"));
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        if (!f.name) { AdminUI.toast("Name required", "error"); return; }
        const row = {
          id: s.id, name: f.name, category: f.category, description: f.description, duration: f.duration,
          price: Number(f.price) || 0, image: (el("imgPrev").dataset.value) || f.image || s.image,
          featured: !!f.featured, status: f.active ? "active" : "inactive",
        };
        const d = data();
        if (isNew) d.services.push(row); else d.services = d.services.map(function (x) { return x.id === s.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Service saved", "success"); rerender();
      };
    }
  }

  /* ---------- Packages ---------- */
  function initPackages() {
    setupCrud({
      key: "packages", addLabel: "Add package",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search packages…" />',
      head: "<tr><th>Image</th><th>Name</th><th>Duration</th><th>Price</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (p) { return !q || p.name.toLowerCase().includes(q); });
      },
      row: function (p) {
        return '<tr><td><img class="thumb" src="' + p.image + '" alt=""></td><td><strong style="color:var(--navy)">' + p.name + "</strong><div style=\"font-size:12px\">" + p.description + "</div></td><td>" + p.duration + "</td><td>" + FGS.formatNaira(p.price) + "</td><td>" + AdminUI.badge(p.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + p.id + '"') + actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + p.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + p.id + '"') + "</td></tr>";
      },
      view: function (p) {
        openModal(p.name, "<p>" + p.description + "</p><ul>" + (p.treatments || []).map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul><p>" + p.duration + " · " + FGS.formatNaira(p.price) + "</p>", '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show();
      },
      edit: function (p, r) { packageForm(p, r); },
      add: function (r) { packageForm(null, r); },
      remove: async function (p, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete package", message: "Remove " + p.name + "?" }))) return;
        const d = data(); d.packages = d.packages.filter(function (x) { return x.id !== p.id; }); save(d); AdminUI.toast("Package deleted", "success"); r();
      },
    });
    function packageForm(p, rerender) {
      const isNew = !p;
      p = p || { id: FGS.uid("pkg"), name: "", description: "", treatments: [], duration: "", price: 0, status: "active", image: FGS.img.lounge };
      const body = '<form id="entityForm">' + field("Name", "name", p.name) + field("Description", "description", p.description, "textarea") + field("Included treatments (one per line)", "treatments", (p.treatments || []).join("\n"), "textarea") + field("Duration", "duration", p.duration) + field("Price (₦)", "price", p.price, "number") + field("Image URL", "image", p.image) + field("Status", "status", p.status, "select", ["active","inactive"]) + "</form>";
      const modal = openModal(isNew ? "Add package" : "Edit package", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const row = { id: p.id, name: f.name, description: f.description, treatments: f.treatments.split("\n").map(function (t) { return t.trim(); }).filter(Boolean), duration: f.duration, price: Number(f.price) || 0, image: f.image, status: f.status };
        const d = data();
        if (isNew) d.packages.push(row); else d.packages = d.packages.map(function (x) { return x.id === p.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Package saved", "success"); rerender();
      };
    }
  }

  /* ---------- Customers ---------- */
  function initCustomers() {
    setupCrud({
      key: "customers", addLabel: "Add customer",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search customers…" /><select class="form-select" data-filter="status"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>',
      head: "<tr><th>Guest</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Last visit</th><th>Registered</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (c) {
          if (q && !(c.name + c.email + c.phone).toLowerCase().includes(q)) return false;
          if (state.filters.status && c.status !== state.filters.status) return false;
          return true;
        });
      },
      row: function (c) {
        return '<tr><td><div class="person-cell"><img class="avatar" src="' + c.image + '" alt=""><div><strong>' + c.name + "</strong></div></div></td><td>" + c.email + "</td><td>" + c.phone + "</td><td>" + c.bookings + "</td><td>" + FGS.formatDate(c.lastAppointment) + "</td><td>" + FGS.formatDate(c.registered) + "</td><td>" + AdminUI.badge(c.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + c.id + '"') + actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + c.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + c.id + '"') + "</td></tr>";
      },
      view: function (c) {
        const history = (data().bookings || []).filter(function (b) { return b.customer === c.name; });
        openModal(c.name, '<div class="person-cell mb-3"><img class="avatar lg" src="' + c.image + '" alt=""><div><strong>' + c.email + "</strong><div>" + c.phone + "</div></div></div><p><strong>Notes:</strong> " + (c.notes || "—") + '</p><h3 style="font-size:1.2rem;margin:16px 0 8px">Booking history</h3>' + (history.map(function (b) { return "<div>" + b.id + " · " + b.service + " · " + FGS.formatDate(b.date) + " · " + b.status + "</div>"; }).join("") || "<p class=\"form-hint\">No bookings</p>"),
          '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show();
      },
      edit: function (c, r) { customerForm(c, r); },
      add: function (r) { customerForm(null, r); },
      remove: async function (c, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete customer", message: "Remove " + c.name + "?" }))) return;
        const d = data(); d.customers = d.customers.filter(function (x) { return x.id !== c.id; }); save(d); AdminUI.toast("Customer deleted", "success"); r();
      },
    });
    function customerForm(c, rerender) {
      const isNew = !c;
      c = c || { id: FGS.uid("cu"), name: "", email: "", phone: "", bookings: 0, lastAppointment: "", registered: new Date().toISOString().slice(0, 10), status: "active", image: FGS.img.avatar, notes: "" };
      const body = '<form id="entityForm">' + field("Full name", "name", c.name) + field("Email", "email", c.email, "email") + field("Phone", "phone", c.phone) + field("Status", "status", c.status, "select", ["active","inactive"]) + field("Notes", "notes", c.notes, "textarea") + field("Image URL", "image", c.image) + "</form>";
      const modal = openModal(isNew ? "Add customer" : "Edit customer", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const row = Object.assign({}, c, f);
        const d = data();
        if (isNew) d.customers.push(row); else d.customers = d.customers.map(function (x) { return x.id === c.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Customer saved", "success"); rerender();
      };
    }
  }

  /* ---------- Therapists ---------- */
  function initTherapists() {
    let cardMode = false;
    el("viewToggle").innerHTML = '<button class="btn-admin ghost sm" type="button" id="toggleView">Toggle cards / table</button>';
    const api = setupCrud({
      key: "therapists", addLabel: "Add therapist",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search staff…" /><select class="form-select" data-filter="status"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>',
      head: "<tr><th>Staff</th><th>Title</th><th>Contact</th><th>Services</th><th>Schedule</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (t) {
          if (q && !(t.name + t.title).toLowerCase().includes(q)) return false;
          if (state.filters.status && t.status !== state.filters.status) return false;
          return true;
        });
      },
      row: function (t) {
        return '<tr><td><div class="person-cell"><img class="avatar" src="' + t.image + '" alt=""><strong>' + t.name + '</strong></div></td><td>' + t.title + "</td><td>" + t.email + "<br>" + t.phone + "</td><td>" + (t.services || []).join(", ") + "</td><td>" + (t.days || []).join(", ") + "<br>" + t.hours + "</td><td>" + AdminUI.badge(t.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + t.id + '"') + actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + t.id + '"') + actionBtn(t.status === "active" ? "Deactivate" : "Activate", "ghost", 'data-act="toggle" data-id="' + t.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + t.id + '"') + "</td></tr>";
      },
      afterRender: function (items) {
        const grid = el("cardGrid");
        if (!cardMode) { grid.style.display = "none"; el("dataTable").parentElement.style.display = ""; return; }
        el("dataTable").parentElement.style.display = "none";
        grid.style.display = "grid";
        grid.innerHTML = items.map(function (t) {
          return '<div class="media-card"><div class="media"><img src="' + t.image + '" alt=""></div><div class="body"><h3>' + t.name + "</h3><p>" + t.title + "</p>" + AdminUI.badge(t.status) + '<div class="actions mt-3">' + actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + t.id + '"') + "</div></div></div>";
        }).join("");
        AdminUI.qsa("[data-act]", grid).forEach(function (btn) {
          btn.addEventListener("click", function () {
            const t = data().therapists.find(function (x) { return x.id === btn.getAttribute("data-id"); });
            if (t) therapistForm(t, api.render);
          });
        });
      },
      customAct: function (act, t, r) {
        if (act !== "toggle") return;
        const d = data();
        d.therapists = d.therapists.map(function (x) { return x.id === t.id ? Object.assign({}, x, { status: x.status === "active" ? "inactive" : "active" }) : x; });
        save(d); AdminUI.toast("Therapist status updated", "success"); r();
      },
      view: function (t) {
        openModal(t.name, '<img class="avatar lg mb-3" src="' + t.image + '" alt=""><p>' + t.title + "</p><p>" + t.email + " · " + t.phone + "</p><p>" + (t.services || []).join(", ") + "</p><p>" + (t.days || []).join(", ") + " · " + t.hours + "</p>", '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show();
      },
      edit: function (t, r) { therapistForm(t, r); },
      add: function (r) { therapistForm(null, r); },
      remove: async function (t, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete therapist", message: "Remove " + t.name + "?" }))) return;
        const d = data(); d.therapists = d.therapists.filter(function (x) { return x.id !== t.id; }); save(d); AdminUI.toast("Deleted", "success"); r();
      },
    });
    el("toggleView").onclick = function () { cardMode = !cardMode; api.render(); };
    function therapistForm(t, rerender) {
      const isNew = !t;
      t = t || { id: FGS.uid("th"), name: "", title: "", email: "", phone: "", services: [], days: [], hours: "10:00 – 18:00", status: "active", image: FGS.img.staff1 };
      const body = '<form id="entityForm">' + field("Full name", "name", t.name) + field("Job title", "title", t.title) + field("Email", "email", t.email, "email") + field("Phone", "phone", t.phone) + field("Assigned services (comma-separated)", "services", (t.services || []).join(", ")) + field("Working days (comma-separated)", "days", (t.days || []).join(", ")) + field("Working hours", "hours", t.hours) + field("Status", "status", t.status, "select", ["active","inactive"]) + field("Photo URL", "image", t.image) + "</form>";
      const modal = openModal(isNew ? "Add therapist" : "Edit therapist", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const row = Object.assign({}, t, f, {
          services: f.services.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          days: f.days.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
        });
        const d = data();
        if (isNew) d.therapists.push(row); else d.therapists = d.therapists.map(function (x) { return x.id === t.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Therapist saved", "success"); rerender();
      };
    }
  }

  /* ---------- Gallery ---------- */
  function initGallery() {
    setupCrud({
      key: "gallery", addLabel: "Upload image",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search titles…" /><select class="form-select" data-filter="category"><option value="">All categories</option><option>Spa Interior</option><option>Massage Rooms</option><option>Treatment Experiences</option><option>Relaxation Spaces</option></select>',
      head: "<tr><th>Preview</th><th>Title</th><th>Category</th><th>Uploaded</th><th>Visibility</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (g) {
          if (q && !g.title.toLowerCase().includes(q)) return false;
          if (state.filters.category && g.category !== state.filters.category) return false;
          return true;
        });
      },
      row: function (g) {
        return '<tr><td><img class="thumb" src="' + g.image + '" alt=""></td><td>' + g.title + "</td><td>" + g.category + "</td><td>" + FGS.formatDate(g.date) + "</td><td>" + AdminUI.badge(g.visible ? "active" : "inactive") + '</td><td class="actions">' +
          actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + g.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + g.id + '"') + "</td></tr>";
      },
      view: function () {},
      edit: function (g, r) { galleryForm(g, r); },
      add: function (r) { galleryForm(null, r); },
      remove: async function (g, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete image", message: "Remove " + g.title + "?" }))) return;
        const d = data(); d.gallery = d.gallery.filter(function (x) { return x.id !== g.id; }); save(d); AdminUI.toast("Image deleted", "success"); r();
      },
    });
    function galleryForm(g, rerender) {
      const isNew = !g;
      g = g || { id: FGS.uid("g"), title: "", category: "Spa Interior", date: new Date().toISOString().slice(0, 10), visible: true, image: FGS.img.lounge };
      const body = '<form id="entityForm">' + field("Title", "title", g.title) + field("Category", "category", g.category, "select", ["Spa Interior","Massage Rooms","Treatment Experiences","Relaxation Spaces"]) + field("Visible", "visible", g.visible, "checkbox") + field("Image URL", "image", g.image) + '<div class="mb-3"><label class="form-label">Upload</label><input type="file" id="imgFile" accept="image/*" class="form-control"><div class="preview-box mt-2" id="imgPrev">' + (g.image ? '<img src="' + g.image + '" alt="">' : "") + "</div></div></form>";
      const modal = openModal(isNew ? "Upload image" : "Edit image", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show(); AdminUI.bindImagePreview(el("imgFile"), el("imgPrev"));
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const row = { id: g.id, title: f.title, category: f.category, date: g.date, visible: !!f.visible, image: el("imgPrev").dataset.value || f.image };
        const d = data();
        if (isNew) d.gallery.unshift(row); else d.gallery = d.gallery.map(function (x) { return x.id === g.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Gallery item saved", "success"); rerender();
      };
    }
  }

  /* ---------- Testimonials ---------- */
  function initTestimonials() {
    setupCrud({
      key: "testimonials", addLabel: "Add testimonial",
      filtersHtml: '<select class="form-select" data-filter="status"><option value="">All statuses</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option></select>',
      head: "<tr><th>Guest</th><th>Quote</th><th>Rating</th><th>Date</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        return rows.filter(function (t) { return !state.filters.status || t.status === state.filters.status; });
      },
      row: function (t) {
        return '<tr><td><div class="person-cell"><img class="avatar" src="' + t.image + '" alt=""><strong>' + t.name + '</strong></div></td><td>' + t.text.slice(0, 80) + "…</td><td>" + "★".repeat(t.rating) + "</td><td>" + FGS.formatDate(t.date) + "</td><td>" + AdminUI.badge(t.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + t.id + '"') + actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + t.id + '"') + actionBtn("Approve", "ghost", 'data-act="approve" data-id="' + t.id + '"') + actionBtn("Reject", "ghost", 'data-act="reject" data-id="' + t.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + t.id + '"') + "</td></tr>";
      },
      customAct: function (act, t, r) {
        if (act !== "approve" && act !== "reject") return;
        const d = data();
        d.testimonials = d.testimonials.map(function (x) { return x.id === t.id ? Object.assign({}, x, { status: act === "approve" ? "approved" : "rejected" }) : x; });
        save(d); AdminUI.toast("Testimonial " + act + "d", "success"); r();
      },
      view: function (t) { openModal(t.name, "<p>" + t.text + "</p><p>Rating: " + t.rating + "/5</p>" + AdminUI.badge(t.status), '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show(); },
      edit: function (t, r) { testimonialForm(t, r); },
      add: function (r) { testimonialForm(null, r); },
      remove: async function (t, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete testimonial", message: "Remove this demo review?" }))) return;
        const d = data(); d.testimonials = d.testimonials.filter(function (x) { return x.id !== t.id; }); save(d); AdminUI.toast("Deleted", "success"); r();
      },
    });
    function testimonialForm(t, rerender) {
      const isNew = !t;
      t = t || { id: FGS.uid("t"), name: "", text: "", rating: 5, image: FGS.img.avatar, status: "pending", date: new Date().toISOString().slice(0, 10) };
      const body = '<form id="entityForm">' + field("Display name", "name", t.name) + field("Testimonial", "text", t.text, "textarea") + field("Rating", "rating", t.rating, "number") + field("Image URL", "image", t.image) + field("Status", "status", t.status, "select", ["pending","approved","rejected"]) + "</form>";
      const modal = openModal(isNew ? "Add testimonial" : "Edit testimonial", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const row = Object.assign({}, t, f, { rating: Number(f.rating) || 5 });
        const d = data();
        if (isNew) d.testimonials.unshift(row); else d.testimonials = d.testimonials.map(function (x) { return x.id === t.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Saved", "success"); rerender();
      };
    }
  }

  /* ---------- Messages ---------- */
  function initMessages() {
    setupCrud({
      key: "messages", addLabel: "",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search messages…" /><select class="form-select" data-filter="read"><option value="">All</option><option value="unread">Unread</option><option value="read">Read</option></select>',
      head: "<tr><th>From</th><th>Subject</th><th>Preview</th><th>Date</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (m) {
          if (q && !(m.name + m.email + m.subject + m.message).toLowerCase().includes(q)) return false;
          if (state.filters.read === "unread" && m.read) return false;
          if (state.filters.read === "read" && !m.read) return false;
          return true;
        });
      },
      row: function (m) {
        return "<tr><td><strong style=\"color:var(--navy)\">" + m.name + "</strong><div style=\"font-size:12px\">" + m.email + "</div></td><td>" + m.subject + "</td><td>" + m.message.slice(0, 60) + "…</td><td>" + FGS.formatDate(m.date) + "</td><td>" + AdminUI.badge(m.read ? "read" : "unread") + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + m.id + '"') + actionBtn(m.read ? "Unread" : "Read", "ghost", 'data-act="toggle" data-id="' + m.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + m.id + '"') + "</td></tr>";
      },
      customAct: function (act, m, r) {
        if (act !== "toggle") return;
        const d = data();
        d.messages = d.messages.map(function (x) { return x.id === m.id ? Object.assign({}, x, { read: !x.read }) : x; });
        save(d); r();
      },
      view: function (m) {
        const d = data();
        d.messages = d.messages.map(function (x) { return x.id === m.id ? Object.assign({}, x, { read: true }) : x; });
        save(d);
        openModal(m.subject, "<p><strong>" + m.name + "</strong> · " + m.email + "</p><p>" + m.message + "</p>", '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show();
      },
      edit: function () {},
      add: function () {},
      remove: async function (m, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete message", message: "Remove this enquiry?" }))) return;
        const d = data(); d.messages = d.messages.filter(function (x) { return x.id !== m.id; }); save(d); AdminUI.toast("Message deleted", "success"); r();
      },
    });
  }

  /* ---------- Newsletter ---------- */
  function initNewsletter() {
    el("pageActions").innerHTML = '<button class="btn-admin ghost" type="button" id="exportBtn">Export CSV</button>';
    const api = setupCrud({
      key: "newsletter",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search email…" /><select class="form-select" data-filter="status"><option value="">All statuses</option><option value="active">Active</option><option value="unsubscribed">Unsubscribed</option></select>',
      head: "<tr><th>Email</th><th>Subscribed</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (n) {
          if (q && !n.email.toLowerCase().includes(q)) return false;
          if (state.filters.status && n.status !== state.filters.status) return false;
          return true;
        });
      },
      row: function (n) {
        return "<tr><td>" + n.email + "</td><td>" + FGS.formatDate(n.date) + "</td><td>" + AdminUI.badge(n.status) + '</td><td class="actions">' + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + n.id + '"') + "</td></tr>";
      },
      view: function () {}, edit: function () {}, add: function () {},
      remove: async function (n, r) {
        if (!(await AdminUI.confirmModal({ title: "Delete subscriber", message: "Remove " + n.email + "?" }))) return;
        const d = data(); d.newsletter = d.newsletter.filter(function (x) { return x.id !== n.id; }); save(d); AdminUI.toast("Subscriber removed", "success"); r();
      },
    });
    el("exportBtn").onclick = function () {
      AdminUI.exportCsv("newsletter-demo.csv", data().newsletter.map(function (n) { return { email: n.email, date: n.date, status: n.status }; }));
    };
  }

  /* ---------- Reports ---------- */
  function initReports() {
    const d = data();
    const bookings = d.bookings || [];
    el("filters").innerHTML = '<select class="form-select" id="range"><option value="monthly">Monthly report</option><option value="weekly">Weekly report</option><option value="yearly">Yearly report</option></select><input class="form-control" type="date" id="fromDate" /><input class="form-control" type="date" id="toDate" />';
    const completed = bookings.filter(function (b) { return b.status === "Completed"; }).length;
    const cancelled = bookings.filter(function (b) { return b.status === "Cancelled"; }).length;
    el("statGrid").innerHTML = [
      ["Total bookings", bookings.length, "Sample records"],
      ["Monthly revenue", FGS.formatNaira(2485000), "Demonstration figure"],
      ["Completion rate", Math.round((completed / Math.max(bookings.length, 1)) * 100) + "%", "Completed / total"],
      ["Cancelled", cancelled, "Sample cancellations"],
    ].map(function (c) {
      return '<div class="stat-card"><div class="label">' + c[0] + '</div><div class="value">' + c[1] + '</div><div class="hint">' + c[2] + "</div></div>";
    }).join("");

    el("tableHead").innerHTML = "<tr><th>Metric</th><th>Value</th><th>Notes</th></tr>";
    const rows = [
      { Metric: "Most popular service", Value: "Swedish Massage", Notes: "From sample bookings" },
      { Metric: "Most popular package", Value: "Together Experience", Notes: "Demonstration" },
      { Metric: "Customer growth", Value: "+12%", Notes: "Sample MoM" },
      { Metric: "Active therapists", Value: String(d.therapists.filter(function (t) { return t.status === "active"; }).length), Notes: "Current demo staff" },
    ];
    el("tableBody").innerHTML = rows.map(function (r) { return "<tr><td>" + r.Metric + "</td><td>" + r.Value + "</td><td>" + r.Notes + "</td></tr>"; }).join("");
    el("exportReport").onclick = function () { AdminUI.exportCsv("spa-report-demo.csv", rows); };

    if (window.Chart) {
      new Chart(el("trendChart"), {
        type: "line",
        data: { labels: ["Week 1","Week 2","Week 3","Week 4"], datasets: [{ label: "Bookings", data: [12, 16, 14, 19], borderColor: "#0b1e3d", tension: .3 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
      new Chart(el("serviceChart"), {
        type: "doughnut",
        data: { labels: ["Swedish","Deep Tissue","Aroma","Hot Stone","Other"], datasets: [{ data: [8, 5, 4, 3, 2], backgroundColor: ["#0b1e3d","#1e3657","#a8842c","#c9a55b","#d9d1c0"] }] },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }
  }

  /* ---------- Admins ---------- */
  function initAdmins() {
    setupCrud({
      key: "admins", addLabel: "Add admin",
      filtersHtml: '<input class="form-control" data-filter="q" placeholder="Search admins…" />',
      head: "<tr><th>Admin</th><th>Email</th><th>Role</th><th>Last login</th><th>Status</th><th>Actions</th></tr>",
      filter: function (rows, state) {
        const q = (state.filters.q || "").toLowerCase();
        return rows.filter(function (a) { return !q || (a.name + a.email + a.role).toLowerCase().includes(q); });
      },
      row: function (a) {
        return '<tr><td><div class="person-cell"><img class="avatar" src="' + a.image + '" alt=""><strong>' + a.name + '</strong></div></td><td>' + a.email + "</td><td>" + a.role + "</td><td>" + a.lastLogin + "</td><td>" + AdminUI.badge(a.status) + '</td><td class="actions">' +
          actionBtn("View", "ghost", 'data-act="view" data-id="' + a.id + '"') + actionBtn("Edit", "ghost", 'data-act="edit" data-id="' + a.id + '"') + actionBtn("Delete", "danger", 'data-act="delete" data-id="' + a.id + '"') + "</td></tr>";
      },
      view: function (a) { openModal(a.name, "<p>" + a.email + "</p><p>Role: " + a.role + "</p><p>Last login: " + a.lastLogin + "</p>", '<button class="btn-admin ghost" data-bs-dismiss="modal">Close</button>').show(); },
      edit: function (a, r) { adminForm(a, r); },
      add: function (r) { adminForm(null, r); },
      remove: async function (a, r) {
        if (a.role === "Super Admin") { AdminUI.toast("Cannot delete Super Admin in demo", "error"); return; }
        if (!(await AdminUI.confirmModal({ title: "Delete admin", message: "Remove " + a.name + "?" }))) return;
        const d = data(); d.admins = d.admins.filter(function (x) { return x.id !== a.id; }); save(d); AdminUI.toast("Admin deleted", "success"); r();
      },
    });
    const perms = data().permissions;
    const sections = perms["Super Admin"];
    let matrix = '<table class="perm-matrix"><thead><tr><th>Section</th><th>Super Admin</th><th>Manager</th><th>Receptionist</th></tr></thead><tbody>';
    sections.forEach(function (sec) {
      matrix += "<tr><td>" + sec + "</td>" + ["Super Admin","Manager","Receptionist"].map(function (role) {
        const ok = (perms[role] || []).includes(sec);
        return '<td class="' + (ok ? "yes" : "no") + '">' + (ok ? "✓" : "—") + "</td>";
      }).join("") + "</tr>";
    });
    matrix += "</tbody></table>";
    el("permMatrix").innerHTML = matrix;

    function adminForm(a, rerender) {
      const isNew = !a;
      a = a || { id: FGS.uid("a"), name: "", email: "", role: "Receptionist", lastLogin: "—", status: "active", image: FGS.img.admin };
      const body = '<form id="entityForm">' + field("Name", "name", a.name) + field("Email", "email", a.email, "email") + field("Role", "role", a.role, "select", ["Super Admin","Manager","Receptionist"]) + field("Status", "status", a.status, "select", ["active","inactive"]) + field("Image URL", "image", a.image) + "</form>";
      const modal = openModal(isNew ? "Add admin" : "Edit admin", body, '<button class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button><button class="btn-admin" id="saveEntity">Save</button>');
      modal.show();
      el("saveEntity").onclick = function () {
        const f = formValues(el("entityForm"));
        const row = Object.assign({}, a, f);
        const d = data();
        if (isNew) d.admins.push(row); else d.admins = d.admins.map(function (x) { return x.id === a.id ? row : x; });
        save(d); modal.hide(); AdminUI.toast("Admin saved", "success"); rerender();
        location.reload();
      };
    }
  }

  /* ---------- Settings ---------- */
  function initSettings() {
    const d = data();
    const s = d.settings;
    el("generalFields").innerHTML = field("Business name", "businessName", s.general.businessName) + field("Currency", "currency", s.general.currency) + field("Timezone", "timezone", s.general.timezone) + field("Logo URL", "logo", s.general.logo) + field("Favicon URL", "favicon", s.general.favicon);
    el("bookingFields").innerHTML = field("Appointment durations", "durations", s.booking.durations) + field("Time slots", "slots", s.booking.slots) + field("Advance booking days", "advanceDays", s.booking.advanceDays, "number") + field("Cancellation policy", "cancellation", s.booking.cancellation, "textarea");
    el("notifyFields").innerHTML = field("Email notifications", "email", s.notifications.email, "checkbox") + field("Booking alerts", "bookingAlerts", s.notifications.bookingAlerts, "checkbox") + field("Enquiry alerts", "enquiryAlerts", s.notifications.enquiryAlerts, "checkbox");
    el("appearFields").innerHTML = field("Navy", "brandNavy", s.appearance.brandNavy, "color") + field("Gold", "brandGold", s.appearance.brandGold, "color") + field("Cream", "brandCream", s.appearance.brandCream, "color");
    el("profileFields").innerHTML = field("Admin name", "profileName", s.profile.name) + field("Email", "profileEmail", s.profile.email, "email") + field("Photo URL", "profileImage", s.profile.image) + field("New password (demo only)", "password", "", "password");

    // wrap inputs into form named fields by moving into settingsForm — already inside
    // rename for formValues: inject name attributes already via field()

    el("settingsForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const f = formValues(el("settingsForm"));
      const cur = data();
      cur.settings.general = { businessName: f.businessName, currency: f.currency, timezone: f.timezone, logo: f.logo, favicon: f.favicon };
      cur.settings.booking = { durations: f.durations, slots: f.slots, advanceDays: Number(f.advanceDays) || 30, cancellation: f.cancellation };
      cur.settings.notifications = { email: !!f.email, bookingAlerts: !!f.bookingAlerts, enquiryAlerts: !!f.enquiryAlerts };
      cur.settings.appearance = { brandNavy: f.brandNavy, brandGold: f.brandGold, brandCream: f.brandCream, sidebarCollapsed: false };
      cur.settings.profile = { name: f.profileName, email: f.profileEmail, image: f.profileImage, password: f.password || "" };
      const session = FGS.getSession();
      if (session) FGS.setSession(Object.assign({}, session, { name: f.profileName, email: f.profileEmail, image: f.profileImage }));
      save(cur);
      AdminUI.toast("Settings saved (local demo)", "success");
    });

    el("resetDemo").onclick = async function () {
      const ok = await AdminUI.confirmModal({ title: "Reset demo data", message: "This clears localStorage and restores sample seed data.", okText: "Reset" });
      if (!ok) return;
      FGS.reset();
      AdminUI.toast("Demo data restored", "success");
      setTimeout(function () { location.reload(); }, 500);
    };
  }
})();
