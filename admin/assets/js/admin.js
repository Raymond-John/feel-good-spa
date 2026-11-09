/* Feel Good Spa Admin — shared shell & UI utilities */
(function () {
  "use strict";

  const NAV = [
    { group: "Overview", items: [
      { href: "dashboard.html", label: "Dashboard", icon: "bi-grid-1x2", page: "dashboard" },
    ]},
    { group: "Operations", items: [
      { href: "website-management.html", label: "Website Management", icon: "bi-globe2", page: "website" },
      { href: "bookings.html", label: "Bookings", icon: "bi-journal-check", page: "bookings" },
      { href: "calendar.html", label: "Appointment Calendar", icon: "bi-calendar3", page: "calendar" },
      { href: "services.html", label: "Services", icon: "bi-flower1", page: "services" },
      { href: "packages.html", label: "Spa Packages", icon: "bi-gift", page: "packages" },
      { href: "customers.html", label: "Customers", icon: "bi-people", page: "customers" },
      { href: "therapists.html", label: "Therapists & Staff", icon: "bi-person-badge", page: "therapists" },
    ]},
    { group: "Content", items: [
      { href: "gallery.html", label: "Gallery", icon: "bi-images", page: "gallery" },
      { href: "testimonials.html", label: "Testimonials", icon: "bi-chat-quote", page: "testimonials" },
      { href: "messages.html", label: "Contact Messages", icon: "bi-envelope", page: "messages" },
      { href: "newsletter.html", label: "Newsletter", icon: "bi-mailbox", page: "newsletter" },
    ]},
    { group: "System", items: [
      { href: "reports.html", label: "Reports & Analytics", icon: "bi-graph-up", page: "reports" },
      { href: "admins.html", label: "Admin Users", icon: "bi-shield-lock", page: "admins" },
      { href: "settings.html", label: "Settings", icon: "bi-gear", page: "settings" },
    ]},
  ];

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return [...(root || document).querySelectorAll(sel)]; }

  function toast(message, type) {
    let stack = qs(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast-item " + (type || "");
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(function () { el.remove(); }, 3200);
  }

  function requireAuth() {
    const page = document.body.getAttribute("data-page");
    if (page === "login") return null;
    const session = FGS.getSession();
    if (!session) {
      window.location.href = "index.html";
      return null;
    }
    return session;
  }

  function logout() {
    FGS.clearSession();
    window.location.href = "index.html";
  }

  function statusClass(status) {
    return String(status || "").toLowerCase().replace(/\s+/g, "-");
  }

  function badge(status) {
    return '<span class="badge-status ' + statusClass(status) + '">' + status + "</span>";
  }

  function pageTitle(active) {
    for (let g = 0; g < NAV.length; g++) {
      for (let i = 0; i < NAV[g].items.length; i++) {
        if (NAV[g].items[i].page === active) return NAV[g].items[i].label;
      }
    }
    return "Admin";
  }

  function navBadge(page, data) {
    if (page === "bookings") {
      const n = (data.bookings || []).filter(function (b) {
        return String(b.status).toLowerCase() === "pending";
      }).length;
      return n;
    }
    if (page === "messages") {
      return (data.messages || []).filter(function (m) { return !m.read; }).length;
    }
    return 0;
  }

  function ensureNavTip() {
    let tip = qs("#floatNavTip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "floatNavTip";
      tip.className = "float-nav-tip";
      tip.setAttribute("role", "tooltip");
      document.body.appendChild(tip);
    }
    return tip;
  }

  function showNavTip(btn) {
    const tip = ensureNavTip();
    const label = qs(".float-btn-label", btn);
    tip.textContent = label ? label.textContent : (btn.getAttribute("aria-label") || "");
    tip.classList.toggle("is-logout", btn.classList.contains("logout"));
    const r = btn.getBoundingClientRect();
    tip.style.top = r.top + r.height / 2 + "px";
    tip.style.left = r.right + 12 + "px";
    tip.classList.add("is-visible");
  }

  function hideNavTip() {
    const tip = qs("#floatNavTip");
    if (tip) tip.classList.remove("is-visible");
  }

  function renderSidebar(active) {
    const nav = qs("#floatNav");
    if (!nav) return;
    const data = FGS.load();
    let html = '<div class="float-nav-scroll">';
    html +=
      '<a class="float-brand" href="../index.html" target="_blank" rel="noopener" aria-label="Feel Good Spa home">' +
      '<i class="bi bi-flower1"></i><span class="float-btn-label">Feel Good Spa</span></a>' +
      '<div class="float-nav-divider" aria-hidden="true"></div>';

    NAV.forEach(function (group, gi) {
      if (gi > 0) html += '<div class="float-nav-divider" aria-hidden="true"></div>';
      group.items.forEach(function (item) {
        const isActive = item.page === active;
        const count = navBadge(item.page, data);
        html +=
          '<a href="' + item.href + '" class="float-btn' + (isActive ? " active" : "") + '"' +
          (isActive ? ' aria-current="page"' : "") +
          ' aria-label="' + item.label + '">' +
          '<i class="bi ' + item.icon + '"></i>' +
          '<span class="float-btn-label">' + item.label + "</span>" +
          (count
            ? '<span class="float-badge" data-count="' + count + '">' + count + "</span>"
            : "") +
          "</a>";
      });
    });

    html +=
      '<div class="float-nav-divider" aria-hidden="true"></div>' +
      '<button type="button" class="float-btn logout" id="logoutNavBtn" aria-label="Logout">' +
      '<i class="bi bi-box-arrow-right"></i><span class="float-btn-label">Logout</span></button>' +
      "</div>";

    nav.innerHTML = html;
    const scroll = qs(".float-nav-scroll", nav);
    ensureNavTip();

    qsa(".float-brand, .float-btn", nav).forEach(function (btn) {
      btn.addEventListener("mouseenter", function () { showNavTip(btn); });
      btn.addEventListener("mouseleave", hideNavTip);
      btn.addEventListener("focus", function () { showNavTip(btn); });
      btn.addEventListener("blur", hideNavTip);
    });
    if (scroll) scroll.addEventListener("scroll", hideNavTip);

    nav.addEventListener("click", function (e) {
      const btn = e.target.closest(".float-brand, .float-btn");
      if (!btn || !nav.contains(btn)) return;
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!canHover && !btn.classList.contains("is-open")) {
        e.preventDefault();
        e.stopPropagation();
        qsa(".float-brand.is-open, .float-btn.is-open", nav).forEach(function (el) {
          if (el !== btn) el.classList.remove("is-open");
        });
        btn.classList.add("is-open");
        showNavTip(btn);
        return;
      }
      hideNavTip();
      if (btn.id === "logoutNavBtn") {
        e.preventDefault();
        logout();
      }
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("#floatNav")) return;
      qsa(".float-brand.is-open, .float-btn.is-open", nav).forEach(function (el) {
        el.classList.remove("is-open");
      });
      hideNavTip();
    });
  }

  function renderTopbar(session) {
    const top = qs("#adminTopbar");
    if (!top) return;
    const data = FGS.load();
    const active = document.body.getAttribute("data-page");
    const unread = (data.notifications || []).filter(function (n) { return n.unread; }).length;
    const now = new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    top.innerHTML =
      '<div class="topbar-left">' +
      '<div class="topbar-crumb">' +
      '<i class="bi bi-flower1"></i><span>Admin</span><span class="sep">/</span>' +
      '<span class="current" id="crumbCurrent">' + pageTitle(active) + "</span></div>" +
      '<div class="topbar-search"><i class="bi bi-search"></i><input type="search" id="globalSearch" placeholder="Search bookings, customers…" /></div>' +
      "</div>" +
      '<div class="topbar-right">' +
      '<span class="topbar-date">' + now + "</span>" +
      '<div class="notif-wrap">' +
      '<button class="btn-icon" type="button" id="notifBtn" aria-label="Notifications"><i class="bi bi-bell"></i>' +
      (unread ? '<span class="notif-badge">' + unread + "</span>" : "") +
      "</button>" +
      '<div class="dropdown-panel" id="notifPanel"><div class="dd-head">Notifications</div>' +
      (data.notifications || []).map(function (n) {
        return '<button type="button" class="dd-item ' + (n.unread ? "unread" : "") + '" data-id="' + n.id + '">' + n.text + '<br><small style="color:var(--muted)">' + n.time + "</small></button>";
      }).join("") +
      "</div></div>" +
      '<div class="profile-wrap">' +
      '<button class="profile-btn" type="button" id="profileBtn">' +
      '<img src="' + (session.image || FGS.img.admin) + '" alt="">' +
      '<span class="meta"><strong>' + session.name + "</strong><span>" + session.role + "</span></span>" +
      '<i class="bi bi-chevron-down"></i></button>' +
      '<div class="dropdown-panel" id="profilePanel" style="width:220px">' +
      '<a class="dd-item" href="settings.html">Profile &amp; settings</a>' +
      '<a class="dd-item" href="../index.html" target="_blank">View public site</a>' +
      '<button type="button" class="dd-item" id="logoutBtn">Logout</button>' +
      "</div></div></div>";

    qs("#notifBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      qs("#profilePanel").classList.remove("open");
      qs("#notifPanel").classList.toggle("open");
    });
    qs("#profileBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      qs("#notifPanel").classList.remove("open");
      qs("#profilePanel").classList.toggle("open");
    });
    qs("#logoutBtn").addEventListener("click", logout);
    document.addEventListener("click", function () {
      qs("#notifPanel") && qs("#notifPanel").classList.remove("open");
      qs("#profilePanel") && qs("#profilePanel").classList.remove("open");
    });
    qsa("#notifPanel .dd-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const d = FGS.load();
        const item = d.notifications.find(function (n) { return n.id === btn.getAttribute("data-id"); });
        if (item) item.unread = false;
        FGS.save(d);
        toast("Notification marked as read", "success");
        renderTopbar(session);
      });
    });
    const search = qs("#globalSearch");
    if (search) {
      search.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const q = search.value.trim();
          if (!q) return;
          window.location.href = "bookings.html?q=" + encodeURIComponent(q);
        }
      });
    }
  }

  function paginate(items, page, perPage) {
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(Math.max(1, page), pages);
    const start = (current - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      page: current,
      pages: pages,
      total: total,
      from: total ? start + 1 : 0,
      to: Math.min(start + perPage, total),
    };
  }

  function renderPagination(el, state, onChange) {
    if (!el) return;
    el.innerHTML =
      "<span>Showing " + state.from + "–" + state.to + " of " + state.total + "</span>" +
      '<div class="pages">' +
      Array.from({ length: state.pages }, function (_, i) {
        const p = i + 1;
        return '<button type="button" class="' + (p === state.page ? "active" : "") + '" data-page="' + p + '">' + p + "</button>";
      }).join("") +
      "</div>";
    qsa("button[data-page]", el).forEach(function (btn) {
      btn.addEventListener("click", function () { onChange(Number(btn.getAttribute("data-page"))); });
    });
  }

  function exportCsv(filename, rows) {
    if (!rows.length) {
      toast("No rows to export", "error");
      return;
    }
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(",")].concat(
      rows.map(function (row) {
        return headers.map(function (h) {
          const val = String(row[h] == null ? "" : row[h]).replace(/"/g, '""');
          return '"' + val + '"';
        }).join(",");
      })
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast("Sample CSV downloaded", "success");
  }

  function bindImagePreview(input, preview) {
    if (!input || !preview) return;
    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        preview.innerHTML = '<img src="' + reader.result + '" alt="Preview">';
        preview.dataset.value = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function confirmModal(opts) {
    return new Promise(function (resolve) {
      let modal = qs("#confirmModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "confirmModal";
        modal.className = "modal fade";
        modal.tabIndex = -1;
        modal.innerHTML =
          '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
          '<div class="modal-header"><h5 class="modal-title" id="confirmTitle">Confirm</h5>' +
          '<button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>' +
          '<div class="modal-body" id="confirmBody"></div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn-admin ghost" data-bs-dismiss="modal">Cancel</button>' +
          '<button type="button" class="btn-admin danger" id="confirmOk">Delete</button>' +
          "</div></div></div>";
        document.body.appendChild(modal);
      }
      qs("#confirmTitle", modal).textContent = opts.title || "Confirm";
      qs("#confirmBody", modal).textContent = opts.message || "Are you sure?";
      qs("#confirmOk", modal).textContent = opts.okText || "Confirm";
      const bs = new bootstrap.Modal(modal);
      const ok = qs("#confirmOk", modal);
      const handler = function () {
        ok.removeEventListener("click", handler);
        bs.hide();
        resolve(true);
      };
      ok.addEventListener("click", handler);
      modal.addEventListener(
        "hidden.bs.modal",
        function once() {
          modal.removeEventListener("hidden.bs.modal", once);
          ok.removeEventListener("click", handler);
          resolve(false);
        },
        { once: true }
      );
      bs.show();
    });
  }

  function initTabs(root) {
    qsa(".tabs-lux", root || document).forEach(function (tabs) {
      const buttons = qsa("button[data-tab]", tabs);
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const id = btn.getAttribute("data-tab");
          buttons.forEach(function (b) { b.classList.toggle("active", b === btn); });
          const wrap = tabs.parentElement;
          qsa(".tab-pane", wrap).forEach(function (pane) {
            pane.classList.toggle("active", pane.id === id);
          });
        });
      });
    });
  }

  function getQuery(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute("data-page");
    if (page === "login") return;
    const session = requireAuth();
    if (!session) return;
    renderSidebar(page);
    renderTopbar(session);
    initTabs();
  });

  window.AdminUI = {
    toast,
    logout,
    requireAuth,
    badge,
    statusClass,
    paginate,
    renderPagination,
    exportCsv,
    bindImagePreview,
    confirmModal,
    initTabs,
    getQuery,
    qs,
    qsa,
  };
})();
