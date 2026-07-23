/* Atlas ACMS Interface - Dashboard Administrativo 4.9.19 */
(function (window, document) {
  "use strict";

  function safeUsers() {
    try { return window.AtlasAuth.userProvider.list(); } catch (error) { return []; }
  }

  function text(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = String(value);
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date(value));
    } catch (error) {
      return "Agora";
    }
  }

  function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    var raw = String(value).trim();
    var br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (br) {
      var parsed = new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]), Number(br[4] || 0), Number(br[5] || 0), Number(br[6] || 0));
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    var date = new Date(raw);
    return isNaN(date.getTime()) ? null : date;
  }

  function dayStart(value) {
    var date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function isSameDay(left, right) {
    return dayStart(left).getTime() === dayStart(right).getTime();
  }

  function renderActivity(records) {
    var list = document.getElementById("atlas-activity-list");
    if (!list) return;
    if (!records.length) {
      list.innerHTML = '<div class="atlas-empty-state"><p>Nenhum evento recente.</p><small>As próximas atividades aparecerão aqui.</small></div>';
      return;
    }
    list.innerHTML = records.slice(0, 4).map(function (item) {
      var label = item.ACAO || item.TIPO_EVENTO || item.type || item.action || "ATIVIDADE";
      var detail = item.USUARIO_LOGIN || item.username || item.user || item.TITULO || (item.details && item.details.username) || "Sistema Atlas";
      var when = item.DATA_HORA || item.createdAt || item.timestamp || Date.now();
      return '<div class="atlas-activity-item"><i></i><span><strong>' + String(label).replace(/_/g, " ") + '</strong><small>' + String(detail) + '</small></span><time>' + formatDate(when) + '</time></div>';
    }).join("");
  }

  function renderCertificateIndicators(certificates) {
    var today = dayStart(new Date());
    var in30 = new Date(today);
    in30.setDate(in30.getDate() + 30);
    var dueToday = 0;
    var due30 = 0;
    var expired = 0;

    certificates.forEach(function (certificate) {
      if (certificate.active === false) return;
      var expiry = parseDate(certificate.vencimento);
      if (!expiry) return;
      var day = dayStart(expiry);
      if (day.getTime() < today.getTime()) expired += 1;
      if (day.getTime() === today.getTime()) dueToday += 1;
      if (day.getTime() >= today.getTime() && day.getTime() <= in30.getTime()) due30 += 1;
    });

    text("atlas-kpi-due-today", dueToday);
    text("atlas-kpi-due-30", due30);
    text("atlas-kpi-expired", expired);
  }

  function renderTimelineIndicators(timeline) {
    var today = new Date();
    var count = timeline.filter(function (item) {
      var date = parseDate(item.DATA_HORA || item.createdAt || item.timestamp);
      return date && isSameDay(date, today);
    }).length;
    text("atlas-kpi-activity-today", count);
  }


  function bindDashboardCards() {
    function activate(card) {
      var target = card && card.getAttribute("data-dashboard-target");
      if (!target) return;
      if (target.charAt(0) === "#") {
        var section = document.querySelector(target);
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      window.location.href = target;
    }
    document.querySelectorAll("[data-dashboard-target]").forEach(function (card) {
      card.addEventListener("click", function () { activate(card); });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(card); }
      });
    });
  }

  async function render() {
    var session = window.AtlasAuth && window.AtlasAuth.session ? window.AtlasAuth.session.getActive() : null;
    if (session) {
      document.querySelectorAll("[data-auth-user-first-name]").forEach(function (element) {
        element.textContent = String(session.user.displayName || "Usuário").split(" ")[0];
      });
      text("atlas-last-access", formatDate(session.createdAt || Date.now()));
    }

    if (window.AtlasAPI && window.AtlasAPI.isConfigured()) {
      try {
        var results = await Promise.all([
          window.AtlasAPI.dashboard(),
          window.AtlasAPI.listCertificates(),
          window.AtlasAPI.listTimeline({ limit: 500 })
        ]);
        var summary = results[0] || {};
        var certificates = Array.isArray(results[1]) ? results[1] : [];
        var timeline = Array.isArray(results[2]) ? results[2] : [];

        text("atlas-kpi-clients", summary.activeClients || 0);
        text("atlas-kpi-users", summary.users || 0);
        text("atlas-kpi-certificates", summary.certificates || 0);
        text("atlas-kpi-renewals", summary.renewalsDue || 0);
        var agrs = summary.activeAgr || 0;
        text("atlas-kpi-agr", agrs + " AGR ativo" + (agrs === 1 ? "" : "s"));
        renderCertificateIndicators(certificates);
        renderTimelineIndicators(timeline);
        renderActivity(summary.recentAudit || timeline.slice(0, 10));
        return;
      } catch (error) {
        console.warn("Atlas Dashboard: indicadores complementares indisponíveis.", error);
      }
    }

    var users = safeUsers();
    var clients = users.filter(function (user) { return user.role === "CLIENTE" && user.active; }).length;
    var agrs = users.filter(function (user) { return user.role === "AGR" && user.active; }).length;
    text("atlas-kpi-clients", clients);
    text("atlas-kpi-users", users.length);
    text("atlas-kpi-agr", agrs + " AGR ativo" + (agrs === 1 ? "" : "s"));
    var records = [];
    try { records = window.AtlasAuth.audit.list().slice(0, 4); } catch (error) { records = []; }
    renderActivity(records);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { bindDashboardCards(); render(); });
  else { bindDashboardCards(); render(); }
})(window, document);
