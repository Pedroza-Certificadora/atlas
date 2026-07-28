/* Atlas AASS v1.0 - logout seguro */
(function (window, document) {
  "use strict";

  window.AtlasAuth.auth.logout("user_logout");
  try { localStorage.setItem("atlas_security_logout_marker", String(Date.now())); } catch (error) {}
  var sensitivePrefixes = ["atlas.shared.", "atlas_aass_users", "atlas_aass_audit"];
  function purgeSensitiveData() {
    try {
      for (var index = localStorage.length - 1; index >= 0; index -= 1) {
        var key = localStorage.key(index);
        if (key && sensitivePrefixes.some(function (prefix) { return key.indexOf(prefix) === 0; })) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {}
  }
  purgeSensitiveData();
  window.setTimeout(purgeSensitiveData, 0);
  window.setTimeout(purgeSensitiveData, 250);
  window.setTimeout(purgeSensitiveData, 1000);
  var message = document.getElementById("logout-message");
  if (message) message.textContent = "Sessão encerrada com segurança.";

  window.setTimeout(function () {
    window.location.replace(window.AtlasAuth.guard.projectUrl("/auth/login.html?reason=session_closed"));
  }, 1200);
})(window, document);
