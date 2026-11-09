/* Dashboard charts + widgets */
(function () {
  "use strict";
  if (document.body.getAttribute("data-page") !== "dashboard") return;

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.AdminUI || !AdminUI.requireAuth()) return;
    const data = FGS.load();
    const bookings = data.bookings || [];
    const today = "2026-11-10";

    const stats = {
      totalBookings: bookings.length,
      today: bookings.filter(function (b) { return b.date === today; }).length,
      pending: bookings.filter(function (b) { return b.status === "Pending"; }).length,
      confirmed: bookings.filter(function (b) { return b.status === "Confirmed"; }).length,
      customers: (data.customers || []).length,
      services: (data.services || []).length,
      therapists: (data.therapists || []).filter(function (t) { return t.status === "active"; }).length,
      revenue: 2485000,
    };

    const grid = document.getElementById("statGrid");
    if (grid) {
      const cards = [
        ["Total Bookings", stats.totalBookings, "bi-journal-check", "All-time sample records"],
        ["Today's Appointments", stats.today, "bi-calendar-day", "Sample date 10 Nov 2026"],
        ["Pending Bookings", stats.pending, "bi-hourglass-split", "Awaiting confirmation"],
        ["Confirmed Bookings", stats.confirmed, "bi-check2-circle", "Ready to host"],
        ["Total Customers", stats.customers, "bi-people", "Sample guest profiles"],
        ["Total Services", stats.services, "bi-flower1", "Active treatment menu"],
        ["Total Therapists", stats.therapists, "bi-person-badge", "Currently active"],
        ["Monthly Revenue", FGS.formatNaira(stats.revenue), "bi-cash-stack", "Demonstration figure"],
      ];
      grid.innerHTML = cards.map(function (c) {
        return '<div class="stat-card"><div class="icon"><i class="bi ' + c[2] + '"></i></div><div class="label">' + c[0] + '</div><div class="value">' + c[1] + '</div><div class="hint">' + c[3] + "</div></div>";
      }).join("");
    }

    const recent = document.getElementById("recentBookings");
    if (recent) {
      recent.innerHTML = bookings.slice(0, 6).map(function (b) {
        return "<tr><td>" + b.id + "</td><td>" + b.customer + "</td><td>" + b.service + "</td><td>" + FGS.formatDate(b.date) + " · " + b.time + "</td><td>" + AdminUI.badge(b.status) + "</td></tr>";
      }).join("");
    }

    const upcoming = document.getElementById("upcomingList");
    if (upcoming) {
      const upcomingItems = bookings
        .filter(function (b) { return b.status === "Confirmed" || b.status === "Pending"; })
        .sort(function (a, b) { return a.date.localeCompare(b.date) || a.time.localeCompare(b.time); })
        .slice(0, 5);
      upcoming.innerHTML = upcomingItems.map(function (b) {
        return '<div class="schedule-row"><div><strong>' + b.time + '</strong><div style="font-size:11px;color:var(--muted)">' + FGS.formatDate(b.date) + '</div></div><div><strong style="color:var(--navy)">' + b.customer + '</strong><div style="font-size:13px">' + b.service + " · " + b.therapist + "</div>" + AdminUI.badge(b.status) + "</div></div>";
      }).join("");
    }

    const popular = document.getElementById("popularList");
    if (popular) {
      const counts = {};
      bookings.forEach(function (b) { counts[b.service] = (counts[b.service] || 0) + 1; });
      const ranked = Object.keys(counts).map(function (k) { return [k, counts[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5);
      popular.innerHTML = ranked.map(function (r, i) {
        return "<tr><td>" + (i + 1) + "</td><td>" + r[0] + "</td><td>" + r[1] + " bookings</td></tr>";
      }).join("");
    }

    const msgs = document.getElementById("recentMessages");
    if (msgs) {
      msgs.innerHTML = (data.messages || []).slice(0, 4).map(function (m) {
        return '<div class="dd-item" style="border:1px solid var(--hairline-soft);margin-bottom:8px"><strong style="color:var(--navy)">' + m.name + '</strong> · ' + m.subject + '<div style="font-size:12px;color:var(--muted);margin-top:4px">' + m.message.slice(0, 90) + "…</div></div>";
      }).join("");
    }

    const bookingCtx = document.getElementById("bookingChart");
    const revenueCtx = document.getElementById("revenueChart");
    if (bookingCtx && window.Chart) {
      new Chart(bookingCtx, {
        type: "bar",
        data: {
          labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
          datasets: [{
            label: "Bookings (sample)",
            data: [42, 48, 51, 57, 62, 38],
            backgroundColor: "rgba(11,30,61,.85)",
            borderRadius: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "rgba(217,209,192,.5)" } },
          },
        },
      });
    }
    if (revenueCtx && window.Chart) {
      new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
          datasets: [{
            label: "Revenue ₦ (sample)",
            data: [1.8, 2.1, 2.0, 2.4, 2.7, 2.485],
            borderColor: "#a8842c",
            backgroundColor: "rgba(168,132,44,.12)",
            fill: true,
            tension: 0.35,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "rgba(217,209,192,.5)" }, ticks: { callback: function (v) { return "₦" + v + "m"; } } },
          },
        },
      });
    }
  });
})();
