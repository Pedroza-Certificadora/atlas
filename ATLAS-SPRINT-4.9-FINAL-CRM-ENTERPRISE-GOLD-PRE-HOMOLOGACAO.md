# Projeto Atlas — Pedroza Certificadora

## Sprint 4.9 FINAL — CRM Enterprise Gold

**Versão técnica:** 4.9.12  
**Situação:** Pacote de pré-homologação final  
**Data:** 22/07/2026  
**Responsável:** Marcos Henrique Pedroza

## Entrega consolidada

### Ficha 360º Enterprise
- Cabeçalho inteligente com resumo de alertas do cliente;
- Barra de ações com menu `⚙ Ações`;
- Menu `⋮ Mais opções`;
- Painel lateral de alertas;
- Timeline preservada e integrada à pesquisa universal;
- Certificados mantidos como cards operacionais;
- Aba Administração com governança, relacionamentos, comunicação e auditoria.

### ACDM
- Comparação e integração de registros preservadas;
- Detecção visual de possíveis duplicidades por documento, e-mail e telefone;
- Arquivamento seguro preservado;
- Relacionamentos administrativos entre clientes;
- Histórico e auditoria mantidos.

### Dashboard e Central de Clientes
- Cards clicáveis preservados;
- Painel lateral de alertas;
- Seleção múltipla de clientes;
- Cópia de IDs em massa;
- Exportação CSV dos clientes selecionados.

### Pesquisa Universal
Pesquisa consolidada em dados autorizados de:
- Clientes;
- Certificados;
- Timeline;
- Comunicações;
- Usuários.

A agenda e as observações permanecem pesquisáveis quando esses dados estiverem presentes nos objetos retornados pela Atlas API e na ficha do cliente.

### Comunicação — infraestrutura
- Templates iniciais;
- Preferências de canais;
- Fila local de preparação;
- Consulta de histórico retornado pela API;
- Registro na Timeline quando uma comunicação é preparada para um cliente;
- Nenhum disparo automático ativado nesta Sprint.

## Arquitetura preservada

Não houve alteração em:
- `apps-script/Code.gs`;
- Estrutura do Google Sheets;
- Atlas API homologada;
- IDs públicos;
- Login e sessão;
- Auditoria base;
- Backup;
- ABIS estrutural;
- Identidade visual homologada.

## Homologação necessária

1. Publicar o pacote com o script oficial.
2. Validar login e sessão.
3. Abrir a Central de Clientes.
4. Testar cards e filtros.
5. Abrir uma Ficha 360º.
6. Testar `⚙ Ações`, `⋮ Mais opções` e Administração.
7. Testar Pesquisa Universal com `Ctrl + K`.
8. Selecionar clientes e exportar CSV.
9. Abrir Alertas e navegar até um cliente.
10. Preparar uma comunicação e confirmar o registro na Timeline.
11. Validar desktop, tablet e celular.
12. Somente após aprovação, declarar encerrada a série 4.9.
