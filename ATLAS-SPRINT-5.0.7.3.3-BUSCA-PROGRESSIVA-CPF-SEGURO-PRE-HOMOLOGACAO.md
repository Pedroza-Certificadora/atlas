# Projeto Atlas — Sprint 5.0.7.3.3

## Busca Progressiva e CPF Seguro

Atualização construída sobre a versão homologada 5.0.7.3.2.

### Alterações

- pesquisa da Central de Clientes atualizada em tempo real a cada caractere;
- todos os termos informados passam a ser obrigatórios no mesmo registro;
- pesquisa numérica separada da pesquisa textual;
- CPF e CNPJ pesquisáveis com ou sem pontuação;
- recuperação visual do zero inicial quando a planilha/API entrega CPF com 10 dígitos ou CNPJ com 13 dígitos;
- CPF `053.340.897-05` exibido e localizado com os 11 dígitos;
- cache do JavaScript atualizado para a versão 5.0.7.3.3.

### Preservações obrigatórias

- fontes, tamanhos e identidade visual;
- Comunicação Segura 5.0.7.3.2;
- Ficha 360º, Agenda, Timeline e Gmail;
- proteção ASCII/Unicode;
- Apps Script e Web App sem alterações.

### Homologação

1. Pesquisar apenas o primeiro nome e confirmar a redução imediata da lista.
2. Acrescentar outra palavra e confirmar que somente registros contendo todos os termos permanecem.
3. Pesquisar `053.340.897-05`.
4. Pesquisar `05334089705`.
5. Confirmar que o CPF aparece como `053.340.897-05`.

