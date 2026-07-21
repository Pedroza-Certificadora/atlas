# Atlas Sprint 4.6 — AASS v1.0 — Persistência 4.6.10

## Correção

A camada local de autenticação passou a utilizar migração não destrutiva e separação entre contas de fábrica e dados criados pelo usuário.

## Garantias

- Senhas alteradas não são substituídas pelas senhas padrão em novas publicações.
- Usuários criados não são apagados quando uma nova versão do portal é publicada.
- Novos campos de versões futuras são incorporados sem recriar as contas existentes.
- Chaves legadas conhecidas são migradas automaticamente.
- Preferências e demais dados locais permanecem separados do código publicado.

## Limitação da Sprint 4.6

Os dados continuam armazenados no navegador. Eles são preservados somente no mesmo navegador, perfil e domínio. A persistência centralizada entre computadores e dispositivos será implementada na Sprint 4.7 com API e Google Sheets.
