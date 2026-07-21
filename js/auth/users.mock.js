/* Atlas AASS v1.0 - provedor local de usuarios simulados */
(function (window) {
  "use strict";
  window.AtlasAuth = window.AtlasAuth || {};
  var config = window.AtlasAuth.config;
  var defaults = [
    {id:"usr-full-001",username:"Marcos Pedroza",email:"marcos@pedrozacertificadora.com.br",displayName:"Marcos Pedroza",role:"FULL",passwordHash:"de8311609e1a9c7ec5e60f6a7fa6e4775f6fe38a5c629a3e9c069972a99b64ff",active:true,document:"",certificateOwnerKey:"FULL"},
    {id:"usr-agr-001",username:"agr",email:"agr@pedrozacertificadora.com.br",displayName:"Agente de Registro",role:"AGR",passwordHash:"bff6d586721c27acbf7334005dfa788c2622c6f8e6df22c5e98410a0b659d4a6",active:true,document:"",certificateOwnerKey:"AGR"},
    {id:"usr-cliente-001",username:"cliente",email:"cliente@pedrozacertificadora.com.br",displayName:"Cliente Demonstração",role:"CLIENTE",passwordHash:"57d695d45bc762070820f67ff348037400eeb21d1646820de4b5237358d7230f",active:true,document:"00000000000",certificateOwnerKey:"00000000000"}
  ];
  function normalize(v){return String(v||"").trim().toLowerCase();}
  function read(){
    try { var saved=JSON.parse(localStorage.getItem(config.usersKey)||"null"); if(Array.isArray(saved)) return saved; } catch(e){}
    localStorage.setItem(config.usersKey,JSON.stringify(defaults)); return defaults.slice();
  }
  function write(users){localStorage.setItem(config.usersKey,JSON.stringify(users));}
  function findByLogin(login){var n=normalize(login);return read().find(function(u){return normalize(u.username)===n||normalize(u.email)===n;})||null;}
  function list(){return read().map(function(u){var c=Object.assign({},u);delete c.passwordHash;return c;});}
  async function create(data){
    var users=read(), username=String(data.username||"").trim(), email=normalize(data.email), role=String(data.role||"CLIENTE").toUpperCase();
    if(!username||!email||!data.password) throw new Error("Preencha nome de usuário, e-mail e senha.");
    if(["CLIENTE","AGR"].indexOf(role)===-1) throw new Error("Perfil inválido.");
    if(users.some(function(u){return normalize(u.username)===normalize(username)||normalize(u.email)===email;})) throw new Error("Já existe uma conta com este usuário ou e-mail.");
    var user={id:"usr-"+Date.now(),username:username,email:email,displayName:String(data.displayName||username).trim(),role:role,passwordHash:await window.AtlasAuth.crypto.sha256(data.password),active:true,document:String(data.document||"").replace(/\D/g,""),certificateOwnerKey:String(data.document||"").replace(/\D/g,"")};
    users.push(user);write(users);return user;
  }
  function setActive(id,active){var users=read(),u=users.find(function(x){return x.id===id;});if(!u||u.role==="FULL")return false;u.active=Boolean(active);write(users);return true;}
  window.AtlasAuth.userProvider=Object.freeze({findByLogin:findByLogin,list:list,create:create,setActive:setActive});
})(window);
