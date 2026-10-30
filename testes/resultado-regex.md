# Resultado do teste do filtro de padrões

Regex testado: `\d{3}\.?\d{3}\.?\d{3}-?\d{2}|(?:\d[ -]?){13,16}|\(?\d{2}\)?\s?9?\d{4}-?\d{4}`

21 entradas: 9 com dado pessoal (P), 11 sem dado pessoal (N) e 1 falso positivo conhecido (F). Erros inesperados: 0.

| Caso | Esperado | Obtido | Trecho que casou | Resultado |
| --- | --- | --- | --- | --- |
| P01 | bloquear | bloqueado | `123.456.789-09` | ok |
| P02 | bloquear | bloqueado | `12345678909` | ok |
| P03 | bloquear | bloqueado | `4111 1111 1111 1111` | ok |
| P04 | bloquear | bloqueado | `4111-1111-1111-1111` | ok |
| P05 | bloquear | bloqueado | `41111111111` | ok |
| P06 | bloquear | bloqueado | `(11) 98765-4321` | ok |
| P07 | bloquear | bloqueado | `11987654321` | ok |
| P08 | bloquear | bloqueado | `(11) 3456-7890` | ok |
| P09 | bloquear | bloqueado | `11 3456-7890` | ok |
| N01 | liberar | liberado | — | ok |
| N02 | liberar | liberado | — | ok |
| N03 | liberar | liberado | — | ok |
| N04 | liberar | liberado | — | ok |
| N05 | liberar | liberado | — | ok |
| N06 | liberar | liberado | — | ok |
| N07 | liberar | liberado | — | ok |
| N08 | liberar | liberado | — | ok |
| N09 | liberar | liberado | — | ok |
| N10 | liberar | liberado | — | ok |
| N11 | liberar | liberado | — | ok |
| F01 | liberar | bloqueado | `2026103012` | falso positivo conhecido |

Gerado por `node testes/validar-regex.js`.
