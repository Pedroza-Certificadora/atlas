# Projeto Atlas — Sprint 4.9.9 — Atlas Core v1.0 + ACDM

## Status

Entrega preparada para pré-homologação.

## Objetivo

Consolidar a camada Atlas Core e disponibilizar a administração segura de clientes, sem mencionar, depender ou integrar qualquer sistema externo.

## Entregas

- Atlas Core com registro modular central preparado para crescimento.
- Novo botão **Configurar cliente** na Ficha 360º.
- Integração lógica de cadastro duplicado com cadastro principal.
- Arquivamento seguro de cliente.
- Pesquisa de cadastro principal por nome, CPF/CNPJ, telefone ou e-mail.
- Comparação visual antes da integração.
- Confirmação obrigatória para operações administrativas.
- Registro na Timeline dos clientes envolvidos.
- Registro na auditoria da Atlas API.
- Preservação de certificados, comunicações e histórico.
- ABIS atualizado para 4.9.9.

## Regra de segurança

Nenhum registro é apagado fisicamente. A integração marca o cadastro secundário como **INTEGRADO**, registra o cliente principal nas observações e cria eventos de timeline nos dois cadastros. O arquivamento marca o cadastro como **ARQUIVADO** e registra o motivo.

## Arquitetura preservada

- `apps-script/Code.gs` permanece integralmente inalterado.
- Nenhuma tabela, ID, relacionamento ou endpoint foi alterado.
- O front-end continua consumindo exclusivamente a Atlas API.
- Login, permissões, auditoria, backup, importador e estrutura de dados permanecem preservados.

## Critérios de homologação

1. Abrir a Central de Clientes.
2. Abrir a Ficha 360º de um cliente.
3. Confirmar o botão **Configurar cliente**.
4. Testar a busca por outro cadastro.
5. Confirmar a comparação lado a lado.
6. Testar a integração em dois cadastros de homologação.
7. Confirmar situação **INTEGRADO**, observação e timeline.
8. Testar o arquivamento de um cadastro de homologação.
9. Confirmar situação **ARQUIVADO**, motivo e timeline.
10. Validar que certificados e histórico continuam acessíveis.

## Autoria

Concepção, design e desenvolvimento: **Marcos Henrique Pedroza**.
