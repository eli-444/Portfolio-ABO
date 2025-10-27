
/* =======================================================
   project.js — per-project pages interactions
   - theme toggle
   - reveal on scroll
   - aurora parallax
   ======================================================= */
(function () {
  const root = document.documentElement;
  const THEME_KEY = "theme";

  function applyStoredTheme() {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "dark" || t === "light") root.setAttribute("data-theme", t);
  }
  function toggleTheme() {
    const cur = root.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }
  applyStoredTheme();

  // Floating Theme Toggle
  const toggle = document.createElement("button");
  toggle.className = "btn";
  toggle.style.position = "fixed";
  toggle.style.bottom = "20px";
  toggle.style.right = "20px";
  toggle.style.zIndex = "60";
  toggle.textContent = "Thème";
  toggle.ariaLabel = "Basculer le thème";
  toggle.addEventListener("click", toggleTheme);
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(toggle));

  // Smooth internal links
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

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-in");
        io.unobserve(entry.target);
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  // Aurora parallax
  const parallax = (e) => {
    const W = window.innerWidth, H = window.innerHeight;
    const x = (e.clientX / W) * 100;
    const y = (e.clientY / H) * 100;
    root.style.setProperty("--aurora-x", x + "%");
    root.style.setProperty("--aurora-y", y + "%");
  };
  window.addEventListener("pointermove", parallax);
})();
