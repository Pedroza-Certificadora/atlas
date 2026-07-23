# Sprint 5.0.4A.1 — Hotfix do Endpoint da Atlas API

## Correção

O frontend estava apontando para uma implantação antiga do Google Apps Script. O endpoint oficial foi atualizado para a implantação ativa da Atlas API, preservando a mesma Atlas Data Foundation e o backend da Sprint 5.0.4A.

## Arquivo alterado

- `js/auth/config.js`

## Validação

1. Abrir `Área AGR → Comunicação → Automação`.
2. Manter **Automação ativa** desmarcada.
3. Manter **Modo de homologação** marcado.
4. Informar o e-mail de teste.
5. Clicar em **Salvar configuração**.
6. Confirmar que a mensagem “Ação não reconhecida pela Atlas API” não aparece mais.
7. Depois, clicar em **Enviar teste** e verificar a chegada da mensagem.

## Apps Script

Não é necessário substituir o `Code.gs` nem criar nova versão do Web App neste hotfix. A versão 12 já publicada permanece válida.
