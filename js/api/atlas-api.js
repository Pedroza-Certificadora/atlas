/*
  Pedroza Certificadora
  Atlas Data Foundation v1.0 - Cliente unico da Atlas API
  Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
*/
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config || {};

  function endpoint() {
    return String(config.apiEndpoint || "").trim();
  }

  function isConfigured() {
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/.test(endpoint());
  }

  async function request(action, payload, options) {
    if (!isConfigured()) {
      var error = new Error("Atlas API ainda nao configurada.");
      error.code = "API_NOT_CONFIGURED";
      throw error;
    }

    var body = {
      action: action,
      payload: payload || {},
      authToken: (function () {
        try {
          var session = window.AtlasAuth && window.AtlasAuth.session ? window.AtlasAuth.session.read() : null;
          return session && session.apiToken ? session.apiToken : "";
        } catch (error) { return ""; }
      })(),
      client: {
        version: config.version || "4.7.0",
        path: window.location.pathname,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo"
      }
    };

    var response = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "follow",
      signal: options && options.signal
    });

    if (!response.ok) throw new Error("Falha de comunicacao com a Atlas API (HTTP " + response.status + ").");
    var result = await response.json();
    if (!result || result.ok !== true) {
      var apiError = new Error((result && result.message) || "A Atlas API recusou a operacao.");
      apiError.code = (result && result.code) || "API_ERROR";
      throw apiError;
    }
    return result.data;
  }

  window.AtlasAPI = Object.freeze({
    isConfigured: isConfigured,
    request: request,
    health: function () { return request("health"); },
    login: function (login, passwordHash) { return request("auth.login", { login: login, passwordHash: passwordHash }); },
    listUsers: function () { return request("users.list"); },
    createUser: function (data) { return request("users.create", data); },
    setUserActive: function (id, active) { return request("users.setActive", { id: id, active: active }); },
    updateProfile: function (id, data) { return request("users.updateProfile", { id: id, data: data }); },
    changePassword: function (id, currentHash, newHash) { return request("users.changePassword", { id: id, currentHash: currentHash, newHash: newHash }); },
    getPreferences: function (id) { return request("users.getPreferences", { id: id }); },
    setPreferences: function (id, preferences) { return request("users.setPreferences", { id: id, preferences: preferences }); },
    audit: function (action, details) { return request("audit.record", { action: action, details: details || {} }); },
    dashboard: function () { return request("dashboard.summary"); }
  });
})(window);
