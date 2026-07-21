/* Atlas AASS v1.0 - Dashboard Administrativo 4.6.8 */
(function(window,document){
  "use strict";
  function safeUsers(){try{return window.AtlasAuth.userProvider.list();}catch(e){return[];}}
  function text(id,value){var el=document.getElementById(id);if(el)el.textContent=String(value);}
  function formatDate(value){try{return new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(new Date(value));}catch(e){return "Agora";}}
  function render(){
    var session=window.AtlasAuth&&window.AtlasAuth.session?window.AtlasAuth.session.getActive():null;
    var users=safeUsers();
    var clients=users.filter(function(u){return u.role==="CLIENTE"&&u.active;}).length;
    var agrs=users.filter(function(u){return u.role==="AGR"&&u.active;}).length;
    text("atlas-kpi-clients",clients);text("atlas-kpi-users",users.length);text("atlas-kpi-agr",agrs+" AGR ativo"+(agrs===1?"":"s"));
    if(session){document.querySelectorAll("[data-auth-user-first-name]").forEach(function(el){el.textContent=String(session.user.displayName||"Usuário").split(" ")[0];});text("atlas-last-access",formatDate(session.createdAt||Date.now()));}
    var list=document.getElementById("atlas-activity-list");if(!list)return;
    var records=[];try{records=window.AtlasAuth.audit.list().slice(0,4);}catch(e){}
    if(!records.length){list.innerHTML='<div class="atlas-empty-state"><p>Nenhum evento recente.</p><small>As próximas atividades aparecerão aqui.</small></div>';return;}
    list.innerHTML=records.map(function(item){var label=item.type||item.action||"ATIVIDADE";var detail=item.username||item.user||"Sistema Atlas";var when=item.createdAt||item.timestamp||Date.now();return '<div class="atlas-activity-item"><i></i><span><strong>'+String(label).replace(/_/g," ")+'</strong><small>'+String(detail)+'</small></span><time>'+formatDate(when)+'</time></div>';}).join("");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);else render();
})(window,document);
