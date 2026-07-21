/* Atlas AASS v1.0 - controle de sessao */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;

  function read() {
    try {
      var session = JSON.parse(localStorage.getItem(config.sessionKey) || "null");
      return session && typeof session === "object" ? session : null;
    } catch (error) {
      return null;
    }
  }

  function write(session) {
    localStorage.setItem(config.sessionKey, JSON.stringify(session));
  }

  function create(user, remember) {
    var now = Date.now();
    var session = {
      token: window.AtlasAuth.crypto.randomId(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      },
      createdAt: now,
      lastActivityAt: now,
      expiresAt: now + config.absoluteTimeoutMs,
      remember: Boolean(remember)
    };

    write(session);
    return session;
  }

  function validate(session) {
    if (!session || !session.user || !session.token) {
      return { valid: false, reason: "missing" };
    }

    var now = Date.now();
    if (now >= Number(session.expiresAt || 0)) {
      return { valid: false, reason: "absolute_timeout" };
    }

    if (now - Number(session.lastActivityAt || 0) >= config.idleTimeoutMs) {
      return { valid: false, reason: "idle_timeout" };
    }

    return { valid: true, reason: "active" };
  }

  function getActive() {
    var session = read();
    var status = validate(session);
    if (!status.valid) {
      if (session) {
        clear(status.reason);
      }
      return null;
    }
    return session;
  }

  function touch() {
    var session = read();
    var status = validate(session);
    if (!status.valid) {
      return false;
    }

    session.lastActivityAt = Date.now();
    write(session);
    return true;
  }

  function clear(reason) {
    var session = read();
    try {
      localStorage.removeItem(config.sessionKey);
    } catch (error) {}

    if (window.AtlasAuth.audit) {
      window.AtlasAuth.audit.record("SESSION_ENDED", {
        reason: reason || "logout",
        username: session && session.user ? session.user.username : null
      });
    }
  }

  window.AtlasAuth.session = Object.freeze({
    read: read,
    create: create,
    validate: validate,
    getActive: getActive,
    touch: touch,
    clear: clear
  });
})(window);
