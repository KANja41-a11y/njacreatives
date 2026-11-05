/* =====================================================
   NJAcreative — A Playground of Ideas
   Main JavaScript
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Data (fallback if fetch fails) ----------
  let PRODUCTS = [];
  let PROJECTS = [];
  let IDEAS_DATA = {};
  let INSPIRATION = [];

  // ---------- Helpers ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function toast(msg, ms = 2200) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove("show"), ms);
  }

  function storageGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }
  function storageSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  // ---------- Loader ----------
  const loader = $(".loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("hidden"), 600);
  });
  // Safety: hide after 3s even if load event missed
  setTimeout(() => loader?.classList.add("hidden"), 3000);

  // ---------- Theme ----------
  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("nja-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("nja-theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀" : "☾";
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  // ---------- Progress bar ----------
  const progressBar = $(".progress-bar");
  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (progressBar) progressBar.style.width = p + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });

  // ---------- Back to top ----------
  const backTop = $(".back-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) backTop?.classList.add("visible");
    else backTop?.classList.remove("visible");
  }, { passive: true });
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ---------- Custom cursor ----------
  const cursorDot = $("#cursorDot");
  const cursorRing = $("#cursorRing");
  if (cursorDot && cursorRing && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = mx + "px";
      cursorDot.style.top = my + "px";
    });
    function animRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + "px";
      cursorRing.style.top = ry + "px";
      requestAnimationFrame(animRing);
    }
    animRing();
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .project-card, .store-card, .swatch, input, textarea, .tool-btn, .filter-pill")) {
        cursorRing.classList.add("hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .project-card, .store-card, .swatch, input, textarea, .tool-btn, .filter-pill")) {
        cursorRing.classList.remove("hover");
      }
    });
  } else {
    cursorDot?.remove();
    cursorRing?.remove();
  }

  // ---------- Nav mobile ----------
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const mobileClose = $("#mobileClose");

  function openMobile() {
    mobileMenu?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMobile() {
    mobileMenu?.classList.remove("open");
    document.body.style.overflow = "";
  }
  menuToggle?.addEventListener("click", openMobile);
  mobileClose?.addEventListener("click", closeMobile);
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMobile));

  // Active nav link on scroll
  const sections = $$("section[id]");
  const navLinks = $$(".nav-links a");
  function highlightNav() {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", highlightNav, { passive: true });

  // ---------- Reveal on scroll ----------
  const reveals = $$(".reveal");
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => revealObs.observe(el));

  // ---------- Hero slider ----------
  const slides = $$(".slide");
  const dotsWrap = $("#dots");
  let currentSlide = 0;
  let slideTimer;

  function showSlide(i) {
    if (!slides.length) return;
    currentSlide = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === currentSlide));
    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, idx) => d.classList.toggle("active", idx === currentSlide));
    }
  }
  if (dotsWrap && slides.length) {
    slides.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => {
        showSlide(i);
        resetSlideTimer();
      });
      dotsWrap.appendChild(d);
    });
  }
  $("#next")?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    resetSlideTimer();
  });
  $("#prev")?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    resetSlideTimer();
  });
  function resetSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  }
  if (slides.length) resetSlideTimer();

  // ---------- Music player ----------
  const audio = $("#audio");
  const musicBtn = $("#musicBtn");
  let musicPlaying = false;
  musicBtn?.addEventListener("click", async () => {
    if (!audio) return;
    try {
      if (musicPlaying) {
        audio.pause();
        musicBtn.textContent = "▶";
        musicPlaying = false;
      } else {
        await audio.play();
        musicBtn.textContent = "Ⅱ";
        musicPlaying = true;
      }
    } catch (e) {
      toast("Music could not play");
    }
  });
  audio?.addEventListener("ended", () => {
    musicBtn.textContent = "▶";
    musicPlaying = false;
  });

  // ---------- Journey expand ----------
  $$(".journey-card .expand-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".journey-card");
      card.classList.toggle("open");
      btn.textContent = card.classList.contains("open") ? "Show less ↑" : "Read more ↓";
    });
  });

  // ---------- Load JSON data ----------
  async function loadData() {
    try {
      const [p, pr, id, insp] = await Promise.all([
        fetch("data/products.json").then((r) => r.json()),
        fetch("data/projects.json").then((r) => r.json()),
        fetch("data/ideas.json").then((r) => r.json()),
        fetch("data/inspiration.json").then((r) => r.json()),
      ]);
      PRODUCTS = p;
      PROJECTS = pr;
      IDEAS_DATA = id;
      INSPIRATION = insp;
    } catch (e) {
      console.warn("Using embedded fallback data", e);
      // Fallback embedded so site still works without server
      PRODUCTS = [
        { id: "flower-pin", name: "Flower Pin", description: "Soft flower charm keychain — tiny & pretty ♡", price: "Rp 25.000", tag: "new ✦", image: "images/product-1-flower-pin.jpg", category: "Accessories", availability: "Available", orderLink: "https://instagram.com/kknjau" },
        { id: "flower-clay-rings", name: "Flower Clay Rings", description: "Acrylic flower clay rings — handmade soft colors ♡", price: "Rp 35.000", tag: "", image: "images/product-2-flower-rings.jpg", category: "Accessories", availability: "Available", orderLink: "https://instagram.com/kknjau" },
        { id: "fluffy-doll", name: "Fluffy Doll", description: "Soft fluffy doll with ribbon — little companion ♡", price: "Rp 45.000", tag: "", image: "images/product-3-fluffy-doll.jpg", category: "Plush", availability: "Available", orderLink: "https://instagram.com/kknjau" },
      ];
      PROJECTS = [
        { id: "spring-carousel", title: "Spring Carousel Visuals", category: "Illustration", year: "2025", description: "Soft spring-inspired photo series featuring flowers, cozy moments, and dreamy light.", tools: ["Photography", "Lightroom"], process: "Captured everyday soft moments.", images: ["images/slide-1-flowers.jpg"], link: "", featured: true },
        { id: "njacreative-site", title: "NJAcreative Website", category: "Website Projects", year: "2025", description: "A soft little archive of ideas, experiments, and memories.", tools: ["HTML", "CSS", "JavaScript"], process: "Designed and built from the ground up.", images: [], link: "https://njacreatives.my.id/", featured: true },
      ];
      IDEAS_DATA = {
        projectTypes: ["brand identity", "portfolio homepage", "sticker collection", "packaging design", "social media kit", "illustration series"],
        themes: ["pastel bakery", "dreamy spring garden", "cozy rainy day", "soft strawberry cafe", "lavender field", "peach sunset"],
        palettes: ["cream + sage + strawberry pink", "butter yellow + peach + lavender", "soft mint + blush + ivory"],
        styles: ["hand-drawn doodle", "soft editorial", "cute sticker style", "paper texture collage", "scrapbook aesthetic"],
        challenges: ["only use 3 colors", "make it feel like a childhood memory", "add one unexpected element", "include a tiny hidden detail"],
      };
      INSPIRATION = [
        { id: "palette-spring", type: "palette", title: "Spring Soft", colors: ["#F7F0E8", "#A8C5A0", "#E8A0B0", "#F5D78E", "#F2C4A0", "#C5B4E3"], tags: ["spring", "pastel"] },
        { id: "palette-strawberry", type: "palette", title: "Strawberry Milk", colors: ["#FFF5F7", "#FFB7C5", "#FF8FA3", "#FFE4E9"], tags: ["pink", "cute"] },
        { id: "type-soft", type: "typography", title: "Soft Editorial Pair", fonts: ["Playfair Display", "DM Sans"], sample: "Creating little things, dreaming big.", tags: ["editorial"] },
        { id: "mood-scrapbook", type: "mood", title: "Creative Scrapbook", description: "Paper textures, washi tape, handwritten notes, pressed flowers.", tags: ["scrapbook"] },
      ];
    }
    renderStore();
    renderArchive();
    renderInspiration();
    initGenerator();
  }

  // ---------- Store ----------
  function renderStore() {
    const grid = $("#storeGrid");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(
      (p) => `
      <article class="store-card reveal" data-id="${p.id}">
        <div class="store-image">
          <img loading="lazy" src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML+='<span style=font-size:3rem>✿</span>'">
          ${p.tag ? `<span class="store-tag">${p.tag}</span>` : ""}
        </div>
        <div class="store-info">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="store-bottom">
            <strong>${p.price}</strong>
            <a href="${p.orderLink}" target="_blank" rel="noopener" class="store-buy">Get it ↗</a>
          </div>
        </div>
      </article>`
    ).join("");
    // re-observe reveals
    $$(".store-card.reveal").forEach((el) => revealObs.observe(el));
  }

  // ---------- Archive ----------
  let currentFilter = "all";
  let currentSearch = "";

  function renderArchive() {
    const grid = $("#projectsGrid");
    if (!grid) return;
    const filtered = PROJECTS.filter((p) => {
      const matchCat = currentFilter === "all" || p.category === currentFilter;
      const q = currentSearch.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    if (!filtered.length) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:2rem;">No projects found. Try another filter or search.</p>`;
      return;
    }
    grid.innerHTML = filtered
      .map((p) => {
        const thumb = p.images && p.images[0]
          ? `<img src="${p.images[0]}" alt="${p.title}" loading="lazy">`
          : `<span>${categoryEmoji(p.category)}</span>`;
        return `
        <article class="project-card reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
          <div class="project-thumb">${thumb}</div>
          <div class="project-body">
            <div class="project-cat">${p.category}</div>
            <h3>${p.title}</h3>
            <p>${p.description}</p>
          </div>
        </article>`;
      })
      .join("");
    $$(".project-card").forEach((card) => {
      card.addEventListener("click", () => openProjectModal(card.dataset.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProjectModal(card.dataset.id);
        }
      });
    });
    $$(".project-card.reveal").forEach((el) => revealObs.observe(el));
  }

  function categoryEmoji(cat) {
    const map = {
      "Graphic Design": "🎨",
      "Website Projects": "💻",
      Illustration: "✏️",
      "Video Editing": "🎬",
      "Digital Experiments": "🪄",
      "Other Projects": "✦",
    };
    return map[cat] || "✿";
  }

  $$(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      $$(".filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.dataset.filter;
      renderArchive();
    });
  });
  $("#projectSearch")?.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderArchive();
  });

  // Project modal
  const modalBackdrop = $("#projectModal");
  function openProjectModal(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p || !modalBackdrop) return;
    const body = $("#modalBody");
    body.innerHTML = `
      <h2>${p.title}</h2>
      <div class="modal-meta">
        <span>${p.category}</span>
        <span>${p.year || ""}</span>
      </div>
      <p>${p.description}</p>
      ${p.process ? `<p><strong>Process:</strong> ${p.process}</p>` : ""}
      <div class="modal-tools">${(p.tools || []).map((t) => `<span>${t}</span>`).join("")}</div>
      ${
        p.images && p.images.length
          ? `<div class="modal-gallery">${p.images.map((src) => `<img src="${src}" alt="" loading="lazy">`).join("")}</div>`
          : ""
      }
      ${p.link ? `<p style="margin-top:1rem"><a href="${p.link}" target="_blank" rel="noopener" class="btn primary">Open project ↗</a></p>` : ""}
    `;
    modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeProjectModal() {
    modalBackdrop?.classList.remove("open");
    document.body.style.overflow = "";
  }
  $("#modalClose")?.addEventListener("click", closeProjectModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeProjectModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });

  // ---------- Inspiration Lab ----------
  let inspoFilter = "all";
  const favInspo = storageGet("nja-fav-inspo", []);

  function renderInspiration() {
    const grid = $("#inspoGrid");
    if (!grid) return;
    const list = INSPIRATION.filter((i) => inspoFilter === "all" || i.type === inspoFilter);
    grid.innerHTML = list
      .map((item) => {
        const isFav = favInspo.includes(item.id);
        let content = "";
        if (item.type === "palette") {
          content = `<div class="color-row">${(item.colors || [])
            .map((c) => `<div class="swatch" style="background:${c}" data-color="${c}" title="${c}"></div>`)
            .join("")}</div>`;
        } else if (item.type === "typography") {
          content = `<div class="inspo-fonts">${(item.fonts || []).join(" + ")}</div><div class="inspo-sample">${item.sample || ""}</div>`;
        } else {
          content = `<p>${item.description || ""}</p>`;
        }
        return `
        <article class="inspo-card reveal" data-id="${item.id}">
          <h3>${item.title}</h3>
          ${content}
          <button class="fav-btn ${isFav ? "saved" : ""}" data-id="${item.id}">${isFav ? "♥ Saved" : "♡ Save"}</button>
        </article>`;
      })
      .join("");

    $$(".swatch").forEach((s) => {
      s.addEventListener("click", () => {
        const color = s.dataset.color;
        navigator.clipboard?.writeText(color).then(() => {
          toast("Copied " + color);
          s.setAttribute("data-copied", "1");
          setTimeout(() => s.removeAttribute("data-copied"), 1200);
        });
      });
    });
    $$(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const idx = favInspo.indexOf(id);
        if (idx >= 0) {
          favInspo.splice(idx, 1);
          btn.textContent = "♡ Save";
          btn.classList.remove("saved");
        } else {
          favInspo.push(id);
          btn.textContent = "♥ Saved";
          btn.classList.add("saved");
        }
        storageSet("nja-fav-inspo", favInspo);
      });
    });
    $$(".inspo-card.reveal").forEach((el) => revealObs.observe(el));
  }

  $$(".inspo-filters .filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      $$(".inspo-filters .filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      inspoFilter = pill.dataset.filter;
      renderInspiration();
    });
  });

  // ---------- Idea Generator ----------
  let currentIdea = "";
  const savedIdeas = storageGet("nja-saved-ideas", []);

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateIdea() {
    if (!IDEAS_DATA.projectTypes) return "Create something that feels like you ✦";
    const type = pick(IDEAS_DATA.projectTypes);
    const theme = pick(IDEAS_DATA.themes);
    const palette = pick(IDEAS_DATA.palettes);
    const style = pick(IDEAS_DATA.styles);
    const challenge = Math.random() > 0.4 ? pick(IDEAS_DATA.challenges) : null;
    currentIdea = `Create a ${theme} ${type} in a ${style} style using ${palette}.`;
    const box = $("#ideaText");
    const chal = $("#ideaChallenge");
    if (box) box.textContent = currentIdea;
    if (chal) chal.textContent = challenge ? "Challenge: " + challenge : "";
  }

  function renderSavedIdeas() {
    const list = $("#savedIdeasList");
    if (!list) return;
    if (!savedIdeas.length) {
      list.innerHTML = `<p class="notes-empty">No saved ideas yet. Generate one and hit Save!</p>`;
      return;
    }
    list.innerHTML = savedIdeas
      .map(
        (idea, i) => `
      <div class="saved-item">
        <span>${idea}</span>
        <button type="button" data-idx="${i}" aria-label="Remove">✕</button>
      </div>`
      )
      .join("");
    list.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        savedIdeas.splice(+btn.dataset.idx, 1);
        storageSet("nja-saved-ideas", savedIdeas);
        renderSavedIdeas();
      });
    });
  }

  function initGenerator() {
    generateIdea();
    renderSavedIdeas();
  }

  $("#generateBtn")?.addEventListener("click", () => {
    generateIdea();
    toast("New idea generated ✦");
  });
  $("#copyIdeaBtn")?.addEventListener("click", () => {
    if (!currentIdea) return;
    navigator.clipboard?.writeText(currentIdea).then(() => toast("Idea copied!"));
  });
  $("#saveIdeaBtn")?.addEventListener("click", () => {
    if (!currentIdea) return;
    if (savedIdeas.includes(currentIdea)) {
      toast("Already saved");
      return;
    }
    savedIdeas.unshift(currentIdea);
    if (savedIdeas.length > 20) savedIdeas.pop();
    storageSet("nja-saved-ideas", savedIdeas);
    renderSavedIdeas();
    toast("Idea saved ♡");
  });
  $("#clearIdeasBtn")?.addEventListener("click", () => {
    savedIdeas.length = 0;
    storageSet("nja-saved-ideas", savedIdeas);
    renderSavedIdeas();
    toast("Saved ideas cleared");
  });

  // ---------- Before / After slider ----------
  const baSlider = $("#baSlider");
  if (baSlider) {
    const after = $(".ba-after", baSlider);
    const handle = $(".ba-handle", baSlider);
    let dragging = false;

    function setPos(clientX) {
      const rect = baSlider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      if (after) after.style.width = pct + "%";
      if (handle) handle.style.left = pct + "%";
    }
    handle?.addEventListener("mousedown", () => (dragging = true));
    handle?.addEventListener("touchstart", () => (dragging = true), { passive: true });
    window.addEventListener("mouseup", () => (dragging = false));
    window.addEventListener("touchend", () => (dragging = false));
    window.addEventListener("mousemove", (e) => {
      if (dragging) setPos(e.clientX);
    });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (dragging && e.touches[0]) setPos(e.touches[0].clientX);
      },
      { passive: true }
    );
    baSlider.addEventListener("click", (e) => setPos(e.clientX));
  }

  // ---------- Creative Playground ----------
  const canvas = $("#canvasArea");
  const canvasBg = $("#canvasBg");
  let pgElements = [];
  let selectedEl = null;
  let dragState = null;

  const STICKERS = ["✿", "✦", "♡", "❀", "★", "☁", "🌸", "🎀", "✨", "🍓", "🦋", "🌷"];
  const BGS = {
    cream: "var(--cream)",
    sage: "linear-gradient(135deg, #E8F0E6, #D4E8D0)",
    pink: "linear-gradient(135deg, #FFF0F3, #FFE0E8)",
    lavender: "linear-gradient(135deg, #F3EEF9, #E5DCF2)",
    peach: "linear-gradient(135deg, #FFF5EB, #FFE8D6)",
  };

  function addPgElement(type, content, x, y) {
    const el = document.createElement("div");
    el.className = "pg-element" + (type === "text" ? " text-el" : "");
    el.textContent = content;
    el.style.left = (x || 40 + Math.random() * 200) + "px";
    el.style.top = (y || 40 + Math.random() * 150) + "px";
    el.style.fontSize = type === "sticker" ? 1.8 + Math.random() * 1.2 + "rem" : "1.1rem";
    el.dataset.id = "el-" + Date.now() + Math.random().toString(36).slice(2, 6);
    canvas.appendChild(el);
    pgElements.push(el);
    selectEl(el);
    bindPgEvents(el);
    return el;
  }

  function selectEl(el) {
    $$(".pg-element").forEach((e) => e.classList.remove("selected"));
    selectedEl = el;
    if (el) el.classList.add("selected");
  }

  function bindPgEvents(el) {
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectEl(el);
      const rect = canvas.getBoundingClientRect();
      dragState = {
        el,
        ox: e.clientX - rect.left - parseFloat(el.style.left),
        oy: e.clientY - rect.top - parseFloat(el.style.top),
      };
      el.classList.add("dragging");
      el.setPointerCapture?.(e.pointerId);
    });
  }

  canvas?.addEventListener("pointermove", (e) => {
    if (!dragState) return;
    const rect = canvas.getBoundingClientRect();
    let nx = e.clientX - rect.left - dragState.ox;
    let ny = e.clientY - rect.top - dragState.oy;
    nx = Math.max(0, Math.min(rect.width - 40, nx));
    ny = Math.max(0, Math.min(rect.height - 30, ny));
    dragState.el.style.left = nx + "px";
    dragState.el.style.top = ny + "px";
  });
  canvas?.addEventListener("pointerup", () => {
    if (dragState) {
      dragState.el.classList.remove("dragging");
      dragState = null;
    }
  });
  canvas?.addEventListener("click", (e) => {
    if (e.target === canvas || e.target === canvasBg) selectEl(null);
  });

  $("#addSticker")?.addEventListener("click", () => {
    addPgElement("sticker", pick(STICKERS));
  });
  $("#addText")?.addEventListener("click", () => {
    const text = prompt("Enter text:", "hello spring!");
    if (text) addPgElement("text", text);
  });
  $("#addShape")?.addEventListener("click", () => {
    const shapes = ["●", "■", "▲", "◆", "○"];
    addPgElement("sticker", pick(shapes));
  });
  $("#removeEl")?.addEventListener("click", () => {
    if (selectedEl) {
      selectedEl.remove();
      pgElements = pgElements.filter((e) => e !== selectedEl);
      selectedEl = null;
    } else toast("Select an element first");
  });
  $("#resetCanvas")?.addEventListener("click", () => {
    pgElements.forEach((e) => e.remove());
    pgElements = [];
    selectedEl = null;
    if (canvasBg) canvasBg.style.background = BGS.cream;
    toast("Canvas reset");
  });
  $$("[data-bg]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.bg;
      if (canvasBg && BGS[key]) canvasBg.style.background = BGS[key];
      $$("[data-bg]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Export canvas as image (html2canvas-like simple approach using foreignObject or just prompt)
  $("#exportCanvas")?.addEventListener("click", async () => {
    if (!canvas) return;
    try {
      // Simple approach: use html2canvas if available, else canvas API snapshot of elements
      const { default: html2canvas } = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm").catch(() => ({ default: null }));
      if (html2canvas) {
        const shot = await html2canvas(canvas, { backgroundColor: null, scale: 2 });
        const link = document.createElement("a");
        link.download = "nja-playground-" + Date.now() + ".png";
        link.href = shot.toDataURL("image/png");
        link.click();
        toast("Image exported! ♡");
      } else {
        // Fallback: open print-friendly or just notify
        toast("Export needs network for html2canvas. Try again online.");
      }
    } catch (e) {
      console.error(e);
      toast("Export failed — try on a live server");
    }
  });

  // Keyboard: Delete removes selected
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selectedEl && !e.target.matches("input, textarea")) {
      e.preventDefault();
      selectedEl.remove();
      pgElements = pgElements.filter((el) => el !== selectedEl);
      selectedEl = null;
    }
  });

  // ---------- Guestbook (localStorage) ----------
  const guestbookForm = $("#guestbookForm");
  const notesWall = $("#notesWall");
  const messages = storageGet("nja-guestbook", []);

  function renderGuestbook() {
    if (!notesWall) return;
    if (!messages.length) {
      notesWall.innerHTML = `<p class="notes-empty">No messages yet. Be the first to leave a little note ♡</p>`;
      return;
    }
    notesWall.innerHTML = messages
      .map(
        (m) => `
      <div class="sticky-note">
        <div class="note-name">${escapeHtml(m.name)}</div>
        <div class="note-msg">${escapeHtml(m.message)}</div>
        <div class="note-date">${m.date}</div>
      </div>`
      )
      .join("");
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  guestbookForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#guestName")?.value.trim();
    const message = $("#guestMessage")?.value.trim();
    if (!name || !message) {
      toast("Please fill name and message");
      return;
    }
    if (name.length > 40 || message.length > 280) {
      toast("Message too long");
      return;
    }
    // Simple spam: block if last message < 8s ago
    const last = messages[0];
    if (last && Date.now() - (last.ts || 0) < 8000) {
      toast("Please wait a moment before sending again");
      return;
    }
    messages.unshift({
      name,
      message,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      ts: Date.now(),
    });
    if (messages.length > 50) messages.pop();
    storageSet("nja-guestbook", messages);
    guestbookForm.reset();
    renderGuestbook();
    toast("Thank you for your note ♡");
  });
  renderGuestbook();

  // ---------- Let's Talk popup (legacy style) ----------
  const helloBackdrop = $("#helloBackdrop");
  $("#letsTalk")?.addEventListener("click", (e) => {
    e.preventDefault();
    // scroll to contact or open modal
    const contact = $("#contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth" });
  });
  $("#helloClose")?.addEventListener("click", () => {
    helloBackdrop?.classList.remove("open");
  });

  // ---------- Welcome overlay ----------
  const welcomeOverlay = $("#welcomeOverlay");
  const welcomeEnter = $("#welcomeEnter");
  const welcomeDontShow = $("#welcomeDontShow");

  if (localStorage.getItem("nja-welcome-hide") === "1") {
    welcomeOverlay?.classList.add("hide");
  }

  function closeWelcome() {
    if (welcomeDontShow?.checked) {
      localStorage.setItem("nja-welcome-hide", "1");
    }
    welcomeOverlay?.classList.add("hide");
  }
  welcomeEnter?.addEventListener("click", closeWelcome);
  welcomeOverlay?.addEventListener("click", (e) => {
    if (e.target === welcomeOverlay) closeWelcome();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && welcomeOverlay && !welcomeOverlay.classList.contains("hide")) {
      closeWelcome();
    }
  });

  // ---------- Floating Instagram (draggable) ----------
  const floatingIg = $("#floatingIg");
  if (floatingIg) {
    // restore position
    try {
      const saved = JSON.parse(localStorage.getItem("nja-ig-pos") || "null");
      if (saved && typeof saved.left === "number" && typeof saved.top === "number") {
        floatingIg.style.left = saved.left + "px";
        floatingIg.style.top = saved.top + "px";
        floatingIg.style.right = "auto";
        floatingIg.style.bottom = "auto";
      }
    } catch {}

    let dragging = false;
    let moved = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    function getPoint(e) {
      if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function onStart(e) {
      // only left mouse / touch
      if (e.type === "mousedown" && e.button !== 0) return;
      const pt = getPoint(e);
      const rect = floatingIg.getBoundingClientRect();
      dragging = true;
      moved = false;
      startX = pt.x;
      startY = pt.y;
      origLeft = rect.left;
      origTop = rect.top;
      floatingIg.classList.add("dragging");
      floatingIg.style.left = origLeft + "px";
      floatingIg.style.top = origTop + "px";
      floatingIg.style.right = "auto";
      floatingIg.style.bottom = "auto";
      e.preventDefault();
    }

    function onMove(e) {
      if (!dragging) return;
      const pt = getPoint(e);
      const dx = pt.x - startX;
      const dy = pt.y - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      let nx = origLeft + dx;
      let ny = origTop + dy;
      const maxX = window.innerWidth - floatingIg.offsetWidth;
      const maxY = window.innerHeight - floatingIg.offsetHeight;
      nx = Math.max(0, Math.min(maxX, nx));
      ny = Math.max(0, Math.min(maxY, ny));
      floatingIg.style.left = nx + "px";
      floatingIg.style.top = ny + "px";
    }

    function onEnd(e) {
      if (!dragging) return;
      dragging = false;
      floatingIg.classList.remove("dragging");
      // save position
      const left = parseFloat(floatingIg.style.left) || 0;
      const top = parseFloat(floatingIg.style.top) || 0;
      try {
        localStorage.setItem("nja-ig-pos", JSON.stringify({ left, top }));
      } catch {}
      // if user dragged, prevent accidental click/navigation
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        const blockClick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          floatingIg.removeEventListener("click", blockClick, true);
        };
        floatingIg.addEventListener("click", blockClick, true);
      }
    }

    floatingIg.addEventListener("mousedown", onStart);
    floatingIg.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);
  }

  // ---------- Start ----------
  loadData();
});
