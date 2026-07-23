# Sprint 4.9.17 — Área do Cliente Pública Route Hotfix

## Objetivo
Remover definitivamente o redirecionamento para login da rota pública `/cliente/`, preservando a proteção integral da Central AGR e das páginas administrativas.

## Correções
- retirada dos scripts de autenticação da página pública da Área do Cliente;
- exceção explícita da rota `/cliente/` no guarda de autenticação;
- proteção contra HTML antigo armazenado em cache;
- cache-busting e ABIS uniformizados em 4.9.17;
- consulta mascarada e envio seguro por e-mail preservados;
- nenhuma alteração no Apps Script ou na Atlas Data Foundation.

## Homologação
1. abrir uma janela anônima;
2. acessar `https://pedrozacertificadora.com.br/cliente/`;
3. confirmar que a tela de consulta abre sem login;
4. acessar `https://pedrozacertificadora.com.br/agr/`;
5. confirmar que a Central AGR continua exigindo autenticação.
