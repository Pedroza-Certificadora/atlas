/*
 * Atlas CRM Enterprise Gold - Sprint 4.9.12 FINAL
 * Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
 */
(function (w, d) {
  "use strict";

  var state = { clients: [], certificates: [], timeline: [], communications: [], users: [], current: null, selected: new Set(), alertFilter: "all" };
  var STORAGE = { templates: "atlas_crm_templates_4911", preferences: "atlas_crm_preferences_4911", queue: "atlas_crm_queue_4911", relations: "atlas_crm_relations_4911" };

  function id(value) { return d.getElementById(value); }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]; }); }
  function norm(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function digits(value) { return String(value || "").replace(/\D/g, ""); }
  function read(key, fallback) { try { var data = JSON.parse(localStorage.getItem(key)); return data == null ? fallback : data; } catch (error) { return fallback; } }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function actor() { var node = d.querySelector("[data-auth-user-name]"); return node ? node.textContent.trim() : "ATLAS"; }
  function parseDate(value) { if (!value) return null; var text = String(value).trim(), br = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/), result = br ? new Date(+br[3], +br[2] - 1, +br[1]) : new Date(text); return isNaN(result.getTime()) ? null : result; }
  function daysUntil(value) { var date = parseDate(value); if (!date) return null; var today = new Date(); today.setHours(0, 0, 0, 0); date.setHours(0, 0, 0, 0); return Math.ceil((date - today) / 86400000); }
  function clientId(item) { return String(item && (item.clienteId || item.CLIENTE_ID || item.clientId || item.idCliente) || ""); }
  function certificateDate(item) { return item && (item.validade || item.dataValidade || item.vencimento || item.DATA_VALIDADE || item.VENCIMENTO); }
  function notify(message, type) {
    var toast = id("crm-enterprise-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "crm-enterprise-toast show " + (type || "ok");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(function () { toast.className = "crm-enterprise-toast"; }, 2600);
  }
  function closeFloating(except) { d.querySelectorAll(".crm-enterprise-popover.open").forEach(function (node) { if (node !== except) node.classList.remove("open"); }); }

  function shell() {
    var heading = d.querySelector(".crm-heading");
    if (heading && !id("crm-universal-open")) {
      var actions = d.createElement("div");
      actions.className = "crm-enterprise-heading-actions";
      actions.innerHTML = '<button id="crm-universal-open" type="button">⌕ Pesquisa universal <kbd>Ctrl K</kbd></button><button id="crm-alerts-open" type="button">⚠ Alertas <b id="crm-alert-count">0</b></button>';
      heading.appendChild(actions);
    }

    var listHeader = d.querySelector(".crm-list-header");
    if (listHeader && !id("crm-bulk-bar")) {
      var bulk = d.createElement("div");
      bulk.id = "crm-bulk-bar";
      bulk.className = "crm-bulk-bar";
      bulk.hidden = true;
      bulk.innerHTML = '<strong><span id="crm-bulk-count">0</span> selecionado(s)</strong><button id="crm-bulk-copy" type="button">Copiar IDs</button><button id="crm-bulk-export" type="button">Exportar CSV</button><button id="crm-bulk-clear" type="button">Limpar seleção</button>';
      listHeader.parentNode.insertBefore(bulk, listHeader.nextSibling);
    }

    d.body.insertAdjacentHTML("beforeend", [
      '<div class="crm-enterprise-toast" id="crm-enterprise-toast" role="status"></div>',
      '<div class="crm-enterprise-backdrop" id="crm-universal-backdrop" hidden></div>',
      '<section class="crm-universal-modal" id="crm-universal-modal" role="dialog" aria-modal="true" aria-labelledby="crm-universal-title" hidden>',
      '<header><div><span>Atlas Universal Search</span><h2 id="crm-universal-title">Pesquisa Universal</h2><p>Clientes, certificados, timeline, agenda, observações e usuários.</p></div><button id="crm-universal-close" type="button" aria-label="Fechar">×</button></header>',
      '<div class="crm-universal-search"><span>⌕</span><input id="crm-universal-input" type="search" placeholder="Digite nome, documento, certificado, evento, observação ou usuário..."></div>',
      '<nav id="crm-universal-filters"><button class="active" data-kind="all" type="button">Tudo</button><button data-kind="client" type="button">Clientes</button><button data-kind="certificate" type="button">Certificados</button><button data-kind="timeline" type="button">Timeline</button><button data-kind="communication" type="button">Comunicação</button><button data-kind="user" type="button">Usuários</button></nav>',
      '<div id="crm-universal-results" class="crm-universal-results"><div class="crm-tab-empty"><b>⌕</b><h3>Pesquisa pronta</h3><p>Use termos do cadastro ou da operação para localizar informações em toda a base carregada.</p></div></div>',
      '</section>',
      '<div class="crm-enterprise-backdrop" id="crm-alerts-backdrop" hidden></div>',
      '<aside class="crm-alerts-panel" id="crm-alerts-panel" aria-hidden="true"><header><div><span>Central de alertas</span><h2>Atenção operacional</h2></div><button id="crm-alerts-close" type="button">×</button></header><nav id="crm-alert-filters"><button class="active" data-filter="all" type="button">Todos</button><button data-filter="expired" type="button">Vencidos</button><button data-filter="30" type="button">30 dias</button><button data-filter="duplicate" type="button">Duplicidades</button></nav><div id="crm-alert-list" class="crm-alert-list"></div></aside>',
      '<div class="crm-enterprise-backdrop" id="crm-communication-backdrop" hidden></div>',
      '<section class="crm-communication-admin" id="crm-communication-admin" role="dialog" aria-modal="true" hidden><header><div><span>Infraestrutura preparada</span><h2>Central de Comunicação</h2><p>Sem disparos automáticos nesta Sprint.</p></div><button id="crm-communication-close" type="button">×</button></header><nav><button class="active" data-comm-view="templates" type="button">Templates</button><button data-comm-view="preferences" type="button">Preferências</button><button data-comm-view="queue" type="button">Fila</button><button data-comm-view="history" type="button">Histórico</button></nav><div id="crm-communication-content"></div></section>'
    ].join(""));
  }

  function enhanceDrawer() {
    var actions = d.querySelector(".crm-drawer-actions");
    var tabs = id("crm-drawer-tabs");
    if (actions && !id("crm-enterprise-actions")) {
      actions.insertAdjacentHTML("beforeend", '<div class="crm-enterprise-menu"><button id="crm-enterprise-actions" type="button">⚙ Ações ▾</button><div class="crm-enterprise-popover" id="crm-actions-popover"><button data-enterprise-action="communication" type="button">✉ Preparar comunicação</button><button data-enterprise-action="relation" type="button">⇄ Relacionar cliente</button><button data-enterprise-action="alert" type="button">⚠ Ver alertas deste cliente</button></div></div><div class="crm-enterprise-menu"><button id="crm-enterprise-more" type="button">⋮ Mais opções</button><div class="crm-enterprise-popover" id="crm-more-popover"><button data-enterprise-action="duplicate" type="button">⌕ Localizar e unificar duplicidade</button><button data-enterprise-action="print" type="button">Imprimir ficha</button><button data-enterprise-action="copy-summary" type="button">Copiar resumo</button><button data-enterprise-action="audit" type="button">Registrar consulta</button><span class="crm-popover-divider" aria-hidden="true"></span><button class="crm-enterprise-danger" data-enterprise-action="delete-client" type="button">🗑 Excluir cliente</button></div></div>');
    }
    if (tabs && !tabs.querySelector('[data-tab="administracao"]')) tabs.insertAdjacentHTML("beforeend", '<button data-tab="administracao" type="button">Administração</button>');
    var body = d.querySelector(".crm-drawer-body");
    if (body && !id("crm-panel-administracao")) body.insertAdjacentHTML("beforeend", '<section class="crm-tab-panel" data-panel="administracao" id="crm-panel-administracao"></section>');
    var header = d.querySelector(".crm-drawer-header");
    if (header && !id("crm-client-alert-summary")) header.insertAdjacentHTML("beforeend", '<div class="crm-client-alert-summary" id="crm-client-alert-summary"></div>');
  }

  async function loadData() {
    if (!w.AtlasAPI) return;
    var calls = ["listClients", "listCertificates", "listTimeline", "listCommunications", "listUsers"].map(function (method) {
      if (typeof w.AtlasAPI[method] !== "function") return Promise.resolve([]);
      return w.AtlasAPI[method]({}).catch(function () { return []; });
    });
    var result = await Promise.all(calls);
    state.clients = Array.isArray(result[0]) ? result[0] : [];
    state.certificates = Array.isArray(result[1]) ? result[1] : [];
    state.timeline = Array.isArray(result[2]) ? result[2] : [];
    state.communications = Array.isArray(result[3]) ? result[3] : [];
    state.users = Array.isArray(result[4]) ? result[4] : [];
    renderAlerts();
  }

  function duplicates() {
    var groups = {}, result = [];
    state.clients.forEach(function (client) {
      var keys = [digits(client.cpfCnpj || client.documento), norm(client.email), digits(client.telefone || client.whatsapp)].filter(function (key) { return key.length >= 5; });
      keys.forEach(function (key) { groups[key] = groups[key] || []; groups[key].push(client); });
    });
    Object.keys(groups).forEach(function (key) { if (groups[key].length > 1) result.push({ key: key, clients: groups[key] }); });
    return result;
  }

  function alertItems() {
    var alerts = [];
    state.certificates.forEach(function (certificate) {
      var days = daysUntil(certificateDate(certificate));
      if (days == null || days > 30) return;
      var client = state.clients.find(function (item) { return String(item.id) === clientId(certificate); });
      alerts.push({ kind: days < 0 ? "expired" : "30", priority: days < 0 ? 1 : 2, clientId: clientId(certificate), title: days < 0 ? "Certificado vencido" : "Vencimento próximo", description: (client && client.nome || "Cliente") + " • " + (certificate.tipo || certificate.nome || "Certificado") + " • " + (days < 0 ? Math.abs(days) + " dia(s) vencido" : days + " dia(s)") });
    });
    duplicates().forEach(function (group) { alerts.push({ kind: "duplicate", priority: 3, title: "Possível duplicidade", description: group.clients.map(function (client) { return client.nome || client.id; }).join(" × "), clientId: group.clients[0] && group.clients[0].id, candidateId: group.clients[1] && group.clients[1].id }); });
    return alerts.sort(function (a, b) { return a.priority - b.priority; });
  }

  function renderAlerts(clientOnly) {
    var items = alertItems();
    if (clientOnly) items = items.filter(function (item) { return String(item.clientId) === String(clientOnly); });
    if (state.alertFilter !== "all") items = items.filter(function (item) { return item.kind === state.alertFilter; });
    var count = id("crm-alert-count"); if (count) count.textContent = alertItems().length;
    var list = id("crm-alert-list"); if (!list) return;
    list.innerHTML = items.length ? items.map(function (item) { return '<article class="crm-alert-card ' + esc(item.kind) + '"><span>' + (item.kind === "duplicate" ? "⇄" : "!") + '</span><div><strong>' + esc(item.title) + '</strong><p>' + esc(item.description) + '</p><div class="crm-alert-actions"><button type="button" data-alert-action="open" data-alert-client="' + esc(item.clientId) + '">Abrir</button>' + (item.kind === "duplicate" ? '<button type="button" data-alert-action="compare" data-alert-client="' + esc(item.clientId) + '" data-alert-candidate="' + esc(item.candidateId || "") + '">⌕ Comparar e unificar</button>' : '') + '</div></div></article>'; }).join("") : '<div class="crm-tab-empty"><b>✓</b><h3>Nenhum alerta</h3><p>Não há ocorrências para o filtro selecionado.</p></div>';
  }

  function renderAdmin(client) {
    var panel = id("crm-panel-administracao"); if (!panel || !client) return;
    var relations = read(STORAGE.relations, []).filter(function (item) { return String(item.source) === String(client.id) || String(item.target) === String(client.id); });
    panel.innerHTML = '<div class="crm-admin-grid"><article><span>Cadastro</span><h3>Governança do cliente</h3><p>ID público: <strong>' + esc(client.id || "—") + '</strong></p><p>Situação: <strong>' + esc(client.situacao || client.status || "ATIVO") + '</strong></p><button type="button" data-admin-action="config">Abrir configuração ACDM</button></article><article><span>Relacionamentos</span><h3>' + relations.length + ' vínculo(s)</h3><p>Relacionamentos administrativos preservados na camada CRM.</p><button type="button" data-admin-action="relation">Relacionar cliente</button></article><article><span>Comunicação</span><h3>Preferências e fila</h3><p>Estrutura preparada para a automação da Sprint 5.0.</p><button type="button" data-admin-action="communication">Abrir central</button></article><article><span>Segurança</span><h3>Operação auditável</h3><p>Ações sensíveis continuam submetidas à Atlas API e à auditoria homologada.</p><button type="button" data-admin-action="audit">Registrar consulta</button></article></div>';
  }

  function renderClientHeader(client) {
    if (!client) return;
    var alerts = alertItems().filter(function (item) { return String(item.clientId) === String(client.id); });
    var target = id("crm-client-alert-summary");
    if (target) target.innerHTML = alerts.length ? '<button type="button" id="crm-client-alert-open"><strong>' + alerts.length + ' alerta(s)</strong><span>' + esc(alerts[0].description) + '</span></button>' : '<span class="ok">✓ Cliente sem alertas críticos</span>';
    renderAdmin(client);
  }

  function universalRecords() {
    var records = [];
    state.clients.forEach(function (item) { records.push({ kind: "client", title: item.nome || "Cliente", subtitle: item.empresa || item.cpfCnpj || item.id, search: [item.nome, item.empresa, item.cpfCnpj, item.email, item.telefone, item.whatsapp, item.observacoes, item.responsavel, item.id].join(" "), clientId: item.id }); });
    state.certificates.forEach(function (item) { records.push({ kind: "certificate", title: item.tipo || item.nome || "Certificado", subtitle: (item.numeroSerie || item.serial || certificateDate(item) || "") + " • " + clientId(item), search: JSON.stringify(item), clientId: clientId(item) }); });
    state.timeline.forEach(function (item) { records.push({ kind: "timeline", title: item.titulo || item.tipoEvento || "Evento", subtitle: item.descricao || item.dataHora || "", search: JSON.stringify(item), clientId: clientId(item) }); });
    state.communications.forEach(function (item) { records.push({ kind: "communication", title: item.assunto || item.tipo || "Comunicação", subtitle: item.status || item.dataHora || "", search: JSON.stringify(item), clientId: clientId(item) }); });
    state.users.forEach(function (item) { records.push({ kind: "user", title: item.nome || item.login || "Usuário", subtitle: item.perfil || item.email || "", search: JSON.stringify(item) }); });
    return records;
  }

  function renderUniversal() {
    var input = id("crm-universal-input"), results = id("crm-universal-results"); if (!input || !results) return;
    var query = norm(input.value), kind = (id("crm-universal-filters").querySelector(".active") || {}).dataset && id("crm-universal-filters").querySelector(".active").dataset.kind || "all";
    if (query.length < 2) { results.innerHTML = '<div class="crm-tab-empty"><b>⌕</b><h3>Digite pelo menos 2 caracteres</h3><p>A pesquisa respeita os dados já autorizados para o usuário conectado.</p></div>'; return; }
    var items = universalRecords().filter(function (item) { return (kind === "all" || item.kind === kind) && norm(item.search).indexOf(query) >= 0; }).slice(0, 80);
    results.innerHTML = items.length ? items.map(function (item) { return '<button type="button" data-universal-client="' + esc(item.clientId || "") + '"><span class="kind ' + esc(item.kind) + '">' + esc(item.kind) + '</span><div><strong>' + esc(item.title) + '</strong><p>' + esc(item.subtitle) + '</p></div><b>›</b></button>'; }).join("") : '<div class="crm-tab-empty"><b>⌕</b><h3>Nenhum resultado</h3><p>Tente outro nome, documento, evento ou referência.</p></div>';
  }

  function communicationView(view) {
    var content = id("crm-communication-content"); if (!content) return;
    var templates = read(STORAGE.templates, [{ id: "vencimento", name: "Aviso de vencimento", channel: "E-mail/WhatsApp", status: "PRONTO" }, { id: "renovacao", name: "Acompanhamento de renovação", channel: "E-mail/WhatsApp", status: "PRONTO" }]);
    var preferences = read(STORAGE.preferences, { email: true, whatsapp: true, automaticTimeline: true });
    var queue = read(STORAGE.queue, []);
    if (view === "templates") content.innerHTML = '<div class="crm-comm-cards">' + templates.map(function (item) { return '<article><span>' + esc(item.status) + '</span><h3>' + esc(item.name) + '</h3><p>' + esc(item.channel) + '</p><button type="button" data-template-queue="' + esc(item.id) + '">Adicionar à fila</button></article>'; }).join("") + '</div>';
    if (view === "preferences") content.innerHTML = '<div class="crm-preferences"><label><input id="comm-pref-email" type="checkbox" ' + (preferences.email ? "checked" : "") + '> Permitir comunicações por e-mail</label><label><input id="comm-pref-whatsapp" type="checkbox" ' + (preferences.whatsapp ? "checked" : "") + '> Permitir comunicações por WhatsApp</label><label><input id="comm-pref-timeline" type="checkbox" ' + (preferences.automaticTimeline ? "checked" : "") + '> Registrar eventos automaticamente na Timeline</label><button id="comm-pref-save" type="button">Salvar preferências</button></div>';
    if (view === "queue") content.innerHTML = queue.length ? '<div class="crm-queue-list">' + queue.map(function (item) { return '<article><span>PENDENTE</span><strong>' + esc(item.template) + '</strong><p>' + esc(item.clientName || "Cliente não selecionado") + ' • preparado por ' + esc(item.actor) + '</p><small>' + esc(item.createdAt) + '</small></article>'; }).join("") + '</div>' : '<div class="crm-tab-empty"><b>□</b><h3>Fila vazia</h3><p>Os itens preparados ficarão pendentes até a ativação dos disparos na Sprint 5.0.</p></div>';
    if (view === "history") content.innerHTML = state.communications.length ? '<div class="crm-queue-list">' + state.communications.slice(0, 50).map(function (item) { return '<article><span>' + esc(item.status || "REGISTRADO") + '</span><strong>' + esc(item.assunto || item.tipo || "Comunicação") + '</strong><p>' + esc(item.descricao || item.destinatario || clientId(item)) + '</p></article>'; }).join("") + '</div>' : '<div class="crm-tab-empty"><b>✉</b><h3>Sem histórico carregado</h3><p>A Atlas API não retornou comunicações para esta consulta.</p></div>';
  }

  function openModal(name) {
    var modal = id(name + "-modal") || id(name + "-panel") || id(name);
    var backdrop = id(name + "-backdrop");
    if (modal) { modal.hidden = false; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); }
    if (backdrop) backdrop.hidden = false;
    d.body.classList.add("crm-drawer-open");
  }
  function closeModal(name) {
    var modal = id(name + "-modal") || id(name + "-panel") || id(name);
    var backdrop = id(name + "-backdrop");
    if (modal) { modal.classList.remove("open"); modal.hidden = true; modal.setAttribute("aria-hidden", "true"); }
    if (backdrop) backdrop.hidden = true;
    if (!d.querySelector(".crm-drawer.open")) d.body.classList.remove("crm-drawer-open");
  }

  function openClient(clientIdValue) {
    var row = d.querySelector('tr[data-client-id="' + CSS.escape(String(clientIdValue || "")) + '"]');
    if (row) row.click();
    else notify("O cliente não está na página atual. Use a pesquisa da Central.", "warning");
  }

  function relationDialog() {
    if (!state.current) return notify("Abra uma Ficha 360º primeiro.", "warning");
    var term = prompt("Digite o nome, documento ou ID do cliente relacionado:");
    if (!term) return;
    var query = norm(term), target = state.clients.find(function (client) { return String(client.id) !== String(state.current.id) && norm([client.nome, client.cpfCnpj, client.email, client.id].join(" ")).indexOf(query) >= 0; });
    if (!target) return notify("Cliente relacionado não localizado.", "warning");
    var relations = read(STORAGE.relations, []);
    relations.push({ source: state.current.id, target: target.id, sourceName: state.current.nome, targetName: target.nome, createdAt: new Date().toLocaleString("pt-BR"), actor: actor() });
    write(STORAGE.relations, relations);
    renderAdmin(state.current);
    if (w.AtlasAPI && w.AtlasAPI.audit) w.AtlasAPI.audit("CRM_CLIENT_RELATION", { sourceClientId: state.current.id, targetClientId: target.id, username: actor() }).catch(function () {});
    notify("Relacionamento registrado com " + target.nome + ".");
  }

  function openDuplicateFinder(clientIdValue, candidateIdValue) {
    var sourceId = clientIdValue || (state.current && state.current.id);
    if (!sourceId) { notify("Selecione um cliente para localizar duplicidades.", "warning"); return; }
    var group = duplicates().find(function (item) { return item.clients.some(function (client) { return String(client.id) === String(sourceId); }); });
    var candidateId = candidateIdValue || (group && group.clients.find(function (client) { return String(client.id) !== String(sourceId); }) || {}).id;
    if (!candidateId) { notify("Nenhuma duplicidade automática foi encontrada para este cliente.", "warning"); return; }
    d.dispatchEvent(new CustomEvent("atlas:acdm-open", { detail: { view: "integrate", clientId: sourceId, candidateId: candidateId } }));
  }

  function auditView() {
    if (!state.current || !w.AtlasAPI || !w.AtlasAPI.audit) return;
    w.AtlasAPI.audit("CRM_360_VIEW", { clientId: state.current.id, username: actor(), version: "4.9.12" }).then(function () { notify("Consulta registrada na auditoria."); }).catch(function () { notify("Não foi possível registrar a consulta.", "warning"); });
  }

  function copySummary() {
    if (!state.current) return;
    var clientCertificates = state.certificates.filter(function (item) { return clientId(item) === String(state.current.id); });
    var summary = ["Cliente: " + (state.current.nome || ""), "ID: " + (state.current.id || ""), "Documento: " + (state.current.cpfCnpj || ""), "E-mail: " + (state.current.email || ""), "Telefone: " + (state.current.telefone || state.current.whatsapp || ""), "Certificados: " + clientCertificates.length].join("\n");
    navigator.clipboard.writeText(summary).then(function () { notify("Resumo da Ficha 360º copiado."); });
  }

  function bind() {
    d.addEventListener("click", function (event) {
      var menuButton = event.target.closest("#crm-enterprise-actions,#crm-enterprise-more");
      if (menuButton) { var popover = menuButton.nextElementSibling; var willOpen = !popover.classList.contains("open"); closeFloating(popover); popover.classList.toggle("open", willOpen); return; }
      if (!event.target.closest(".crm-enterprise-menu")) closeFloating();

      var enterpriseAction = event.target.closest("[data-enterprise-action]");
      if (enterpriseAction) {
        var action = enterpriseAction.dataset.enterpriseAction;
        closeFloating();
        if (action === "communication") { openModal("crm-communication"); communicationView("templates"); }
        if (action === "relation") relationDialog();
        if (action === "alert") { state.alertFilter = "all"; renderAlerts(state.current && state.current.id); openModal("crm-alerts"); }
        if (action === "print") w.print();
        if (action === "copy-summary") copySummary();
        if (action === "audit") auditView();
        if (action === "delete-client") { if (!state.current) notify("Abra uma Ficha 360º primeiro.", "warning"); else d.dispatchEvent(new CustomEvent("atlas:acdm-open", { detail: { view: "delete", clientId: state.current.id } })); }
        if (action === "duplicate") openDuplicateFinder();
      }

      var adminAction = event.target.closest("[data-admin-action]");
      if (adminAction) {
        if (adminAction.dataset.adminAction === "config") id("crm-action-admin").click();
        if (adminAction.dataset.adminAction === "relation") relationDialog();
        if (adminAction.dataset.adminAction === "communication") { openModal("crm-communication"); communicationView("templates"); }
        if (adminAction.dataset.adminAction === "audit") auditView();
      }
    });

    id("crm-universal-open").addEventListener("click", function () { openModal("crm-universal"); setTimeout(function () { id("crm-universal-input").focus(); }, 50); });
    id("crm-universal-close").addEventListener("click", function () { closeModal("crm-universal"); });
    id("crm-universal-backdrop").addEventListener("click", function () { closeModal("crm-universal"); });
    id("crm-universal-input").addEventListener("input", renderUniversal);
    id("crm-universal-filters").addEventListener("click", function (event) { var button = event.target.closest("button[data-kind]"); if (!button) return; this.querySelectorAll("button").forEach(function (item) { item.classList.toggle("active", item === button); }); renderUniversal(); });
    id("crm-universal-results").addEventListener("click", function (event) { var button = event.target.closest("button[data-universal-client]"); if (!button) return; closeModal("crm-universal"); if (button.dataset.universalClient) openClient(button.dataset.universalClient); });

    id("crm-alerts-open").addEventListener("click", function () { state.alertFilter = "all"; renderAlerts(); openModal("crm-alerts"); });
    id("crm-alerts-close").addEventListener("click", function () { closeModal("crm-alerts"); });
    id("crm-alerts-backdrop").addEventListener("click", function () { closeModal("crm-alerts"); });
    id("crm-alert-filters").addEventListener("click", function (event) { var button = event.target.closest("button[data-filter]"); if (!button) return; state.alertFilter = button.dataset.filter; this.querySelectorAll("button").forEach(function (item) { item.classList.toggle("active", item === button); }); renderAlerts(); });
    id("crm-alert-list").addEventListener("click", function (event) { var button = event.target.closest("button[data-alert-action]"); if (!button) return; closeModal("crm-alerts"); if (button.dataset.alertAction === "compare") openDuplicateFinder(button.dataset.alertClient, button.dataset.alertCandidate); else if (button.dataset.alertClient) openClient(button.dataset.alertClient); });

    id("crm-communication-close").addEventListener("click", function () { closeModal("crm-communication"); });
    id("crm-communication-backdrop").addEventListener("click", function () { closeModal("crm-communication"); });
    id("crm-communication-admin").addEventListener("click", function (event) {
      var view = event.target.closest("button[data-comm-view]");
      if (view) { this.querySelectorAll("nav button").forEach(function (item) { item.classList.toggle("active", item === view); }); communicationView(view.dataset.commView); return; }
      var queueButton = event.target.closest("button[data-template-queue]");
      if (queueButton) {
        var templates = read(STORAGE.templates, [{ id: "vencimento", name: "Aviso de vencimento" }, { id: "renovacao", name: "Acompanhamento de renovação" }]);
        var template = templates.find(function (item) { return item.id === queueButton.dataset.templateQueue; });
        var queue = read(STORAGE.queue, []);
        queue.push({ id: "QUEUE-" + Date.now(), template: template ? template.name : queueButton.dataset.templateQueue, clientId: state.current && state.current.id, clientName: state.current && state.current.nome, actor: actor(), createdAt: new Date().toLocaleString("pt-BR"), status: "PENDENTE" });
        write(STORAGE.queue, queue);
        if (state.current && w.AtlasAPI && w.AtlasAPI.addTimeline) w.AtlasAPI.addTimeline({ clienteId: state.current.id, tipoEvento: "COMUNICACAO_PREPARADA", titulo: "Comunicação adicionada à fila", descricao: template ? template.name : "Template", origem: "CRM_ENTERPRISE", actor: actor() }).catch(function () {});
        notify("Item adicionado à fila de preparação.");
      }
      if (event.target.id === "comm-pref-save") {
        write(STORAGE.preferences, { email: id("comm-pref-email").checked, whatsapp: id("comm-pref-whatsapp").checked, automaticTimeline: id("comm-pref-timeline").checked });
        notify("Preferências de comunicação salvas.");
      }
    });

    id("crm-bulk-copy").addEventListener("click", function () { navigator.clipboard.writeText(Array.from(state.selected).join("\n")).then(function () { notify("IDs selecionados copiados."); }); });
    id("crm-bulk-export").addEventListener("click", function () {
      var selectedClients = state.clients.filter(function (client) { return state.selected.has(String(client.id)); });
      var csv = ["ID;NOME;DOCUMENTO;EMAIL;TELEFONE;SITUACAO"].concat(selectedClients.map(function (client) { return [client.id, client.nome, client.cpfCnpj, client.email, client.telefone || client.whatsapp, client.situacao || client.status].map(function (value) { return '"' + String(value || "").replace(/"/g, '""') + '"'; }).join(";"); })).join("\r\n");
      var link = d.createElement("a"); link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })); link.download = "atlas-clientes-selecionados-4.9.12.csv"; link.click(); URL.revokeObjectURL(link.href);
    });
    id("crm-bulk-clear").addEventListener("click", function () { state.selected.clear(); d.querySelectorAll(".crm-row-selector input").forEach(function (input) { input.checked = false; }); updateBulk(); });

    d.addEventListener("change", function (event) { var input = event.target.closest(".crm-row-selector input"); if (!input) return; if (input.checked) state.selected.add(input.value); else state.selected.delete(input.value); updateBulk(); event.stopPropagation(); });
    d.addEventListener("click", function (event) { if (event.target.closest(".crm-row-selector")) event.stopPropagation(); });
    d.addEventListener("keydown", function (event) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openModal("crm-universal"); id("crm-universal-input").focus(); } if (event.key === "Escape") { closeFloating(); ["crm-universal", "crm-alerts", "crm-communication"].forEach(closeModal); } });

    d.addEventListener("atlas:client-opened", function (event) { state.current = event.detail && event.detail.client; renderClientHeader(state.current); });
    id("crm-drawer-tabs").addEventListener("click", function (event) { var button = event.target.closest('button[data-tab="administracao"]'); if (button) renderAdmin(state.current); });
  }

  function updateBulk() { var bar = id("crm-bulk-bar"); if (!bar) return; bar.hidden = state.selected.size === 0; id("crm-bulk-count").textContent = state.selected.size; }
  function enhanceRows() {
    var body = id("crm-table-body"); if (!body) return;
    var observer = new MutationObserver(function () {
      body.querySelectorAll("tr[data-client-id]").forEach(function (row) {
        if (row.querySelector(".crm-row-selector")) return;
        var first = row.querySelector("td"); if (!first) return;
        first.insertAdjacentHTML("afterbegin", '<label class="crm-row-selector" title="Selecionar cliente"><input type="checkbox" value="' + esc(row.dataset.clientId) + '"><span></span></label>');
      });
    });
    observer.observe(body, { childList: true });
  }

  function init() {
    shell();
    enhanceDrawer();
    bind();
    enhanceRows();
    communicationView("templates");
    loadData();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})(window, document);
