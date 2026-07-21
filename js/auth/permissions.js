/* Atlas AASS v1.0 - perfis e permissoes */
(function(window){"use strict";window.AtlasAuth=window.AtlasAuth||{};
var matrix=Object.freeze({FULL:["AGR_ACCESS","CLIENT_ACCESS","AUDIT_READ","SETTINGS_MANAGE","USERS_MANAGE"],ADMIN:["AGR_ACCESS","CLIENT_ACCESS","AUDIT_READ","SETTINGS_MANAGE","USERS_MANAGE"],AGR:["AGR_ACCESS","CLIENT_ACCESS","CLIENTS_MANAGE","CERTIFICATES_MANAGE","AGENDA_MANAGE","AUDIT_READ"],CLIENTE:["CLIENT_ACCESS","OWN_CERTIFICATES_READ"]});
function has(role,p){return Boolean(matrix[role]&&matrix[role].indexOf(p)!==-1);}
function canAccessPath(role,path){if(path.indexOf('/agr/usuarios')!==-1||path.indexOf('/agr/configuracoes')!==-1)return has(role,'SETTINGS_MANAGE');if(path.indexOf('/agr/')!==-1)return has(role,'AGR_ACCESS');if(path.indexOf('/cliente/')!==-1)return has(role,'CLIENT_ACCESS');return true;}
function defaultPath(role){return role==='CLIENTE'?'/cliente/':'/agr/';}
window.AtlasAuth.permissions=Object.freeze({has:has,canAccessPath:canAccessPath,defaultPath:defaultPath,matrix:matrix});})(window);
