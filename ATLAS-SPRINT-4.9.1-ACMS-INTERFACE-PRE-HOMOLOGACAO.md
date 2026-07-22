# Projeto Atlas — Sprint 4.9.1

## ACMS Interface v1.0 — Central de Clientes

Versão de pré-homologação: **4.9.1**

### Entrega

- Central de Clientes protegida em `agr/clientes.html`.
- Consumo exclusivo da Atlas API homologada.
- Pesquisa instantânea em clientes, certificados, contatos, observações, setores e timeline.
- Cards com indicadores reais.
- Filtros de ativos, inativos, vencimentos e renovação.
- Grid profissional, ordenação e paginação.
- Skeleton loading, estados vazio e erro.
- Responsividade para desktop, tablet e celular.
- ABIS atualizado para a Sprint 4.9.1.

### Preservado sem alteração estrutural

- Banco de dados Google Sheets.
- IDs e relacionamentos.
- Rotas públicas da Atlas API.
- Autenticação e permissões.
- Auditoria.
- Backup, rollback, importador e fingerprint.
- Área pública do Cliente.

### Homologação necessária

1. Publicar o pacote em ambiente local.
2. Entrar com usuário com permissão `CLIENTS_READ`.
3. Abrir `/agr/clientes.html`.
4. Confirmar os totais da base oficial.
5. Testar buscas por nome, CPF/CNPJ, telefone, empresa e certificado.
6. Testar todos os filtros e paginação.
7. Validar desktop, tablet e celular.
8. Confirmar zero erros no console e na Atlas API.
