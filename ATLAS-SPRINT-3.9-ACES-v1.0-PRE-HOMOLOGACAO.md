# Projeto Atlas — Pedroza Certificadora

## Sprint 3.9 — ACES v1.0 — Pré-homologação

**Sistema:** Atlas Content Expansion System v1.0  
**Versão candidata:** 3.9.0  
**Data:** 18 de julho de 2026  
**Responsável pela concepção, design e desenvolvimento:** Marcos Henrique Pedroza

## Objetivo

Transformar as áreas provisórias do portal em conteúdo útil, profissional, acessível e navegável, preservando integralmente a identidade visual e os fluxos homologados até a Sprint 3.8.

## Implementações

- Área de Links Úteis com seis acessos oficiais.
- Área de documentos para e-CPF, e-CNPJ e casos especiais.
- Perguntas Frequentes com controles nativos e acessíveis.
- Blog inicial com três conteúdos e guia de segurança do A1.
- Links do rodapé direcionados aos novos conteúdos.
- Ancoragem, foco visível e responsividade dos novos componentes.
- Integração dos novos elementos ao Atlas Motion Experience System.
- Orientações documentais apresentadas como lista inicial sujeita à confirmação.

## Elementos congelados preservados

- Cabeçalho e menu homologados.
- Hero e seus CTAs.
- Logos e artes oficiais.
- Rodapé institucional e card da Pedroza Contadores.
- Cores, proporções e alinhamentos existentes.
- Atlas, formulário, persistência local e resumo enviado ao WhatsApp.
- Animações e tratamento de `prefers-reduced-motion`.

## Arquivos completos alterados

- `index.html`
- `css/style.css`
- `css/motion.css`
- `js/motion.js`
- `README.md`

## Validações automatizadas concluídas

- Sintaxe JavaScript validada.
- Estrutura HTML analisada sem erro de parsing.
- Chaves CSS balanceadas.
- `git diff --check` sem erro.
- Árvore Git limpa antes da implementação e baseada no fechamento oficial 3.8.0.

## Homologação visual necessária

Validar antes do fechamento oficial:

1. Desktop, tablet e celular.
2. Links do menu móvel e fechamento do menu.
3. Todos os seis acessos externos.
4. CTAs de documentação até o WhatsApp.
5. Abertura e leitura das seis perguntas frequentes.
6. Links internos do Blog.
7. Atlas completo até o resumo do WhatsApp.
8. Movimento normal e `prefers-reduced-motion`.
9. Cabeçalho, Hero, rodapé e card parceiro sem regressão visual.

## Status

**PRÉ-HOMOLOGAÇÃO — aguarda validação visual do responsável.**

O Documento Oficial de Fechamento será emitido somente após a homologação expressa desta versão.
