# Projeto Atlas — Sprint 3.8 — AQSS v1.0

## Pacote de pré-homologação

Base confirmada: Sprint 3.7.4, commit `f158e1f`.

Este pacote corrige as pendências pós-homologação sem modificar a identidade visual congelada.

## Correções implementadas

- Links do menu móvel com texto branco, contraste reforçado e leitura adequada sobre o fundo azul-marinho.
- Estados `hover`, ativo e foco visível no menu móvel.
- Foco inicial no primeiro link ao abrir o menu pelo teclado.
- Fechamento do menu por `Esc`, clique externo, seleção de link ou retorno ao modo desktop.
- Inicialização estável das animações de entrada em dois ciclos de renderização.
- Movimento sutil restaurado no fundo homologado do Hero.
- Animações de entrada, cards, Hero, selo, Atlas e formulário preservadas.
- `prefers-reduced-motion` preservado para desativar movimentos não essenciais.
- Cache-busting atualizado para a versão `3.8.0`.
- Metadados técnicos básicos de indexação e compartilhamento adicionados.

## Validações executadas antes do pacote

- Sintaxe de `js/app.js` e `js/motion.js` validada pelo Node.js.
- Integridade do diff validada sem espaços residuais.
- Referências locais de CSS, JavaScript, imagens e Política de Privacidade conferidas.
- Estrutura de links internos conferida.
- Política de Privacidade preservada.
- Identidade visual 3.7.4 preservada.

## Homologação visual obrigatória após publicação

Validar em desktop, tablet e celular:

1. Abrir o menu móvel e confirmar leitura de todos os links.
2. Navegar pelo menu usando `Tab`, `Shift+Tab`, `Enter` e `Esc`.
3. Atualizar a página e observar as entradas do Hero, cards e demais blocos.
4. Confirmar o movimento sutil do Hero, selo de 15 minutos e botão do Atlas.
5. Ativar “reduzir movimento” no sistema e confirmar que o conteúdo aparece sem animações prolongadas.
6. Percorrer todas as opções do Atlas até a abertura do WhatsApp com o resumo preenchido.
7. Abrir a Política de Privacidade e retornar ao site.
8. Repetir, quando disponíveis, em Chrome, Edge, Firefox e Safari.

## Critério de encerramento

A Sprint 3.8 somente será homologada e encerrada após a validação visual publicada. Depois disso deverá ser gerado o Documento Oficial de Fechamento e informado o título oficial da próxima Sprint.
