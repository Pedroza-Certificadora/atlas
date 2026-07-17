/*
Concepcao, Design e Desenvolvimento
Marcos Henrique Pedroza
*/

(function () {
  "use strict";

  function showRevealElements() {
    document.querySelectorAll(".reveal").forEach(function (element) {
      element.classList.add("visible");
      element.classList.add("is-visible");
    });
  }

  function initializeMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var navigation = document.getElementById("menu-principal");

    if (!toggle || !navigation) {
      return;
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navigation.classList.toggle("open", !expanded);
      navigation.classList.toggle("is-open", !expanded);
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("open");
        navigation.classList.remove("is-open");
      });
    });
  }

  function initializeCurrentYear() {
    var year = document.getElementById("ano-atual");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  function initializeReveal() {
    var elements = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (elements.length === 0) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      showRevealElements();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -24px 0px"
    });

    elements.forEach(function (element) {
      observer.observe(element);
    });

    window.setTimeout(showRevealElements, 1200);
  }

  function initializeHeader() {
    var header = document.querySelector(".site-header");
    if (!header) { return; }

    function updateHeader() {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initialize() {
    document.documentElement.classList.add("js-ready");
    initializeCurrentYear();
    initializeHeader();
    initializeMenu();
    initializeReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }

  window.addEventListener("pageshow", function () {
    showRevealElements();
  });
})();
