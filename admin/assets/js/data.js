/* Feel Good Spa Admin — sample data + localStorage helpers (frontend demo only) */
(function (global) {
  "use strict";

  const STORAGE_KEY = "fgs_admin_v1";
  const SESSION_KEY = "fgs_admin_session";

  const img = {
    spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    massage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    aroma: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    stone: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    facial: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    scrub: "https://images.unsplash.com/photo-1515375660635-ccf4f8e7ef57?auto=format&fit=crop&w=800&q=80",
    lounge: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80",
    room: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    staff1: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    staff2: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    staff3: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    cust1: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    cust2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    cust3: "https://images.unsplash.com/photo-1544005313-94ddf0286db2?auto=format&fit=crop&w=200&q=80",
    admin: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  };

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function seed() {
    return {
      meta: { demo: true, currency: "NGN", timezone: "Africa/Lagos", updatedAt: new Date().toISOString() },
      website: {
        home: {
          heroHeading: "Relax. Restore. Feel Good.",
          heroDescription: "A quiet spa for massage and wellness — thoughtfully designed treatments in a peaceful, modern setting.",
          heroImage: img.spa,
          welcomeHeading: "A place to slow down and feel good again.",
          welcomeDescription: "From the moment you arrive, every detail is shaped around quiet comfort, skilled care and lasting restoration.",
          featuredServices: ["swedish-massage", "aromatherapy", "hot-stone-massage"],
          whyChooseUs: "Thoughtful care, calm surroundings and treatments designed around how you want to feel.",
          promoHeading: "Spa packages for slower days",
          promoDescription: "Curated combinations for a longer, more immersive spa journey.",
          ctaHeading: "Ready to feel good again?",
          ctaDescription: "Reserve a treatment or package and give yourself permission to rest.",
        },
        about: {
          introduction: "Feel Good Spa was created for people who value quiet rooms, attentive therapists and treatments that honour both body and mind.",
          story: "We began with a simple idea: wellness should feel accessible, elegant and deeply human.",
          mission: "To provide premium spa and massage experiences that help guests relax, restore and feel good.",
          vision: "To be a trusted wellness destination where people return whenever life asks them to slow down.",
          values: "Calm, excellence and care guide every visit.",
          image: img.lounge,
        },
        contact: {
          businessName: "Feel Good Spa",
          phone: "+00 000 000 0000",
          email: "hello@feelgoodspa.example",
          whatsapp: "+00 000 000 0000",
          address: "123 Serenity Lane, Your City",
          hours: "Mon–Fri 10:00–20:00 · Sat 09:00–18:00 · Sun 10:00–16:00",
          mapsUrl: "https://maps.google.com",
          instagram: "https://instagram.com/",
          facebook: "https://facebook.com/",
          tiktok: "https://tiktok.com/",
        },
        seo: {
          title: "Feel Good Spa | Relax. Restore. Feel Good.",
          description: "Premium spa and massage experiences in a peaceful, modern setting.",
          keywords: "spa, massage, wellness, aromatherapy, facial",
          socialImage: img.spa,
          favicon: "",
        },
      },
      services: [
        { id: "swedish-massage", name: "Swedish Massage", category: "Massage", duration: "60 / 90 min", price: 85000, status: "active", featured: true, image: img.massage, description: "Classic long strokes and gentle kneading to ease tension." },
        { id: "deep-tissue-massage", name: "Deep Tissue Massage", category: "Massage", duration: "60 / 90 min", price: 105000, status: "active", featured: false, image: img.stone, description: "Focused pressure into deeper muscle layers." },
        { id: "aromatherapy", name: "Aromatherapy", category: "Massage", duration: "75 min", price: 95000, status: "active", featured: true, image: img.aroma, description: "Massage blended with essential oils for mind and body balance." },
        { id: "hot-stone-massage", name: "Hot Stone Massage", category: "Massage", duration: "90 min", price: 120000, status: "active", featured: true, image: img.spa, description: "Warm stones and skilled hands for deep release." },
        { id: "body-polish", name: "Body Polish", category: "Body", duration: "45 min", price: 70000, status: "active", featured: false, image: img.scrub, description: "Refining polish that leaves skin soft and luminous." },
        { id: "facial-treatment", name: "Facial Treatment", category: "Facial", duration: "60 min", price: 90000, status: "active", featured: false, image: img.facial, description: "Customised facial for a calm, healthy complexion." },
        { id: "body-scrub", name: "Body Scrub", category: "Body", duration: "50 min", price: 75000, status: "active", featured: false, image: img.scrub, description: "Invigorating exfoliation from head to toe." },
        { id: "relaxation-massage", name: "Relaxation Massage", category: "Massage", duration: "60 min", price: 80000, status: "active", featured: false, image: img.room, description: "Soft flowing techniques for quiet restoration." },
      ],
      packages: [
        { id: "relaxation-ritual", name: "Relaxation Ritual", description: "A gentle journey into calm.", treatments: ["Relaxation Massage (60 min)", "Aromatherapy scalp ritual", "Herbal tea"], duration: "Approx. 90 minutes", price: 165000, status: "active", image: img.lounge },
        { id: "together-experience", name: "Together Experience", description: "Shared spa time for two.", treatments: ["Two Swedish Massages", "Shared lounge refreshments", "Foot soak"], duration: "Approx. 90 minutes", price: 290000, status: "active", image: img.massage },
        { id: "feel-good-escape", name: "Feel Good Escape", description: "A longer restorative spa day.", treatments: ["Body Scrub", "Hot Stone Massage", "Express facial"], duration: "Approx. 3 hours", price: 245000, status: "active", image: img.spa },
      ],
      therapists: [
        { id: "th-01", name: "Amara Okonkwo", title: "Senior Massage Therapist", email: "amara@feelgoodspa.example", phone: "+234 801 111 0001", services: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage"], days: ["Mon", "Tue", "Wed", "Thu", "Fri"], hours: "10:00 – 18:00", status: "active", image: img.staff1 },
        { id: "th-02", name: "Chinedu Adeyemi", title: "Massage Therapist", email: "chinedu@feelgoodspa.example", phone: "+234 802 222 0002", services: ["Swedish Massage", "Aromatherapy", "Relaxation Massage"], days: ["Wed", "Thu", "Fri", "Sat"], hours: "11:00 – 19:00", status: "active", image: img.staff2 },
        { id: "th-03", name: "Fatima Bello", title: "Facial & Body Specialist", email: "fatima@feelgoodspa.example", phone: "+234 803 333 0003", services: ["Facial Treatment", "Body Polish", "Body Scrub"], days: ["Tue", "Wed", "Fri", "Sat"], hours: "10:00 – 17:00", status: "active", image: img.staff3 },
        { id: "th-04", name: "Ifeoma Nwosu", title: "Spa Therapist", email: "ifeoma@feelgoodspa.example", phone: "+234 804 444 0004", services: ["Aromatherapy", "Hot Stone Massage", "Relaxation Massage"], days: ["Mon", "Tue", "Sat", "Sun"], hours: "12:00 – 20:00", status: "inactive", image: img.staff1 },
      ],
      customers: [
        { id: "cu-01", name: "Adaeze Nwosu", email: "adaeze@example.com", phone: "+234 810 100 1001", bookings: 6, lastAppointment: "2026-11-02", registered: "2025-04-12", status: "active", image: img.cust1, notes: "Prefers medium pressure." },
        { id: "cu-02", name: "Tunde Bakare", email: "tunde@example.com", phone: "+234 811 200 2002", bookings: 3, lastAppointment: "2026-10-28", registered: "2025-08-03", status: "active", image: img.cust2, notes: "" },
        { id: "cu-03", name: "Ngozi Eze", email: "ngozi@example.com", phone: "+234 812 300 3003", bookings: 9, lastAppointment: "2026-11-05", registered: "2024-11-20", status: "active", image: img.cust3, notes: "Couples packages interest." },
        { id: "cu-04", name: "Ibrahim Musa", email: "ibrahim@example.com", phone: "+234 813 400 4004", bookings: 1, lastAppointment: "2026-09-14", registered: "2026-09-01", status: "active", image: img.cust2, notes: "First-time guest." },
        { id: "cu-05", name: "Blessing Okoro", email: "blessing@example.com", phone: "+234 814 500 5005", bookings: 4, lastAppointment: "2026-10-19", registered: "2025-12-08", status: "inactive", image: img.cust1, notes: "" },
      ],
      bookings: [
        { id: "BK-1042", customer: "Adaeze Nwosu", phone: "+234 810 100 1001", service: "Swedish Massage", date: "2026-11-10", time: "11:00", therapist: "Amara Okonkwo", guests: 1, status: "Confirmed", notes: "Window room if available." },
        { id: "BK-1043", customer: "Tunde Bakare", phone: "+234 811 200 2002", service: "Deep Tissue Massage", date: "2026-11-10", time: "14:00", therapist: "Amara Okonkwo", guests: 1, status: "Pending", notes: "" },
        { id: "BK-1044", customer: "Ngozi Eze", phone: "+234 812 300 3003", service: "Together Experience", date: "2026-11-11", time: "10:00", therapist: "Chinedu Adeyemi", guests: 2, status: "Confirmed", notes: "Anniversary visit." },
        { id: "BK-1045", customer: "Ibrahim Musa", phone: "+234 813 400 4004", service: "Facial Treatment", date: "2026-11-11", time: "16:00", therapist: "Fatima Bello", guests: 1, status: "Pending", notes: "" },
        { id: "BK-1046", customer: "Blessing Okoro", phone: "+234 814 500 5005", service: "Hot Stone Massage", date: "2026-11-09", time: "13:00", therapist: "Ifeoma Nwosu", guests: 1, status: "Completed", notes: "" },
        { id: "BK-1047", customer: "Adaeze Nwosu", phone: "+234 810 100 1001", service: "Aromatherapy", date: "2026-11-12", time: "15:00", therapist: "Chinedu Adeyemi", guests: 1, status: "Confirmed", notes: "" },
        { id: "BK-1048", customer: "Ngozi Eze", phone: "+234 812 300 3003", service: "Body Scrub", date: "2026-11-08", time: "12:00", therapist: "Fatima Bello", guests: 1, status: "Cancelled", notes: "Reschedule requested." },
        { id: "BK-1049", customer: "Tunde Bakare", phone: "+234 811 200 2002", service: "Relaxation Massage", date: "2026-11-13", time: "11:30", therapist: "Chinedu Adeyemi", guests: 1, status: "Pending", notes: "" },
        { id: "BK-1050", customer: "Ibrahim Musa", phone: "+234 813 400 4004", service: "Feel Good Escape", date: "2026-11-15", time: "09:30", therapist: "Amara Okonkwo", guests: 1, status: "Confirmed", notes: "Full day package." },
        { id: "BK-1051", customer: "Adaeze Nwosu", phone: "+234 810 100 1001", service: "Body Polish", date: "2026-11-07", time: "17:00", therapist: "Fatima Bello", guests: 1, status: "Rejected", notes: "Therapist unavailable." },
      ],
      gallery: [
        { id: "g1", title: "Reception lounge", category: "Spa Interior", date: "2026-08-12", visible: true, image: img.lounge },
        { id: "g2", title: "Treatment room A", category: "Massage Rooms", date: "2026-08-12", visible: true, image: img.room },
        { id: "g3", title: "Hot stone setup", category: "Treatment Experiences", date: "2026-09-01", visible: true, image: img.spa },
        { id: "g4", title: "Quiet corner", category: "Relaxation Spaces", date: "2026-09-18", visible: true, image: img.lounge },
        { id: "g5", title: "Facial suite", category: "Massage Rooms", date: "2026-10-02", visible: false, image: img.facial },
        { id: "g6", title: "Aromatherapy tray", category: "Treatment Experiences", date: "2026-10-20", visible: true, image: img.aroma },
      ],
      testimonials: [
        { id: "t1", name: "Adaeze N.", text: "The Swedish massage left me lighter than I have felt in months. Quiet rooms, warm welcome.", rating: 5, image: img.cust1, status: "approved", date: "2026-09-14" },
        { id: "t2", name: "Tunde B.", text: "Deep tissue was exactly what I needed after travel. Professional and unhurried.", rating: 5, image: img.cust2, status: "approved", date: "2026-10-02" },
        { id: "t3", name: "Ngozi E.", text: "We booked the Together Experience — beautifully paced and thoughtful.", rating: 4, image: img.cust3, status: "pending", date: "2026-10-28" },
        { id: "t4", name: "Guest", text: "Facial was calming but I hoped for a longer mask time.", rating: 3, image: img.avatar, status: "rejected", date: "2026-08-22" },
      ],
      messages: [
        { id: "m1", name: "Sarah Johnson", email: "sarah@example.com", subject: "Gift voucher enquiry", message: "Hello, I would like to purchase a spa package voucher for my sister's birthday. Could you advise on options?", date: "2026-11-08T09:22:00", read: false },
        { id: "m2", name: "Michael Chen", email: "michael@example.com", subject: "Parking information", message: "Do you have guest parking available for evening appointments?", date: "2026-11-07T16:40:00", read: true },
        { id: "m3", name: "Amaka Obi", email: "amaka@example.com", subject: "Group booking", message: "We are a team of 6 looking for a Saturday wellness afternoon. Please share availability.", date: "2026-11-06T11:05:00", read: false },
        { id: "m4", name: "David Okeke", email: "david@example.com", subject: "Therapist preference", message: "Can I request Amara for my next deep tissue session?", date: "2026-11-05T14:18:00", read: true },
      ],
      newsletter: [
        { id: "n1", email: "adaeze@example.com", date: "2025-04-12", status: "active" },
        { id: "n2", email: "tunde@example.com", date: "2025-08-03", status: "active" },
        { id: "n3", email: "ngozi@example.com", date: "2024-11-20", status: "active" },
        { id: "n4", email: "hello.guest@example.com", date: "2026-01-15", status: "unsubscribed" },
        { id: "n5", email: "wellness@example.com", date: "2026-03-22", status: "active" },
      ],
      admins: [
        { id: "a1", name: "Raymond John", email: "raymond@feelgoodspa.example", role: "Super Admin", lastLogin: "2026-11-09 08:12", status: "active", image: img.admin },
        { id: "a2", name: "Halima Yusuf", email: "halima@feelgoodspa.example", role: "Manager", lastLogin: "2026-11-08 17:40", status: "active", image: img.staff3 },
        { id: "a3", name: "Kemi Ade", email: "kemi@feelgoodspa.example", role: "Receptionist", lastLogin: "2026-11-09 07:55", status: "active", image: img.cust1 },
      ],
      permissions: {
        "Super Admin": ["Dashboard", "Website", "Bookings", "Calendar", "Services", "Packages", "Customers", "Therapists", "Gallery", "Testimonials", "Messages", "Newsletter", "Reports", "Admins", "Settings"],
        Manager: ["Dashboard", "Website", "Bookings", "Calendar", "Services", "Packages", "Customers", "Therapists", "Gallery", "Testimonials", "Messages", "Newsletter", "Reports", "Settings"],
        Receptionist: ["Dashboard", "Bookings", "Calendar", "Customers", "Messages", "Newsletter"],
      },
      settings: {
        general: { businessName: "Feel Good Spa", currency: "NGN", timezone: "Africa/Lagos", logo: "", favicon: "" },
        booking: { durations: "30, 45, 60, 75, 90", slots: "10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00", advanceDays: 30, cancellation: "Please cancel at least 24 hours in advance." },
        notifications: { email: true, bookingAlerts: true, enquiryAlerts: true },
        appearance: { brandNavy: "#0b1e3d", brandGold: "#a8842c", brandCream: "#f5f0e6", sidebarCollapsed: false },
        profile: { name: "Raymond John", email: "raymond@feelgoodspa.example", image: img.admin, password: "" },
      },
      notifications: [
        { id: "nt1", text: "New booking BK-1049 pending confirmation", time: "12 min ago", unread: true },
        { id: "nt2", text: "Contact message from Amaka Obi", time: "1 hr ago", unread: true },
        { id: "nt3", text: "Testimonial awaiting approval", time: "Yesterday", unread: false },
      ],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const data = seed();
        save(data);
        return data;
      }
      return JSON.parse(raw);
    } catch (e) {
      const data = seed();
      save(data);
      return data;
    }
  }

  function save(data) {
    data.meta = data.meta || {};
    data.meta.updatedAt = new Date().toISOString();
    data.meta.demo = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return load();
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function formatNaira(n) {
    const num = Number(n) || 0;
    return "₦" + num.toLocaleString("en-NG");
  }

  function formatDate(d) {
    if (!d) return "—";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  global.FGS = {
    img,
    uid,
    seed,
    load,
    save,
    reset,
    getSession,
    setSession,
    clearSession,
    formatNaira,
    formatDate,
    STORAGE_KEY,
    SESSION_KEY,
  };
})(window);
