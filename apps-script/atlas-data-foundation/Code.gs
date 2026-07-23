/**
 * Pedroza Certificadora
 * Atlas Data Foundation v1.0
 * Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
 */
const ATLAS_VERSION = '5.0.1';
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
  if (['users.list','users.create','users.setActive','users.updateProfile','users.changePassword','users.getPreferences','users.setPreferences','clients.list','clients.get','clients.create','clients.update','certificates.list','certificates.create','certificates.update','dashboard.summary','timeline.list','timeline.add','communications.list','communications.create','communications.send','models.list','campaigns.list','campaigns.create','campaigns.preview','invites.generate','sectors.list','tags.list'].indexOf(action) >= 0) {
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
    case 'invites.generate': return generateInvite_(payload);
    case 'invites.validate': return validateInvite_(payload);
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
  const nome = escaparHtml_(String(cliente.NOME || cliente.EMPRESA || 'Cliente'));
  const tipo = escaparHtml_(dados.tipoCertificado || 'Certificado digital');
  const situacao = escaparHtml_(dados.situacao || 'Nao informada');
  const validade = escaparHtml_(dados.validadeFormatada || 'Nao informada');
  const prazo = dados.diasRestantes === null || dados.diasRestantes === undefined ? 'Nao informado' : (Number(dados.diasRestantes) < 0 ? 'Vencido ha ' + Math.abs(Number(dados.diasRestantes)) + ' dia(s)' : Number(dados.diasRestantes) + ' dia(s) restante(s)');
  const mensagem = Number(dados.diasRestantes) <= 30 ? 'Recomendamos iniciar a renovacao com antecedencia para evitar interrupcoes.' : 'Seu certificado permanece dentro do prazo de validade informado.';
  const whatsapp = 'https://wa.me/5521991674117?text=' + encodeURIComponent('Ola! Recebi o resumo do meu certificado e gostaria de orientacao sobre renovacao.');
  return '<!doctype html><html><body style="margin:0;background:#eef4fb;font-family:Arial,sans-serif;color:#102f57">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef4fb;padding:28px 12px"><tr><td align="center">' +
    '<table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(15,47,87,.12)">' +
    '<tr><td style="background:linear-gradient(135deg,#06264d,#0d5d9f);padding:30px;color:#fff"><div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.8">Pedroza Certificadora</div><h1 style="margin:8px 0 0;font-size:27px">Informacoes do seu certificado digital</h1></td></tr>' +
    '<tr><td style="padding:30px"><p style="font-size:17px;margin-top:0">Ola, <strong>' + nome + '</strong>.</p><p style="line-height:1.6;color:#526b89">Segue o resumo solicitado na Area do Cliente.</p>' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border-collapse:separate;border-spacing:10px"><tr>' +
    '<td style="background:#f4f8fd;border:1px solid #dbe8f5;border-radius:12px;padding:16px"><small style="color:#6b819c">TIPO</small><br><strong>' + tipo + '</strong></td>' +
    '<td style="background:#f4f8fd;border:1px solid #dbe8f5;border-radius:12px;padding:16px"><small style="color:#6b819c">SITUACAO</small><br><strong>' + situacao + '</strong></td></tr><tr>' +
    '<td style="background:#f4f8fd;border:1px solid #dbe8f5;border-radius:12px;padding:16px"><small style="color:#6b819c">VALIDADE</small><br><strong>' + validade + '</strong></td>' +
    '<td style="background:#f4f8fd;border:1px solid #dbe8f5;border-radius:12px;padding:16px"><small style="color:#6b819c">PRAZO</small><br><strong>' + escaparHtml_(prazo) + '</strong></td></tr></table>' +
    '<p style="background:#fff7df;border-left:4px solid #eda900;padding:15px;border-radius:8px;line-height:1.5">' + mensagem + '</p>' +
    '<p style="text-align:center;margin:28px 0"><a href="' + whatsapp + '" style="display:inline-block;background:#08b956;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:9px">Solicitar renovacao pelo WhatsApp</a></p>' +
    '<p style="font-size:12px;line-height:1.5;color:#71839a;border-top:1px solid #e3ebf5;padding-top:18px">Mensagem enviada porque houve uma solicitacao na Area do Cliente. Os detalhes foram encaminhados somente ao e-mail previamente cadastrado no Atlas.</p>' +
    '</td></tr></table></td></tr></table></body></html>';
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
  const assunto=String(p.assunto||'').trim();
  if(!assunto) throw apiError_('VALIDATION','Informe o assunto do e-mail.');
  const actor=String(p.actor||'ATLAS');
  const modelo=p.modeloId?findById_('MODELOS_EMAIL',p.modeloId):null;
  let html=String(p.conteudoHtml||(modelo&&modelo.HTML)||'').trim();
  if(!html) throw apiError_('VALIDATION','Informe o conteudo do e-mail.');
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
function seedAccModels_() {
  if(rows_('MODELOS_EMAIL').length) return;
  const now=new Date();
  const baseStart='<!doctype html><html><body style="margin:0;background:#eef4fb;font-family:Arial,sans-serif;color:#102f57"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px"><tr><td align="center"><table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#fff;border-radius:18px;overflow:hidden"><tr><td style="background:#07345f;padding:28px;color:#fff"><small>PEDROZA CERTIFICADORA</small><h1 style="margin:8px 0 0;font-size:25px">';
  const body='</h1></td></tr><tr><td style="padding:30px"><p style="font-size:17px">Ola, <strong>{{NOME}}</strong>.</p><p style="line-height:1.65;color:#526b89">{{MENSAGEM}}</p><div style="background:#f4f8fd;border:1px solid #dbe8f5;border-radius:12px;padding:18px;margin:22px 0"><b>{{TIPO_CERTIFICADO}}</b><br><span style="color:#526b89">Validade cadastrada: {{VALIDADE}}</span></div><p style="text-align:center"><a href="https://wa.me/5521991674117" style="display:inline-block;background:#08b956;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:9px">Falar com nossa equipe</a></p><p style="margin-top:28px">Atenciosamente,<br><strong>Equipe Pedroza Certificadora</strong></p><p style="font-size:12px;color:#71839a;border-top:1px solid #e3ebf5;padding-top:18px">Mensagem operacional enviada pela Plataforma Atlas.</p></td></tr></table></td></tr></table></body></html>';
  const models=[
    ['MOD-000001','Aviso de vencimento','VENCIMENTO','Seu certificado digital vence em breve','Aviso de vencimento do certificado digital','Identificamos que seu certificado digital esta se aproximando da data de vencimento. Recomendamos iniciar a renovacao com antecedencia.'],
    ['MOD-000002','Certificado vencido','VENCIDO','Seu certificado digital esta vencido','Certificado digital vencido','Seu certificado digital consta como vencido em nosso cadastro. Nossa equipe esta disponivel para orientar a renovacao.'],
    ['MOD-000003','Renovacao concluida','RENOVACAO','Renovacao concluida com sucesso','Renovacao concluida','A renovacao do seu certificado digital foi concluida com sucesso. Agradecemos pela confianca em nosso atendimento.'],
    ['MOD-000004','Comunicado personalizado','PERSONALIZADO','Comunicado da Pedroza Certificadora','Comunicado importante','{{MENSAGEM}}']
  ];
  models.forEach(function(m){appendObject_('MODELOS_EMAIL',{ID:m[0],NOME:m[1],TIPO:m[2],ASSUNTO:m[3],HTML:baseStart+m[4]+body.replace('{{MENSAGEM}}',m[5]),VARIAVEIS_JSON:JSON.stringify(['NOME','EMPRESA','CPF_CNPJ','TIPO_CERTIFICADO','VALIDADE','MENSAGEM','ASSINATURA']),ATIVO:'SIM',STATUS:'ATIVO',CRIADO_EM:now,CRIADO_POR:'SETUP-5.0.1',ALTERADO_EM:now,ALTERADO_POR:'SETUP-5.0.1'});});
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
