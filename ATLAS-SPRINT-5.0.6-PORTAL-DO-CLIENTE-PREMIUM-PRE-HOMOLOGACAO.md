# Atlas — Sprint 5.0.6 — Portal do Cliente Premium

## Escopo entregue

- Convite individual com token aleatório armazenado somente em hash.
- Link de ativação válido por 72 horas.
- Validação de convite expirado, usado ou inválido.
- Criação ou vinculação segura da conta do cliente.
- Login por e-mail e senha definida pelo próprio cliente.
- Painel privado com certificados, validade, indicadores e histórico.
- Solicitação de renovação gravada na Timeline e na Auditoria.
- Separação preservada entre consulta pública mascarada e portal autenticado.
- Template corporativo aprovado preservado; o botão do convite passa a usar o token real.
- Dados, usuários, senhas existentes e endereço do Web App preservados.

## Homologação

1. Publique os arquivos do site com o script da Sprint 5.0.6.
2. Substitua o `Code.gs` pelo arquivo `Code-5.0.6.gs`.
3. Execute `configurarAtlasDataFoundation()` uma vez.
4. Edite a implantação ativa do Web App e selecione **Nova versão**.
5. Mantenha o mesmo URL `/exec`.
6. Na Central de Comunicação, envie o modelo **Convite para o Portal do Cliente** para um cliente de teste.
7. Abra o botão do e-mail, defina uma senha e confirme o acesso.
8. Valide certificados, histórico, indicadores e **Solicitar renovação**.
9. Confirme que a consulta pública por CPF/CNPJ continua sem senha e exibe somente dados mascarados.

## Critérios de aceite

- O convite recebido não contém `{{TOKEN_CONVITE}}`.
- O mesmo convite não pode ser usado duas vezes.
- Convites expirados não ativam conta.
- Um cliente não acessa dados de outro cliente.
- A solicitação de renovação aparece na Timeline do cliente.
- A Área AGR continua restrita e o painel operacional permanece íntegro.
