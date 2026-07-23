# Projeto Atlas — Pedroza Certificadora

## Sprint 4.9.17 — AEVS Data Foundation Integration

### Objetivo

Integrar a consulta pública da Área do Cliente à base oficial Atlas Data Foundation, eliminando a dependência da antiga planilha AEVS isolada.

### Implementações

- `doGet(e)` da Atlas API passa a aceitar a ação pública `aevs.consult`;
- pesquisa CPF/CNPJ normalizado na aba `CLIENTES`;
- localiza certificados vinculados pela coluna `CLIENTE_ID` na aba `CERTIFICADOS`;
- prioriza certificado ativo com vencimento mais próximo, depois em renovação e, por último, o vencido mais recente;
- calcula situação e dias restantes;
- retorna somente nome e documento mascarados;
- não retorna telefone, e-mail, endereço, número de série ou outros dados pessoais;
- Área do Cliente passa a usar o mesmo endpoint da Atlas API;
- proteção contra cache, respostas antigas e vazamento do resultado anterior permanece ativa;
- versão uniformizada para 4.9.17.

### Arquitetura preservada

- estrutura das abas;
- IDs públicos;
- login e sessões;
- auditoria;
- backup;
- ABIS;
- CRM e Ficha 360º;
- identidade visual.

### Publicação obrigatória em duas etapas

1. Atualizar o projeto Apps Script da Atlas Data Foundation com o arquivo `apps-script/Code.gs` deste pacote e criar uma nova versão da implantação existente.
2. Publicar o site com o script PowerShell da Sprint 4.9.17.

A URL da implantação deve permanecer:

`https://script.google.com/macros/s/AKfycbzWMMaw7qIegy2TeKa8dc0_0g9mui4TD1xwdc7n9XjxJY4EglSEg_PP6K5lm_TD12RZ3Q/exec`

### Homologação

- consultar CPF com certificado;
- consultar CNPJ com certificado;
- consultar documento sem certificado;
- alternar entre encontrado e não encontrado;
- confirmar mascaramento;
- confirmar que o resultado corresponde à Ficha 360º;
- validar desktop e celular.
