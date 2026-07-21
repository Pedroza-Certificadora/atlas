/*
  Pedroza Certificadora
  Atlas Operational Smart System v1.0
  Sprint 4.3

  Concepção, Design e Desenvolvimento
  Marcos Henrique Pedroza
*/

(function () {
  "use strict";

  var STORAGE = {
    favorites: "atlasAGRFavorites",
    history: "atlasAGRHistory",
    stats: "atlasAGRStats",
    version: "atlasAGRVersion"
  };
  var VERSION = "4.3.0";
  var MAX_HISTORY = 5;
  var resourceMap = new Map();

  function read(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function slug(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
    });
  }

  function categoryFor(element) {
    if (element.classList.contains("agr-category-emissao")) return "Emissão";
    if (element.classList.contains("agr-category-consulta")) return "Consultas";
    if (element.classList.contains("agr-category-gestao")) return "Gestão";
    if (element.classList.contains("agr-category-governo") || element.classList.contains("agr-compact-government")) return "Governo / ICP-Brasil";
    return "Ferramentas";
  }

  function discoverResources() {
    var elements = document.querySelectorAll(".agr-card, .agr-compact-link");
    elements.forEach(function (element, index) {
      var link = element.matches("a") ? element : element.querySelector("a[href]");
      if (!link || !link.href) return;
      var titleNode = element.querySelector("h3, strong");
      var title = titleNode ? titleNode.textContent.trim() : "Recurso AGR";
      var category = categoryFor(element);
      var key = slug(title) || "recurso-" + index;
      if (resourceMap.has(key)) key += "-" + index;
      var description = element.textContent.replace(title, "").trim();
      var resource = { key: key, title: title, category: category, url: link.href, element: element, link: link };
      resource.searchText = normalize([title, category, description, link.href].join(" "));
      resourceMap.set(key, resource);
      element.dataset.agrResource = key;
      element.dataset.agrCategory = category;

      if (element.classList.contains("agr-card")) addCardActions(resource);
      link.addEventListener("click", function () { registerAccess(resource); });
    });
  }

  function addCardActions(resource) {
    var actions = document.createElement("div");
    actions.className = "agr-card-smart-actions";

    var favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "agr-favorite-button";
    favorite.dataset.favoriteKey = resource.key;
    favorite.setAttribute("aria-label", "Adicionar " + resource.title + " aos favoritos");
    favorite.innerHTML = '<span aria-hidden="true">☆</span><span>Favoritar</span>';

    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "agr-copy-button";
    copy.dataset.copyKey = resource.key;
    copy.innerHTML = '<span aria-hidden="true">⧉</span><span>Copiar link</span>';

    actions.appendChild(favorite);
    actions.appendChild(copy);
    resource.element.appendChild(actions);
  }

  function favorites() {
    return read(STORAGE.favorites, []).filter(function (key) { return resourceMap.has(key); });
  }

  function toggleFavorite(key) {
    var list = favorites();
    var index = list.indexOf(key);
    if (index >= 0) list.splice(index, 1); else list.unshift(key);
    write(STORAGE.favorites, list);
    renderFavorites();
    renderStats();
  }

  function renderFavorites() {
    var list = favorites();
    document.querySelectorAll("[data-favorite-key]").forEach(function (button) {
      var active = list.indexOf(button.dataset.favoriteKey) >= 0;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", (active ? "Remover " : "Adicionar ") + resourceMap.get(button.dataset.favoriteKey).title + (active ? " dos favoritos" : " aos favoritos"));
      button.innerHTML = '<span aria-hidden="true">' + (active ? "★" : "☆") + '</span><span>' + (active ? "Favorito" : "Favoritar") + '</span>';
    });

    var target = document.getElementById("agr-favorites-list");
    var count = document.getElementById("agr-favorites-count");
    if (count) count.textContent = list.length + (list.length === 1 ? " cadastrado" : " cadastrados");
    if (!target) return;
    if (!list.length) {
      target.innerHTML = '<p class="agr-smart-empty">Marque uma estrela nos cards para criar seus atalhos.</p>';
      return;
    }
    target.innerHTML = list.map(function (key) {
      var item = resourceMap.get(key);
      return '<a class="agr-smart-item" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener" data-smart-access="' + escapeHtml(key) + '"><span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.category) + '</small></span><b aria-hidden="true">↗</b></a>';
    }).join("");
  }

  function history() {
    return read(STORAGE.history, []).filter(function (item) { return item && resourceMap.has(item.key); }).slice(0, MAX_HISTORY);
  }

  function stats() {
    var value = read(STORAGE.stats, { total: 0, resources: {}, lastAccess: null });
    value.resources = value.resources || {};
    value.total = Number(value.total || 0);
    return value;
  }

  function registerAccess(resource) {
    var now = new Date().toISOString();
    var entries = history().filter(function (item) { return item.key !== resource.key; });
    entries.unshift({ key: resource.key, accessedAt: now });
    write(STORAGE.history, entries.slice(0, MAX_HISTORY));

    var value = stats();
    value.total += 1;
    value.resources[resource.key] = Number(value.resources[resource.key] || 0) + 1;
    value.lastAccess = { key: resource.key, accessedAt: now };
    write(STORAGE.stats, value);
    if (typeof window.gtag === "function") {
      window.gtag("event", "agr_link_open", {
        event_category: "Central AGR",
        link_text: resource.title,
        link_url: resource.url
      });
    }
    renderHistory();
    renderStats();
  }

  function formatTime(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function renderHistory() {
    var target = document.getElementById("agr-history-list");
    if (!target) return;
    var list = history();
    if (!list.length) {
      target.innerHTML = '<p class="agr-smart-empty">Os cinco sistemas acessados mais recentemente aparecerão aqui.</p>';
      return;
    }
    target.innerHTML = list.map(function (entry) {
      var item = resourceMap.get(entry.key);
      return '<a class="agr-smart-item" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener" data-smart-access="' + escapeHtml(entry.key) + '"><span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.category) + ' · ' + formatTime(entry.accessedAt) + '</small></span><b aria-hidden="true">↗</b></a>';
    }).join("");
  }

  function renderStats() {
    var value = stats();
    var topKey = null;
    var topCount = 0;
    Object.keys(value.resources).forEach(function (key) {
      if (resourceMap.has(key) && value.resources[key] > topCount) {
        topKey = key;
        topCount = value.resources[key];
      }
    });
    var last = value.lastAccess && resourceMap.get(value.lastAccess.key);
    document.getElementById("agr-stat-accesses").textContent = String(value.total);
    document.getElementById("agr-stat-favorites").textContent = String(favorites().length);
    document.getElementById("agr-stat-top").textContent = topKey ? resourceMap.get(topKey).title + " (" + topCount + ")" : "—";
    document.getElementById("agr-stat-last").textContent = last ? last.title + " · " + formatTime(value.lastAccess.accessedAt) : "—";
  }

  function copyLink(key, button) {
    var resource = resourceMap.get(key);
    if (!resource) return;
    var promise = navigator.clipboard && window.isSecureContext
      ? navigator.clipboard.writeText(resource.url)
      : new Promise(function (resolve, reject) {
          var input = document.createElement("textarea");
          input.value = resource.url;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          try { document.execCommand("copy") ? resolve() : reject(); } catch (error) { reject(error); }
          input.remove();
        });
    promise.then(function () {
      showToast("Link copiado com sucesso.");
      if (button) {
        var original = button.innerHTML;
        button.innerHTML = '<span aria-hidden="true">✓</span><span>Copiado</span>';
        setTimeout(function () { button.innerHTML = original; }, 1600);
      }
    }).catch(function () { showToast("Não foi possível copiar o link."); });
  }

  function showToast(message) {
    var toast = document.getElementById("agr-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "agr-toast";
      toast.className = "agr-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  function applySearch(value) {
    var query = normalize(value);
    var visible = 0;
    resourceMap.forEach(function (resource) {
      var match = !query || resource.searchText.indexOf(query) >= 0;
      resource.element.hidden = !match;
      if (match) visible += 1;
    });
    document.querySelectorAll(".agr-section").forEach(function (section) {
      var resources = section.querySelectorAll("[data-agr-resource]");
      if (!resources.length) return;
      var hasVisible = Array.from(resources).some(function (resource) { return !resource.hidden; });
      section.classList.toggle("agr-filtered-empty", !hasVisible && !!query);
    });
    var status = document.getElementById("agr-search-status");
    status.textContent = query ? visible + (visible === 1 ? " recurso encontrado." : " recursos encontrados.") : "Todos os recursos estão visíveis.";
    document.getElementById("agr-search-clear").hidden = !query;
    document.getElementById("agr-no-results").hidden = visible !== 0;
  }

  function modal() {
    var wrapper = document.createElement("div");
    wrapper.className = "agr-modal";
    wrapper.id = "agr-shortcuts-modal";
    wrapper.hidden = true;
    wrapper.innerHTML = '<div class="agr-modal-backdrop" data-close-modal></div><section class="agr-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="agr-modal-title"><button class="agr-modal-close" type="button" data-close-modal aria-label="Fechar atalhos">×</button><span class="agr-modal-eyebrow">Produtividade AGR</span><h2 id="agr-modal-title">Atalhos de teclado</h2><p>Use estes comandos em Windows ou Linux. Em alguns navegadores, combinações do sistema podem ter prioridade.</p><dl><div><dt>Alt + 1</dt><dd>Emissão A1</dd></div><div><dt>Alt + 2</dt><dd>Emissão A3</dd></div><div><dt>Alt + C</dt><dd>Consulta CPF</dd></div><div><dt>Alt + G</dt><dd>Gestão Online</dd></div><div><dt>Alt + M</dt><dd>Manual AGR</dd></div><div><dt>/</dt><dd>Focar na pesquisa</dd></div><div><dt>Esc</dt><dd>Fechar esta ajuda</dd></div></dl></section>';
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function openModal(open) {
    var element = document.getElementById("agr-shortcuts-modal") || modal();
    element.hidden = !open;
    document.body.classList.toggle("agr-modal-open", open);
    if (open) setTimeout(function () { element.querySelector(".agr-modal-close").focus(); }, 0);
    else document.getElementById("agr-help-button").focus();
  }

  function openShortcut(key) {
    var candidates = {
      "1": "portal-de-emissao-a1",
      "2": "portal-de-emissao-a3",
      "c": "consulta-cpf",
      "g": "ar-online-id-gestao-online",
      "m": "manual-do-agente-de-registro"
    };
    var resource = resourceMap.get(candidates[key]);
    if (!resource) return;
    registerAccess(resource);
    window.open(resource.url, "_blank", "noopener");
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var favorite = event.target.closest("[data-favorite-key]");
      if (favorite) { toggleFavorite(favorite.dataset.favoriteKey); return; }
      var copy = event.target.closest("[data-copy-key]");
      if (copy) { copyLink(copy.dataset.copyKey, copy); return; }
      var smart = event.target.closest("[data-smart-access]");
      if (smart) registerAccess(resourceMap.get(smart.dataset.smartAccess));
      if (event.target.closest("[data-close-modal]")) openModal(false);
    });

    var search = document.getElementById("agr-search");
    search.addEventListener("input", function () { applySearch(search.value); });
    document.getElementById("agr-search-clear").addEventListener("click", function () { search.value = ""; applySearch(""); search.focus(); });
    document.getElementById("agr-help-button").addEventListener("click", function () { openModal(true); });
    document.getElementById("agr-history-clear").addEventListener("click", function () { write(STORAGE.history, []); renderHistory(); showToast("Histórico local limpo."); });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !document.getElementById("agr-shortcuts-modal").hidden) { openModal(false); return; }
      if (event.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { event.preventDefault(); search.focus(); return; }
      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        var key = event.key.toLowerCase();
        if (["1", "2", "c", "g", "m"].indexOf(key) >= 0) { event.preventDefault(); openShortcut(key); }
      }
    });
  }

  function initialize() {
    write(STORAGE.version, VERSION);
    discoverResources();
    modal();
    bindEvents();
    renderFavorites();
    renderHistory();
    renderStats();
    applySearch("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
