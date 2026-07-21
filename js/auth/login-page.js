/* Atlas AASS v1.0 - comportamento da tela de login */
(function (window, document) {
  "use strict";

  var form = document.getElementById("auth-login-form");
  if (!form) return;

  var loginInput = document.getElementById("auth-login");
  var passwordInput = document.getElementById("auth-password");
  var rememberInput = document.getElementById("auth-remember");
  var submitButton = document.getElementById("auth-submit");
  var feedback = document.getElementById("auth-feedback");
  var togglePassword = document.getElementById("auth-toggle-password");
  var capsLock = document.getElementById("auth-caps-lock");
  var config = window.AtlasAuth.config;

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function safeReturnPath(role) {
    var target = getParam("return");
    if (!target || target.charAt(0) !== "/" || target.indexOf("//") === 0) {
      return window.AtlasAuth.guard.projectUrl(window.AtlasAuth.permissions.defaultPath(role || "AGR"));
    }
    return target;
  }

  function setFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = "auth-feedback auth-feedback-" + (type || "info");
    feedback.hidden = !message;
  }

  function setLoading(loading) {
    submitButton.disabled = loading;
    submitButton.classList.toggle("is-loading", loading);
    submitButton.querySelector("span").textContent = loading ? "Validando acesso..." : "Entrar com segurança";
  }

  var existingSession = window.AtlasAuth.session.getActive();
  if (existingSession) {
    window.location.replace(safeReturnPath(existingSession.user.role));
    return;
  }

  var remembered = window.AtlasAuth.auth.getRememberedUser();
  if (remembered) {
    loginInput.value = remembered;
    rememberInput.checked = true;
    passwordInput.focus();
  } else {
    loginInput.focus();
  }

  var reason = getParam("reason");
  var reasonMessages = {
    authentication_required: "Entre para acessar a Central AGR.",
    idle_timeout: "Sua sessão foi encerrada por inatividade. Entre novamente.",
    absolute_timeout: "Sua sessão expirou. Entre novamente para continuar.",
    session_closed: "A sessão foi encerrada em outra aba.",
    access_denied: "Seu perfil não possui permissão para acessar essa área."
  };
  if (reasonMessages[reason]) setFeedback(reasonMessages[reason], reason === "access_denied" ? "error" : "info");

  togglePassword.addEventListener("click", function () {
    var showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    togglePassword.setAttribute("aria-pressed", String(!showing));
    togglePassword.textContent = showing ? "Mostrar" : "Ocultar";
    passwordInput.focus();
  });

  passwordInput.addEventListener("keyup", function (event) {
    var enabled = event.getModifierState && event.getModifierState("CapsLock");
    capsLock.hidden = !enabled;
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    setFeedback("", "info");

    if (!form.checkValidity()) {
      setFeedback("Preencha usuário e senha para continuar.", "error");
      form.reportValidity();
      return;
    }

    setLoading(true);
    try {
      var result = await window.AtlasAuth.auth.login(
        loginInput.value,
        passwordInput.value,
        rememberInput.checked
      );

      if (!result.ok) {
        passwordInput.value = "";
        passwordInput.focus();
        if (result.code === "locked" || result.code === "locked_now") {
          setFeedback("Acesso temporariamente bloqueado após tentativas inválidas. Aguarde 5 minutos.", "error");
        } else {
          setFeedback("Usuário ou senha inválidos. Restam " + result.remainingAttempts + " tentativa(s).", "error");
        }
        return;
      }

      if (!window.AtlasAuth.permissions.canAccessPath(result.session.user.role, safeReturnPath(result.session.user.role))) {
        window.AtlasAuth.auth.logout("permission_denied_after_login");
        setFeedback("Este perfil não possui acesso à área solicitada.", "error");
        return;
      }

      setFeedback("Acesso confirmado. Redirecionando...", "success");
      window.setTimeout(function () {
        window.location.replace(safeReturnPath(result.session.user.role));
      }, 350);
    } catch (error) {
      setFeedback(error.message || "Não foi possível validar o acesso neste navegador.", "error");
    } finally {
      setLoading(false);
    }
  });
})(window, document);
