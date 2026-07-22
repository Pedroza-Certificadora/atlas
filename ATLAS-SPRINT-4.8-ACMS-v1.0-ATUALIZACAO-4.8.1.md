# Projeto Atlas — Sprint 4.8 ACMS v1.0 — Atualização 4.8.1

## ACMS Data Foundation

Versão técnica: **4.8.1**  
Data: **22/07/2026**

### Entregas
- Migração não destrutiva da Atlas Data Foundation.
- Novas estruturas de CRM, Timeline, Comunicação, Campanhas, Convites, Segmentação e preparação para IA.
- Compatibilidade preservada com usuários, clientes, certificados, auditoria, logs e configurações existentes.
- ABIS sincronizado com Sprint 4.8 / ACMS / v4.8.1.
- Identificação institucional permanente: Pedroza Certificadora — CNPJ 57.938.005/0001-87.
- Rotas iniciais da API para ficha do cliente, timeline, comunicação, campanhas, convites, setores e tags.

### Procedimento no Apps Script
1. Substituir integralmente o conteúdo de `apps-script/Code.gs`.
2. Salvar.
3. Executar `configurarAtlasDataFoundation()`.
4. Autorizar, se solicitado.
5. Criar nova implantação do Web App preservando execução como proprietário e acesso público.
6. Confirmar `health` retornando a versão `4.8.1`.

### Critério de homologação
A versão somente poderá ser encerrada após validar login, usuários, clientes, dashboard, auditoria, novas abas e ABIS.
