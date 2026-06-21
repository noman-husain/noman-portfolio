const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const year = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeColor = document.querySelector("[data-theme-color]");
const sectionLinks = Array.from(document.querySelectorAll(".nav-links a"));
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const getStoredTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    return;
  }
};

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light" : "Dark";
  }

  if (themeColor) {
    themeColor.setAttribute("content", isDark ? "#0b1115" : "#f6f7f5");
  }
};

applyTheme(getStoredTheme() || (prefersDark.matches ? "dark" : "light"));

if (year) {
  year.textContent = new Date().getFullYear();
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const email = "nomannasir8459@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "Email copied";
      copyButton.classList.add("is-copied");
      window.setTimeout(() => {
        copyButton.textContent = "Copy email";
        copyButton.classList.remove("is-copied");
      }, 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);
      });
    });
  },
  { rootMargin: "-42% 0px -50% 0px", threshold: 0.01 }
);

sectionLinks.forEach((link) => {
  const id = link.getAttribute("href");
  const section = id ? document.querySelector(id) : null;
  if (section) observer.observe(section);
});
