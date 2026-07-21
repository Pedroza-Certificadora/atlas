# Projeto Atlas — Pedroza Certificadora

Iniciando oficialmente a **Sprint 4.5 — AICS v1.0 (Atlas Intelligent Customer System)**.

A Sprint 4.4 — AIMS v1.0 foi homologada, publicada, documentada e oficialmente encerrada na versão 4.4.0.

Toda a identidade visual do portal permanece congelada.

Não alterar, sem autorização expressa:

- Cabeçalho;
- Hero;
- Rodapé;
- Logos;
- Cores institucionais;
- Tipografia;
- Proporções;
- Espaçamentos;
- Responsividade;
- Sistema de animações;
- Central AGR;
- Layout homologado da Área do Cliente.

## Objetivo desta Sprint

Concluir a evolução da Área do Cliente, transformando-a em um ambiente de autoatendimento inteligente, organizado e preparado para futura integração com autenticação, banco de dados, agenda, cadastro de clientes e IA Atlas.

A Sprint 4.5 permanece voltada à experiência pública do cliente.

Não implementar nesta Sprint:

- Login da Central AGR;
- Cadastro real de clientes;
- Armazenamento de CPF ou CNPJ no navegador;
- Agenda operacional;
- Banco de dados;
- Sincronização com Google Sheets;
- Inteligência artificial.

Esses recursos pertencem às Sprints 4.6 a 5.0.

## Prioridade 1 — Histórico local de consultas

Criar um histórico local e seguro contendo apenas informações mínimas das últimas consultas realizadas no dispositivo.

Requisitos:

- Não armazenar CPF ou CNPJ completo;
- Utilizar documento mascarado ou hash local;
- Registrar data e horário;
- Registrar tipo e situação do certificado;
- Permitir repetir uma consulta sem exibir o documento integral;
- Permitir limpar o histórico;
- Limitar a quantidade de registros;
- Persistência via LocalStorage.

## Prioridade 2 — Consultas favoritas

Permitir que o cliente marque consultas como favoritas no próprio dispositivo.

Requisitos:

- Utilizar somente dados mascarados;
- Acesso rápido;
- Remoção individual;
- Limpeza completa;
- Persistência local;
- Aviso de que o recurso funciona apenas naquele navegador.

## Prioridade 3 — Linha do tempo do certificado

Criar uma linha do tempo informativa com as etapas:

- Solicitação;
- Envio de documentos;
- Validação;
- Videoconferência;
- Emissão;
- Instalação;
- Conclusão.

Nesta Sprint, a linha do tempo será apenas educativa e demonstrativa.

Ela deverá ser preparada para receber dados reais no futuro, sem simular que existe acompanhamento individual quando ele ainda não estiver integrado.

## Prioridade 4 — Central de Downloads

Criar uma central organizada para materiais oficiais e suporte, incluindo:

- Drivers de certificados A3;
- Aplicativos oficiais;
- Cadeias ICP-Brasil;
- Manuais;
- Orientações de instalação;
- Acesso a suporte remoto;
- Links oficiais dos fabricantes e autoridades.

Requisitos:

- Não hospedar executáveis desconhecidos;
- Priorizar links oficiais;
- Informar claramente o destino;
- Permitir pesquisa e filtros;
- Abrir links externos com segurança.

## Prioridade 5 — Central de Suporte

Organizar os canais de atendimento:

- WhatsApp;
- E-mail;
- Perguntas Frequentes;
- Blog;
- Links Úteis;
- Orientações de instalação;
- Renovação;
- Emissão.

Criar ações rápidas conforme a situação exibida na consulta.

## Prioridade 6 — Pesquisa inteligente do cliente

Criar pesquisa unificada dentro da Área do Cliente para localizar:

- Perguntas Frequentes;
- Downloads;
- Links Úteis;
- Artigos do Blog;
- Orientações;
- Canais de suporte.

A pesquisa deve ser rápida, acessível e funcionar sem dependências externas desnecessárias.

## Prioridade 7 — Organização premium

Organizar o conteúdo em grupos claros:

- Meu certificado;
- Consultas;
- Downloads;
- Instalação;
- Renovação;
- Suporte;
- Segurança.

Permitir expansão e recolhimento quando fizer sentido, preservando o layout homologado.

## Prioridade 8 — Privacidade e LGPD

Garantir que:

- Nenhum documento completo seja salvo no LocalStorage;
- Dados de consulta continuem mascarados;
- O histórico possa ser apagado pelo usuário;
- As mensagens expliquem que os dados locais pertencem ao navegador utilizado;
- Nenhum dado interno da Central AGR seja exposto;
- Não exista falsa impressão de área autenticada.

## Prioridade 9 — UX Premium

Melhorar:

- Navegação;
- Clareza;
- Organização;
- Velocidade;
- Acessibilidade;
- Feedback das ações;
- Experiência no celular.

Sem alterar a identidade visual homologada.

## Prioridade 10 — Preparação técnica futura

Estruturar a Área do Cliente para futura integração com:

- Autenticação opcional de clientes;
- Cadastro de clientes;
- Certificados vinculados;
- Agenda;
- Notificações;
- Google Sheets;
- Google Apps Script;
- IA Atlas.

Nenhuma dessas integrações deverá ser ativada nesta Sprint.

## Arquitetura recomendada

Manter JavaScript modular.

Sugestão de estrutura:

```text
js/cliente/cliente.js
js/cliente/aics-data.js
js/cliente/aics.js
```

O módulo existente de consulta deve continuar responsável apenas pela consulta AEVS.

O módulo AICS deve cuidar de:

- Histórico;
- Favoritos;
- Downloads;
- Pesquisa;
- Linha do tempo;
- Suporte;
- Preferências locais.

## Performance

Manter:

- JavaScript modular;
- CSS organizado;
- Carregamento rápido;
- Compatibilidade com navegadores modernos;
- Progressive enhancement;
- LocalStorage somente para dados não sensíveis;
- Nenhuma dependência externa desnecessária.

## Critérios de homologação

A Sprint somente poderá ser encerrada quando:

- A consulta AEVS continuar funcionando;
- O histórico não armazenar documentos completos;
- Favoritos persistirem corretamente;
- A limpeza de dados locais funcionar;
- A pesquisa localizar conteúdos da Área do Cliente;
- Downloads apontarem para fontes confiáveis;
- A linha do tempo não induzir o cliente a acreditar em acompanhamento inexistente;
- WhatsApp e suporte funcionarem;
- Desktop, tablet e celular forem validados;
- Não houver regressões na Central AGR;
- Não houver alteração na identidade visual congelada;
- Não houver erros de JavaScript;
- O desempenho continuar adequado.

## Roadmap confirmado após a Sprint 4.5

### Sprint 4.6 — AASS v1.0

Autenticação e Segurança:

- Login;
- Usuários;
- Senhas seguras;
- Sessões;
- Perfis;
- Permissões;
- Auditoria;
- Logout;
- Proteção real da Central AGR.

### Sprint 4.7 — ADF v1.0

Atlas Data Foundation:

- Revisão da planilha CONTROLE DE CERTIFICADOS DIGITAIS;
- Padronização das colunas;
- Conversão para Google Sheets;
- Estrutura das abas;
- IDs únicos;
- Google Apps Script;
- API;
- Migração dos dados existentes;
- Integração com o Atlas.

### Sprint 4.8 — ACMS v1.0

Gestão de Clientes e Certificados:

- Cadastro de clientes;
- Certificados;
- Vencimentos;
- Renovações;
- Histórico;
- Pesquisa;
- Ficha do cliente;
- Integração com WhatsApp.

### Sprint 4.9 — AOMS v1.0

Gestão Operacional:

- Agenda;
- Agendamentos do site;
- Videoconferências;
- Distribuição por AGR;
- Status;
- Pendências;
- Indicadores;
- Produtividade.

### Sprint 5.0 — Atlas Intelligence

- Assistente inteligente;
- Recomendações contextuais;
- Automações;
- Consulta em linguagem natural;
- Apoio às renovações;
- Apoio à agenda;
- Inteligência operacional.

## Regras permanentes do Projeto

- 1 Chat = 1 Sprint;
- 1 Sprint = 1 Versão;
- Sempre gerar arquivos completos;
- Nunca utilizar remendos;
- Sempre criar backup antes das alterações;
- Sempre validar desktop, tablet e celular;
- Sempre preservar a identidade visual homologada;
- Sempre manter compatibilidade com versões anteriores;
- Sempre gerar Documento Oficial de Fechamento;
- Sempre fornecer comando único contendo backup, validação, publicação, git add, git commit e git push.

## Arquivo inicial da Sprint

No novo chat, enviar o ZIP mais recente e publicado do Projeto Atlas.

Título oficial do próximo chat:

# Sprint 4.5 — AICS v1.0
