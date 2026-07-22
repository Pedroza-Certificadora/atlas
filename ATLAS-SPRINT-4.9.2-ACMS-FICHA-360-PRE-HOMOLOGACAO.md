# Projeto Atlas — Sprint 4.9.2 — Ficha 360º do Cliente

## Entrega para pré-homologação

A Central de Clientes passa a abrir uma Ficha 360º em painel lateral, sem perder a pesquisa, filtros ou paginação da grade.

## Implementado

- abertura da ficha por clique, Enter ou barra de espaço na linha;
- carregamento individual por `clients.get` da Atlas API;
- abas Geral, Certificados, Timeline, Comunicação, Agenda, Observações e Auditoria;
- dados cadastrais completos disponíveis na API;
- certificados com emissão, validade, série, situação e dias restantes;
- timeline em ordem retornada pela API;
- comunicações vinculadas ao cliente;
- ações rápidas de WhatsApp, e-mail e cópia do documento;
- fechamento por botão, clique externo ou tecla Escape;
- foco acessível e responsividade;
- auditoria de visualização `CRM_CLIENT_360_VIEW`;
- ABIS atualizado para 4.9.2.

## Limites preservados

A API pública, o Google Sheets, os IDs, relacionamentos, autenticação, importador, fingerprint, auditoria estrutural e backup não foram alterados.

A API homologada ainda não expõe agenda por cliente nem consulta direta da tabela de auditoria por cliente. Essas abas informam claramente essa indisponibilidade e não acessam planilhas diretamente.

## Homologação

1. Abrir `agr/clientes.html`.
2. Clicar em diferentes clientes.
3. Validar dados gerais e ações rápidas.
4. Validar certificados e dias restantes.
5. Validar timeline e comunicação.
6. Testar Escape, clique no fundo e botão fechar.
7. Testar desktop, tablet e celular.
8. Confirmar zero erros no console e na API.
