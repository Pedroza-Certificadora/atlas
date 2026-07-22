/*
 * Atlas Build Information System - ABIS
 * Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
 */
(function (window, document) {
  "use strict";
  var build = Object.freeze({ product: "Portal Atlas", sprint: "4.9 FINAL", module: "CRM Enterprise Gold", version: "4.9.15", environment: "Homologação Final", publishedAt: "22/07/2026" });
  window.ATLAS_BUILD = build;
  function label(){ return "Atlas • Sprint " + build.sprint + " • " + build.module + " • v" + build.version; }
  function ensureGlobalStamp(){ var stamp=document.getElementById("atlas-build-stamp"); if(!stamp){ stamp=document.createElement("div"); stamp.id="atlas-build-stamp"; stamp.className="atlas-build-stamp"; stamp.setAttribute("role","status"); stamp.setAttribute("aria-label","Versão atual do Portal Atlas"); document.body.appendChild(stamp); } stamp.textContent=label(); }
  function ensureInstitutionalId(){
    if(document.querySelector("[data-atlas-institutional-id]")) return;
    var target=document.querySelector(".footer-bottom, .agr-footer-bottom, .client-footer-bottom, footer, .auth-brand-footer") || document.body;
    var line=document.createElement("div");
    line.setAttribute("data-atlas-institutional-id","");
    line.className="atlas-institutional-id";
    line.textContent="Pedroza Certificadora • CNPJ: 57.938.005/0001-87";
    line.style.cssText="margin-top:8px;font-size:12px;line-height:1.5;opacity:.78;text-align:center;";
    target.appendChild(line);
  }
  function apply(){ document.querySelectorAll("[data-atlas-build]").forEach(function(e){e.textContent=label();}); document.querySelectorAll("[data-atlas-system-version]").forEach(function(e){e.textContent=build.module+" "+build.version;}); document.documentElement.setAttribute("data-atlas-version",build.version); ensureGlobalStamp(); ensureInstitutionalId(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",apply,{once:true}); else apply();
})(window, document);
