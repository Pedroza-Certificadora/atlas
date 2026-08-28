/*
  Pedroza Certificadora
  Atlas Agenda - Hardening 5.0.10.14
  Concepcao, Design e Desenvolvimento: Marcos Henrique Pedroza
*/
(function () {
  "use strict";

  var appointments = [];
  var clients = [];
  var view = "week";
  var reference = new Date();

  function id(value) { return document.getElementById(value); }
  function actor() {
    try {
      var s = window.AtlasAuth && window.AtlasAuth.session ? window.AtlasAuth.session.read() : null;
      return String(s && s.user && (s.user.displayName || s.user.username) || "ATLAS");
    } catch (error) { return "ATLAS"; }
  }
  function operationalClient(client) {
    var situation = String(client && client.situacao || "").toUpperCase();
    return client && client.active !== false && ["INATIVO","ARQUIVADO","EXCLUIDO","INTEGRADO"].indexOf(situation) === -1;
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }
  function toLocalInput(value) {
    var date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    if (isNaN(date.getTime())) return "";
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }
  function parseLocalInput(value) {
    var match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!match) return null;
    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), 0, 0);
    return isNaN(date.getTime()) ? null : date;
  }
  function setFeedback(message, isError) {
    var feedback = id("agenda-feedback");
    feedback.hidden = !message;
    feedback.textContent = message || "";
    feedback.classList.toggle("is-success", Boolean(message) && !isError);
    feedback.classList.toggle("is-error", Boolean(message) && Boolean(isError));
  }
  function limits() {
    var start = new Date(reference);
    var end = new Date(reference);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    if (view === "week") {
      var offset = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - offset);
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    }
    if (view === "month") {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    return [start, end];
  }
  function render() {
    var today = new Date().toDateString();
    id("agenda-today").textContent = appointments.filter(function (item) { return new Date(item.inicio).toDateString() === today; }).length;
    id("agenda-requested").textContent = appointments.filter(function (item) { return item.situacao === "SOLICITADO"; }).length;
    id("agenda-confirmed").textContent = appointments.filter(function (item) { return item.situacao === "CONFIRMADO"; }).length;
    id("agenda-completed").textContent = appointments.filter(function (item) { return item.situacao === "CONCLUIDO"; }).length;
    id("agenda-list").innerHTML = appointments.length ? appointments.map(function (item) {
      var date = new Date(item.inicio);
      return '<article class="agenda-item"><time>' + date.toLocaleDateString("pt-BR") + "<br>" + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + '</time><div><span class="agenda-status">' + esc(item.situacao.replace(/_/g, " ")) + '</span><h2>' + esc(item.titulo) + '</h2><p>' + esc(item.clienteNome) + " • " + esc(item.tipo) + " • " + esc(item.responsavel || "A definir") + '</p></div><button data-edit="' + esc(item.id) + '">Editar</button></article>';
    }).join("") : '<div class="agenda-empty">Nenhum atendimento neste periodo.</div>';
  }
  function load() {
    var range = limits();
    id("agenda-list").innerHTML = '<p>Carregando agenda...</p>';
    return Promise.all([
      window.AtlasAPI.listAgenda({ inicio: range[0].toISOString(), fim: range[1].toISOString() }),
      clients.length ? Promise.resolve(clients) : window.AtlasAPI.listClients()
    ]).then(function (output) {
      appointments = Array.isArray(output[0]) ? output[0] : [];
      clients = (Array.isArray(output[1]) ? output[1] : []).filter(operationalClient);
      id("agenda-client").innerHTML = '<option value="">Selecione...</option>' + clients.map(function (client) {
        return '<option value="' + esc(client.id) + '">' + esc(client.name || client.nome || client.company || client.empresa || client.id) + '</option>';
      }).join("");
      render();
    }).catch(function (error) {
      id("agenda-list").innerHTML = '<div class="agenda-empty">' + esc(error.message) + '</div>';
    });
  }
  function open(item) {
    id("agenda-form").reset();
    setFeedback("", false);
    id("agenda-id").value = item ? item.id : "";
    id("agenda-form-title").textContent = item ? "Editar agendamento" : "Novo agendamento";
    if (item) {
      id("agenda-client").value = item.clienteId;
      id("agenda-title").value = item.titulo;
      id("agenda-type").value = item.tipo || "OUTRO";
      id("agenda-status").value = item.situacao;
      id("agenda-start").value = toLocalInput(item.inicio);
      id("agenda-end").value = toLocalInput(item.fim);
      id("agenda-owner").value = item.responsavel || "";
      id("agenda-location").value = item.localLink || "";
      id("agenda-notes").value = item.observacoes || "";
    } else {
      var start = new Date();
      start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30, 0, 0);
      var end = new Date(start.getTime() + 30 * 60000);
      id("agenda-start").value = toLocalInput(start);
      id("agenda-end").value = toLocalInput(end);
      id("agenda-title").value = "Atendimento de certificado digital";
    }
    id("agenda-modal").hidden = false;
  }
  function close() { id("agenda-modal").hidden = true; }

  id("agenda-new").onclick = function () { open(null); };
  id("agenda-close").onclick = close;
  id("agenda-cancel").onclick = close;
  id("agenda-refresh").onclick = load;
  id("agenda-reference").value = toLocalInput(new Date()).slice(0, 10);
  id("agenda-reference").onchange = function () { reference = new Date(this.value + "T12:00:00"); load(); };
  document.querySelectorAll("[data-view]").forEach(function (button) {
    button.onclick = function () {
      document.querySelectorAll("[data-view]").forEach(function (item) { item.classList.remove("active"); });
      button.classList.add("active");
      view = button.dataset.view;
      load();
    };
  });
  id("agenda-list").onclick = function (event) {
    var button = event.target.closest("[data-edit]");
    if (button) open(appointments.find(function (item) { return item.id === button.dataset.edit; }));
  };
  id("agenda-form").onsubmit = function (event) {
    event.preventDefault();
    setFeedback("", false);
    var start = parseLocalInput(id("agenda-start").value);
    var end = parseLocalInput(id("agenda-end").value);
    if (!start || !end) { setFeedback("Informe inicio e fim validos.", true); return; }
    if (end <= start) { setFeedback("O fim deve ser posterior ao inicio.", true); return; }
    var key = id("agenda-id").value;
    var payload = {
      id: key,
      clienteId: id("agenda-client").value,
      titulo: id("agenda-title").value,
      tipo: id("agenda-type").value,
      situacao: id("agenda-status").value,
      inicio: start.toISOString(),
      fim: end.toISOString(),
      responsavel: id("agenda-owner").value,
      localLink: id("agenda-location").value,
      observacoes: id("agenda-notes").value,
      actor: actor()
    };
    var button = event.currentTarget.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = "Salvando...";
    var operation = key ? window.AtlasAPI.updateAppointment(payload) : window.AtlasAPI.createAppointment(payload);
    operation.then(function () {
      setFeedback("Agendamento salvo com sucesso.", false);
      return load();
    }).then(function () {
      window.setTimeout(close, 350);
    }).catch(function (error) {
      setFeedback(error.message, true);
    }).finally(function () {
      button.disabled = false;
      button.textContent = "Salvar agendamento";
    });
  };

  load();
})();
