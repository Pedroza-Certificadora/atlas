/*
  Pedroza Certificadora
  Atlas Authentication & Security System v1.0
  Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
*/
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  window.AtlasAuth.config = Object.freeze({
    version: "4.9.19",
    apiEndpoint: "https://script.google.com/macros/s/AKfycbzWMMaw7qIegy2TeKa8dc0_0g9mui4TD1xwdc7n9XjxJY4EglSEg_PP6K5lm_TD12RZ3Q/exec",
    storagePrefix: "atlas_aass_",
    sessionKey: "atlas_aass_session",
    rememberedUserKey: "atlas_aass_remembered_user",
    auditKey: "atlas_aass_audit",
    failedAttemptsKey: "atlas_aass_failed_attempts",
    usersKey: "atlas_aass_users",
    idleTimeoutMs: 30 * 60 * 1000,
    absoluteTimeoutMs: 8 * 60 * 60 * 1000,
    warningBeforeTimeoutMs: 2 * 60 * 1000,
    maxFailedAttempts: 5,
    lockoutMs: 5 * 60 * 1000,
    loginPath: "/auth/login.html",
    logoutPath: "/auth/logout.html",
    defaultAuthenticatedPath: "/agr/"
  });
})(window);
