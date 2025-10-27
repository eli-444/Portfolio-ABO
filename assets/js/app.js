
/* =======================================================
   app.js — lightweight interactions for Aurora Portfolio
   Powers: theme toggle, header blur on scroll, reveal,
           aurora parallax, and Apple-like carousel controls
   ======================================================= */

(function () {
  const root = document.documentElement;

  // ---- Theme handling ----
  const THEME_KEY = "theme";
  function applyStoredTheme() {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "dark" || t === "light") {
      root.setAttribute("data-theme", t);
    }
  }
  function toggleTheme() {
    const cur = root.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }
  applyStoredTheme();

  // Create a floating theme toggle
  const toggle = document.createElement("button");
  toggle.className = "btn";
  toggle.style.position = "fixed";
  toggle.style.bottom = "20px";
  toggle.style.right = "20px";
  toggle.style.zIndex = "60";
  toggle.ariaLabel = "Basculer le thème";
  toggle.textContent = "Thème";
  toggle.addEventListener("click", toggleTheme);
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(toggle));

  // ---- Header scrolled effect ----
  const header = document.querySelector("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Smooth scroll for internal nav links ----
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // ---- Aurora parallax (subtle) ----
  const auroraParallax = (e) => {
    const { innerWidth: W, innerHeight: H } = window;
    const x = (e.clientX / W) * 100;
    const y = (e.clientY / H) * 100;
    root.style.setProperty("--aurora-x", x + "%");
    root.style.setProperty("--aurora-y", y + "%");
  };
  window.addEventListener("pointermove", auroraParallax);

  // ---- Apple-like carousel for #projects ----
  const slider = document.querySelector("#projects .slider");
  const prev = document.querySelector("#projects .slider--prev");
  const next = document.querySelector("#projects .slider--next");

  function canScrollLeft() {
    if (!slider) return false;
    return slider.scrollLeft > 0;
  }
  function canScrollRight() {
    if (!slider) return false;
    return slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 1;
  }
  function updateButtons() {
    if (!prev || !next || !slider) return;
    prev.disabled = !canScrollLeft();
    next.disabled = !canScrollRight();
  }
  function scrollByAmount(dir = 1) {
    if (!slider) return;
    const card = slider.querySelector(".slider--item");
    const cardWidth = card ? card.getBoundingClientRect().width : 320;
    const gap = 16;
    slider.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  }
  prev?.addEventListener("click", () => scrollByAmount(-1));
  next?.addEventListener("click", () => scrollByAmount(1));
  slider?.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();

  // Centering & scale effect relative to viewport center
  function scaleCards() {
    if (!slider) return;
    const cards = slider.querySelectorAll(".slider--item");
    const centerX = slider.getBoundingClientRect().left + slider.clientWidth / 2;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(centerX - cardCenter);
      const norm = Math.min(dist / slider.clientWidth, 1);
      const scale = 1.06 - norm * 0.12; // 1.06 -> 0.94
      card.style.transform = `translateY(${(-1 + norm * 6).toFixed(1)}px) scale(${scale.toFixed(3)})`;
      card.style.opacity = String(1 - norm * 0.15);
    });
    updateButtons();
  }
  const scaleRAF = () => requestAnimationFrame(scaleCards);
  slider?.addEventListener("scroll", scaleRAF, { passive: true });
  window.addEventListener("resize", scaleRAF);
  window.addEventListener("load", scaleRAF);

  // ---- Techwatch expand/collapse ----
  const techContent = document.querySelector("#techwatch .tech-content");
  const techBtn = document.querySelector("#techwatch .toggle-btn");
  techBtn?.addEventListener("click", () => {
    if (!techContent) return;
    techContent.classList.toggle("open");
  });
})();
