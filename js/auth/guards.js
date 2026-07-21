/* Atlas AASS v1.0 - guardas de rota e monitor de sessao */
(function (window, document) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;
  var session = window.AtlasAuth.session.getActive();
  var currentPath = window.location.pathname;

  function basePrefix() {
    var path = window.location.pathname;
    var knownSegments = ["/auth/", "/agr/", "/cliente/", "/blog/"];
    for (var i = 0; i < knownSegments.length; i += 1) {
      var index = path.indexOf(knownSegments[i]);
      if (index >= 0) {
        return path.slice(0, index);
      }
    }
    return path.replace(/\/[^/]*$/, "");
  }

  function projectUrl(path) {
    return basePrefix() + path;
  }

  function loginUrl(reason) {
    var target = currentPath + window.location.search + window.location.hash;
    var url = projectUrl(config.loginPath) + "?return=" + encodeURIComponent(target);
    if (reason) {
      url += "&reason=" + encodeURIComponent(reason);
    }
    return url;
  }

  function reveal() {
    document.documentElement.classList.remove("auth-check-pending");
  }

  var redirecting = false;

  function deny(reason) {
    if (redirecting) return;
    redirecting = true;
    window.location.replace(loginUrl(reason || "authentication_required"));
  }

  function applyIdentity(activeSession) {
    var nameTargets = document.querySelectorAll("[data-auth-user-name]");
    var roleTargets = document.querySelectorAll("[data-auth-user-role]");
    nameTargets.forEach(function (target) {
      target.textContent = activeSession.user.displayName;
    });
    roleTargets.forEach(function (target) {
      target.textContent = activeSession.user.role;
    });
  }

  function monitor(activeSession) {
    var lastTouch = 0;
    var warningShown = false;
    var activityEvents = ["click", "keydown", "mousemove", "touchstart", "scroll"];

    function onActivity() {
      var now = Date.now();
      if (now - lastTouch > 15000) {
        window.AtlasAuth.session.touch();
        lastTouch = now;
        warningShown = false;
      }
    }

    activityEvents.forEach(function (eventName) {
      document.addEventListener(eventName, onActivity, { passive: true });
    });

    window.setInterval(function () {
      var stored = window.AtlasAuth.session.read();
      var status = window.AtlasAuth.session.validate(stored);
      if (!status.valid) {
        window.AtlasAuth.session.clear(status.reason);
        deny(status.reason);
        return;
      }

      var idleRemaining = config.idleTimeoutMs - (Date.now() - stored.lastActivityAt);
      if (!warningShown && idleRemaining <= config.warningBeforeTimeoutMs) {
        warningShown = true;
        window.dispatchEvent(new CustomEvent("atlas:session-warning", {
          detail: { remainingMs: Math.max(0, idleRemaining) }
        }));
      }
    }, 10000);

    window.addEventListener("storage", function (event) {
      if (event.key === config.sessionKey && !event.newValue) {
        deny("session_closed");
      }
    });

    applyIdentity(activeSession);
  }

  var protectedPage = document.documentElement.hasAttribute("data-auth-protected");
  var requiredPermission = document.documentElement.getAttribute("data-auth-permission");

  if (protectedPage) {
    if (!session) {
      deny("authentication_required");
      return;
    }

    if (requiredPermission && !window.AtlasAuth.permissions.has(session.user.role, requiredPermission)) {
      window.AtlasAuth.audit.record("ACCESS_DENIED", {
        username: session.user.username,
        role: session.user.role,
        permission: requiredPermission,
        path: currentPath
      });
      deny("access_denied");
      return;
    }

    monitor(session);
    window.AtlasAuth.audit.record("PROTECTED_PAGE_VIEW", {
      username: session.user.username,
      role: session.user.role,
      path: currentPath
    });
  }

  window.AtlasAuth.guard = Object.freeze({
    projectUrl: projectUrl,
    loginUrl: loginUrl,
    session: session
  });

  reveal();
})(window, document);
