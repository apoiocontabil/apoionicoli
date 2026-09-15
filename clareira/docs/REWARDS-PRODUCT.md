# Programa de reconhecimento

Nome de trabalho: **Conquistas que acompanham você**. Proposta a validar, **não**
campanha autorizada. `OFERTA_FISICA_ATIVA = false`: nenhum benefício físico é
prometido a ninguém, e a interface diz isso.

## 1. Três camadas com papéis distintos

| Camada | O que é | Custo | Estado |
| --- | --- | --- | --- |
| Reconhecimento de jornada | Primeira aula, marcos de constância, retrospectiva | Produção e infraestrutura; sem frete | **Implementado** |
| Benefício de fidelidade | Produto definido em regulamento para **todos** os elegíveis | Custo entregue por pessoa | Infraestrutura pronta, oferta **desativada** |
| Reconhecimento editorial | Histórias com consentimento e curadoria | Curadoria | Não implementado |

Concurso, sorteio e ranking exigem campanha separada e enquadramento próprio.
Não estão aqui e não devem ser misturados a um programa apresentado como
benefício para todos.

## 2. O que conta, e o que deliberadamente não conta

**Conta:** dia de participação (no máximo **um por dia local**, mesmo com várias
aulas), semana de compromisso (meta **individual** aprovada antes da janela),
ciclo comercial elegível.

**Não conta, por decisão:** calorias, peso perdido, carga máxima, repetições
ilimitadas, frequência cardíaca elevada, dias sem descanso. Não existe sequer um
tipo de evento no ledger para isso — há teste garantindo.

Treino adaptado conta igual. Quem faz duas sessões no plano não compete com quem
faz cinco. Relógio e câmera ajudam onde autorizados; **não são obrigatórios**
para elegibilidade básica.

## 3. Marcos propostos

| Marco | Semanas | Janela | Ciclos pagos | Benefício |
| --- | ---: | ---: | ---: | --- |
| Primeira aula concluída | — | — | 0 | Digital |
| 4 semanas de compromisso | 4 | 8 semanas | 0 | Digital |
| 12 semanas de compromisso | 12 | 20 semanas | 6 | Físico — **desativado** |

A janela é maior que a exigência de propósito: dá espaço para descanso, férias e
retomada sem punir quem parou legitimamente.

## 4. Antifraude — proporcional, sem promessa de inviolabilidade

Não existe comprovação infalível de exercício remoto. O objetivo é reduzir
oportunidade e dano, com perda residual orçada. **Não anunciar "impossível
burlar".**

| Controle | Onde está |
| --- | --- |
| Ledger no servidor; cliente nunca envia saldo | `routes/conquistas.ts` — a única escrita vem de sessão finalizada |
| Idempotência por chave derivada da sessão | `creditarParticipacao` |
| Uma unidade por dia e por semana **no banco** | Índices únicos parciais em `001_inicial.sql` |
| Instante do servidor; fuso declarado do aluno | Relógio local alterado não gera unidade extra; há teste |
| Assistir sem executar etapa creditável não conta | Teste de API confirma |
| Reversão por evento compensatório | `compensar()`; histórico nunca é editado |
| Recurso com protocolo | `POST /v1/conquistas/recurso` |

Critérios de elegibilidade são públicos; limiar de detecção fica em documentação
interna. A tela do aluno nunca menciona fraude ou risco — há teste verificando.

## 5. Experiência do aluno

Ver marco → acompanhar progresso verdadeiro → entender o que falta e por quê →
(quando houver campanha) escolher opção → confirmar endereço → acompanhar envio
→ resolver problema → feedback opcional.

Conquista, elegibilidade, pedido e entrega são **estados separados**. Uma
conquista em revisão não bloqueia a aula nem apaga progresso — e a tela diz
isso com essas palavras.

## 6. Enquadramento jurídico — antes de divulgar

Classificar o programa concreto com revisão jurídica e contábil. Na orientação
oficial consultada, benefício de fidelidade por critérios objetivos, sem sorte,
competição ou limitação de estoque promocional, em regra não exige autorização
da SPA — mas concurso e sorteio têm outro enquadramento, e o nome "clube" ou
"desafio" não muda a mecânica.

**Evitar**: "os primeiros 100 a cumprir ganham", "top 10 do mês", desempate
aleatório dentro de um programa apresentado como benefício para todos. Orçamento
limitado não pode virar escassez silenciosa.

O regulamento precisa ser versionado e cobrir: entidade responsável, países,
quem participa, critérios, evidências aceitas, calendário e fuso, produtos e
alternativas, resgate, prazo de entrega, frete, indisponibilidade, impostos,
pausas e cancelamento, revisão e recurso, privacidade, e tratamento de alterações
futuras — **sem efeito retroativo contra direitos existentes**.

## 7. O que falta para um piloto

1. Preço e margem definidos (ver `docs/PRICING-MODEL.md` — hoje há lacunas).
2. Pesquisa de preferência de produto com público real.
3. Fornecedor com cotação, amostra testada, SLA e documentação fiscal.
4. Regulamento revisado juridicamente.
5. Orçamento que suporte **100% dos elegíveis resgatando** — não a taxa esperada.
6. Fila de revisão humana com operação real por trás (hoje a tela declara que
   não existe).

Só depois disso `OFERTA_FISICA_ATIVA` pode mudar.
