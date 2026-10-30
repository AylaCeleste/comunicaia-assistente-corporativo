# Prompt 3 — Revisor

| Item | Valor |
| --- | --- |
| Módulo no Make | Anthropic Claude > Simple Text Prompt |
| Modelo | Claude Haiku 5.5 |
| Entrada | Canal, público e tom do pedido; fatos do classificador; corpo gerado pelo agente |
| Campos no Make | Model = Claude Haiku 5.5 · Text Prompt = prompt abaixo · Max Tokens = 800 |
| Saída | Campo `Result` (texto com JSON), interpretado pelo módulo JSON > Parse JSON |
| Versão | v1 |

## Por que existe

Um segundo modelo avalia o texto do agente antes de ele chegar ao colaborador. O ponto central é a lista `afirmacoes_nao_suportadas`: tudo que está no texto e não estava nos fatos é candidato a alucinação e aparece destacado no e-mail de entrega. O revisor não decide nada sozinho; ele orienta a revisão humana.

## Técnicas

- Modelo como avaliador (*LLM-as-judge*) com critérios explícitos e escala de 1 a 5.
- Comparação texto × fatos para detectar alucinação.
- Regra de aprovação determinística (todas as notas ≥ 4 e nenhuma afirmação sem respaldo).

## Prompt

```text
Você é o revisor de qualidade do ComunicaIA. Compare o TEXTO com os FATOS e o PEDIDO e responda SOMENTE com JSON válido, sem crases.

<pedido>Canal: {{Tipo de comunicação}} | Público: {{Público}} | Tom: {{Tom}}</pedido>
<fatos>{{fatos}}</fatos>
<texto>{{corpo}}</texto>

Dê notas de 1 a 5 para: "aderencia_publico", "aderencia_canal", "tom", "clareza".
Em "afirmacoes_nao_suportadas", liste toda informação do texto que não está nos fatos (possível alucinação). Marcações [A CONFIRMAR] não contam.
"aprovado_para_humano": true somente se todas as notas forem 4 ou mais e a lista de afirmações estiver vazia.
"sugestoes": até 3 melhorias objetivas.

{"aderencia_publico":0,"aderencia_canal":0,"tom":0,"clareza":0,"afirmacoes_nao_suportadas":[],"aprovado_para_humano":false,"sugestoes":[]}
```
