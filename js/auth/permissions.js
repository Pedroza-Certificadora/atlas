/* Atlas AASS v1.0 - matriz configuravel de perfis e permissoes */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};

  var STORAGE_KEY = "atlas_aass_permission_matrix";
  var catalog = Object.freeze([
    { key: "AGR_ACCESS", label: "Acessar Central AGR", group: "Acesso" },
    { key: "CLIENT_ACCESS", label: "Acessar Area do Cliente", group: "Acesso" },
    { key: "OWN_CERTIFICATES_READ", label: "Ver apenas os proprios certificados", group: "Certificados" },
    { key: "CLIENTS_READ", label: "Consultar clientes", group: "Clientes" },
    { key: "CLIENTS_MANAGE", label: "Cadastrar e editar clientes", group: "Clientes" },
    { key: "CERTIFICATES_READ", label: "Consultar certificados", group: "Certificados" },
    { key: "CERTIFICATES_MANAGE", label: "Cadastrar, renovar e editar certificados", group: "Certificados" },
    { key: "AGENDA_READ", label: "Consultar agenda", group: "Operacao" },
    { key: "AGENDA_MANAGE", label: "Gerenciar agenda", group: "Operacao" },
    { key: "AUDIT_READ", label: "Consultar auditoria", group: "Seguranca" },
    { key: "USERS_MANAGE", label: "Criar e administrar usuarios", group: "Configuracoes" },
    { key: "SETTINGS_MANAGE", label: "Alterar configuracoes e permissoes", group: "Configuracoes" }
  ]);

  var defaults = Object.freeze({
    FULL: catalog.map(function (item) { return item.key; }),
    ADMIN: catalog.map(function (item) { return item.key; }),
    AGR: [
      "AGR_ACCESS", "CLIENT_ACCESS", "CLIENTS_READ", "CLIENTS_MANAGE",
      "CERTIFICATES_READ", "CERTIFICATES_MANAGE", "AGENDA_READ",
      "AGENDA_MANAGE", "AUDIT_READ"
    ],
    CLIENTE: ["CLIENT_ACCESS", "OWN_CERTIFICATES_READ"]
  });

  function cloneDefaults() {
    return {
      FULL: defaults.FULL.slice(),
      ADMIN: defaults.ADMIN.slice(),
      AGR: defaults.AGR.slice(),
      CLIENTE: defaults.CLIENTE.slice()
    };
  }

  function readMatrix() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        var merged = cloneDefaults();
        ["AGR", "CLIENTE"].forEach(function (role) {
          if (Array.isArray(saved[role])) merged[role] = saved[role].filter(isKnownPermission);
        });
        return merged;
      }
    } catch (error) {}
    return cloneDefaults();
  }

  function isKnownPermission(permission) {
    return catalog.some(function (item) { return item.key === permission; });
  }

  function writeRole(role, permissions) {
    if (["AGR", "CLIENTE"].indexOf(role) === -1) return false;
    var matrix = readMatrix();
    matrix[role] = permissions.filter(isKnownPermission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ AGR: matrix.AGR, CLIENTE: matrix.CLIENTE }));
    return true;
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return readMatrix();
  }

  function has(role, permission) {
    var matrix = readMatrix();
    return Boolean(matrix[role] && matrix[role].indexOf(permission) !== -1);
  }

  function canAccessPath(role, path) {
    if (path.indexOf("/agr/usuarios") !== -1 || path.indexOf("/agr/configuracoes") !== -1) {
      return has(role, "SETTINGS_MANAGE");
    }
    if (path.indexOf("/agr/") !== -1) return has(role, "AGR_ACCESS");
    if (path.indexOf("/cliente/") !== -1) return has(role, "CLIENT_ACCESS");
    return true;
  }

  function defaultPath(role) {
    return role === "CLIENTE" ? "/cliente/" : "/agr/";
  }

  window.AtlasAuth.permissions = Object.freeze({
    has: has,
    canAccessPath: canAccessPath,
    defaultPath: defaultPath,
    getMatrix: readMatrix,
    setRolePermissions: writeRole,
    reset: reset,
    catalog: catalog
  });
})(window);
