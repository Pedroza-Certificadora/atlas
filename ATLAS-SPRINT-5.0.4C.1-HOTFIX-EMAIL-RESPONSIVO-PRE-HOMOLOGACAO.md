# Atlas — Sprint 5.0.4C.1
## Hotfix Email Responsivo e Personalização

### Correções
- assunto agora substitui `{{NOME}}` e demais variáveis antes do envio manual;
- logotipo usa o ativo público oficial já existente em `/images/email/`;
- template de boas-vindas e convite ao Portal reconstruído em 720 px no desktop;
- centralização, tipografia e aproveitamento horizontal aprimorados;
- layout móvel empilhado, com botões maiores e margens reduzidas;
- cores explícitas e metadados de modo claro para reduzir inversões do Gmail;
- prévia e envio continuam usando o mesmo HTML armazenado em `MODELOS_EMAIL`;
- assinatura institucional: **Equipe Pedroza Certificadora**.

### Homologação
1. Executar `configurarAtlasDataFoundation()`.
2. Criar nova versão da implantação do Apps Script, mantendo a URL.
3. Enviar Boas-vindas e Convite ao Portal para teste.
4. Conferir Gmail no computador e no celular.
5. Confirmar que o assunto contém o nome real e que a logomarca carrega.

**Status:** pré-homologação.
