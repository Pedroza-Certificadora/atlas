/*
  Pedroza Certificadora
  Central AGR

  Concepção, Design e Desenvolvimento
  Marcos Henrique Pedroza
*/

(() => {
  "use strict";

  const yearElement = document.querySelector("#ano-atual");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const trackedLinks = document.querySelectorAll(
    ".agr-link, .agr-compact-link"
  );

  trackedLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof window.gtag !== "function") {
        return;
      }

      window.gtag("event", "agr_link_open", {
        event_category: "Central AGR",
        link_text: link.textContent.trim(),
        link_url: link.href
      });
    });
  });
})();
