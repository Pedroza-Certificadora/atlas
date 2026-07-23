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
        version: config.version || "4.8.1",
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
    listClients: function () { return request("clients.list"); },
    createClient: function (data) { return request("clients.create", data); },
    updateClient: function (id, data) { return request("clients.update", { id: id, data: data }); },
    listCertificates: function () { return request("certificates.list"); },
    createCertificate: function (data) { return request("certificates.create", data); },
    updateCertificate: function (id, data) { return request("certificates.update", { id: id, data: data }); },
    dashboard: function () { return request("dashboard.summary"); },
    getClient: function (id) { return request("clients.get", { id: id }); },
    listTimeline: function (filters) { return request("timeline.list", filters || {}); },
    addTimeline: function (data) { return request("timeline.add", data); },
    listCommunications: function (filters) { return request("communications.list", filters || {}); },
    createCommunication: function (data) { return request("communications.create", data); },
    sendCommunication: function (data) { return request("communications.send", data); },
    listModels: function () { return request("models.list"); },
    listCampaigns: function () { return request("campaigns.list"); },
    createCampaign: function (data) { return request("campaigns.create", data); },
    previewCampaign: function (filtro) { return request("campaigns.preview", { filtro: filtro || {} }); },
    automationStatus: function () { return request("automation.status"); },
    configureAutomation: function (data) { return request("automation.configure", data || {}); },
    testAutomationEmail: function (email) { return request("automation.test", { email: email }); },
    runAutomation: function () { return request("automation.run", { source: "MANUAL" }); },
    installAutomationTriggers: function () { return request("automation.installTriggers"); },
    removeAutomationTriggers: function () { return request("automation.removeTriggers"); },
    generateInvite: function (data) { return request("invites.generate", data); },
    validateInvite: function (token) { return request("invites.validate", { token: token }); },
    listSectors: function () { return request("sectors.list"); },
    listTags: function () { return request("tags.list"); }
  });
})(window);
