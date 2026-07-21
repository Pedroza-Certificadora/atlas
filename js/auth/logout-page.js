/* Atlas AASS v1.0 - logout seguro */
(function (window, document) {
  "use strict";

  window.AtlasAuth.auth.logout("user_logout");
  var message = document.getElementById("logout-message");
  if (message) message.textContent = "Sessão encerrada com segurança.";

  window.setTimeout(function () {
    window.location.replace(window.AtlasAuth.guard.projectUrl("/auth/login.html?reason=session_closed"));
  }, 1200);
})(window, document);
