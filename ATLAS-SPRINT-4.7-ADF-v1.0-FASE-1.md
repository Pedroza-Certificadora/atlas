# Projeto Atlas - Sprint 4.7 - ADF v1.0

## Entrega tecnica 4.7.1 - Fundacao da Atlas API

Esta entrega preserva integralmente o layout homologado da versao 4.6.10 e adiciona a primeira camada real de dados.

## Implementado

- Cliente unico `js/api/atlas-api.js`.
- Endpoint central configuravel em `js/auth/config.js`.
- Login preparado para autenticacao pelo Google Apps Script.
- Sessao da API protegida por token temporario de servidor.
- Auditoria local preservada e sincronizada com a API quando configurada.
- Dashboard preparado para consumir indicadores reais.
- Fallback automatico para a base local 4.6.10 enquanto o endpoint estiver vazio.
- Projeto Google Apps Script completo em `apps-script/atlas-data-foundation/`.
- Criacao automatica das abas USUARIOS, CLIENTES, CERTIFICADOS, PERMISSOES, AUDITORIA, CONFIGURACOES, AGENDA e LOGS.
- Migracao inicial nao destrutiva das tres contas de fabrica da versao 4.6.10, mantendo os hashes existentes.

## Regra de seguranca

As rotas administrativas exigem token de sessao valido. A senha nao e enviada em texto aberto: o navegador calcula SHA-256 e a API compara o hash armazenado.

## Proxima etapa obrigatoria

1. Criar a planilha ADF do Atlas no Google Sheets.
2. Abrir Extensoes > Apps Script.
3. Copiar `Code.gs` e `appsscript.json`.
4. Executar `configurarAtlasDataFoundation` uma vez.
5. Publicar como Aplicativo da Web, executando como o proprietario e com acesso para qualquer pessoa.
6. Copiar a URL terminada em `/exec`.
7. Inserir essa URL em `apiEndpoint` no arquivo `js/auth/config.js`.

A publicacao do portal deve ocorrer somente depois do teste de saude e do login real.
