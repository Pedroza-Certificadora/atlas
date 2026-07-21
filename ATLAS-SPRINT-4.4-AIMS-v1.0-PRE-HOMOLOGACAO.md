# Projeto Atlas — Pedroza Certificadora

## Sprint 4.4 — AIMS v1.0

**Status:** pré-homologação  
**Versão técnica:** 4.4.0  
**Base:** Sprint 4.3.1 — AOSS v1.0

## Entregas implementadas

- Dashboard operacional com ações rápidas e resumo dos checklists.
- Checklists persistentes para e-CPF A1, e-CPF A3, e-CNPJ A1 e e-CNPJ A3.
- Anotações rápidas com salvamento automático no LocalStorage.
- Biblioteca de modelos de mensagens para WhatsApp com botão Copiar.
- Pesquisa global integrada à Central AGR, Área do Cliente, Links Úteis, FAQ e Blog.
- Agrupamentos operacionais expansíveis e recolhíveis.
- Estatísticas locais de produtividade.
- Estrutura modular de dados e comportamento preparada para futura IA Atlas.

## Arquivos da Sprint

- `agr/index.html`
- `css/agr.css`
- `js/agr/agr.js`
- `js/agr/aims-data.js`
- `js/agr/aims.js`

## Persistência local

- `atlasAIMSChecklists`
- `atlasAIMSNotes`
- `atlasAIMSStats`
- `atlasAIMSVersion`

Nenhuma senha, token, biometria ou credencial deve ser registrada nas anotações.

## Homologação necessária

Validar em desktop, tablet e celular:

1. Alternância entre as quatro abas do AIMS.
2. Persistência das etapas dos checklists após atualizar a página.
3. Salvamento automático das anotações.
4. Cópia dos modelos de mensagens.
5. Abertura das ações rápidas.
6. Busca por termos da Central AGR e demais áreas do portal.
7. Expansão e recolhimento dos agrupamentos.
8. Ausência de regressões no AOSS 4.3.1.
9. Preservação do cabeçalho, Hero, rodapé, logos e responsividade homologados.

## Autoria

Concepção, Design e Desenvolvimento  
**Marcos Henrique Pedroza**
