/* Atlas Build Information System - ABIS */
(function(window,document){
  "use strict";
  var build=Object.freeze({product:"Portal Atlas",sprint:"4.7",module:"ADF",version:"4.7.3",environment:"Produção",publishedAt:"21/07/2026"});
  window.ATLAS_BUILD=build;
  function apply(){
    document.querySelectorAll("[data-atlas-build]").forEach(function(el){el.textContent="Atlas • Sprint "+build.sprint+" • "+build.module+" • v"+build.version;});
    document.querySelectorAll("[data-atlas-system-version]").forEach(function(el){el.textContent=build.module+" "+build.version;});
    document.documentElement.setAttribute("data-atlas-version",build.version);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply);else apply();
})(window,document);
