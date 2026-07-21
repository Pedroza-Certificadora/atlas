/* Atlas AASS v1.0 - servico de autenticacao */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;

  function readAttemptMap() {
    try { return JSON.parse(localStorage.getItem(config.failedAttemptsKey) || "{}"); }
    catch (error) { return {}; }
  }

  function readAttempts(login) {
    return readAttemptMap()[String(login || "").toLowerCase()] || { count: 0, lockedUntil: 0 };
  }

  function writeAttempts(login, attempts) {
    var map = readAttemptMap();
    map[String(login || "").toLowerCase()] = attempts;
    localStorage.setItem(config.failedAttemptsKey, JSON.stringify(map));
  }

  async function login(loginValue, password, remember) {
    var loginName = String(loginValue || "").trim();
    var attempts = readAttempts(loginName);
    var now = Date.now();

    if (attempts.lockedUntil > now) {
      return { ok: false, code: "locked", remainingSeconds: Math.ceil((attempts.lockedUntil - now) / 1000) };
    }

    var user = window.AtlasAuth.userProvider.findByLogin(loginName);
    var passwordHash = await window.AtlasAuth.crypto.sha256(password || "");

    if (!user || !user.active || user.passwordHash !== passwordHash) {
      var count = attempts.count + 1;
      var lockedUntil = count >= config.maxFailedAttempts ? now + config.lockoutMs : 0;
      writeAttempts(loginName, { count: count, lockedUntil: lockedUntil });
      window.AtlasAuth.audit.record("LOGIN_FAILED", { login: loginName, attempts: count, locked: Boolean(lockedUntil) });
      return { ok: false, code: lockedUntil ? "locked_now" : "invalid", remainingAttempts: Math.max(0, config.maxFailedAttempts - count) };
    }

    writeAttempts(loginName, { count: 0, lockedUntil: 0 });
    var activeSession = window.AtlasAuth.session.create(user, remember);
    if (remember) localStorage.setItem(config.rememberedUserKey, user.username);
    else localStorage.removeItem(config.rememberedUserKey);
    window.AtlasAuth.audit.record("LOGIN_SUCCESS", { username: user.username, role: user.role });
    return { ok: true, session: activeSession };
  }

  function logout(reason) { window.AtlasAuth.session.clear(reason || "logout"); }
  function getRememberedUser() { return localStorage.getItem(config.rememberedUserKey) || ""; }

  window.AtlasAuth.auth = Object.freeze({ login: login, logout: logout, getRememberedUser: getRememberedUser });
})(window);
