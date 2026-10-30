// Valida o filtro de padrões do ComunicaIA (Router 1 no Make).
// O Make avalia "Matches pattern" com regex de JavaScript, por isso o teste roda em Node.
// Uso: node testes/validar-regex.js

const fs = require("fs");
const path = require("path");

const PADRAO =
  /\d{3}\.?\d{3}\.?\d{3}-?\d{2}|(?:\d[ -]?){13,16}|\(?\d{2}\)?\s?9?\d{4}-?\d{4}/;

// bloquear = true: o texto contém dado pessoal e deve ser barrado.
const casos = [
  { id: "P01", bloquear: true, texto: "Atualizar o cadastro do colaborador João Silva, CPF 123.456.789-09, que mudou de área em outubro." },
  { id: "P02", bloquear: true, texto: "cpf 12345678909" },
  { id: "P03", bloquear: true, texto: "cartão 4111 1111 1111 1111" },
  { id: "P04", bloquear: true, texto: "cartão 4111-1111-1111-1111" },
  { id: "P05", bloquear: true, texto: "cartão 4111111111111111" },
  { id: "P06", bloquear: true, texto: "celular (11) 98765-4321" },
  { id: "P07", bloquear: true, texto: "telefone 11987654321" },
  { id: "P08", bloquear: true, texto: "fixo (11) 3456-7890" },
  { id: "P09", bloquear: true, texto: "ligar no 11 3456-7890" },
  { id: "N01", bloquear: false, texto: "Cliente: Grupo Aurora. Pedido de 40 notebooks com entrega prevista para 05/11. A entrega vai atrasar cerca de 5 dias úteis por causa de uma retenção na alfândega do fornecedor." },
  { id: "N02", bloquear: false, texto: "A partir de 10/11 o refeitório funciona das 11h às 14h30 (antes era das 11h30 às 14h). Dúvidas com Facilities, ramal 2045." },
  { id: "N03", bloquear: false, texto: "Carla (UX) ajusta menu ate 31/10. Rafael (dev) sobe ambiente de homologacao ate 04/11. proxima reuniao 05/11 10h" },
  { id: "N04", bloquear: false, texto: "Sistema de pedidos fora do ar hoje das 18h às 20h para atualização." },
  { id: "N05", bloquear: false, texto: "Avisar o time que a Mariana está afastada até o dia 20." },
  { id: "N06", bloquear: false, texto: "Orçamento aprovado de R$ 12.500,00 para o evento." },
  { id: "N07", bloquear: false, texto: "Atualização para a versão 2.5.1 do sistema." },
  { id: "N08", bloquear: false, texto: "Reunião em 10/11/2026 às 14h na sala 302, 3º andar." },
  { id: "N09", bloquear: false, texto: "Pedido nº 48213 entregue." },
  { id: "N10", bloquear: false, texto: "Endereço da filial: CEP 01310-100." },
  { id: "N11", bloquear: false, texto: "Meta de 1.500 atendimentos em 2026." },
  { id: "F01", bloquear: false, falsoPositivoConhecido: true, texto: "Chamado protocolo 2026103012 encerrado." },
];

let erros = 0;
const linhas = [];
for (const c of casos) {
  const m = c.texto.match(PADRAO);
  const bloqueou = Boolean(m);
  const ok = bloqueou === c.bloquear;
  let resultado;
  if (ok) resultado = "ok";
  else if (c.falsoPositivoConhecido) resultado = "falso positivo conhecido";
  else {
    resultado = "ERRO";
    erros++;
  }
  linhas.push(
    `| ${c.id} | ${c.bloquear ? "bloquear" : "liberar"} | ${bloqueou ? "bloqueado" : "liberado"} | ${m ? "`" + m[0] + "`" : "—"} | ${resultado} |`
  );
}

const total = casos.length;
const md = [
  "# Resultado do teste do filtro de padrões",
  "",
  `Regex testado: \`${PADRAO.source}\``,
  "",
  `${total} entradas: ${casos.filter((c) => c.bloquear).length} com dado pessoal (P), ${casos.filter((c) => !c.bloquear && !c.falsoPositivoConhecido).length} sem dado pessoal (N) e ${casos.filter((c) => c.falsoPositivoConhecido).length} falso positivo conhecido (F). Erros inesperados: ${erros}.`,
  "",
  "| Caso | Esperado | Obtido | Trecho que casou | Resultado |",
  "| --- | --- | --- | --- | --- |",
  ...linhas,
  "",
  "Gerado por `node testes/validar-regex.js`.",
  "",
].join("\n");

fs.writeFileSync(path.join(__dirname, "resultado-regex.md"), md);
console.log(md);
process.exit(erros ? 1 : 0);
