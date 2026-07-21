# Projeto Atlas — Pedroza Certificadora

## Sprint 4.3 — AOSS v1.0

**Atlas Operational Smart System**  
**Versão de pré-homologação:** 4.3.0  
**Data:** 21 de julho de 2026

## Objetivo

Transformar a Central AGR em um painel operacional inteligente, preservando integralmente a identidade visual homologada na Sprint 4.2.

## Implementações

- Busca inteligente em tempo real em todos os cards, ferramentas e portais.
- Favoritos persistentes via LocalStorage.
- Histórico com os cinco últimos acessos e horário.
- Botão de copiar link nos cards principais.
- Indicadores visuais por categoria preservados e integrados ao sistema.
- Atalhos de teclado para Emissão A1, Emissão A3, Consulta CPF, Gestão Online e Manual AGR.
- Modal acessível com a relação dos atalhos.
- Estatísticas locais de acessos, favoritos, sistema mais utilizado e último acesso.
- Refinamentos de área de toque e organização para smartphones e tablets.
- Compatibilidade com `prefers-reduced-motion`.
- Nenhuma dependência externa adicionada.
- Nenhum dado operacional enviado ao servidor.

## Armazenamento local

Chaves utilizadas:

- `atlasAGRFavorites`
- `atlasAGRHistory`
- `atlasAGRStats`
- `atlasAGRVersion`

Não são armazenados CPF, CNPJ, documentos, senhas, tokens, biometria ou credenciais.

## Arquivos atualizados

- `agr/index.html`
- `css/agr.css`
- `js/agr/agr.js`

## Validações executadas

- Sintaxe JavaScript validada com Node.js.
- HTML analisado sem erro estrutural bloqueante.
- Integridade dos caminhos dos arquivos verificada.
- Cache-busting atualizado para a versão 4.3.0 nos arquivos da Central AGR.
- Layout institucional externo à Central AGR não alterado.

## Homologação necessária

Validar manualmente:

1. Pesquisa por CPF, CNPJ, A1, A3, REDESIM, PIS, CNH, CAEPF, Manual, Gestão, ITI e Gov.br.
2. Inclusão e remoção de favoritos após recarregar a página.
3. Registro dos cinco últimos acessos.
4. Cópia de links sem abertura de nova janela.
5. Atalhos Alt+1, Alt+2, Alt+C, Alt+G e Alt+M.
6. Modal de atalhos e fechamento com Esc.
7. Painel de estatísticas locais.
8. Desktop, tablet e smartphone.
9. Chrome, Edge e Firefox.

Após aprovação visual e funcional, gerar o Documento Oficial de Fechamento da Sprint 4.3.


## Correção 4.3.1 — Resultados visíveis na busca

A pesquisa agora exibe imediatamente, abaixo do campo, os recursos encontrados com botão de acesso rápido, além de manter a filtragem das seções originais.
