/*
  Atlas Motion Experience System v1.0.1
  Sprint 3.6.1 - Pedroza Certificadora
  Correcao estrutural do ciclo de observacao do formulario.
  Preserva integralmente a logica funcional homologada da Sprint 3.5.2.
*/
(function(){
  "use strict";
  var root=document.documentElement;
  var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("motion-ready");

  function q(s,c){return(c||document).querySelector(s);}
  function qa(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}

  function revealTargets(){
    return qa(".hero-copy,.hero-art,.proof-grid article,.service-card,.process-list li,.trust-grid article,.future-grid>div,.footer-grid>div,.footer-grid>.partner-card,.footer-bottom");
  }

  var targets=revealTargets();
  targets.forEach(function(el,i){
    el.classList.add("motion-reveal");
    el.style.setProperty("--motion-delay",String(Math.min((i%6)*55,275))+"ms");
  });

  if(reduced||!("IntersectionObserver" in window)){
    targets.forEach(function(el){el.classList.add("motion-visible");});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("motion-visible");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -4% 0px"});
    targets.forEach(function(el){io.observe(el);});
    setTimeout(function(){targets.forEach(function(el){el.classList.add("motion-visible");});},1800);
  }

  var chat=q("#atlas-chat"),actions=q("#atlas-actions"),message=q("#atlas-message");
  var lastProgressStep=0,lastProgressLabel="";

  function ensureProgress(){
    if(!chat||q(".atlas-progress",chat))return;
    var p=document.createElement("div");
    p.className="atlas-progress";
    p.setAttribute("role","progressbar");
    p.setAttribute("aria-label","Progresso do pré-atendimento");
    p.setAttribute("aria-valuemin","1");
    p.setAttribute("aria-valuemax","5");
    p.innerHTML='<span class="atlas-progress-step"></span><span class="atlas-progress-step"></span><span class="atlas-progress-step"></span><span class="atlas-progress-step"></span><span class="atlas-progress-step"></span><span class="atlas-progress-label">Escolha</span>';
    var body=q(".chat-body",chat);
    chat.insertBefore(p,body);
    updateProgress(1,"Escolha");
  }

  function updateProgress(step,label){
    var p=q(".atlas-progress",chat);
    if(!p)return;
    step=Math.max(1,Math.min(5,step));
    if(step===lastProgressStep&&label===lastProgressLabel)return;
    lastProgressStep=step;
    lastProgressLabel=label;
    qa(".atlas-progress-step",p).forEach(function(el,i){
      el.classList.toggle("is-complete",i<step-1);
      el.classList.toggle("is-current",i===step-1);
    });
    var l=q(".atlas-progress-label",p);
    if(l&&l.textContent!==label)l.textContent=label;
    p.setAttribute("aria-valuenow",String(step));
    p.setAttribute("aria-valuetext",label);
  }

  function restartClass(el,className){
    if(!el)return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function animateCurrent(){
    restartClass(message,"motion-message-enter");
    restartClass(actions,"motion-options-enter");
    if(actions){
      qa("button",actions).forEach(function(b,i){b.style.setProperty("--option-index",i);});
    }
    var form=q("#atlas-lead-form");
    if(form){
      restartClass(form,"motion-form-enter");
      updateProgress(2,"Dados mínimos");
      bindValidation(form);
    }
    var summary=q(".lead-summary");
    if(summary){
      restartClass(summary,"motion-summary-enter");
      var m=q(".chat-message",chat);
      if(m)m.classList.add("atlas-success-burst");
      updateProgress(4,"Resumo");
    }
    var send=q("#send-summary");
    if(send&&!send.dataset.motionBound){
      send.dataset.motionBound="1";
      send.addEventListener("click",function(){updateProgress(5,"WhatsApp");});
    }
  }

  function fieldWrap(field){return field.closest("label")||field;}
  function mark(field,valid){
    if(!field)return;
    var wrap=fieldWrap(field);
    wrap.classList.toggle("field-invalid",!valid);
    wrap.classList.toggle("field-valid",valid);
    field.classList.toggle("field-invalid",!valid);
    field.classList.toggle("field-valid",valid);
  }
  function validPhone(field){var n=(field.value||"").replace(/\D/g,"");return n.length>=10&&n.length<=13;}
  function validate(field){
    var valid=field.checkValidity();
    if(field.name==="phone"&&field.value)valid=valid&&validPhone(field);
    mark(field,valid);
    return valid;
  }
  function bindValidation(form){
    if(form.dataset.motionBound)return;
    form.dataset.motionBound="1";
    qa("input,select",form).forEach(function(field){
      field.addEventListener("blur",function(){validate(field);});
      field.addEventListener("input",function(){
        if(field.classList.contains("field-invalid")||fieldWrap(field).classList.contains("field-invalid"))validate(field);
      });
      field.addEventListener("change",function(){validate(field);});
    });
    form.addEventListener("submit",function(){
      var all=qa("input[required],select[required]",form),ok=true;
      all.forEach(function(field){if(!validate(field))ok=false;});
      if(ok){
        updateProgress(3,"Consentimento");
        var btn=q(".lead-submit",form);
        if(btn){
          btn.classList.add("is-preparing");
          setTimeout(function(){btn.classList.remove("is-preparing");},700);
        }
      }
    },true);
  }

  if(chat){
    ensureProgress();
    var body=q(".chat-body",chat);
    if(body){
      var scheduled=false;
      var mo=new MutationObserver(function(records){
        var relevant=records.some(function(record){return record.type==="childList"&&record.target.closest(".chat-body");});
        if(!relevant||scheduled)return;
        scheduled=true;
        requestAnimationFrame(function(){scheduled=false;animateCurrent();});
      });
      mo.observe(body,{childList:true,subtree:true});
    }
    chat.addEventListener("click",function(e){
      if(e.target.closest("button[data-flow]"))updateProgress(1,"Escolha");
    });
  }
  animateCurrent();
})();
