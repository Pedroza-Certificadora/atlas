/* Atlas ADF v1.0 - provedor de usuarios com API central e cache de compatibilidade */
(function (window) {
  "use strict";
  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;
  var storage = window.AtlasAuth.storage;
  var preferencesKey = "atlas_aass_user_preferences";

  var defaults = [
    {id:"usr-full-001",username:"Marcos Pedroza",email:"marcos@pedrozacertificadora.com.br",displayName:"Marcos Pedroza",role:"FULL",passwordHash:"de8311609e1a9c7ec5e60f6a7fa6e4775f6fe38a5c629a3e9c069972a99b64ff",active:true,document:"",certificateOwnerKey:"FULL",phone:""},
    {id:"usr-agr-001",username:"agr",email:"agr@pedrozacertificadora.com.br",displayName:"Agente de Registro",role:"AGR",passwordHash:"bff6d586721c27acbf7334005dfa788c2622c6f8e6df22c5e98410a0b659d4a6",active:true,document:"",certificateOwnerKey:"AGR",phone:""},
    {id:"usr-cliente-001",username:"cliente",email:"cliente@pedrozacertificadora.com.br",displayName:"Cliente Demonstração",role:"CLIENTE",passwordHash:"57d695d45bc762070820f67ff348037400eeb21d1646820de4b5237358d7230f",active:true,document:"00000000000",certificateOwnerKey:"00000000000",phone:""}
  ];

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
    var users = mergeFactoryAccounts(saved);
    if (!Array.isArray(saved) || JSON.stringify(saved) !== JSON.stringify(users)) storage.writeJson(config.usersKey, users);
    return users;
  }
  function write(users) { storage.writeJson(config.usersKey, users); }
  function cachePublic(user) {
    var users = read();
    var index = users.findIndex(function (u) { return u.id === user.id || normalize(u.username) === normalize(user.username); });
    var existing = index >= 0 ? users[index] : {};
    var merged = Object.assign({}, existing, user);
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
      var old = local.find(function(u){return u.id===user.id||normalize(u.username)===normalize(user.username);});
      cachePublic(Object.assign({}, old && old.passwordHash ? {passwordHash:old.passwordHash}: {}, user));
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
      return cachePublic(Object.assign({},remote,{passwordHash:passwordHash,source:"api"}));
    }
    var users=read();
    if(users.some(function(u){return normalize(u.username)===normalize(username)||normalize(u.email)===email;})) throw new Error("Já existe uma conta com este usuário ou e-mail.");
    var user={id:"usr-"+Date.now(),username:username,email:email,displayName:String(data.displayName||username).trim(),role:role,passwordHash:passwordHash,active:true,document:doc,certificateOwnerKey:doc,phone:"",createdAt:Date.now(),source:"local"};
    users.push(user);write(users);return user;
  }
  async function setActive(id,active) {
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) { var remote=await window.AtlasAPI.setUserActive(id,active);cachePublic(remote);return true; }
    var users=read(),user=users.find(function(item){return item.id===id;});if(!user||user.role==="FULL")return false;user.active=Boolean(active);write(users);return true;
  }
  async function updateProfile(id,data) {
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) { var remote=await window.AtlasAPI.updateProfile(id,data);cachePublic(remote);return remote; }
    var users=read(),user=users.find(function(item){return item.id===id;});if(!user)throw new Error("Usuário não encontrado.");user.displayName=String(data.displayName||"").trim();user.email=normalize(data.email);user.phone=String(data.phone||"").trim();write(users);return Object.assign({},user);
  }
  async function changePassword(id,currentPassword,newPassword) {
    var currentHash=await window.AtlasAuth.crypto.sha256(currentPassword||""),nextHash=await window.AtlasAuth.crypto.sha256(newPassword||"");
    if(window.AtlasAPI&&window.AtlasAPI.isConfigured()) return window.AtlasAPI.changePassword(id,currentHash,nextHash);
    var users=read(),user=users.find(function(item){return item.id===id;});if(!user)throw new Error("Usuário não encontrado.");if(currentHash!==user.passwordHash)throw new Error("A senha atual está incorreta.");user.passwordHash=nextHash;write(users);return true;
  }
  function readPreferences(){return storage.readJson(preferencesKey,{});} function getPreferences(id){return Object.assign({expiration:true,email:false,whatsapp:false},readPreferences()[id]||{});} function setPreferences(id,prefs){var all=readPreferences();all[id]=Object.assign({},getPreferences(id),prefs);storage.writeJson(preferencesKey,all);return all[id];}
  window.AtlasAuth.userProvider=Object.freeze({findByLogin:findByLogin,findById:findById,list:list,sync:sync,create:create,setActive:setActive,updateProfile:updateProfile,changePassword:changePassword,getPreferences:getPreferences,setPreferences:setPreferences});
})(window);
