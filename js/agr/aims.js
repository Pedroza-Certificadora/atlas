/*
  Pedroza Certificadora
  Atlas Intelligent Management System v1.0 — Sprint 4.4
  Concepção, Design e Desenvolvimento — Marcos Henrique Pedroza
*/
(function () {
  "use strict";
  var DATA = window.ATLAS_AIMS_DATA || { checklists: [], messages: [], quickActions: [] };
  var STORAGE = { checklists: "atlasAIMSChecklists", notes: "atlasAIMSNotes", stats: "atlasAIMSStats", version: "atlasAIMSVersion" };
  var saveTimer;

  function read(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; } }
  function esc(value) { return String(value || "").replace(/[&<>'"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]; }); }
  function toast(message) { var node = document.getElementById("agr-toast"); if (!node) { node = document.createElement("div"); node.id = "agr-toast"; node.className = "agr-toast"; node.setAttribute("role", "status"); document.body.appendChild(node); } node.textContent = message; node.classList.add("is-visible"); clearTimeout(toast.timer); toast.timer = setTimeout(function () { node.classList.remove("is-visible"); }, 2200); }

  function checklistState() { return read(STORAGE.checklists, {}); }
  function renderChecklists() {
    var target = document.getElementById("aims-checklist-grid"); if (!target) return;
    var state = checklistState();
    target.innerHTML = DATA.checklists.map(function (list) {
      var completed = state[list.id] || [];
      var count = completed.filter(Boolean).length;
      var pct = Math.round((count / list.steps.length) * 100);
      return '<article class="aims-checklist-card"><div class="aims-checklist-head"><div><span>Certificado</span><h4>' + esc(list.title) + '</h4></div><strong>' + pct + '%</strong></div><div class="aims-progress-track"><span style="width:' + pct + '%"></span></div><ol>' + list.steps.map(function (step, index) { var checked = !!completed[index]; return '<li><label><input type="checkbox" data-checklist="' + esc(list.id) + '" data-step="' + index + '"' + (checked ? ' checked' : '') + '><span>' + esc(step) + '</span></label></li>'; }).join("") + '</ol></article>';
    }).join("");
    renderSummary();
  }

  function renderSummary() {
    var state = checklistState(), total = 0, done = 0, active = 0;
    DATA.checklists.forEach(function (list) { var values = state[list.id] || []; var current = values.filter(Boolean).length; total += list.steps.length; done += current; if (current > 0 && current < list.steps.length) active += 1; });
    var summary = document.getElementById("aims-progress-summary"); if (summary) summary.textContent = done + " de " + total + " etapas";
    var activeNode = document.getElementById("aims-stat-active"); if (activeNode) activeNode.textContent = String(active);
    var doneNode = document.getElementById("aims-stat-done"); if (doneNode) doneNode.textContent = String(done);
    var stats = read(STORAGE.stats, { copies: 0 });
    var copies = document.getElementById("aims-stat-copies"); if (copies) copies.textContent = String(stats.copies || 0);
    var note = read(STORAGE.notes, { text: "" }); var noteNode = document.getElementById("aims-stat-note"); if (noteNode) noteNode.textContent = note.text && note.text.trim() ? "Sim" : "Não";
    var listNode = document.getElementById("aims-progress-list"); if (listNode) listNode.innerHTML = DATA.checklists.map(function (list) { var current = (state[list.id] || []).filter(Boolean).length; var pct = Math.round(current / list.steps.length * 100); return '<button type="button" data-open-checklist="' + esc(list.id) + '"><span><strong>' + esc(list.title) + '</strong><small>' + current + ' de ' + list.steps.length + ' etapas</small></span><b>' + pct + '%</b></button>'; }).join("");
  }

  function renderMessages() {
    var select = document.getElementById("aims-message-category"), target = document.getElementById("aims-message-grid"); if (!select || !target) return;
    var categories = Array.from(new Set(DATA.messages.map(function (m) { return m.category; })));
    select.innerHTML = '<option value="all">Todas</option>' + categories.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join("");
    function paint() { var selected = select.value; var messages = DATA.messages.filter(function (m) { return selected === "all" || m.category === selected; }); target.innerHTML = messages.map(function (m, i) { var index = DATA.messages.indexOf(m); return '<article class="aims-message-card"><span>' + esc(m.category) + '</span><h4>' + esc(m.title) + '</h4><p>' + esc(m.text) + '</p><button type="button" data-copy-message="' + index + '">Copiar mensagem</button></article>'; }).join(""); }
    select.addEventListener("change", paint); paint();
  }

  function copyText(text, button) {
    var promise = navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(text) : new Promise(function (resolve, reject) { var area = document.createElement("textarea"); area.value = text; area.style.position = "fixed"; area.style.opacity = "0"; document.body.appendChild(area); area.select(); try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); } area.remove(); });
    promise.then(function () { var stats = read(STORAGE.stats, { copies: 0 }); stats.copies = Number(stats.copies || 0) + 1; write(STORAGE.stats, stats); renderSummary(); toast("Mensagem copiada com sucesso."); var old = button.textContent; button.textContent = "Copiado ✓"; setTimeout(function () { button.textContent = old; }, 1600); }).catch(function () { toast("Não foi possível copiar a mensagem."); });
  }

  function initNotes() {
    var area = document.getElementById("aims-notes"), count = document.getElementById("aims-notes-count"), saved = document.getElementById("aims-notes-saved"); if (!area) return;
    var state = read(STORAGE.notes, { text: "", updatedAt: null }); area.value = state.text || ""; count.textContent = area.value.length + "/3000"; if (state.updatedAt) saved.textContent = "Salvo às " + new Date(state.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    area.addEventListener("input", function () { count.textContent = area.value.length + "/3000"; saved.textContent = "Salvando..."; clearTimeout(saveTimer); saveTimer = setTimeout(function () { var now = new Date().toISOString(); write(STORAGE.notes, { text: area.value, updatedAt: now }); saved.textContent = "Salvo às " + new Date(now).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); renderSummary(); }, 450); });
  }

  function initTabs() {
    document.querySelectorAll("[data-aims-tab]").forEach(function (button) { button.addEventListener("click", function () { var name = button.dataset.aimsTab; document.querySelectorAll("[data-aims-tab]").forEach(function (b) { var on = b === button; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", String(on)); }); document.querySelectorAll("[data-aims-panel]").forEach(function (panel) { var on = panel.dataset.aimsPanel === name; panel.hidden = !on; panel.classList.toggle("is-active", on); }); }); });
  }

  function renderQuickActions() {
    var target = document.getElementById("aims-quick-actions"); if (!target) return;
    target.innerHTML = DATA.quickActions.map(function (action) { var resource = document.querySelector('[data-agr-resource="' + action.key + '"]'); var link = resource && (resource.matches("a") ? resource : resource.querySelector("a[href]")); return link ? '<a href="' + esc(link.href) + '" target="_blank" rel="noopener"><span>' + esc(action.label) + '</span><b aria-hidden="true">↗</b></a>' : ''; }).join("");
  }

  function bind() {
    document.addEventListener("change", function (event) { if (event.target.matches("[data-checklist]")) { var state = checklistState(), id = event.target.dataset.checklist, step = Number(event.target.dataset.step); state[id] = state[id] || []; state[id][step] = event.target.checked; write(STORAGE.checklists, state); renderChecklists(); } });
    document.addEventListener("click", function (event) { var copy = event.target.closest("[data-copy-message]"); if (copy) copyText(DATA.messages[Number(copy.dataset.copyMessage)].text, copy); var open = event.target.closest("[data-open-checklist]"); if (open) { document.querySelector('[data-aims-tab="checklists"]').click(); setTimeout(function () { var card = document.querySelector('[data-checklist="' + open.dataset.openChecklist + '"]'); if (card) card.closest(".aims-checklist-card").scrollIntoView({ behavior: "smooth", block: "start" }); }, 50); } });
    var reset = document.getElementById("aims-reset-checklists"); if (reset) reset.addEventListener("click", function () { if (window.confirm("Limpar todas as etapas marcadas nos checklists?")) { write(STORAGE.checklists, {}); renderChecklists(); toast("Checklists reiniciados."); } });
  }

  function initCollapsibleGroups() {
    document.querySelectorAll(".agr-section").forEach(function (section) {
      var heading = section.querySelector(".agr-section-heading");
      if (!heading || heading.querySelector(".agr-collapse-button")) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "agr-collapse-button";
      button.textContent = "Recolher";
      button.setAttribute("aria-expanded", "true");
      button.addEventListener("click", function () {
        var collapsed = section.classList.toggle("is-collapsed");
        button.textContent = collapsed ? "Expandir" : "Recolher";
        button.setAttribute("aria-expanded", String(!collapsed));
      });
      heading.appendChild(button);
    });
  }

  function init() { write(STORAGE.version, "4.4.0"); initTabs(); renderChecklists(); renderMessages(); initNotes(); renderQuickActions(); initCollapsibleGroups(); bind(); renderSummary(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
