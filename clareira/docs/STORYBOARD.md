# Storyboard — primeira sequência integrada

Cada cena declara o contrato pedido pela seção 8 do briefing: objetivo,
humano/mídia, enquadramento, profundidade, câmera, transformação, texto,
gatilho, destino, interatividade, versão estreita e movimento reduzido.

A sequência não é um filme obrigatório. **Nenhuma cena precisa ser assistida
até o fim para agir**: as ações estão disponíveis desde o primeiro quadro, e
qualquer rota abre direto por URL.

Convenção dos relógios: `T` = relógio da cena (narrativa). `I` = relógio da
interação, independente e sempre ativo, inclusive com `T` parado.

---

## Cena 1 — CHEGADA · `/`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Em 3 segundos a pessoa entende que isto é treino conduzido, em casa, no tempo dela — e consegue agir |
| **Humano/mídia** | `sala-16x9` — mulher real treinando na própria sala, luz de janela, corpo inteiro |
| **Enquadramento inicial** | Fresta horizontal de luz sobre o gesso, ~2% da altura do claro |
| **Profundidade** | 4 camadas: gesso com grão (0) · halo quente (1) · o claro com o vídeo (2) · feixe de luz (3) · tipografia (4) |
| **Câmera** | O vídeo entra em `scale(1.14)` e **assenta** em `scale(1)` até `T=3.0s`. Sem giro, sem roll |
| **Transformação** | **O claro se abre**: `clip-path` de fresta a retângulo. Altura primeiro (`T 0.35→1.5`), largura depois (`T 0.55→1.9`). O halo acende junto |
| **Texto** | "Abra espaço para o seu treino." entra por linha, `T 1.55→2.35`, com defasagem de 130 ms. Apoio e ficha depois |
| **Gatilho** | Automático ao carregar. Nenhuma rolagem é sequestrada |
| **Destino** | "Ver uma aula" → Cena 3 (demonstração). "Entrar" → Cena 5 (acesso). Ambos acionáveis em `T=0` |
| **Interatividade** | `I`: o ponteiro move a fonte de luz do gesso e produz paralaxe entre claro (−14px), halo (−26px) e ambiente. Toque: arraste equivalente. Amortecimento 0.07/quadro, retorno estável à pose base |
| **Estreito** | O claro ocupa a largura inteira nas linhas 2–7 da grade e usa `sala-9x16` abaixo de 560px em retrato; texto nas linhas 7–13. Mesma sequência, mesma hierarquia |
| **Reduced-motion** | Composição final direta, claro já aberto. A luz continua respondendo ao ponteiro — suavemente |

## Cena 2 — O QUE CABE NO SEU TEMPO · `/#comecar`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Trocar "tenho pouco tempo" por uma sessão concreta antes de pedir cadastro |
| **Humano/mídia** | Pôsteres reais das aulas; sem vídeo tocando aqui (uma intenção dominante por momento) |
| **Enquadramento** | Três controles em linha: tempo · espaço · equipamento |
| **Transformação** | Ao mudar um controle, o resultado **recomposta** com continuidade de elemento — o cartão escolhido cresce da posição em que estava, não aparece do nada |
| **Texto** | "Quanto tempo você tem hoje?" e o resultado nomeado em linguagem natural: "Força para pernas, 12 minutos, sem equipamento" |
| **Gatilho** | Interação direta. O estado vai para a URL, então o resultado é compartilhável e o botão voltar funciona |
| **Destino** | Abre a Cena 3 com a aula correspondente |
| **Interatividade** | Consequência visível: mudar de 12 para 30 minutos **troca a aula de verdade**, consultando o catálogo. Nunca só o rótulo sobre o mesmo vídeo |
| **Estreito** | Controles empilham; o resultado permanece acima da dobra |
| **Reduced-motion** | Troca por opacidade, sem deslocamento |

## Cena 3 — DEMONSTRAÇÃO · `/aula/:id/demo`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Mostrar a qualidade da condução antes de qualquer cobrança |
| **Humano/mídia** | `aula-16x9` — pessoa acompanhando uma aula. **Rotulada como demonstração** em tela |
| **Enquadramento** | O claro cresce até quase a largura total; a interface recua |
| **Transformação** | O ambiente escurece para `--noite`: a luz se concentra no corpo. Fade simples, sem wipe |
| **Texto** | Nome da aula, duração, professor, equipamento. Aviso: "Demonstração — não conta como treino realizado" |
| **Gatilho** | Ação do usuário. **Som nunca começa sozinho** |
| **Destino** | "Começar de verdade" → Cena 5 se anônimo, Cena 6 se autenticado |
| **Interatividade** | Controles reais de reprodução; a prévia **nunca** concede progresso nem transfere seu timestamp para uma sessão nova (invariante 7 e §25.2) |
| **Estreito** | Vídeo no topo, ficha abaixo, controles com alvo ≥44px |
| **Reduced-motion** | Sem movimento de câmera; o vídeo continua reproduzindo por escolha |

## Cena 4 — PROGRAMAS · `/programas`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Comparar caminhos progressivos com critérios equivalentes |
| **Humano/mídia** | Pôsteres; grade porque aqui a grade **ajuda a comparar** (§12) |
| **Transformação** | **Mecanismo herdado da direção B**: partitura de cartões que colapsa no detalhe escolhido, com continuidade do elemento |
| **Interatividade** | Cartão sob o ponteiro recebe destaque individual; os demais continuam legíveis (nada de escurecer o resto) |
| **Estreito** | Duas colunas, depois uma. Filtro, rolagem e foco preservados ao voltar |
| **Reduced-motion** | Abertura direta, sem colapso |

## Cena 5 — ACESSO · `/entrar`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Entrar sem atrito e sem repetir a apresentação |
| **Humano/mídia** | O claro permanece, reduzido, ao lado do formulário — a relação visual entre mídia, mensagem e formulário é preservada (§12), **sem impor duas colunas fixas** |
| **Transformação** | O claro encolhe e cede área ao formulário. Continuidade: é o mesmo claro da Cena 1, não outro elemento |
| **Texto** | Erros específicos e acionáveis. Recuperação de acesso sempre visível |
| **Destino** | Aluno recorrente vai direto para Cena 6. **A introdução não se repete a cada login** |
| **Interatividade** | Teclado completo; foco inicial no primeiro campo; `Enter` envia |
| **Estreito** | Formulário primeiro, claro como faixa superior |
| **Reduced-motion** | Sem encolhimento animado |

## Cena 6 — HOJE · `/hoje`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Uma ação principal: começar ou continuar o treino adequado |
| **Humano/mídia** | Pôster da sessão do dia |
| **Transformação** | A recomendação do dia é **estável por fuso e escolha salva**: recarregar a página não troca o plano |
| **Texto** | Propósito, duração, equipamento, professor e próximo passo |
| **Interatividade** | Check-in breve de tempo/disposição quando útil; alternativas ("menos tempo", "sem saltos") que correspondem a conteúdo real aprovado |
| **Estreito** | A ação principal acima da dobra, sempre |

## Cena 7 — PREPARAÇÃO · `/sessao/:id/preparar`

| Campo | Definição |
| --- | --- |
| **Objetivo** | A pessoa se sentir pronta, sem passar por um painel técnico |
| **Transformação** | **Mecanismo herdado da direção C**: passagem curta com aproximação e chegada estável. Aqui ela significa mudança de contexto — de escolher para treinar |
| **Texto** | Tempo, equipamentos, espaço, intensidade prevista, opções, áudio, iniciar |
| **Interatividade** | Câmera e voz são **opcionais e não pedidas aqui**; o modo com botões sempre funciona |
| **Reduced-motion** | Corte limpo entre contextos, sem passagem |

## Cena 8 — ESTÚDIO DE TREINO · `/sessao/:id`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Entender, acompanhar e receber ajuda, com o corpo e a instrução estáveis |
| **Humano/mídia** | Mídia instrucional no centro. Professor legível à distância e em tela pequena |
| **Enquadramento** | Ambiente `--noite`. Exercício atual, série/intervalo, próximo passo e controles essenciais. Mais explicação a um gesto |
| **Transformação** | **Durante o esforço: nenhuma.** Corpo e instrução ficam estáveis (§10). A expressão fica na entrada, na troca de fase e na conclusão |
| **Gatilho** | Motor de sessão determinístico — a máquina de estados é a autoridade, não a animação |
| **Interatividade** | Pausar, continuar, rever explicação, trocar por alternativa real, descansar mais, indicar dificuldade, encerrar. Sem upsell, sem promoção, sem alerta múltiplo |
| **Estreito** | Vídeo, exercício e controle principal; o resto a um toque |
| **Reduced-motion** | Redução de decoração **não pausa a aula** |

## Cena 9 — CONCLUSÃO · `/sessao/:id/fim`

| Campo | Definição |
| --- | --- |
| **Objetivo** | Reconhecer o que foi feito, de verdade |
| **Transformação** | **O claro se fecha**: o retângulo volta a ser fresta e o ambiente retorna ao papel. A casa volta a ser casa. É o fechamento do gesto de abertura da Cena 1 |
| **Texto** | Resumo verdadeiro da sessão a partir do histórico real, dificuldade percebida, registro editável, próximo passo |
| **Interatividade** | Celebração breve e proporcional. Nenhum número gerado para preencher a tela |
| **Reduced-motion** | Fade para a composição final |

---

## Gesto autoral, em uma frase

**O claro abre no começo e fecha no fim.** É o mesmo elemento atravessando a
jornada inteira — não um efeito de abertura que depois some. Abrir é o convite,
fechar é o reconhecimento.

## O que a sequência deliberadamente NÃO faz

- Não sequestra a rolagem nem exige assistir a nada para entrar ou treinar.
- Não usa cinco atos, nem 30 segundos fixos, nem contagem de tempo em tela.
- Não esconde a assinatura visual num tour opcional.
- Não coloca tipografia sobre o corpo da pessoa em nenhuma largura.
- Não acumula todos os mecanismos na mesma página.
