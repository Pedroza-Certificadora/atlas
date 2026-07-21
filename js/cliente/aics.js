(() => {
  "use strict";

  const dados = window.ATLAS_AICS_DATA || { downloads: [], conteudos: [], timeline: [] };
  const CHAVE_HISTORICO = "atlas_aics_historico_v1";
  const CHAVE_FAVORITOS = "atlas_aics_favoritos_v1";
  const LIMITE_HISTORICO = 8;
  const memoriaDocumentos = new Map();

  const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
  const $$ = (seletor, contexto = document) => [...contexto.querySelectorAll(seletor)];

  function lerLocal(chave) {
    try {
      const valor = JSON.parse(localStorage.getItem(chave) || "[]");
      return Array.isArray(valor) ? valor : [];
    } catch {
      return [];
    }
  }

  function gravarLocal(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch {
      mostrarAviso("Não foi possível salvar neste navegador.", "erro");
      return false;
    }
  }

  function textoSeguro(valor, limite = 120) {
    return String(valor || "").replace(/[<>]/g, "").trim().slice(0, limite);
  }

  function normalizar(valor) {
    return String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function criarId(documentoMascarado, tipo) {
    const base = `${documentoMascarado}|${tipo}`;
    let hash = 0;
    for (let i = 0; i < base.length; i += 1) hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0;
    return `aics-${Math.abs(hash)}`;
  }

  function formatarData(dataIso) {
    try {
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(dataIso));
    } catch {
      return "Data indisponível";
    }
  }

  function mostrarAviso(mensagem, tipo = "sucesso") {
    const aviso = $("#aics-aviso");
    if (!aviso) return;
    aviso.textContent = mensagem;
    aviso.className = `aics-aviso aics-aviso-${tipo}`;
    aviso.hidden = false;
    window.clearTimeout(mostrarAviso.timer);
    mostrarAviso.timer = window.setTimeout(() => { aviso.hidden = true; }, 4200);
  }

  function historico() { return lerLocal(CHAVE_HISTORICO); }
  function favoritos() { return lerLocal(CHAVE_FAVORITOS); }

  function salvarConsulta(evento) {
    const detalhe = evento.detail || {};
    const documentoMascarado = textoSeguro(detalhe.documentoMascarado, 24);
    if (!documentoMascarado || /\d{11,14}/.test(documentoMascarado.replace(/\D/g, ""))) return;

    const tipo = textoSeguro(detalhe.tipo || "Certificado digital", 60);
    const registro = {
      id: criarId(documentoMascarado, tipo),
      documentoMascarado,
      tipo,
      situacao: textoSeguro(detalhe.situacao || "Consulta concluída", 60),
      status: textoSeguro(detalhe.status || "consulta", 20),
      validade: textoSeguro(detalhe.validade || "Não informada", 40),
      consultadoEm: new Date().toISOString()
    };

    if (detalhe.documentoTemporario) memoriaDocumentos.set(registro.id, String(detalhe.documentoTemporario));

    const atual = historico().filter((item) => item.id !== registro.id);
    gravarLocal(CHAVE_HISTORICO, [registro, ...atual].slice(0, LIMITE_HISTORICO));
    renderizarHistorico();
  }

  function alternarFavorito(id) {
    const item = historico().find((registro) => registro.id === id);
    if (!item) return;
    const lista = favoritos();
    const existe = lista.some((registro) => registro.id === id);
    gravarLocal(CHAVE_FAVORITOS, existe ? lista.filter((registro) => registro.id !== id) : [item, ...lista]);
    renderizarHistorico();
    renderizarFavoritos();
    mostrarAviso(existe ? "Favorito removido." : "Consulta adicionada aos favoritos.");
  }

  function repetirConsulta(id) {
    const input = $("#documento");
    const documento = memoriaDocumentos.get(id);
    if (documento && input) {
      input.value = documento;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
      $("#form-consulta")?.scrollIntoView({ behavior: "smooth", block: "center" });
      mostrarAviso("Documento preenchido somente nesta sessão. Confirme e consulte novamente.");
      return;
    }
    input?.focus();
    $("#form-consulta")?.scrollIntoView({ behavior: "smooth", block: "center" });
    mostrarAviso("Por segurança, digite novamente o documento completo.", "info");
  }

  function cartaoConsulta(item, favorito = false) {
    const artigo = document.createElement("article");
    artigo.className = "aics-consulta-item";
    artigo.innerHTML = `
      <div class="aics-consulta-main">
        <span class="aics-status aics-status-${textoSeguro(item.status, 20)}">${textoSeguro(item.situacao)}</span>
        <h4>${textoSeguro(item.tipo)}</h4>
        <p>${textoSeguro(item.documentoMascarado)} · ${textoSeguro(item.validade)}</p>
        <small>${formatarData(item.consultadoEm)}</small>
      </div>
      <div class="aics-item-acoes">
        <button type="button" data-repetir="${item.id}">Repetir</button>
        <button type="button" data-favorito="${item.id}" aria-label="${favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${favorito ? "★" : "☆"}</button>
        ${favorito ? `<button type="button" data-remover-favorito="${item.id}" aria-label="Remover favorito">×</button>` : ""}
      </div>`;
    return artigo;
  }

  function renderizarHistorico() {
    const lista = $("#aics-historico-lista");
    if (!lista) return;
    const itens = historico();
    const idsFavoritos = new Set(favoritos().map((item) => item.id));
    lista.replaceChildren();
    $("#aics-historico-vazio").hidden = itens.length > 0;
    itens.forEach((item) => lista.append(cartaoConsulta(item, idsFavoritos.has(item.id))));
  }

  function renderizarFavoritos() {
    const lista = $("#aics-favoritos-lista");
    if (!lista) return;
    const itens = favoritos();
    lista.replaceChildren();
    $("#aics-favoritos-vazio").hidden = itens.length > 0;
    itens.forEach((item) => lista.append(cartaoConsulta(item, true)));
  }

  function renderizarDownloads(filtro = "todos", termo = "") {
    const lista = $("#aics-downloads-lista");
    if (!lista) return;
    const busca = normalizar(termo);
    const itens = dados.downloads.filter((item) => {
      const categoriaOk = filtro === "todos" || item.categoria === filtro;
      const texto = normalizar([item.titulo, item.descricao, item.origem, ...(item.tags || [])].join(" "));
      return categoriaOk && (!busca || texto.includes(busca));
    });
    lista.replaceChildren();
    $("#aics-downloads-vazio").hidden = itens.length > 0;
    itens.forEach((item) => {
      const artigo = document.createElement("article");
      artigo.className = "aics-download-card";
      artigo.dataset.search = normalizar([item.titulo, item.descricao, item.origem, ...(item.tags || [])].join(" "));
      artigo.innerHTML = `
        <span class="aics-download-categoria">${textoSeguro(item.categoria)}</span>
        <h3>${textoSeguro(item.titulo)}</h3>
        <p>${textoSeguro(item.descricao, 260)}</p>
        <small>Destino: ${textoSeguro(item.origem)}</small>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer">Acessar fonte oficial <span aria-hidden="true">↗</span></a>`;
      lista.append(artigo);
    });
  }

  function renderizarTimeline() {
    const lista = $("#aics-timeline");
    if (!lista) return;
    dados.timeline.forEach((item, indice) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${indice + 1}</span><div><h3>${textoSeguro(item.titulo)}</h3><p>${textoSeguro(item.descricao, 220)}</p></div>`;
      lista.append(li);
    });
  }

  function pesquisar(termo) {
    const area = $("#aics-resultados-pesquisa");
    const lista = $("#aics-pesquisa-lista");
    if (!area || !lista) return;
    const busca = normalizar(termo.trim());
    if (busca.length < 2) { area.hidden = true; lista.replaceChildren(); return; }
    const fontes = [...dados.downloads, ...dados.conteudos];
    const encontrados = fontes.filter((item) => normalizar([item.titulo, item.descricao, item.categoria, ...(item.tags || [])].join(" ")).includes(busca)).slice(0, 12);
    lista.replaceChildren();
    encontrados.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.url;
      if (/^https?:/.test(item.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.innerHTML = `<span>${textoSeguro(item.categoria)}</span><strong>${textoSeguro(item.titulo)}</strong><small>${textoSeguro(item.descricao, 180)}</small>`;
      lista.append(a);
    });
    if (!encontrados.length) {
      const p = document.createElement("p");
      p.className = "aics-vazio-inline";
      p.textContent = "Nenhum conteúdo encontrado. Tente outra palavra ou fale com nosso suporte.";
      lista.append(p);
    }
    area.hidden = false;
  }

  function eventos() {
    document.addEventListener("atlas:aevs-result", salvarConsulta);
    document.addEventListener("click", (evento) => {
      const alvo = evento.target.closest("button");
      if (!alvo) return;
      if (alvo.dataset.favorito) alternarFavorito(alvo.dataset.favorito);
      if (alvo.dataset.repetir) repetirConsulta(alvo.dataset.repetir);
      if (alvo.dataset.removerFavorito) alternarFavorito(alvo.dataset.removerFavorito);
    });

    $("#aics-limpar-historico")?.addEventListener("click", () => {
      localStorage.removeItem(CHAVE_HISTORICO); memoriaDocumentos.clear(); renderizarHistorico(); mostrarAviso("Histórico local apagado.");
    });
    $("#aics-limpar-favoritos")?.addEventListener("click", () => {
      localStorage.removeItem(CHAVE_FAVORITOS); renderizarFavoritos(); renderizarHistorico(); mostrarAviso("Favoritos apagados.");
    });

    const pesquisa = $("#aics-pesquisa");
    pesquisa?.addEventListener("input", () => pesquisar(pesquisa.value));
    $("#aics-limpar-pesquisa")?.addEventListener("click", () => { pesquisa.value = ""; pesquisar(""); pesquisa.focus(); });

    const buscaDownloads = $("#aics-download-busca");
    const filtroDownloads = $("#aics-download-filtro");
    const atualizarDownloads = () => renderizarDownloads(filtroDownloads?.value || "todos", buscaDownloads?.value || "");
    buscaDownloads?.addEventListener("input", atualizarDownloads);
    filtroDownloads?.addEventListener("change", atualizarDownloads);
  }

  renderizarHistorico();
  renderizarFavoritos();
  renderizarDownloads();
  renderizarTimeline();
  eventos();
})();
