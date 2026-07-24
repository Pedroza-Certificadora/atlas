# Projeto Atlas — Sprint 5.0.7.3.2

## Comunicação Segura na Ficha 360º

Atualização consolidada da Comunicação individual com:

- correção do menu “Mais opções” dentro da Ficha 360º;
- cálculo automático dos dias corridos até o vencimento;
- tratamento específico para vence hoje, amanhã e certificado vencido;
- seleção automática do modelo de 60 dias, 30 dias ou vencido;
- bloqueio de envio acima de 60 dias;
- bloqueio quando a validade é ausente ou inválida;
- recálculo obrigatório no servidor antes do Gmail enviar;
- bloqueio de divergência entre tela, certificado, cliente, modelo e dias calculados;
- registro normal em Comunicação, Timeline e Auditoria.

## Proteções preservadas

- fontes e tamanhos atuais;
- JavaScripts sensíveis em ASCII com escapes Unicode;
- charset UTF-8 explícito;
- Agenda, Busca Inteligente, Portal do Cliente e Ficha 360º;
- template visual oficial de e-mail.

## Publicação

Esta versão altera o frontend e o backend. Após publicar os arquivos no GitHub,
substitua o Code.gs do Apps Script por `Code-5.0.7.3.2.gs` e publique uma nova
versão do Web App mantendo a mesma URL de implantação.
