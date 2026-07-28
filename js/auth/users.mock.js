/* Atlas ADF v1.0 - provedor de usuarios com API central e cache de compatibilidade */
(function (window) {
  "use strict";
  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;
  var storage = window.AtlasAuth.storage;
  var preferencesKey = "atlas_aass_user_preferences";

  /* Contas e hashes nunca devem ser distribuídos com o site público. */
  var defaults = [];

  function normalize(value) { return String(value || "").trim().toLowerCase(); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function mergeFactoryAccounts(savedUsers) {
    var users = Array.isArray(savedUsers) ? savedUsers.slice() : [];
    defaults.forEach(function (factoryUser) {
      var existing = users.find(function (user) { return user.id === factoryUser.id || normalize(user.username) === normalize(factoryUser.username); });
      if (!existing) users.push(clone(factoryUser));
      else Object.keys(factoryUser).forEach(function (key) { if (typeof existing[key] === "undefined") existing[key] = factoryUser[key]; });
    });
    return users;
  }
  function read() {
    var saved = storage.readJson(config.usersKey, null);
    var users = mergeFactoryAccounts(saved).map(function (user) {
      var sanitized = Object.assign({}, user);
      delete sanitized.passwordHash;
      return sanitized;
    });
    if (!Array.isArray(saved) || JSON.stringify(saved) !== JSON.stringify(users)) storage.writeJson(config.usersKey, users);
    return users;
  }
  function write(users) { storage.writeJson(config.usersKey, users); }
  function cachePublic(user) {
    var users = read();
    var index = users.findIndex(function (u) { return u.id === user.id || normalize(u.username) === normalize(user.username); });
    var existing = index >= 0 ? users[index] : {};
    var merged = Object.assign({}, existing, user);
    delete merged.passwordHash;
    if (index >= 0) users[index] = merged; else users.push(merged);
    write(users); return merged;
  }
  function findByLogin(login) { var n=normalize(login); return read().find(function(u){return normalize(u.username)===n||normalize(u.email)===n;})||null; }
  function findById(id) { return read().find(function(u){return u.id===id;})||null; }
  function list() { return read().map(function(u){var copy=Object.assign({},u);delete copy.passwordHash;return copy;}); }
  async function sync() {
    if (!(window.AtlasAPI && window.AtlasAPI.isConfigured())) return list();
    var remote = await window.AtlasAPI.listUsers();
    var local = read();
    remote.forEach(function(user){
      cachePublic(user);
    });
    return list();
  }
  async function create(data) {
    var username=String(data.username||"").trim(), email=normalize(data.email), role=String(data.role||"CLIENTE").toUpperCase();
    if(!username||!email||!data.password) throw new Error("Preencha nome de usuário, e-mail e senha.");
    if(["CLIENTE","AGR"].indexOf(role)===-1) throw new Error("Perfil inválido.");
    var doc=String(data.document||"").replace(/\D/g,"");
    var passwordHash=await window.AtlasAuth.crypto.sha256(data.password);
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) {
      var remote=await window.AtlasAPI.createUser({displayName:String(data.displayName||username).trim(),username:username,email:email,document:doc,role:role,passwordHash:passwordHash,actor:window.AtlasAuth.currentUser&&window.AtlasAuth.currentUser.username||"ATLAS"});
      return cachePublic(Object.assign({},remote,{source:"api"}));
    }
    throw new Error("A Atlas API é obrigatória para criar usuários.");
  }
  async function setActive(id,active) {
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) { var remote=await window.AtlasAPI.setUserActive(id,active);cachePublic(remote);return true; }
    throw new Error("A Atlas API é obrigatória para administrar usuários.");
  }
  async function updateProfile(id,data) {
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) { var remote=await window.AtlasAPI.updateProfile(id,data);cachePublic(remote);return remote; }
    throw new Error("A Atlas API é obrigatória para atualizar o perfil.");
  }
  async function changePassword(id,currentPassword,newPassword) {
    var currentHash=await window.AtlasAuth.crypto.sha256(currentPassword||""),nextHash=await window.AtlasAuth.crypto.sha256(newPassword||"");
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) return window.AtlasAPI.changePassword(id,currentHash,nextHash);
    throw new Error("A Atlas API é obrigatória para alterar a senha.");
  }
  function readPreferences(){return storage.readJson(preferencesKey,{});} function getPreferences(id){return Object.assign({expiration:true,email:false,whatsapp:false},readPreferences()[id]||{});} function setPreferences(id,prefs){var all=readPreferences();all[id]=Object.assign({},getPreferences(id),prefs);storage.writeJson(preferencesKey,all);return all[id];}
  window.AtlasAuth.userProvider=Object.freeze({findByLogin:findByLogin,findById:findById,list:list,sync:sync,create:create,setActive:setActive,updateProfile:updateProfile,changePassword:changePassword,getPreferences:getPreferences,setPreferences:setPreferences});
})(window);
