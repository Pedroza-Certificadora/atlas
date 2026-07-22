/**
 * Pedroza Certificadora
 * Atlas Data Foundation v1.0
 * Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
 */
const ATLAS_VERSION = '4.9.15';
const SESSION_TTL_SECONDS = 28800;
const SHEETS = Object.freeze({
  USUARIOS: ['ID','LOGIN','EMAIL','NOME','PERFIL','HASH_SENHA','CPF_CNPJ','TELEFONE','CHAVE_CERTIFICADO','PREFERENCIAS_JSON','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CLIENTES: ['ID','CPF_CNPJ','NOME','EMAIL','TELEFONE','SITUACAO','HISTORICO_JSON','RESPONSAVEL','OBSERVACOES','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CERTIFICADOS: ['ID','CLIENTE_ID','TIPO','AUTORIDADE_CERTIFICADORA','NUMERO_SERIE','EMISSAO','VENCIMENTO','STATUS_CERTIFICADO','HISTORICO_RENOVACOES_JSON','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  PERMISSOES: ['ID','PERFIL','PERMISSAO','ATIVO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  AUDITORIA: ['ID','USUARIO_ID','USUARIO_LOGIN','ACAO','DETALHES_JSON','CAMINHO','USER_AGENT','DATA_HORA','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CONFIGURACOES: ['ID','CHAVE','VALOR_JSON','DESCRICAO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  AGENDA: ['ID','CLIENTE_ID','TITULO','INICIO','FIM','RESPONSAVEL','SITUACAO','OBSERVACOES','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  LOGS: ['ID','NIVEL','ORIGEM','MENSAGEM','CONTEXTO_JSON','DATA_HORA','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR']
});

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || '').trim();
    if (action === 'aevs.consult' || params.documento || params.cpfCnpj) {
      return json_({ok:true,data:consultarCertificadoPublico_(params)});
    }
    return json_({ok:true,data:{service:'Atlas API',version:ATLAS_VERSION,status:'online'}});
  } catch (error) {
    try { appendLog_('ERROR','AEVS_PUBLIC',error.message,{stack:error.stack || ''}); } catch (_) {}
    return json_({ok:false,code:error.code || 'AEVS_ERROR',message:error.message || 'Nao foi possivel concluir a consulta.'});
  }
}
function doPost(e) {
  try {
    const request = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(request.action || '');
    const data = route_(action, request.payload || {}, request.client || {}, String(request.authToken || ''));
    return json_({ok:true,data:data});
  } catch (error) {
    try { appendLog_('ERROR','API',error.message,{stack:error.stack || ''}); } catch (_) {}
    return json_({ok:false,code:error.code || 'API_ERROR',message:error.message || 'Erro interno da Atlas API.'});
  }
}

function configurarAtlasDataFoundation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEETS).forEach(name => ensureSheet_(ss,name,SHEETS[name]));
  seedConfig_();
  seedUsers_();
  return 'Atlas Data Foundation ' + ATLAS_VERSION + ' configurada com sucesso.';
}

function route_(action,payload,client,authToken) {
  if (['users.list','users.create','users.setActive','users.updateProfile','users.changePassword','users.getPreferences','users.setPreferences','clients.list','clients.create','clients.update','certificates.list','certificates.create','certificates.update','dashboard.summary'].indexOf(action) >= 0) {
    requireSession_(authToken);
  }
  switch(action) {
    case 'health': return {service:'Atlas API',version:ATLAS_VERSION,status:'online'};
    case 'auth.login': return login_(payload,client);
    case 'users.list': return listUsers_();
    case 'users.create': return createUser_(payload);
    case 'users.setActive': return setUserActive_(payload);
    case 'users.updateProfile': return updateProfile_(payload);
    case 'users.changePassword': return changePassword_(payload);
    case 'users.getPreferences': return getPreferences_(payload);
    case 'users.setPreferences': return setPreferences_(payload);
    case 'clients.list': return listClients_();
    case 'clients.create': return createClient_(payload);
    case 'clients.update': return updateClient_(payload);
    case 'certificates.list': return listCertificates_();
    case 'certificates.create': return createCertificate_(payload);
    case 'certificates.update': return updateCertificate_(payload);
    case 'audit.record': return recordAudit_(payload,client);
    case 'dashboard.summary': return dashboardSummary_();
    default: throw apiError_('ACTION_NOT_FOUND','Acao nao reconhecida pela Atlas API.');
  }
}


/**
 * Consulta publica AEVS sobre a Atlas Data Foundation.
 * Retorna somente dados reduzidos e mascarados, sem expor PII completa.
 */
function consultarCertificadoPublico_(params) {
  const documento = digits_(params.documento || params.cpfCnpj || '');
  if ([11,14].indexOf(documento.length) === -1 || /^(\d)\1+$/.test(documento)) {
    return {encontrado:false,mensagem:'Informe um CPF ou CNPJ valido.'};
  }

  const cliente = rows_('CLIENTES').find(function(row) {
    return digits_(row.CPF_CNPJ) === documento && String(row.STATUS || 'ATIVO').toUpperCase() !== 'EXCLUIDO';
  });
  if (!cliente) {
    return {encontrado:false,mensagem:'Nao encontramos certificado cadastrado para o documento informado.'};
  }

  const certificados = rows_('CERTIFICADOS').filter(function(row) {
    return String(row.CLIENTE_ID || '') === String(cliente.ID || '') &&
      String(row.STATUS || 'ATIVO').toUpperCase() !== 'EXCLUIDO';
  });
  if (!certificados.length) {
    return {encontrado:false,mensagem:'Nao encontramos certificado cadastrado para o documento informado.'};
  }

  const hoje = inicioDoDia_(new Date());
  const ordenados = certificados.map(function(cert) {
    const vencimento = dataAtlas_(cert.VENCIMENTO);
    const dias = vencimento ? Math.ceil((inicioDoDia_(vencimento).getTime() - hoje.getTime()) / 86400000) : null;
    const statusTexto = String(cert.STATUS_CERTIFICADO || '').toUpperCase();
    const emRenovacao = valorBooleano_(cert.EM_RENOVACAO) || statusTexto.indexOf('RENOV') >= 0;
    const ativo = String(cert.STATUS || 'ATIVO').toUpperCase() === 'ATIVO';
    let prioridade = 40;
    if (ativo && dias !== null && dias >= 0) prioridade = 10;
    else if (emRenovacao) prioridade = 20;
    else if (dias !== null && dias < 0) prioridade = 30;
    return {cert:cert,vencimento:vencimento,dias:dias,prioridade:prioridade};
  }).sort(function(a,b) {
    if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
    if (a.prioridade === 10) return (a.dias === null ? 999999 : a.dias) - (b.dias === null ? 999999 : b.dias);
    if (a.prioridade === 30) return (b.vencimento ? b.vencimento.getTime() : 0) - (a.vencimento ? a.vencimento.getTime() : 0);
    return (a.vencimento ? a.vencimento.getTime() : 0) - (b.vencimento ? b.vencimento.getTime() : 0);
  });

  const escolhido = ordenados[0];
  const cert = escolhido.cert;
  const dias = escolhido.dias;
  const situacao = situacaoPublicaCertificado_(cert,dias);
  const nome = String(cliente.NOME || cliente.EMPRESA || 'Cliente');
  return {
    encontrado:true,
    titularMascarado:mascararNomePublico_(nome),
    documentoMascarado:mascararDocumentoPublico_(documento),
    tipoCertificado:String(cert.TIPO || cert.MODELO || 'Certificado digital'),
    validadeFormatada:escolhido.vencimento ? Utilities.formatDate(escolhido.vencimento,Session.getScriptTimeZone() || 'America/Sao_Paulo','dd/MM/yyyy') : 'Nao informada',
    situacao:situacao,
    diasRestantes:dias,
    referenciaConsulta:String(params.requestId || params._ || ''),
    fonte:'ATLAS_DATA_FOUNDATION'
  };
}

function dataAtlas_(valor) {
  if (Object.prototype.toString.call(valor) === '[object Date]' && !isNaN(valor.getTime())) return valor;
  const texto = String(valor || '').trim();
  if (!texto) return null;
  let match = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) return new Date(Number(match[3]),Number(match[2])-1,Number(match[1]));
  match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));
  const parsed = new Date(texto);
  return isNaN(parsed.getTime()) ? null : parsed;
}
function inicioDoDia_(data) { return new Date(data.getFullYear(),data.getMonth(),data.getDate()); }
function valorBooleano_(valor) { return ['TRUE','SIM','1','ATIVO','YES'].indexOf(String(valor || '').trim().toUpperCase()) >= 0; }
function situacaoPublicaCertificado_(cert,dias) {
  const status = String(cert.STATUS_CERTIFICADO || '').trim();
  if (dias !== null && dias < 0) return 'Vencido';
  if (valorBooleano_(cert.EM_RENOVACAO) || status.toUpperCase().indexOf('RENOV') >= 0) return 'Em renovacao';
  if (dias !== null && dias <= 30) return 'Proximo do vencimento';
  return status || 'Valido';
}
function mascararDocumentoPublico_(documento) {
  const d = digits_(documento);
  if (d.length === 11) return '***.'+d.slice(3,6)+'.'+d.slice(6,9)+'-**';
  if (d.length === 14) return '**.'+d.slice(2,5)+'.'+d.slice(5,8)+'/****-**';
  return 'Documento protegido';
}
function mascararNomePublico_(nome) {
  return String(nome || '').trim().split(/\s+/).filter(Boolean).map(function(parte,index,lista) {
    if (parte.length <= 2) return parte.charAt(0) + '*';
    if (index === 0 || index === lista.length - 1) return parte.charAt(0) + '*'.repeat(Math.max(parte.length-2,1)) + parte.charAt(parte.length-1);
    return parte.charAt(0) + '*'.repeat(Math.max(parte.length-1,1));
  }).join(' ');
}

function login_(payload,client) {
  const login = normalize_(payload.login);
  const hash = String(payload.passwordHash || '');
  const user = rows_('USUARIOS').find(r => normalize_(r.LOGIN) === login || normalize_(r.EMAIL) === login);
  if (!user || String(user.STATUS).toUpperCase() !== 'ATIVO' || String(user.HASH_SENHA) !== hash) {
    recordAudit_({action:'LOGIN_FAILED',details:{login:payload.login || ''}},client);
    throw apiError_('INVALID_CREDENTIALS','Usuario ou senha invalidos.');
  }
  recordAudit_({action:'LOGIN_SUCCESS',details:{userId:user.ID,username:user.LOGIN,role:user.PERFIL}},client);
  const publicUser = publicUser_(user);
  publicUser.apiToken = createSession_(publicUser);
  return publicUser;
}

function listUsers_() { return rows_('USUARIOS').map(publicUser_); }
function createUser_(data) {
  const login = String(data.username || '').trim(), email = normalize_(data.email), role = String(data.role || 'CLIENTE').toUpperCase();
  if (!login || !email || !data.passwordHash) throw apiError_('VALIDATION','Preencha nome de usuario, e-mail e senha.');
  if (['CLIENTE','AGR'].indexOf(role) === -1) throw apiError_('VALIDATION','Perfil invalido.');
  const existing = rows_('USUARIOS').some(r => normalize_(r.LOGIN) === normalize_(login) || normalize_(r.EMAIL) === email);
  if (existing) throw apiError_('DUPLICATE','Ja existe uma conta com este usuario ou e-mail.');
  const now = new Date(), id = nextId_('USUARIOS','USR');
  appendObject_('USUARIOS',{
    ID:id,LOGIN:login,EMAIL:email,NOME:String(data.displayName || login).trim(),PERFIL:role,HASH_SENHA:String(data.passwordHash),
    CPF_CNPJ:digits_(data.document),TELEFONE:String(data.phone || ''),CHAVE_CERTIFICADO:digits_(data.document),
    PREFERENCIAS_JSON:JSON.stringify({expiration:true,email:false,whatsapp:false}),STATUS:'ATIVO',
    CRIADO_EM:now,CRIADO_POR:String(data.actor || 'ATLAS'),ALTERADO_EM:now,ALTERADO_POR:String(data.actor || 'ATLAS')
  });
  if (role === 'CLIENTE') {
    createClient_({cpfCnpj:digits_(data.document),nome:String(data.displayName || login).trim(),email:email,telefone:String(data.phone || ''),responsavel:String(data.actor || 'ATLAS'),observacoes:'Conta do Portal Atlas: ' + login,actor:String(data.actor || 'ATLAS')});
  }
  return publicUser_(findById_('USUARIOS',id));
}
function setUserActive_(p) { return updateRow_('USUARIOS',p.id,{STATUS:p.active?'ATIVO':'INATIVO'},p.actor || 'ATLAS',publicUser_); }
function updateProfile_(p) {
  const data=p.data||{}, current=findById_('USUARIOS',p.id); if(!current) throw apiError_('NOT_FOUND','Usuario nao encontrado.');
  const email=normalize_(data.email); if(!String(data.displayName||'').trim()||!email) throw apiError_('VALIDATION','Informe nome e e-mail validos.');
  if(rows_('USUARIOS').some(r=>r.ID!==p.id&&normalize_(r.EMAIL)===email)) throw apiError_('DUPLICATE','Este e-mail ja esta em uso.');
  return updateRow_('USUARIOS',p.id,{NOME:String(data.displayName).trim(),EMAIL:email,TELEFONE:String(data.phone||'')},p.actor||'ATLAS',publicUser_);
}
function changePassword_(p) {
  const user=findById_('USUARIOS',p.id); if(!user) throw apiError_('NOT_FOUND','Usuario nao encontrado.');
  if(String(user.HASH_SENHA)!==String(p.currentHash||'')) throw apiError_('INVALID_PASSWORD','A senha atual esta incorreta.');
  if(String(p.newHash||'')===String(user.HASH_SENHA)) throw apiError_('VALIDATION','A nova senha deve ser diferente da senha atual.');
  updateRow_('USUARIOS',p.id,{HASH_SENHA:String(p.newHash)},p.actor||user.LOGIN); return true;
}
function getPreferences_(p) { const u=findById_('USUARIOS',p.id); return parseJson_(u&&u.PREFERENCIAS_JSON,{expiration:true,email:false,whatsapp:false}); }
function setPreferences_(p) { const prefs=Object.assign({expiration:true,email:false,whatsapp:false},p.preferences||{}); updateRow_('USUARIOS',p.id,{PREFERENCIAS_JSON:JSON.stringify(prefs)},p.actor||'ATLAS'); return prefs; }
function listClients_() { return rows_('CLIENTES').map(publicClient_); }
function createClient_(data) {
  const doc=digits_(data.cpfCnpj||data.document), email=normalize_(data.email), name=String(data.nome||data.displayName||'').trim();
  if(!doc||!name||!email) throw apiError_('VALIDATION','Informe CPF/CNPJ, nome e e-mail do cliente.');
  const existing=rows_('CLIENTES').find(r=>digits_(r.CPF_CNPJ)===doc);
  if(existing) return publicClient_(existing);
  const now=new Date(),id=nextId_('CLIENTES','CLI'),actor=String(data.actor||'ATLAS');
  appendObject_('CLIENTES',{ID:id,CPF_CNPJ:doc,NOME:name,EMAIL:email,TELEFONE:String(data.telefone||data.phone||''),SITUACAO:String(data.situacao||'ATIVO'),HISTORICO_JSON:JSON.stringify([{data:now.toISOString(),acao:'CADASTRO',origem:'PORTAL_ATLAS'}]),RESPONSAVEL:String(data.responsavel||actor),OBSERVACOES:String(data.observacoes||''),STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  return publicClient_(findById_('CLIENTES',id));
}
function updateClient_(p) { const d=p.data||{};return updateRow_('CLIENTES',p.id,{NOME:String(d.nome||'').trim(),EMAIL:normalize_(d.email),TELEFONE:String(d.telefone||''),SITUACAO:String(d.situacao||'ATIVO'),RESPONSAVEL:String(d.responsavel||''),OBSERVACOES:String(d.observacoes||'')},d.actor||'ATLAS',publicClient_); }
function listCertificates_() { return rows_('CERTIFICADOS').map(publicCertificate_); }
function createCertificate_(data) {
  const clientId=String(data.clienteId||''), type=String(data.tipo||'').trim(), expiry=String(data.vencimento||'').trim();
  if(!clientId||!type||!expiry) throw apiError_('VALIDATION','Informe cliente, tipo e vencimento do certificado.');
  if(!findById_('CLIENTES',clientId)) throw apiError_('NOT_FOUND','Cliente nao encontrado.');
  const now=new Date(),id=nextId_('CERTIFICADOS','CERT'),actor=String(data.actor||'ATLAS');
  appendObject_('CERTIFICADOS',{ID:id,CLIENTE_ID:clientId,TIPO:type,AUTORIDADE_CERTIFICADORA:String(data.autoridadeCertificadora||''),NUMERO_SERIE:String(data.numeroSerie||''),EMISSAO:String(data.emissao||''),VENCIMENTO:expiry,STATUS_CERTIFICADO:String(data.statusCertificado||'ATIVO'),HISTORICO_RENOVACOES_JSON:JSON.stringify([]),STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  return publicCertificate_(findById_('CERTIFICADOS',id));
}
function updateCertificate_(p) { const d=p.data||{};return updateRow_('CERTIFICADOS',p.id,{TIPO:String(d.tipo||''),AUTORIDADE_CERTIFICADORA:String(d.autoridadeCertificadora||''),NUMERO_SERIE:String(d.numeroSerie||''),EMISSAO:String(d.emissao||''),VENCIMENTO:String(d.vencimento||''),STATUS_CERTIFICADO:String(d.statusCertificado||'ATIVO')},d.actor||'ATLAS',publicCertificate_); }
function publicClient_(r){return{id:r.ID,cpfCnpj:String(r.CPF_CNPJ||''),nome:String(r.NOME||''),email:String(r.EMAIL||''),telefone:String(r.TELEFONE||''),situacao:String(r.SITUACAO||''),responsavel:String(r.RESPONSAVEL||''),observacoes:String(r.OBSERVACOES||''),active:String(r.STATUS||'').toUpperCase()==='ATIVO'};}
function publicCertificate_(r){return{id:r.ID,clienteId:String(r.CLIENTE_ID||''),tipo:String(r.TIPO||''),autoridadeCertificadora:String(r.AUTORIDADE_CERTIFICADORA||''),numeroSerie:String(r.NUMERO_SERIE||''),emissao:r.EMISSAO,vencimento:r.VENCIMENTO,statusCertificado:String(r.STATUS_CERTIFICADO||''),active:String(r.STATUS||'').toUpperCase()==='ATIVO'};}

function recordAudit_(p,client) {
  const d=p.details||{}, now=new Date(), id=nextId_('AUDITORIA','AUD');
  appendObject_('AUDITORIA',{ID:id,USUARIO_ID:String(d.userId||''),USUARIO_LOGIN:String(d.username||d.user||d.login||''),ACAO:String(p.action||'ATIVIDADE'),DETALHES_JSON:JSON.stringify(d),CAMINHO:String(client.path||''),USER_AGENT:String(client.userAgent||''),DATA_HORA:now,STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:String(d.username||'ATLAS'),ALTERADO_EM:now,ALTERADO_POR:String(d.username||'ATLAS')});
  return {id:id};
}
function dashboardSummary_() {
  const users=rows_('USUARIOS'), clients=rows_('CLIENTES'), certs=rows_('CERTIFICADOS'), audit=rows_('AUDITORIA');
  const limit=new Date();limit.setDate(limit.getDate()+60);
  const renewalsDue=certs.filter(r=>{const d=new Date(r.VENCIMENTO);return !isNaN(d.getTime())&&d>=new Date()&&d<=limit&&String(r.STATUS).toUpperCase()==='ATIVO';}).length;
  return {users:users.length,activeClients:clients.filter(r=>String(r.STATUS).toUpperCase()==='ATIVO').length,activeAgr:users.filter(r=>String(r.PERFIL).toUpperCase()==='AGR'&&String(r.STATUS).toUpperCase()==='ATIVO').length,certificates:certs.filter(r=>String(r.STATUS).toUpperCase()==='ATIVO').length,renewalsDue:renewalsDue,recentAudit:audit.slice(-10).reverse()};
}

function createSession_(user) {
  const token = Utilities.getUuid().replace(/-/g,'') + Utilities.getUuid().replace(/-/g,'');
  CacheService.getScriptCache().put('session:' + token, JSON.stringify({id:user.id,username:user.username,role:user.role}), SESSION_TTL_SECONDS);
  return token;
}
function requireSession_(token) {
  const raw = token ? CacheService.getScriptCache().get('session:' + token) : null;
  if (!raw) throw apiError_('UNAUTHORIZED','Sessao da Atlas API ausente ou expirada. Entre novamente.');
  return parseJson_(raw,{});
}
function seedUsers_() {
  if (rows_('USUARIOS').length) return;
  const now = new Date();
  [
    {ID:'USR-000001',LOGIN:'Marcos Pedroza',EMAIL:'marcos@pedrozacertificadora.com.br',NOME:'Marcos Pedroza',PERFIL:'FULL',HASH_SENHA:'de8311609e1a9c7ec5e60f6a7fa6e4775f6fe38a5c629a3e9c069972a99b64ff',CPF_CNPJ:'',TELEFONE:'',CHAVE_CERTIFICADO:'FULL'},
    {ID:'USR-000002',LOGIN:'agr',EMAIL:'agr@pedrozacertificadora.com.br',NOME:'Agente de Registro',PERFIL:'AGR',HASH_SENHA:'bff6d586721c27acbf7334005dfa788c2622c6f8e6df22c5e98410a0b659d4a6',CPF_CNPJ:'',TELEFONE:'',CHAVE_CERTIFICADO:'AGR'},
    {ID:'USR-000003',LOGIN:'cliente',EMAIL:'cliente@pedrozacertificadora.com.br',NOME:'Cliente Demonstracao',PERFIL:'CLIENTE',HASH_SENHA:'57d695d45bc762070820f67ff348037400eeb21d1646820de4b5237358d7230f',CPF_CNPJ:'00000000000',TELEFONE:'',CHAVE_CERTIFICADO:'00000000000'}
  ].forEach(u => appendObject_('USUARIOS',Object.assign({},u,{PREFERENCIAS_JSON:JSON.stringify({expiration:true,email:false,whatsapp:false}),STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'MIGRACAO-4.6.10',ALTERADO_EM:now,ALTERADO_POR:'MIGRACAO-4.6.10'})));
}

function rows_(name) { const s=sheet_(name), values=s.getDataRange().getValues(); if(values.length<2)return[]; const h=values[0]; return values.slice(1).filter(r=>r.some(v=>v!=='' )).map(r=>h.reduce((o,k,i)=>(o[k]=r[i],o),{})); }
function sheet_(name) { const s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); if(!s) throw apiError_('SHEET_NOT_FOUND','Aba '+name+' nao encontrada. Execute configurarAtlasDataFoundation().'); return s; }
function ensureSheet_(ss,name,headers) { let s=ss.getSheetByName(name); if(!s)s=ss.insertSheet(name); if(s.getLastRow()===0)s.getRange(1,1,1,headers.length).setValues([headers]); else s.getRange(1,1,1,headers.length).setValues([headers]); s.setFrozenRows(1); s.getRange(1,1,1,headers.length).setFontWeight('bold'); }
function appendObject_(name,obj) { const s=sheet_(name), headers=s.getRange(1,1,1,s.getLastColumn()).getValues()[0]; s.appendRow(headers.map(h=>obj[h]!==undefined?obj[h]:'')); }
function findById_(name,id) { return rows_(name).find(r=>String(r.ID)===String(id))||null; }
function updateRow_(name,id,changes,actor,mapper) { const s=sheet_(name), data=s.getDataRange().getValues(), headers=data[0], idCol=headers.indexOf('ID'); for(let i=1;i<data.length;i++){ if(String(data[i][idCol])===String(id)){ Object.keys(changes).forEach(k=>{const c=headers.indexOf(k);if(c>=0)s.getRange(i+1,c+1).setValue(changes[k]);}); ['ALTERADO_EM','ALTERADO_POR'].forEach((k,j)=>{const c=headers.indexOf(k);if(c>=0)s.getRange(i+1,c+1).setValue(j===0?new Date():actor);}); const row=headers.reduce((o,k,c)=>(o[k]=s.getRange(i+1,c+1).getValue(),o),{}); return mapper?mapper(row):row; }} throw apiError_('NOT_FOUND','Registro nao encontrado.'); }
function nextId_(name,prefix) { const max=rows_(name).reduce((m,r)=>Math.max(m,Number(String(r.ID||'').replace(/\D/g,''))||0),0); return prefix+'-'+String(max+1).padStart(6,'0'); }
function publicUser_(u) { return {id:u.ID,username:u.LOGIN,email:u.EMAIL,displayName:u.NOME,role:String(u.PERFIL||'').toUpperCase(),active:String(u.STATUS||'').toUpperCase()==='ATIVO',document:String(u.CPF_CNPJ||''),certificateOwnerKey:String(u.CHAVE_CERTIFICADO||u.CPF_CNPJ||''),phone:String(u.TELEFONE||'')}; }
function seedConfig_() { if(!rows_('CONFIGURACOES').some(r=>r.CHAVE==='ATLAS_VERSION')){const n=new Date();appendObject_('CONFIGURACOES',{ID:nextId_('CONFIGURACOES','CFG'),CHAVE:'ATLAS_VERSION',VALOR_JSON:JSON.stringify(ATLAS_VERSION),DESCRICAO:'Versao da Atlas Data Foundation',STATUS:'ATIVO',CRIADO_EM:n,CRIADO_POR:'SETUP',ALTERADO_EM:n,ALTERADO_POR:'SETUP'});} }
function appendLog_(nivel,origem,mensagem,contexto) { const n=new Date();appendObject_('LOGS',{ID:nextId_('LOGS','LOG'),NIVEL:nivel,ORIGEM:origem,MENSAGEM:mensagem,CONTEXTO_JSON:JSON.stringify(contexto||{}),DATA_HORA:n,STATUS:'ATIVO',CRIADO_EM:n,CRIADO_POR:'API',ALTERADO_EM:n,ALTERADO_POR:'API'}); }
function normalize_(v){return String(v||'').trim().toLowerCase();} function digits_(v){return String(v||'').replace(/\D/g,'');} function parseJson_(v,f){try{return JSON.parse(v||'');}catch(_){return f;}} function apiError_(code,message){const e=new Error(message);e.code=code;return e;} function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
