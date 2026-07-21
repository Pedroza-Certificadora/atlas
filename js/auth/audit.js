/* Atlas AASS v1.0 - auditoria local temporaria */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;

  function read() {
    try {
      var parsed = JSON.parse(localStorage.getItem(config.auditKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function record(action, details) {
    var entries = read();
    entries.unshift({
      id: window.AtlasAuth.crypto.randomId(),
      action: action,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      details: details || {}
    });

    try {
      localStorage.setItem(config.auditKey, JSON.stringify(entries.slice(0, 200)));
    } catch (error) {
      // A autenticacao nao deve falhar caso o armazenamento esteja indisponivel.
    }

    if (window.AtlasAPI && window.AtlasAPI.isConfigured()) {
      window.AtlasAPI.audit(action, details || {}).catch(function () {
        // A fila local preserva o evento mesmo quando a API estiver indisponivel.
      });
    }
  }

  window.AtlasAuth.audit = Object.freeze({
    read: read,
    list: read,
    record: record
  });
})(window);
