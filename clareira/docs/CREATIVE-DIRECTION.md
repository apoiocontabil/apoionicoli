# Direção criativa — conceito, exploração e decisão

Etapa 2 da seção 29 do briefing. As três direções foram **implementadas e
renderizadas**, não descritas. Os arquivos executáveis estão em `explorations/`
e as capturas em `docs/evidencias/direcoes/`.

Skills aplicadas nesta etapa: `avora-direcao-criativa` #0189 (análise de
referências), #0196 (conceito criativo avançado), #0193 (storytelling visual),
#0201 (direção de arte); `avora-design-branding` #0289 (pesquisa de mercado e
mapa de oportunidade visual), #0161 (curadoria de referências);
`cinematic-web-toolkit`. Registro em `docs/SKILLS-APPLIED.md`.

---

## 1. O problema real, antes do conceito

A barreira do treino em casa não é só motivação. É que **a casa não é uma
academia**. A sala é sala. Não existe um lugar do treino: ele precisa ser
aberto, e depois desfeito. E o tempo é fragmentado — o que existe são 12, 20,
35 minutos entre outras coisas.

Um produto que só empilha vídeos não resolve nada disso. O que o cliente
precisa sentir é: *cabe aqui, cabe agora, e alguém me conduz*.

## 2. Conceito central

> **Sua casa abre um claro de luz e vira o seu estúdio pelo tempo que você
> tiver — e depois volta a ser sua casa.**

A promessa do serviço vira uma metáfora espacial legível: **luz que abre
espaço**. Não é decoração — é a tradução exata do que o produto faz.

Do conceito saem, coerentes entre si:

| Elemento | Decorrência do conceito |
| --- | --- |
| Nome de trabalho | **Clareira** — a abertura de luz que se faz num lugar fechado. Substituível em `packages/domain/src/plans/marca.ts`; nenhum código depende do nome |
| Gesto visual autoral | **O claro**: uma fresta de luz se alarga até virar o retângulo onde a pessoa real está treinando. Abre para revelar, fecha para concluir |
| Família de materiais | Papel, gesso, argila, linho, luz de janela — matéria doméstica, não concreto de galeria |
| Linguagem de câmera | Aproximação lenta e lateral que **assenta**. Sem giro, sem roll, sem zoom agressivo |
| Gesto de interação | O ponteiro **move a fonte de luz** do ambiente. Toda a página responde, sempre, mesmo pausada |
| Voz | Direta, concreta, sem slogan de revolução. "Abra espaço para o seu treino." |

### Os cinco conceitos considerados (#0196)

Registrados porque a escolha só significa alguma coisa com as alternativas
visíveis:

1. **Abre-se um claro** — o ambiente doméstico abre espaço para o treino. *Escolhido.*
2. **O tempo que você tem** — o tempo como matéria que se dobra ao disponível. Forte na utilidade, fraco como abertura: vira infográfico.
3. **Presença dupla** — professor e aluno no mesmo quadro por montagem. Depende de mídia autoral que ainda não existe.
4. **A rotina como paisagem** — semanas viram terreno percorrido. Excelente para a área de Evolução; não é abertura.
5. **Matéria doméstica** — texturas de casa com luz de estúdio. É uma camada da direção, não uma ideia central.

Os conceitos 2 e 4 **não foram descartados**: entraram como mecanismos das
áreas de preparação e de evolução. O 3 fica para quando houver acervo próprio.

---

## 3. As três direções materializadas

Mesma mensagem de produto nas três, para comparar a força da composição e não
três paletas: título "Abra espaço para o seu treino.", apoio idêntico, mesmas
duas ações, mesma ficha "12 min · sem equipamento · sala pequena".

### A — CLARO · `explorations/a-claro.html`

Luz mineral quente, tipografia editorial serifada, composição assimétrica em
grade de 12 colunas. A transformação é a **abertura do claro**: `clip-path`
animado de fresta a retângulo, com o vídeo recuando de `scale(1.14)` para
`scale(1)` — a câmera assenta. Halo quente projetado no gesso, feixe de luz
atravessando, grão sutil no branco. Ponteiro move a fonte de luz e produz
paralaxe entre claro, halo e ambiente.

**Custo:** DOM + CSS + um `requestAnimationFrame`. Sem WebGL.

### B — CADÊNCIA · `explorations/b-cadencia.html`

Montagem rítmica: seis células numa partitura assimétrica entram em defasagem
e **colapsam num quadro único**. Fundo quase preto, dessaturação, acento lime.
Interação: a célula sob o ponteiro reacende — cor, nitidez e rótulo.

**Custo:** DOM + CSS. Vários vídeos simultâneos (custo de decodificação).

### C — PASSAGEM · `explorations/c-passagem.html`

Cena 3D real em Three.js: corredor de lâminas de concreto instanciadas, piso
reflexivo, névoa, moldura de verdete e uma **abertura com `VideoTexture`** onde
vive o vídeo real. Dolly contínuo em Z que atravessa a abertura. Ponteiro
desloca luz e câmera. Tem recuperação de contexto WebGL perdido e alternativa
sem WebGL.

**Custo:** cena WebGL completa — a mais cara das três.

---

## 4. Comparação com evidência

Critérios do briefing, não gosto pessoal. Cada nota tem a evidência ao lado.

| Critério (origem no briefing) | A — Claro | B — Cadência | C — Passagem |
| --- | --- | --- | --- |
| **Pessoa real treinando em casa domina a abertura** (§30, eliminatório 2) | **Sim.** O claro ocupa ~45% do quadro e dentro dele só existe a sala real | Parcial. Em `t=0.8` metade das células ainda é retângulo escuro — lê como carregamento | **Não.** Em `t=2.2` as lâminas de concreto ocupam ~70% do quadro; a pessoa é uma janela ao fundo |
| **Tipografia legível, sem cobrir informação** (§5; §10) | **Sim**, após corrigir. Grade com áreas que não se cruzam em nenhuma largura | **Não.** Em `t=3.6` a headline cobre cabeça e tronco da pessoa | **Não.** Em `t=2.2` a headline cruza o rosto e perde contraste sobre o vídeo |
| **Relação com "treinar em casa"** | Direta: luz de casa, matéria de casa | Neutra: a montagem serve a qualquer categoria | **Fraca.** Corredor de concreto lê como galeria — é o universo da referência, não o nosso |
| **Distância da estética rejeitada** (§5: template, dashboard, genérico) | Longe: editorial, assimétrico, quente | **Perto.** Preto + lime + caixa alta condensada é o registro padrão de app de fitness | Longe, mas na direção errada: repete a "abertura dominada por estruturas abstratas" já rejeitada |
| **Fidelidade em celular/TV/relógio** (§22.5) | Alta: a grade reflui para uma coluna preservando sequência e hierarquia | Média: a partitura de seis células fica ilegível em tela pequena | Baixa: o corredor precisa de campo de visão largo; em retrato a passagem some |
| **Custo e risco** (§24.4, §27) | Baixo. Sem WebGL, sem shader, sem dependência de GPU | Médio. Vários vídeos decodificando ao mesmo tempo | Alto. WebGL, perda de contexto, orçamento de GPU, alternativa obrigatória |
| **Sobrou repertório para o resto do produto?** (§7, item 10) | Sim: a passagem espacial e a montagem continuam disponíveis | — | — |

### Observação técnica encontrada durante a exploração

O Chromium usado na validação é uma build open-source **sem H.264**: o vídeo MP4
falhava com `DEMUXER_ERROR_NO_SUPPORTED_STREAMS` e o que aparecia era o
*poster*. A correção foi passar a gerar **VP9/WebM ao lado do MP4** e servir os
dois com `<source>`. Isso melhorou o produto (compressão melhor em navegador
moderno, H.264 preservado para Safari/iOS/TV) e tornou a verificação honesta —
sem isso eu estaria olhando uma imagem parada e chamando de vídeo.

---

## 5. Decisão

**Direção A — CLARO.** Vence nos dois critérios eliminatórios (presença humana
real dominando a abertura; nenhuma informação coberta), é a mais fiel entre
formatos, a mais barata de operar e a mais distante da estética já rejeitada.

**B e C não são descartadas — são realocadas.** Cada mecanismo vai para onde
ele de fato serve, em vez de acumular tudo na home:

| Mecanismo | Origem | Onde passa a ser usado |
| --- | --- | --- |
| Passagem espacial com dolly e chegada estável | C | **Entrada no estúdio de treino**: a transição de "escolhi a aula" para "estou na aula" é uma passagem curta, onde ela significa mudança de contexto |
| Montagem em partitura com colapso em quadro único | B | **Biblioteca e descoberta de programas**: comparar muitas opções e abrir uma — a continuidade do elemento entre grade e detalhe |
| Seleção por proximidade do ponteiro com destaque individual | B e C | **Cartões de programa e professores** |

Isso atende à seção 7, item 10 ("não acumular todos os mecanismos na mesma
página") e faz cada efeito trabalhar pela compreensão do produto.

### O que a direção A precisa provar no produto, não na exploração

A exploração é uma prova de composição, não de produto. Continuam em aberto:
o comportamento com aula real, a legibilidade do professor em TV, a passagem
para a sessão guiada e o custo em aparelho fraco. Esses pontos estão na matriz
de requisitos e na `docs/DEVICE-MATRIX.md`.

---

## 6. Sistema visual derivado

Tokens implementados em `apps/web/src/design/tokens.css`.

### Cor

| Token | Valor | Papel | Origem no conceito |
| --- | --- | --- | --- |
| `--papel` | `#f6f2ea` | Fundo principal claro | O gesso da parede com luz |
| `--areia` | `#e9e1d3` | Superfície secundária, bordas de área | Sombra própria do gesso |
| `--tinta` | `#17140f` | Texto principal, ação primária | Preto quente, não neutro frio |
| `--argila` | `#994f2f` | Acento em **texto**, estados ativos | O vaso de terracota do quadro real |
| `--argila-viva` | `#a85a36` | Mesmo acento em uso **gráfico** e display grande | — |
| `--luz` | `#e7b064` | O claro, halos, destaque de progresso | A luz de janela |
| `--oliva` | `#5d6b46` | Confirmação, constância, conquistas | As plantas do quadro real |
| `--noite` | `#14120f` | Fundo do estúdio de treino | A sala com a luz concentrada no tapete |

A paleta **saiu da mídia**, não de uma paleta padrão: argila, oliva e luz são
cores que já existem nos clipes escolhidos. Por isso a interface e o vídeo não
brigam.

Contraste **calculado** (WCAG 2.1 relative luminance; texto normal exige 4.5:1,
texto grande e elementos gráficos 3:1). Os valores abaixo são verificados por
`packages/domain/test/paleta.test.ts`, que roda no `npm test` e falha se alguém
alterar um token e quebrar o contraste — não são estimativas escritas à mão:

| Par | Razão | Uso permitido |
| --- | --- | --- |
| `--tinta` sobre `--papel` | 16.45:1 | Qualquer texto |
| `--tinta-70` sobre `--papel` | 6.06:1 | Texto de apoio |
| `--argila` sobre `--papel` | 5.35:1 | Qualquer texto |
| `--argila` sobre `--areia` | 4.60:1 | Qualquer texto |
| `--oliva` sobre `--papel` | 5.14:1 | Qualquer texto |
| `--papel` sobre `--tinta` | 16.45:1 | Botão primário |
| `--papel` sobre `--noite` | 16.75:1 | Texto no estúdio de treino |
| `--luz` sobre `--noite` | 9.61:1 | Qualquer texto no escuro |
| `--luz` sobre `--papel` | **1.74:1** | **Somente gráfico** — proibido para texto |

O valor original de `--argila` (`#a85a36`) dava exatamente 4.50:1 — em cima da
linha, sem margem para arredondamento ou variação de renderização. Foi escurecido
para `#994f2f` no uso de texto; o tom original continua disponível como
`--argila-viva` para uso gráfico e display grande, onde 3:1 basta.

`--luz` é explicitamente proibida para texto e isso está escrito como comentário
no próprio token, para a regra viajar com o código.

### Tipografia

- **Display:** Fraunces (serifa de eixo variável, calorosa, com personalidade).
  Pesos 300 para títulos grandes, 600 para marca e ênfase.
- **Texto:** Inter. 400/500/600.
- Escala: `clamp()` com base no viewport, mínimo legível garantido em 320px.
- As duas com licença SIL OFL e suporte a latim estendido (PT-BR e ES).

### Camadas — regra permanente

A exploração revelou um defeito de classe: elementos `position:absolute`
pintam acima de itens de grade sem `z-index`, e dois blocos de texto
simplesmente sumiram da composição. A correção virou regra do sistema: **toda
camada declara a sua posição na escala**, nenhuma fica implícita.

| Camada | `z-index` | Conteúdo |
| --- | --- | --- |
| Ambiente | 0 | Gesso, gradientes, grão |
| Halo | 1 | Luz projetada |
| Mídia | 2 | O claro, vídeo, cartões |
| Atmosfera | 3 | Feixe de luz, névoa |
| Conteúdo | 4 | Tipografia, ações, controles |
| Sobreposição | 5 | Diálogos, foco temporário |

### Movimento

Faixas calibradas a partir da seção 10, ajustáveis por dispositivo:

| Tipo | Faixa | Easing |
| --- | --- | --- |
| Resposta de controle | 120–200 ms | `easeOutQuad` |
| Mudança de filtro/estado | 180–300 ms | `easeOutCubic` |
| Transição compartilhada | 450–800 ms | `easeInOutCubic` |
| Entrada principal | 0,8–1,8 s | `easeOutExpo` |
| Amortecimento de ponteiro | fator 0,06–0,08 por quadro | — |

Regras invariantes do motion:

1. **A pose é função do tempo absoluto.** `pose(t)` é pura: avançar, voltar,
   pausar ou reiniciar produz exatamente a mesma composição.
2. **O relógio da interação é separado do relógio da narrativa.** Pausar a
   narrativa não congela a resposta ao ponteiro.
3. **O offset de interação é aplicado sobre a pose base restaurada a cada
   quadro** — nunca acumulado.
4. Conteúdo utilizável antes do fim da animação. Nada exige assistir.
5. `prefers-reduced-motion` entrega a composição final estável com respostas
   suaves de luz — não uma página sem design.
