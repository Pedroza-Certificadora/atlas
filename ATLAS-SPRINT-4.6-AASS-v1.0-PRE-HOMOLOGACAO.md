# Projeto Atlas — Pedroza Certificadora

## Sprint 4.6 — AASS v1.0

### Status

Versão técnica preparada para homologação, ainda não encerrada.

### Implementado

- Tela de login responsiva;
- Logout seguro;
- Estrutura de recuperação de acesso;
- Sessão com timeout de 30 minutos por inatividade;
- Expiração absoluta após 8 horas;
- Aviso 2 minutos antes do timeout;
- Bloqueio temporário após 5 tentativas inválidas;
- Perfis simulados ADMIN, AGR e CLIENTE;
- Permissões independentes por perfil;
- Proteção da rota `/agr/`;
- Redirecionamento para o login em acesso direto;
- Registro local de login, logout, falhas e acessos protegidos;
- Hash SHA-256 para senhas simuladas;
- Camada modular e desacoplada de AEVS/AICS;
- Estrutura pronta para troca do provedor simulado pela API da Sprint 4.7.

### Credenciais de homologação

#### Administrador

- Usuário: `admin`
- Senha: `Atlas@460`
- Permissão para Central AGR: sim

#### AGR

- Usuário: `agr`
- Senha: `Agr@460`
- Permissão para Central AGR: sim

#### Cliente

- Usuário: `cliente`
- Senha: `Cliente@460`
- Permissão para Central AGR: não

### Roteiro de homologação

1. Abrir `/agr/` sem login e confirmar o redirecionamento automático.
2. Entrar como `agr` e confirmar a abertura da Central AGR.
3. Atualizar a página e confirmar que a sessão permanece ativa.
4. Clicar em `Sair` e confirmar o encerramento.
5. Tentar entrar com senha incorreta e confirmar a mensagem amigável.
6. Entrar como `cliente` e confirmar que a Central AGR permanece bloqueada.
7. Validar a tela em desktop, tablet e celular.
8. Confirmar que a Área do Cliente continua pública e funcional.
9. Abrir o console do navegador e confirmar ausência de erros JavaScript.

### Observação técnica obrigatória

Nesta Sprint a autenticação é uma simulação arquitetural executada no navegador, conforme o escopo sem API e sem banco de dados. Ela bloqueia a navegação normal e organiza sessões, perfis e auditoria, mas não equivale à segurança de servidor. A proteção definitiva das credenciais e dos dados será implementada com a API na Sprint 4.7.
