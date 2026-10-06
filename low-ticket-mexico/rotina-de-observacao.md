# Rotina de observação dos concorrentes

Objetivo: saber, toda semana, o que os concorrentes testaram, o que desligaram e o que
escalaram, para moldar a nossa estratégia no que já se paga.

## Quem observamos

| Papel | Página | Page ID | Por que |
| --- | --- | --- | --- |
| Oferta direta | Mente Campeona | 902612686266459 | Mesmo produto (postres en vaso), mesmo preço (99 MXN), mesmo canal (WhatsApp). Escalou em julho de 2026 duplicando o criativo 8 vezes |
| Escada e calendário | Sweets by Alondra | 611888315337555 | Lança um ebook novo a cada 3 a 4 semanas e a temporada com 9 semanas de antecedência (pan de muerto em 27/08), a 129-139 MXN |
| Escala pesada | FestyCake (Éxito Life Academy) | 490292847494512 | Testou de setembro a dezembro de 2025, escalou de dezembro a março duplicando o vencedor 114 vezes, desligou em abril. Hotmart com 4 bumps |
| Referência de longevidade | Aprendizaje Virtual | 442874278909490 | 13 vídeos para WhatsApp, nenhum desligado em 687 dias |
| Referência de pivô | Recetas Deliciosas | 161512677049218 | Site em dólar morreu em dias; WhatsApp em pesos dura 207 dias |

A lista fica em `concorrentes/paginas.json`. As buscas de nicho ficam em
`concorrentes/buscas.json`; trocar o termo de temporada a cada mês (por exemplo
"rosca de reyes" em dezembro, "fresas con chocolate" em janeiro).

## Toda segunda-feira: coleta automática (15 minutos de máquina)

```bash
cd low-ticket-mexico/ferramentas && ./observar.sh
```

Gera `concorrentes/AAAA-MM-DD/` com o histórico bruto, a reconstrução da operação
(`operacao.md`) e a comparação com a semana anterior. Depois, ler `operacao.md` e
preencher o registro abaixo.

## Uma vez por mês: compra-teste (30 minutos, pelo seu celular)

A Biblioteca mostra o anúncio, não a conversa. Para ver a operação por dentro:

1. Pelo celular, clicar no anúncio ativo mais antigo de cada concorrente direto e
   mandar a palavra-chave do anúncio (ex.: "POSTRES").
2. Registrar: tempo até a primeira resposta, se é robô ou pessoa, a sequência de
   mensagens, quando o preço aparece, o meio de pagamento, como entrega, se oferece algo
   a mais depois da compra e se volta a mandar mensagem quem não comprou.
3. Uma vez por trimestre, comprar o produto de 99 MXN do concorrente mais forte para
   avaliar a qualidade do que é entregue.
4. Guardar prints em `concorrentes/AAAA-MM-DD/compra-teste/`.

## O que cada sinal quer dizer e o que fazemos

| Sinal na Biblioteca | Leitura | Decisão nossa |
| --- | --- | --- |
| Anúncio novo desligado em até 7 dias | Teste que perdeu | Não copiar esse gancho nem esse formato |
| Anúncio passa de 30 dias ativo | Gancho validado | Testar a nossa versão do ângulo, nunca o texto dele |
| Mesmo criativo aparece 5 vezes ou mais ("reaproveitado Nx") | Escala por duplicação em vários conjuntos | Sinal de que o ângulo escala: priorizar no nosso teste |
| Pico de anúncios simultâneos sobe 2 vezes ou mais | Começou a escalar | Ver qual criativo puxou a subida e em que data |
| Todos os anúncios desligados de uma vez | Fim de temporada, conta bloqueada ou oferta morreu | Anotar a data; se for sazonal, entra no nosso calendário |
| Produto novo anunciado X semanas antes de uma data | Calendário do concorrente | Lançar o nosso de temporada com a mesma antecedência ou antes |
| Preço muda (ex.: 99 para 129) | Teste de preço | Esperar 2 semanas: se o anúncio novo durar, o preço novo pagou |
| Destino muda de site para WhatsApp ou o contrário | Teste de canal | Registrar qual durou mais |

## Registro semanal

Copiar este bloco para `concorrentes/AAAA-MM-DD/registro.md`:

```markdown
# Registro da semana AAAA-MM-DD

## Mente Campeona
- Ativos: _ (semana passada: _) · novos: _ · desligados: _
- Ganchos novos:
- Preço:
- Leitura:

## Sweets by Alondra
(mesmos campos)

## FestyCake
(mesmos campos)

## Buscas de nicho
- postres en vaso: histórico _ (semana passada _) · mediana de dias no ar _
- termo de temporada do mês:

## O que muda na nossa estratégia
-
```
