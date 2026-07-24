# Projeto Atlas - Sprint 5.0.7.4.1

## Comunicacao Cliente Persistente

- Preserva o cliente selecionado durante a sincronizacao em segundo plano.
- Descarta qualquer certificado vinculado ao cliente anterior.
- Resolve o certificado pelo CLIENTE_ID do cliente atual.
- Mantem a validacao de vencimento apenas nos modelos de vencimento.
- Recalcula os dias e seleciona automaticamente o marco coerente.
- Libera comunicados, convites, boas-vindas e renovacoes da regra de vencimento.
- Preserva fontes, layout, Agenda, Ficha 360 e protecao de charset.
