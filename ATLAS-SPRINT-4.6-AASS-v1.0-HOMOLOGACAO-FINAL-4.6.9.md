# Projeto Atlas — Sprint 4.6 — AASS v1.0

## Candidato final de homologação — versão 4.6.9

A versão 4.6.9 consolida integralmente a camada de autenticação, segurança e controle de acesso do Portal Atlas.

## Componentes consolidados

- Login e logout seguros.
- Sessão com timeout, expiração e aviso ao usuário.
- Bloqueio temporário após tentativas inválidas.
- Perfis FULL, AGR e Cliente.
- Matriz visual de permissões administrada pelo perfil FULL.
- Cadastro local de usuários e vinculação de CPF/CNPJ para clientes.
- Central AGR protegida contra acesso direto.
- Área do Cliente restrita ao perfil autorizado.
- Minha Conta com edição de dados, preferências e troca de senha.
- Auditoria local de eventos de autenticação e administração.
- Dashboard administrativo responsivo para FULL e AGR.
- Cabeçalho, logotipos e responsividade alinhados ao padrão visual homologado.
- Arquitetura desacoplada dos módulos AEVS/AICS e preparada para API na Sprint 4.7.

## Limite técnico desta Sprint

Nesta versão, usuários, sessões, permissões e auditoria são persistidos no navegador. A proteção definitiva no servidor e a sincronização entre dispositivos serão implantadas na Sprint 4.7 com Google Apps Script/API e Google Sheets.

## Roteiro de homologação

1. Entrar com o perfil FULL e confirmar o Dashboard.
2. Abrir Configurações e alterar uma permissão do perfil AGR.
3. Abrir Minha Conta e testar a troca de senha.
4. Criar um usuário Cliente e confirmar que ele não acessa a Central AGR.
5. Criar ou usar um usuário AGR e confirmar que Configurações permanece bloqueada.
6. Testar logout e tentativa de acesso direto a `/agr/`.
7. Validar Desktop, Tablet e Celular.
8. Confirmar ausência de erros no Console do navegador.

Após aprovação visual e funcional, esta versão poderá ser documentada como fechamento oficial da Sprint 4.6.
