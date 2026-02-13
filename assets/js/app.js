/* =======================================================
   app.js — minimal interactions (Hyperstudio-inspired)
   - sticky header state
   - smooth anchor scroll
   - reveal on scroll
   - projects carousel controls
   ======================================================= */

(() => {
  const header = document.querySelector("header");

  // Header compact state on scroll
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth scroll for internal links
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
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Projects carousel controls (index only)
  const slider = document.querySelector("#projects .slider");
  const prev = document.querySelector("#projects .slider--prev");
  const next = document.querySelector("#projects .slider--next");
  const projectItems = slider ? Array.from(slider.querySelectorAll(".slider--item")) : [];
  let currentIndex = 0;

  function loopIndex(i, len) {
    return (i + len) % len;
  }

  function clearProjectStateClasses(el) {
    el.classList.remove("is-center", "is-left", "is-right", "is-far-left", "is-far-right", "pivot-left", "pivot-right");
  }

  function updateProjectCarousel(dir = 1) {
    if (!projectItems.length) return;

    const total = projectItems.length;
    const leftIndex = loopIndex(currentIndex - 1, total);
    const rightIndex = loopIndex(currentIndex + 1, total);
    const farLeftIndex = loopIndex(currentIndex - 2, total);
    const farRightIndex = loopIndex(currentIndex + 2, total);

    projectItems.forEach((item) => {
      clearProjectStateClasses(item);
      item.setAttribute("aria-hidden", "true");
      const link = item.querySelector(".project-link");
      if (link) link.tabIndex = -1;
    });

    projectItems[currentIndex].classList.add("is-center");
    projectItems[leftIndex].classList.add("is-left");
    projectItems[rightIndex].classList.add("is-right");
    projectItems[farLeftIndex].classList.add("is-far-left");
    projectItems[farRightIndex].classList.add("is-far-right");

    projectItems[currentIndex].setAttribute("aria-hidden", "false");
    const currentLink = projectItems[currentIndex].querySelector(".project-link");
    if (currentLink) currentLink.tabIndex = 0;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const pivotClass = dir < 0 ? "pivot-left" : "pivot-right";
    projectItems[currentIndex].classList.add(pivotClass);
  }

  function updateButtons() {
    if (!prev || !next) return;
    const disable = projectItems.length <= 1;
    prev.disabled = disable;
    next.disabled = disable;
  }

  prev?.addEventListener("click", () => {
    if (projectItems.length <= 1) return;
    currentIndex = loopIndex(currentIndex - 1, projectItems.length);
    updateProjectCarousel(-1);
  });

  next?.addEventListener("click", () => {
    if (projectItems.length <= 1) return;
    currentIndex = loopIndex(currentIndex + 1, projectItems.length);
    updateProjectCarousel(1);
  });

  slider?.addEventListener("animationend", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (event.animationName !== "project-card-pivot-left" && event.animationName !== "project-card-pivot-right") return;
    target.classList.remove("pivot-left", "pivot-right");
  });
  window.addEventListener("resize", updateButtons);
  updateProjectCarousel(1);
  updateButtons();
})();
