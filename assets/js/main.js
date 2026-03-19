/* ============================================================
   Serene — Main JavaScript
   Handles mobile nav toggle, theme switching, active-link
   highlighting, and scroll-reveal animations.
   ============================================================ */

(function () {
  "use strict";

  /* --- Mobile Navigation Toggle --- */
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a nav link is clicked (mobile UX)
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("is-open")) {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* --- Active Link Highlighting --- */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const overallCapstoneSubpages = ["overall-capstone-justin.html", "overall-capstone-andriy.html"];

  document.querySelectorAll(".nav-list a").forEach(function (link) {
    const href = link.getAttribute("href");
    const isActive =
      href === currentPath ||
      (currentPath === "" && href === "index.html") ||
      (href === "overall-capstone.html" && overallCapstoneSubpages.indexOf(currentPath) !== -1);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* --- Theme Switching --- */
  const THEME_KEY = "serene-theme";
  const themeToggle = document.querySelector(".theme-toggle");

  // Apply saved theme or respect OS preference
  function getPreferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  // Toggle on click
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Listen for OS theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });

  /* --- Scroll-Reveal Animation --- */
  var fadeEls = document.querySelectorAll(".fade-in");

  function isRoughlyInViewport(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // Treat as "above the fold" so hero copy animates immediately (no flash of hidden text)
    return rect.top < vh * 0.92 && rect.bottom > 0;
  }

  if (fadeEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px 8% 0px" },
    );

    fadeEls.forEach(function (el) {
      if (isRoughlyInViewport(el)) {
        // Two rAFs so the first paint uses opacity 0, then transition runs to visible
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.classList.add("is-visible");
          });
        });
      } else {
        observer.observe(el);
      }
    });
  } else {
    // Fallback: just show everything
    fadeEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* --- Meet flow carousel (User page, Figure 2) --- */
  (function initMeetFlowCarousel() {
    var root = document.querySelector("[data-meet-flow-carousel]");
    if (!root) return;

    var slides = [
      {
        src: "assets/images/d.png",
        alt: "Meet flow step 1 of 7: nearby match notification.",
      },
      {
        src: "assets/images/e.png",
        alt: "Meet flow step 2 of 7: reviewing match details.",
      },
      {
        src: "assets/images/f.png",
        alt: "Meet flow step 3 of 7: deciding to meet.",
      },
      {
        src: "assets/images/g.png",
        alt: "Meet flow step 4 of 7: meet request or timing.",
      },
      {
        src: "assets/images/h.png",
        alt: "Meet flow step 5 of 7: map or directions.",
      },
      {
        src: "assets/images/i.png",
        alt: "Meet flow step 6 of 7: approaching check-in.",
      },
      {
        src: "assets/images/j.png",
        alt: "Meet flow step 7 of 7: QR check-in or meet confirmation.",
      },
    ];

    var img = root.querySelector(".meet-flow-carousel__img");
    var statusEl = root.querySelector(".meet-flow-carousel__status");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    if (!img || !statusEl || !prevBtn || !nextBtn) return;

    var index = 0;

    function show() {
      var s = slides[index];
      img.src = s.src;
      img.alt = s.alt;
      statusEl.textContent = "Step " + (index + 1) + " of " + slides.length;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    }

    prevBtn.addEventListener("click", function () {
      if (index > 0) {
        index -= 1;
        show();
      }
    });

    nextBtn.addEventListener("click", function () {
      if (index < slides.length - 1) {
        index += 1;
        show();
      }
    });

    show();
  })();
})();
