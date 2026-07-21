/*
  Atlas AASS v1.0
  Usuarios simulados para homologacao da Sprint 4.6.
  Substituir este provedor pelo adaptador de API na Sprint 4.7.
*/
(function (window) {
  "use strict";

  window.AtlasAuth = window.AtlasAuth || {};

  var users = [
    {
      id: "usr-admin-001",
      username: "admin",
      email: "admin@pedrozacertificadora.com.br",
      displayName: "Administrador Atlas",
      role: "ADMIN",
      passwordHash: "4c711ec213998a26dd3a8a6a940988689e1abc2cf9e9ea94df556afa5d8c620d",
      active: true
    },
    {
      id: "usr-agr-001",
      username: "agr",
      email: "agr@pedrozacertificadora.com.br",
      displayName: "Agente de Registro",
      role: "AGR",
      passwordHash: "bff6d586721c27acbf7334005dfa788c2622c6f8e6df22c5e98410a0b659d4a6",
      active: true
    },
    {
      id: "usr-cliente-001",
      username: "cliente",
      email: "cliente@pedrozacertificadora.com.br",
      displayName: "Cliente Demonstracao",
      role: "CLIENTE",
      passwordHash: "57d695d45bc762070820f67ff348037400eeb21d1646820de4b5237358d7230f",
      active: true
    }
  ];

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function findByLogin(login) {
    var normalized = normalize(login);
    return users.find(function (user) {
      return normalize(user.username) === normalized || normalize(user.email) === normalized;
    }) || null;
  }

  window.AtlasAuth.userProvider = Object.freeze({
    findByLogin: findByLogin
  });
})(window);
