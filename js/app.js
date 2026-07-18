/* Concepção, design e desenvolvimento: Marcos Henrique Pedroza */
(function(){
  "use strict";

  var WHATSAPP="https://wa.me/5521991674117?text=";
  var menuButton=document.querySelector(".menu-toggle");
  var navigation=document.getElementById("menu-principal");
  var launcher=document.querySelector(".atlas-launcher");
  var chat=document.getElementById("atlas-chat");
  var closeButton=document.querySelector(".chat-close");
  var minimizeButton=document.querySelector(".chat-minimize");
  var message=document.getElementById("atlas-message");
  var actions=document.getElementById("atlas-actions");
  var backButton=document.getElementById("atlas-back");
  var chatInput=document.getElementById("chat-text");

  var home={
    text:"Olá! 👋<br><strong>Eu sou o Atlas</strong>, assistente virtual da Pedroza Certificadora.<br>Como posso te ajudar hoje?",
    choices:[
      ["Qual certificado eu preciso?","escolher"],
      ["Quais documentos são necessários?","documentos"],
      ["Como funciona a emissão por vídeo?","video"],
      ["Meu certificado venceu. E agora?","renovacao"]
    ]
  };

  var flows={
    escolher:{text:"Vamos descobrir juntos. O certificado será usado por uma <strong>pessoa física</strong> ou por uma <strong>empresa</strong>?",choices:[["Pessoa física — e-CPF","ecpf"],["Empresa — e-CNPJ","ecnpj"],["Ainda tenho dúvida","especialista"]]},
    ecpf:{text:"Para pessoa física, o mais indicado é o <strong>e-CPF</strong>. Agora escolha onde prefere armazená-lo:",choices:[["No computador — A1","ecpf-a1"],["Token ou cartão — A3","ecpf-a3"],["Quero orientação","especialista"]]},
    ecnpj:{text:"Para a empresa, o mais indicado é o <strong>e-CNPJ</strong>. Agora escolha onde prefere armazená-lo:",choices:[["No computador — A1","ecnpj-a1"],["Token ou cartão — A3","ecnpj-a3"],["Quero orientação","especialista"]]},
    documentos:{text:"Os documentos variam conforme o titular. Para qual certificado você deseja a lista inicial?",choices:[["Documentos para e-CPF","docs-ecpf"],["Documentos para e-CNPJ","docs-ecnpj"],["Falar com um especialista","especialista"]]},
    "docs-ecpf":{text:"Para o <strong>e-CPF</strong>, tenha em mãos documento oficial com foto e CPF. Nossa equipe confirma a lista definitiva conforme o seu caso.",choices:[["Enviar documentos pelo WhatsApp","wa-docs-ecpf"],["Também quero saber sobre e-CNPJ","docs-ecnpj"]]},
    "docs-ecnpj":{text:"Para o <strong>e-CNPJ</strong>, normalmente são verificados os documentos do responsável e os dados constitutivos da empresa. Nossa equipe confirma a lista conforme a natureza jurídica.",choices:[["Enviar documentos pelo WhatsApp","wa-docs-ecnpj"],["Também quero saber sobre e-CPF","docs-ecpf"]]},
    video:{text:"A emissão é feita por <strong>videoconferência</strong>. Após a conferência dos dados, você recebe a orientação para emitir e instalar o certificado — normalmente em até 15 minutos após a validação.",choices:[["Quero iniciar minha emissão","wa-video"],["Escolher meu certificado","escolher"]]},
    renovacao:{text:"Se o certificado venceu ou está próximo do vencimento, nós verificamos a forma mais rápida de renovar. O atendimento também pode ser feito por vídeo.",choices:[["Solicitar renovação","wa-renovacao"],["Meu certificado ainda funciona","wa-suporte"]]},
    especialista:{text:"Sem problema. Um especialista da Pedroza Certificadora vai analisar sua necessidade e indicar a opção correta.",choices:[["Falar agora no WhatsApp","wa-especialista"]]}
  };

  var whatsappMessages={
    "ecpf-a1":"Olá! O Atlas me orientou e quero emitir um e-CPF A1.",
    "ecpf-a3":"Olá! O Atlas me orientou e quero emitir um e-CPF A3.",
    "ecnpj-a1":"Olá! O Atlas me orientou e quero emitir um e-CNPJ A1.",
    "ecnpj-a3":"Olá! O Atlas me orientou e quero emitir um e-CNPJ A3.",
    "wa-docs-ecpf":"Olá! Quero confirmar e enviar os documentos necessários para emitir um e-CPF.",
    "wa-docs-ecnpj":"Olá! Quero confirmar e enviar os documentos necessários para emitir um e-CNPJ.",
    "wa-video":"Olá! Vi como funciona a emissão por vídeo e quero iniciar meu atendimento.",
    "wa-renovacao":"Olá! Meu certificado venceu ou está próximo do vencimento e quero solicitar a renovação.",
    "wa-suporte":"Olá! Preciso de suporte com meu certificado digital atual.",
    "wa-especialista":"Olá! Conversei com o Atlas e preciso de ajuda para escolher o certificado ideal."
  };

  function track(action,label){
    try{
      var history=JSON.parse(localStorage.getItem("atlas_acs_events")||"[]");
      history.push({action:action,label:label,at:new Date().toISOString()});
      localStorage.setItem("atlas_acs_events",JSON.stringify(history.slice(-50)));
    }catch(error){}
    if(typeof window.gtag==="function")window.gtag("event",action,{event_category:"ACS",event_label:label});
  }

  function openWhatsApp(text,label){
    track("whatsapp_click",label);
    window.open(WHATSAPP+encodeURIComponent(text),"_blank","noopener");
  }

  function renderFlow(flowName){
    var flow=flowName==="home"?home:flows[flowName];
    if(!flow||!message||!actions)return;
    message.innerHTML=flow.text;
    actions.innerHTML="";
    flow.choices.forEach(function(choice){
      var button=document.createElement("button");
      button.type="button";
      button.textContent=choice[0];
      button.dataset.flow=choice[1];
      actions.appendChild(button);
    });
    if(backButton)backButton.hidden=flowName==="home";
    track("atlas_step",flowName);
  }

  function handleFlow(flowName){
    if(whatsappMessages[flowName]){openWhatsApp(whatsappMessages[flowName],flowName);return;}
    renderFlow(flowName);
  }

  function closeMenu(){
    if(!menuButton||!navigation)return;
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Abrir menu");
    navigation.classList.remove("open");
  }

  if(menuButton&&navigation){
    menuButton.addEventListener("click",function(){
      var opening=menuButton.getAttribute("aria-expanded")!=="true";
      menuButton.setAttribute("aria-expanded",String(opening));
      menuButton.setAttribute("aria-label",opening?"Fechar menu":"Abrir menu");
      navigation.classList.toggle("open",opening);
    });
    navigation.querySelectorAll("a").forEach(function(link){link.addEventListener("click",closeMenu);});
  }

  function setChat(open){
    if(!chat||!launcher)return;
    chat.classList.toggle("open",open);
    chat.setAttribute("aria-hidden",String(!open));
    launcher.setAttribute("aria-expanded",String(open));
    launcher.hidden=open;
    document.body.classList.toggle("chat-open",open);
    if(open){track("atlas_open","launcher");window.setTimeout(function(){if(chatInput)chatInput.focus();},250);}
  }

  if(launcher)launcher.addEventListener("click",function(){setChat(true);});
  if(closeButton)closeButton.addEventListener("click",function(){setChat(false);});
  if(minimizeButton)minimizeButton.addEventListener("click",function(){setChat(false);});
  if(backButton)backButton.addEventListener("click",function(){renderFlow("home");});
  if(actions)actions.addEventListener("click",function(event){var button=event.target.closest("button[data-flow]");if(button)handleFlow(button.dataset.flow);});

  if(chat){
    chat.querySelector("form").addEventListener("submit",function(event){
      event.preventDefault();
      var typed=chatInput?chatInput.value.trim():"";
      if(!typed)return;
      openWhatsApp("Olá! Digitei esta mensagem no Atlas: "+typed,"mensagem_livre");
      chatInput.value="";
    });
  }

  document.querySelectorAll(".acs-action").forEach(function(link){link.addEventListener("click",function(){track("service_click",link.dataset.acs||link.textContent.trim());});});
  document.querySelectorAll('a[href*="wa.me/5521991674117"]').forEach(function(link){if(!link.classList.contains("acs-action"))link.addEventListener("click",function(){track("whatsapp_click",link.textContent.trim()||"cta");});});

  var year=document.getElementById("ano-atual");if(year)year.textContent=String(new Date().getFullYear());
  var reveals=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});},{threshold:.08});
    reveals.forEach(function(item){observer.observe(item);});
    window.setTimeout(function(){reveals.forEach(function(item){item.classList.add("visible");});},1200);
  }else{reveals.forEach(function(item){item.classList.add("visible");});}
})();
