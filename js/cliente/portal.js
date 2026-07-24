(function(){
  "use strict";
  var loginSection=document.getElementById("portal-login"),dashboard=document.getElementById("portal-dashboard"),feedback=document.getElementById("portal-login-feedback");
  function escapeHtml(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function date(v){if(!v)return"—";var d=new Date(v);return isNaN(d.getTime())?"—":d.toLocaleDateString("pt-BR");}
  function session(){try{return window.AtlasAuth.session.read();}catch(_){return null;}}
  function showFeedback(message){feedback.hidden=false;feedback.className="portal-feedback error";feedback.textContent=message;}
  function days(v){var d=new Date(v);if(isNaN(d.getTime()))return null;return Math.ceil((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()))/86400000);}
  function render(data){
    var certs=data.certificados||[],timeline=data.timeline||[],name=(data.cliente&&data.cliente.nome)||"Cliente";
    loginSection.hidden=true;dashboard.hidden=false;document.getElementById("portal-logout").hidden=false;document.getElementById("portal-user-name").textContent=name;document.getElementById("portal-client-name").textContent=name;
    document.getElementById("portal-kpi-total").textContent=certs.length;
    var active=certs.filter(function(c){var n=days(c.vencimento);return n===null||n>=0;});document.getElementById("portal-kpi-active").textContent=active.length;
    var dated=certs.filter(function(c){return days(c.vencimento)!==null;}).sort(function(a,b){return new Date(a.vencimento)-new Date(b.vencimento);});var next=dated.find(function(c){return days(c.vencimento)>=0;})||dated[dated.length-1];
    document.getElementById("portal-kpi-expiry").textContent=next?date(next.vencimento):"—";document.getElementById("portal-kpi-expiry-copy").textContent=next?(days(next.vencimento)<0?"Certificado vencido":"Faltam "+days(next.vencimento)+" dia(s)"):"Sem data cadastrada";
    document.getElementById("portal-certificates").innerHTML=certs.length?certs.map(function(c){var remaining=days(c.vencimento),state=remaining!==null&&remaining<0?"Vencido":remaining!==null&&remaining<=30?"Renovação recomendada":"Ativo";return '<article class="portal-certificate"><div><span>'+escapeHtml(c.tipo||"Certificado digital")+'</span><h3>'+escapeHtml(state)+'</h3><p>Validade: <strong>'+date(c.vencimento)+'</strong></p></div><button type="button" data-renew="'+escapeHtml(c.id)+'">Solicitar renovação</button></article>';}).join(""):'<p class="portal-empty">Nenhum certificado cadastrado.</p>';
    document.getElementById("portal-timeline").innerHTML=timeline.length?timeline.map(function(item){return '<article><time>'+date(item.dataHora)+'</time><div><h3>'+escapeHtml(item.titulo||"Atividade")+'</h3><p>'+escapeHtml(item.descricao||"")+'</p></div></article>';}).join(""):'<p class="portal-empty">Nenhuma atividade registrada.</p>';
  }
  function load(){if(!session()){loginSection.hidden=false;dashboard.hidden=true;return;}window.AtlasAPI.request("portal.summary").then(render).catch(function(){window.AtlasAuth.session.clear("expired");loginSection.hidden=false;dashboard.hidden=true;showFeedback("Sua sessão expirou. Entre novamente.");});}
  document.getElementById("portal-login-form").addEventListener("submit",function(event){event.preventDefault();feedback.hidden=true;var email=document.getElementById("portal-login-email").value,password=document.getElementById("portal-login-password").value,button=event.currentTarget.querySelector("button");button.disabled=true;window.AtlasAuth.crypto.sha256(password).then(function(hash){return window.AtlasAPI.login(email,hash);}).then(function(user){if(String(user.role).toUpperCase()!=="CLIENTE")throw new Error("Use o acesso exclusivo do cliente.");window.AtlasAuth.session.create(user,true);return window.AtlasAPI.request("portal.summary");}).then(render).catch(function(error){showFeedback(error.message==="Usuario ou senha invalidos."?"E-mail ou senha inválidos.":error.message);}).finally(function(){button.disabled=false;});});
  document.getElementById("portal-logout").addEventListener("click",function(){window.AtlasAuth.session.clear("logout");location.reload();});
  document.getElementById("portal-certificates").addEventListener("click",function(event){var button=event.target.closest("[data-renew]");if(!button)return;button.disabled=true;window.AtlasAPI.request("portal.requestRenewal",{certificadoId:button.dataset.renew}).then(function(){button.textContent="Solicitação enviada";button.classList.add("done");}).catch(function(error){button.disabled=false;alert(error.message);});});
  load();
})();
