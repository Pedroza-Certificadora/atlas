/* Pedroza Certificadora — AIMS v1.0 — Sprint 4.4 */
window.ATLAS_AIMS_DATA = {
  checklists: [
    { id: "ecpf-a1", title: "e-CPF A1", steps: ["Confirmar identidade e dados do titular", "Conferir documento oficial com foto", "Conferir CPF e situação cadastral", "Validar endereço e contatos", "Realizar videoconferência e validações", "Emitir o certificado A1", "Orientar instalação e cópia de segurança", "Confirmar entrega e encerrar atendimento"] },
    { id: "ecpf-a3", title: "e-CPF A3", steps: ["Confirmar identidade e dados do titular", "Conferir documento oficial com foto", "Conferir CPF e situação cadastral", "Validar mídia criptográfica compatível", "Realizar videoconferência e validações", "Emitir o certificado A3", "Orientar uso da mídia e senha pessoal", "Confirmar entrega e encerrar atendimento"] },
    { id: "ecnpj-a1", title: "e-CNPJ A1", steps: ["Consultar CNPJ e situação cadastral", "Conferir ato constitutivo atualizado", "Confirmar representante legal", "Conferir documento e CPF do responsável", "Validar poderes de representação", "Realizar videoconferência e validações", "Emitir e instalar o certificado A1", "Confirmar entrega e encerrar atendimento"] },
    { id: "ecnpj-a3", title: "e-CNPJ A3", steps: ["Consultar CNPJ e situação cadastral", "Conferir ato constitutivo atualizado", "Confirmar representante legal", "Conferir documento e CPF do responsável", "Validar poderes de representação", "Validar mídia criptográfica compatível", "Emitir o certificado A3", "Confirmar entrega e encerrar atendimento"] }
  ],
  messages: [
    { category: "Documentos", title: "Solicitação de documentos — e-CPF", text: "Olá! Para darmos continuidade à emissão do seu e-CPF, por favor, envie um documento oficial com foto em bom estado e confirme seus dados de contato. Assim que recebermos, faremos a conferência e orientaremos a próxima etapa." },
    { category: "Documentos", title: "Solicitação de documentos — e-CNPJ", text: "Olá! Para a emissão do e-CNPJ, precisamos do ato constitutivo atualizado da empresa e do documento oficial com foto do representante legal. Após a conferência, retornaremos com as orientações para a validação." },
    { category: "Agendamento", title: "Confirmação de agendamento", text: "Olá! Seu atendimento para emissão do certificado digital está confirmado. Pedimos que esteja com seu documento original em mãos, em local iluminado e com conexão estável. Em caso de imprevisto, avise-nos com antecedência." },
    { category: "Videoconferência", title: "Orientações para videoconferência", text: "Para a videoconferência, utilize um celular ou computador com câmera e microfone, permaneça em local silencioso e bem iluminado e tenha seu documento original em mãos. Não utilize filtros de imagem e mantenha o rosto totalmente visível." },
    { category: "Emissão", title: "Certificado disponível", text: "Olá! Seu certificado digital foi emitido com sucesso. Siga as orientações enviadas para instalação e guarde a senha e a cópia de segurança em local seguro. Nunca compartilhe sua senha com terceiros." },
    { category: "Renovação", title: "Aviso de renovação", text: "Olá! Identificamos que seu certificado digital está próximo do vencimento. Recomendamos iniciar a renovação com antecedência para evitar interrupções em acessos, assinaturas e obrigações digitais. Estamos à disposição para organizar o atendimento." },
    { category: "Suporte", title: "Suporte após emissão", text: "Olá! Para auxiliarmos no suporte, informe em qual equipamento o certificado está instalado, qual sistema ou portal está sendo acessado e envie uma captura da mensagem de erro, sem expor senhas, códigos ou dados sensíveis." }
  ],
  quickActions: [
    { label: "Emissão A1", key: "portal-de-emissao-a1" },
    { label: "Emissão A3", key: "portal-de-emissao-a3" },
    { label: "Gestão Online", key: "ar-online-id-gestao-online" },
    { label: "Consulta CPF", key: "consulta-cpf" },
    { label: "Consulta CNPJ", key: "consulta-cnpj" },
    { label: "REDESIM", key: "consulta-redesim" }
  ]
};
