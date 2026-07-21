(function (window, document) {
  "use strict";

  var form = document.getElementById("user-create-form");
  var list = document.getElementById("users-list");
  var feedback = document.getElementById("user-feedback");
  var matrixBody = document.getElementById("permission-matrix-body");
  var permissionsFeedback = document.getElementById("permissions-feedback");

  if (!form) return;

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character];
    });
  }

  function message(target, text, ok) {
    target.textContent = text;
    target.className = "users-feedback " + (ok ? "ok" : "error");
    target.hidden = false;
  }

  function renderUsers() {
    var users = window.AtlasAuth.userProvider.list();
    list.innerHTML = users.map(function (user) {
      return '<article class="user-row"><div><strong>' + esc(user.displayName) + '</strong><span>' +
        esc(user.username) + ' · ' + esc(user.email) + '</span><small>' + esc(user.role) +
        (user.document ? ' · ' + esc(user.document) : '') + '</small></div><div><span class="user-status ' +
        (user.active ? 'is-active' : 'is-inactive') + '">' + (user.active ? 'Ativo' : 'Inativo') +
        '</span>' + (user.role === 'FULL' ? '<span class="full-lock">Acesso total</span>' :
        '<button class="user-toggle" data-id="' + esc(user.id) + '" data-active="' + String(user.active) + '">' +
        (user.active ? 'Desativar' : 'Ativar') + '</button>') + '</div></article>';
    }).join("");
  }

  function renderPermissions() {
    var matrix = window.AtlasAuth.permissions.getMatrix();
    matrixBody.innerHTML = window.AtlasAuth.permissions.catalog.map(function (permission) {
      var fullChecked = matrix.FULL.indexOf(permission.key) !== -1;
      var agrChecked = matrix.AGR.indexOf(permission.key) !== -1;
      var clientChecked = matrix.CLIENTE.indexOf(permission.key) !== -1;
      return '<tr><td><strong>' + esc(permission.label) + '</strong><small>' + esc(permission.group) + '</small></td>' +
        '<td><label class="permission-check is-locked"><input type="checkbox" checked disabled><span></span></label></td>' +
        '<td><label class="permission-check"><input type="checkbox" data-role="AGR" data-permission="' + esc(permission.key) + '" ' + (agrChecked ? 'checked' : '') + '><span></span></label></td>' +
        '<td><label class="permission-check"><input type="checkbox" data-role="CLIENTE" data-permission="' + esc(permission.key) + '" ' + (clientChecked ? 'checked' : '') + '><span></span></label></td></tr>';
    }).join("");
  }

  function selectedFor(role) {
    return Array.prototype.slice.call(matrixBody.querySelectorAll('input[data-role="' + role + '"]:checked')).map(function (input) {
      return input.getAttribute("data-permission");
    });
  }

  document.getElementById("permissions-save").addEventListener("click", function () {
    window.AtlasAuth.permissions.setRolePermissions("AGR", selectedFor("AGR"));
    window.AtlasAuth.permissions.setRolePermissions("CLIENTE", selectedFor("CLIENTE"));
    window.AtlasAuth.audit.record("PERMISSIONS_UPDATED", {
      by: window.AtlasAuth.currentUser.username,
      agr: selectedFor("AGR"),
      cliente: selectedFor("CLIENTE")
    });
    message(permissionsFeedback, "Permissoes salvas com sucesso.", true);
  });

  document.getElementById("permissions-reset").addEventListener("click", function () {
    window.AtlasAuth.permissions.reset();
    renderPermissions();
    window.AtlasAuth.audit.record("PERMISSIONS_RESET", { by: window.AtlasAuth.currentUser.username });
    message(permissionsFeedback, "Matriz padrao restaurada.", true);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var role = document.getElementById("u-role").value;
    var documentValue = document.getElementById("u-document").value.replace(/\D/g, "");
    if (role === "CLIENTE" && !documentValue) {
      message(feedback, "Informe o CPF ou CNPJ que vinculara os certificados deste cliente.", false);
      return;
    }
    try {
      var user = await window.AtlasAuth.userProvider.create({
        displayName: document.getElementById("u-name").value,
        username: document.getElementById("u-username").value,
        email: document.getElementById("u-email").value,
        document: documentValue,
        role: role,
        password: document.getElementById("u-password").value
      });
      window.AtlasAuth.audit.record("USER_CREATED", { createdUser: user.username, role: user.role, by: window.AtlasAuth.currentUser.username });
      form.reset();
      message(feedback, "Conta criada com sucesso.", true);
      renderUsers();
    } catch (error) {
      message(feedback, error.message || "Nao foi possivel criar a conta.", false);
    }
  });

  list.addEventListener("click", function (event) {
    var button = event.target.closest(".user-toggle");
    if (!button) return;
    var active = button.getAttribute("data-active") === "true";
    window.AtlasAuth.userProvider.setActive(button.getAttribute("data-id"), !active);
    window.AtlasAuth.audit.record("USER_STATUS_CHANGED", { userId: button.getAttribute("data-id"), active: !active, by: window.AtlasAuth.currentUser.username });
    renderUsers();
  });

  document.getElementById("users-refresh").addEventListener("click", renderUsers);
  renderPermissions();
  renderUsers();
})(window, document);
