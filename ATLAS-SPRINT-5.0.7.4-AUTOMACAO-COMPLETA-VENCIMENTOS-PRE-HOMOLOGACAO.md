# Projeto Atlas — Sprint 5.0.7.4

## Automação Completa de Vencimentos

Base: Sprint 5.0.7.3.3 homologada.

### Implementações

- marco automático de 1 dia, com texto específico “vence amanhã”;
- marcos consolidados: 90, 60, 30, 15, 7, 1, hoje e vencido;
- configuração canônica dos marcos, inclusive quando houver configuração antiga salva;
- modelos oficiais vinculados corretamente ao motor automático;
- modelos oficiais específicos para 1 dia e vencimento hoje;
- cálculo diário pela data real do certificado;
- deduplicação por certificado e marco;
- preferências de comunicação, fila, limite diário, Timeline e Auditoria preservados;
- fontes, identidade visual e proteção de charset preservadas.

### Publicação

Esta versão exige:

1. publicação dos arquivos do portal no GitHub;
2. substituição integral do `Code.gs`;
3. criação de nova versão do Web App;
4. instalação ou conferência dos gatilhos na Central de Comunicação.

Status: pré-homologação.
