document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileNav();
    initActiveNavLink();
    initScrollReveal();
    initFooterYear();
});

// Theme (dark/light) is applied early by an inline script in <head> to avoid
// a flash of the wrong theme; this just wires up the toggle button.
function initThemeToggle() {
    const root = document.documentElement;
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    const syncIcon = (theme) => {
        toggle.textContent = theme === "dark" ? "☀️" : "🌙";
        toggle.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    };

    syncIcon(root.getAttribute("data-theme"));

    toggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        syncIcon(next);
    });
}

function initMobileNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!navToggle || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

// Each page sets <body data-page="..."> and each nav link sets data-page,
// avoiding brittle URL/pathname comparisons (e.g. "/" vs "index.html").
function initActiveNavLink() {
    const page = document.body.dataset.page;
    if (!page) return;
    document
        .querySelectorAll(`.nav-links a[data-page="${page}"]`)
        .forEach((link) => link.classList.add("active"));
}

function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
}

function initFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
}
