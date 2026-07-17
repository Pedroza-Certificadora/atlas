/*
  Pedroza Certificadora - Projeto Atlas
  ConcepÃ§Ã£o, Design e Desenvolvimento
  Marcos Henrique Pedroza
*/

(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const navigationLinks = [...document.querySelectorAll(".main-navigation a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const revealElements = [...document.querySelectorAll(".reveal")];
  const currentYear = document.getElementById("current-year");

  const closeMenu = () => {
    if (!menuButton || !navigation) {
      return;
    }

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    if (!menuButton || !navigation) {
      return;
    }

    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
    navigation.classList.toggle("open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  };

  const updateHeader = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
  };

  const updateActiveNavigation = () => {
    const offset = window.scrollY + 150;
    let activeId = "inicio";

    sections.forEach((section) => {
      if (section.offsetTop <= offset) {
        activeId = section.id;
      }
    });

    navigationLinks.forEach((link) => {
      const target = link.getAttribute("href");
      link.classList.toggle("active", target === `#${activeId}`);
    });
  };

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -45px 0px"
        }
      )
    : null;

  revealElements.forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
    }
  });

  let ticking = false;

  const handleScroll = () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      updateHeader();
      updateActiveNavigation();
      ticking = false;
    });

    ticking = true;
  };

  updateHeader();
  updateActiveNavigation();

  window.addEventListener("scroll", handleScroll, { passive: true });
})();