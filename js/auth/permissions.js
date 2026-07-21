/* Atlas AASS v1.0 - perfis e permissoes */
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};

  var matrix = Object.freeze({
    ADMIN: ["AGR_ACCESS", "CLIENT_ACCESS", "AUDIT_READ", "SETTINGS_MANAGE"],
    AGR: ["AGR_ACCESS", "CLIENT_ACCESS"],
    CLIENTE: ["CLIENT_ACCESS"]
  });

  function has(role, permission) {
    return Boolean(matrix[role] && matrix[role].indexOf(permission) !== -1);
  }

  function canAccessPath(role, pathname) {
    if (pathname.indexOf("/agr/") !== -1) {
      return has(role, "AGR_ACCESS");
    }

    if (pathname.indexOf("/cliente/") !== -1) {
      return has(role, "CLIENT_ACCESS");
    }

    return true;
  }

  window.AtlasAuth.permissions = Object.freeze({
    has: has,
    canAccessPath: canAccessPath,
    matrix: matrix
  });
})(window);
