/* Atlas AASS v1.0 - componentes de sessao em paginas protegidas */
(function (window, document) {
  "use strict";

  var activeSession = window.AtlasAuth.session.getActive();
  if (activeSession) {
    document.querySelectorAll("[data-auth-user-name]").forEach(function (target) {
      target.textContent = activeSession.user.displayName;
    });
    document.querySelectorAll("[data-auth-user-role]").forEach(function (target) {
      target.textContent = activeSession.user.role;
    });
  }

  var logoutButtons = document.querySelectorAll("[data-auth-logout]");
  logoutButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = window.AtlasAuth.guard.projectUrl("/auth/logout.html");
    });
  });

  var warning = document.getElementById("auth-session-warning");
  var continueButton = document.getElementById("auth-session-continue");
  var exitButton = document.getElementById("auth-session-exit");
  var countdown = document.getElementById("auth-session-countdown");
  var countdownTimer = null;

  function hideWarning() {
    if (!warning) return;
    warning.hidden = true;
    document.body.classList.remove("auth-modal-open");
    if (countdownTimer) window.clearInterval(countdownTimer);
  }

  window.addEventListener("atlas:session-warning", function (event) {
    if (!warning) return;
    var remaining = event.detail.remainingMs;
    warning.hidden = false;
    document.body.classList.add("auth-modal-open");

    function render() {
      var seconds = Math.max(0, Math.ceil(remaining / 1000));
      var minutes = Math.floor(seconds / 60);
      var rest = String(seconds % 60).padStart(2, "0");
      if (countdown) countdown.textContent = minutes + ":" + rest;
      remaining -= 1000;
    }

    render();
    countdownTimer = window.setInterval(render, 1000);
  });

  if (continueButton) {
    continueButton.addEventListener("click", function () {
      window.AtlasAuth.session.touch();
      hideWarning();
    });
  }

  if (exitButton) {
    exitButton.addEventListener("click", function () {
      window.location.href = window.AtlasAuth.guard.projectUrl("/auth/logout.html");
    });
  }
})(window, document);
