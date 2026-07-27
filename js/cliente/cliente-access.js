(function () {
  "use strict";

  var form = document.getElementById("cliente-login-form");
  if (!form) return;

  var email = document.getElementById("cliente-login-email");
  var senha = document.getElementById("cliente-login-senha");
  var button = document.getElementById("cliente-login-submit");
  var buttonText = button.querySelector(".portal-login-button-text");
  var buttonLoading = button.querySelector(".portal-login-button-loading");
  var feedback = document.getElementById("cliente-login-feedback");

  function showFeedback(message) {
    feedback.textContent = message;
    feedback.hidden = false;
  }

  function setLoading(active) {
    button.disabled = active;
    email.disabled = active;
    senha.disabled = active;
    buttonText.hidden = active;
    buttonLoading.hidden = !active;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    feedback.hidden = true;

    if (!email.validity.valid || senha.value.length < 8) {
      showFeedback("Informe um e-mail válido e sua senha de acesso.");
      return;
    }

    if (!window.AtlasAPI || !window.AtlasAuth || !window.AtlasAuth.crypto || !window.AtlasAuth.session) {
      showFeedback("O acesso está temporariamente indisponível. A consulta pública continua funcionando abaixo.");
      return;
    }

    setLoading(true);

    window.AtlasAuth.crypto.sha256(senha.value)
      .then(function (hash) {
        return window.AtlasAPI.login(email.value.trim(), hash);
      })
      .then(function (user) {
        if (String(user.role || user.perfil || "").toUpperCase() !== "CLIENTE") {
          throw new Error("Use o acesso exclusivo do cliente.");
        }

        window.AtlasAuth.session.create(user, true);
        window.location.href = "portal/";
      })
      .catch(function (error) {
        var message = error && error.message ? error.message : "Não foi possível entrar no Portal.";
        if (message === "Usuario ou senha invalidos.") message = "E-mail ou senha inválidos.";
        showFeedback(message + " A consulta pública continua disponível abaixo.");
        setLoading(false);
      });
  });
})();
