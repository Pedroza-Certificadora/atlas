(() => {
  "use strict";

  const config = window.ATLAS_AEVS_CONFIG || {};
  const endpoint = String(config.endpoint || "").trim();
  const whatsapp = String(config.whatsapp || "5521991674117").replace(/\D/g, "");

  const form = document.querySelector("#form-consulta");
  const inputDocumento = document.querySelector("#documento");
  const consentimento = document.querySelector("#consentimento");
  const botaoConsultar = document.querySelector("#botao-consultar");
  const botaoTexto = document.querySelector(".botao-texto");
  const botaoCarregando = document.querySelector(".botao-carregando");
  const mensagemErro = document.querySelector("#documento-erro");

  const resultadoSection = document.querySelector("#resultado-consulta");
  const resultadoCard = document.querySelector("#resultado-card");
  const resultadoIcone = document.querySelector("#resultado-icone");
  const resultadoCategoria = document.querySelector("#resultado-categoria");
  const resultadoTitulo = document.querySelector("#resultado-titulo");
  const resultadoMensagem = document.querySelector("#resultado-mensagem");
  const resultadoDados = document.querySelector("#resultado-dados");

  const resultadoTitular = document.querySelector("#resultado-titular");
  const resultadoDocumento = document.querySelector("#resultado-documento");
  const resultadoTipo = document.querySelector("#resultado-tipo");
  const resultadoValidade = document.querySelector("#resultado-validade");
  const resultadoSituacao = document.querySelector("#resultado-situacao");
  const resultadoPrazo = document.querySelector("#resultado-prazo");
  const resultadoWhatsapp = document.querySelector("#resultado-whatsapp");
  const novaConsulta = document.querySelector("#nova-consulta");

  let consultaSequencia = 0;
  let consultaController = null;

  if (!form || !inputDocumento) {
    return;
  }

  function somenteNumeros(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function formatarDocumento(valor) {
    const numeros = somenteNumeros(valor).slice(0, 14);

    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function mascararDocumento(documento) {
    const numeros = somenteNumeros(documento);

    if (numeros.length === 11) {
      return `***.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-**`;
    }

    if (numeros.length === 14) {
      return `**.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/****-**`;
    }

    return "Documento protegido";
  }

  function emitirEventoAics(detalhe) {
    document.dispatchEvent(new CustomEvent("atlas:aevs-result", { detail: detalhe }));
  }

  function documentoValidoBasico(documento) {
    if (![11, 14].includes(documento.length)) {
      return false;
    }

    return !/^(\d)\1+$/.test(documento);
  }

  function mostrarErro(mensagem) {
    inputDocumento.setAttribute("aria-invalid", "true");
    mensagemErro.textContent = mensagem;
    mensagemErro.hidden = false;
  }

  function limparErro() {
    inputDocumento.removeAttribute("aria-invalid");
    mensagemErro.textContent = "";
    mensagemErro.hidden = true;
  }

  function alternarCarregamento(ativo) {
    botaoConsultar.disabled = ativo;
    inputDocumento.disabled = ativo;
    consentimento.disabled = ativo;
    botaoTexto.hidden = ativo;
    botaoCarregando.hidden = !ativo;
  }

  function primeiroValor(objeto, chaves, padrao = "") {
    for (const chave of chaves) {
      const valor = objeto?.[chave];

      if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
        return valor;
      }
    }

    return padrao;
  }

  function limparResultadoAnterior() {
    resultadoSection.hidden = true;
    resultadoDados.hidden = true;
    resultadoCard.className = "resultado-card";
    resultadoIcone.textContent = "";
    resultadoCategoria.textContent = "Resultado da consulta";
    resultadoTitulo.textContent = "";
    resultadoMensagem.textContent = "";
    resultadoTitular.textContent = "—";
    resultadoDocumento.textContent = "—";
    resultadoTipo.textContent = "—";
    resultadoValidade.textContent = "—";
    resultadoSituacao.textContent = "—";
    resultadoPrazo.textContent = "—";
    resultadoWhatsapp.textContent = "Falar com atendimento";
    resultadoWhatsapp.href = `https://wa.me/${whatsapp}`;
  }

  function possuiDadosDeCertificado(dados) {
    if (!dados || typeof dados !== "object") return false;

    const chavesCertificado = [
      "titularMascarado", "nomeMascarado", "titular", "nome", "razaoSocial",
      "documentoMascarado", "cpfCnpjMascarado", "documento", "cpfCnpj",
      "tipoCertificado", "tipo", "produto", "certificado",
      "validadeFormatada", "validade", "dataValidade", "vencimento",
      "diasRestantes", "dias", "diasParaVencer", "prazo", "situacao", "status"
    ];

    return chavesCertificado.some((chave) => {
      const valor = dados[chave];
      return valor !== undefined && valor !== null && String(valor).trim() !== "";
    });
  }

  function retornoEncontrado(dados) {
    const flags = ["encontrado", "found", "localizado"];
    for (const chave of flags) {
      if (Object.prototype.hasOwnProperty.call(dados || {}, chave)) {
        const valor = String(dados[chave]).trim().toLowerCase();
        return !["false", "0", "não", "nao", "no", "null", "undefined", ""].includes(valor);
      }
    }

    if (Object.prototype.hasOwnProperty.call(dados || {}, "success") && dados.success === false) return false;
    if (Object.prototype.hasOwnProperty.call(dados || {}, "ok") && dados.ok === false) return false;
    return possuiDadosDeCertificado(dados);
  }

  function normalizarStatus(valor, dias) {
    const status = String(valor || "").trim().toLowerCase();

    if (
      status.includes("vencid") ||
      status.includes("expirad") ||
      Number(dias) < 0
    ) {
      return "vencido";
    }

    if (
      status.includes("próxim") ||
      status.includes("proxim") ||
      status.includes("atenção") ||
      status.includes("atencao") ||
      (Number.isFinite(Number(dias)) && Number(dias) >= 0 && Number(dias) <= 30)
    ) {
      return "atencao";
    }

    return "valido";
  }

  function criarMensagemWhatsapp(tipo, documento) {
    const texto =
      tipo === "vencido"
        ? `Olá! Consultei a Área do Cliente e meu certificado aparece como vencido. Documento: ${documento}.`
        : tipo === "atencao"
          ? `Olá! Consultei a Área do Cliente e meu certificado está próximo do vencimento. Documento: ${documento}.`
          : `Olá! Consultei meu certificado na Área do Cliente e gostaria de orientação sobre renovação. Documento: ${documento}.`;

    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  function exibirNaoEncontrado(mensagem, documentoDigitado = "") {
    resultadoCard.className = "resultado-card status-erro";
    resultadoIcone.textContent = "!";
    resultadoCategoria.textContent = "Consulta concluída";
    resultadoTitulo.textContent = "Certificado não encontrado";
    resultadoMensagem.textContent =
      mensagem ||
      "Não localizamos um certificado vinculado a este documento. Confira os dados ou fale com nosso atendimento.";

    resultadoDados.hidden = true;
    resultadoWhatsapp.textContent = "Falar com atendimento";
    resultadoWhatsapp.href =
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        "Olá! Não encontrei meu certificado na Área do Cliente e preciso de ajuda."
      )}`;

    resultadoSection.hidden = false;
    resultadoSection.scrollIntoView({ behavior: "smooth", block: "start" });

    emitirEventoAics({
      documentoMascarado: mascararDocumento(documentoDigitado),
      documentoTemporario: documentoDigitado,
      tipo: "Certificado digital",
      situacao: "Não localizado",
      status: "erro",
      validade: "Não informada"
    });
  }

  function exibirResultado(dados, documentoDigitado) {
    const encontrado = retornoEncontrado(dados);

    if (!encontrado) {
      exibirNaoEncontrado(
        primeiroValor(dados, ["mensagem", "message", "erro"], ""),
        documentoDigitado
      );
      return;
    }

    const titular = primeiroValor(
      dados,
      ["titularMascarado", "nomeMascarado", "titular", "nome", "razaoSocial"],
      "Dado protegido"
    );

    const documentoRecebido = primeiroValor(
      dados,
      ["documentoMascarado", "cpfCnpjMascarado", "documento", "cpfCnpj"],
      mascararDocumento(documentoDigitado)
    );

    const documento = somenteNumeros(documentoRecebido).length >= 11
      ? mascararDocumento(documentoDigitado)
      : documentoRecebido;

    const tipo = primeiroValor(
      dados,
      ["tipoCertificado", "tipo", "produto", "certificado"],
      "Certificado digital"
    );

    const validade = primeiroValor(
      dados,
      ["validadeFormatada", "validade", "dataValidade", "vencimento"],
      "Consulte o atendimento"
    );

    const dias = primeiroValor(
      dados,
      ["diasRestantes", "dias", "diasParaVencer", "prazo"],
      ""
    );

    const situacaoOriginal = primeiroValor(
      dados,
      ["situacao", "status", "estado"],
      "Válido"
    );

    const status = normalizarStatus(situacaoOriginal, dias);

    resultadoCard.className = `resultado-card status-${status}`;
    resultadoDados.hidden = false;

    resultadoTitular.textContent = titular;
    resultadoDocumento.textContent = documento;
    resultadoTipo.textContent = tipo;
    resultadoValidade.textContent = validade;
    resultadoSituacao.textContent = situacaoOriginal;

    if (dias === "" || dias === null || dias === undefined) {
      resultadoPrazo.textContent = "Não informado";
    } else if (Number(dias) < 0) {
      resultadoPrazo.textContent = `Vencido há ${Math.abs(Number(dias))} dia(s)`;
    } else {
      resultadoPrazo.textContent = `${Number(dias)} dia(s) restante(s)`;
    }

    if (status === "vencido") {
      resultadoIcone.textContent = "!";
      resultadoCategoria.textContent = "Atenção necessária";
      resultadoTitulo.textContent = "Certificado vencido";
      resultadoMensagem.textContent =
        "Entre em contato para verificar a emissão de um novo certificado.";
      resultadoWhatsapp.textContent = "Emitir novo certificado";
    } else if (status === "atencao") {
      resultadoIcone.textContent = "!";
      resultadoCategoria.textContent = "Renovação recomendada";
      resultadoTitulo.textContent = "Próximo do vencimento";
      resultadoMensagem.textContent =
        "Recomendamos iniciar a renovação antes do término da validade.";
      resultadoWhatsapp.textContent = "Renovar agora";
    } else {
      resultadoIcone.textContent = "✓";
      resultadoCategoria.textContent = "Situação regular";
      resultadoTitulo.textContent = "Certificado válido";
      resultadoMensagem.textContent =
        "O certificado está dentro do prazo de validade informado.";
      resultadoWhatsapp.textContent = "Renovar antecipadamente";
    }

    resultadoWhatsapp.href = criarMensagemWhatsapp(
      status,
      mascararDocumento(documentoDigitado)
    );

    resultadoSection.hidden = false;
    resultadoSection.scrollIntoView({ behavior: "smooth", block: "start" });

    if (typeof window.gtag === "function") {
      window.gtag("event", "consulta_certificado_concluida", {
        event_category: "AEVS",
        status_certificado: status
      });
    }

    emitirEventoAics({
      documentoMascarado: documento,
      documentoTemporario: documentoDigitado,
      tipo,
      situacao: situacaoOriginal,
      status,
      validade
    });
  }

  async function consultar(documento, signal) {
    if (!endpoint || endpoint.includes("__ENDPOINT")) {
      throw new Error("O endereço do serviço de consulta ainda não foi configurado.");
    }

    const url = new URL(endpoint);
    url.searchParams.set("documento", documento);
    url.searchParams.set("cpfCnpj", documento);
    url.searchParams.set("_", Date.now().toString());

    const resposta = await fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      headers: {
        Accept: "application/json"
      },
      signal
    });

    if (!resposta.ok) {
      throw new Error(`Falha na consulta. Código ${resposta.status}.`);
    }

    const texto = await resposta.text();

    try {
      return JSON.parse(texto);
    } catch {
      throw new Error("O serviço retornou uma resposta inválida.");
    }
  }

  limparResultadoAnterior();

  inputDocumento.addEventListener("input", () => {
    inputDocumento.value = formatarDocumento(inputDocumento.value);
    limparErro();
  });

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    limparErro();

    const documento = somenteNumeros(inputDocumento.value);

    if (!documentoValidoBasico(documento)) {
      mostrarErro("Digite um CPF com 11 números ou um CNPJ com 14 números.");
      inputDocumento.focus();
      return;
    }

    if (!consentimento.checked) {
      mostrarErro("Confirme que você está autorizado a realizar esta consulta.");
      consentimento.focus();
      return;
    }

    limparResultadoAnterior();
    consultaSequencia += 1;
    const sequenciaAtual = consultaSequencia;
    consultaController?.abort();
    consultaController = new AbortController();
    alternarCarregamento(true);

    try {
      const retorno = await consultar(documento, consultaController.signal);
      if (sequenciaAtual !== consultaSequencia) return;

      const dados = retorno?.dados || retorno?.data || retorno?.resultado || retorno;
      exibirResultado(dados, documento);
    } catch (erro) {
      if (erro?.name === "AbortError" || sequenciaAtual !== consultaSequencia) return;
      console.error("AEVS:", erro);

      resultadoCard.className = "resultado-card status-erro";
      resultadoIcone.textContent = "!";
      resultadoCategoria.textContent = "Falha de comunicação";
      resultadoTitulo.textContent = "Não foi possível concluir a consulta";
      resultadoMensagem.textContent =
        "O Atlas não conseguiu acessar o serviço de consulta. Tente novamente ou fale com nosso atendimento.";

      resultadoDados.hidden = true;
      resultadoWhatsapp.textContent = "Falar com atendimento";
      resultadoWhatsapp.href =
        `https://wa.me/${whatsapp}?text=${encodeURIComponent(
          "Olá! Não consegui consultar meu certificado na Área do Cliente."
        )}`;

      resultadoSection.hidden = false;
      resultadoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      if (sequenciaAtual === consultaSequencia) {
        alternarCarregamento(false);
        consultaController = null;
      }
    }
  });

  novaConsulta?.addEventListener("click", () => {
    consultaSequencia += 1;
    consultaController?.abort();
    consultaController = null;
    limparResultadoAnterior();
    inputDocumento.value = "";
    consentimento.checked = false;
    limparErro();
    inputDocumento.focus();
    window.scrollTo({
      top: Math.max(0, form.getBoundingClientRect().top + window.scrollY - 130),
      behavior: "smooth"
    });
  });
})();
