# Atlas Sprint 4.9.14 — Dashboard Icons + AEVS CORS Hotfix

## Objetivo
Corrigir o alinhamento visual dos ícones do Dashboard e restaurar a comunicação da Área do Cliente com o Web App AEVS.

## Correções
- Substituição dos caracteres tipográficos dos KPIs por SVGs vetoriais.
- Alinhamento e escala idênticos aos cards da Central de Clientes.
- Remoção do cabeçalho HTTP personalizado `Cache-Control`, que provocava requisição preflight CORS no Google Apps Script.
- Preservação de `cache: no-store` e parâmetro único por consulta.
- Mensagem de falha de comunicação mais precisa.
- Versão uniformizada em 4.9.14.

## Arquitetura preservada
Nenhuma alteração no Apps Script, Atlas API, Google Sheets, banco, login, auditoria ou IDs públicos.

## Homologação
1. Conferir alinhamento dos oito ícones no Dashboard.
2. Consultar CPF/CNPJ encontrado.
3. Consultar CPF/CNPJ não encontrado.
4. Alternar consultas e confirmar que não há reaproveitamento de dados.
