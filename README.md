# ComunicaIA — Assistente Corporativo Inteligente

Protótipo acadêmico que transforma um pedido simples em uma comunicação corporativa padronizada (e-mail, comunicado, resumo de reunião, post ou mensagem), com IA generativa, automação no Make e revisão humana obrigatória.

> Projeto da disciplina *Fundamentos de IA com Foco em IA Generativa*. A empresa TechNova Soluções e todos os dados usados nos testes são fictícios.

## O problema

Na TechNova, cada colaborador escreve de um jeito. E-mails longos, tom inconsistente e textos que precisam de revisão antes de sair consomem tempo de quem escreve e de quem revisa. O desafio era criar um assistente que receba um pedido simples, entenda o contexto e entregue um texto adequado ao objetivo, ao público e ao canal.

## Como funciona

O colaborador preenche um formulário. Um filtro barra dados pessoais antes de qualquer IA. O Claude classifica o pedido. Um agente do Make redige seguindo o guia de estilo da empresa. O Claude revisa o texto. O rascunho volta para o próprio solicitante, que decide se usa. Cada pedido fica registrado numa planilha.

![Fluxo do ComunicaIA](docs/arquitetura.png)

## Ferramentas e modelos

| Etapa | Ferramenta | Por quê |
| --- | --- | --- |
| Entrada | Tally (formulário) | Gratuito, com listas suspensas que forçam entrada estruturada e gatilho instantâneo no Make |
| Orquestração | Make (plano Free) | Fluxo visual, roteadores com filtros e agentes de IA nativos |
| Filtro de dados pessoais | Router do Make com regex | Barra CPF, cartão e telefone sem enviar nada à IA |
| Classificador e revisor | Claude Haiku 5.5 (Anthropic) via módulo Simple Text Prompt | Rápido e barato para saídas estruturadas; não exige chave de API no plano Free |
| Redação | Make AI Agent, com o provedor de IA do Make | Agente com instruções, conhecimento (guia de estilo) e ferramenta (busca de exemplos aprovados) |
| Saída | Gmail | O rascunho vai só para quem pediu; a IA nunca envia nada ao público final |
| Auditoria | Google Sheets | Histórico de pedidos, status, notas do revisor e aprovação humana |

## Fluxo passo a passo

1. **Formulário (Tally).** Tipo de comunicação, objetivo, público, tom, informações e aviso de privacidade. Especificação em [`docs/formulario-tally.md`](docs/formulario-tally.md).
2. **Filtro de padrões.** Se o texto contiver CPF, cartão ou telefone, o pedido é bloqueado, o solicitante é avisado e o log registra `BLOQUEADO_REGEX`. Nenhuma IA é acionada. Validação em [`testes/resultado-regex.md`](testes/resultado-regex.md).
3. **Classificador (Claude Haiku 5.5).** Devolve um JSON com categoria, risco, fatos, lacunas e duas sinalizações: dados sensíveis e fora de escopo.
4. **Triagem.** Pedidos com dados sensíveis (por exemplo, saúde) ou fora de escopo (por exemplo, tentativa de mudar as instruções) são bloqueados com status `BLOQUEADO_CLASSIFICADOR`.
5. **Agente redator (Make AI Agent).** Consulta o guia de estilo, busca exemplos aprovados do mesmo canal e redige usando só os fatos fornecidos. O que falta vira `[A CONFIRMAR: ...]`.
6. **Revisor (Claude Haiku 5.5).** Dá notas de 1 a 5 (público, canal, tom, clareza) e lista afirmações do texto que não estavam nos fatos, que são candidatas a alucinação.
7. **Entrega para revisão humana (Gmail).** O solicitante recebe o rascunho e o relatório do revisor. Se o revisor não aprovou, o assunto do e-mail avisa que a revisão é obrigatória.
8. **Log (Google Sheets).** Uma linha por pedido, com a coluna `aprovado_humano` preenchida por quem revisou.

## Prompts principais

| Arquivo | Papel | Técnicas |
| --- | --- | --- |
| [`prompts/01-classificador.md`](prompts/01-classificador.md) | Interpretar e triar o pedido | Papel, delimitadores XML contra injeção, saída JSON com valores fechados |
| [`prompts/02-agente-redator.md`](prompts/02-agente-redator.md) | Redigir o texto | Instruções estruturadas, RAG no guia de estilo, *few-shot* dinâmico por ferramenta, restrição de fonte |
| [`prompts/03-revisor.md`](prompts/03-revisor.md) | Avaliar o texto | Modelo como avaliador, comparação texto × fatos, regra de aprovação determinística |

O histórico de mudanças está em [`prompts/versoes.md`](prompts/versoes.md).

## Como usar

1. Abra o formulário: *(link a publicar)*.
2. Preencha o tipo, o objetivo, o público, o tom e as informações. Não inclua dados pessoais.
3. Em até 2 minutos, o rascunho chega no e-mail informado, com o relatório do revisor.
4. Revise, confirme os pontos marcados com `[A CONFIRMAR]` e só então envie pelo seu canal.

Para reproduzir o cenário na sua conta do Make, importe [`make/blueprint.json`](make/blueprint.json) (três pontos no editor > Import blueprint) e refaça as conexões.

## Resultados dos testes

Oito casos de teste cobrem os cinco canais e as quatro proteções do fluxo: [`exemplos/casos-de-teste.md`](exemplos/casos-de-teste.md).

*(tabela de resultados a preencher após a execução no Make)*

## Privacidade, limitações e uso responsável

- **LGPD.** O formulário avisa para não incluir dados pessoais; o filtro de padrões barra CPF, cartão e telefone antes de qualquer IA; o classificador barra dados sensíveis sem padrão fixo, como saúde. O log não guarda o e-mail do solicitante.
- **Alucinação.** O agente só pode usar os fatos fornecidos, e o revisor aponta o que não tem respaldo. A decisão final é sempre humana.
- **Limitações conhecidas.** O regex bloqueia números longos que não são dados pessoais, como protocolos de 10 dígitos. O classificador pode deixar passar dados sensíveis escritos de forma indireta. O revisor também erra, por isso não substitui a leitura humana.
- **Segurança.** Se o link do formulário for público, qualquer pessoa pode gastar os créditos do Make. O formulário deve ser desativado fora do período de avaliação.

## Links

- Cenário público no Make: *(a publicar)*
- Vídeo pitch: *(a publicar)*
- Documento teórico: [`docs/parte-teorica.pdf`](docs/parte-teorica.pdf) *(a publicar)*

## Autora

Ayla Celeste Viana
