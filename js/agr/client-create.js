/*
  Pedroza Certificadora
  Atlas - Cadastro Operacional de Cliente e Certificado
  Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
*/
(function(window,document){
  "use strict";

  var qs = new URLSearchParams(window.location.search);
  var requestedAction = String(qs.get("action") || "").toLowerCase();
  var createdId = String(qs.get("created") || "");
  var createdDoc = String(qs.get("doc") || "");

  function byId(id){ return document.getElementById(id); }
  function digits(v){ return String(v || "").replace(/\D/g,""); }
  function session(){
    try { return window.AtlasAuth && window.AtlasAuth.session ? window.AtlasAuth.session.read() : null; }
    catch(e){ return null; }
  }
  function role(){
    var s = session();
    return String(s && s.user && s.user.role || "").toUpperCase();
  }
  function actor(){
    var s = session();
    return String(s && s.user && (s.user.displayName || s.user.username) || "ATLAS");
  }
  function can(permission){
    try {
      if(window.AtlasAuth && window.AtlasAuth.permissions && window.AtlasAuth.permissions.has){
        return window.AtlasAuth.permissions.has(role(),permission);
      }
    } catch(e){}
    return role()==="FULL" || role()==="ADMIN";
  }
  function validCpf(value){
    var cpf=digits(value); if(cpf.length!==11 || /^(\d)\1+$/.test(cpf)) return false;
    var sum=0,i; for(i=0;i<9;i++) sum+=Number(cpf[i])*(10-i);
    var d1=(sum*10)%11; if(d1===10)d1=0; if(d1!==Number(cpf[9]))return false;
    sum=0; for(i=0;i<10;i++) sum+=Number(cpf[i])*(11-i);
    var d2=(sum*10)%11; if(d2===10)d2=0; return d2===Number(cpf[10]);
  }
  function validCnpj(value){
    var cnpj=digits(value); if(cnpj.length!==14 || /^(\d)\1+$/.test(cnpj)) return false;
    function calc(base,weights){
      var sum=0; for(var i=0;i<weights.length;i++) sum+=Number(base[i])*weights[i];
      var r=sum%11; return r<2?0:11-r;
    }
    var d1=calc(cnpj,[5,4,3,2,9,8,7,6,5,4,3,2]);
    var d2=calc(cnpj,[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    return d1===Number(cnpj[12]) && d2===Number(cnpj[13]);
  }
  function validDoc(value){
    var d=digits(value); return d.length===11 ? validCpf(d) : d.length===14 ? validCnpj(d) : false;
  }
  function escapeHtml(v){
    return String(v==null?"":v).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function clearActionFromUrl(){
    var u=new URL(window.location.href); u.searchParams.delete("action");
    history.replaceState({},document.title,u.pathname+u.search+u.hash);
  }
  function ensureUi(){
    if(byId("atlas-create-modal")) return;
    var backdrop=document.createElement("div");
    backdrop.id="atlas-create-backdrop"; backdrop.className="atlas-create-backdrop"; backdrop.hidden=true;
    var modal=document.createElement("section");
    modal.id="atlas-create-modal"; modal.className="atlas-create-modal"; modal.hidden=true;
    modal.setAttribute("role","dialog"); modal.setAttribute("aria-modal","true"); modal.setAttribute("aria-labelledby","atlas-create-title");
    document.body.appendChild(backdrop); document.body.appendChild(modal);
    backdrop.addEventListener("click",close);
    document.addEventListener("keydown",function(e){ if(e.key==="Escape" && !modal.hidden) close(); });
  }
  function close(){
    var modal=byId("atlas-create-modal"),backdrop=byId("atlas-create-backdrop");
    if(modal)modal.hidden=true; if(backdrop)backdrop.hidden=true;
    document.body.style.overflow="";
    clearActionFromUrl();
  }
  function shell(title,subtitle,body){
    ensureUi();
    var modal=byId("atlas-create-modal");
    modal.innerHTML=
      '<header class="atlas-create-header"><div><span>Atlas â€¢ Cadastro operacional</span><h2 id="atlas-create-title">'+escapeHtml(title)+'</h2><p>'+escapeHtml(subtitle)+'</p></div><button class="atlas-create-close" id="atlas-create-close" type="button" aria-label="Fechar">Ã—</button></header>'+
      '<div class="atlas-create-body">'+body+'</div>';
    byId("atlas-create-close").addEventListener("click",close);
    byId("atlas-create-backdrop").hidden=false; modal.hidden=false; document.body.style.overflow="hidden";
  }
  function status(message,type){
    var el=byId("atlas-create-status"); if(!el)return;
    el.textContent=message||""; el.className="atlas-create-status "+(type||"");
  }
  function openClient(){
    if(!can("CLIENTS_MANAGE")){
      shell("Acesso restrito","Seu perfil nao possui permissao para cadastrar clientes.",'<p class="atlas-create-help">Solicite a permissao CLIENTS_MANAGE ao administrador do Atlas.</p>');
      return;
    }
    shell("Novo cliente","Cadastre o cliente diretamente na base oficial do Atlas.",
      '<p class="atlas-create-help">CPF/CNPJ, nome e e-mail sao obrigatorios pela Atlas API.</p>'+
      '<form id="atlas-create-client-form"><div class="atlas-create-grid">'+
      '<label>CPF/CNPJ<input id="acc-doc" inputmode="numeric" required maxlength="18" autocomplete="off"></label>'+
      '<label>Situacao<select id="acc-situacao"><option value="ATIVO">Ativo</option><option value="INATIVO">Inativo</option></select></label>'+
      '<label class="wide">Nome / Razao social<input id="acc-nome" required autocomplete="name"></label>'+
      '<label>E-mail<input id="acc-email" type="email" required autocomplete="email"></label>'+
      '<label>Telefone<input id="acc-telefone" inputmode="tel" autocomplete="tel"></label>'+
      '<label>Responsavel<input id="acc-responsavel" value="'+escapeHtml(actor())+'"></label>'+
      '<label>Prioridade<select id="acc-prioridade"><option value="NORMAL">Normal</option><option value="MEDIA">Media</option><option value="ALTA">Alta</option></select></label>'+
      '<label class="wide">Observacoes<textarea id="acc-observacoes" rows="4"></textarea></label>'+
      '</div><div class="atlas-create-status" id="atlas-create-status" role="status"></div>'+
      '<div class="atlas-create-actions"><button class="atlas-create-cancel" id="acc-cancel" type="button">Cancelar</button><button class="atlas-create-submit" id="acc-submit" type="submit">Salvar cliente</button></div></form>');
    byId("acc-cancel").addEventListener("click",close);
    byId("atlas-create-client-form").addEventListener("submit",saveClient);
    setTimeout(function(){byId("acc-doc").focus();},50);
  }
  async function saveClient(e){
    e.preventDefault();
    var doc=digits(byId("acc-doc").value),nome=byId("acc-nome").value.trim(),email=byId("acc-email").value.trim();
    if(!validDoc(doc)){ status("CPF/CNPJ invalido.","error"); return; }
    if(!nome || !email){ status("Preencha CPF/CNPJ, nome e e-mail.","error"); return; }
    if(!window.AtlasAPI || !window.AtlasAPI.createClient){ status("Atlas API indisponivel.","error"); return; }
    var button=byId("acc-submit"); button.disabled=true; status("Salvando cliente na base oficial...");
    try{
      var data=await window.AtlasAPI.createClient({
        cpfCnpj:doc,nome:nome,email:email,telefone:byId("acc-telefone").value.trim(),
        situacao:byId("acc-situacao").value,responsavel:byId("acc-responsavel").value.trim()||actor(),
        observacoes:byId("acc-observacoes").value.trim(),prioridade:byId("acc-prioridade").value,actor:actor()
      });
      try{ if(window.AtlasAPI.audit) await window.AtlasAPI.audit("CLIENT_CREATED_FROM_CRM",{clientId:data&&data.id||"",cpfCnpj:doc}); }catch(ignore){}
      try{ if(window.AtlasSharedCache && window.AtlasSharedCache.clear) window.AtlasSharedCache.clear("core"); }catch(ignore2){}
      status("Cliente salvo com sucesso.","ok");
      setTimeout(function(){
        var u=new URL(window.location.href); u.searchParams.delete("action"); u.searchParams.set("created",data&&data.id||"1"); u.searchParams.set("doc",doc);
        window.location.href=u.pathname+u.search;
      },700);
    }catch(error){
      status(error && error.message ? error.message : "Falha ao salvar o cliente.","error");
      button.disabled=false;
    }
  }
  async function openCertificate(){
    if(!can("CERTIFICATES_MANAGE")){
      shell("Acesso restrito","Seu perfil nao possui permissao para cadastrar certificados.",'<p class="atlas-create-help">Solicite a permissao CERTIFICATES_MANAGE ao administrador do Atlas.</p>');
      return;
    }
    shell("Novo certificado","Vincule um certificado a um cliente ja cadastrado.",
      '<p class="atlas-create-help">Cliente, tipo e vencimento sao obrigatorios pela Atlas API.</p>'+
      '<form id="atlas-create-cert-form"><div class="atlas-create-grid">'+
      '<label class="wide">Cliente<select id="acc-cliente" required><option value="">Carregando clientes...</option></select></label>'+
      '<label>Tipo<input id="acc-tipo" required placeholder="Ex.: e-CNPJ A1"></label>'+
      '<label>Status<select id="acc-status"><option value="ATIVO">Ativo</option><option value="EM RENOVACAO">Em renovacao</option><option value="VENCIDO">Vencido</option></select></label>'+
      '<label>Emissao<input id="acc-emissao" type="date"></label>'+
      '<label>Vencimento<input id="acc-vencimento" type="date" required></label>'+
      '<label>Autoridade certificadora<input id="acc-ac" placeholder="Ex.: AC SOLUTI"></label>'+
      '<label>Numero de serie<input id="acc-serie"></label>'+
      '</div><div class="atlas-create-status" id="atlas-create-status" role="status"></div>'+
      '<div class="atlas-create-actions"><button class="atlas-create-cancel" id="acc-cancel" type="button">Cancelar</button><button class="atlas-create-submit" id="acc-submit" type="submit">Salvar certificado</button></div></form>');
    byId("acc-cancel").addEventListener("click",close);
    byId("atlas-create-cert-form").addEventListener("submit",saveCertificate);
    try{
      var clients=await window.AtlasAPI.listClients();
      var select=byId("acc-cliente");
      var active=(Array.isArray(clients)?clients:[]).filter(function(c){return c.active!==false;}).sort(function(a,b){return String(a.nome||"").localeCompare(String(b.nome||""),"pt-BR");});
      select.innerHTML='<option value="">Selecione...</option>'+active.map(function(c){return '<option value="'+escapeHtml(c.id)+'">'+escapeHtml(c.nome||"Sem nome")+' â€¢ '+escapeHtml(c.cpfCnpj||"")+'</option>';}).join("");
    }catch(error){
      status(error && error.message ? error.message : "Falha ao carregar clientes.","error");
    }
  }
  async function saveCertificate(e){
    e.preventDefault();
    if(!window.AtlasAPI || !window.AtlasAPI.createCertificate){ status("Atlas API indisponivel.","error"); return; }
    var button=byId("acc-submit"); button.disabled=true; status("Salvando certificado na base oficial...");
    try{
      var data=await window.AtlasAPI.createCertificate({
        clienteId:byId("acc-cliente").value,tipo:byId("acc-tipo").value.trim(),
        autoridadeCertificadora:byId("acc-ac").value.trim(),numeroSerie:byId("acc-serie").value.trim(),
        emissao:byId("acc-emissao").value,vencimento:byId("acc-vencimento").value,
        statusCertificado:byId("acc-status").value,actor:actor()
      });
      try{ if(window.AtlasAPI.audit) await window.AtlasAPI.audit("CERTIFICATE_CREATED_FROM_CRM",{certificateId:data&&data.id||"",clientId:byId("acc-cliente").value}); }catch(ignore){}
      try{ if(window.AtlasSharedCache && window.AtlasSharedCache.clear) window.AtlasSharedCache.clear("core"); }catch(ignore2){}
      status("Certificado salvo com sucesso.","ok");
      setTimeout(function(){ window.location.href="clientes.html?filter=certificate-active"; },700);
    }catch(error){
      status(error && error.message ? error.message : "Falha ao salvar o certificado.","error");
      button.disabled=false;
    }
  }
  function revealCreated(){
    if(!createdId && !createdDoc) return;
    var search=byId("crm-search");
    if(!search) return;
    setTimeout(function(){
      if(createdDoc){
        search.value=createdDoc;
        search.dispatchEvent(new Event("input",{bubbles:true}));
      }
      var u=new URL(window.location.href); u.searchParams.delete("created"); u.searchParams.delete("doc");
      history.replaceState({},document.title,u.pathname+u.search+u.hash);
    },900);
  }
  function init(){
    ensureUi();
    if(requestedAction==="new") openClient();
    else if(requestedAction==="certificate") openCertificate();
    revealCreated();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})(window,document);