# Atlas — Sprint 5.0.7 — Agenda e Agendamentos

## Entrega

- Agenda operacional com visões por dia, semana e mês.
- Criação e edição de atendimentos vinculados ao cliente.
- Tipos: emissão, renovação, suporte/instalação e outros.
- Estados: solicitado, confirmado, concluído, cancelado e não compareceu.
- Responsável, horário, local/link e observações.
- Solicitação de agendamento pelo Portal do Cliente.
- Registro automático na Timeline 360º e Auditoria.
- Próximos atendimentos no Cockpit.
- Persistência na aba `AGENDA`, preservando registros existentes.

## Publicação

1. Execute o PowerShell da Sprint 5.0.7 para aplicar o site e publicar no GitHub.
2. Substitua todo o conteúdo do `Code.gs` pelo arquivo `Code-5.0.7.gs`.
3. Salve o Apps Script.
4. Execute uma vez `configurarAtlasDataFoundation` para acrescentar as novas colunas à aba `AGENDA`, sem apagar dados.
5. Edite a implantação ativa do Web App, selecione **Nova versão** e use a descrição `Sprint 5.0.7 — Agenda e Agendamentos`.
6. Mantenha **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**.

## Homologação

1. Entre na Área AGR e abra **Agenda**.
2. Crie um atendimento para um cliente de teste.
3. Edite o status para **Confirmado** e confira a Timeline 360º.
4. Entre no Portal do Cliente, solicite um horário e confira se aparece como **Solicitado** na agenda.
5. Valide a visualização no computador e no celular.

