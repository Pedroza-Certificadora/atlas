# Projeto Atlas — Sprint 4.8.2 — Importador Inteligente CRM

## Objetivo
Importar a Base Oficial de Produção do Atlas CRM para o Google Sheets com validação prévia, backup automático, upsert por ID, auditoria e relatório operacional.

## Entregas
- Atlas API atualizada para 4.8.2.
- Menu `Atlas CRM` no Google Sheets.
- Validação de abas, cabeçalhos, IDs duplicados e vínculos de clientes.
- Backup automático da planilha oficial antes da importação.
- Importação não destrutiva por ID.
- Relatório `IMPORTACAO_CRM`.
- Logs e auditoria da operação.

## Base homologada
Arquivo: `Atlas-CRM-4.8.2-BASE-OFICIAL-PRODUCAO.xlsx`

- 453 clientes preservados.
- 146 certificados preservados.
- 0 certificados órfãos.
- 453 preferências de comunicação.
- 104 cadastros realmente vazios removidos.

## Procedimento
1. Enviar o XLSX ao Google Drive.
2. Abrir como Planilhas Google.
3. Copiar o ID da planilha convertida.
4. Atualizar `apps-script/Code.gs` na planilha oficial do Atlas.
5. Executar `configurarAtlasDataFoundation()`.
6. Reabrir a planilha.
7. Menu `Atlas CRM` → `Validar base para importação`.
8. Após aprovação, `Atlas CRM` → `Importar base validada`.
9. Conferir a aba `IMPORTACAO_CRM`.
10. Publicar nova implantação do Web App.
