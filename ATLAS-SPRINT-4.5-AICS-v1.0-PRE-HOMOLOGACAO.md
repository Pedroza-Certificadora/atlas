# Projeto Atlas — Pedroza Certificadora

## Sprint 4.5 — AICS v1.0
### Pacote de pré-homologação

Versão candidata: **4.5.0**  
Data: **21/07/2026**

## Objetivo entregue

A Área do Cliente foi ampliada com um sistema público de autoatendimento inteligente, preservando a consulta AEVS, a identidade visual homologada e o isolamento da Central AGR.

## Recursos implementados

- Histórico local limitado às 8 consultas mais recentes;
- Armazenamento exclusivo de documento mascarado, tipo, situação, validade e horário;
- Documento completo mantido somente em memória durante a sessão para facilitar repetição imediata;
- Favoritos locais com remoção individual e limpeza completa;
- Pesquisa unificada em downloads, orientações, FAQ, links úteis e artigos;
- Central de Downloads com pesquisa, filtros e links externos oficiais;
- Linha do tempo educativa com aviso explícito de demonstração;
- Central de Suporte com WhatsApp, e-mail, FAQ e blog;
- Atalhos por grupos: Meu certificado, Downloads, Instalação, Renovação, Suporte e Segurança;
- Painel de privacidade e LGPD;
- Layout responsivo para desktop, tablet e celular;
- JavaScript modular em `aics-data.js` e `aics.js`;
- Comunicação desacoplada entre AEVS e AICS por evento personalizado.

## Arquivos principais

- `cliente/index.html`
- `css/cliente.css`
- `js/cliente/cliente.js`
- `js/cliente/aics-data.js`
- `js/cliente/aics.js`

## Segurança e LGPD

- CPF ou CNPJ completo não é gravado no LocalStorage;
- Mensagens de WhatsApp geradas pela consulta utilizam documento mascarado;
- O histórico pode ser apagado pelo usuário;
- Os favoritos podem ser apagados pelo usuário;
- A página informa que os dados pertencem somente ao navegador utilizado;
- A página não se apresenta como área autenticada;
- Nenhum dado da Central AGR é acessado ou exibido.

## Fontes externas oficiais utilizadas

- Instituto Nacional de Tecnologia da Informação — Repositório ICP-Brasil;
- Instituto Nacional de Tecnologia da Informação — Cadeias ICP-Brasil;
- Certisign — Downloads e instalação de certificado A3;
- Soluti — Suporte e manuais de instalação A3.

## Validações automáticas executadas

- Sintaxe de `cliente.js`: aprovada;
- Sintaxe de `aics-data.js`: aprovada;
- Sintaxe de `aics.js`: aprovada;
- Análise estrutural do HTML: aprovada;
- Referências de versão atualizadas para 4.5.0;
- LocalStorage restrito ao módulo AICS;
- Nenhuma dependência JavaScript externa adicionada.

## Homologação manual necessária

1. Confirmar que a consulta AEVS continua retornando os dados corretos;
2. Realizar uma consulta e validar o histórico local;
3. Atualizar a página e confirmar a persistência mascarada;
4. Adicionar e remover favoritos;
5. Limpar histórico e favoritos;
6. Testar pesquisa por “A3”, “renovação” e “videoconferência”;
7. Testar filtros da Central de Downloads;
8. Abrir os links oficiais em nova aba;
9. Validar WhatsApp, e-mail, FAQ e Blog;
10. Validar desktop, tablet e celular;
11. Confirmar ausência de regressões na Central AGR;
12. Verificar o console do navegador e confirmar ausência de erros.

## Status

**PRONTO PARA PRÉ-HOMOLOGAÇÃO.**

A Sprint somente deverá ser encerrada após a validação visual e funcional pelo responsável do Projeto Atlas.
