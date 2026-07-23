# Sprint 5.0.1 — ACC Foundation

## Objetivo
Implantar a fundação do Atlas Communication Center sem alterar a estrutura homologada da Atlas Data Foundation.

## Entregas
- Nova Central de Comunicação em `agr/comunicacao.html`.
- Envio manual de e-mails pelo Atlas API e Google Apps Script.
- Quatro templates HTML iniciais: vencimento, vencido, renovação concluída e comunicado personalizado.
- Assinatura institucional “Equipe Pedroza Certificadora”.
- Histórico completo na aba `COMUNICACOES`.
- Registro automático na Timeline.
- Registro automático na Auditoria.
- Indicadores de clientes com e-mail, envios, erros e templates ativos.
- Busca e filtro do histórico.
- Navegação integrada à Área AGR.
- ABIS atualizado para a versão 5.0.1.

## Implantação do Apps Script
Após publicar os arquivos no GitHub, substitua o conteúdo do projeto Atlas API pelo arquivo `apps-script/Code.gs`, salve e publique uma nova versão do Web App mantendo a URL existente. Execute `configurarAtlasDataFoundation()` uma vez para cadastrar os templates iniciais sem apagar dados existentes.

## Homologação
1. Entre na Área AGR.
2. Abra **Comunicação**.
3. Confirme que clientes e templates são carregados.
4. Selecione um cliente com e-mail válido.
5. Escolha um template e revise assunto e mensagem.
6. Envie o e-mail.
7. Confirme o recebimento com o layout HTML.
8. Confirme o registro em `COMUNICACOES`, Timeline e Auditoria.
9. Teste busca, filtro e responsividade em desktop, tablet e celular.

## Preservações
- Login e sessões.
- IDs públicos.
- Estrutura das planilhas.
- Área do Cliente pública.
- Área AGR protegida.
- Backup, Auditoria e ABIS.
