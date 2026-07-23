# Atlas — Sprint 5.0.5.1 — Performance Hotfix

## Objetivo
Reduzir a espera percebida do Atlas Cockpit sem alterar o layout homologado.

## Implementações
- endpoint único `cockpit.summary`;
- uma única viagem entre navegador e Apps Script;
- cache do Apps Script por 90 segundos;
- cache de sessão no navegador com atualização silenciosa;
- renderização imediata do último snapshot disponível;
- atualização em segundo plano;
- botão Atualizar força a renovação do cache;
- payload limitado a 120 eventos e 200 comunicações;
- indicadores, Atlas IA, ACC, Portal e Saúde renderizados pelo mesmo snapshot.

## Resultado esperado
- retorno instantâneo em acessos repetidos na mesma sessão;
- primeira consulta substancialmente menor que a versão 5.0.5;
- interface utilizável enquanto a atualização é processada;
- preservação integral do visual aprovado.

## Homologação
1. Abrir a Área AGR e medir o primeiro carregamento.
2. Recarregar a página e confirmar exibição praticamente imediata pelo cache de sessão.
3. Clicar em **Atualizar** e confirmar renovação dos números.
4. Validar indicadores, Atlas IA, comunicação, saúde e timeline.
5. Confirmar que os cards continuam clicáveis.

## Backend
Substituir integralmente o `Code.gs`, salvar e publicar nova versão do Web App mantendo a mesma URL.
