# Sprint 5.0.7.4.4 — Restauração Visual da Central de Clientes

## Diagnóstico

A tela afetada era `agr/clientes.html`, não o Cockpit em `agr/index.html`.
O hotfix anterior atualizou a referência de cache do arquivo incorreto.

## Correção

- preservação integral da Central de Clientes homologada;
- preservação do acesso Comunicação nos menus;
- renovação das referências de cache de `agr.css`, `crm-clientes.css`,
  `atlas-core.css` e `crm-enterprise.css`;
- atualização do ABIS para a versão 5.0.7.4.4;
- nenhuma alteração no Apps Script, no motor de e-mails ou no Web App.

## Homologação

Validar no desktop:

1. cards e ícones da Central de Clientes;
2. pesquisa inteligente;
3. filtros;
4. listagem de clientes;
5. menu Comunicação.

Validar no celular:

1. menu Comunicação;
2. responsividade da Central de Clientes;
3. identificação 5.0.7.4.4.
