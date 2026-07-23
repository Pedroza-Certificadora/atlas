# Projeto Atlas — Sprint 4.9.17

## AEVS Public Consultation & Secure Email

### Objetivo
Transformar a Área do Cliente em uma consulta pública segura, sem senha, exibindo apenas dados mascarados e permitindo o envio dos detalhes completos exclusivamente para o e-mail previamente cadastrado na Atlas Data Foundation.

### Implementações
- remoção da proteção de login da página pública `/cliente/`;
- consulta por CPF/CNPJ com consentimento;
- exibição de titular, documento, tipo, validade, situação e prazo em formato mascarado;
- correção definitiva do mapeamento dos campos retornados pelo Apps Script;
- inclusão do e-mail mascarado no retorno público;
- botão `Enviar detalhes por e-mail` somente quando houver e-mail válido cadastrado;
- envio pelo `MailApp` para o e-mail já registrado no cliente;
- template HTML responsivo e moderno;
- registro do envio em `COMUNICACOES`, `TIMELINE` e `AUDITORIA`;
- bloqueio de reenvio por 5 minutos para o mesmo documento;
- nenhuma possibilidade de informar e-mail alternativo pela consulta pública;
- endpoint oficial preservado;
- API, banco, IDs e estrutura de abas preservados.

### Segurança
A página pública não expõe nome, documento ou e-mail completos. O e-mail detalhado é enviado somente ao endereço existente na Atlas Data Foundation. O visitante não escolhe nem altera o destinatário.

### Homologação
1. Consultar CPF/CNPJ com certificado e e-mail cadastrado.
2. Confirmar os dados mascarados na tela.
3. Acionar o envio e confirmar o destino mascarado.
4. Verificar o recebimento do e-mail moderno.
5. Confirmar o registro na Timeline, Comunicações e Auditoria.
6. Repetir o envio em menos de 5 minutos e validar o bloqueio.
7. Consultar cliente sem e-mail e validar a orientação para atendimento.
8. Consultar documento inexistente e confirmar ausência de dados residuais.

### Versão
`4.9.17`
