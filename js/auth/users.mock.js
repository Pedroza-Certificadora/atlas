/* Atlas AASS v1.0 - provedor local de usuarios com migracao nao destrutiva */
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
      var existing = users.find(function (user) {
        return user.id === factoryUser.id || normalize(user.username) === normalize(factoryUser.username);
      });
      if (!existing) {
        users.push(clone(factoryUser));
        return;
      }
      Object.keys(factoryUser).forEach(function (key) {
        if (typeof existing[key] === "undefined") existing[key] = factoryUser[key];
      });
    });
    return users;
  }

  function read() {
    var saved = storage.readJson(config.usersKey, null);
    var users = mergeFactoryAccounts(saved);
    if (!Array.isArray(saved) || JSON.stringify(saved) !== JSON.stringify(users)) {
      storage.writeJson(config.usersKey, users);
    }
    return users;
  }

  function write(users) { storage.writeJson(config.usersKey, users); }
  function findByLogin(login) { var n = normalize(login); return read().find(function (u) { return normalize(u.username) === n || normalize(u.email) === n; }) || null; }
  function findById(id) { return read().find(function (u) { return u.id === id; }) || null; }
  function list() { return read().map(function (u) { var copy = Object.assign({}, u); delete copy.passwordHash; return copy; }); }

  async function create(data) {
    var users = read();
    var username = String(data.username || "").trim();
    var email = normalize(data.email);
    var role = String(data.role || "CLIENTE").toUpperCase();
    if (!username || !email || !data.password) throw new Error("Preencha nome de usuário, e-mail e senha.");
    if (["CLIENTE", "AGR"].indexOf(role) === -1) throw new Error("Perfil inválido.");
    if (users.some(function (u) { return normalize(u.username) === normalize(username) || normalize(u.email) === email; })) throw new Error("Já existe uma conta com este usuário ou e-mail.");
    var doc = String(data.document || "").replace(/\D/g, "");
    var user = {id:"usr-" + Date.now(),username:username,email:email,displayName:String(data.displayName || username).trim(),role:role,passwordHash:await window.AtlasAuth.crypto.sha256(data.password),active:true,document:doc,certificateOwnerKey:doc,phone:"",createdAt:Date.now(),source:"user"};
    users.push(user); write(users); return user;
  }

  function setActive(id, active) { var users = read(), user = users.find(function (item) { return item.id === id; }); if (!user || user.role === "FULL") return false; user.active = Boolean(active); write(users); return true; }

  function updateProfile(id, data) {
    var users = read(), user = users.find(function (item) { return item.id === id; });
    if (!user) throw new Error("Usuário não encontrado.");
    var name = String(data.displayName || "").trim(), email = normalize(data.email), phone = String(data.phone || "").trim();
    if (!name || !email) throw new Error("Informe nome e e-mail válidos.");
    if (users.some(function (item) { return item.id !== id && normalize(item.email) === email; })) throw new Error("Este e-mail já está em uso.");
    user.displayName = name; user.email = email; user.phone = phone; user.updatedAt = Date.now(); write(users); return Object.assign({}, user);
  }

  async function changePassword(id, currentPassword, newPassword) {
    var users = read(), user = users.find(function (item) { return item.id === id; });
    if (!user) throw new Error("Usuário não encontrado.");
    var currentHash = await window.AtlasAuth.crypto.sha256(currentPassword || "");
    if (currentHash !== user.passwordHash) throw new Error("A senha atual está incorreta.");
    var nextHash = await window.AtlasAuth.crypto.sha256(newPassword || "");
    if (nextHash === user.passwordHash) throw new Error("A nova senha deve ser diferente da senha atual.");
    user.passwordHash = nextHash; user.passwordChangedAt = Date.now(); user.source = user.source || "user"; write(users); return true;
  }

  function readPreferences() { return storage.readJson(preferencesKey, {}); }
  function getPreferences(id) { return Object.assign({expiration:true,email:false,whatsapp:false}, readPreferences()[id] || {}); }
  function setPreferences(id, prefs) { var all = readPreferences(); all[id] = Object.assign({}, getPreferences(id), prefs); storage.writeJson(preferencesKey, all); return all[id]; }

  window.AtlasAuth.userProvider = Object.freeze({findByLogin:findByLogin,findById:findById,list:list,create:create,setActive:setActive,updateProfile:updateProfile,changePassword:changePassword,getPreferences:getPreferences,setPreferences:setPreferences});
})(window);
