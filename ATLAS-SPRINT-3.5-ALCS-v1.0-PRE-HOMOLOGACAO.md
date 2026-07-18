# Atlas — Sprint 3.5 ALCS v1.0

## Status

Pacote de pré-homologação gerado em 18/07/2026 sobre a base homologada da Sprint 3.4 — ACS v1.0.

## Implementações

- formulário de pré-atendimento com dados mínimos;
- preservação das escolhas anteriores do Atlas;
- validação de campos obrigatórios e telefone com DDD;
- consentimento obrigatório antes da conclusão;
- resumo automático e organizado para o WhatsApp;
- identificação de origem por referência, `utm_source`, `utm_campaign`, `utm_medium`, `utm_content` e `utm_term`;
- retomada temporária das respostas por `localStorage`, somente no aparelho;
- eventos locais para abertura, início, formulário, conclusão, abandono inferível e chegada ao WhatsApp;
- compatibilidade futura com Google Analytics por `gtag`, sem ativar rastreador externo nesta versão;
- Política de Privacidade dedicada;
- backup integral dos arquivos alterados e script de rollback.

## Dados que não são coletados

O fluxo não solicita CPF, CNPJ, documentos, imagens, senhas ou dados fiscais sensíveis.

## Homologação necessária

- testar em computador e celular;
- testar e-CPF A1, e-CPF A3, e-CNPJ A1, e-CNPJ A3, renovação e orientação;
- fechar o Atlas durante o preenchimento e confirmar a retomada;
- testar URL com `?utm_source=instagram&utm_campaign=teste`;
- confirmar o resumo e a abertura do WhatsApp;
- confirmar que o consentimento é obrigatório;
- abrir a Política de Privacidade;
- executar o rollback somente se necessário.

## Publicação após homologação

```powershell
git status
git add .
git commit -m "Sprint 3.5 - Atlas Lead Capture System v1.0"
git push
```
