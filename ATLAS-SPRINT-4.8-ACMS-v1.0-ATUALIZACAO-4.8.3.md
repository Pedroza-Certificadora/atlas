# Projeto Atlas — Sprint 4.8.3

## Importador CRM Homologado

A versão 4.8.3 reforça a segurança da migração da base CRM.

### Garantias

- validação estrutural antes da importação;
- simulação obrigatória sem gravação;
- preservação de USUARIOS, senhas, PERMISSOES, AUDITORIA, CONFIGURACOES e LOGS;
- importação apenas das abas funcionais do CRM;
- backup automático da planilha oficial;
- processamento em lote por aba;
- relatório completo na aba IMPORTACAO_CRM;
- restauração manual pelo ID do backup;
- bloqueio de importação sem simulação correspondente.

### Fluxo de homologação

1. Atualizar o Apps Script com o Code.gs 4.8.3.
2. Atualizar a implantação do Web App.
3. Abrir a planilha oficial e atualizar a página.
4. Atlas CRM > Validar base para importação.
5. Atlas CRM > Simular importação (sem gravar).
6. Conferir a aba IMPORTACAO_CRM.
7. Atlas CRM > Importar base homologada.
8. Conferir CLIENTES, CERTIFICADOS, PREFERENCIAS_COMUNICACAO, LOGS e AUDITORIA.
