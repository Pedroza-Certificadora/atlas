# Atlas — Sprint 5.0.5.2 — Shared Cache e Navegação Instantânea

## Objetivo
Eliminar a espera visual ao alternar entre Clientes, Cockpit e Comunicação, mantendo o layout homologado.

## Implementação
- Cache persistente compartilhado em `localStorage`.
- Clientes alimenta o snapshot do Cockpit após a sincronização.
- Pré-carregamento silencioso de templates, histórico, campanhas e automação enquanto o usuário está no CRM.
- Cockpit mostra imediatamente o último snapshot e atualiza o núcleo em segundo plano.
- Indicadores principais deixam de aguardar Gmail, gatilhos e fila.
- Comunicação abre com clientes, templates, histórico e KPIs disponíveis no cache; atualização ocorre sem apagar os dados exibidos.
- Endpoint `cockpit.summary` reduzido ao núcleo: clientes, certificados e timeline.
- Cache do Apps Script ampliado para 300 segundos no núcleo do Cockpit.

## Compatibilidade
- Estrutura visual preservada.
- Atlas Data Foundation preservada.
- Nenhuma aba ou coluna nova.
- Mesma URL do Web App.

## Homologação
1. Entre em Clientes e aguarde a primeira sincronização.
2. Alterne para Cockpit: os cards devem aparecer imediatamente com o snapshot local.
3. Alterne para Comunicação: clientes, templates e KPIs devem aparecer sem tela vazia prolongada.
4. Atualize o navegador e repita o teste.
5. Confirme que os dados são atualizados silenciosamente após a exibição inicial.

## Observação técnica
A primeira utilização em um navegador sem cache ainda depende da resposta inicial do Google Apps Script. A partir da primeira sincronização, a navegação usa o snapshot persistente e não deve apagar os cards durante a atualização.
