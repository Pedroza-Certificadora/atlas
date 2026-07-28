# Atlas — Hotfix 5.0.10.2

Data: 28 de julho de 2026.

## Objetivo

Corrigir o conteúdo final dos avisos de vencimento enviados pela Central de Comunicação e pelo atalho da Ficha 360º.

## Correções aplicadas

- cálculo real dos dias restantes preservado no assunto, no selo e no texto do e-mail;
- substituição defensiva dos textos fixos de 30/60 dias existentes nos modelos antigos;
- suporte às variáveis `{{DIAS}}`, `{{DIAS_RESTANTES}}`, `{{PRAZO_DIAS}}`, `{{TEXTO_PRAZO}}` e `{{MENSAGEM_VENCIMENTO}}`;
- logo de e-mail em PNG, publicada em endereço absoluto;
- normalização automática de caminhos relativos, SVGs antigos e variáveis de logo;
- mesma regra aplicada na Central de Comunicação e no envio individual da Ficha 360º.

## Caso homologado

Data de referência: 28/07/2026.

Vencimento: 19/08/2026.

Resultado esperado e validado:

- `FALTAM 22 DIAS PARA O VENCIMENTO`;
- `Faltam exatamente 22 dias para o vencimento do seu certificado digital.`;
- logo: `https://pedrozacertificadora.com.br/images/logo/pedroza-certificadora-email.png`.

## Arquivos alterados

- `js/agr/acc.js`;
- `js/agr/client-communication.js`;
- `images/logo/pedroza-certificadora-email.png`;
- `ATLAS-HOTFIX-5.0.10.2-COMUNICACAO.md`.

## Dependência do Web App automático

O ZIP base não contém o `Code.gs` completo atualmente implantado. O arquivo arquivado em `apps-script/Code.gs` é a versão 4.8.2 e não possui as ações `communications.send` e `automation.run` usadas pelo front-end atual.

Por segurança, este hotfix não substitui o Web App. A publicação corrige os envios iniciados pela Central e pela Ficha 360º. Para corrigir também o gatilho agendado que monta e envia e-mails exclusivamente no servidor, é necessário exportar o `Code.gs` atualmente implantado e aplicar a mesma personalização antes do `MailApp.sendEmail`/`GmailApp.sendEmail`.

