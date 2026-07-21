/* Atlas AASS v1.0 - servico de autenticacao */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;

  function readAttempts(login) {
    try {
      var map = JSON.parse(localStorage.getItem(config.failedAttemptsKey) || "{}");
      return map[String(login || "").toLowerCase()] || { count: 0, lockedUntil: 0 };
    } catch (error) {
      return { count: 0, lockedUntil: 0 };
    }
  }

  function writeAttempts(login, attempts) {
    var map = {};
    try {
      map = JSON.parse(localStorage.getItem(config.failedAttemptsKey) || "{}");
    } catch (error) {}
    map[String(login || "").toLowerCase()] = attempts;
    localStorage.setItem(config.failedAttemptsKey, JSON.stringify(map));
  }

  function clearAttempts(login) {
    writeAttempts(login, { count: 0, lockedUntil: 0 });
  }

  async function login(loginValue, password, remember) {
    var login = String(loginValue || "").trim();
    var attempts = readAttempts(login);
    var now = Date.now();

    if (attempts.lockedUntil > now) {
      var seconds = Math.ceil((attempts.lockedUntil - now) / 1000);
      window.AtlasAuth.audit.record("LOGIN_BLOCKED", { login: login, remainingSeconds: seconds });
      return { ok: false, code: "locked", remainingSeconds: seconds };
    }

    var user = window.AtlasAuth.userProvider.findByLogin(login);
    var passwordHash = await window.AtlasAuth.crypto.sha256(password || "");

    if (!user || !user.active || user.passwordHash !== passwordHash) {
      var nextCount = attempts.count + 1;
      var lockedUntil = nextCount >= config.maxFailedAttempts ? now + config.lockoutMs : 0;
      writeAttempts(login, { count: nextCount, lockedUntil: lockedUntil });
      window.AtlasAuth.audit.record("LOGIN_FAILED", {
        login: login,
        attempts: nextCount,
        locked: Boolean(lockedUntil)
      });
      return {
        ok: false,
        code: lockedUntil ? "locked_now" : "invalid",
        remainingAttempts: Math.max(0, config.maxFailedAttempts - nextCount)
      };
    }

    clearAttempts(login);
    var session = window.AtlasAuth.session.create(user, remember);

    if (remember) {
      localStorage.setItem(config.rememberedUserKey, user.username);
    } else {
      localStorage.removeItem(config.rememberedUserKey);
    }

    window.AtlasAuth.audit.record("LOGIN_SUCCESS", {
      username: user.username,
      role: user.role
    });

    return { ok: true, session: session };
  }

  function logout(reason) {
    window.AtlasAuth.session.clear(reason || "logout");
  }

  function getRememberedUser() {
    return localStorage.getItem(config.rememberedUserKey) || "";
  }

  window.AtlasAuth.auth = Object.freeze({
    login: login,
    logout: logout,
    getRememberedUser: getRememberedUser
  });
})(window);
