# Atlas — Pedroza Certificadora

Portal público de certificação digital da Pedroza Certificadora.

## Versão atual

Sprint 3.9.1 — Correção, confiança e mensuração.

Principais entregas:

- remoção de backups e documentos internos da publicação;
- imagens responsivas e otimizadas;
- canonical, sitemap, robots, favicon e metadados sociais;
- dados estruturados da organização;
- três artigos com URLs próprias;
- acessibilidade aprimorada no Atlas Chat;
- rascunho do pré-atendimento somente após autorização, com expiração em 24 horas;
- camada de eventos preparada para integração com analytics;
- cartão social próprio para compartilhamento do portal.

## Estrutura

- `index.html`: portal principal;
- `blog/`: conteúdos editoriais;
- `css/`: identidade, layout, movimento e artigos;
- `js/`: pré-atendimento, navegação, eventos e movimento;
- `images/`: imagens responsivas, marcas e cartão social;
- `politica-de-privacidade.html`: transparência do pré-atendimento;
- `robots.txt` e `sitemap.xml`: descoberta por mecanismos de busca.

## Publicação

O portal é estático e compatível com GitHub Pages. Recursos autenticados, consultas pessoais e documentos não devem ser implementados nesta camada pública; eles pertencem à futura aplicação operacional segura.
