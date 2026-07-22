# Atlas — Sprint 4.9.13 — AEVS Consulta Segura Hotfix

## Objetivo
Eliminar a permanência visual de dados de uma consulta anterior na Área do Cliente e tornar cada pesquisa isolada, validada e resistente a respostas atrasadas ou incompletas.

## Correções
- Limpeza integral dos dados antes de cada consulta.
- Ocultação garantida por CSS para elementos com `hidden`.
- Cancelamento da requisição anterior quando uma nova consulta é iniciada.
- Identificador sequencial para impedir que respostas antigas sobrescrevam a consulta atual.
- Cache desativado no navegador e parâmetro único por requisição.
- Resultado considerado localizado somente quando houver sinal explícito ou campos reais de certificado.
- Respostas genéricas/incompletas do serviço não são mais exibidas como certificado encontrado.
- Botão “Fazer nova consulta” limpa integralmente o estado anterior.
- Ajustes visuais e operacionais da 4.9.12 preservados.

## Arquitetura preservada
Nenhuma alteração na Atlas API, estrutura do Google Sheets, login, auditoria, backup, IDs públicos ou Apps Script.

## Versão
4.9.13 — Pré-homologação.
