# Atlas — Hotfix 5.0.10.1

Data: 28 de julho de 2026.

## Correções aplicadas

- proteção autenticada da Central de Comunicação;
- limpeza de cache operacional e usuários no logout;
- sessão não persistente movida para `sessionStorage`;
- remoção de contas e hashes distribuídos no JavaScript público;
- desativação do login local de contingência;
- correção dos eventos duplicados da automação;
- autorização por perfil e por titular da conta no Apps Script arquivado;
- limitação de tentativas de login no servidor;
- migração compatível de hashes legados para HMAC com pepper;
- bloqueio de auditoria anônima;
- canonical, Open Graph e dados estruturados alinhados ao domínio oficial;
- exclusão de documentos internos e `apps-script` da publicação Jekyll.

## Dependência antes da publicação

O código-fonte completo do Web App 5.0.7 não está no pacote e não foi localizado no Google Drive conectado. O `Code.gs` 4.8.2 corrigido não deve substituir o Web App diretamente, pois não contém todas as ações atualmente utilizadas pelo front-end.

É necessário exportar o Apps Script implantado, mesclar os controles de segurança descritos em `apps-script/README.md` e só então gerar uma nova implantação.
