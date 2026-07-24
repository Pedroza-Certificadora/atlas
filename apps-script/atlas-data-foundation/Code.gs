/**
 * Pedroza Certificadora
 * Atlas Data Foundation v1.0
 * Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
 */
const ATLAS_VERSION = '5.0.6';
const SESSION_TTL_SECONDS = 28800;
const SHEETS = Object.freeze({
  USUARIOS: ['ID','LOGIN','EMAIL','NOME','PERFIL','HASH_SENHA','CPF_CNPJ','TELEFONE','CHAVE_CERTIFICADO','PREFERENCIAS_JSON','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CLIENTES: ['ID','CPF_CNPJ','NOME','EMAIL','TELEFONE','SITUACAO','HISTORICO_JSON','RESPONSAVEL','OBSERVACOES','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR','EMPRESA','EMAIL_SECUNDARIO','WHATSAPP','ENDERECO','NUMERO','COMPLEMENTO','BAIRRO','CIDADE','UF','CEP','SETOR_ID','SUBSETOR_ID','HORARIO_PREFERENCIAL','PRIORIDADE'],
  CERTIFICADOS: ['ID','CLIENTE_ID','TIPO','AUTORIDADE_CERTIFICADORA','NUMERO_SERIE','EMISSAO','VENCIMENTO','STATUS_CERTIFICADO','HISTORICO_RENOVACOES_JSON','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR','MODELO','RENOVADO_DE','EM_RENOVACAO'],
  PERMISSOES: ['ID','PERFIL','PERMISSAO','ATIVO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  AUDITORIA: ['ID','USUARIO_ID','USUARIO_LOGIN','ACAO','DETALHES_JSON','CAMINHO','USER_AGENT','DATA_HORA','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CONFIGURACOES: ['ID','CHAVE','VALOR_JSON','DESCRICAO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  AGENDA: ['ID','CLIENTE_ID','TITULO','INICIO','FIM','RESPONSAVEL','SITUACAO','OBSERVACOES','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  LOGS: ['ID','NIVEL','ORIGEM','MENSAGEM','CONTEXTO_JSON','DATA_HORA','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  TIMELINE: ['ID','CLIENTE_ID','TIPO_EVENTO','TITULO','DESCRICAO','ORIGEM','USUARIO_ID','USUARIO_LOGIN','DADOS_JSON','DATA_HORA','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  COMUNICACOES: ['ID','CLIENTE_ID','CAMPANHA_ID','MODELO_ID','CANAL','DESTINO','ASSUNTO','CONTEUDO_HTML','STATUS_ENVIO','TENTATIVAS','ERRO','AGENDADO_PARA','ENVIADO_EM','ENTREGUE_EM','LIDO_EM','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  MODELOS_EMAIL: ['ID','NOME','TIPO','ASSUNTO','HTML','VARIAVEIS_JSON','ATIVO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CAMPANHAS: ['ID','NOME','DESCRICAO','CANAL','MODELO_ID','FILTRO_JSON','SITUACAO','AGENDADO_PARA','INICIADO_EM','FINALIZADO_EM','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CAMPANHA_DESTINATARIOS: ['ID','CAMPANHA_ID','CLIENTE_ID','DESTINO','CANAL','STATUS_ENVIO','COMUNICACAO_ID','ERRO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  PREFERENCIAS_COMUNICACAO: ['ID','CLIENTE_ID','AVISO_VENCIMENTO','CAMPANHAS','NOVIDADES','COMUNICADOS_GERAIS','EMAIL','WHATSAPP','HORARIO_PREFERENCIAL','CONSENTIMENTO_EM','ORIGEM_CONSENTIMENTO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CONVITES: ['ID','CLIENTE_ID','USUARIO_ID','EMAIL','TOKEN_HASH','EXPIRA_EM','ACEITO_EM','SITUACAO','TENTATIVAS','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  FILA_ENVIO: ['ID','COMUNICACAO_ID','TIPO','DESTINO','PRIORIDADE','SITUACAO','TENTATIVAS','PROXIMA_EXECUCAO','ULTIMO_ERRO','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  SETORES: ['ID','NOME','DESCRICAO','ORDEM','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  SUBSETORES: ['ID','SETOR_ID','NOME','DESCRICAO','ORDEM','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  TAGS: ['ID','NOME','DESCRICAO','COR','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  CLIENTE_TAGS: ['ID','CLIENTE_ID','TAG_ID','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR'],
  IA_PROFILE: ['ID','CLIENTE_ID','PERFIL_JSON','ULTIMA_ANALISE_EM','STATUS','CRIADO_EM','CRIADO_POR','ALTERADO_EM','ALTERADO_POR']
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
  seedCrmCatalogs_();
  seedAccModels_();
  return 'Atlas Data Foundation ' + ATLAS_VERSION + ' configurada com sucesso.';
}

function route_(action,payload,client,authToken) {
  if (['users.list','users.create','users.setActive','users.updateProfile','users.changePassword','users.getPreferences','users.setPreferences','clients.list','clients.get','clients.create','clients.update','certificates.list','certificates.create','certificates.update','dashboard.summary','cockpit.summary','timeline.list','timeline.add','communications.list','communications.create','communications.send','models.list','campaigns.list','campaigns.create','campaigns.preview','automation.status','automation.configure','automation.loadConfig','automation.saveConfig','automation.test','automation.run','automation.processQueue','automation.gmailQuota','automation.listTriggers','automation.backendHealth','automation.installTriggers','automation.removeTriggers','invites.generate','portal.summary','portal.requestRenewal','sectors.list','tags.list'].indexOf(action) >= 0) {
    requireSession_(authToken);
  }
  switch(action) {
    case 'health': return {service:'Atlas API',version:ATLAS_VERSION,status:'online'};
    case 'auth.login': return login_(payload,client);
    case 'aevs.sendEmail': return enviarDetalhesCertificadoEmail_(payload,client);
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
    case 'cockpit.summary': return cockpitSummary_(payload);
    case 'clients.get': return getClient_(payload);
    case 'timeline.list': return listTimeline_(payload);
    case 'timeline.add': return addTimeline_(payload);
    case 'communications.list': return listCommunications_(payload);
    case 'communications.create': return createCommunication_(payload);
    case 'communications.send': return sendCommunication_(payload,client);
    case 'models.list': seedAccModels_(); return rows_('MODELOS_EMAIL').filter(function(r){return String(r.STATUS||'ATIVO').toUpperCase()==='ATIVO' && String(r.ATIVO||'SIM').toUpperCase()!=='NAO';});
    case 'campaigns.list': return rows_('CAMPANHAS');
    case 'campaigns.create': return createCampaign_(payload);
    case 'campaigns.preview': return previewCampaign_(payload);
    case 'automation.status': return automationStatus_();
    case 'automation.configure':
    case 'automation.saveConfig': return configureAutomation_(payload);
    case 'automation.loadConfig': return getAccAutomationConfig_();
    case 'automation.test': return sendAutomationTest_(payload,client);
    case 'automation.run': return runAccAutomation_(payload);
    case 'automation.processQueue': return processAccQueue_();
    case 'automation.gmailQuota': return {remainingQuota:MailApp.getRemainingDailyQuota()};
    case 'automation.listTriggers': return listAccAutomationTriggers_();
    case 'automation.backendHealth': return accBackendHealth_();
    case 'automation.installTriggers': return installAccAutomationTriggers_();
    case 'automation.removeTriggers': return removeAccAutomationTriggers_();
    case 'invites.generate': return generateInvite_(payload);
    case 'invites.validate': return validateInvite_(payload);
    case 'invites.accept': return acceptInvite_(payload,client);
    case 'portal.summary': return portalSummary_(authToken);
    case 'portal.requestRenewal': return portalRequestRenewal_(authToken,payload,client);
    case 'sectors.list': return {setores:rows_('SETORES'),subsetores:rows_('SUBSETORES')};
    case 'tags.list': return rows_('TAGS');
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
    emailMascarado:mascararEmailPublico_(cliente.EMAIL || cliente.EMAIL_SECUNDARIO || ''),
    envioEmailDisponivel:Boolean(normalize_(cliente.EMAIL || cliente.EMAIL_SECUNDARIO || '')),
    fonte:'ATLAS_DATA_FOUNDATION'
  };
}


function enviarDetalhesCertificadoEmail_(payload,client) {
  const documento = digits_(payload.documento || payload.cpfCnpj || '');
  if ([11,14].indexOf(documento.length) === -1 || /^(\d)\1+$/.test(documento)) {
    throw apiError_('VALIDATION','Documento invalido.');
  }

  const cache = CacheService.getScriptCache();
  const chaveLimite = 'aevs-email:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, documento)).slice(0,32);
  if (cache.get(chaveLimite)) {
    throw apiError_('RATE_LIMIT','Aguarde alguns minutos antes de solicitar um novo envio.');
  }

  const cliente = rows_('CLIENTES').find(function(row) {
    return digits_(row.CPF_CNPJ) === documento && String(row.STATUS || 'ATIVO').toUpperCase() !== 'EXCLUIDO';
  });
  if (!cliente) throw apiError_('NOT_FOUND','Nao foi possivel enviar os detalhes. Fale com nosso atendimento.');

  const email = normalize_(cliente.EMAIL || cliente.EMAIL_SECUNDARIO || '');
  if (!email || email.indexOf('@') < 1) {
    throw apiError_('EMAIL_NOT_FOUND','Nao ha e-mail valido cadastrado. Fale com nosso atendimento para atualizar o cadastro.');
  }

  const consulta = consultarCertificadoPublico_({documento:documento});
  if (!consulta.encontrado) throw apiError_('NOT_FOUND','Nao foi localizado certificado para envio.');

  const assunto = 'Informacoes do seu certificado digital - Pedroza Certificadora';
  const html = templateEmailCertificado_(cliente,consulta);
  MailApp.sendEmail({
    to: email,
    subject: assunto,
    htmlBody: html,
    name: 'Pedroza Certificadora',
    replyTo: 'certificadodigital@pedroza.com.br'
  });

  const now = new Date();
  const comunicacaoId = nextId_('COMUNICACOES','COM');
  appendObject_('COMUNICACOES',{
    ID:comunicacaoId,CLIENTE_ID:String(cliente.ID),CAMPANHA_ID:'',MODELO_ID:'AEVS-DETALHES-CERTIFICADO',CANAL:'EMAIL',
    DESTINO:email,ASSUNTO:assunto,CONTEUDO_HTML:html,STATUS_ENVIO:'ENVIADO',TENTATIVAS:1,ERRO:'',AGENDADO_PARA:'',
    ENVIADO_EM:now,ENTREGUE_EM:'',LIDO_EM:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'AEVS_PUBLICO',ALTERADO_EM:now,ALTERADO_POR:'AEVS_PUBLICO'
  });
  addTimeline_({clienteId:cliente.ID,tipoEvento:'AEVS_EMAIL_ENVIADO',titulo:'Detalhes do certificado enviados por e-mail',descricao:'Envio solicitado pela Area do Cliente publica.',origem:'AEVS_PUBLICO',actor:'AEVS_PUBLICO',dados:{comunicacaoId:comunicacaoId,destinoMascarado:mascararEmailPublico_(email)}});
  recordAudit_({action:'AEVS_EMAIL_SENT',details:{clienteId:cliente.ID,documentoMascarado:mascararDocumentoPublico_(documento),destinoMascarado:mascararEmailPublico_(email)}},client || {});
  cache.put(chaveLimite,'1',300);

  return {enviado:true,emailMascarado:mascararEmailPublico_(email),mensagem:'Detalhes enviados para ' + mascararEmailPublico_(email) + '.'};
}

function templateEmailCertificado_(cliente,dados) {
  const dias = dados.diasRestantes === null || dados.diasRestantes === undefined ? '' : Number(dados.diasRestantes);
  const titulo = dias !== '' && dias < 0 ? 'Seu certificado digital está vencido' : 'Informações do seu certificado digital';
  const destaque = dias === '' ? 'CONSULTA' : (dias < 0 ? 'VENCIDO' : dias + ' DIAS');
  const texto = dias !== '' && dias <= 30 ? 'Recomendamos iniciar a renovação o quanto antes para evitar interrupções no acesso a sistemas e serviços.' : 'Confira abaixo os dados do certificado digital cadastrado em nossa plataforma.';
  return buildAtlasEmail_({
    title:titulo,
    eyebrow:'PEDROZA CERTIFICADORA',
    highlight:destaque,
    greeting:String(cliente.NOME || cliente.EMPRESA || 'Cliente'),
    message:texto,
    rows:[
      ['Nome completo',String(cliente.NOME || cliente.EMPRESA || 'Cliente')],
      ['CPF/CNPJ',String(cliente.CPF_CNPJ || dados.documentoMascarado || 'Não informado')],
      ['Tipo',String(dados.tipoCertificado || 'Certificado digital')],
      ['Data de vencimento',String(dados.validadeFormatada || 'Não informada')],
      ['Situação',String(dados.situacao || 'Não informada')],
      ['Prazo',dias === '' ? 'Não informado' : (dias < 0 ? 'Vencido há ' + Math.abs(dias) + ' dia(s)' : dias + ' dia(s) restante(s)')]
    ],
    primaryLabel:'FALAR NO WHATSAPP',
    primaryUrl:'https://wa.me/5521991674117?text=' + encodeURIComponent('Olá! Recebi o resumo do meu certificado e gostaria de orientação.'),
    secondaryLabel:'ACESSAR O PORTAL ATLAS',
    secondaryUrl:'https://pedrozacertificadora.com.br/cliente/'
  });
}

function mascararEmailPublico_(email) {
  const valor = normalize_(email);
  const partes = valor.split('@');
  if (partes.length !== 2 || !partes[0] || !partes[1]) return '';
  const usuario = partes[0];
  const visivel = usuario.slice(0,1);
  return visivel + '*'.repeat(Math.max(usuario.length - 1,3)) + '@' + partes[1];
}
function escaparHtml_(valor) {
  return String(valor || '').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
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
function publicClient_(r){return{id:r.ID,cpfCnpj:String(r.CPF_CNPJ||''),nome:String(r.NOME||''),empresa:String(r.EMPRESA||''),email:String(r.EMAIL||''),emailSecundario:String(r.EMAIL_SECUNDARIO||''),telefone:String(r.TELEFONE||''),whatsapp:String(r.WHATSAPP||''),endereco:String(r.ENDERECO||''),numero:String(r.NUMERO||''),complemento:String(r.COMPLEMENTO||''),bairro:String(r.BAIRRO||''),cidade:String(r.CIDADE||''),uf:String(r.UF||''),cep:String(r.CEP||''),setorId:String(r.SETOR_ID||''),subsetorId:String(r.SUBSETOR_ID||''),horarioPreferencial:String(r.HORARIO_PREFERENCIAL||''),prioridade:String(r.PRIORIDADE||'NORMAL'),situacao:String(r.SITUACAO||''),responsavel:String(r.RESPONSAVEL||''),observacoes:String(r.OBSERVACOES||''),active:String(r.STATUS||'').toUpperCase()==='ATIVO'};}
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


/**
 * Sprint 5.0.5.2 - núcleo rápido do Cockpit.
 * Não consulta Gmail, gatilhos, fila ou histórico de comunicações.
 * Esses blocos são atualizados separadamente pelo navegador.
 */
function cockpitSummary_(p) {
  const force=Boolean(p&&p.forceRefresh);
  const cache=CacheService.getScriptCache();
  const key='ATLAS_COCKPIT_CORE_5_0_5_2';
  if(!force){
    const cached=cache.get(key);
    if(cached){try{const parsed=JSON.parse(cached);parsed.meta=Object.assign({},parsed.meta||{},{cache:'HIT'});return parsed;}catch(_){}}
  }
  const clients=rows_('CLIENTES');
  const certRows=rows_('CERTIFICADOS');
  const timelineRows=rows_('TIMELINE');
  const activeClients=clients.filter(function(r){return String(r.STATUS||'').toUpperCase()==='ATIVO';});
  const certificates=certRows.filter(function(r){return String(r.STATUS||'').toUpperCase()==='ATIVO';}).map(publicCertificate_);
  const payload={
    summary:{activeClients:activeClients.length,certificates:certificates.length},
    certificates:certificates,
    timeline:timelineRows.slice(-120).reverse(),
    communications:[],
    health:{api:true,dataFoundation:true},
    meta:{generatedAt:new Date().toISOString(),cache:'MISS',ttlSeconds:300,version:'5.0.5.2',mode:'core'}
  };
  try{cache.put(key,JSON.stringify(payload),300);}catch(_){}
  return payload;
}


function getClient_(p) {
  const client=findById_('CLIENTES',p.id);
  if(!client) throw apiError_('NOT_FOUND','Cliente nao encontrado.');
  return {
    cliente:publicClient_(client),
    certificados:rows_('CERTIFICADOS').filter(r=>String(r.CLIENTE_ID)===String(p.id)).map(publicCertificate_),
    timeline:rows_('TIMELINE').filter(r=>String(r.CLIENTE_ID)===String(p.id)).slice(-100).reverse(),
    comunicacoes:rows_('COMUNICACOES').filter(r=>String(r.CLIENTE_ID)===String(p.id)).slice(-100).reverse(),
    tags:rows_('CLIENTE_TAGS').filter(r=>String(r.CLIENTE_ID)===String(p.id))
  };
}
function listTimeline_(p) {
  let items=rows_('TIMELINE');
  if(p.clienteId) items=items.filter(r=>String(r.CLIENTE_ID)===String(p.clienteId));
  if(p.tipoEvento) items=items.filter(r=>String(r.TIPO_EVENTO)===String(p.tipoEvento));
  return items.slice(-Number(p.limit||200)).reverse();
}
function addTimeline_(p) {
  if(!p.clienteId||!findById_('CLIENTES',p.clienteId)) throw apiError_('NOT_FOUND','Cliente nao encontrado.');
  const now=new Date(), actor=String(p.actor||'ATLAS'), id=nextId_('TIMELINE','TML');
  appendObject_('TIMELINE',{ID:id,CLIENTE_ID:String(p.clienteId),TIPO_EVENTO:String(p.tipoEvento||'ATIVIDADE'),TITULO:String(p.titulo||'Atividade'),DESCRICAO:String(p.descricao||''),ORIGEM:String(p.origem||'CRM'),USUARIO_ID:String(p.usuarioId||''),USUARIO_LOGIN:actor,DADOS_JSON:JSON.stringify(p.dados||{}),DATA_HORA:now,STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  return findById_('TIMELINE',id);
}
function listCommunications_(p) {
  let items=rows_('COMUNICACOES');
  if(p.clienteId) items=items.filter(r=>String(r.CLIENTE_ID)===String(p.clienteId));
  return items.slice(-Number(p.limit||200)).reverse();
}
function createCommunication_(p) {
  if(!p.clienteId||!findById_('CLIENTES',p.clienteId)) throw apiError_('NOT_FOUND','Cliente nao encontrado.');
  const now=new Date(), actor=String(p.actor||'ATLAS'), id=nextId_('COMUNICACOES','COM');
  appendObject_('COMUNICACOES',{ID:id,CLIENTE_ID:String(p.clienteId),CAMPANHA_ID:String(p.campanhaId||''),MODELO_ID:String(p.modeloId||''),CANAL:String(p.canal||'EMAIL').toUpperCase(),DESTINO:String(p.destino||''),ASSUNTO:String(p.assunto||''),CONTEUDO_HTML:String(p.conteudoHtml||''),STATUS_ENVIO:'RASCUNHO',TENTATIVAS:0,ERRO:'',AGENDADO_PARA:p.agendadoPara||'',ENVIADO_EM:'',ENTREGUE_EM:'',LIDO_EM:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  addTimeline_({clienteId:p.clienteId,tipoEvento:'COMUNICACAO_CRIADA',titulo:'Comunicacao preparada',descricao:String(p.assunto||p.canal||''),origem:'CENTRO_COMUNICACAO',actor:actor,dados:{comunicacaoId:id}});
  return findById_('COMUNICACOES',id);
}

function sendCommunication_(p,clientMeta) {
  const cliente=findById_('CLIENTES',p.clienteId);
  if(!cliente) throw apiError_('NOT_FOUND','Cliente nao encontrado.');
  const destino=normalize_(p.destino||cliente.EMAIL||cliente.EMAIL_SECUNDARIO||'');
  if(!destino||destino.indexOf('@')<1) throw apiError_('VALIDATION','Informe um e-mail valido para o envio.');
  const assuntoBase=String(p.assunto||'').trim();
  if(!assuntoBase) throw apiError_('VALIDATION','Informe o assunto do e-mail.');
  const certsAssunto=rows_('CERTIFICADOS').filter(function(r){return String(r.CLIENTE_ID)===String(cliente.ID)&&String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO';});
  certsAssunto.sort(function(a,b){return new Date(b.VENCIMENTO||0)-new Date(a.VENCIMENTO||0);});
  const assunto=renderAccSubject_(assuntoBase,cliente,certsAssunto[0]||{});
  const actor=String(p.actor||'ATLAS');
  const modelo=p.modeloId?findById_('MODELOS_EMAIL',p.modeloId):null;
  let html=String(p.conteudoHtml||(modelo&&modelo.HTML)||'').trim();
  if(!html) throw apiError_('VALIDATION','Informe o conteudo do e-mail.');
  if(String((modelo&&modelo.TIPO)||'').toUpperCase()==='CONVITE_PORTAL' || html.indexOf('{{TOKEN_CONVITE}}')>=0) {
    const convite=generateInvite_({clienteId:cliente.ID,email:destino,ttlHours:72,actor:actor});
    html=html.split('{{TOKEN_CONVITE}}').join(encodeURIComponent(convite.token));
  }
  html=renderAccTemplate_(html,cliente,p);
  const now=new Date(), id=nextId_('COMUNICACOES','COM');
  appendObject_('COMUNICACOES',{ID:id,CLIENTE_ID:String(cliente.ID),CAMPANHA_ID:String(p.campanhaId||''),MODELO_ID:String(p.modeloId||''),CANAL:'EMAIL',DESTINO:destino,ASSUNTO:assunto,CONTEUDO_HTML:html,STATUS_ENVIO:'PROCESSANDO',TENTATIVAS:1,ERRO:'',AGENDADO_PARA:'',ENVIADO_EM:'',ENTREGUE_EM:'',LIDO_EM:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  try {
    MailApp.sendEmail({to:destino,subject:assunto,htmlBody:html,name:'Pedroza Certificadora',replyTo:'contato@pedrozacertificadora.com.br'});
    updateRow_('COMUNICACOES',id,{STATUS_ENVIO:'ENVIADO',ENVIADO_EM:new Date(),ERRO:'',TENTATIVAS:1},actor);
    addTimeline_({clienteId:cliente.ID,tipoEvento:'EMAIL_ENVIADO',titulo:'E-mail enviado',descricao:assunto,origem:'ACC',actor:actor,dados:{comunicacaoId:id,modeloId:String(p.modeloId||''),destinoMascarado:mascararEmailPublico_(destino)}});
    recordAudit_({action:'ACC_EMAIL_SENT',details:{clienteId:cliente.ID,comunicacaoId:id,modeloId:String(p.modeloId||''),assunto:assunto,destinoMascarado:mascararEmailPublico_(destino),username:actor}},clientMeta||{});
    return {id:id,enviado:true,status:'ENVIADO',destinoMascarado:mascararEmailPublico_(destino)};
  } catch(error) {
    updateRow_('COMUNICACOES',id,{STATUS_ENVIO:'ERRO',ERRO:String(error.message||error),TENTATIVAS:1},actor);
    recordAudit_({action:'ACC_EMAIL_FAILED',details:{clienteId:cliente.ID,comunicacaoId:id,erro:String(error.message||error),username:actor}},clientMeta||{});
    throw apiError_('EMAIL_SEND_FAILED','Nao foi possivel enviar o e-mail. O erro foi registrado no historico.');
  }
}
function renderAccTemplate_(html,cliente,p) {
  const certs=rows_('CERTIFICADOS').filter(function(r){return String(r.CLIENTE_ID)===String(cliente.ID)&&String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO';});
  certs.sort(function(a,b){return new Date(b.VENCIMENTO||0)-new Date(a.VENCIMENTO||0);});
  const cert=certs[0]||{};
  const validade=cert.VENCIMENTO?Utilities.formatDate(new Date(cert.VENCIMENTO),Session.getScriptTimeZone()||'America/Sao_Paulo','dd/MM/yyyy'):'Nao informada';
  const vars={
    NOME:cliente.NOME||cliente.EMPRESA||'Cliente', EMPRESA:cliente.EMPRESA||cliente.NOME||'', CPF_CNPJ:cliente.CPF_CNPJ||'',
    TIPO_CERTIFICADO:cert.TIPO||cert.MODELO||'Certificado digital', VALIDADE:validade,
    MENSAGEM:String(p.mensagem||''), ASSINATURA:'Equipe Pedroza Certificadora'
  };
  return Object.keys(vars).reduce(function(out,key){return out.split('{{'+key+'}}').join(escaparHtml_(String(vars[key]||'')));},String(html));
}
function buildAtlasEmail_(o) {
  o=o||{};
  const logo='https://pedrozacertificadora.com.br/images/email/pedroza-email-logo.png';
  const icon='https://pedrozacertificadora.com.br/images/logo/icon-192.png';
  const site='https://pedrozacertificadora.com.br';
  const email='certificadodigital@pedroza.com.br';
  const phone='(21) 99167-4117';
  const title=escaparHtml_(o.title||'Comunicado da Pedroza Certificadora');
  const eyebrow=escaparHtml_(o.eyebrow||'PEDROZA CERTIFICADORA');
  const highlight=escaparHtml_(o.highlight||'AVISO');
  const greeting=escaparHtml_(o.greeting||'{{NOME}}');
  const message=escaparHtml_(o.message||'');
  const rows=Array.isArray(o.rows)?o.rows:[];
  let rowsHtml='';
  rows.forEach(function(row,index){
    const label=escaparHtml_(row[0]||'');
    const value=escaparHtml_(row[1]||'');
    rowsHtml+='<td class="data-cell" width="50%" valign="top" style="width:50%;padding:15px 18px;border-bottom:1px solid #e6edf5;'+(index%2===0?'border-right:1px solid #e6edf5;':'')+'"><div style="font-size:12px;line-height:1.3;color:#60748a;margin-bottom:5px">'+label+'</div><div style="font-size:16px;line-height:1.35;font-weight:700;color:#092e5b">'+value+'</div></td>';
    if(index%2===1) rowsHtml+='</tr><tr>';
  });
  if(rows.length%2===1) rowsHtml+='<td class="data-cell" width="50%" style="width:50%;padding:15px 18px;border-bottom:1px solid #e6edf5">&nbsp;</td></tr><tr>';
  const primaryUrl=String(o.primaryUrl||'https://wa.me/5521991674117');
  const secondaryUrl=String(o.secondaryUrl||site);
  const primaryLabel=escaparHtml_(o.primaryLabel||'FALAR NO WHATSAPP');
  const secondaryLabel=escaparHtml_(o.secondaryLabel||'VER DETALHES');
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<style>@media only screen and (max-width:620px){.shell{width:100%!important}.pad{padding-left:20px!important;padding-right:20px!important}.hero-left,.hero-right,.data-cell,.cta-cell,.support-cell{display:block!important;width:100%!important;box-sizing:border-box!important}.hero-right{text-align:left!important;padding-top:20px!important}.cta-cell{padding:6px 0!important}.support-cell{padding:7px 0!important}.mobile-hide{display:none!important}.title{font-size:31px!important}.logo{width:220px!important}}</style></head>'+
    '<body style="margin:0;padding:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#102b4e">'+
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6fa"><tr><td align="center" style="padding:24px 10px">'+
    '<table role="presentation" class="shell" width="760" cellspacing="0" cellpadding="0" border="0" style="width:760px;max-width:760px;background:#ffffff;border:1px solid #dfe7f0">'+
    '<tr><td class="pad" style="padding:24px 34px 20px;border-bottom:4px solid #52a82d"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td><img class="logo" src="'+logo+'" alt="Pedroza Certificadora" width="270" style="display:block;width:270px;max-width:100%;height:auto;border:0"></td><td class="mobile-hide" align="right" style="font-size:17px;line-height:1.35;font-weight:700;color:#092e5b">SEGURANÇA E CONFIANÇA<br><span style="color:#52a82d;font-weight:500">PARA VOCÊ E SUA EMPRESA</span></td></tr></table></td></tr>'+
    '<tr><td class="pad" style="padding:38px 40px 24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td class="hero-left" width="62%" valign="top" style="width:62%;padding-right:26px"><div style="font-size:12px;line-height:1.2;letter-spacing:1.7px;font-weight:700;color:#52a82d">'+eyebrow+'</div><h1 class="title" style="margin:10px 0 18px;font-size:42px;line-height:1.08;color:#092e5b">'+title+'</h1><p style="margin:0 0 17px;font-size:17px;line-height:1.55;color:#183c66">Olá, <strong>'+greeting+'</strong>.</p><p style="margin:0;font-size:16px;line-height:1.65;color:#405873">'+message+'</p></td>'+
    '<td class="hero-right" width="38%" valign="middle" align="center" style="width:38%;text-align:center"><table role="presentation" cellspacing="0" cellpadding="0" style="margin:auto"><tr><td align="center" style="background:#092e5b;border-radius:14px 14px 0 0;padding:10px 28px;color:#ffffff;font-size:16px;font-weight:700">FALTAM</td></tr><tr><td align="center" style="border:1px solid #d8e2ed;border-top:0;border-radius:0 0 14px 14px;padding:22px 22px;background:#ffffff"><div style="font-size:46px;line-height:1;font-weight:800;color:#52a82d">'+highlight+'</div><div style="margin-top:6px;font-size:14px;font-weight:700;color:#092e5b">PARA O VENCIMENTO</div></td></tr></table></td></tr></table></td></tr>'+
    '<tr><td class="pad" style="padding:0 40px 24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #dfe7f0;border-radius:12px;overflow:hidden"><tr><td colspan="2" style="padding:17px 18px;background:#f8fafc;border-bottom:1px solid #dfe7f0;font-size:17px;font-weight:800;color:#092e5b">DADOS DO CERTIFICADO DIGITAL</td></tr><tr>'+rowsHtml+'</tr></table></td></tr>'+
    '<tr><td class="pad" style="padding:0 40px 28px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td class="cta-cell" width="50%" align="center" style="padding-right:7px"><a href="'+primaryUrl+'" style="display:block;background:#52a82d;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;padding:17px 16px;border-radius:8px">'+primaryLabel+'</a></td><td class="cta-cell" width="50%" align="center" style="padding-left:7px"><a href="'+secondaryUrl+'" style="display:block;background:#092e5b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;padding:17px 16px;border-radius:8px">'+secondaryLabel+'</a></td></tr></table></td></tr>'+
    '<tr><td class="pad" style="padding:22px 40px;background:#eef5fb;border-top:1px solid #dfe7f0"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="70" valign="middle"><img src="'+icon+'" width="58" height="58" alt="Pedroza" style="display:block;border:0;border-radius:50%"></td><td valign="middle"><div style="font-size:16px;font-weight:800;color:#092e5b;margin-bottom:10px">Nossa Central de Atendimento está à disposição.</div><table role="presentation" width="100%"><tr><td class="support-cell" width="33%" style="font-size:13px;line-height:1.5;color:#405873"><strong style="color:#52a82d">WhatsApp</strong><br>'+phone+'</td><td class="support-cell" width="34%" style="font-size:13px;line-height:1.5;color:#405873"><strong style="color:#52a82d">E-mail</strong><br>'+email+'</td><td class="support-cell" width="33%" style="font-size:13px;line-height:1.5;color:#405873"><strong style="color:#52a82d">Atendimento</strong><br>Seg. a Sex., 8h às 18h</td></tr></table></td></tr></table></td></tr>'+
    '<tr><td class="pad" style="padding:24px 40px"><table role="presentation" width="100%"><tr><td style="font-size:14px;line-height:1.6;color:#405873">Atenciosamente,<br><strong style="font-size:16px;color:#092e5b">Equipe Pedroza Certificadora</strong></td><td align="right" class="mobile-hide" style="font-size:12px;line-height:1.6;color:#60748a"><a href="mailto:'+email+'" style="color:#176ca4;text-decoration:none">'+email+'</a><br><a href="'+site+'" style="color:#176ca4;text-decoration:none">pedrozacertificadora.com.br</a><br>'+phone+'</td></tr></table></td></tr>'+
    '<tr><td style="padding:18px 40px;background:#092e5b;border-top:4px solid #52a82d;color:#ffffff"><table role="presentation" width="100%"><tr><td style="font-size:13px;font-weight:700">CERTIFICAÇÃO DIGITAL É SEGURANÇA, AGILIDADE E CONFIANÇA.</td><td align="right" class="mobile-hide" style="font-size:12px;color:#cbd8e7">© 2026 Pedroza Certificadora</td></tr></table></td></tr>'+
    '<tr><td align="center" style="padding:14px 20px;background:#ffffff;font-size:11px;line-height:1.5;color:#7b8b9d">Este e-mail foi enviado automaticamente pela Plataforma Atlas. Não compartilhe senhas ou códigos de instalação.</td></tr>'+
    '</table></td></tr></table></body></html>';
}


/* TEMPLATE VISUAL CONGELADO — preservar estrutura, responsividade, identidade e rodape sem logo. */
function buildPortalInviteEmail_(kind) {
  const logo='https://pedrozacertificadora.com.br/images/email/pedroza-email-logo.png';
  const icon='https://pedrozacertificadora.com.br/images/logo/icon-192.png';
  const site='https://pedrozacertificadora.com.br';
  const portal=site+'/cliente/';
  const whatsapp='https://wa.me/5521991674117';
  const welcome=kind==='WELCOME';
  const title=welcome?'Boas-vindas à Pedroza Certificadora':'Seu certificado sempre ao seu alcance';
  const intro=welcome?'É um prazer ter você conosco. A partir de agora, nossa equipe acompanhará cada etapa do seu certificado com atendimento humano, segurança e praticidade.':'Criamos uma área exclusiva para você acompanhar a validade do certificado, receber avisos, consultar seu histórico e solicitar atendimento em um só lugar.';
  const button=welcome?'CONHECER NOSSOS SERVIÇOS':'CRIAR MEU ACESSO';
  const buttonUrl=welcome?site:portal+'ativar?convite={{TOKEN_CONVITE}}';
  const panelTitle=welcome?'VOCÊ PODE CONTAR COM A GENTE':'NO PORTAL DO CLIENTE VOCÊ PODERÁ';
  const preheader=welcome?'Atendimento humano, avisos de vencimento e suporte para o seu certificado digital.':'Acompanhe validade, avisos e renovações no Portal do Cliente.';
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>'+title+'</title><style>html,body{margin:0!important;padding:0!important;width:100%!important;background:#edf3f8!important;color:#12345a!important}table{border-collapse:collapse!important}img{border:0;outline:none;text-decoration:none}a{text-decoration:none}.mobile-brand{display:none!important;max-height:0;overflow:hidden}@media only screen and (max-width:740px){.outer-pad{padding:0!important}.shell{width:100%!important;max-width:100%!important;border-left:0!important;border-right:0!important}.pad{padding-left:18px!important;padding-right:18px!important}.desktop-cell,.benefit,.data-cell{display:block!important;width:100%!important;box-sizing:border-box!important}.desktop-cell{padding-top:22px!important}.benefit,.data-cell{border-right:0!important}.hero-title{font-size:34px!important}.hero-copy{font-size:16px!important}.desktop-brand{display:none!important}.mobile-brand{display:table!important;max-height:none!important;overflow:visible!important;width:100%!important}.mobile-full{display:block!important;width:100%!important;box-sizing:border-box!important}.footer-center{text-align:center!important}.portal-visual{max-width:320px!important;margin:0 auto!important}}</style></head><body style="margin:0;padding:0;background:#edf3f8;font-family:Arial,Helvetica,sans-serif;color:#12345a"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">'+preheader+'</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#edf3f8" style="width:100%;background:#edf3f8"><tr><td class="outer-pad" align="center" style="padding:24px 10px"><table role="presentation" class="shell" width="720" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="width:720px;max-width:720px;background:#ffffff;border:1px solid #dce6ef"><tr><td class="pad brand-header" bgcolor="#f5f7fa" style="padding:20px 34px;border-bottom:4px solid #53ad2f;background:#f5f7fa;background-image:linear-gradient(#f5f7fa,#f5f7fa)"><table role="presentation" class="desktop-brand" width="100%" cellspacing="0" cellpadding="0"><tr><td><img src="'+logo+'" alt="Pedroza Certificadora" width="235" style="display:block;width:235px;max-width:100%;height:auto"></td><td align="right" style="font-size:15px;line-height:1.35;font-weight:900;color:#0b3563">SEGURANÇA E CONFIANÇA<br><span style="color:#53ad2f;font-weight:600">PARA VOCÊ E SUA EMPRESA</span></td></tr></table><table role="presentation" class="mobile-brand" width="100%" cellspacing="0" cellpadding="0" style="display:none;max-height:0;overflow:hidden"><tr><td width="58" valign="middle"><img src="'+icon+'" alt="Pedroza" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:50%;background:#ffffff"></td><td valign="middle" style="font-size:16px;line-height:1.15;font-weight:900;color:#0b3563">PEDROZA<br><span style="font-size:12px;font-weight:700">Certificadora</span></td><td align="right" valign="middle" style="font-size:10px;line-height:1.35;font-weight:900;color:#0b3563">SEGURANÇA E CONFIANÇA<br><span style="color:#53ad2f">PARA VOCÊ E SUA EMPRESA</span></td></tr></table></td></tr><tr><td class="pad" bgcolor="#eef6fb" style="padding:34px 38px;background:#eef6fb;background-image:linear-gradient(#eef6fb,#eef6fb)"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td class="desktop-cell" width="59%" valign="top" style="width:59%;padding-right:28px"><div style="font-size:12px;letter-spacing:1.8px;font-weight:900;color:#53ad2f">PEDROZA CERTIFICADORA</div><h1 class="hero-title" style="margin:11px 0 17px;font-size:43px;line-height:1.08;color:#0b3563">'+title+'</h1><p class="hero-copy" style="margin:0 0 13px;font-size:18px;line-height:1.5;color:#173f69">Olá, <strong>{{NOME}}</strong>.</p><p class="hero-copy" style="margin:0;font-size:17px;line-height:1.65;color:#46617c">'+intro+'</p></td><td class="desktop-cell" width="41%" valign="middle" style="width:41%"><table role="presentation" class="portal-visual" width="100%" bgcolor="#0b3563" cellspacing="0" cellpadding="0" style="width:100%;background:#0b3563;border-radius:16px"><tr><td align="center" style="padding:22px 18px 12px;color:#ffffff;font-size:12px;letter-spacing:1.4px;font-weight:800">PORTAL DO CLIENTE</td></tr><tr><td style="padding:0 18px 18px"><table role="presentation" width="100%" bgcolor="#ffffff" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:10px"><tr><td style="padding:16px"><div style="height:8px;background:#e5edf4;border-radius:8px;margin-bottom:10px"></div><div style="height:8px;width:70%;background:#d2e2ef;border-radius:8px;margin-bottom:15px"></div><table role="presentation" width="100%"><tr><td width="48%" bgcolor="#eef6fb" valign="top" style="padding:12px 6px;text-align:center;background:#eef6fb;border-radius:8px;color:#0b3563"><div style="font-size:10px;line-height:1.2;font-weight:900;letter-spacing:.4px">VALIDADE</div><div style="margin-top:6px;font-size:13px;line-height:1.25;font-weight:900;color:#0b3563">{{VALIDADE}}</div></td><td width="4%"></td><td width="48%" bgcolor="#edf8e9" valign="top" style="padding:12px 6px;text-align:center;background:#edf8e9;border-radius:8px;color:#39891e"><div style="font-size:10px;line-height:1.2;font-weight:900;letter-spacing:.4px">AVISOS</div><div style="margin-top:6px;font-size:13px;line-height:1.25;font-weight:900;color:#39891e">ATIVOS</div></td></tr></table></td></tr></table></td></tr><tr><td align="center" style="padding:0 18px 22px;color:#d9e7f3;font-size:13px;line-height:1.5">Certificado, histórico e atendimento em um só lugar.</td></tr></table></td></tr></table></td></tr><tr><td class="pad" bgcolor="#ffffff" style="padding:28px 38px 10px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff)"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d8e4ee;border-radius:14px;overflow:hidden"><tr><td colspan="2" bgcolor="#f4f8fb" style="padding:16px 20px;background:#f4f8fb;color:#0b3563;font-size:17px;font-weight:900">INFORMAÇÕES DO SEU CERTIFICADO</td></tr><tr><td class="data-cell" width="50%" style="padding:16px 20px;border-right:1px solid #e1e9f0;border-top:1px solid #e1e9f0"><div style="font-size:12px;color:#6b8197;margin-bottom:5px">Nome / Razão Social</div><div style="font-size:15px;font-weight:800;color:#0b3563">{{NOME}}</div></td><td class="data-cell" width="50%" style="padding:16px 20px;border-top:1px solid #e1e9f0"><div style="font-size:12px;color:#6b8197;margin-bottom:5px">CPF/CNPJ</div><div style="font-size:15px;font-weight:800;color:#0b3563">{{CPF_CNPJ}}</div></td></tr><tr><td class="data-cell" width="50%" style="padding:16px 20px;border-right:1px solid #e1e9f0;border-top:1px solid #e1e9f0"><div style="font-size:12px;color:#6b8197;margin-bottom:5px">Tipo do certificado</div><div style="font-size:15px;font-weight:800;color:#0b3563">{{TIPO_CERTIFICADO}}</div></td><td class="data-cell" width="50%" style="padding:16px 20px;border-top:1px solid #e1e9f0"><div style="font-size:12px;color:#6b8197;margin-bottom:5px">Validade</div><div style="font-size:15px;font-weight:800;color:#0b3563">{{VALIDADE}}</div></td></tr></table></td></tr><tr><td class="pad" bgcolor="#ffffff" style="padding:22px 38px 12px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff)"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d8e4ee;border-radius:14px"><tr><td colspan="2" bgcolor="#0b3563" style="padding:17px 20px;background:#0b3563;color:#ffffff;font-size:17px;font-weight:900">'+panelTitle+'</td></tr><tr><td class="benefit" width="50%" style="padding:18px 20px;border-right:1px solid #e1e9f0;border-bottom:1px solid #e1e9f0;color:#294b6d;font-size:15px;line-height:1.45"><strong style="color:#53ad2f">✓</strong> Avisos automáticos de vencimento</td><td class="benefit" width="50%" style="padding:18px 20px;border-bottom:1px solid #e1e9f0;color:#294b6d;font-size:15px;line-height:1.45"><strong style="color:#53ad2f">✓</strong> Consulta da validade do certificado</td></tr><tr><td class="benefit" width="50%" style="padding:18px 20px;border-right:1px solid #e1e9f0;color:#294b6d;font-size:15px;line-height:1.45"><strong style="color:#53ad2f">✓</strong> Atendimento humano e suporte remoto</td><td class="benefit" width="50%" style="padding:18px 20px;color:#294b6d;font-size:15px;line-height:1.45"><strong style="color:#53ad2f">✓</strong> Histórico e solicitação de renovação</td></tr></table></td></tr><tr><td class="pad" bgcolor="#ffffff" align="center" style="padding:24px 38px 34px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff)"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#53ad2f" style="background:#53ad2f;border-radius:9px"><a class="mobile-full" href="'+buttonUrl+'" style="display:inline-block;padding:17px 32px;color:#ffffff;font-size:15px;font-weight:900">'+button+'</a></td></tr></table><div style="margin-top:16px;font-size:14px;line-height:1.5"><a href="'+whatsapp+'" style="color:#0b5f96;font-weight:800">Prefere falar com nossa equipe? Acesse o WhatsApp</a></div></td></tr><tr><td class="pad" bgcolor="#f1f7fb" style="padding:22px 38px;border-top:1px solid #dce6ef;background:#f1f7fb;background-image:linear-gradient(#f1f7fb,#f1f7fb);color:#49637d;font-size:14px;line-height:1.65"><strong style="color:#0b3563">Segurança em primeiro lugar</strong><br>Seus dados são tratados de acordo com a LGPD. Nunca solicitaremos senha ou código de instalação do certificado por e-mail.</td></tr><tr><td class="pad" bgcolor="#ffffff" style="padding:22px 38px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff);color:#49637d;font-size:14px;line-height:1.6">Atenciosamente,<br><strong style="font-size:16px;color:#0b3563">Equipe Pedroza Certificadora</strong></td></tr><tr><td class="pad footer-center" bgcolor="#0b3563" style="padding:20px 38px;background:#0b3563;border-top:4px solid #53ad2f;color:#ffffff;font-size:12px;line-height:1.55">CERTIFICAÇÃO DIGITAL É SEGURANÇA, AGILIDADE E CONFIANÇA.<br><span style="color:#d3dfeb">pedrozacertificadora.com.br • certificadodigital@pedroza.com.br • (21) 99167-4117</span></td></tr></table></td></tr></table></body></html>';
}

function seedAccModels_() {
  const now=new Date();
  const detailRows=[
    ['Nome completo','{{NOME}}'],
    ['CPF/CNPJ','{{CPF_CNPJ}}'],
    ['Tipo','{{TIPO_CERTIFICADO}}'],
    ['Data de vencimento','{{VALIDADE}}']
  ];
  const model=function(id,name,type,subject,title,highlight,message,primaryLabel){
    return {id:id,name:name,type:type,subject:subject,html:buildAtlasEmail_({
      title:title,eyebrow:'PEDROZA CERTIFICADORA',highlight:highlight,greeting:'{{NOME}}',message:message,rows:detailRows,
      primaryLabel:primaryLabel||'FALAR NO WHATSAPP',primaryUrl:'https://wa.me/5521991674117',
      secondaryLabel:'VER DETALHES NO PORTAL ATLAS',secondaryUrl:'https://pedrozacertificadora.com.br/cliente/'
    })};
  };
  const models=[
    model('MOD-000001','Aviso de vencimento','VENCIMENTO','Aviso de vencimento do seu certificado digital','Seu certificado digital vence em breve','EM BREVE','Identificamos que o seu certificado digital está próximo do vencimento. Para evitar interrupções no acesso a sistemas e serviços, recomendamos iniciar a renovação com antecedência.'),
    model('MOD-000002','Certificado vencido','VENCIDO','Atenção: seu certificado digital está vencido','Seu certificado digital está vencido','VENCIDO','O certificado digital cadastrado consta como vencido. Nossa equipe está disponível para orientar e concluir a renovação com segurança.','RENOVAR AGORA'),
    model('MOD-000003','Renovação concluída','RENOVACAO','Renovação concluída com sucesso','Seu certificado digital foi renovado com sucesso','CONCLUÍDO','A renovação do seu certificado digital foi concluída. Agradecemos pela confiança no atendimento da Pedroza Certificadora.','FALAR COM A EQUIPE'),
    {id:'MOD-000004',name:'Comunicado personalizado',type:'PERSONALIZADO',subject:'Comunicado da Pedroza Certificadora',html:buildAtlasEmail_({title:'Comunicado importante',eyebrow:'PEDROZA CERTIFICADORA',highlight:'AVISO',greeting:'{{NOME}}',message:'{{MENSAGEM}}',rows:detailRows,primaryLabel:'FALAR NO WHATSAPP',primaryUrl:'https://wa.me/5521991674117',secondaryLabel:'ACESSAR O SITE',secondaryUrl:'https://pedrozacertificadora.com.br'})},
    model('MOD-000005','Aviso de vencimento — 90 dias','VENCIMENTO_90','Aviso de vencimento: seu certificado digital vence em 90 dias','Seu certificado digital vence em 90 dias','90 DIAS','Identificamos que o seu certificado digital está próximo do vencimento. Para evitar interrupções no acesso a sistemas e serviços, recomendamos iniciar a renovação com antecedência.','RENOVAR AGORA'),
    model('MOD-000006','Aviso de vencimento — 60 dias','VENCIMENTO_60','Seu certificado digital vence em 60 dias','Renovação recomendada','60 DIAS','Seu certificado digital está a aproximadamente 60 dias do vencimento. Recomendamos organizar a renovação para evitar imprevistos.','FALAR NO WHATSAPP'),
    model('MOD-000007','Aviso de vencimento — 30 dias','VENCIMENTO_30','Atenção: seu certificado vence em 30 dias','Renove com antecedência','30 DIAS','Faltam aproximadamente 30 dias para o vencimento do seu certificado digital. Nossa equipe já pode conduzir a renovação.','RENOVAR AGORA'),
    model('MOD-000008','Aviso de vencimento — 15 dias','VENCIMENTO_15','Prioridade: seu certificado vence em 15 dias','Renovação prioritária','15 DIAS','Faltam aproximadamente 15 dias para o vencimento. Recomendamos prioridade na renovação para manter seus acessos disponíveis.','RENOVAR AGORA'),
    model('MOD-000009','Aviso de vencimento — 7 dias','VENCIMENTO_7','Último aviso: seu certificado vence em 7 dias','Último aviso de vencimento','7 DIAS','Seu certificado digital está a aproximadamente 7 dias do vencimento. Entre em contato para realizarmos a renovação o quanto antes.','RENOVAR AGORA'),
    {id:'MOD-000010',name:'Boas-vindas à Pedroza Certificadora',type:'BOAS_VINDAS',subject:'{{NOME}}, seja bem-vindo à Pedroza Certificadora',html:buildPortalInviteEmail_('WELCOME')},
    {id:'MOD-000011',name:'Convite para o Portal do Cliente',type:'CONVITE_PORTAL',subject:'{{NOME}}, acompanhe seu certificado no Portal Pedroza',html:buildPortalInviteEmail_('PORTAL')}
  ];
  models.forEach(function(m){
    const current=findById_('MODELOS_EMAIL',m.id);
    const data={NOME:m.name,TIPO:m.type,ASSUNTO:m.subject,HTML:m.html,VARIAVEIS_JSON:JSON.stringify(['NOME','EMPRESA','CPF_CNPJ','TIPO_CERTIFICADO','VALIDADE','MENSAGEM','ASSINATURA','TOKEN_CONVITE']),ATIVO:'SIM',STATUS:'ATIVO',ALTERADO_EM:now,ALTERADO_POR:'SETUP-5.0.4D.2'};
    if(current) updateRow_('MODELOS_EMAIL',m.id,data,'SETUP-5.0.4D.2');
    else appendObject_('MODELOS_EMAIL',Object.assign({ID:m.id,CRIADO_EM:now,CRIADO_POR:'SETUP-5.0.4D.2'},data));
  });
}

function createCampaign_(p) {
  if(!String(p.nome||'').trim()) throw apiError_('VALIDATION','Informe o nome da campanha.');
  const now=new Date(), actor=String(p.actor||'ATLAS'), id=nextId_('CAMPANHAS','CAM');
  appendObject_('CAMPANHAS',{ID:id,NOME:String(p.nome).trim(),DESCRICAO:String(p.descricao||''),CANAL:String(p.canal||'EMAIL').toUpperCase(),MODELO_ID:String(p.modeloId||''),FILTRO_JSON:JSON.stringify(p.filtro||{}),SITUACAO:'RASCUNHO',AGENDADO_PARA:p.agendadoPara||'',INICIADO_EM:'',FINALIZADO_EM:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  return findById_('CAMPANHAS',id);
}
function previewCampaign_(p) {
  const f=p.filtro||{};
  let clients=rows_('CLIENTES').filter(r=>String(r.STATUS).toUpperCase()==='ATIVO');
  if(f.setorId) clients=clients.filter(r=>String(r.SETOR_ID)===String(f.setorId));
  if(f.subsetorId) clients=clients.filter(r=>String(r.SUBSETOR_ID)===String(f.subsetorId));
  if(Array.isArray(f.clienteIds)&&f.clienteIds.length) clients=clients.filter(r=>f.clienteIds.indexOf(String(r.ID))>=0);
  const valid=clients.filter(r=>normalize_(r.EMAIL));
  return {clientes:clients.length,emailsValidos:valid.length,semEmail:clients.length-valid.length,destinatarios:valid.map(r=>({id:r.ID,nome:r.NOME,email:r.EMAIL}))};
}
function generateInvite_(p) {
  const client=findById_('CLIENTES',p.clienteId);
  if(!client) throw apiError_('NOT_FOUND','Cliente nao encontrado.');
  const token=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
  const hash=sha256Hex_(token), now=new Date(), expiry=new Date(now.getTime()+Number(p.ttlHours||72)*3600000), actor=String(p.actor||'ATLAS'), id=nextId_('CONVITES','CNV');
  appendObject_('CONVITES',{ID:id,CLIENTE_ID:client.ID,USUARIO_ID:String(p.usuarioId||''),EMAIL:String(p.email||client.EMAIL||''),TOKEN_HASH:hash,EXPIRA_EM:expiry,ACEITO_EM:'',SITUACAO:'PENDENTE',TENTATIVAS:0,STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor});
  addTimeline_({clienteId:client.ID,tipoEvento:'CONVITE_GERADO',titulo:'Convite de primeiro acesso gerado',descricao:'Convite valido ate '+expiry.toISOString(),origem:'PORTAL',actor:actor,dados:{conviteId:id}});
  return {id:id,token:token,expiraEm:expiry};
}
function validateInvite_(p) {
  const hash=sha256Hex_(String(p.token||''));
  const invite=rows_('CONVITES').find(r=>String(r.TOKEN_HASH)===hash&&String(r.STATUS).toUpperCase()==='ATIVO');
  if(!invite) throw apiError_('INVALID_INVITE','Convite invalido.');
  if(String(invite.SITUACAO).toUpperCase()!=='PENDENTE') throw apiError_('INVALID_INVITE','Convite ja utilizado ou cancelado.');
  if(new Date(invite.EXPIRA_EM)<new Date()) throw apiError_('EXPIRED_INVITE','Convite expirado.');
  return {valido:true,conviteId:invite.ID,clienteId:invite.CLIENTE_ID,email:invite.EMAIL,expiraEm:invite.EXPIRA_EM};
}
function acceptInvite_(p,clientMeta) {
  const validation=validateInvite_({token:p.token});
  const invite=findById_('CONVITES',validation.conviteId);
  const client=findById_('CLIENTES',validation.clienteId);
  const passwordHash=String(p.passwordHash||'');
  if(!client) throw apiError_('NOT_FOUND','Cliente do convite nao encontrado.');
  if(!/^[a-f0-9]{64}$/i.test(passwordHash)) throw apiError_('VALIDATION','Crie uma senha valida para ativar o portal.');
  const email=normalize_(invite.EMAIL||client.EMAIL||client.EMAIL_SECUNDARIO||'');
  if(!email) throw apiError_('VALIDATION','O cliente nao possui e-mail cadastrado.');
  let user=rows_('USUARIOS').find(function(row){
    return normalize_(row.EMAIL)===email || (String(row.PERFIL||'').toUpperCase()==='CLIENTE' && digits_(row.CPF_CNPJ)===digits_(client.CPF_CNPJ));
  });
  const now=new Date(), actor='PORTAL_ATIVACAO';
  if(user) {
    updateRow_('USUARIOS',user.ID,{
      LOGIN:email,EMAIL:email,NOME:String(client.NOME||client.EMPRESA||email),PERFIL:'CLIENTE',
      HASH_SENHA:passwordHash,CPF_CNPJ:digits_(client.CPF_CNPJ),CHAVE_CERTIFICADO:digits_(client.CPF_CNPJ),STATUS:'ATIVO'
    },actor);
  } else {
    const userId=nextId_('USUARIOS','USR');
    appendObject_('USUARIOS',{
      ID:userId,LOGIN:email,EMAIL:email,NOME:String(client.NOME||client.EMPRESA||email),PERFIL:'CLIENTE',
      HASH_SENHA:passwordHash,CPF_CNPJ:digits_(client.CPF_CNPJ),TELEFONE:String(client.TELEFONE||client.WHATSAPP||''),
      CHAVE_CERTIFICADO:digits_(client.CPF_CNPJ),PREFERENCIAS_JSON:JSON.stringify({expiration:true,email:true,whatsapp:false}),
      STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:actor,ALTERADO_EM:now,ALTERADO_POR:actor
    });
    user=findById_('USUARIOS',userId);
  }
  updateRow_('CONVITES',invite.ID,{USUARIO_ID:user.ID,ACEITO_EM:now,SITUACAO:'ACEITO'},actor);
  addTimeline_({clienteId:client.ID,tipoEvento:'PORTAL_ATIVADO',titulo:'Portal do Cliente ativado',descricao:'Primeiro acesso configurado com sucesso.',origem:'PORTAL',actor:actor,dados:{conviteId:invite.ID,usuarioId:user.ID}});
  recordAudit_({action:'PORTAL_ACTIVATED',details:{clienteId:client.ID,usuarioId:user.ID,conviteId:invite.ID}},clientMeta||{});
  return {ativado:true,login:email};
}
function portalContext_(authToken) {
  const session=requireSession_(authToken);
  const user=findById_('USUARIOS',session.id);
  if(!user || String(user.PERFIL||'').toUpperCase()!=='CLIENTE') throw apiError_('FORBIDDEN','Acesso exclusivo do cliente.');
  const document=digits_(user.CHAVE_CERTIFICADO||user.CPF_CNPJ);
  const client=rows_('CLIENTES').find(function(row){return digits_(row.CPF_CNPJ)===document;});
  if(!client) throw apiError_('NOT_FOUND','Cadastro do cliente nao localizado.');
  return {session:session,user:user,client:client};
}
function portalSummary_(authToken) {
  const context=portalContext_(authToken), client=context.client;
  const certificates=rows_('CERTIFICADOS').filter(function(row){return String(row.CLIENTE_ID)===String(client.ID)&&String(row.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO';}).map(publicCertificate_);
  const timeline=rows_('TIMELINE').filter(function(row){return String(row.CLIENTE_ID)===String(client.ID)&&String(row.STATUS||'ATIVO').toUpperCase()==='ATIVO';}).sort(function(a,b){return new Date(b.DATA_HORA||0)-new Date(a.DATA_HORA||0);}).slice(0,20).map(function(row){
    return {id:row.ID,tipo:row.TIPO_EVENTO,titulo:row.TITULO,descricao:row.DESCRICAO,dataHora:row.DATA_HORA};
  });
  return {
    cliente:{id:client.ID,nome:String(client.NOME||client.EMPRESA||'Cliente'),email:mascararEmailPublico_(client.EMAIL||client.EMAIL_SECUNDARIO||''),documento:mascararDocumentoPublico_(client.CPF_CNPJ),telefone:String(client.TELEFONE||client.WHATSAPP||'')},
    certificados:certificates,
    timeline:timeline,
    preferencias:parseJson_(context.user.PREFERENCIAS_JSON,{expiration:true,email:true,whatsapp:false})
  };
}
function portalRequestRenewal_(authToken,p,clientMeta) {
  const context=portalContext_(authToken), certificateId=String(p.certificadoId||'');
  const certificate=rows_('CERTIFICADOS').find(function(row){return String(row.ID)===certificateId&&String(row.CLIENTE_ID)===String(context.client.ID);});
  if(!certificate) throw apiError_('NOT_FOUND','Certificado nao localizado para este cliente.');
  const event=addTimeline_({clienteId:context.client.ID,tipoEvento:'RENOVACAO_SOLICITADA',titulo:'Renovacao solicitada pelo Portal',descricao:'Solicitacao referente ao certificado '+String(certificate.TIPO||certificate.MODELO||certificate.ID)+'.',origem:'PORTAL',actor:context.user.LOGIN,dados:{certificadoId:certificate.ID}});
  recordAudit_({action:'PORTAL_RENEWAL_REQUESTED',details:{clienteId:context.client.ID,certificadoId:certificate.ID,usuarioId:context.user.ID}},clientMeta||{});
  return {solicitado:true,eventoId:event.ID};
}
function sha256Hex_(value){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(value),Utilities.Charset.UTF_8).map(b=>(b+256)%256).map(b=>('0'+b.toString(16)).slice(-2)).join('');}
function seedCrmCatalogs_() {
  const now=new Date();
  if(!rows_('SETORES').length){
    ['Medicina','Advocacia','Condominio','Contabilidade','Engenharia','Comercio','Servicos','Pessoa Fisica','Outros'].forEach((nome,i)=>appendObject_('SETORES',{ID:'SET-'+String(i+1).padStart(6,'0'),NOME:nome,DESCRICAO:'Setor padrao ACMS',ORDEM:i+1,STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'SETUP-4.8.2',ALTERADO_EM:now,ALTERADO_POR:'SETUP-4.8.2'}));
  }
  if(!rows_('TAGS').length){
    ['Cliente VIP','Parceiro','Recorrente','Renovacao Prioritaria','Origem Google','Origem Indicacao','Origem Instagram'].forEach((nome,i)=>appendObject_('TAGS',{ID:'TAG-'+String(i+1).padStart(6,'0'),NOME:nome,DESCRICAO:'Tag padrao ACMS',COR:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'SETUP-4.8.2',ALTERADO_EM:now,ALTERADO_POR:'SETUP-4.8.2'}));
  }
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
function ensureSheet_(ss,name,headers) {
  let s=ss.getSheetByName(name);
  if(!s) s=ss.insertSheet(name);
  const existing=s.getLastColumn()>0?s.getRange(1,1,1,s.getLastColumn()).getValues()[0].filter(String):[];
  if(!existing.length){
    s.getRange(1,1,1,headers.length).setValues([headers]);
  } else {
    const missing=headers.filter(h=>existing.indexOf(h)===-1);
    if(missing.length) s.getRange(1,existing.length+1,1,missing.length).setValues([missing]);
  }
  s.setFrozenRows(1);
  s.getRange(1,1,1,s.getLastColumn()).setFontWeight('bold');
}
function appendObject_(name,obj) { const s=sheet_(name), headers=s.getRange(1,1,1,s.getLastColumn()).getValues()[0]; s.appendRow(headers.map(h=>obj[h]!==undefined?obj[h]:'')); }
function findById_(name,id) { return rows_(name).find(r=>String(r.ID)===String(id))||null; }
function updateRow_(name,id,changes,actor,mapper) { const s=sheet_(name), data=s.getDataRange().getValues(), headers=data[0], idCol=headers.indexOf('ID'); for(let i=1;i<data.length;i++){ if(String(data[i][idCol])===String(id)){ Object.keys(changes).forEach(k=>{const c=headers.indexOf(k);if(c>=0)s.getRange(i+1,c+1).setValue(changes[k]);}); ['ALTERADO_EM','ALTERADO_POR'].forEach((k,j)=>{const c=headers.indexOf(k);if(c>=0)s.getRange(i+1,c+1).setValue(j===0?new Date():actor);}); const row=headers.reduce((o,k,c)=>(o[k]=s.getRange(i+1,c+1).getValue(),o),{}); return mapper?mapper(row):row; }} throw apiError_('NOT_FOUND','Registro nao encontrado.'); }
function nextId_(name,prefix) { const max=rows_(name).reduce((m,r)=>Math.max(m,Number(String(r.ID||'').replace(/\D/g,''))||0),0); return prefix+'-'+String(max+1).padStart(6,'0'); }
function publicUser_(u) { return {id:u.ID,username:u.LOGIN,email:u.EMAIL,displayName:u.NOME,role:String(u.PERFIL||'').toUpperCase(),active:String(u.STATUS||'').toUpperCase()==='ATIVO',document:String(u.CPF_CNPJ||''),certificateOwnerKey:String(u.CHAVE_CERTIFICADO||u.CPF_CNPJ||''),phone:String(u.TELEFONE||'')}; }
function seedConfig_() {
  const existing = rows_('CONFIGURACOES').find(r => r.CHAVE === 'ATLAS_VERSION');
  const now = new Date();
  if (existing) {
    updateRow_('CONFIGURACOES', existing.ID, {
      VALOR_JSON: JSON.stringify(ATLAS_VERSION),
      DESCRICAO: 'Versao da Atlas Data Foundation',
      STATUS: 'ATIVO'
    }, 'SETUP');
    return;
  }
  appendObject_('CONFIGURACOES', {
    ID: nextId_('CONFIGURACOES', 'CFG'),
    CHAVE: 'ATLAS_VERSION',
    VALOR_JSON: JSON.stringify(ATLAS_VERSION),
    DESCRICAO: 'Versao da Atlas Data Foundation',
    STATUS: 'ATIVO',
    CRIADO_EM: now,
    CRIADO_POR: 'SETUP',
    ALTERADO_EM: now,
    ALTERADO_POR: 'SETUP'
  });
}
function appendLog_(nivel,origem,mensagem,contexto) { const n=new Date();appendObject_('LOGS',{ID:nextId_('LOGS','LOG'),NIVEL:nivel,ORIGEM:origem,MENSAGEM:mensagem,CONTEXTO_JSON:JSON.stringify(contexto||{}),DATA_HORA:n,STATUS:'ATIVO',CRIADO_EM:n,CRIADO_POR:'API',ALTERADO_EM:n,ALTERADO_POR:'API'}); }
function normalize_(v){return String(v||'').trim().toLowerCase();} function digits_(v){return String(v||'').replace(/\D/g,'');} function parseJson_(v,f){try{return JSON.parse(v||'');}catch(_){return f;}} function apiError_(code,message){const e=new Error(message);e.code=code;return e;} function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}


/**
 * Sprint 4.8.3.1 - Hotfix Code.gs Limpo
 *
 * Fluxo seguro:
 * 1) validarImportacaoCRM(sourceSpreadsheetId)
 * 2) simularImportacaoCRM(sourceSpreadsheetId)
 * 3) importarBaseCRM(sourceSpreadsheetId)
 *
 * A importacao CRM preserva as estruturas operacionais da producao:
 * USUARIOS, PERMISSOES, AUDITORIA, CONFIGURACOES e LOGS.
 */
const CRM_IMPORT_SHEETS = Object.freeze([
  'CLIENTES','CERTIFICADOS','AGENDA','TIMELINE','COMUNICACOES','MODELOS_EMAIL',
  'CAMPANHAS','CAMPANHA_DESTINATARIOS','PREFERENCIAS_COMUNICACAO','CONVITES',
  'FILA_ENVIO','SETORES','SUBSETORES','TAGS','CLIENTE_TAGS','IA_PROFILE'
]);

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Atlas CRM')
    .addItem('Configurar estrutura 4.8.3.1', 'configurarAtlasDataFoundation')
    .addSeparator()
    .addItem('Validar base para importacao', 'solicitarValidacaoImportacaoCRM')
    .addItem('Simular importacao (sem gravar)', 'solicitarSimulacaoImportacaoCRM')
    .addItem('Importar base homologada', 'solicitarImportacaoCRM')
    .addSeparator()
    .addItem('Restaurar backup da importacao', 'solicitarRestauracaoBackupCRM')
    .addToUi();
}

function solicitarValidacaoImportacaoCRM() {
  const ui=SpreadsheetApp.getUi();
  const r=ui.prompt('Validar base CRM','Cole o ID da Planilha Google convertida a partir do XLSX oficial:',ui.ButtonSet.OK_CANCEL);
  if(r.getSelectedButton()!==ui.Button.OK) return;
  const result=validarImportacaoCRM(String(r.getResponseText()||'').trim());
  ui.alert('Validacao concluida',JSON.stringify(result,null,2),ui.ButtonSet.OK);
}

function solicitarSimulacaoImportacaoCRM() {
  const ui=SpreadsheetApp.getUi();
  const r=ui.prompt('Simular importacao CRM','Cole o ID da Planilha Google ja validada:',ui.ButtonSet.OK_CANCEL);
  if(r.getSelectedButton()!==ui.Button.OK) return;
  const result=simularImportacaoCRM(String(r.getResponseText()||'').trim());
  ui.alert('Simulacao concluida',JSON.stringify(result,null,2),ui.ButtonSet.OK);
}

function solicitarImportacaoCRM() {
  const ui=SpreadsheetApp.getUi();
  const r=ui.prompt('Importar base CRM','Cole o ID da Planilha Google validada e simulada:',ui.ButtonSet.OK_CANCEL);
  if(r.getSelectedButton()!==ui.Button.OK) return;
  const confirm=ui.alert('Confirmar importacao','Apenas as abas CRM serao importadas. Usuarios, senhas, permissoes, auditoria, configuracoes e logs da producao serao preservados. Um backup automatico sera criado. Deseja continuar?',ui.ButtonSet.YES_NO);
  if(confirm!==ui.Button.YES) return;
  const result=importarBaseCRM(String(r.getResponseText()||'').trim());
  ui.alert('Importacao concluida',JSON.stringify(result,null,2),ui.ButtonSet.OK);
}

function solicitarRestauracaoBackupCRM() {
  const ui=SpreadsheetApp.getUi();
  const r=ui.prompt('Restaurar backup CRM','Cole o ID do backup criado pela importacao:',ui.ButtonSet.OK_CANCEL);
  if(r.getSelectedButton()!==ui.Button.OK) return;
  const confirm=ui.alert('Confirmar restauracao','As abas CRM atuais serao substituidas pelas copias do backup informado. Deseja continuar?',ui.ButtonSet.YES_NO);
  if(confirm!==ui.Button.YES) return;
  const result=restaurarBackupImportacaoCRM(String(r.getResponseText()||'').trim());
  ui.alert('Restauracao concluida',JSON.stringify(result,null,2),ui.ButtonSet.OK);
}

function validarImportacaoCRM(sourceSpreadsheetId) {
  if(!sourceSpreadsheetId) throw apiError_('VALIDATION','Informe o ID da planilha de origem.');
  const target=SpreadsheetApp.getActiveSpreadsheet();
  if(String(sourceSpreadsheetId)===String(target.getId())) throw apiError_('VALIDATION','A planilha de origem nao pode ser a propria base oficial do Atlas.');
  const source=SpreadsheetApp.openById(sourceSpreadsheetId);
  const report={version:ATLAS_VERSION,sourceId:sourceSpreadsheetId,sourceName:source.getName(),sheets:{},errors:[],warnings:[],protectedSheets:['USUARIOS','PERMISSOES','AUDITORIA','CONFIGURACOES','LOGS'],approved:false};
  const sourceClientIds={};
  const clientSheet=source.getSheetByName('CLIENTES');
  if(!clientSheet){ report.errors.push('Aba CLIENTES nao encontrada.'); return writeImportReport_(report); }
  const clients=readSheetObjects_(clientSheet);
  clients.forEach(r=>{const id=String(r.ID||'').trim(); if(id) sourceClientIds[id]=true;});
  if(!clients.length) report.errors.push('Aba CLIENTES sem registros.');
  const duplicateClientIds=findDuplicateValues_(clients,'ID');
  if(duplicateClientIds.length) report.errors.push('IDs duplicados em CLIENTES: '+duplicateClientIds.join(', '));

  CRM_IMPORT_SHEETS.forEach(name=>{
    const sh=source.getSheetByName(name);
    if(!sh){
      report.warnings.push('Aba CRM ausente: '+name);
      return;
    }
    const objects=readSheetObjects_(sh);
    const headers=sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String):[];
    const missing=(SHEETS[name]||[]).filter(h=>headers.indexOf(h)<0);
    report.sheets[name]={rows:objects.length,missingHeaders:missing};
    if(missing.length) report.errors.push(name+' sem colunas obrigatorias: '+missing.join(', '));
    if(headers.indexOf('ID')>=0){
      const dup=findDuplicateValues_(objects,'ID');
      if(dup.length) report.errors.push('IDs duplicados em '+name+': '+dup.slice(0,50).join(', '));
    }
    if(headers.indexOf('CLIENTE_ID')>=0){
      const orphans=objects.filter(r=>String(r.CLIENTE_ID||'').trim()&&!sourceClientIds[String(r.CLIENTE_ID).trim()]);
      if(orphans.length) report.errors.push(name+' possui '+orphans.length+' registros sem cliente valido.');
    }
  });
  report.approved=report.errors.length===0;
  report.fingerprint=report.approved?buildImportFingerprint_(source,report):'';
  if(report.approved) PropertiesService.getScriptProperties().setProperty('CRM_VALIDATED_'+sourceSpreadsheetId,report.fingerprint);
  return writeImportReport_(report);
}

function simularImportacaoCRM(sourceSpreadsheetId) {
  const validation=validarImportacaoCRM(sourceSpreadsheetId);
  if(!validation.approved) throw apiError_('IMPORT_VALIDATION_FAILED','A base nao foi aprovada. Consulte a aba IMPORTACAO_CRM.');
  const target=SpreadsheetApp.getActiveSpreadsheet();
  const source=SpreadsheetApp.openById(sourceSpreadsheetId);
  const simulation={version:ATLAS_VERSION,sourceId:sourceSpreadsheetId,sourceName:source.getName(),fingerprint:validation.fingerprint,sheets:{},protectedSheetsPreserved:['USUARIOS','PERMISSOES','AUDITORIA','CONFIGURACOES','LOGS'],totals:{inserted:0,updated:0,skipped:0},approved:true,generatedAt:new Date().toISOString()};
  CRM_IMPORT_SHEETS.forEach(name=>{
    const src=source.getSheetByName(name);
    if(!src) return;
    const dst=target.getSheetByName(name);
    const result=previewSheetUpsert_(src,dst);
    simulation.sheets[name]=result;
    simulation.totals.inserted+=result.inserted;
    simulation.totals.updated+=result.updated;
    simulation.totals.skipped+=result.skipped;
  });
  PropertiesService.getScriptProperties().setProperty('CRM_SIMULATED_'+sourceSpreadsheetId,validation.fingerprint);
  writeImportReport_({approved:true,simulation:simulation,errors:[],warnings:[]});
  return simulation;
}

function importarBaseCRM(sourceSpreadsheetId) {
  const validation=validarImportacaoCRM(sourceSpreadsheetId);
  if(!validation.approved) throw apiError_('IMPORT_VALIDATION_FAILED','A base nao foi aprovada. Consulte a aba IMPORTACAO_CRM.');
  const props=PropertiesService.getScriptProperties();
  const simulated=props.getProperty('CRM_SIMULATED_'+sourceSpreadsheetId);
  if(simulated!==validation.fingerprint) throw apiError_('IMPORT_NOT_SIMULATED','Execute primeiro Simular importacao (sem gravar) para esta mesma versao da base.');

  const target=SpreadsheetApp.getActiveSpreadsheet();
  const source=SpreadsheetApp.openById(sourceSpreadsheetId);
  const backup=DriveApp.getFileById(target.getId()).makeCopy('Atlas Backup Antes Importacao 4.8.3.1 - '+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy-MM-dd HH-mm-ss'));
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  const summary={version:ATLAS_VERSION,sourceId:sourceSpreadsheetId,sourceName:source.getName(),fingerprint:validation.fingerprint,backupId:backup.getId(),backupName:backup.getName(),protectedSheetsPreserved:['USUARIOS','PERMISSOES','AUDITORIA','CONFIGURACOES','LOGS'],sheets:{},totals:{inserted:0,updated:0,skipped:0},startedAt:new Date().toISOString()};
  try {
    CRM_IMPORT_SHEETS.forEach(name=>{
      const src=source.getSheetByName(name);
      if(!src) return;
      ensureSheet_(target,name,SHEETS[name]||[]);
      const dst=target.getSheetByName(name);
      const result=upsertSheetFromSourceBatch_(src,dst);
      summary.sheets[name]=result;
      summary.totals.inserted+=result.inserted;
      summary.totals.updated+=result.updated;
      summary.totals.skipped+=result.skipped;
    });
    seedConfig_();
    summary.finishedAt=new Date().toISOString();
    summary.ok=true;
    appendLog_('INFO','IMPORTADOR_CRM','Importacao CRM 4.8.3.1 concluida',summary);
    recordAudit_({action:'CRM_IMPORT_SUCCESS',details:{sourceId:sourceSpreadsheetId,backupId:backup.getId(),summary:summary}},{});
    writeImportReport_({approved:true,importSummary:summary,errors:[],warnings:[]});
    props.setProperty('CRM_LAST_BACKUP_ID',backup.getId());
    props.setProperty('CRM_LAST_IMPORT_SOURCE',sourceSpreadsheetId);
    props.deleteProperty('CRM_SIMULATED_'+sourceSpreadsheetId);
    SpreadsheetApp.flush();
    return summary;
  } catch(error) {
    summary.ok=false; summary.error=error.message; summary.failedAt=new Date().toISOString();
    try{appendLog_('ERROR','IMPORTADOR_CRM','Falha na importacao CRM. Backup disponivel para restauracao.',summary);}catch(_){ }
    try{recordAudit_({action:'CRM_IMPORT_FAILED',details:{sourceId:sourceSpreadsheetId,backupId:backup.getId(),error:error.message}},{});}catch(_){ }
    writeImportReport_({approved:false,importSummary:summary,errors:['Falha na importacao: '+error.message,'Use o backup '+backup.getId()+' para restauracao, se necessario.'],warnings:[]});
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function restaurarBackupImportacaoCRM(backupSpreadsheetId) {
  if(!backupSpreadsheetId) throw apiError_('VALIDATION','Informe o ID do backup.');
  const target=SpreadsheetApp.getActiveSpreadsheet();
  const backup=SpreadsheetApp.openById(backupSpreadsheetId);
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  const result={version:ATLAS_VERSION,backupId:backupSpreadsheetId,backupName:backup.getName(),restoredSheets:{},startedAt:new Date().toISOString()};
  try{
    CRM_IMPORT_SHEETS.forEach(name=>{
      const src=backup.getSheetByName(name);
      if(!src) return;
      ensureSheet_(target,name,SHEETS[name]||[]);
      const dst=target.getSheetByName(name);
      const values=src.getDataRange().getValues();
      dst.clearContents();
      if(values.length&&values[0].length) dst.getRange(1,1,values.length,values[0].length).setValues(values);
      dst.setFrozenRows(1);
      result.restoredSheets[name]={rows:Math.max(values.length-1,0)};
    });
    result.finishedAt=new Date().toISOString(); result.ok=true;
    appendLog_('WARN','IMPORTADOR_CRM','Backup CRM restaurado',result);
    recordAudit_({action:'CRM_IMPORT_ROLLBACK',details:result},{});
    writeImportReport_({approved:true,restoreSummary:result,errors:[],warnings:['Backup restaurado manualmente.']});
    SpreadsheetApp.flush();
    return result;
  } finally {
    lock.releaseLock();
  }
}

function previewSheetUpsert_(sourceSheet,targetSheet) {
  const sourceRows=readSheetObjects_(sourceSheet);
  if(!targetSheet) return {sourceRows:sourceRows.length,inserted:sourceRows.length,updated:0,skipped:0};
  const targetHeaders=targetSheet.getLastColumn()?targetSheet.getRange(1,1,1,targetSheet.getLastColumn()).getValues()[0].map(String):[];
  const targetRows=readSheetObjects_(targetSheet);
  const hasId=targetHeaders.indexOf('ID')>=0;
  const targetIds={}; targetRows.forEach(r=>{const id=String(r.ID||'').trim();if(id)targetIds[id]=true;});
  let inserted=0,updated=0,skipped=0;
  sourceRows.forEach(obj=>{const id=String(obj.ID||'').trim();if(hasId&&!id){skipped++;}else if(id&&targetIds[id]){updated++;}else{inserted++;}});
  return {sourceRows:sourceRows.length,inserted:inserted,updated:updated,skipped:skipped};
}

function upsertSheetFromSourceBatch_(sourceSheet,targetSheet) {
  const sourceRows=readSheetObjects_(sourceSheet);
  const targetHeaders=targetSheet.getRange(1,1,1,targetSheet.getLastColumn()).getValues()[0].map(String);
  const targetData=targetSheet.getDataRange().getValues();
  const idIndex=targetHeaders.indexOf('ID');
  const rowById={};
  for(let r=1;r<targetData.length;r++){
    const id=idIndex>=0?String(targetData[r][idIndex]||'').trim():'';
    if(id) rowById[id]=r;
  }
  let inserted=0,updated=0,skipped=0;
  sourceRows.forEach(obj=>{
    const id=String(obj.ID||'').trim();
    const values=targetHeaders.map(h=>obj[h]!==undefined?obj[h]:'');
    if(idIndex>=0&&!id){skipped++;return;}
    if(id&&rowById[id]!==undefined){
      targetData[rowById[id]]=values;
      updated++;
    }else{
      targetData.push(values);
      if(id) rowById[id]=targetData.length-1;
      inserted++;
    }
  });
  targetSheet.clearContents();
  if(targetData.length&&targetHeaders.length) targetSheet.getRange(1,1,targetData.length,targetHeaders.length).setValues(targetData);
  targetSheet.setFrozenRows(1);
  targetSheet.getRange(1,1,1,targetHeaders.length).setFontWeight('bold');
  return {sourceRows:sourceRows.length,inserted:inserted,updated:updated,skipped:skipped,finalRows:Math.max(targetData.length-1,0)};
}

function buildImportFingerprint_(source,report) {
  const payload=[ATLAS_VERSION,source.getId(),source.getName()];
  Object.keys(report.sheets||{}).sort().forEach(name=>payload.push(name+':'+report.sheets[name].rows+':'+(report.sheets[name].missingHeaders||[]).join(',')));
  return sha256Hex_(payload.join('|'));
}

function readSheetObjects_(sheet) {
  const values=sheet.getDataRange().getValues();
  if(values.length<2) return [];
  const headers=values[0].map(v=>String(v||'').trim());
  return values.slice(1).filter(row=>row.some(v=>v!==''&&v!==null)).map(row=>{
    const obj={}; headers.forEach((h,i)=>{if(h)obj[h]=row[i];}); return obj;
  });
}

function findDuplicateValues_(rows,key) {
  const seen={},duplicates={};
  rows.forEach(r=>{const v=String(r[key]||'').trim();if(!v)return;if(seen[v])duplicates[v]=true;seen[v]=true;});
  return Object.keys(duplicates);
}

function writeImportReport_(report) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  let sh=ss.getSheetByName('IMPORTACAO_CRM');
  if(!sh) sh=ss.insertSheet('IMPORTACAO_CRM');
  sh.clear();
  const rows=[['ATLAS CRM - RELATORIO DE IMPORTACAO',''],['Versao',ATLAS_VERSION],['Gerado em',new Date()],['Aprovado',report.approved?'SIM':'NAO']];
  (report.errors||[]).forEach(v=>rows.push(['ERRO',v]));
  (report.warnings||[]).forEach(v=>rows.push(['AVISO',v]));
  if(report.protectedSheets) rows.push(['ABAS PROTEGIDAS',report.protectedSheets.join(', ')]);
  if(report.sheets){Object.keys(report.sheets).forEach(k=>rows.push(['VALIDACAO '+k,JSON.stringify(report.sheets[k])]));}
  if(report.simulation){
    rows.push(['SIMULACAO TOTAL',JSON.stringify(report.simulation.totals)]);
    Object.keys(report.simulation.sheets||{}).forEach(k=>rows.push(['SIMULACAO '+k,JSON.stringify(report.simulation.sheets[k])]));
  }
  if(report.importSummary) rows.push(['RESUMO IMPORTACAO',JSON.stringify(report.importSummary)]);
  if(report.restoreSummary) rows.push(['RESUMO RESTAURACAO',JSON.stringify(report.restoreSummary)]);
  sh.getRange(1,1,rows.length,2).setValues(rows);
  sh.getRange(1,1,1,2).setFontWeight('bold').setBackground('#17365D').setFontColor('#FFFFFF');
  sh.autoResizeColumns(1,2); sh.setFrozenRows(1);
  return report;
}


/* Sprint 5.0.4 - ACC Automation Engine */
const ACC_AUTOMATION_DEFAULTS = Object.freeze({
  enabled:false,
  testMode:true,
  testRecipient:'',
  dailyLimit:40,
  batchSize:20,
  replyTo:'certificadodigital@pedroza.com.br',
  senderName:'Pedroza Certificadora',
  milestones:[90,60,30,15,7,0,-1]
});

function getAccAutomationConfig_() {
  const props=PropertiesService.getScriptProperties();
  let saved={};
  try { saved=JSON.parse(props.getProperty('ACC_AUTOMATION_CONFIG')||'{}'); } catch(_){ saved={}; }
  return Object.assign({},ACC_AUTOMATION_DEFAULTS,saved||{});
}
function saveAccAutomationConfig_(cfg) {
  PropertiesService.getScriptProperties().setProperty('ACC_AUTOMATION_CONFIG',JSON.stringify(cfg));
  return cfg;
}
function automationStatus_() {
  ensureAccAutomationFoundation_();
  const cfg=getAccAutomationConfig_();
  const queue=rows_('FILA_ENVIO').filter(function(r){return String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO';});
  const comm=rows_('COMUNICACOES');
  const today=Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'America/Sao_Paulo','yyyy-MM-dd');
  const sentToday=comm.filter(function(r){
    if(!r.ENVIADO_EM) return false;
    try{return Utilities.formatDate(new Date(r.ENVIADO_EM),Session.getScriptTimeZone()||'America/Sao_Paulo','yyyy-MM-dd')===today;}catch(_){return false;}
  }).length;
  return {config:cfg,queue:{pending:queue.filter(r=>String(r.SITUACAO)==='PENDENTE').length,error:queue.filter(r=>String(r.SITUACAO)==='ERRO').length,total:queue.length},sentToday:sentToday,remainingQuota:MailApp.getRemainingDailyQuota(),triggers:ScriptApp.getProjectTriggers().map(function(t){return {handler:t.getHandlerFunction(),eventType:String(t.getEventType())};})};
}
function configureAutomation_(p) {
  const cfg=getAccAutomationConfig_();
  if(Object.prototype.hasOwnProperty.call(p,'enabled')) cfg.enabled=Boolean(p.enabled);
  if(Object.prototype.hasOwnProperty.call(p,'testMode')) cfg.testMode=Boolean(p.testMode);
  if(Object.prototype.hasOwnProperty.call(p,'testRecipient')) cfg.testRecipient=normalize_(p.testRecipient||'');
  if(Object.prototype.hasOwnProperty.call(p,'dailyLimit')) cfg.dailyLimit=Math.max(1,Math.min(500,Number(p.dailyLimit)||40));
  if(Object.prototype.hasOwnProperty.call(p,'batchSize')) cfg.batchSize=Math.max(1,Math.min(100,Number(p.batchSize)||20));
  if(Object.prototype.hasOwnProperty.call(p,'replyTo')) cfg.replyTo=normalize_(p.replyTo||ACC_AUTOMATION_DEFAULTS.replyTo);
  saveAccAutomationConfig_(cfg);
  recordAudit_({action:'ACC_AUTOMATION_CONFIG_UPDATED',details:{enabled:cfg.enabled,testMode:cfg.testMode,dailyLimit:cfg.dailyLimit,batchSize:cfg.batchSize}},{});
  return automationStatus_();
}
function installAccAutomationTriggers_() {
  ensureAccAutomationFoundation_();
  removeAccAutomationTriggers_();
  ScriptApp.newTrigger('accDailyAutomationTrigger').timeBased().everyDays(1).atHour(8).create();
  ScriptApp.newTrigger('accQueueProcessorTrigger').timeBased().everyHours(1).create();
  recordAudit_({action:'ACC_TRIGGERS_INSTALLED',details:{handlers:['accDailyAutomationTrigger','accQueueProcessorTrigger']}},{});
  return automationStatus_();
}
function removeAccAutomationTriggers_() {
  let removed=0;
  ScriptApp.getProjectTriggers().forEach(function(t){if(['accDailyAutomationTrigger','accQueueProcessorTrigger'].indexOf(t.getHandlerFunction())>=0){ScriptApp.deleteTrigger(t);removed++;}});
  try{recordAudit_({action:'ACC_TRIGGERS_REMOVED',details:{removed:removed}},{});}catch(_){}
  return automationStatus_();
}
function listAccAutomationTriggers_(){
  return ScriptApp.getProjectTriggers().filter(function(t){return ['accDailyAutomationTrigger','accQueueProcessorTrigger'].indexOf(t.getHandlerFunction())>=0;}).map(function(t){return {handler:t.getHandlerFunction(),eventType:String(t.getEventType()),uniqueId:t.getUniqueId?t.getUniqueId():''};});
}

function accDailyAutomationTrigger(){ return runAccAutomation_({source:'TRIGGER'}); }
function accQueueProcessorTrigger(){ return processAccQueue_(); }
function runAccAutomation_(p) {
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(1000)) return {ok:false,skipped:true,reason:'LOCKED'};
  try {
    const cfg=getAccAutomationConfig_();
    if(!cfg.enabled && String((p||{}).source||'')==='TRIGGER') return {ok:true,skipped:true,reason:'DISABLED'};
    const certs=rows_('CERTIFICADOS').filter(function(r){return String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO' && r.VENCIMENTO;});
    let queued=0, skipped=0;
    certs.forEach(function(cert){
      const expiry=parseAtlasDate_(cert.VENCIMENTO);
      if(!expiry){skipped++;return;}
      const days=Math.ceil((new Date(expiry.getFullYear(),expiry.getMonth(),expiry.getDate())-new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()))/86400000);
      if(cfg.milestones.indexOf(days)<0){skipped++;return;}
      const client=findById_('CLIENTES',cert.CLIENTE_ID); if(!client){skipped++;return;}
      const email=normalize_(client.EMAIL||client.EMAIL_SECUNDARIO||''); if(!email||email.indexOf('@')<1){skipped++;return;}
      if(!clientAllowsAutomaticEmail_(client.ID)){skipped++;return;}
      const key=String(cert.ID)+'|'+String(days);
      if(hasAutomationMilestone_(key)){skipped++;return;}
      const modelId=modelIdForMilestone_(days);
      const model=findById_('MODELOS_EMAIL',modelId);
      const subject=renderAccSubject_((model&&model.ASSUNTO)||defaultAutomationSubject_(days),client,cert);
      const html=renderAccTemplate_((model&&model.HTML)||defaultAutomationHtml_(days),client,{mensagem:'',modeloId:modelId});
      const communicationId=nextId_('COMUNICACOES','COM'), now=new Date();
      appendObject_('COMUNICACOES',{ID:communicationId,CLIENTE_ID:String(client.ID),CAMPANHA_ID:'AUTO:'+key,MODELO_ID:modelId,CANAL:'EMAIL',DESTINO:email,ASSUNTO:subject,CONTEUDO_HTML:html,STATUS_ENVIO:'PENDENTE',TENTATIVAS:0,ERRO:'',AGENDADO_PARA:now,ENVIADO_EM:'',ENTREGUE_EM:'',LIDO_EM:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'ACC_AUTOMATION',ALTERADO_EM:now,ALTERADO_POR:'ACC_AUTOMATION'});
      appendObject_('FILA_ENVIO',{ID:nextId_('FILA_ENVIO','FIL'),COMUNICACAO_ID:communicationId,TIPO:'EMAIL_AUTOMATICO',DESTINO:email,PRIORIDADE:days<=7?1:2,SITUACAO:'PENDENTE',TENTATIVAS:0,PROXIMA_EXECUCAO:now,ULTIMO_ERRO:'',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'ACC_AUTOMATION',ALTERADO_EM:now,ALTERADO_POR:'ACC_AUTOMATION'});
      recordAudit_({action:'ACC_AUTO_EMAIL_QUEUED',details:{clienteId:client.ID,certificadoId:cert.ID,comunicacaoId:communicationId,marcoDias:days}},{}); queued++;
    });
    const processed=processAccQueue_();
    recordAudit_({action:'ACC_TRIGGER_EXECUTED',details:{queued:queued,skipped:skipped,processed:processed}},{});
    return {ok:true,queued:queued,skipped:skipped,processed:processed};
  } finally { lock.releaseLock(); }
}
function processAccQueue_() {
  const cfg=getAccAutomationConfig_(), quota=Math.min(MailApp.getRemainingDailyQuota(),cfg.dailyLimit), max=Math.min(cfg.batchSize,quota);
  if(max<=0) return {sent:0,failed:0,reason:'NO_QUOTA'};
  const queue=rows_('FILA_ENVIO').filter(function(r){return String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO' && ['PENDENTE','ERRO'].indexOf(String(r.SITUACAO||''))>=0 && Number(r.TENTATIVAS||0)<3;}).slice(0,max);
  let sent=0,failed=0;
  queue.forEach(function(item){
    const comm=findById_('COMUNICACOES',item.COMUNICACAO_ID); if(!comm){updateRow_('FILA_ENVIO',item.ID,{SITUACAO:'IGNORADO',ULTIMO_ERRO:'Comunicacao nao encontrada'},'ACC_AUTOMATION');return;}
    const to=cfg.testMode&&cfg.testRecipient?cfg.testRecipient:comm.DESTINO;
    try{
      updateRow_('FILA_ENVIO',item.ID,{SITUACAO:'PROCESSANDO'},'ACC_AUTOMATION');
      MailApp.sendEmail({to:to,subject:(cfg.testMode?'[TESTE ATLAS] ':'')+comm.ASSUNTO,htmlBody:comm.CONTEUDO_HTML,name:cfg.senderName,replyTo:cfg.replyTo});
      updateRow_('COMUNICACOES',comm.ID,{STATUS_ENVIO:'ENVIADO',ENVIADO_EM:new Date(),ERRO:'',TENTATIVAS:Number(comm.TENTATIVAS||0)+1},'ACC_AUTOMATION');
      updateRow_('FILA_ENVIO',item.ID,{SITUACAO:'ENVIADO',TENTATIVAS:Number(item.TENTATIVAS||0)+1,ULTIMO_ERRO:''},'ACC_AUTOMATION');
      addTimeline_({clienteId:comm.CLIENTE_ID,tipoEvento:'EMAIL_AUTOMATICO_ENVIADO',titulo:'Aviso automatico enviado',descricao:comm.ASSUNTO,origem:'ACC_AUTOMATION',actor:'ACC_AUTOMATION',dados:{comunicacaoId:comm.ID,destinoMascarado:mascararEmailPublico_(to)}});
      recordAudit_({action:'ACC_AUTO_EMAIL_SENT',details:{clienteId:comm.CLIENTE_ID,comunicacaoId:comm.ID,destinoMascarado:mascararEmailPublico_(to),testMode:cfg.testMode}},{}); sent++;
    }catch(error){
      const attempts=Number(item.TENTATIVAS||0)+1;
      updateRow_('COMUNICACOES',comm.ID,{STATUS_ENVIO:'ERRO',ERRO:String(error.message||error),TENTATIVAS:attempts},'ACC_AUTOMATION');
      updateRow_('FILA_ENVIO',item.ID,{SITUACAO:'ERRO',TENTATIVAS:attempts,ULTIMO_ERRO:String(error.message||error)},'ACC_AUTOMATION');
      recordAudit_({action:'ACC_AUTO_EMAIL_FAILED',details:{clienteId:comm.CLIENTE_ID,comunicacaoId:comm.ID,erro:String(error.message||error)}},{}); failed++;
    }
  });
  return {sent:sent,failed:failed,total:queue.length};
}
function sendAutomationTest_(p,clientMeta) {
  const cfg=getAccAutomationConfig_(), to=normalize_((p||{}).email||cfg.testRecipient||'');
  if(!to||to.indexOf('@')<1) throw apiError_('VALIDATION','Informe o e-mail de teste.');
  MailApp.sendEmail({to:to,subject:'Teste de conexao - Atlas ACC',htmlBody:'<div style="font-family:Arial;padding:24px"><h2>Atlas Communication Center</h2><p>A conexao de envio pelo Google Apps Script esta funcionando.</p><p><strong>Equipe Pedroza Certificadora</strong></p></div>',name:cfg.senderName,replyTo:cfg.replyTo});
  recordAudit_({action:'ACC_TEST_EMAIL_SENT',details:{destinoMascarado:mascararEmailPublico_(to)}},clientMeta||{});
  return {sent:true,destinationMasked:mascararEmailPublico_(to),remainingQuota:MailApp.getRemainingDailyQuota()};
}

function ensureAccAutomationFoundation_(){
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  ['COMUNICACOES','MODELOS_EMAIL','CAMPANHAS','CAMPANHA_DESTINATARIOS','PREFERENCIAS_COMUNICACAO','FILA_ENVIO','TIMELINE','AUDITORIA','LOGS'].forEach(function(name){ensureSheet_(ss,name,SHEETS[name]);});
  seedAccModels_();
  return true;
}
function parseAtlasDate_(value){
  if(value instanceof Date && !isNaN(value.getTime())) return new Date(value.getTime());
  if(value===null || typeof value==='undefined' || value==='') return null;
  const text=String(value).trim();
  let m=text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(m){const d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]));return isNaN(d.getTime())?null:d;}
  m=text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ].*)?$/);
  if(m){const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));return isNaN(d.getTime())?null:d;}
  const d=new Date(text); return isNaN(d.getTime())?null:d;
}
function accBackendHealth_(){
  ensureAccAutomationFoundation_();
  const required=['automation.status','automation.configure','automation.test','automation.run','automation.processQueue','automation.installTriggers','automation.removeTriggers'];
  const sheets=['CLIENTES','CERTIFICADOS','COMUNICACOES','MODELOS_EMAIL','PREFERENCIAS_COMUNICACAO','FILA_ENVIO','TIMELINE','AUDITORIA'];
  return {
    service:'ACC Backend Engine',
    version:ATLAS_VERSION,
    status:'online',
    actions:required,
    sheets:sheets.map(function(name){const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);return {name:name,ok:!!sh,rows:sh?Math.max(0,sh.getLastRow()-1):0};}),
    triggers:listAccAutomationTriggers_(),
    remainingQuota:MailApp.getRemainingDailyQuota(),
    config:getAccAutomationConfig_(),
    timestamp:new Date()
  };
}
function testarAccBackend(){
  const result=accBackendHealth_();
  Logger.log(JSON.stringify(result,null,2));
  return result;
}

function clientAllowsAutomaticEmail_(clientId){const pref=rows_('PREFERENCIAS_COMUNICACAO').find(function(r){return String(r.CLIENTE_ID)===String(clientId)&&String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO';});return !pref || String(pref.AVISO_VENCIMENTO||'SIM').toUpperCase()!=='NAO';}
function hasAutomationMilestone_(key){return rows_('COMUNICACOES').some(function(r){return String(r.CAMPANHA_ID||'')==='AUTO:'+key && String(r.STATUS||'ATIVO').toUpperCase()!=='EXCLUIDO';});}
function modelIdForMilestone_(days){if(days===90)return 'ACC-VENC-90';if(days===60)return 'ACC-VENC-60';if(days===30)return 'ACC-VENC-30';if(days===15)return 'ACC-VENC-15';if(days===7)return 'ACC-VENC-7';if(days===0)return 'ACC-VENCE-HOJE';return 'ACC-VENCIDO';}
function defaultAutomationSubject_(days){if(days>0)return 'Seu certificado digital vence em '+days+' dias';if(days===0)return 'Seu certificado digital vence hoje';return 'Seu certificado digital esta vencido';}
function defaultAutomationHtml_(days){return '<div style="font-family:Arial,sans-serif;color:#17365d;line-height:1.6"><h2>Ola, {{NOME}}.</h2><p>'+defaultAutomationSubject_(days)+'.</p><p>Validade: <strong>{{VALIDADE}}</strong></p><p>Entre em contato para organizar sua renovacao.</p><p><strong>Equipe Pedroza Certificadora</strong></p></div>';}
function renderAccSubject_(subject,client,cert){const d=parseAtlasDate_(cert&&cert.VENCIMENTO);const vars={NOME:String(client.NOME||client.EMPRESA||'Cliente'),EMPRESA:String(client.EMPRESA||client.NOME||''),CPF_CNPJ:String(client.CPF_CNPJ||''),TIPO_CERTIFICADO:String((cert&&(cert.TIPO||cert.MODELO))||'Certificado digital'),VALIDADE:d?Utilities.formatDate(d,Session.getScriptTimeZone()||'America/Sao_Paulo','dd/MM/yyyy'):''};return Object.keys(vars).reduce(function(out,key){return out.split('{{'+key+'}}').join(vars[key]);},String(subject||''));}
