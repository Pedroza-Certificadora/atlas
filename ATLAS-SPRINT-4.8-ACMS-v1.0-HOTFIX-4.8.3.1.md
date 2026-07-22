# Projeto Atlas — Sprint 4.8.3.1

## Hotfix — Code.gs limpo e consolidado

A versão 4.8.3.1 corrige a concatenação acidental das versões 4.8.2 e 4.8.3 no Apps Script.

### Correções aplicadas

- arquivo `Code.gs` reconstruído a partir da versão 4.8.3 íntegra;
- apenas uma declaração de `ATLAS_VERSION`;
- apenas uma função `onOpen()`;
- apenas uma função `doGet()` e uma `doPost()`;
- remoção de todas as funções duplicadas;
- menu Atlas CRM atualizado para 4.8.3.1;
- validação, simulação, importação, backup e restauração preservados;
- abas operacionais protegidas: `USUARIOS`, `PERMISSOES`, `AUDITORIA`, `CONFIGURACOES` e `LOGS`;
- ABIS atualizado para 4.8.3.1.

### Fluxo após a publicação

1. Substituir integralmente o conteúdo do Apps Script pelo novo `Code.gs`.
2. Salvar e executar `doGet`.
3. Atualizar a implantação do Web App com nova versão.
4. Atualizar a planilha oficial com `Ctrl + F5`.
5. Confirmar o menu `Atlas CRM > Configurar estrutura 4.8.3.1`.
6. Executar somente `Simular importacao sem gravar` usando a base já validada.
7. Conferir a aba `IMPORTACAO_CRM` antes de importar.
