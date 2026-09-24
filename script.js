const body = document.body;
const preloader = document.querySelector(".preloader");
const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress__bar");
const navLinks = document.querySelectorAll(".side-rail__link");
const themeToggle = document.querySelector(".theme-toggle");
const accordionCards = document.querySelectorAll("[data-accordion]");
const localTime = document.querySelector("#local-time");

const revealVisibleInViewport = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      item.classList.add("is-visible");
    }
  });
};

const setLoadedState = () => {
  window.setTimeout(() => {
    body.classList.add("is-loaded");
    if (preloader) {
      preloader.setAttribute("aria-hidden", "true");
    }
  }, 1500);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -80px 0px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

const setProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleY(${Math.max(progress, 0.06)})`;
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentId = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.target === currentId);
      });
    });
  },
  {
    threshold: 0.45,
  },
);

document.querySelectorAll("[data-section]").forEach((section) => {
  sectionObserver.observe(section);
});

const updateTime = () => {
  if (!localTime) {
    return;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Cairo",
  });

  localTime.textContent = formatter.format(new Date()).toUpperCase();
};

const openAccordion = (card) => {
  const button = card.querySelector(".service-card__trigger");
  const panel = card.querySelector(".service-card__panel");

  if (!button || !panel) {
    return;
  }

  card.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");
  panel.style.maxHeight = `${panel.scrollHeight}px`;
};

const closeAccordion = (card) => {
  const button = card.querySelector(".service-card__trigger");
  const panel = card.querySelector(".service-card__panel");

  if (!button || !panel) {
    return;
  }

  card.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  panel.style.maxHeight = "0px";
};

accordionCards.forEach((card) => {
  const button = card.querySelector(".service-card__trigger");
  const panel = card.querySelector(".service-card__panel");

  if (!button || !panel) {
    return;
  }

  if (card.classList.contains("is-open")) {
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  } else {
    panel.style.maxHeight = "0px";
  }

  button.addEventListener("click", () => {
    const isOpen = card.classList.contains("is-open");

    accordionCards.forEach((item) => closeAccordion(item));

    if (!isOpen) {
      openAccordion(card);
    }
  });
});

window.addEventListener("resize", () => {
  accordionCards.forEach((card) => {
    if (card.classList.contains("is-open")) {
      openAccordion(card);
    }
  });
});

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  body.classList.add("light-theme");
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  localStorage.setItem("portfolio-theme", body.classList.contains("light-theme") ? "light" : "dark");
});

window.addEventListener("scroll", setProgress, { passive: true });
window.addEventListener("scroll", revealVisibleInViewport, { passive: true });
window.addEventListener("resize", revealVisibleInViewport);

updateTime();
setInterval(updateTime, 60_000);
setProgress();
revealVisibleInViewport();
window.setTimeout(revealVisibleInViewport, 200);
window.setTimeout(revealVisibleInViewport, 1800);
setLoadedState();
