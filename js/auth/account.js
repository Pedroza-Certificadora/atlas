/* Atlas AASS v1.0 - Minha Conta e Segurança */
(function(window,document){
  "use strict";
  var session=window.AtlasAuth.session.getActive();
  if(!session)return;
  var user=session.user;
  var $=function(id){return document.getElementById(id);};
  function feedback(el,message,type){el.textContent=message;el.className="account-feedback "+type;el.hidden=false;}
  function switchTab(name){document.querySelectorAll("[data-account-tab]").forEach(function(b){b.classList.toggle("active",b.dataset.accountTab===name);});document.querySelectorAll("[data-account-panel]").forEach(function(p){var active=p.dataset.accountPanel===name;p.hidden=!active;p.classList.toggle("active",active);});}
  document.querySelectorAll("[data-account-tab]").forEach(function(button){button.addEventListener("click",function(){switchTab(button.dataset.accountTab);});});

  var fullUser=window.AtlasAuth.userProvider.findByLogin(user.username);
  $("profile-name").value=fullUser.displayName||"";$("profile-username").value=fullUser.username||"";$("profile-email").value=fullUser.email||"";$("profile-phone").value=fullUser.phone||"";$("profile-role").value=fullUser.role||"";$("profile-document").value=fullUser.document||"Não vinculado";
  $("account-back-link").href=window.AtlasAuth.guard.projectUrl(window.AtlasAuth.permissions.defaultPath(user.role));

  $("profile-form").addEventListener("submit",function(event){event.preventDefault();try{var updated=window.AtlasAuth.userProvider.updateProfile(user.id,{displayName:$("profile-name").value,email:$("profile-email").value,phone:$("profile-phone").value});window.AtlasAuth.session.updateUser(updated);window.AtlasAuth.audit.record("PROFILE_UPDATED",{username:user.username});feedback($("profile-feedback"),"Perfil atualizado com sucesso.","success");document.querySelectorAll("[data-auth-user-name]").forEach(function(el){el.textContent=updated.displayName;});}catch(error){feedback($("profile-feedback"),error.message,"error");}});

  function rules(value){return{length:value.length>=8,upper:/[A-Z]/.test(value),lower:/[a-z]/.test(value),number:/\d/.test(value),symbol:/[^A-Za-z0-9]/.test(value)};}
  function renderStrength(){var value=$("new-password").value,r=rules(value),score=Object.keys(r).filter(function(k){return r[k];}).length;document.querySelectorAll("[data-rule]").forEach(function(li){li.classList.toggle("valid",r[li.dataset.rule]);});$("password-strength-bar").style.width=(score*20)+"%";$("password-strength-label").textContent=["Informe uma nova senha","Muito fraca","Fraca","Média","Forte","Muito forte"][score];}
  $("new-password").addEventListener("input",renderStrength);
  document.querySelectorAll("[data-password-toggle]").forEach(function(button){button.addEventListener("click",function(){var input=$(button.dataset.passwordToggle),show=input.type==="password";input.type=show?"text":"password";button.textContent=show?"Ocultar":"Mostrar";});});
  $("password-form").addEventListener("submit",async function(event){event.preventDefault();var current=$("current-password").value,next=$("new-password").value,confirm=$("confirm-password").value,r=rules(next);if(next!==confirm){feedback($("password-feedback"),"A confirmação não corresponde à nova senha.","error");return;}if(Object.keys(r).some(function(k){return !r[k];})){feedback($("password-feedback"),"A nova senha ainda não atende a todos os requisitos.","error");return;}try{await window.AtlasAuth.userProvider.changePassword(user.id,current,next);window.AtlasAuth.audit.record("PASSWORD_CHANGED",{username:user.username});$("password-form").reset();renderStrength();feedback($("password-feedback"),"Senha alterada com sucesso. Use a nova senha no próximo acesso.","success");}catch(error){window.AtlasAuth.audit.record("PASSWORD_CHANGE_FAILED",{username:user.username});feedback($("password-feedback"),error.message,"error");}});

  var prefs=window.AtlasAuth.userProvider.getPreferences(user.id);$("pref-expiration").checked=prefs.expiration!==false;$("pref-email").checked=Boolean(prefs.email);$("pref-whatsapp").checked=Boolean(prefs.whatsapp);$("pref-remember").checked=Boolean(localStorage.getItem(window.AtlasAuth.config.rememberedUserKey));
  $("preferences-form").addEventListener("submit",function(event){event.preventDefault();window.AtlasAuth.userProvider.setPreferences(user.id,{expiration:$("pref-expiration").checked,email:$("pref-email").checked,whatsapp:$("pref-whatsapp").checked});if($("pref-remember").checked)localStorage.setItem(window.AtlasAuth.config.rememberedUserKey,user.username);else localStorage.removeItem(window.AtlasAuth.config.rememberedUserKey);window.AtlasAuth.audit.record("PREFERENCES_UPDATED",{username:user.username});feedback($("preferences-feedback"),"Preferências salvas com sucesso.","success");});

  $("session-device").textContent=navigator.platform||"Dispositivo atual";$("session-details").textContent=(navigator.userAgent.match(/(Chrome|Edg|Firefox|Safari)\/[\d.]+/)||["Navegador atual"])[0];$("session-created").textContent="Iniciada em "+new Date(session.createdAt).toLocaleString("pt-BR");$("end-session").addEventListener("click",function(){window.location.href=window.AtlasAuth.guard.projectUrl("/auth/logout.html");});
})(window,document);
