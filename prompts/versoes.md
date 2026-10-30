# Histórico de versões dos prompts

O fluxo passou por cinco versões em 30/10/2026, todas testadas no Make com os casos de [`exemplos/casos-de-teste.md`](../exemplos/casos-de-teste.md). A numeração é do fluxo inteiro: o classificador mudou pela última vez na v3, o agente na v4 e o revisor na v5.

| Versão | Prompt ou módulo | O que mudou | Por quê (o que o teste mostrou) | Resultado |
| --- | --- | --- | --- | --- |
| v1 | Filtro de padrões (regex) | Primeira versão, validada contra 21 exemplos | Barrar CPF, cartão e telefone antes de qualquer IA | 0 erros inesperados; 1 falso positivo conhecido (protocolo de 10 dígitos). Ver [`testes/resultado-regex.md`](../testes/resultado-regex.md) |
| v1 | Classificador, agente e revisor | Primeira versão | — | C01: o revisor marcou a assinatura como alucinação; o agente juntou as marcações `[A CONFIRMAR]` no fim do texto, criou uma lacuna que o classificador não listou e devolveu `lacunas_inseridas` com o texto literal do exemplo; o e-mail perdeu as quebras de linha |
| v2 | Agente | `[A CONFIRMAR]` no ponto exato do texto e só para lacunas listadas; instrução própria para `lacunas_inseridas`; assinatura com o nome do solicitante permitida | Corrigir os quatro problemas do C01 | C01 sem afirmações sem respaldo. Nos outros canais, o agente passou a escrever rótulos como "Público:", "Tom:" e "Assinatura:" dentro do texto |
| v2 | Revisor | Recebe o nome do solicitante; saudação, cortesia e assinatura não contam como alucinação | Falso alarme no C01 | Sem falsos alarmes de assinatura, mas nota 5 para textos com rótulos |
| v2 | E-mail de entrega | Quebras de linha convertidas em `<br>` | O corpo chegava num bloco só | Corrigido |
| v3 | Classificador | Lacunas só quando indispensáveis | No C03, listou ano da data, local e sobrenomes, e o resumo ficou cheio de `[A CONFIRMAR]` desnecessários | C03 sem marcações supérfluas |
| v3 | Agente | Proibidos rótulos no corpo; estrutura de cada canal explícita; assinatura só em e-mail e comunicado | Rótulos da v2 | Textos limpos, mas o agente deixou de chamar as ferramentas (9 operações por execução em vez de 11; ver evidência E06) |
| v3 | Revisor | Rótulos ou estrutura errada limitam a nota de canal a 2 | Revisor complacente na v2 | Passou a apontar rótulos |
| v4 | Agente | As duas ferramentas (guia de estilo e exemplos aprovados) passam a ser obrigatórias antes de escrever | Na v3, o agente não consultava o guia nem os exemplos | 11 operações em todas as execuções (ver evidência E05). Efeito colateral: o agente copiou nomes de partes do guia ("Contexto:", "O que muda:") como rótulos em dois e-mails |
| v5 | E-mail de entrega | A aprovação passa a ser calculada no Make: `min()` das quatro notas ≥ 4 e lista de afirmações vazia. "Assunto sugerido" só aparece quando o canal é e-mail | Na v4, o revisor marcou "não aprovado" em C01 e C03 com todas as notas ≥ 4 e nenhuma afirmação sem respaldo | Regra aplicada sem depender do modelo |
| v5 | Revisor | O cabeçalho do resumo de reunião (tema, data, participantes) não conta como rótulo | Na v4, nota 2 de canal para um resumo correto | Ver resultados finais no README |

## O que ficou para uma próxima versão

- Reescrever a estrutura do e-mail no guia de estilo sem nomes que pareçam rótulos ("contexto", "o que muda"), ou proibir explicitamente que o agente os use como títulos.
- Trocar o modelo do agente por um mais capaz que o *Medium* do provedor do Make (gpt-5-nano), se o plano permitir. Os desvios de formato vieram quase todos do agente; classificador e revisor (Claude Haiku 5.5) foram consistentes.
- Testar mais de uma execução por caso para medir a variação entre execuções.
