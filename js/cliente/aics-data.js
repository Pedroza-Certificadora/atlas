(() => {
  "use strict";

  window.ATLAS_AICS_DATA = Object.freeze({
    downloads: [
      {
        id: "iti-repositorio",
        titulo: "Repositório oficial ICP-Brasil",
        descricao: "Certificados, políticas e cadeias oficiais mantidos pelo Instituto Nacional de Tecnologia da Informação.",
        categoria: "seguranca",
        tags: ["ICP-Brasil", "cadeias", "ITI", "certificados"],
        origem: "Instituto Nacional de Tecnologia da Informação",
        url: "https://www.gov.br/iti/pt-br/assuntos/repositorio"
      },
      {
        id: "iti-cadeias",
        titulo: "Cadeias da ICP-Brasil",
        descricao: "Acesso às cadeias das Autoridades Certificadoras credenciadas na ICP-Brasil.",
        categoria: "seguranca",
        tags: ["cadeias", "autoridade certificadora", "ITI"],
        origem: "Instituto Nacional de Tecnologia da Informação",
        url: "https://www.gov.br/iti/pt-br/assuntos/repositorio/cadeias-da-icp-brasil"
      },
      {
        id: "certisign-downloads",
        titulo: "Drivers e aplicativos Certisign",
        descricao: "Página oficial para localizar drivers, softwares e aplicativos de certificados A3.",
        categoria: "drivers",
        tags: ["A3", "driver", "token", "cartão", "Certisign"],
        origem: "Certisign",
        url: "https://certisign.com.br/suporte/download"
      },
      {
        id: "certisign-a3",
        titulo: "Instalação de certificado A3",
        descricao: "Orientações oficiais para instalação de certificado A3 em cartão ou token.",
        categoria: "instalacao",
        tags: ["A3", "instalação", "token", "cartão"],
        origem: "Certisign",
        url: "https://certisign.com.br/suporte/instalacao-e-emissao/certificado-a3-token-cartao/como-instalar"
      },
      {
        id: "soluti-a3",
        titulo: "Suporte oficial para certificado A3",
        descricao: "Seleção de mídia, sistema operacional, drivers e manuais para certificados A3.",
        categoria: "drivers",
        tags: ["A3", "driver", "token", "smartcard", "Soluti"],
        origem: "Soluti",
        url: "https://soluti.com.br/duvidas-e-suporte/suporte-certificado-a3/"
      },
      {
        id: "soluti-manual",
        titulo: "Manual de instalação do driver A3",
        descricao: "Guia oficial para identificar a mídia e instalar o driver adequado.",
        categoria: "instalacao",
        tags: ["manual", "driver", "A3", "Windows", "macOS", "Linux"],
        origem: "Soluti",
        url: "https://manuais.soluti.com.br/certificado-a3/instalacao-do-driver"
      },
      {
        id: "suporte-remoto",
        titulo: "Suporte remoto Pedroza Certificadora",
        descricao: "Solicite orientação humana para instalação e uso do certificado digital.",
        categoria: "suporte",
        tags: ["suporte", "remoto", "instalação", "ajuda"],
        origem: "Pedroza Certificadora",
        url: "https://wa.me/5521991674117?text=Olá!%20Preciso%20de%20suporte%20remoto%20com%20meu%20certificado%20digital."
      }
    ],
    conteudos: [
      { id: "faq", titulo: "Perguntas frequentes", descricao: "Respostas sobre emissão, renovação, instalação, A1, A3 e videoconferência.", categoria: "faq", tags: ["dúvidas", "FAQ", "emissão", "renovação"], url: "../#perguntas-frequentes" },
      { id: "links", titulo: "Links úteis", descricao: "Acessos oficiais ao e-CAC, DET, eSocial, Conectividade Social e Gov.br.", categoria: "links", tags: ["e-CAC", "DET", "eSocial", "Gov.br"], url: "../#links-uteis" },
      { id: "blog-a1-a3", titulo: "Certificado A1 ou A3?", descricao: "Entenda as diferenças e escolha a modalidade adequada.", categoria: "blog", tags: ["A1", "A3", "comparação"], url: "../blog/a1-ou-a3.html" },
      { id: "blog-cuidados-a1", titulo: "Cuidados com o certificado A1", descricao: "Boas práticas para guardar, instalar e proteger o arquivo do certificado.", categoria: "blog", tags: ["A1", "backup", "senha", "segurança"], url: "../blog/cuidados-certificado-a1.html" },
      { id: "blog-video", titulo: "Emissão por videoconferência", descricao: "Veja como funciona a validação e a emissão online.", categoria: "blog", tags: ["videoconferência", "emissão", "online"], url: "../blog/emissao-videoconferencia.html" },
      { id: "documentos", titulo: "Documentos necessários", descricao: "Confira os documentos exigidos conforme o tipo de certificado.", categoria: "orientacao", tags: ["documentos", "CPF", "CNPJ", "emissão"], url: "../#documentos" }
    ],
    timeline: [
      { titulo: "Solicitação", descricao: "O cliente informa o certificado desejado e recebe as primeiras orientações." },
      { titulo: "Envio de documentos", descricao: "Os documentos necessários são encaminhados para conferência." },
      { titulo: "Validação", descricao: "A documentação e os dados são verificados conforme as regras aplicáveis." },
      { titulo: "Videoconferência", descricao: "Quando aplicável, é realizada a validação por vídeo com o titular." },
      { titulo: "Emissão", descricao: "O certificado é emitido após a conclusão das validações." },
      { titulo: "Instalação", descricao: "O cliente recebe orientação para instalar ou utilizar o certificado." },
      { titulo: "Conclusão", descricao: "O processo é finalizado e o certificado fica pronto para uso." }
    ]
  });
})();
