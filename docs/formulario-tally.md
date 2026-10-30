# Formulário de entrada — "ComunicaIA: peça sua comunicação"

Formulário do Tally que inicia o fluxo. Os rótulos abaixo devem ser usados exatamente assim, porque o cenário do Make mapeia os campos pelo nome.

## Texto de abertura

> Descreva a comunicação que você precisa. O ComunicaIA vai gerar um rascunho e enviá-lo para o seu e-mail para revisão. Nada é enviado a outras pessoas automaticamente.
>
> Não inclua CPF, salário, informações de saúde ou outros dados pessoais. Pedidos com esses dados são bloqueados.

## Campos

| Rótulo | Tipo | Opções | Obrigatório |
| --- | --- | --- | --- |
| Seu nome | Texto curto | — | Sim |
| Seu e-mail | E-mail | — | Sim |
| Tipo de comunicação | Lista suspensa | E-mail · Comunicado interno · Resumo de reunião · Post na intranet · Mensagem Teams/Slack | Sim |
| Objetivo | Texto curto | Placeholder: "Ex.: informar mudança no horário do refeitório" | Sim |
| Público | Lista suspensa | Equipe · Liderança · Toda a empresa · Cliente · Fornecedor | Sim |
| Tom | Lista suspensa | Formal · Neutro · Próximo · Urgente | Sim |
| Informações e anotações | Texto longo | Placeholder: "Fatos, datas, responsáveis. Pode colar anotações soltas." | Sim |
| Tamanho | Escolha única | Curto · Médio | Não |
| Aviso de privacidade | Caixa de seleção | "Confirmo que não incluí CPF, salário, saúde ou outros dados pessoais" | Sim |

## Mensagem de conclusão

> Pedido recebido. Em até 2 minutos você recebe o rascunho no e-mail informado.

## Integração

O formulário é conectado ao cenário pelo módulo **Tally > Watch New Responses** do Make, que recebe cada envio na hora.
