/* Concepção, design e desenvolvimento: Marcos Henrique Pedroza */
(function(){
  "use strict";
  var menuButton=document.querySelector(".menu-toggle");
  var navigation=document.getElementById("menu-principal");
  var launcher=document.querySelector(".atlas-launcher");
  var chat=document.getElementById("atlas-chat");
  var closeButton=document.querySelector(".chat-close");
  var minimizeButton=document.querySelector(".chat-minimize");

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
    if(open){var input=chat.querySelector("input");if(input)window.setTimeout(function(){input.focus();},250);}
  }
  if(launcher)launcher.addEventListener("click",function(){setChat(true);});
  if(closeButton)closeButton.addEventListener("click",function(){setChat(false);});
  if(minimizeButton)minimizeButton.addEventListener("click",function(){setChat(false);});
  if(chat){
    chat.querySelector("form").addEventListener("submit",function(event){event.preventDefault();});
    chat.querySelectorAll(".quick-actions button").forEach(function(button){button.addEventListener("click",function(){window.open("https://wa.me/5521991674117?text="+encodeURIComponent(button.textContent),"_blank","noopener");});});
  }

  var year=document.getElementById("ano-atual");if(year)year.textContent=String(new Date().getFullYear());
  var reveals=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});},{threshold:.08});
    reveals.forEach(function(item){observer.observe(item);});
    window.setTimeout(function(){reveals.forEach(function(item){item.classList.add("visible");});},1200);
  }else{reveals.forEach(function(item){item.classList.add("visible");});}
})();
