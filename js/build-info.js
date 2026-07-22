/*
 * Atlas Build Information System - ABIS
 * Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
 */
(function (window, document) {
  "use strict";

  var build = Object.freeze({
    product: "Portal Atlas",
    sprint: "4.7",
    module: "ADF",
    version: "4.7.4",
    environment: "Produção",
    publishedAt: "21/07/2026"
  });

  window.ATLAS_BUILD = build;

  function label() {
    return "Atlas • Sprint " + build.sprint + " • " + build.module + " • v" + build.version;
  }

  function ensureGlobalStamp() {
    var stamp = document.getElementById("atlas-build-stamp");
    if (!stamp) {
      stamp = document.createElement("div");
      stamp.id = "atlas-build-stamp";
      stamp.className = "atlas-build-stamp";
      stamp.setAttribute("role", "status");
      stamp.setAttribute("aria-label", "Versão atual do Portal Atlas");
      document.body.appendChild(stamp);
    }
    stamp.textContent = label();
  }

  function apply() {
    document.querySelectorAll("[data-atlas-build]").forEach(function (element) {
      element.textContent = label();
    });

    document.querySelectorAll("[data-atlas-system-version]").forEach(function (element) {
      element.textContent = build.module + " " + build.version;
    });

    document.documentElement.setAttribute("data-atlas-version", build.version);
    ensureGlobalStamp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})(window, document);
