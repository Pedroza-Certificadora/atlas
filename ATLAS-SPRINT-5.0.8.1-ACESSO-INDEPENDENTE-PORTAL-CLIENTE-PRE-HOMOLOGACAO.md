# Atlas — Sprint 5.0.8.1

## Acesso independente ao Portal do Cliente

Status: pré-homologação

### Entrega

- bloco de login acima da consulta pública;
- autenticação real por e-mail e senha;
- redirecionamento para `/cliente/portal/`;
- atalhos para ativação e redefinição assistida;
- endpoint da consulta pública alinhado ao Web App atual;
- login e consulta com formulários e JavaScript independentes;
- preservação integral da Área AGR, automação de e-mails, gatilhos e Apps Script.

### Arquivos alterados

- `cliente/index.html`
- `css/cliente.css`
- `js/cliente/cliente-access.js`

### Homologação

Validar no desktop e no celular:

1. aparência do bloco Acessar meu Portal;
2. login inválido sem travar a consulta;
3. consulta pública por CPF/CNPJ;
4. login válido e redirecionamento ao Portal;
5. links Ativar meu acesso e Esqueci minha senha.
