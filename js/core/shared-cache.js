/* Atlas Shared Cache 5.0.5.2 | Navegacao instantanea entre modulos */
(function(w){"use strict";
  var PREFIX="atlas.shared.5.0.5.2.";
  var TTL={core:24*60*60*1000,cockpit:24*60*60*1000,acc:24*60*60*1000,automation:10*60*1000};
  function key(name){return PREFIX+name}
  function read(name,maxAge){try{var item=JSON.parse(localStorage.getItem(key(name))||"null");if(!item||!item.savedAt)return null;var age=Date.now()-item.savedAt;return{data:item.data,savedAt:item.savedAt,age:age,stale:age>(maxAge==null?(TTL[name]||TTL.core):maxAge)}}catch(e){return null}}
  function write(name,data){try{localStorage.setItem(key(name),JSON.stringify({savedAt:Date.now(),data:data}));return true}catch(e){return false}}
  function remove(name){try{localStorage.removeItem(key(name))}catch(e){}}
  function coreSnapshot(clients,certificates,timeline){return{summary:{activeClients:(clients||[]).filter(function(x){return x.active!==false}).length,certificates:(certificates||[]).filter(function(x){return x.active!==false}).length},clients:clients||[],certificates:certificates||[],timeline:(timeline||[]).slice(0,120),communications:[],health:{api:true,dataFoundation:true},meta:{generatedAt:new Date().toISOString(),source:"browser-core",version:"5.0.5.2"}}}
  function seedCore(clients,certificates,timeline){var core={clients:clients||[],certificates:certificates||[],timeline:timeline||[]};write("core",core);var old=read("cockpit");var snap=coreSnapshot(core.clients,core.certificates,core.timeline);if(old&&old.data){snap.communications=old.data.communications||[];snap.automation=old.data.automation||null;snap.health=Object.assign({},old.data.health||{},snap.health)}write("cockpit",snap);var acc=read("acc");write("acc",Object.assign({},acc&&acc.data||{},{clients:core.clients}));return snap}
  w.AtlasSharedCache=Object.freeze({read:read,write:write,remove:remove,seedCore:seedCore,coreSnapshot:coreSnapshot,ttl:TTL});
})(window);
