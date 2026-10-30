# Prompt 3 — Revisor

| Item | Valor |
| --- | --- |
| Módulo no Make | Anthropic Claude > Simple Text Prompt |
| Modelo | Claude Haiku 5.5 |
| Entrada | Nome do solicitante, canal, público e tom do pedido; fatos do classificador; corpo gerado pelo agente |
| Campos no Make | Model = Claude Haiku 5.5 · Text Prompt = prompt abaixo · Max Tokens = 800 |
| Saída | Campo `Result` (texto com JSON), interpretado pelo módulo JSON > Parse JSON |
| Versão | v5 (versão em produção) |

## Por que existe

Um segundo modelo avalia o texto do agente antes de ele chegar ao colaborador. O ponto central é a lista `afirmacoes_nao_suportadas`: tudo que está no texto e não estava nos fatos é candidato a alucinação e aparece destacado no e-mail de entrega. O revisor não decide nada sozinho; ele orienta a revisão humana.

## Técnicas

- Modelo como avaliador (*LLM-as-judge*) com critérios explícitos e escala de 1 a 5.
- Comparação texto × fatos para detectar alucinação.
- Regra de aprovação determinística (todas as notas ≥ 4 e nenhuma afirmação sem respaldo). Desde a v5, quem aplica a regra é o Make, não o modelo: o assunto do e-mail de entrega é calculado com `min()` das quatro notas e `length()` da lista de afirmações. O campo `aprovado_para_humano` continua no JSON só como referência.
- Exceções explícitas (saudação, cortesia, assinatura e `[A CONFIRMAR]` não contam como alucinação) e teto de nota para texto com rótulos ou fora da estrutura do canal.

## Prompt

```text
Você é o revisor de qualidade do ComunicaIA. Compare o TEXTO com os FATOS e o PEDIDO e responda SOMENTE com JSON válido, sem crases.

<pedido>Solicitante: {{Seu nome}} | Canal: {{Tipo de comunicação}} | Público: {{Público}} | Tom: {{Tom}}</pedido>
<fatos>{{fatos}}</fatos>
<texto>{{corpo}}</texto>

Dê notas de 1 a 5 para: "aderencia_publico", "aderencia_canal", "tom", "clareza".
Em "afirmacoes_nao_suportadas", liste toda informação do texto que não está nos fatos (possível alucinação). Não contam: marcações [A CONFIRMAR], saudações, fórmulas de cortesia e a assinatura com o nome do solicitante ou da TechNova.
Se o texto tiver rótulos ou metadados que não fazem parte do canal (por exemplo "Público:", "Tom:", "Texto:", "Assinatura:") ou não seguir a estrutura esperada do canal, "aderencia_canal" é no máximo 2. O cabeçalho do resumo de reunião (tema, data e participantes) faz parte da estrutura do canal e não conta como rótulo.
"aprovado_para_humano": true somente se todas as notas forem 4 ou mais e a lista de afirmações estiver vazia.
"sugestoes": até 3 melhorias objetivas.

{"aderencia_publico":0,"aderencia_canal":0,"tom":0,"clareza":0,"afirmacoes_nao_suportadas":[],"aprovado_para_humano":false,"sugestoes":[]}
```

## O que mudou desde a v1

- **v2:** o revisor recebe o nome do solicitante e passa a ignorar saudação, cortesia e assinatura. Na v1, ele marcou a assinatura "Ayla Viana" como alucinação no caso C01.
- **v3:** texto com rótulos como "Público:" ou "Assinatura:", ou fora da estrutura do canal, recebe no máximo 2 em aderência ao canal. Na v2, o revisor deu nota 5 a textos com esses rótulos.
- **v5:** o cabeçalho do resumo de reunião (tema, data, participantes) deixa de contar como rótulo; na v4, o revisor deu nota 2 a um resumo correto por causa dele. A aprovação passou a ser calculada no Make, porque na v4 o modelo marcou `aprovado_para_humano: false` em dois casos com todas as notas ≥ 4 e nenhuma afirmação sem respaldo.
