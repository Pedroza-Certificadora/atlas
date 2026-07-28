# Atlas — Manual Resumido de Operação e Manutenção

## Operação diária

1. Acesse a Área AGR pelo login protegido.
2. Consulte o Dashboard Executivo para prioridades, vencimentos e agenda.
3. Use Clientes para cadastrar, localizar ou editar registros.
4. Abra a Ficha 360º para certificados, histórico e ações do cliente.
5. Use Agenda para acompanhar e registrar agendamentos.
6. Consulte o Intelligence Center e a fila de comunicações antes de qualquer ação manual.
7. Use o Portal do Cliente e a consulta pública para validar a experiência externa.

## Verificações periódicas

- Confirmar disponibilidade do site e da API.
- Revisar alertas, vencimentos e agenda.
- Conferir a fila de comunicações e falhas registradas.
- Verificar se não existem disparos duplicados.
- Manter cópia de segurança da planilha e do repositório.
- Confirmar que o Git permanece sincronizado com origin/main.

## Regras de manutenção

- Criar backup antes de qualquer publicação.
- Trabalhar sempre a partir de uma árvore Git limpa.
- Alterar apenas arquivos aprovados para a Sprint.
- Validar HTML, CSS, JavaScript, referências e responsividade.
- Publicar por commit identificado e registrar o hash final.
- Não substituir Code.gs, atualizar o Web App ou reinstalar gatilhos sem necessidade comprovada, avaliação de impacto e aprovação expressa.
- Não enviar e-mails reais de teste sem autorização.
- Preservar os templates oficiais e a identidade visual congelada.

## Recuperação

Em caso de regressão, interrompa novas alterações, identifique o último commit homologado e utilize o backup correspondente. A referência funcional da Fase 1 é o commit 0e05e042f19101002265e09262e62eac535b9ca7.

## Pendências opcionais para futura Fase 2

- Inteligência analítica e preditiva ampliada.
- Recomendações automáticas de prioridade e relacionamento.
- Evolução do aplicativo móvel.
- Novos indicadores gerenciais e relatórios.
- Aprimoramentos do fluxo de documentos e automações.
- Sincronização do Code.gs arquivado com o Web App publicado, somente após auditoria técnica específica.

Esses itens não fazem parte da Fase 1 e não estão iniciados.
