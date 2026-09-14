# Modelo de preço e unit economics

**Nada aqui é oferta.** São as hipóteses da seção 24 do briefing, implementadas
para serem testadas e contestadas. `operacao.cobrancaHabilitada` é `false` e a
rota de contratação recusa.

Skills aplicadas: `avora-financeiro-compliance` #0306 (precificação e margem) e
#0484 (unit economics), adaptados ao SaaS de treino.

## 1. As duas hipóteses

| Plano | Hipótese mensal | O que concentra |
| --- | ---: | --- |
| Essencial | R$ 29,90 | Aulas e programas publicados, explicações, histórico, recomendação por regras, motor de sessão, continuidade entre dispositivos, conquistas digitais |
| Completo | R$ 49,90 | Tudo do Essencial + assistência generativa e voz com franquia explícita, personalização ampliada, receitas revisadas, avaliação corporal, visão experimental |

Implementadas em `packages/domain/src/plans/catalogo.ts`, versão de catálogo
`2026-09-14.1`. Mudar preço **não altera direito já contratado**: a assinatura
guarda a versão de catálogo.

### O que NÃO depende de pagar mais

Controle da sessão, pausar e retomar, acessibilidade, privacidade e
consentimentos, exportar e excluir dados, suporte de acesso, cancelamento. Ficam
fora do catálogo de propósito — não são moeda de troca.

## 2. O que o simulador calcula

`packages/domain/src/economics/simulador.ts`, com 19 testes. Entradas todas
editáveis; cada rubrica carrega origem (`hipotese`, `observado`, `cotacao`,
`lacuna`).

```
receita líquida            = receita bruta − deduções
margem de contribuição     = receita líquida − custo variável
espaço econômico           = max(0, margem − parcela gerencial)
reserva por ciclo          = min(percentual × margem positiva,
                                 espaço econômico,
                                 caixa livre por participante)
ciclos mínimos             = teto(custo entregue ÷ reserva por ciclo)
equilíbrio operacional     = (custos fixos + aquisição, se no numerador)
                             ÷ contribuição média ponderada positiva
```

**Não conta a mesma rubrica duas vezes**: se o orçamento de aquisição entra no
numerador do equilíbrio, o simulador avisa para não descontá-lo de novo na
parcela gerencial. Há teste para isso.

## 3. Resultado do cenário base

Reproduz exatamente a tabela didática da seção 34.7 — o que valida a
implementação das fórmulas, **não** a viabilidade do negócio.

| Por pagante/mês | Essencial | Completo | Completo intensivo |
| --- | ---: | ---: | ---: |
| Receita líquida | R$ 25,00 | R$ 42,00 | R$ 42,00 |
| Margem antes das recompensas | R$ 17,00 | R$ 30,00 | R$ 15,00 |
| Espaço econômico | R$ 2,00 | R$ 7,00 | R$ 0,00 |
| Reserva por ciclo | R$ 2,00 | R$ 5,10 | R$ 0,00 |
| Acumulado em 12 ciclos | R$ 24,00 | R$ 61,20 | R$ 0,00 |
| Ciclos para um benefício de R$ 55 | 28 | 11 | não financiável |

### Três conclusões que o modelo força, e que não podem ser ignoradas

1. **O Essencial não financia um objeto de R$ 55 em 12 ciclos** — acumula
   R$ 24,00. Prometer benefício físico nesse plano exige objeto mais barato,
   patrocínio confirmado ou reconhecimento digital.
2. **No uso intensivo, a margem do Completo (R$ 15) fica R$ 8 abaixo da parcela
   gerencial (R$ 23), mesmo sem prêmio.** Vender mais Completo não melhora a
   margem automaticamente.
3. **Um frete R$ 10 maior leva o custo entregue a R$ 65** e ultrapassa a reserva
   anual do Completo. A folga de R$ 6,20 não é validação de operação nacional.

## 4. Lacunas — por que a conclusão é condicional

O simulador devolve `conclusaoIncondicional: false` enquanto houver rubrica
marcada como lacuna. Hoje faltam:

| Lacuna | Impacto |
| --- | --- |
| Custos fixos do período | Sem eles não existe ponto de equilíbrio honesto |
| Tributos e taxas sobre o benefício | Aumenta o custo entregue |
| Custo de atendimento por resgate | Aumenta o custo entregue |
| Custo de antifraude e revisão por resgate | Aumenta o custo entregue |

As deduções de R$ 4,90 e R$ 7,90 são **valores agregados fictícios** da seção
34.7. Não são estimativa tributária e precisam ser substituídas por rubricas
reais por empresa, canal e país.

## 5. Como validar o preço de verdade

1. Pesquisa de disposição a pagar com público real — amostra pequena não prova
   demanda nacional.
2. Demonstração útil com seleção pequena de aulas, medindo custo por teste
   iniciado e convertido (vídeo + IA + suporte).
3. Só depois, coortes de assinantes reais, acompanhando conversão, ativação,
   retorno, cancelamento, reembolso, chamados de suporte e margem.

Escolher a oferta pela combinação de satisfação, retenção e sustentabilidade —
não pelo maior número de cadastros. **Não realizar cobrança real como se fosse
enquete.**

## 6. Transparência exigida na tela

Implementado em `apps/web/src/routes/Planos.tsx`:

- O aviso de que é estudo vem **antes** do número, não em letra miúda.
- "Recomendado para…" com a adequação explicada. **Nunca** "mais escolhido" —
  não há dado.
- Franquias em unidades compreensíveis, com "sem cobrança automática de
  excedente".
- Sem preço riscado, cronômetro, escassez, depoimento ou bônus com valor
  inventado.

Base legal a revisar antes de qualquer publicação: CDC, arts. 30, 31 e 37.
