# PROMPT MESTRE — PLATAFORMA DE TREINOS EM CASA, DO ZERO

Consolidação da ideia original, dos prompts para Lovable, Codex e Claude, das orientações Avora, das instruções de projeto, de todos os redesigns e das pesquisas. Decisão mais recente do proprietário: começar novamente, pois os resultados visuais anteriores foram considerados genéricos, sem graça e sem imersão. Elaborado em 11/09/2026.

Claude Code, leia este documento integralmente antes de implementar. Ele é o briefing autossuficiente do projeto. Execute design, engenharia, implementação e validação; entregue uma aplicação funcionando, com evidências e um registro honesto do que ainda depende de recursos externos.

## 1. A decisão que prevalece: começar do zero

Quero construir uma NOVA plataforma de treinos em casa. As versões anteriores não alcançaram o resultado que espero. Não quero mais uma rodada de pequenas alterações sobre a mesma composição.

Crie um projeto novo, com arquitetura, identidade visual, componentes e jornadas novos, em uma pasta independente. Antes de escrever, confira diretório, instruções locais e Git. Se estiver dentro do projeto antigo, crie uma pasta nova de trabalho sem sobrescrever arquivos. Use porta, banco e configurações de desenvolvimento separados. Não apague o projeto anterior, não migre dados reais, não encerre seus serviços nem reutilize credenciais produtivas silenciosamente. Se o nome da pasta já existir, confira se é esta nova implementação antes de continuar; evite criar cópias sucessivas a cada retomada.

As implementações antigas podem ser consultadas como referência de requisitos, erros e comportamentos. Não copie suas telas ou as use como esqueleto. A nova arquitetura deve nascer deste briefing; bibliotecas adequadas e conhecimento de domínio podem ser reutilizados com critério.

Esta instrução substitui orientações antigas como “não recomece”, “preserve a stack”, “refine o cenário existente”, “mantenha o aro metálico”, “use cinco capítulos”, “construa um filme obrigatório de 30 segundos” ou “Casa em movimento já está visualmente aprovada”. Esses comandos antigos não valem para esta criação.

Preserve a visão completa do negócio e as lições aprendidas. Não reduza o pedido a uma landing page nem abandone módulos porque a primeira etapa dará prioridade à experiência visual. Depois de iniciado este novo projeto, continue nele com progresso persistido; começar do zero agora não significa recomeçar indefinidamente.

## 2. Minha ideia original e o resultado que quero

Quero vender uma assinatura mensal de uma plataforma profissional de exercícios em casa. Meus vídeos, minha didática, meus professores e minha metodologia são o centro do produto. Quero que o cliente tenha vontade de treinar e encontre uma experiência tão bem organizada, útil e agradável que passe a considerar o treino em casa uma escolha desejável.

MEU OBJETIVO CENTRAL: causar uma experiência com exercícios que faça o cliente querer voltar; uma experiência que, para ele, seja melhor que ir à academia, no conforto da própria casa e no tempo que tiver. A abertura precisa despertar desejo; a aula precisa entregar orientação e prazer em participar; o retorno precisa ser simples. Não quero somente vender acesso a vídeos. Quero criar uma relação positiva e duradoura com o exercício em casa.

Traduza isso em momentos concretos: a pessoa tem 12 minutos e encontra uma sessão adequada; tem pouco espaço e recebe uma opção viável; precisa parar e retorna sem se perder; não entende o movimento e vê o professor explicar; falta alguns dias e volta sem culpa; percebe evolução real e sabe qual é o próximo passo. Os tempos desses exemplos ilustram necessidades, não prescrevem uma programação pronta.

Quero reunir aulas, programas progressivos, explicações de exercícios, acompanhamento contextual por IA, interação durante a aula, avaliação e evolução, receitas e organização alimentar, recursos profissionais e acesso em diferentes dispositivos. O pacote completo deve concentrar os recursos avançados, respeitando os direitos de cada plano.

Quero uma experiência cinematográfica, sofisticada, tecnológica, humana, imersiva, leve e divertida. A interface precisa ter personalidade e riqueza de detalhes, com navegação fácil. Não quero aparência de template de SaaS, artefato de IA, catálogo sem direção ou dashboard de cartões repetidos.

Quero movimento de câmera, profundidade, transições profissionais, interatividade com consequência visível e cenas memoráveis. Quero pessoas REAIS treinando em CASA: ambientes domésticos convincentes, luz natural, movimentos inteiros, pele natural, orientação e energia. Essa exigência vale desde a abertura, não apenas depois do login.

DECISÃO VISUAL MULTIPLATAFORMA DO PROPRIETÁRIO: quero a mesma identidade, experiência e riqueza de efeitos em todos os dispositivos, com proporções otimizadas para cada categoria. “Lado a lado” foi apenas um exemplo de consistência, não uma regra obrigatória de colunas. Preserve a assinatura visual e a intenção da composição; ajuste proporções e organização ao formato sem descaracterizar a plataforma ou entregar uma versão genérica no relógio/celular. A seção 22.5 detalha essa regra.

Quero duas experiências igualmente bem cuidadas: o aluno que treina e o professor que cria, organiza, revisa e acompanha. Quero qualidade audiovisual e qualidade de software. Um efeito impressionante não compensa uma aula quebrada; uma API correta não compensa uma experiência genérica.

Quero também um programa de reconhecimento por conquistas, com objetos úteis para exercício e uma experiência de pertencimento que incentive retorno. A seção 34 especifica critérios de constância, prevenção de abuso, hierarquia de benefícios, orçamento, logística e expansão para a América Latina. Recompensas precisam fortalecer a experiência e preservar a sustentabilidade da assinatura.

Quero uma assinatura de entrada acessível, bem abaixo da referência de academia presencial pesquisada, com grande valor percebido sustentado por benefícios reais. A seção 24 organiza as hipóteses mensais de R$29,90 e R$49,90, a comparação com aplicativos, os limites de custo e a transparência da oferta. Esses preços ainda precisam de validação; não são autorização de venda. A experiência cinematográfica permanece em todos os planos.

“Melhor que os concorrentes” é minha ambição. Transforme-a em decisões e critérios verificáveis. Não publique superioridade comprovada, exclusividade mundial, resultados físicos garantidos, depoimentos, usuários ou números inventados.

Ainda não defini marca comercial, domínio, preços, quantidade e nomes dos planos, oferta, moeda, período grátis ou exigência de cartão. “Estúdio Presença” e “plataforma saude” eram nomes provisórios. Avora é uma coleção de métodos, não a marca do produto. Pode usar um nome de trabalho coerente, deixando-o substituível em configuração, sem bloquear desenvolvimento para decidir naming.

Público inicial de planejamento: adultos que desejam treinar em casa, incluindo iniciantes, pessoas retomando e quem busca uma rotina com tempo e espaço variáveis. É uma premissa, não uma pesquisa demográfica concluída. Não lançar fluxos especializados para crianças ou condições clínicas sem requisitos e validação próprios.

## 3. Como você deve trabalhar no Claude Code

Atue como responsável pela entrega, reunindo direção criativa, design de produto, engenharia e QA. Use as ferramentas efetivamente disponíveis. Confira runtime, gerenciador de pacotes, permissões, ferramentas de navegador, skills e MCPs antes de assumir acesso. Você pode organizar subtarefas independentes para pesquisa de mídia, implementação e revisão, mantendo um responsável pela consistência e evitando edições concorrentes nos mesmos arquivos.

O trabalho deve produzir arquivos, código, servidor local, jornadas e verificações reais. Não conclua com proposta de arquitetura, lista de tarefas, mockups ou alegação de que alguém poderá implementar depois. Planeje brevemente e avance.

Tome decisões rotineiras com base no briefing. Registre hipóteses reversíveis e continue. Pergunte somente quando uma informação faltante impedir uma ação correta ou houver uma decisão material sem autorização. Não repita perguntas já respondidas. Credenciais, contratação, cobranças reais, publicação externa e migração de dados exigem o contexto e a autorização correspondentes; prepare o que for possível antes de solicitar uma ação necessária.

Se faltar uma ferramenta, uma skill ou um provedor, explique o bloqueio específico e continue nas partes independentes. Não fique repetindo a mesma tentativa sem hipótese nova. Não invente endpoints, cenas Spline/Unicorn, arquivos, resultados de testes ou conteúdo de páginas inacessíveis.

Use navegador, demos e documentação quando disponíveis. Se uma referência só carregar após login, respeite o acesso e use alternativas públicas. Um site de referência não se torna MCP por sua URL. Não instale wrappers de terceiros como se fossem ferramentas oficiais.

Trabalhe de forma persistente durante a sessão. Antes de uma interrupção, limite ou compactação, salve decisões, arquivos alterados, testes e o próximo passo preciso em docs/PROGRESS.md. Ao retomar, leia esse estado e confira o código. Um prompt não elimina limites da conta, permissões nem necessidade de ferramentas; não prometa execução infinita ou trabalho em segundo plano que não foi configurado.

Crie um CLAUDE.md curto na raiz do novo projeto com comandos reais, regras permanentes, invariantes e referências aos documentos. Mantenha o briefing completo em docs/BRIEF-MASTER.md e a cobertura em docs/REQUIREMENTS.md, evitando repetir todo este texto em cada instrução carregada automaticamente. Documentação oficial: https://code.claude.com/docs/en/overview ; https://code.claude.com/docs/en/skills ; https://code.claude.com/docs/en/memory .

## 4. Skills obrigatórias: descobrir, ler, aplicar e verificar

As skills devem influenciar o resultado. Descubra as disponíveis no Claude Code nesta sessão, inclusive as pessoais em ~/.claude/skills, as do projeto e as dos plugins. Estarem instaladas no Claude web, no Desktop ou em outro agente não comprova acesso aqui.

Use progressivamente as bibliotecas pertinentes. Leia SKILL.md e o índice; nas Avora, abra o procedimento real pelo ID e nome. A organização pode usar arquivos individuais ou âncoras em documentos agrupados. Não invente caminhos nem carregue todos os 1.161 procedimentos por obrigação.

Mapa de aplicação:

| Fase | Skills e procedimentos a procurar | Evidência esperada |
| --- | --- | --- |
| Produto e briefing | avora-operacoes-rh #0557; avora-seo-analitica-dados #0976; write-spec quando disponível | Requisitos, público como hipótese, prioridades e decisões abertas |
| Pesquisa e conceito | avora-direcao-criativa #0189, #0196, #0201; #0190 quando ajudar; avora-design-branding #0289 | Referência → mecanismo → aplicação; direções visualmente distintas |
| Direção audiovisual | avora-direcao-criativa #0193; cinematic-web-toolkit e references/tools.md; direcao-audiovisual se disponível | Storyboard, mídia, câmera, luz, ritmo e transições |
| Design e interface | avora-design-branding #0161, #0162, #0165; design-visual, design-system, user-research, design-handoff, design-critique | Composição, tokens, jornadas, estados e crítica visual |
| Linguagem e didática | avora-conteudo-copy #0069–#0072, #0260; ux-copy; avora-carreira-educacao #0132 | Microcopy, erros, onboarding, ajuda e estrutura de aulas |
| Arquitetura | avora-codigo-automacao #0127, #0122, #0130; architecture/system-design | Modelo de dados, contratos, autorização e decisões técnicas |
| Assistente | avora-codigo-automacao #0465 | Prompt versionado, ferramentas, exemplos e avaliações |
| Motion | gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react se pertinente, gsap-plugins para Flip, gsap-performance | Movimento implementado, interruptível e medido |
| Qualidade | avora-codigo-automacao #0126, #0123, #0128; testing-strategy, code-review, accessibility-review | Testes materiais, revisão e evidências de navegador |
| Operação e produto | avora-produto-ecommerce-saas #0118, #0109, #0112, #0857; #0117 quando houver dados de churn | Estados comerciais, métricas com definição e auditoria de cobertura |
| Conquistas e sustentabilidade | avora-financeiro-compliance #0096, #0402, #0306, #0484; avora-marketing-vendas #0078, #0238 | Mecânica, custo entregue, obrigações, cenários e experiência de fidelidade |
| Entrega | avora-codigo-automacao #0129; documentation, deploy-checklist se disponíveis | Instruções reproduzíveis e pendências reais |

As skills gsap-frameworks e gsap-utils entram quando necessárias. Debug #0121, CI #0124, Docker #0125 e planejamento #0563 são condicionais. Se Product Tracking estiver disponível, aplique model-product → audit-current-tracking → design-tracking-plan → generate-implementation-guide → implement-tracking conforme a fase. Não recrie tracking existente sem motivo.

No docs/SKILLS-APPLIED.md, registre: skill/procedimento, localizada ou indisponível, leitura, decisão concreta, artefato ou arquivo de código, validação e limitação. O fluxo é descoberta → leitura → aplicação → artefato → validação. Não transforme essa obrigação em um relatório enorme ou uma lista decorativa de nomes. Adapte heurísticas das skills às instruções atuais do usuário.

## 5. O que aprendemos com os resultados rejeitados

Os diagnósticos são históricos, não uma inspeção deste projeto novo:

- Uma versão parecia um caderno de treino com cartões, pouca presença humana e apenas pequenas transições.
- Uma versão posterior literalizou tapete, aro metálico, cenário grafite, palavra enorme, cinco atos e filme de 30 segundos. A abertura observada foi dominada por estruturas abstratas, não por pessoas treinando.
- A narrativa explicava demais pausa e retomada e usava termos internos como “motor da sessão”.
- Controles de apresentação, reinício e velocidade disputavam espaço com a proposta do produto.
- Em uma captura havia problema de enquadramento/sobreposição na região de texto. Não repetir uma cena sem testar todas as posições e tamanhos.
- O usuário também rejeitou a impressão genérica após as tentativas de correção. Portanto, a proposta V4 de vídeo em moldura, entrada curta e sequência editorial é repertório, não um layout aprovado a copiar.

Não herde uma paleta, tipografia, objeto 3D, nome, número de seções ou roteiro só porque estava num prompt anterior. Também não reduza agora a ambição a uma pequena inclinação de vídeo com fades. Precisamos de direção criativa materializada, pessoas reais e um gesto espacial memorável que funcione com o produto.

## 6. Pesquisa de mercado incorporada

Benchmark qualitativo realizado em páginas oficiais em setembro de 2026; não é ranking de receita, pesquisa com assinantes ou prova de que animação gera vendas. Confirme mudanças relevantes antes de publicar alegações.

| Referência | Aprendizado útil | Aplicação autoral neste produto |
| --- | --- | --- |
| Apple Fitness+ | Professores, demonstração da experiência e planos/preferências | Presença humana, clareza do primeiro passo e continuidade |
| Peloton | Identidade dos instrutores, aulas, rotina e recomendações por IA | Professores com personalidade e assistência que produz ajuda observável |
| LES MILLS+ | Modalidades e programas estruturados com produção audiovisual | Jornadas de aprendizagem/progressão e linguagem própria por modalidade |
| Freeletics | Adaptação a condições e preferências | Tempo, equipamento, espaço e impacto alteram de verdade a seleção |
| Queima Diária | Treino em casa, professores, programas e orientação de escolha | Linguagem brasileira natural e um ponto de partida fácil |
| Nike Training Club | Alternativas com treinos e programas gratuitos | Assinatura justificada por metodologia, condução, organização e continuidade |

Fontes: https://www.apple.com/apple-fitness-plus/ ; https://support.apple.com/en-mide/guide/fitness-plus/apdf222051d8/ios ; https://www.onepeloton.com/app ; https://www.lesmills.com/ondemand ; https://www.freeletics.com/en/ ; https://www.queimadiaria.com/ ; https://www.nike.com/ntc-app .

Não copiar identidade, catálogo, promessas ou preços. Recursos variam por país/plano. Não confundir reembolso com teste sem cobrança. IA e personalização já aparecem na amostra; nossa diferenciação precisa estar na qualidade da experiência, na didática e na adequação à vida em casa.

Hipótese estratégica: tornar excepcional a sequência identificação → entender → experimentar → escolher → preparar → treinar → continuar. Avaliar entendimento, ativação, falhas, retorno e satisfação com dados reais quando houver público. Mais tempo assistindo à abertura não prova maior valor.

## 7. Referências visuais e o que transportar delas

Referências reconhecidas:

- Lusion: https://lusion.co/ . A versão v3 recebeu Awwwards Site of the Day em 02/10/2023: https://www.awwwards.com/sites/lusion-v3 . Aproveitar hierarquia ao redor de um palco visual forte, materialidade, profundidade e resposta. A versão atual pode diferir da premiada.
- Igloo Inc: https://www.igloo.inc/ . Site of the Day em 23/07/2024: https://www.awwwards.com/sites/igloo-inc . Aproveitar continuidade espacial e transformação central. A execução completa ao vivo não foi validada na pesquisa anterior.
- Bruno Simon: https://bruno-simon.com/ . Referência histórica de identidade e interação 3D, Site of the Month de novembro/2019: https://www.awwwards.com/bruno-simon-portfolio-wins-site-of-the-month-november.html . Aproveitar interação com consequência; não transformar acesso à aula em navegação por carro ou jogo.

Reconhecimento de design não comprova desempenho comercial. Abra referências acessíveis no navegador e observe movimentos de fato. Registre quando a análise for baseada apenas em artigo/captura.

Relatos técnicos no Codrops que explicam mecanismos:

- MERSI, julho/2026: máscaras e continuidade entre capa e detalhe com Flip.fit. https://tympanus.net/codrops/2026/07/27/between-print-and-digital-the-making-of-mersis-website/
- Flim, janeiro/2026: revelação de vídeo com perspectiva e rotação de superfície. https://tympanus.net/codrops/2026/01/14/a-site-for-sore-eyes-combining-gsap-and-webflow-to-showcase-flim/
- Forged, outubro/2025: progressão de câmera organizada por eixo/seção e decisões de renderização. https://tympanus.net/codrops/2025/10/20/from-garage-to-browser-forged-build-and-the-webgpu-revolution/
- Dondre Green, janeiro/2025: composição editorial de fotografia/filme, escala e máscaras. https://tympanus.net/codrops/2025/01/07/case-study-dondre-green/

Referências originais enviadas pelo proprietário: https://www.instagram.com/p/DdHARI2FXIQ/ ; https://www.instagram.com/reel/DcwovULJR7X/ ; https://dontpad.com.br/video-vibecoders-05 . Os textos METAMORPHOSIS, AURA ONE e o roteiro criativo geral inspiraram os mecanismos abaixo. O novo projeto não depende de acesso aos arquivos originais ou ao Instagram para compreender o briefing.

O que esses textos têm de especial e precisa ser reinterpretado:

1. Um protagonista reconhecível e uma transformação central com origem, desenvolvimento e destino.
2. Câmera que muda a leitura: aproximação, detalhe, abertura do plano, passagem e chegada estável.
3. Primeiro plano, sujeito e fundo com paralaxe e oclusão coerentes, produzindo profundidade perceptível.
4. Materiais com detalhe real quando vistos de perto: espessura, bordas, rugosidade, reflexo, textura e luz.
5. Movimento com antecipação, impulso, suspensão e resolução; peso e defasagens intencionais.
6. Transformação de superfícies por uma frente espacial ou recomposição de elementos quando isso servir ao conceito.
7. Interação que revela, articula ou reorganiza algo; uma seleção muda a cena e a informação.
8. Pose visual determinística: avançar, voltar ou interromper não acumula rotações nem perde o estado.
9. Tipografia, enquadramento e silêncio integrados ao ritmo; foco visual claro por momento.
10. Acabamento técnico: preparar efeitos antes de aparecerem, limpar recursos e não esconder modelos ruins atrás de blur/bloom.

Não importar óculos, fones, cabeças mecânicas, marcas, logos, duração fixa, quantidade de partículas ou cenas reconhecíveis desses projetos. Não explodir, deformar ou reconstruir o corpo humano com shader. Transformações devem atuar no cenário, luz, enquadramento ou elementos gráficos apropriados. Não acumular todos os mecanismos na mesma página.

## 8. Processo criativo: provar a direção antes de multiplicar telas

Faça uma exploração curta de três direções MATERIALMENTE diferentes. Cada uma precisa de composição renderizada, escolha de mídia e uma pequena amostra de movimento; um nome poético com descrição não basta. Use a mesma mensagem de produto para comparar a força das composições, não apenas três paletas.

Territórios para explorar, sem torná-los templates obrigatórios:

- Casa em movimento: um ambiente doméstico ganha presença de estúdio pela luz, enquadramento e condução.
- Ritmo compartilhado: energia humana e montagem relacionam professor, exercício, descanso e pessoa em casa, com transições que acompanham ações.
- Espaço vivo: uma passagem arquitetônica curta cria profundidade e abre para vídeo real; o ambiente responde às escolhas sem se tornar o protagonista absoluto.

Pode propor alternativa mais forte se explicar sua adequação ao objetivo. Escolha autonomamente a direção com melhor identificação humana, assinatura visual, clareza, viabilidade e adaptação móvel. Registre a comparação sem notas inventadas. Não implemente três plataformas completas nem espere confirmação de escolhas rotineiras para avançar.

Transforme a escolhida em uma primeira sequência navegável: abertura → passagem cinematográfica → descoberta de programa → entrada/login → preparação → trecho de aula → pausa/retomada. Inclua também uma operação real de autoria do professor. Essa é uma etapa de prova da direção, não a definição de produto concluído. Disponibilize-a para avaliação e continue o trabalho independente; incorpore feedback antes de disseminar uma composição rejeitada.

Descreva cada cena em storyboard com: objetivo, humano/mídia, enquadramento inicial, profundidade, movimento da câmera, transformação, texto, gatilho, destino, interatividade, versão móvel e movimento reduzido. A experiência deve ser compreensível no primeiro quadro e utilizável durante a animação.

Quero ao menos um gesto visual autoral realmente perceptível na experiência principal, além de microinterações. Pode ser uma passagem espacial, mudança editorial de escala, montagem entre ambientes ou revelação interativa bem executada. Defina o gesto por sua intenção e resultado visual; a tecnologia vem depois.

## 9. Vídeos reais, direção de arte e produção

Use pessoas reais se exercitando em casa. Priorize filmagens gratuitas com licença compatível para a abertura enquanto meu acervo não estiver disponível. Não substituir pessoas por geração de IA, manequins, bonecos, clipes de cor sólida ou fotografia com zoom alegando vídeo de exercício.

Candidatos de curadoria previamente localizados:

| Fonte e link | Possível uso | Informação disponível |
| --- | --- | --- |
| https://mixkit.co/free-stock-video/woman-exercising-in-her-living-room-42898/ | Treino em sala doméstica | Página indicava 1920×1080, 14 s, 24 fps e Free License |
| https://mixkit.co/free-stock-video/woman-following-an-online-workout-class-5061/ | Aula acompanhada pelo notebook | Página indicava 1920×1080, 10 s, 24 fps e Free License |
| https://www.pexels.com/video/a-young-woman-doing-exercise-at-home-8836896/ | Força/elástico em casa | MART PRODUCTION; conferir formatos |
| https://www.pexels.com/video/woman-exercising-at-home-8026946/ | Peso corporal em ambiente doméstico | MART PRODUCTION; conferir formatos |
| https://www.pexels.com/video/a-woman-exercising-at-home-9001929/ | Mobilidade/recuperação | olia danilevich; conferir formatos |
| https://mixkit.co/free-stock-video/girl-doing-stretching-indoors-4942/ | Composição móvel | Página indicava 1080×1920, 10 s, 24 fps e Free License |

São candidatos, não todos aprovados visualmente. Na pesquisa anterior foi reproduzido um trecho do Mixkit 5061; os demais foram selecionados por descrição/dados. Assista e confira sequência inteira, licença por item, autor, qualidade e recorte antes de escolher. Fontes de licença: https://mixkit.co/license/ ; https://mixkit.co/terms/ ; https://www.pexels.com/license/ .

Obtenha arquivos pela forma autorizada, sem depender de URLs temporárias. Registre origem, autor, licença, data, resolução, duração, transformações e uso em docs/MEDIA-SOURCES.md. Um acervo conter vídeos grátis não significa licença comercial de todos os itens. Não sugerir endosso de pessoas retratadas.

Escolha poucos clipes coerentes, com temperatura, exposição e ritmo compatíveis. Garanta poster imediato e arquivo otimizado. Reenquadre para celular preservando articulações e a compreensão do movimento; use versão vertical quando ajudar. Não estique corpos, inverta exercícios para fabricar loop nem anuncie 4K sem arquivo correspondente.

Stock ilustra comunicação e ambientação. Não o identifique como professor da equipe, aluno satisfeito ou aula autoral. Para a demonstração de uma aula da plataforma, use conteúdo autorizado e instruções revisadas. Na falta desse conteúdo, mantenha a demonstração identificada, implemente os mecanismos e registre a dependência; não invente uma aula profissional pronta.

Direção de arte: composição editorial, escala bem resolvida, respiro, luz com intenção, tipografia legível com personalidade, alinhamentos e detalhes consistentes. Defina tokens de cor, espaçamento, tipografia, superfície, camadas e movimento. Evite palette default e fontes escolhidas por hábito. Use poucas famílias com licença compatível e suporte aos idiomas previstos.

Misture áreas claras, mídia e ambientes escuros apenas conforme a direção. Sofisticação não exige tudo preto; acolhimento não exige tudo bege. Use fotos de comida e retratos relevantes nas áreas correspondentes, evitando repetir o mesmo vídeo em todas as telas.

## 10. Gramática de motion, 3D e câmera

Separe três significados de câmera: a câmera virtual do cenário; ângulos de vídeo realmente gravados pelo professor; a câmera opcional do aluno. Um crop não é um novo ângulo instrucional; uma câmera virtual não enxerga o aluno.

Defina um sistema de movimento com origem, destino, duração, gatilho, cancelamento e estado final. Faixas iniciais para calibrar, não regras universais: resposta de controle 120–200 ms; mudança de filtro 180–300 ms; transição compartilhada 450–800 ms; entrada principal aproximadamente 0,8–1,8 s quando o conteúdo já estiver utilizável. Movimentos mais longos precisam de intenção e controle, sem impor espera para entrar ou treinar.

Uma sequência principal pode seguir presença humana → descoberta do espaço → transformação → informação/seleção → chegada à aula. Não fixe cinco atos, trinta segundos ou centenas de alturas de tela. Não esconda toda a assinatura visual num tour opcional deixando a página principal genérica.

Use continuidade de mídia, máscaras, perspectiva e oclusão quando contribuírem. A moldura pode persistir enquanto a mídia muda, mas identifique a passagem de stock ilustrativo para amostra real de aula; não atribua dados de uma aula ao stock.

Regras:

- Uma intenção dominante por momento; coordenar câmera, vídeo, texto e luz.
- Profundidade com camadas e destino legível; evitar roll do horizonte, giros bruscos, zoom agressivo e objetos cobrindo controles.
- Detalhe de material só quando houver aproximação que o valorize. Não carregar cena pesada apenas para um fundo indistinto.
- Interação de pointer/touch produz resposta útil e não acumula transformações. Restaurar pose base antes de offsets; narrativa e amortecimento da interação podem ter relógios separados.
- Clique rápido, navegação reversa, resize e troca de aba interrompem ou resolvem transições sem fila obsoleta.
- Não sequestrar wheel/scroll global; pinning curto e justificado, com âncoras, touch, teclado e botão voltar funcionando.
- Texto permanece semântico/selecionável, mesmo quando houver máscara ou divisão visual.
- Catálogo e formulários permanecem fáceis de operar. Botões não fogem do cursor e a interface não muda de lugar sob o toque.
- Durante o exercício, corpo e instrução ficam estáveis. Entrada, preparação, troca contextual e conclusão admitem mais expressão.
- Oferecer modos completo, suave e reduzido, respeitando prefers-reduced-motion e persistindo a preferência. Redução de decoração não pausa a aula.
- Pausar mídia decorativa e renderização fora da tela/aba; manter recursos e contextos sob controle.

Multiângulo de aula exige arquivos reais, versão, sincronização e offsets conferidos. Trocar ângulo preserva posição e estado; se um ângulo não existir, não oferecer controle falso. Cortes limpos durante movimento podem ser melhores que dissoluções sobrepostas do corpo.

## 11. Ferramentas visuais e integrações de criação

Use a menor combinação que entregue o resultado; não instalar todas as ferramentas na aplicação como sinal de qualidade.

- Codrops: pesquisa de mecanismos, artigos e demos. https://tympanus.net/codrops/hub/tutorials/
- GSAP/ScrollTrigger: coreografia e cenas ligadas à rolagem. Flip quando houver continuidade de elemento. https://gsap.com/docs/v3/Plugins/ScrollTrigger/ ; https://gsap.com/docs/v3/Plugins/Flip/
- Three.js: cena 3D, câmera, geometria e luz reais quando necessários. https://threejs.org/docs/
- Spline: criação/edição de cena quando o editor e a conexão real estiverem disponíveis. Verificar MCP e uma operação de leitura na cena; aplicativo instalado não comprova conexão nesta sessão. https://spline.design/
- Unicorn Studio: composição real exportável, com identificador verdadeiro e licença/acesso adequados. https://www.unicorn.studio/ ; https://www.unicorn.studio/docs/embed/
- Spell UI: componentes e microinterações adaptados à identidade. Verificar registry @spell no projeto/catálogo apropriado. https://spell.sh/docs/components ; https://spell.sh/docs/mcp
- Refero/Inspora: pesquisa de interface quando houver acesso. Falha de plano/login não deve bloquear trabalho com referências públicas. Não supor MCP oficial onde ele não foi documentado.

MCP, skill, biblioteca de código e editor são coisas diferentes. Revalide capacidades, não presuma que a configuração anterior se transfere integralmente ao Claude Code. Consultar Spell não obriga migrar tudo para Tailwind/shadcn; uma cena Spline não exige outro canvas Three.js paralelo. Use vídeo HTML com perspectiva CSS quando suficiente, VideoTexture apenas quando a mídia realmente precisar integrar a superfície 3D.

### 11.1 Repertório ampliado de efeitos, motion e bancos de mídia

Este é um conjunto de categorias e candidatos para curadoria, não uma lista de dependências obrigatórias nem uma alegação de conter todas as ferramentas existentes. Pesquise exemplos e escolha pelo mecanismo que a direção exige. Gratuidade, licença do runtime, acesso ao editor, exportação e licença do asset são verificações diferentes.

| Necessidade | Candidatos e fontes | Critério de aplicação |
| --- | --- | --- |
| Motion de interface e layout | Motion: https://motion.dev/docs ; CSS e Web Animations API conforme suporte | Estados, entrada/saída e continuidade; não disputar a mesma propriedade com GSAP |
| Sequências cinematográficas e scroll | GSAP, ScrollTrigger e Flip, links acima | Timeline coordenada, perspectiva, passagem e transformação com cancelamento |
| 3D em tempo real | Three.js; React Three Fiber se React: https://github.com/pmndrs/react-three-fiber | Cena original com câmera/luz; verificar versões compatíveis e custo |
| Modelagem, materiais e animação de assets | Blender: https://www.blender.org/ ; Spline | Geometria/UV/material refinados, exportação e otimização; editor não substitui QA no app |
| Gráficos interativos por estados | Rive: https://rive.app/docs/ | Elementos autorais que respondem a estados reais, sem virar mascote genérico |
| Animação vetorial e pequenos sinais | Lottie/dotLottie: https://lottiefiles.com/ | Feedback leve e coerente, curado/adaptado; verificar licença de cada animação |
| Composição visual e shaders | Unicorn Studio; shaders próprios em Three.js quando necessários | Efeito com propósito, degradação e export real; sem duplicar motores |
| Imagens humanas, ambientes e refeições | Pexels: https://www.pexels.com/ ; Unsplash: https://unsplash.com/license ; Pixabay: https://pixabay.com/service/license-summary/ | Pessoas e contextos pertinentes; licença, autoria, consentimentos/direitos relevantes e coerência estética |
| Vídeos reais domésticos | Mixkit e Pexels, candidatos da seção 9; Coverr: https://coverr.co/license ; Pixabay | Assistir antes de escolher, confirmar que é filmagem real e uso compatível; bancos também podem conter conteúdo gerado ou links patrocinados |
| Materiais, texturas, HDRIs e modelos | Poly Haven: https://polyhaven.com/license ; ambientCG: https://ambientcg.com/ | Materialidade e luz com assets licenciados; converter resolução/formato ao budget e registrar procedência |
| Tipografia | Google Fonts: https://fonts.google.com/knowledge ; fontes já licenciadas do proprietário | Personalidade, leitura, idiomas, pesos necessários e licença de cada família |
| Componentes e pesquisa de interface | Spell; Refero; Inspora; documentação de componentes escolhidos | Repertório adaptado à marca; não colagem de estilos nem clone de telas |
| Pesquisa visual e mecanismos | Codrops, Awwwards e as referências da seção 7 | Observar cenas, ritmo e intenção; transformar mecanismo em solução original |
| Sons e música | Acervo próprio/licenciado; catálogos como Pixabay/Mixkit apenas após licença por faixa e uso | Direitos para a forma de distribuição/exibição desejada, procedência e separação de faixas quando disponível |

Para cada candidato escolhido, registrar: problema que resolve, alternativa considerada, licença/custo de uso/exportação, manutenção, suporte aos alvos, tamanho/custo de execução e fallback. Não adicionar uma biblioteca para um efeito simples já atendido pelo browser. Rive, Lottie, GSAP, Motion e Three.js não precisam coexistir sem uma razão por componente.

Preserve código fonte dos shaders e cenas autorais e os arquivos editáveis quando a licença/export permitir. Otimize modelos e texturas com ferramentas adequadas disponíveis; conferir glTF/GLB, compressão e compatibilidade antes de escolher o pipeline. Não usar modelo 3D pesado como substituto de boa direção de arte. Ferramentas de criação de imagens por IA podem apoiar estudos conceituais e superfícies abstratas quando autorizado, mas não substituem a exigência de pessoas reais nos vídeos.

### 11.2 Contrato de cada cena e componente animado

Antes de implementar uma cena expressiva, defina em documento ou configuração tipada: ID, objetivo, assets e licença, enquadramentos, camadas, estados, gatilhos, progresso, limites de câmera, entrada/saída, comportamento reverso/interrompido, foco, carregamento, mobile/touch, TV, reduced-motion, sem WebGL e critério visual de aceite. Ajuste a forma à stack; não criar um framework genérico desnecessário.

Separar o controlador da cena dos componentes de produto. O relógio do filme decorativo não dirige o motor da aula. Preservar posição de conteúdo, seleções e foco em transições de rota. Uma rota deve poder abrir diretamente por URL sem depender de assistir à cena anterior. O layout final precisa existir mesmo antes da hidratação/renderização 3D quando a arquitetura permitir.

## 12. Página pública, login e comunicação

Projete uma sequência com hierarquia e variedade compositiva. Sua função é permitir compreender o produto, ver sua qualidade e começar. Conteúdo necessário, organizado conforme a direção escolhida:

- Abertura humana, proposta clara, ação principal e acesso para assinante.
- Demonstração compreensível de uma aula e da orientação.
- Ajuda simples para escolher um ponto de partida por tempo, intenção e equipamento.
- Programas e progressão com critérios comparáveis.
- Professores reais, apresentação curta e especialidades verificadas.
- Uso em casa e dispositivos realmente suportados.
- Oferta e planos quando definidos, ou cadastro/demonstração verdadeiros enquanto isso.
- Dúvidas, suporte, privacidade e condições no contexto apropriado.

Não são nove blocos obrigatórios com o mesmo layout. Pode combinar conteúdos e criar passagens editoriais. Use grid onde ele ajuda a comparar programas; não o aplique a todos os tipos de informação.

Mensagem de intenção: “Abra espaço para o seu treino.” É uma sugestão de clareza, não headline obrigatória. Escreva voz própria, positiva, concreta e sem slogans genéricos sobre revolução/tecnologia. Explique orientação automatizada naturalmente; não exponha arquitetura, flags ou pendências internas como copy principal. Recursos indisponíveis e demonstrações continuam identificados onde influenciam a decisão.

CTA precisa corresponder ao fluxo existente: conhecer programa, ver demonstração, criar conta ou entrar. Não anunciar dias grátis, resultado corporal ou acompanhamento humano antes de aprovados e disponíveis. Termos, privacidade e suporte devem levar a destinos reais; conteúdo legal final precisa de revisão apropriada antes da operação comercial.

Login/cadastro: mesma identidade da abertura, formulário legível, recuperação de acesso, loading e erros claros. Preservar a relação visual entre mídia, mensagem e formulário nas demais telas, com proporção, espaço, tipografia e organização ajustados conforme seção 22.5, sem impor colunas fixas. Aluno recorrente acessa seu treino diretamente; não repetir introdução a cada login. Diferenciar destinos do aluno e do profissional sem criar logins fictícios.

## 13. Área do aluno: didática, personalização e rotina

Jornada fundamental: cadastro → personalização → recomendação → preparação → aula → pausa → explicação → retomada → conclusão → evolução salva.

Onboarding curto e progressivo: objetivo, experiência, disponibilidade semanal, tempo por sessão, equipamentos, espaço, ruído/impacto, preferências e limitações informadas. Peso/altura e dados não essenciais podem ser opcionais e editáveis. Não pedir câmera ou microfone no cadastro. Recomendar com base no conjunto de informações, não somente no peso.

Na página inicial autenticada, uma ação principal: começar ou continuar o treino adequado. Mostrar propósito, duração, equipamento, professor e próximo passo. Check-in breve de tempo/disposição/recuperação percebida quando útil. Alternativas como “menos tempo”, “sem saltos” ou “só um tapete” precisam corresponder a conteúdo real aprovado.

Navegação pode organizar Hoje, Treinar, Evolução, Nutrição e Perfil, com nomes e composição refinados. Não transformar essa sugestão em template rígido. Descoberta, assinatura e suporte precisam ser fáceis de encontrar sem lotar a tela principal.

Biblioteca com busca, filtros úteis, favoritos, histórico, programas e aulas; preservar filtro, scroll e foco ao voltar. Usar linguagem natural em vez de slugs como iniciacao/elastico. Estados vazio/carregando/erro/offline devem orientar a próxima ação.

Programas: objetivo, nível, duração, frequência, progressão, equipamentos, pré-requisitos, professor, aulas, materiais e aprendizagem. Modalidades incluem força com peso corporal/equipamentos, cardio, mobilidade, alongamento, equilíbrio, coordenação, baixo impacto, iniciação e recuperação conforme acervo. A experiência em casa deve ser completa dentro das possibilidades reais de espaço/equipamento, sem prometer equivalência universal a toda máquina, carga ou serviço de academia.

Cada exercício: vídeo/demonstração, passo a passo, respiração, erros comuns, regressões, progressões e cuidados revisados. Informação essencial durante o esforço; detalhe sob demanda. Não improvisar prescrição ou aumento de carga por uma animação de progresso.

Calendário: agendar, reagendar, incluir descanso e retomar sem apagar histórico por faltar. Recomendação diária estável por fuso e escolha salva; atualizar a página não troca o plano silenciosamente. Lembretes opcionais com frequência, fuso e horário silencioso. Não notificar fora da plataforma sem opt-in e infraestrutura real.

Ficha por exercício/série: planejado e realizado, repetições, carga opcional, duração, descanso, dificuldade percebida, observações e origem do registro. Permitir correção de estimativa, preservando rastreabilidade. Distinguir reprodução, prática autodeclarada e estimativa de sensor. Evolução mostra constância, progressão, mobilidade, função e disposição informada, além de medidas quando existentes. Sem culpa, punição de ausência ou celebração enganosa.

## 14. O estúdio de treino: experiência completa durante a aula

Antes da aula, apresentar preparação curta: tempo, equipamentos, espaço, intensidade prevista, opções disponíveis, áudio e iniciar. O aluno deve se sentir pronto, sem passar por um painel técnico. Câmera e voz são opcionais; o modo com botões sempre funciona.

A mídia instrucional ocupa o centro da experiência. O professor precisa ser legível à distância e em telas pequenas. Mostrar o exercício atual, série/intervalo quando aplicável, próximo passo e controles essenciais. Mais explicações ficam a um gesto de distância. Evitar promoções, múltiplos alertas e ofertas premium durante o esforço.

Comandos e ações úteis: pausar, continuar, rever explicação, mostrar o movimento, trocar por uma alternativa disponível, descansar mais, indicar dificuldade, rever equipamentos e encerrar. Na pausa, oferecer ações claras; ao voltar, recuperar o contexto com preparação apropriada. Encerrar parcialmente deve salvar o que de fato ocorreu sem fingir conclusão total.

Trocar exercício significa alterar mídia real, instruções, equipamentos, séries/duração e contexto de retorno. Não trocar apenas o título sobre o vídeo anterior. Alternativas mais fáceis/difíceis devem usar clipes e regras aprovados pelo responsável, sem dedução improvisada a partir do peso ou de uma pontuação visual.

Separar visualização livre, demonstração e sessão guiada. A prévia pública nunca concede progresso nem transfere seu timestamp como início de um treino novo. Ao iniciar uma sessão, seguir seu início definido; ao retomar, recuperar o estado salvo daquela sessão. Velocidade do player deve manter coerência dos eventos e não encurtar descansos prescritos silenciosamente. Onde mudar velocidade não for adequado ao modo guiado, explicar a restrição e oferecer revisão livre.

As dicas de água, respiração, descanso e preparação devem ocorrer em momentos editoriais apropriados, com controles de frequência/silêncio. Não prescrever volume universal de água ou inferir necessidade fisiológica pela câmera. Se a pessoa informar dor ou mal-estar, interromper instruções de esforço e usar um fluxo de ajuda revisado, com orientação adequada à situação; não diagnosticar nem simular monitoramento de emergência.

Conclusão: desaceleração, resumo verdadeiro da sessão, dificuldade percebida, registro editável quando pertinente e próximo passo. A celebração deve ser breve, agradável e coerente com o que foi registrado. Evolução e continuidade vêm do histórico real, não de números gerados para preencher a tela.

## 15. Motor determinístico, mídia e persistência

Desenhe um motor novo com estados explícitos e testes discriminantes. Estados de domínio: preparando, demonstrando, exercitando, descansando, pausado, possível ausência, aguardando retorno e concluído. Carregamento, buffering, erro e abandono também precisam de comportamento definido, por estados ou condições ortogonais conforme a arquitetura.

A máquina de estados e os eventos editoriais são a autoridade da sessão. A IA e a animação apresentam ou solicitam ações; não decidem silenciosamente tempo, conclusão, crédito de exercício ou permissões. Não tentar descobrir continuamente toda a estrutura da aula por um LLM assistindo ao vídeo.

Defina relógios e responsabilidades: posição da mídia; trechos realmente reproduzidos; tempo ativo registrado; descanso; pausa; instante de servidor e reconciliação. Use tempo da mídia para eventos ligados ao vídeo e relógio adequado para intervalos independentes. Não depender apenas de setInterval. Assistir ao vídeo não comprova execução física.

Invariantes obrigatórios:

1. Pausa interrompe ações temporizadas dependentes e mantém vídeo, fala e interface coerentes.
2. Buffering não deixa o cronômetro avançar como se a instrução tivesse sido reproduzida.
3. Seek, replay de explicação e troca de clipe recalculam contexto; pular trecho não credita execução pulada.
4. Retomada e conclusão são idempotentes; cliques, eventos ou retries duplicados não duplicam séries, histórico ou estatísticas.
5. Uma resposta atrasada da IA não altera uma etapa já encerrada.
6. Reentrada da pessoa no enquadramento não inicia esforço automaticamente.
7. Transição visual não pode conceder progresso nem disparar pagamento/publicação.
8. Edição de aula publicada não altera retroativamente sessões em andamento ou registros históricos.
9. Sessão referência versão imutável de conteúdo; decisão explícita para migrar ou reiniciar conteúdo quando necessário.
10. Fechar, atualizar ou trocar de dispositivo não perde o progresso já confirmado; reconciliar estado local e servidor sem sobrescrever dados mais novos.

Defina políticas de uma ou várias sessões simultâneas, controlador ativo e resolução de conflito. Persista eventos/transições necessários no servidor com identificadores e versões. O cache local serve para recuperação, não como única fonte de histórico ou autorização.

Teste retorno da aba, bloqueio de tela, ligação/interrupção, troca de saída de áudio, desconexão do microfone e reconexão de rede. Ao voltar, mostre o estado real e solicite retomada quando apropriado. Não prometer background playback em sistemas onde não foi verificado.

## 16. IA contextual, voz e personalidade

Quero sentir orientação próxima, didática e natural. Isso não exige chat ocupando a tela inteira nem animações fingindo um humano ao vivo. Integre ajuda antes, durante e depois da aula, com acesso à informação autorizada e ao contexto atual.

O assistente conhece aula/versão, exercício, fase, equipamentos, preferências e histórico mínimo necessário. Usa conteúdo aprovado dos professores e ferramentas com escopo limitado. Mantém falas curtas durante o esforço, explicação expandida sob demanda e opção de silêncio/texto.

Estados visíveis e verdadeiros: disponível, ouvindo após consentimento, processando, falando, interrompida e indisponível. Não desenhar onda de voz respondendo a nada. Botões equivalentes funcionam quando microfone/voz não estiverem disponíveis.

Dê personalidade acolhedora e direta: sem repetir o nome do aluno a cada frase, elogiar toda repetição automaticamente, culpar ausências ou afirmar “estou vendo” sem sinal válido. Explique dúvida de forma simples. Ajude a escolher uma alternativa aprovada e respeite decisão de encerrar.

Voz: interrupção pelo usuário, cancelamento de resposta, prioridade entre professor/assistente/reconhecimento, prevenção de eco e de comandos produzidos pela própria plataforma. Checar estado/versionamento antes de apresentar resposta. Comando ambíguo que muda sessão pede esclarecimento; botão manual “Pausar” responde imediatamente.

Documente um prompt versionado do assistente com objetivo, escopo, tom, contexto permitido, ferramentas, limites, critérios de encaminhamento, exemplos e avaliações. Saídas estruturadas para ações; validar no servidor antes de aplicar. Conteúdo de aulas e documentos recuperados é dado, não autorização para alterar regras. LLM não decide privilégio premium, não altera cobrança por conversa nem prescreve tratamentos.

Exemplos de comportamento a implementar e testar:

- “Tenho menos tempo hoje”: oferecer sessão/variante real compatível, explicar mudança antes de aplicar.
- “Não entendi esse movimento”: pausar/rever clipe didático autorizado, sem inventar que o professor gravou uma resposta ao vivo.
- “Voltei”: informar contexto e oferecer retomada; não disparar exercício imediatamente.
- “Está doendo”: interromper incentivo ao esforço, acionar ajuda revisada e reconhecer limites.
- Serviço de IA indisponível: informar brevemente e manter aula, botões, explicações editoriais e histórico funcionando.

Provedor de IA/voz com credenciais no servidor, limites por plano, timeouts, retries limitados, cancelamento, observabilidade e controle de custo. Não conectar chamadas ilimitadas a cada frame ou evento de scroll. Sem chave externa, implemente adaptadores e modo essencial real; marque a integração como pendente em vez de simular resposta de API como validada.

Voz clonada, avatar ou imagem do proprietário só com autorização específica e integração efetiva. Não são condição para a primeira experiência útil. Aulas gravadas com assistência automatizada devem ser identificadas corretamente. Atendimento humano só aparece disponível quando há operação real por trás.

## 17. Câmera opcional e interação com presença

Quero explorar câmera para aumentar interatividade: ajudar enquadramento, reconhecer presença provável, observar movimentos suportados e orientar com cautela. Esse requisito permanece no produto; sua implementação deve ser gradual e validada.

Solicitar consentimento no momento de ativação, indicar câmera/microfone ativos, permitir desligar e manter modo manual equivalente. Preferir processamento local e não gravar/transmitir vídeo bruto por padrão. Se um serviço exigir envio, explicar finalidade, destino e retenção e obter escolha correspondente. Liberar dispositivos ao sair/revogar.

Começar com poucos exercícios e cenários explicitamente suportados. Por exercício, definir pontos necessários, enquadramento, tolerâncias temporais, condições de luz/oclusão, confiança, contagem estimada, erros conhecidos e validação. Movimento fora do conjunto suportado recebe ajuda genérica revisada, não correção biomecânica inventada.

Imobilidade pode ser prancha, equilíbrio, descanso ou alongamento. Perda de enquadramento não comprova abandono. Use histerese/tolerância para evitar alternar pausa/retomada a cada frame. Diante de possível ausência, indicar a incerteza e oferecer pausa; a política de pausa automática, se implementada, deve ser configurável, testada e não liberar retomada automática. Ao voltar, a pessoa escolhe continuar.

Contagem de repetição e ritmo são estimativas quando derivadas de visão; permitir correção manual. Baixa confiança suspende dicas específicas e oferece ajuste de posição. Não usar LLM como único avaliador biomecânico nem estimar esforço fisiológico, fadiga clínica ou risco de lesão como fatos sem método/sensor apropriado.

MediaPipe Pose Landmarker é um candidato técnico para landmarks e análise de pose, não uma prova de precisão de todos esses recursos. Consulte sua documentação e avalie a adequação: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker .

Validação separada por recurso, exercício e dispositivo. “Câmera abriu”, “modelo retornou pontos” e “correção de técnica validada” são resultados diferentes. Meça também latência, consumo de CPU/GPU e bateria. Se a visão falhar, preservar vídeo, comandos manuais e dados da sessão.

## 18. Avaliação corporal, scanner e evolução premium

Quero uma área avançada de avaliação e evolução corporal no pacote completo. Mantenha pesquisa e integração de scanner no mapa de requisitos, mesmo se a primeira versão usar medição manual. Não elimine o módulo silenciosamente por ele ser mais difícil.

Implementar registros guiados de peso, altura, circunferências, fotos privadas opcionais, histórico e avaliações de profissionais. Preparar importação de equipamentos e serviços compatíveis quando houver documentação, direitos de acesso e validação.

Cada dado deve ter valor, unidade, data, origem, método, responsável quando aplicável, dispositivo/versão do algoritmo e incerteza. Distinguir informado pelo usuário, medido por dispositivo/profissional e estimado por algoritmo. Não apresentar estimativa com aparência de precisão laboratorial.

Câmera comum não deve gerar números fictícios de peso, percentual de gordura, músculo, gordura visceral, massa óssea ou composição clínica depois de uma animação de escaneamento. Altura e dimensões por imagem exigem método/calibração/condições e validação; não assumir centímetros confiáveis a partir de landmarks. IMC, quando aplicável e calculado com dados adequados, não substitui medida de composição corporal.

Enquanto um scanner real não estiver integrado e validado, oferecer medição manual bem orientada e mostrar o estado da integração onde pertinente. Não disponibilizar um botão que termina em números aleatórios. Comparar séries históricas com atenção a métodos diferentes e mudanças de equipamento; manter a procedência visível.

Evolução não deve reduzir a pessoa ao peso: incluir rotina, capacidade/autopercepção, mobilidade e metas acordadas. Fotos e dados corporais são privados; não alimentar publicidade, demonstrações públicas ou treinamento de modelos por padrão.

## 19. Nutrição, receitas e acompanhamento profissional

Quero receitas, sugestões diárias, organização alimentar e acompanhamento adequado ao pacote completo. Construir a área com mídia de refeições, porções e ações úteis, mantendo linguagem simples e acabamento visual tão bom quanto o treino.

Requisitos:

- Preferências alimentares e culturais, alergias, restrições, ingredientes disponíveis e tempo de preparo.
- Receitas com ingredientes, medidas, porções, preparo, fonte, imagem autorizada e substituições revisadas.
- Busca, filtros, favoritos, planejamento semanal e lista de compras com quantidades coerentes.
- Sugestões diárias estáveis e explicáveis a partir de preferências e conteúdo disponível, sem gerar nova dieta a cada reload.
- Valores nutricionais somente com base identificada e porção definida; estimativas indicadas. Alteração de porções recalcula ingredientes e valores coerentemente.
- Alergias tratadas como restrições obrigatórias; quando faltarem dados, não garantir compatibilidade nem chamar ausência de informação de “seguro”.
- Fluxo de revisão, aprovação, publicação e histórico de planos por nutricionista habilitado quando houver esse serviço real.

Educação alimentar, organização de refeições e prescrição individualizada têm escopos diferentes. Não deixar o LLM produzir dieta terapêutica automaticamente nem calcular alimentação só por peso. Conteúdo individualizado deve seguir dados, competências e revisão profissional apropriados. Não inventar profissional, credencial, consulta incluída ou plano já aprovado.

Permitir que o profissional visualize apenas alunos que autorizaram esse acompanhamento. Registrar autoria, data, revisão e versões. Mudança de receita ou plano não altera silenciosamente o registro histórico. As mesmas regras de responsabilidade, versão e acesso valem para prescrições/planejamento técnico de treino.

## 20. Studio do professor, edição e administração

O professor precisa de uma experiência extraordinária de criação, com contexto, preview e controle. Uma tabela de vídeos com contadores não atende.

Studio de autoria:

- Biblioteca de mídia pesquisável e organizada.
- Preview central real, timeline editorial e propriedades contextuais.
- Criar aula/programa, nomear, classificar, associar clipes e instruções.
- Marcar preparação, demonstração, exercício, série, descanso, explicação, alternativa, lembrete, troca e encerramento.
- Associar diferentes ângulos, áudios, legendas e versões com sincronização real.
- Definir equipamento, espaço, nível, intensidade, impacto, músculos, duração, alternativas, contraindicações/cuidados revisados e idiomas.
- Arrastar/reordenar com equivalente por teclado; desfazer/refazer e autosave quando efetivamente implementados; comunicar salvamento e conflitos.
- Prévia como aluno, com modos desktop/celular/tela grande; validar todos os eventos antes de publicar.
- Rascunho → revisão → aprovado → publicado → arquivado, com responsável e data de revisão.
- Publicação versionada; sessões antigas mantêm sua versão de referência.

Upload de vídeo real: bytes/etapas, validação, cancelamento, interrupção, retomada quando suportada, retries controlados e processamento idempotente. Diferenciar envio, transcodificação, pronto para preview e publicado. Não mostrar sucesso com arquivo faltando. Publicar somente quando ativos obrigatórios e revisão estiverem prontos.

Guia de gravação para o proprietário/professores: aulas completas, corpo visível, áudio limpo, explicações curtas, variações mais fáceis/difíceis, ângulos instrucionais úteis, legendas e clipes de ajuda. A interação deve poder levar o aluno a um professor real ensinando a alternativa, sem depender de fala sintética para tudo.

Papéis: aluno, instrutor, nutricionista, editor, suporte e administrador, com menor privilégio. Separar autoria de conteúdo, acompanhamento profissional e operação administrativa. Um editor não recebe automaticamente todo dado corporal; suporte não tem acesso irrestrito à câmera, fotos ou planos clínicos.

Administração: alunos/permissões, programas, exercícios, vídeos/processamento, receitas, revisão, idiomas, planos/benefícios, marca, base de conhecimento do assistente, suporte, auditoria e métricas. Ações destrutivas devem ter confirmação contextual e efeitos claros. Não publicar conteúdo real do proprietário nem mudar metodologia sem o fluxo de autorização correspondente.

## 21. Música, áudio e imersão sonora

Quero escolher música e criar uma experiência agradável, com voz do professor compreensível. Preparar arquitetura por capacidades: voz incorporada no vídeo, faixa musical separada, fala do assistente e sinais de interface. Só exibir volumes independentes se os arquivos/fontes realmente forem separados; slider falso não atende.

Som não começa inesperadamente. Na abertura, vídeo decorativo pode usar autoplay muted/playsInline com poster e tratamento de bloqueio. Dentro da aula, o usuário controla reprodução e volume. Sinais sonoros são breves e opcionais; áudio não é o único meio de transmitir informação.

Avaliar conexão com Spotify e outros serviços disponíveis conforme APIs, conta, permissões e direitos de uso atuais. Não prometer que qualquer música comercial pode tocar sincronizada à aula. A política Spotify consultada restringe sincronização de gravações com mídia visual e certos usos comerciais: https://developer.spotify.com/policy . Revalidar o caso de uso antes de implementar; OAuth funcionando não equivale a autorização comercial.

Um caminho a avaliar é abrir a playlist escolhida no serviço externo; isso não deve ser rotulado como reprodução integrada/sincronizada. Para música dentro da aula, usar faixas com licença adequada e documentada. Considerar alternativas de acervo próprio/licenciado sem contratar automaticamente. Não declarar Apple Music ou outro provedor funcional sem integração real.

Falha/desconexão da música não deve apagar ou interromper desnecessariamente a sessão. Tratar interrupções de áudio e prioridade da voz; não reduzir volume de outro aplicativo se o sistema não permitir. Preferências persistidas, acesso fácil e nenhum requisito de assinatura musical para treinar no modo essencial.

## 22. Todos os dispositivos: celular, tablet, computador, TV e smartwatch

Quero a plataforma presente onde o cliente estiver. Construir web responsiva/PWA quando apropriado e planejar outras superfícies por capacidade real. Responsividade não comprova aplicativo nativo universal.

Quero abrangência máxima de celulares, tablets, computadores, TVs e smartwatches, com prioridade explícita para APPLE WATCH. Trate isso como programa de produto multiplataforma com implementação e homologação por família. Não reduza relógios a um ícone no site nem TVs a um mock de televisão.

Nenhuma única tecnologia entrega todas as APIs em todo aparelho e versão já fabricados. Mantenha todas as famílias no mapa, estabeleça versões/modelos mínimos a partir de SDKs e testes, e ofereça o modo viável em cada caso. Não anunciar “funciona em todos” sem matriz que sustente a afirmação. A experiência deve aproveitar cada formato mantendo conta, catálogo, permissões e histórico consistentes.

Celular: uso com uma mão quando adequado, alvos fáceis durante o movimento, vídeo legível, poucas ações simultâneas e orientação clara. Tablet: aproveitar espaço sem esticar a UI. Computador: composição rica e interação precisa sem depender exclusivamente de mouse.

TV/tela grande: tipografia e controles legíveis à distância, foco visível, navegação por controle remoto quando suportada, poucas ações e enquadramento do professor. Oferecer modo de apresentação adequado mesmo antes de apps nativos, identificando o que foi testado.

Celular como controlador/câmera: pareamento com código/QR temporário, expiração, limitação de tentativas, autorização, revogação e isolamento entre contas. QR não contém credencial permanente. Definir controlador ativo, resolução de conflitos e estado na reconexão. A câmera do celular não deve transmitir sua imagem à TV/servidor sem escolha explícita correspondente.

Casting/AirPlay/Chromecast e apps nativos entram conforme tecnologias realmente disponíveis e documentação atual. Registrar matriz dispositivo/navegador/versão/recurso/teste. Uma tela redimensionada não valida TV, controle remoto, casting, sensores ou autoplay de hardware real.

Modo offline, se implementado, respeita direitos de mídia, expiração de acesso, cache e sincronização. Não guardar indiscriminadamente fotos corporais, credenciais ou dados sensíveis em cache. Sem offline pronto, apresentar reconexão clara e manter progresso confirmado.

### 22.1 Matriz de plataformas e estratégia de execução

| Família | Experiência a construir | Implementação/validação exigidas |
| --- | --- | --- |
| iPhone/iPad | Descoberta, treino, câmera opcional, controle e histórico | Web/PWA e aplicativo com integrações nativas quando necessário; Safari, safe areas, orientação, teclado, vídeo e permissões |
| Android celular/tablet/dobrável | Mesmos fluxos adaptados ao espaço e capacidade | Web/PWA e app apropriado; navegadores suportados, tamanhos, dobra, recursos e permissões |
| Windows/macOS/Linux | Experiência web completa e autoria do professor | Navegadores suportados, teclado/mouse, vídeo, multiwindow quando aplicável e acessibilidade |
| Apple TV/tvOS | Vídeo em destaque e comandos claros à distância | App/integração adequada a tvOS, foco/controle remoto, lifecycle e vídeo; AirPlay é caminho distinto |
| Android TV/Google TV | Catálogo, aula e controle remoto | App próprio/stack compatível e APIs de mídia; Cast é integração distinta com emissor/receptor |
| Samsung Tizen TV | Aula e navegação por foco | App empacotado/SDK e APIs do modelo; certificado, codecs, engines e dispositivo real |
| LG webOS TV | Aula e navegação por foco | App e APIs do webOS, diferenças por geração de engine, lifecycle e mídia |
| Fire TV/Roku/outras TVs | Cobertura planejada do ecossistema | Adaptador/app conforme SDK e distribuição do fabricante; registrar disponibilidade e hardware pendente |
| Apple Watch | Mesma composição/efeitos proporcionais nas telas correspondentes, mais controle, tempo/fase, hápticos e dados autorizados | App watchOS e renderização nativa viável, HealthKit e comunicação adequada; testar fidelidade e capacidades |
| Wear OS, incluindo modelos compatíveis Galaxy Watch/Pixel Watch | Mesma composição proporcional, controle, sessão e sensores autorizados | App Wear OS, renderização adequada e Health Services; Health Connect no contexto Android quando necessário |
| Garmin e outros relógios/pulseiras | Funcionalidade possível pela plataforma | SDK/API oficial disponível e elegibilidade; distinguir app, importação posterior e dados ao vivo |

A matriz inclui marcas/famílias para cobertura, não promete todas as funções em todos os modelos. Fitbit, Huawei, Amazfit, dispositivos antigos ou ecossistemas fechados entram como alvos a avaliar por API/SDK vigente, autorização e condições comerciais. Se só houver importação posterior, explicar isso; não rotular como acompanhamento ao vivo. Aparelho sem capacidade de executar a plataforma pode participar por integração ou tela/controlador compatível, com limitações claras.

Fontes oficiais de implementação: https://developer.apple.com/tvos/ ; https://developer.android.com/tv ; https://developers.google.com/cast/docs/overview ; https://developer.samsung.com/smarttv/develop/getting-started/quick-start-guide.html ; https://developer.samsung.com/smarttv/develop/specifications/web-engine-specifications.html ; https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine ; https://developer.garmin.com/connect-iq/overview/ . Revalidar SDKs/lojas das demais famílias antes de decidir tecnologia. Não copiar tutoriais antigos como garantia de stack atual.

### 22.2 Apple Watch como experiência prioritária

Criar um app de watchOS adequado ao pulso, preferencialmente com tecnologias nativas apropriadas como SwiftUI/HealthKit após decisão de arquitetura. Uma WebView/PWA reduzida não deve ser apresentada como integração completa com Apple Watch.

UX pretendida: preservar as telas, composição e efeitos visuais correspondentes em proporção compacta, conforme seção 22.5, e oferecer ver sessão/programa, iniciar/conectar, consultar etapa/tempo, pausar/retomar, hápticos opcionais e métricas autorizadas. Não substituir automaticamente a plataforma por um painel de cronômetro porque o dispositivo é um relógio. Avaliar e implementar mídia, cenas e entrada de dados pelas capacidades nativas disponíveis, demonstrando limites reais em vez de excluir essas experiências por convenção de design.

Avaliar HKWorkoutSession e HKLiveWorkoutBuilder para atividade e dados; espelhamento de sessão com o companion iOS quando suportado; WatchConnectivity para comunicações adequadas entre apps pareados quando pertinente. Não tratar comunicação local com iPhone como conexão automática com qualquer TV. Para exibir dados na web/TV, desenhar ponte autorizada e contrato de sessão através do app/serviço, com baixa quantidade de dados necessária.

Referências: https://developer.apple.com/documentation/healthkit/build-a-workout-app-for-apple-watch ; https://developer.apple.com/documentation/healthkit/building-a-multidevice-workout-app ; https://developer.apple.com/documentation/watchconnectivity ; https://developer.apple.com/watchos/ .

Permissões granulares: ler dados autorizados e gravar treino apenas quando permitido. Frequência cardíaca ausente não é zero; estimativas de energia/calorias têm origem/método e não viram precisão clínica. Não exigir todos os dados de saúde para disponibilizar controles básicos. Não exportar todo o histórico de saúde por conveniência nem usar sensores para inferir diagnósticos.

Uma sessão de produto, identificador comum e responsabilidades explícitas entre motor da aula e sessão HealthKit. O relógio fornece estado/sensores da atividade; o player define progresso da mídia. Não deixar ambos creditarem a mesma execução independentemente. Pausa da mídia por buffering e pausa do registro no relógio precisam de uma política documentada; nem todo buffering significa cessação física. Mostrar estados coerentes sem inventar equivalência entre tempo de vídeo e tempo de exercício registrado.

Sincronização com ID e versão, timestamps, comando idempotente, confirmação de entrega e deduplicação. Garantir que concluir no dispositivo controlador encerre ou reconcilie a sessão correspondente no relógio conforme APIs disponíveis; não deixar coleta ativa inadvertidamente. Salvar uma única atividade de destino e evitar duplicação ao importar o mesmo treino de volta.

Testar relógio desconectado, iPhone ausente, app em background, permissão parcial/revogada, sensor sem leitura, bateria baixa, atualização e conflito entre comandos. Não repetir comandos antigos ao reconectar. Operação independente do iPhone, quando desejada, precisa de caminho próprio permitido e testado; não a anunciar por padrão.

O ambiente atual pode ser Windows. Gerar arquivos Swift não comprova compilação watchOS/iOS. Identificar necessidade de macOS/Xcode, assinatura/conta de desenvolvimento e dispositivos físicos; documentar e executar em ambiente disponível/autorizado. Sem ele, concluir contratos, código possível e testes independentes, marcando build/dispositivo pendentes. Não comprar conta nem alegar publicação em loja sem autorização.

### 22.3 Wear OS e outros ecossistemas

Wear OS: usar Health Services para capacidades de exercício/sensores disponíveis no relógio e Health Connect para os casos de compartilhamento de dados no Android. São papéis diferentes. Consultar suporte por API/modelo, permissões, execução em background e energia. Fontes: https://developer.android.com/health-and-fitness/health-services ; https://developer.android.com/health-and-fitness/health-connect .

Reaproveitar conceitos e contratos do domínio entre Apple Watch e Wear OS, sem fingir que bibliotecas JS da web executam APIs nativas do relógio. Para Garmin e demais fabricantes, separar consulta de histórico, controle em tempo real e aplicativo instalável. Não presumir que relógio Bluetooth genérico expõe dados ao navegador. Cada integração terá consentimento, origem de dados, limites e testes próprios.

### 22.4 Continuidade entre dispositivos e responsividade de verdade

Criar um contrato de capacidades: vídeo, controle remoto, touch, teclado, háptico, sensor, câmera, áudio, background, offline e qualidade gráfica. Detectar capacidades e respeitar preferências; não depender apenas de user-agent ou largura da tela.

Separar contextos de marketing, treino e monitoramento como módulos de produto, preservando a mesma composição das telas correspondentes em todos os dispositivos. O usuário pode escolher o programa no celular, abrir a aula na TV e controlar pelo relógio quando a integração estiver pronta. Conta e plano são comuns; não exigir nova assinatura para cada dispositivo salvo futura política explicitamente definida.

Para cada tela, especificar hierarquia, navegação, entrada, reenquadramento da mídia, densidade, áreas seguras, orientação e fallback. Testar telas estreitas/largas, retrato/paisagem, teclado aberto, split view, texto ampliado, ponteiro grosseiro/preciso, foco remoto e mudança de viewport durante animação. Breakpoints surgem do conteúdo; não apenas 3 screenshots de larguras arbitrárias.

Sessão compartilhada com controlador autorizado, acknowledgement de comandos, versão esperada, reconciliação e estado de conexão legível. Perda de sincronização não permite mostrar um botão como aplicado enquanto o outro dispositivo continua executando. Oferecer controle local de pausa onde possível e explicar a conexão sem linguagem de protocolo ao aluno.

Criar docs/DEVICE-MATRIX.md com plataforma/versão/modelo, recursos pretendidos, app ou navegador, situação da implementação, teste emulado/real, limitações, dependência e próximo passo. Compatibilidade comercial só para combinações verificadas. Desempenho visual máximo nos aparelhos capazes; experiência essencial cuidada nos limitados. Não excluir uma família do mapa só porque falta o hardware neste momento.

Se houver apps nativos e venda digital, revisar regras vigentes de cada loja sobre assinatura, billing e acesso antes de implementar checkout interno. Reconciliar benefícios no backend por canal autorizado e não presumir que um checkout web pode ser embutido em toda loja.

### 22.5 Fidelidade visual e efeitos: mesma experiência, proporções ajustadas

Esta é uma preferência explícita do proprietário e substitui recomendações anteriores de uma identidade móvel independente ou de simplificação automática da experiência do relógio. O exemplo “lado a lado” serve para expressar consistência; não é uma ordem literal de manter todo bloco em duas colunas em qualquer tamanho.

Regras invariantes:

1. Mesma identidade, intenção da composição, sequência narrativa, hierarquia, presença dos elementos principais, efeito de passagem e destino reconhecível em cada tela correspondente.
2. Não fixar número de colunas com base no exemplo do proprietário. Ajustar organização quando o formato exigir, preservando relações, peso visual e compreensão. Não trocar automaticamente uma experiência elaborada por uma lista genérica, remover sua cena principal ou empobrecer a navegação.
3. Ajustar proporções de áreas, escala de mídia/objetos, espaçamentos, margens, tipografia e densidade interna, preservando hierarquia e relação entre os blocos. Reflow e quebras de linha são permitidos quando necessários para leitura e uso; a mudança deve manter a identidade e a continuidade.
4. Manter os mesmos momentos e intenção do movimento: perspectiva, profundidade, aproximação, máscara, continuidade e resposta. Otimização deve começar em resolução, nível de detalhe, materiais, quantidade de elementos auxiliares e custo de render, não na eliminação da assinatura visual.
5. A mesma ação deve produzir a mesma consequência e feedback. Mouse, toque, controle remoto e coroa/botões usam meios equivalentes para acionar a interação. Nenhuma ação essencial depende apenas de hover; a adaptação do gesto não deve mudar o desenho fundamental.
6. Conteúdo, cores, imagens, ícones, estados e permissões correspondem entre dispositivos. Não mostrar uma versão de marca elaborada no PC e um produto visualmente diferente no celular.

Crie uma composição de referência descrita por regiões/âncoras, hierarquia e proporções, com tokens e perfis de adaptação por categoria. Prototipe sua viabilidade simultaneamente em PC, TV, celular, tablet e smartwatch desde a exploração criativa. Escolha uma direção que consiga se manter reconhecível e compacta; não desenhe tudo para desktop para depois descobrir que não cabe.

Não resolver com screenshot da tela desktop nem transform: scale aplicado sobre um layout fixo inteiro: controles, texto, foco e coordenadas precisam continuar reais, legíveis e acionáveis. Evitar encolher texto até ficar ilegível. Se a composição fiel exigir leitura de detalhe, oferecer ampliação/foco temporário solicitado pelo usuário, preservando o estado e a composição original ao voltar. Esse recurso não autoriza substituir por padrão a estrutura que foi solicitada.

Em telas arredondadas/pequenas, respeitar áreas seguras e testar recortes sem perder as áreas principais. Relacione o campo da câmera e o enquadramento ao espaço disponível, mantendo a pose e a passagem reconhecíveis. Não deformar pessoas/objetos para caber numa razão de aspecto diferente.

O código do efeito pode variar: um renderer web e um renderer nativo podem realizar a mesma coreografia. Não prometer que GSAP/Three.js executa diretamente em toda API de watchOS. Verificar qual implementação nativa mantém a intenção. Pré-renderização pode ser avaliada para trechos sem interação se direitos e qualidade permitirem; não substituir uma cena interativa por filme e alegar interatividade preservada.

Valide quadros equivalentes no início, meio e fim da mesma transição, com a mesma mídia/dados, lado a lado entre as categorias. Confira relações dos blocos, direção, sequência, legibilidade, alvos, desempenho e funcionamento. Registrar divergências em docs/DEVICE-MATRIX.md. Comparação de screenshots não prova todos os efeitos: observar execução nos clientes correspondentes.

O objetivo é paridade de identidade, riqueza visual e experiência; impossibilidade de hardware/API deve ser demonstrada e registrada com alternativa mais fiel possível, não mascarada como suporte completo. Não descaracterizar a composição por aplicar um template usual de mobile. Se houver conflito inevitável entre efeito desejado, leitura e recurso disponível, produzir a alternativa concreta para decisão do proprietário enquanto avança nos demais alvos.

Preferência explícita de acessibilidade do usuário, como movimento reduzido ou texto ampliado, continua disponível: é uma escolha de uso, não uma degradação automática por categoria. Configuração padrão entre dispositivos deve manter a fidelidade acordada dentro das capacidades efetivamente validadas.

## 23. Internacionalização e acessibilidade

A ambição é alcance internacional. Preparar textos externalizados, plurais, datas, fusos, moedas/unidades, formatos, fontes e direção RTL. PT-BR pode ser a primeira experiência completa; a arquitetura não deve limitar expansão a uma lista fixa de idiomas.

Distinguir disponibilidade de idioma para interface, catálogo, legenda, áudio da aula, voz/assistente e suporte humano. Seletor com bandeiras não significa tradução completa. Tradução automática exige revisão apropriada, especialmente instruções de exercício e saúde. Preserve idioma original/fallback e não fingir que todos os vídeos têm todos os áudios.

Acessibilidade faz parte da qualidade: teclado, foco, leitores de tela, contraste, zoom/texto ampliado, legendas, alvos adequados, pausa de movimento, reduced-motion e alternativas a gestos/voz/câmera. Restaurar foco ao fechar overlay; anunciar estados relevantes sem leitura excessiva a cada segundo de cronômetro. Não transmitir exercício apenas por cor, som ou animação.

Respeite preferências do sistema e ofereça ajustes simples. Em telas pequenas/reduced-motion/sem WebGL, mantenha composição cuidada e o conteúdo completo. O fallback deve ser uma experiência projetada, não um erro ou uma página vazia.

## 24. Assinaturas acessíveis, valor real e acesso premium

### 24.1 Direção comercial do proprietário

Quero uma assinatura que chame atenção pelo que entrega e seja percebida como uma escolha acessível para treinar em casa. Não quero posicionar a mensalidade principal perto do preço de uma academia. Quero que o cliente sinta que recebeu muito pelo que pagou e que a empresa preserve margem para conteúdo, tecnologia, atendimento e crescimento.

Transforme essa intenção em valor real com custo marginal controlado: experiência excelente, aulas úteis, conveniência, orientação, continuidade e reconhecimento. A vantagem do cliente deve existir. Não interprete persuasão como autorização para inventar descontos, esconder cobranças ou prometer benefícios sem capacidade de entrega. O ganho da empresa vem da eficiência, retenção e escala sustentável.

O preço acessível é uma restrição de projeto. Desenvolva a visão completa e preserve sua arquitetura, mas diferencie recurso implementado de serviço comercialmente disponível. Nenhum número deste briefing é autorização para publicar uma oferta ou cobrar. O exemplo antigo de R$99,90 foi retirado das simulações vigentes: não é referência para a mensalidade desejada. As hipóteses desta seção prevalecem sobre preços e pacotes sugeridos antes.

### 24.2 Referências de mercado e interpretação correta

Consulta de páginas oficiais em 11/09/2026, para orientar a decisão; preços podem mudar e não foram validados mediante compra:

| Referência | Informação anunciada | Leitura para este projeto |
| --- | --- | --- |
| Smart Fit, plano Smart | Mensalidade a partir de R$119,90 | Referência de academia presencial; verificar unidade, oferta e contrato. Não representa todas as academias. |
| Apple Fitness+ Brasil | R$29,90 mensal ou R$149,90 anual | Já existe concorrência digital com preço baixo; o anual equivale aritmeticamente a cerca de R$12,49 por mês, mas é outra modalidade de contratação. |
| Queima Diária | R$39,90 por mês em oferta de acesso anual | A página associa o preço ao acesso anual. Conferir checkout, total e condições antes de afirmar mensalidade sem compromisso. |

Fontes: [Smart Fit — plano Smart](https://ajuda.smartfit.com.br/hc/pt-br/articles/360051873731-O-que-%C3%A9-o-plano-Smart), [Apple Fitness+ Brasil](https://www.apple.com/br/apple-fitness-plus/), [Queima Diária — assinatura](https://www.queimadiaria.com/assinar/).

Inferência de produto: ser mais barato que uma academia ajuda no posicionamento, mas não prova vantagem diante de aplicativos e conteúdo gratuito. O diferencial precisa ser percebido na primeira sessão e no retorno: pessoas reais, didática, adaptação ao tempo disponível, interatividade pertinente, funcionamento confiável e continuidade nos dispositivos suportados. Não afirmar que preço baixo, IA ou animações garantem liderança ou maior retenção.

Não importar o preço anual de um concorrente como piso sustentável desta empresa. Sua escala, custos, ecossistema e estratégia podem ser diferentes. Comparações públicas exigem base equivalente e atualização; evitar “mais barato que qualquer academia” e promessa universal de substituir todo treino presencial.

### 24.3 Oferta simples: duas hipóteses mensais para testar

Começar com dois planos claros na apresentação pública, sem criar um terceiro apenas para induzir a escolha de outro. Manter arquitetura flexível para futuros pacotes, países e períodos. Nomes provisórios:

| Plano em estudo | Hipótese mensal | Experiência e benefícios propostos |
| --- | ---: | --- |
| Essencial | R$29,90 | Aulas e programas publicados incluídos na oferta; explicações; histórico; recomendações por perfil, preferências e regras; experiência cinematográfica; motor de sessão com pausas, retomada, lembretes e controles; continuidade entre dispositivos homologados; conquistas digitais. |
| Completo | R$49,90 | Tudo do Essencial; assistência generativa contextual e voz com franquias explícitas; personalização ampliada; receitas e organização alimentar revisadas; recursos corporais e de visão somente quando disponíveis e validados, com suas limitações; acesso a benefícios físicos apenas conforme programa específico financiado e descrito na seção 34. |

Estes valores são hipóteses para protótipos e pesquisa, não preços aprovados ou lucro comprovado. Simular também valores abaixo e acima, sem publicar todos como confusão de ofertas. Um preço menor pode exigir outra composição de custos; um preço maior precisa de valor demonstrável. A diferença de R$20 entre as hipóteses deve financiar o custo incremental dos serviços do Completo.

O Essencial precisa ser satisfatório por si só. A mesma identidade, qualidade das aulas incluídas, motion, navegação, acessibilidade e respeito ao aluno se aplicam aos dois planos. Não tornar a experiência básica feia, lenta ou interrompida para forçar upgrade. Recursos de segurança, controle da sessão, privacidade, suporte de acesso e cancelamento não dependem de pagar mais. Preservar a regra de fidelidade visual da seção 22.5.

O Completo concentra as funções avançadas solicitadas; isso não equivale a consultas ilimitadas com profissionais humanos. Separar conteúdos elaborados/revisados por profissionais, assistência por software e consulta individual efetiva. Se houver consulta, definir prestador, escopo, disponibilidade, quantidade e custo. Desenvolver o fluxo para contratação adicional ou pacote próprio quando a economia exigir. Não anunciar “nutricionista e personal exclusivos 24 horas” para descrever um chatbot.

Oferecer demonstração útil com uma seleção pequena de aulas ou um trial configurável. Duração, cartão, cotas e renovação permanecem em estudo. Calcular custo por teste iniciado e convertido, incluindo vídeo, IA e suporte. Não embutir prêmio físico no trial. Se houver cobrança inicial reembolsável, descrevê-la dessa forma; não chamar de teste sem cobrança.

Manter mensalidade recorrente como opção central desejada. Plano anual é uma alternativa futura: mostrar total, período, condições, eventual parcelamento e renovação. Uma divisão do anual por doze é apenas equivalência mensal; não é mensalidade cancelável sem compromisso. O desconto precisa ser recalculado contra custos futuros e recompensas. Não inventar preço anual agora nem presumir que receita antecipada inteira está livre para gastar.

### 24.4 Engenharia de custo sem perder a imersão

Fazer a plataforma parecer presente por meio de produção audiovisual, eventos da aula, motor determinístico e respostas adequadas. Cronômetros, pausa, retomada, instruções gravadas, alternativas previstas e lembretes não precisam acionar IA generativa a cada segundo. Identificar conteúdo gravado e assistência automática com honestidade, sem simular um professor humano assistindo ao vivo.

Reservar IA generativa para dúvidas e decisões em que agrega valor. Medir consumo, latência e custo por funcionalidade. Reutilizar conteúdo editorial e recursos não sensíveis, processar localmente quando viável e validado, escolher modelos adequados ao trabalho e evitar inferência contínua de câmera na nuvem como padrão. Não compartilhar caches que exponham dados pessoais de outra pessoa.

Não diminuir unilateralmente um benefício vendido para caber na margem. Antes da compra, explicar a franquia de voz/assistência em unidades compreensíveis e mostrar saldo quando relevante. Avisar previamente sobre limite; não interromper o exercício com cobrança. O modo essencial da aula continua funcionando quando a cota termina ou o provedor falha. Excedente pago exige adesão explícita; não debitar automaticamente sem autorização.

Streaming adaptativo, cache, carregamento progressivo, produção reutilizável e processamento assíncrono podem reduzir custo mantendo qualidade. Medir o resultado em TV, celular e demais alvos: economia não deve tornar o vídeo ilegível, a transição travada ou a interface descaracterizada. Custos de edição, direitos, tradução, profissionais e manutenção dos aplicativos também precisam ser pagos; reutilização não torna a produção gratuita.

### 24.5 Modelo financeiro e validação de preço

Aplicar avora-financeiro-compliance #0306, Framework de Análise de Precificação e Margem, e #0484, Framework de Unit Economics, junto aos métodos da seção 34. Ler os procedimentos e adaptar ao SaaS de treino. Registrar aplicação e artefatos. Razões LTV/CAC ou prazos sugeridos nos métodos são heurísticas, não dados deste negócio.

Usar receita líquida e margem conforme a seção 34.6, evitando contar a mesma dedução duas vezes. Modelar por plano, canal de cobrança, país e coorte: tributos aplicáveis, gateway/loja, reembolso, inadimplência, vídeo, IA/voz, comissões, suporte, direitos de conteúdo, custo de recompensas e recuperação de aquisição. Separar custos variáveis, fixos, investimentos iniciais e necessidade de caixa; margem de contribuição não é lucro líquido.

Calcular custo de sessão e de pagante com consumo observado, incluindo mediana, percentil 90/95 e grupos de uso intensivo. Testar base pequena, maior ativação, consumo alto de voz/vídeo, frete caro, perda de patrocinador, cancelamento precoce, 100% de resgate elegível e zero crescimento. Não construir a margem supondo que a maioria pagará sem usar o produto.

Contribuição disponível após recompensas = receita líquida − custos variáveis − provisão de recompensas. Ponto de equilíbrio operacional simplificado = custos fixos do período ÷ contribuição média ponderada positiva por pagante. Se somar um orçamento de aquisição separado no numerador, não descontá-lo novamente no denominador. Explicitar mix de planos, capacidade, prazo e itens excluídos. Para recuperar o investimento inicial ou atingir lucro planejado, ampliar o modelo; equilíbrio operacional sozinho não resolve ambos.

O upgrade precisa ser analisado pela diferença de receita líquida menos a diferença de custos e provisões. Não assumir que todos os compradores do Completo usam como os do Essencial. Estimar CAC por canal e contribuição de coortes observadas; projeção de permanência e LTV é hipótese enquanto faltar histórico.

Validar os preços com pesquisa de disposição a pagar, demonstração e, quando autorizado o lançamento, coortes de assinantes reais. Acompanhar conversão paga, ativação, retorno, cancelamento, reembolso, pedidos de suporte e margem. Escolher a oferta pela combinação de satisfação, retenção e sustentabilidade, não pelo maior número de cadastros. Não realizar cobrança real como se fosse uma enquete.

Entregar um simulador interno com entradas editáveis, fontes, hipóteses e cenários; não apenas uma tabela fixa que sempre conclui que o negócio é lucrativo. Quando faltar custo, marcar a lacuna e manter conclusão condicional. As contas didáticas da seção 34.7 não substituem orçamento de fornecedor ou tributação validada.

### 24.6 Valor percebido, apresentação e condições

Construir valor mostrando o que funciona: prévia real de uma aula, clareza sobre o que cabe no tempo do cliente, apresentação dos professores reais, continuidade, evolução e programa organizado. Escolher benefícios que entregam conveniência e prazer com boa eficiência operacional. Brindes complementam o produto e têm critérios; não tratá-los como retorno financeiro da assinatura.

Na tela de planos: diferença clara, preço legível, periodicidade, benefícios disponíveis, limites materiais e botão com ação inequívoca. Usar “mais escolhido” somente quando houver dado real; enquanto isso, “recomendado para…” exige explicar a adequação. Não usar preço riscado sem base verificável, cronômetro que reinicia, escassez falsa, depoimento fictício, opção cara artificial ou valor monetário inventado para inflar uma lista de bônus.

Ancoragem deve comparar opções reais. Não somar preços de consultas individuais que não estão incluídas para afirmar que a assinatura “vale milhares”. Mostrar cobrança, renovação, trial e condições de forma clara; o CDC exige clareza na oferta e veda publicidade enganosa, inclusive por omissão. [Código de Defesa do Consumidor, arts. 30, 31 e 37](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm).

Uma frase de posicionamento a desenvolver, sem fixá-la como identidade final: “Seu treino, no seu tempo. Uma experiência completa para cuidar de você em casa.” Preços só entram nessa comunicação quando aprovados. O objetivo é o cliente recomendar porque gostou de usar e percebeu benefício real.

### 24.7 Implementação comercial e critérios de aceite

Centralizar nomes, preços por moeda/canal, períodos, trial, benefícios, cotas e disponibilidade em configuração versionada. Entitlements no servidor, inclusive acesso direto à API, mídia privada e operações premium. Bloqueio visual não é segurança. A data de vigência e a política de alteração preservam ofertas e direitos já contratados.

Implementar em ambiente de teste: checkout, confirmação por servidor, status, trial com/sem cartão conforme suporte do provedor, cupons válidos, upgrade/downgrade, expiração, falha de pagamento, cancelamento, fim de período e portal. Verificar assinatura dos webhooks, idempotência, duplicação, eventos fora de ordem e reconciliação. Redirect do cliente não confirma pagamento.

Testar que preço, moeda, intervalo e total vistos antes de contratar correspondem ao pedido e ao provedor; que limites anunciados correspondem ao servidor; que nenhum teste cobra automaticamente sem condições e consentimento aplicáveis; que cancelar é acessível; e que cancelamento/downgrade não apaga conquistas nem obrigações já constituídas. Conta demo não concede atalhos de privilégio em produção.

Não interromper esforço com upsell. Suporte e cancelamento devem ser fáceis de encontrar. Registrar métricas agregadas de custo/qualidade sem usar dados de saúde para manipular ofertas individuais. A interface pública de assinatura deve refletir o catálogo real de serviços disponíveis.

Sem credenciais/provedor, entregar adaptador, testes locais e pendências precisas. Não efetuar cobranças reais, contratar serviços ou afirmar operação comercial homologada porque o checkout de teste abriu. Entregar o módulo e a oferta em rascunho para decisão comercial, mantendo a construção das demais experiências em andamento.

## 25. Arquitetura, dados e código limpo

Escolha stack atual e estável após inspecionar o ambiente, justificando integração, manutenção, execução local e custo. Recomendações antigas específicas para Lovable não obrigam Lovable Cloud/Supabase nem qualquer framework. Evite complexidade distribuída sem necessidade; uma arquitetura modular bem definida pode atender à primeira operação.

Separe interface/conteúdo, sistema visual/motion, mídia/player, motor de sessão, recomendação, assistência, dados corporais, nutrição, autorização/comercial e autoria. Componentes pequenos com responsabilidades claras; tokens e configurações centralizados; contratos tipados e schemas de entrada. Evite arquivos gigantes, estado global indiscriminado, listeners duplicados, números mágicos e !important acumulado.

Entidades a modelar conforme domínio: usuário/perfil/preferências/consentimentos; papéis/permissões; profissional e vínculos autorizados; exercício/clipe/ângulo; aula/versão/evento; programa/calendário; sessão/evento/série/registro; medida corporal/procedência; receita/ingrediente/plano/revisão; assinatura/benefício/evento de provedor; mídia/processamento; tradução; pareamento; auditoria. Definir chaves, relações, constraints, índices, fusos e unidades, sem modelar um sistema clínico amplo que não foi solicitado.

Dados persistentes em banco no servidor. Migrações reproduzíveis, seeds de demonstração identificados e restritos ao ambiente de desenvolvimento. Novos dados não se misturam aos bancos antigos. Conta demo não cria um bypass de autenticação em produção.

Um provedor principal de vídeo justificado: upload, transcodificação, streaming adaptativo, CDN, thumbnails, legenda, áudios e autorização. Evitar múltiplos provedores redundantes. Adaptadores permitem substituição futura sem espalhar lógica. URLs de mídia privada com acesso/expiração apropriados, sem prometer impedir toda gravação de tela.

Serviços externos de pagamento, IA, voz, e-mail e visão com contratos, status, idempotência quando aplicável e credenciais no servidor. Chaves não entram no bundle, repositório, logs, capturas ou URLs. .env.example contém somente nomes e exemplos não secretos. Documentar variáveis obrigatórias/opcionais e funcionamento sem cada integração.

Erros compreensíveis no produto e rastreáveis na operação. Logs estruturados sem dados sensíveis, IDs de correlação e métricas de falha/latência. Timeouts, retries limitados e cancelamento. Dependência indisponível não pode corromper estado nem ser camuflada por um sucesso falso.

### 25.1 Contratos de engenharia e critérios por módulo

Antes de espalhar a implementação, documente fronteiras e responsabilidade por dado. Em um monorepositório, separar apps web/mobile/watch/TV e pacotes compartilhados quando fizer sentido; compartilhar contratos e regras testáveis sem forçar um mesmo componente de interface a executar em todos os sistemas.

APIs ou serviços equivalentes precisam cobrir autenticação/perfil, catálogo/versionamento, recomendação/calendário, sessão/comandos/eventos, mídia/processamento, autoria/revisão, receitas/medidas, autorização comercial, pareamento/dispositivos e suporte. Definir entrada/saída, autenticação, autorização por objeto, paginação, validação, erros, idempotência e estratégia de evolução. Escolha nomes reais durante a implementação; não invente endpoints de fornecedores a partir desses domínios.

Um comando de sessão, por exemplo, precisa identificar sessão, dispositivo controlador, ID único, tipo de ação e versão esperada. O servidor/autoridade designada deriva a identidade do usuário da autenticação, valida permissão e estado, aplica uma única vez e devolve estado/versionamento confirmado. Não confiar em userId ou papel enviados livremente pelo cliente. Dados de sensores têm timestamp, unidade, origem, qualidade quando disponível e vínculo autorizado; não se confundem com comandos.

Operações assíncronas de mídia e cobrança devem ter estado observável, correlação e recuperação. Documentar como um retry reutiliza a identidade da operação, como tratar mensagem fora de ordem e como reconciliar divergência com o provedor. Publicação é uma transição controlada, não um booleano que qualquer cliente pode alterar.

Recomendação tem entradas conhecidas, elegibilidade e versão/regra registrada. Persistir a seleção do dia e distinguir uma atualização solicitada de uma regeneração involuntária. Entitlements e serviços profissionais não dependem de textos enviados pelo LLM.

Planejar autenticação e armazenamento seguro específicos do cliente nativo, evitando transportar cookies/token de longa duração para QR ou scripts. Selecionar fluxos oficiais de autenticação apropriados e confirmar requisitos de deep links, retorno do app e expiração. Não embutir secrets de serviço em apps distribuídos.

### 25.2 Cenários de aceite no formato dado/quando/então

- Dado um aluno com 15 minutos e sem equipamento, quando escolhe adaptar o treino, então recebe uma opção aprovada que realmente cabe nesses critérios ou uma explicação de indisponibilidade; o sistema não inventa um programa.
- Dada uma série em reprodução, quando ocorre buffering, então instrução, mídia e progressão seguem a política definida e o retorno não duplica eventos.
- Dada uma prévia pública já assistida pela metade, quando o aluno inicia uma aula nova, então a sessão começa no ponto correto e sem crédito herdado.
- Dada uma sessão em TV conectada ao relógio, quando o aluno pausa no relógio, então o comando tem resultado confirmado ou falha/conexão claramente apresentada; após reconectar, uma ação obsoleta não reinicia o treino.
- Dado o término de uma sessão integrada ao wearable, quando mensagens de conclusão se repetem, então o histórico e a exportação de atividade não ganham duplicatas.
- Dado um aluno sem permissão de saúde/câmera, quando começa a aula, então mantém os controles e a orientação essenciais, com sensores ausentes tratados como indisponíveis.
- Dada uma aula em rascunho com upload incompleto, quando o editor tenta publicar, então vê o bloqueio específico e continua editando; nenhum aluno recebe uma versão quebrada como publicada.
- Dada uma alteração de plano/reembolso/cancelamento, quando chegam eventos repetidos ou fora de ordem, então o estado comercial é reconciliado sem conceder benefício indevido.
- Dada uma receita sem informação suficiente sobre um alergênico relevante, quando ocorre recomendação, então ela não é apresentada como comprovadamente compatível.

Converta os cenários em testes nos níveis adequados. Acrescente cenários próprios do código e dos provedores escolhidos. Não trate a lista como substituta de investigar falhas reais.

### 25.3 Planejamento técnico e operação sustentável

Registre decisões de arquitetura com alternativa, motivo e trade-off. Estime esforço por módulo/dependência e custos de vídeo/armazenamento/IA/voz por cenários explícitos de uso, consultando preços vigentes se precisar de valores. Não invente prazo, número de usuários simultâneos ou custo mensal garantido.

CI com checks relevantes, ambientes isolados e mecanismo de feature flags/capacidades para integrações em evolução. Deploy local reproduzível e staging quando autorizado; migrações com recuperação, observabilidade e rollback. Configurações editáveis pelo negócio devem ter validação e trilha de alteração, sem permitir que um ajuste de plano ou conteúdo quebre uma sessão em curso.

Considerar abuso de trial, custos de assistência, uploads inválidos e acesso concorrente com controles proporcionais. Não construir microserviços, filas ou infraestrutura excessiva só para parecer profissional. O nível de engenharia deve resultar em manutenção previsível, bom comportamento e experiência fluida.

## 26. Privacidade, segurança e operação

Implementar isolamento entre usuários e menor privilégio. Autenticação, sessão, recuperação, validação de entrada, limitação de tentativas e proteção de arquivos privados apropriadas à stack. Testar acesso por ID/URL e APIs sem depender apenas de esconder botões.

Consentimentos de câmera, microfone, dados corporais, fotos e acompanhamento com finalidade, revogação e retenção claras. Revogar desliga dispositivos e impede uso futuro correspondente. Minimizar armazenamento; dados derivados também podem ser sensíveis. Não reutilizar imagens/voz para treinar modelos por padrão.

Exportação/exclusão com fluxo real, considerando banco, arquivos e política de backups/retorno de restauração. Auditoria de acesso e alterações relevantes. Backups com teste de restauração em ambiente isolado; procedimentos de publicação e reversão documentados, sem deploy produtivo automático.

Dados corporais, sintomas, fotos, voz e dieta fora de publicidade e gravação de sessão/replay por padrão. Analytics de produto deve usar o mínimo necessário. Requisitos legais e profissionais aplicáveis aos países atendidos precisam de revisão adequada antes do lançamento, sem alegar certificação ou conformidade apenas por possuir uma política escrita.

## 27. Desempenho e qualidade perceptível

Meça baseline da nova implementação e ajuste budgets de mídia, JavaScript, cena e inferência por dispositivo. Não deixe vídeo principal esperar o download de todos os assets 3D. Poster imediato, dimensões reservadas, carregamento progressivo, compressão e formatos compatíveis. Lazy load do que não é essencial; poucos clipes carregados de cada vez.

Controle DPR, geometria, textura, luz e pós-processamento. Preparar shaders/recursos antes da transição quando apropriado. Descartar recursos/listeners ao sair. Não criar vídeo/contextos WebGL duplicados desnecessariamente nem leitura/escrita de layout a cada frame. Renderização cessa quando fora de tela ou estável se a técnica permitir.

Objetivo de interação fluida com medição real; não declarar 60 fps por estimativa. Conferir jank, latência de controle, tempo até vídeo, buffering, consumo de bateria e custo da visão local. Preferir degradar efeitos de forma coerente a comprometer a aula.

Buscar LCP ≤2,5 s, INP ≤200 ms e CLS ≤0,1 no percentil 75 em dados de campo quando existirem. Teste local é diagnóstico, não prova dessas métricas em produção. Fonte: https://web.dev/articles/vitals . Defina cenário de teste e dispositivo; não prometer metas sem evidência.

## 28. Critérios de experiência que fazem a pessoa voltar

Avalie cada decisão contra meu objetivo de uma experiência desejável em casa e no tempo disponível:

| Momento | Resultado esperado | Evidência a buscar |
| --- | --- | --- |
| Chegada | Identificação e curiosidade com clareza | Pessoa real, assinatura visual perceptível e proposta que o visitante consegue explicar |
| Escolha | Conseguir decidir sem esforço excessivo | Sessão adequada ao tempo/equipamento e explicação breve da escolha |
| Preparação | Sentir-se pronto e acolhido | Equipamento, espaço e início claros, sem configuração técnica desnecessária |
| Exercício | Entender, acompanhar e receber ajuda | Professor legível, controles funcionais, explicação contextual e alternativas reais |
| Interrupção | Manter confiança e autonomia | Pausar/retomar sem perder contexto, dados ou controle |
| Conclusão | Reconhecer o que fez | Resumo verdadeiro, feedback opcional e próximo passo compreensível |
| Retorno | Voltar sem culpa ou burocracia | Acesso direto, plano preservado e adaptação à rotina atual |
| Autoria | Professor criar com qualidade e confiança | Preview, revisão, processamento e publicação versionada reais |

Retenção não deve depender apenas de novidade 3D, streak punitivo, notificação excessiva ou oferta insistente. Use variedade de aulas, orientação adequada, progresso real, facilidade e personalidade dos professores. Recompensas/pequenos rituais são opcionais e proporcionais; nenhuma animação deve alegar benefício físico não medido.

Métricas com definição, fonte, janela e limites: demonstração aberta; programa escolhido; cadastro; primeira sessão iniciada; espera/erro de mídia; pausa/retomada bem-sucedida; conclusão parcial/completa conforme regra; retorno à próxima aula; continuidade; satisfação; assinatura confirmada. Separar visualização de execução declarada/estimada e excluir contas de teste/ações internas. Não inventar base de clientes ou resultados de teste de usuário.

Quando houver público, testar compreensão da proposta e observar dificuldades reais. Minha hipótese de ser melhor que academia para esse público deve ser avaliada por preferência, adequação, satisfação e continuidade; não afirmada como equivalência universal.

## 29. Execução em etapas com cobertura total

Mantenha todos os requisitos em uma matriz com ID, módulo, prioridade, dependência, estado, evidência e próximo passo. Sequenciar não autoriza excluir silenciosamente.

1. **Fundação do novo projeto:** conferir isolamento, ambiente e ferramentas; salvar este briefing; mapear requisitos e decisões abertas; escolher arquitetura e documentos essenciais.
2. **Direção criativa demonstrável:** curadoria real, três composições breves materializadas, seleção fundamentada e storyboard. Nada de passar dias apenas nomeando conceitos.
3. **Primeira sequência integrada:** abertura autoral com humano real, passagem, programas, entrada, preparação e trecho de aula com pausa/retomada; uma operação de autoria do professor. Revisar em movimento antes de multiplicar telas.
4. **Jornada real persistida:** cadastro, onboarding, recomendação, programa, ficha, calendário, sessão determinística, conclusão e evolução no servidor.
5. **Conteúdo e operação:** upload/processamento, editor, revisão, publicação versionada, papéis e administração.
6. **Assistência e comercial:** IA/voz com modo essencial, assinatura em teste e benefícios autorizados no backend.
7. **Módulos completos e dispositivos:** receitas/planejamento/revisão, avaliação corporal, visão experimental delimitada, internacionalização, pareamento/telas grandes e clientes nativos. Implementar Apple Watch como prioridade explícita dos wearables, depois Wear OS e demais famílias conforme SDK/acesso, com contratos e matriz de homologação. Não encerrar essa parte com um ícone ou apenas uma promessa de roadmap; entregar código/testes executáveis onde houver ambiente e dependências precisas onde faltar.
8. **Qualidade e prontidão:** revisão visual, testes de comportamento, acessibilidade, desempenho, segurança, documentação, matriz de integrações e plano de operação.

Incluir o módulo da seção 34 nessa sequência: desenhar critérios e economia durante a definição de produto; integrar o ledger aos eventos reais de sessão e cobrança; construir conquistas, resgate e administração; validar custos e antifraude; preparar piloto físico somente com condições e regulamento definidos. Não esconder recompensas num roadmap genérico nem ativar a campanha enquanto a infraestrutura ainda simula elegibilidade/entrega.

Continue avançando nas etapas executáveis. Uma dependência externa deve ter contrato/implementação possível, condição de desbloqueio e próximo passo; não um botão morto apresentado como função concluída. Não encerrar após a etapa 3 chamando a plataforma inteira de pronta.

## 30. Verificação obrigatória e definição de pronto

Build/lint/types conforme stack e testes relevantes aos comportamentos alterados. Não escrever testes triviais de texto/classe CSS como prova de qualidade estética. Verificar pelo menos:

- Cadastro, recuperação, autenticação, papéis, isolamento e tentativa de acesso premium direto pela API.
- Onboarding, recomendação estável, filtros/retorno, calendário e dados persistidos após reload.
- Play/pause reais; buffering; seek; explicação; troca de clipe/exercício; playbackRate por modo; parcial/conclusão idempotente; segundo plano e reconexão.
- Resposta obsoleta/cancelada da IA, limite/timeout e uso sem provedor; comandos ambíguos e modo manual.
- Negar/revogar câmera/mic, liberar dispositivos, presença incerta, exercício estático e recurso sem suporte.
- Upload interrompido, processamento com erro, versão de aula e publicação condicionada à revisão/ativos.
- Pareamento expirado, conta errada, controlador concorrente e revogação.
- Apple Watch e Wear OS: comando confirmado, desconexão, retorno, permissões parciais, métrica ausente, encerramento da coleta e deduplicação no histórico/exportação; teste nativo e em hardware separado de teste de contrato.
- TVs: foco/controle remoto, botão voltar, lifecycle, mídia/legendas, codec e engine das gerações suportadas; casting separado de app instalado.
- Paridade visual: mesma identidade, hierarquia, elementos principais e sequência de efeitos em PC/TV/tablet/celular/watch; comparar quadros e execução equivalentes, conferir proporção, legibilidade e adaptações sem impor colunas fixas.
- Webhooks repetidos/fora de ordem, cancelamento, trial, falha de pagamento e política de acesso.
- Alergias/dados insuficientes, porções e procedência de medidas; idioma/conteúdo indisponível.
- Conquistas/recompensas: critérios individualizados, eventos duplicados, resgate concorrente, revisão/recurso, obrigações já adquiridas, custo completo, pedido único ao fornecedor, falha de entrega e alteração de regulamento prospectiva.
- Navegação por teclado, foco, zoom, legenda, movimento reduzido, celular e cenário sem WebGL.

Abra o navegador e examine resultado real em desktop e mobile. Verifique clique, scroll reverso, resize, voltar, formularios, player, login do aluno e editor. Capturas comprovam composição; trecho em movimento ou observação direta documentada comprova o que de fato foi visto animando. Não alegar teste de hardware que não ocorreu.

Critérios eliminatórios de qualidade:

1. Hero genérico com título/parágrafo/CTA e uma caixa de vídeo sem gesto visual autoral, seguido de cartões iguais.
2. Abertura dominada por formas abstratas, sala vazia, tipografia ou tecnologia sem uma pessoa real treinando em casa.
3. Redesign restrito a cores, fontes, sombras, gradientes e fades.
4. Imersão escondida num tour enquanto a experiência principal continua indiferenciada.
5. Introdução obrigatória longa, rolagem sequestrada ou login dependente de assistir ao espetáculo.
6. Corpo deformado/cortado ao acaso, mídia em baixa qualidade evitável, tela preta ou ângulo falso.
7. Animação que cobre informação, perde foco/progresso ou dificulta pausar durante exercício.
8. Professor com apenas tabela e métricas, sem autoria e preview úteis.
9. Contas, pagamentos, câmera, scanner, IA, música, idiomas ou compatibilidade apresentados com estados fictícios.
10. Código novo que silenciosamente herda as telas rejeitadas, sobrescreve o projeto anterior ou usa dados produtivos indevidamente.
11. Documentação se autodeclarando “premium”, “nota 10”, “pronto para milhões” ou “melhor do mercado” sem evidência.
12. Entrega apenas de landing/protótipo com o restante do escopo omitido.

Não trate sua autoavaliação estética como aprovação do proprietário. Mostre escolhas, sequência funcionando e problemas corrigidos. Quando houver feedback, faça alteração material na direção correspondente, sem defender uma composição rejeitada apenas porque o código passou no build.

## 31. Entrega, continuidade e estados honestos

Entregáveis proporcionais e organizados no novo repositório: README com comandos testados; .env.example; CLAUDE.md curto; docs/BRIEF-MASTER.md; REQUIREMENTS; decisões de produto/design e storyboard; fontes/licenças; arquitetura e contratos; integrações; DEVICE-MATRIX; instruções de build por cliente nativo; skills aplicadas; validação; PROGRESS; procedimento de publicação e reversão. Reaproveite organização documental existente dentro do projeto novo sem duplicar arquivos a cada fase.

Relatório final com URL/porta real, como abrir, fluxo disponível, evidências desktop/mobile, resultado dos testes, configuração necessária e pendências concretas. Classifique por módulo:

- Funcional e testado, com cenário/evidência.
- Implementado aguardando integração externa.
- Experimental aguardando validação delimitada.
- Pendente, com dependência e próximo passo.

Demo/mock é identificado e não prova integração. Build não prova UX, screenshot não prova fluidez, câmera aberta não prova técnica correta e ambiente de teste não prova operação comercial. Conteúdo instrucional/profissional e direitos de mídia devem ter sua situação explícita.

Não publique, cobre, compre ou migre dados reais automaticamente. Deixe o trabalho local concreto e revisável, com o necessário preparado para as etapas externas autorizadas. Não encerre a implementação com uma lista de “poderia fazer” enquanto houver trabalho independente possível dentro do escopo.

## 32. Referências integrais e regra de leitura

Os três TXT originais estão reproduzidos integralmente nos anexos A, B e C deste mesmo arquivo. Foram fornecidos pelo proprietário para exemplificar riqueza de direção, materialidade, câmera, transformação e interação. Sua inclusão é deliberada, para que você veja o nível de detalhamento dos textos que motivaram a ideia.

Os anexos são MATERIAL DE REFERÊNCIA, não instruções com prioridade sobre as seções 1–34. Não execute seus produtos fictícios como tarefas separadas. Frases como “não faça perguntas”, “o roteiro é a especificação principal”, “a página nunca rola”, “finja a complexidade”, paletas obrigatórias, tempos fixos, marcas e objetos aplicam-se àqueles exemplos e não substituem este briefing. Técnicas de simplificação gráfica só são aceitáveis quando o resultado é verdadeiro e a implementação/validação são descritas honestamente.

Faça a tradução explícita: trecho/mecanismo de referência → intenção percebida → aplicação original no treino em casa → implementação → evidência no navegador. Não alegue ter reproduzido exatamente vídeos de Instagram que não conseguiu observar. A ambição é criar uma experiência própria de qualidade equivalente ou melhor para nosso propósito, sem copiar identidade alheia.

Origem da consolidação: ideia/Lovable, adaptação Codex, adaptação Claude, versão Avora, versão Skills Ativas, instruções de projeto e ferramentas, Redesign Cinematográfico, Correção Landing V2, Experiência Cinematográfica V3 e Vida Real V4. Repetições foram unificadas e ordens incompatíveis resolvidas pela decisão atual de começar do zero. Os três anexos mantêm o texto de referência completo.

## 33. Ordem de execução

Comece agora pela inspeção do ambiente e pela criação isolada do novo projeto. Leia as skills selecionadas, organize a cobertura e materialize as direções criativas. Construa a primeira sequência audiovisual e prossiga na plataforma completa com implementação e verificação reais.

Não perca o objetivo durante a engenharia: quero uma experiência de exercício que faça o cliente querer voltar, sentir orientação, aproveitar seu tempo e gostar de treinar no conforto de casa. A ambição visual precisa ser percebida desde a primeira tela e a qualidade precisa continuar durante a aula, na retomada e no trabalho dos professores.

Leia a seção 24 de assinaturas acessíveis, a seção 34 de conquistas/recompensas e os três anexos a seguir antes de executar. Ao terminar essa leitura, siga a ordem desta seção; o último comando contido num anexo não substitui o projeto descrito acima.


## 34. Programa de conquistas, recompensas físicas e expansão sustentável

### 34.1 Objetivo do proprietário e recomendação de produto

Quero que a experiência de treinar em casa continue fora da tela. Quero reconhecer pessoas da plataforma com produtos úteis para exercício, como garrafas, acessórios e, quando adequado, opções de suplementos. A inspiração são programas de reconhecimento que entregam placas, pulseiras e copos quando clientes atingem marcos. Quero ajuda desde a mecânica de conquista e prevenção de fraude até catálogo, hierarquia, custos, operação e expansão.

Minha ambição é construir uma referência na América Latina e depois expandir. Traduza isso em experiência, retenção, margem, qualidade e operação por país; não prometa liderança ou escala por acrescentar prêmios. A plataforma e as aulas continuam sendo o motivo principal para assinar. O reconhecimento torna o esforço e o pertencimento visíveis.

Direção recomendada para a primeira versão: um programa de fidelidade por marcos objetivos de constância e participação, acessível a todas as pessoas elegíveis que cumpram regras previamente definidas. Nome de trabalho: Conquistas que acompanham você, editável após naming. Não criar por padrão uma disputa pelos corpos, tempos, calorias ou volumes de treino considerados “melhores”.

Essa é uma proposta a validar, não uma campanha já autorizada nem uma promessa comercial vigente. Preços, datas, número de ciclos, produtos e valores abaixo são hipóteses. Implementar regras configuráveis e testes; manter oferta física desativada em produção até definição econômica, fornecedores e revisão do regulamento. Isso não bloqueia construir o módulo e o modo de teste.

### 34.2 Três camadas de reconhecimento, com papéis distintos

1. Reconhecimento de jornada: primeira aula, primeiras semanas, aprendizagem, retorno à rotina e marcos de constância. Selos autorais, coleção pessoal, retrospectiva e celebração breve. Sem vantagem por pagar plano mais caro ou possuir relógio premium. Custo de produção e infraestrutura existe, embora não haja frete por conquista.
2. Benefícios de fidelidade: produtos ou experiências definidos em regulamento para quem satisfizer os critérios. Todos os elegíveis de uma regra vigente recebem o benefício prometido; o orçamento precisa suportar isso. Essa é a base proposta para produtos físicos.
3. Reconhecimento editorial da comunidade: histórias e contribuições apresentadas com consentimento e curadoria, sem votação manipulável ou prêmio material automático. Se houver concurso material por mérito, sorteio ou ranking com ganhadores, criar campanha separada e revisar seu enquadramento antes de anunciá-la.

Separar conquistas de condição comercial. O cliente pode ter seu histórico reconhecido mesmo após cancelar; novos benefícios materiais podem exigir ciclos pagos liquidados conforme regra publicada. Cancelamento legítimo não é fraude, e direitos já adquiridos não são confiscados porque a pessoa deixou de renovar.

Não exigir avaliação positiva, postagem pública, foto corporal, emagrecimento, recomendação de amigos ou exposição da própria história para receber o benefício de treino/fidelidade. Compartilhar uma conquista é opcional, sem publicar dados de saúde por padrão.

### 34.3 Quem reconhecer: proposta de critérios verificáveis e inclusivos

O objetivo é constância dentro de um plano apropriado, não volume máximo. Planejamento semanal deve ser definido antes da janela de contagem e permitir ajustes futuros por tempo, limitação, recuperação e orientação profissional. Não permitir reduzir metas retroativamente apenas para elevar pontuação; preservar revisões legítimas e possibilidade de recurso.

Separar unidades:

- Sessão válida para a mecânica: sessão real, vinculada a versão publicada de aula/programa, com eventos coerentes e registro de participação segundo as regras abaixo. “Válida” não significa execução corporal comprovada cientificamente.
- Dia de participação: no máximo uma unidade de reconhecimento por dia local definido, mesmo se houver várias aulas. O aluno pode treinar conforme plano, mas repetir vídeos não acelera prêmio.
- Semana de compromisso: cumprimento de uma meta individual aprovada para aquela semana, com alternativas/reagendamentos documentados. Como ponto de partida, um crédito semanal ao atingir o plano ajustado; definir exceções e requisitos mínimos com a equipe técnica antes de campanha real.
- Ciclo comercial elegível: período de assinatura reconhecido e liquidado conforme política, com regras claras para anual, pausa, cupons, reembolso e inadimplência. Pagar um ano não deve criar doze semanas de prática no mesmo dia.
- Marco: conjunto de condições determinísticas de participação, tempo e elegibilidade comercial. Cada marco tem versão, início, janela, benefício, prazo de solicitação/entrega e tratamento de exceções.

Proposta didática, sem programação física universal: reconhecer 4 semanas de compromisso dentro de uma janela de 8; depois 12 em 20. Isso deixa espaço para descanso, férias e retomada. A meta semanal é individual; não impor treino diário nem um mesmo número de minutos para todos. Pausas e condições especiais devem ser tratadas de forma digna e revisada, sem exigir laudos desnecessários para um selo.

O benefício físico requer também a condição financeira/comercial definida. Uma pessoa com duas sessões no plano não precisa competir com outra com cinco. A pessoa que faz exercício adaptado não recebe menos reconhecimento por ter uma necessidade diferente. Programas pagos mais caros não multiplicam os pontos de constância; benefícios específicos do plano, se existirem, devem ser identificados separadamente.

Não pontuar calorias, peso perdido, carga máxima, repetições ilimitadas, frequência cardíaca elevada ou dias sem descanso. Não transformar um sensor em juiz absoluto, nem criar incentivo para ignorar dor/limites. Relógio/câmera ajudam a conferir contexto em recursos autorizados; não são obrigatórios para elegibilidade básica.

Mostrar ao aluno o marco atual, o que já contou, o que falta e por quê, sem expor detalhes técnicos de antifraude. Possibilitar contestação de sessão não contabilizada, falha de vídeo, mudança de fuso e indisponibilidade do serviço. Não retirar progresso legítimo por uma falha da plataforma.

### 34.4 Fraude: reduzir oportunidade, ganho e dano, sem promessa de inviolabilidade

Não existe comprovação infalível de exercício remoto com um vídeo, relógio ou câmera. Uma pessoa pode reproduzir conteúdo sem praticar, manipular um cliente ou emprestar dispositivo. O sistema deve reduzir abuso e ter perda residual orçada; não anunciar “impossível burlar”.

Separar evidências: reprodução confirmada pelo player/servidor; participação autodeclarada; estimativa de sensor; revisão profissional. Nenhuma isoladamente garante identidade e execução. Não declarar 100% de detecção nem inventar taxa de fraude sem dados.

Controles técnicos e operacionais:

1. Ledger no servidor com eventos identificados, timestamps, origem, versão da regra e transições idempotentes. O cliente nunca envia seu saldo final de pontos nem aprova seu prêmio.
2. Início autenticado, sessão/versão válidas, trechos de reprodução coerentes, buffering/pausa e conclusão reconciliados. Seek, eventos repetidos, várias abas e relógio local alterado não geram unidades extras.
3. Limites por dia/semana/marco publicados e separados do uso livre das aulas. Simultaneidade impossível, replay de comandos e padrões automatizados viram sinais de revisão.
4. Quando necessário, confirmações contextuais leves nos momentos de preparação/encerramento. Não interromper movimentos com CAPTCHA ou exigir tarefas arriscadas para provar presença.
5. Conta verificada e regra de uma participação por pessoa na mecânica que exigir isso. Identidade adicional apenas no resgate/risco que justifique, com minimização de dados e revisão jurídica. Não coletar documento biométrico por padrão.
6. Sinais de múltiplas contas, cobrança, dispositivo e endereço com acesso restrito. Mesmo IP/endereço/cartão não prova fraude: famílias e residências compartilhadas existem. Não banir automaticamente uma casa inteira.
7. Resgate único por marco e beneficiário conforme regra; transação atômica e chave de idempotência também no pedido ao fornecedor. Evitar duplicatas entre web, app, relógio e retries de logística.
8. Confirmação de endereço e opção do produto antes de emissão. Mudança repetida de destinatário ou vínculo entre contas pode exigir análise, sem acusação automática.
9. Janela operacional para liquidação/revisão definida no regulamento. Não tratar fim do prazo de arrependimento como ausência de risco de chargeback posterior; manter reserva de perdas e tratamento próprio.
10. Revisão humana proporcional ao valor e aos sinais, com prazo, motivo compreensível, recurso e trilha de decisão. Pontuação de risco não é pontuação de saúde.
11. Conquistas suspeitas podem ficar em revisão, sem apagar progresso inteiro nem bloquear a aula sem justificativa. Uma reversão usa evento compensatório com motivo, nunca edição silenciosa de histórico.
12. Pessoas sem câmera/watch têm caminho equivalente de participação e recurso. Se não for possível validar uma modalidade cara com qualidade suficiente, rever a mecânica/valor antes de exigir vigilância invasiva.

Regras básicas e critérios de elegibilidade são públicos. Limiar de detecção e detalhes que facilitam abuso ficam em documentação interna protegida. Medir falsos positivos, tempo de recurso e perdas residuais para não tornar o programa hostil a clientes honestos.

### 34.5 Hierarquia de reconhecimento e catálogo inicial

Não há pesquisa que comprove que todas as pessoas desejam os mesmos produtos. A seleção abaixo é uma hipótese de utilidade, valor percebido e operação; testar preferência antes de comprar estoque. Permitir escolha entre poucas opções equivalentes dentro de cada marco quando o regulamento e a logística permitirem.

| Camada | Marco ilustrativo | Recompensa candidata | Papel e condição |
| --- | --- | --- | --- |
| Boas-vindas | Primeira aula e preparação concluídas | Conquista digital autoral, mensagem contextual e guia de rotina | Benefício imediato de baixo custo marginal; não enviar produto físico só por cadastro/trial |
| Minha constância | 4 semanas de compromisso em uma janela flexível | Selo/coleção e retrospectiva da jornada | Pertencimento sem competir por performance |
| Primeiro objeto | Marco de constância e ciclos pagos suficientes | Garrafa de qualidade OU toalha compacta OU acessório aprovado equivalente | Primeiro benefício físico somente quando custo total e obrigação estiverem financiados |
| Meu espaço de treino | Marco posterior, considerando benefícios anteriores | Kit de acessórios, faixa apropriada ou combinação de itens úteis | Cada opção precisa de qualidade, orientação e custo de frete real |
| Minha história | Marco de longo prazo | Objeto personalizado, garrafa especial, patch/pin ou pequena placa autoral | Reconhecimento emocional, sem imitar marca de gateway; personalização aumenta valor, mas exige controle de erros |
| Edições especiais | Campanha própria validada | Produto de maior valor ou experiência profissional real | Fora da promessa recorrente inicial; patrocinador confirmado e orçamento/regulamento específicos |

Não somar todos os níveis físicos automaticamente sem calcular o custo acumulado por pessoa. O primeiro ano pode ter várias conquistas digitais e apenas um benefício físico se esse for o desenho sustentável. O marco e o intervalo físico serão definidos com preço/margem reais; nenhuma data desta tabela é uma oferta publicada.

Curadoria dos produtos:

- Garrafa/squeeze: candidato inicial pela utilidade no treino e possibilidade de identidade própria; testar vedação, limpeza, material, odor, durabilidade e embalagem. Não usar produto de baixa qualidade com logo grande para chamar de premium.
- Toalha compacta de treino: útil, transporte simples e sem escolha de tamanho corporal; testar toque, absorção e acabamento.
- Faixas/minibands: relação direta com treino em casa, mas requerem resistência adequada, instruções, qualidade e alternativa para sensibilidades a materiais. Não distribuir resistência alta indiscriminadamente.
- Shaker: opção para quem quer esse uso; não pressupor que todo aluno consome suplemento.
- Bolsa pequena, strap de transporte, patch/pin ou pulseira confortável: pertencimento; conferir utilidade e preferência para evitar objeto descartável sem valor.
- Tapete: pode ter valor percebido, mas volume/frete e qualidade justificam etapa posterior ou compra/entrega local pelo parceiro.
- Camiseta: reservar para operação que consiga atender tamanhos/trocas; não escolher apenas porque funciona bem em foto.
- Halteres, equipamentos pesados, eletrônicos e smartwatch: não como prêmio recorrente inicial. Frete, garantia, preço e risco precisam de campanha/orçamento específicos. Apoio de patrocinador não existe até contrato/fornecimento confirmado.

Exemplos de categoria em fornecedor oficial, sem cotação ou parceria: garrafa esportiva https://www.decathlon.com.br/garrafa-de-esporte-650ml-preto-8809628-decathlon/p ; toalha compacta https://www.decathlon.com.br/toalha-de-natacao-microfibra-gelado-tamanho-m-60-x-80-cm-azul-8749762-nabaiji/p . Não usar preço de varejo como custo contratado do programa nem copiar marca alheia nos produtos próprios.

Whey e creatina: manter como possíveis opções futuras, não como padrão universal nem recomendação de consumo. Dependem de público, preferência, adequação, alergias/restrições e processo profissional apropriado. Sempre oferecer opção não ingerível equivalente; não condicionar prêmio a tomar suplemento. Não prescrever dose pelo programa de pontos. Verificar fornecedor, procedência, situação regulatória, embalagem lacrada, lote, validade, conservação, rotulagem e processo de recall. Não fracionar/reembalar para colocar a marca da plataforma sem estrutura e autorização apropriadas.

Fonte de conferência: https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/como-saber-se-um-suplemento-alimentar-e-autorizado ; consultar também alertas https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/consulte-produtos-irregulares . Não aparecer numa lista de irregulares, isoladamente, não comprova regularidade de todo SKU/lote.

Pesquisa de preferência proposta: apresentar 3–5 opções realistas por faixa de custo entregue, perguntar escolha/utilidade e testar qualidade com uma pequena amostra. Medir seleção, satisfação após uso, defeito e custo de entrega. Não fabricar ranking de “mais procurados”; marcas, tamanhos e suplementação variam por público/país.

### 34.6 Como financiar sem comprometer a assinatura

Nenhuma regra elimina todo risco de prejuízo. Precificação, custo operacional, churn, fraude, tributos, estoque e entrega precisam entrar no modelo. Trabalhar com margem e caixa disponível, não uma porcentagem isolada do faturamento nem promessa de que a retenção futura pagará o prêmio.

Modelo gerencial por plano, coorte e país:

Receita líquida = receita reconhecida do período − descontos − tributos incidentes − taxas de cobrança/loja − estornos/reembolsos/perdas estimadas, sem descontar a mesma rubrica duas vezes.

Margem de contribuição antes das recompensas = receita líquida − custos variáveis de vídeo, IA/voz, suporte variável, royalties/comissões e demais custos variáveis efetivos.

Espaço econômico para recompensas = máximo de zero entre a margem de contribuição menos a parcela necessária para custos fixos, recuperação de aquisição de clientes e resultado mínimo planejado. Cada parcela tem premissa e horizonte definidos; não chamar rateio de lucro contábil auditado.

Novo orçamento do período = menor entre: percentual escolhido da margem positiva; espaço econômico remanescente; caixa operacional disponível após obrigações/reservas. Percentual é parâmetro de simulação, não benchmark ou garantia.

Custo entregue de um benefício = compra + personalização + embalagem + separação/manuseio + frete + tributos/taxas aplicáveis + atendimento + provisão de troca/avaria/extravio/fraude + custo de processamento/validação que não foi contado antes. Custos de desenvolvimento/operação do programa entram em rubrica própria. Evitar esquecer frete de regiões distantes e reenvios.

Ledger financeiro gerencial separado de pontos/conquistas: saldo reservado do programa; compromissos já prometidos; benefícios elegíveis ainda não enviados; pedidos emitidos; desembolsos; reservas de risco e saldo livre para novas obrigações. Saldo de pontos não é dinheiro, criptoativo ou promessa de conversão em dinheiro. Não apresentar reserva gerencial como parecer sobre tratamento contábil; confirmar contabilização com profissional.

Planejar tanto custo esperado quanto exposição se TODOS os elegíveis resgatarem. Se o benefício é garantido, baixa taxa prevista de resgate ou churn não autoriza prometer algo sem capacidade de honrar. Até antes da conquista, acompanhar compromissos de campanhas/termos vigentes e cronograma provável de vencimento, não somente pedidos já aprovados.

Não depender de novos assinantes financiando benefícios prometidos a grupos anteriores. Dinheiro de plano anual exige provisionar a prestação dos meses futuros; não gastar todo o recebimento em prêmio imediato. Patrocínio só entra como financiamento após compromisso confiável e condições de entrega; receita de indicação esperada ainda não é caixa.

Se o programa ficar caro, revisar ofertas futuras, custo, fornecedor e marcos antes de assumir novos compromissos. Não bloquear resgate já conquistado porque acabou o orçamento, nem introduzir frete inesperado para transferir o déficit ao cliente. Não usar “enquanto durar o estoque” como saída para uma promessa apresentada como benefício garantido.

### 34.7 Simulação financeira com assinatura acessível

Os preços de R$29,90 e R$49,90 são hipóteses de estudo da seção 24. Os custos abaixo são inteiramente fictícios, não cotações, alíquotas ou projeções comerciais. Esta simulação substitui os exemplos anteriores de R$99,90/R$79,90, para evitar que virem referência de oferta. Conferir a conta não confirma viabilidade real.

Exemplo de custo total de um prêmio: item R$25 + embalagem/personalização R$5 + frete R$17 + operação R$3 + contingência R$5 = R$55 entregues. A contingência fictícia não cobre necessariamente todos os riscos reais.

| Entrada/resultado mensal por pagante | Essencial: base hipotética | Completo: base hipotética | Completo: uso intensivo e custo maior |
| --- | ---: | ---: | ---: |
| Receita bruta | R$29,90 | R$49,90 | R$49,90 |
| Deduções fictícias consideradas | R$4,90 | R$7,90 | R$7,90 |
| Receita líquida | R$25,00 | R$42,00 | R$42,00 |
| Custo variável antes dos prêmios | R$8,00 | R$12,00 | R$27,00 |
| Margem de contribuição antes dos prêmios | R$17,00 | R$30,00 | R$15,00 |
| Parcela gerencial para fixos, aquisição e resultado planejado | R$15,00 | R$23,00 | R$23,00 |
| Espaço econômico para novas recompensas, limitado a zero | R$2,00 | R$7,00 | R$0,00 |
| Percentual escolhido apenas para esta simulação | 12% | 17% | 17% |
| Reserva por ciclo, limitada ao espaço econômico | R$2,00 | R$5,10 | R$0,00 |
| Contribuição após reservar recompensas | R$15,00 | R$24,90 | R$15,00 |
| Reserva acumulada após 6 ciclos pagos elegíveis | R$12,00 | R$30,60 | R$0,00 |
| Reserva acumulada após 12 ciclos pagos elegíveis | R$24,00 | R$61,20 | R$0,00 |
| Ciclos mínimos matemáticos para R$55, sem outros resgates | 28 | 11 | Não financiável neste cenário |

Aplicação da seção 34.6: reserva = menor entre percentual escolhido × margem positiva, espaço econômico disponível e caixa livre por participante. A tabela pressupõe caixa suficiente; os percentuais de 12% e 17% são escolhidos para demonstrar cenários e não são benchmarks nem política já definida. A alocação do Essencial consome todo o espaço simulado, portanto não há folga para erro nessas premissas.

As deduções de R$4,90 e R$7,90 são valores agregados hipotéticos para a conta fechar; substituir por rubricas e taxas reais conforme empresa, canal e país. Não usá-las como estimativa tributária. A parcela para fixos/aquisição/resultado é meta gerencial; não representa custo comprovado nem comprova lucro. Não repetir essas parcelas em outra dedução do mesmo cálculo.

Com essas premissas, o Essencial não financia um objeto de R$55 em 12 ciclos: só acumula R$24. Isso pede reconhecimento digital, objeto mais barato, benefício futuro economicamente definido ou patrocínio confirmado. Não converter os 28 ciclos matemáticos em espera longa anunciada para disfarçar a falta de orçamento.

No Completo base, R$61,20 após 12 ciclos cobrem um único objeto de R$55 e deixam R$6,20. Se o frete subir R$10, o custo vai a R$65 e ultrapassa a reserva. Aos seis ciclos só há R$30,60. Não prometer brindes semestrais ou recompensas intermediárias com o mesmo dinheiro, nem tratar essa pequena folga anual como validação de operação nacional.

Como referência aritmética, financiar R$55 em 12 ciclos requer reservar pelo menos R$4,59 por ciclo, arredondando para cima em centavos; ainda faltam riscos e custos não incluídos. Isso equivale a aproximadamente 9,2% de uma mensalidade bruta de R$49,90, antes de qualquer outra despesa. Uma recompensa física não é barata só porque a assinatura é digital.

No cenário de uso intensivo, a margem de R$15 já fica R$8 abaixo da parcela gerencial planejada de R$23, mesmo sem prêmio. O déficit é contra a meta simulada, não uma demonstração contábil de prejuízo. Resolver escopo futuro, custos, capacidade e composição comercial; não depender de alunos inativos, esconder limites ou suspender benefícios já devidos.

O upgrade de R$29,90 para R$49,90 gera, na base hipotética, R$17 adicionais de receita líquida. Deduzidos R$4 de custo variável adicional e R$3,10 de reserva adicional, sobram R$9,90 adicionais de contribuição para o restante da operação. No cenário intensivo, receita líquida adicional de R$17 menos custo variável adicional de R$19 já resulta em diferença negativa antes de recompensas. Não presumir que vender mais Completo melhora a margem.

Fórmulas de apoio: ciclos mínimos = teto(custo entregue ÷ reserva por ciclo), quando positiva e sem outros compromissos. Quantidade adicional financiável = piso(saldo livre efetivo ÷ custo entregue), após descontar compromissos existentes. Essa quantidade orienta novas ofertas/compras; não reduz direitos adquiridos. Proteger obrigações já anunciadas mesmo quando cessar o orçamento para novas ofertas.

Para avaliar retorno incremental, comparar custo adicional total do programa à contribuição adicional de clientes que permaneceram por causa dele. Distinguir retenção incremental de todas as renovações observadas. Não contar a recompensa no custo do programa e novamente na contribuição usada na mesma conta de equilíbrio. Crescimento de faturamento sozinho não prova retorno.

Implementar simulador interno com preço, moeda, tributos/taxas, custo variável, custos fixos/marketing, participantes, retenção como hipótese, custo por SKU, regiões/frete, resgate esperado e máximo, patrocínio confirmado, estoque mínimo, prazo de fornecedor e reservas. Incluir base, conservador e estresse, com zero crescimento, 100% de resgate elegível, perda de patrocinador, frete maior e aumento de fraude. Não ativar uma promessa física apenas porque o cenário otimista ficou positivo.

### 34.8 Mecânica jurídica e transparência no Brasil

Classificar o programa concreto antes da divulgação, com revisão jurídica/contábil. Na orientação oficial consultada, benefícios de fidelidade por critérios objetivos, sem sorte, competição ou limitação de estoque promocional, em regra não exigem autorização da SPA. Concursos, sorteios e modalidades assemelhadas têm outro enquadramento. O nome “clube” ou “desafio” não muda a mecânica. Fonte: FAQ da Fazenda, especialmente pergunta 56: https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas/promocao-comercial/promocao-comercial .

Evitar “os primeiros 100 a cumprir ganham”, “top 10 do mês” ou desempate aleatório dentro de um programa tratado como benefício para todos. Orçamento limitado não deve ser transformado silenciosamente em competição/escassez de prêmio. Um piloto de produto precisa de desenho/regras próprios, sem publicidade enganosa de recompensa universal. A revisão deve considerar toda a comunicação e as condições reais, não apenas uma frase isolada do regulamento.

Regulamento versionado: entidade responsável, países, quem participa, critérios, evidências aceitas, calendário/fuso, produtos/alternativas, resgate, prazo de entrega, frete, indisponibilidade, impostos/obrigações aplicáveis, pausas/cancelamento, revisão/recurso, privacidade e tratamento de alterações futuras. Não alterar condições retroativamente contra direitos existentes. A oferta integra obrigações perante o consumidor; confirmar o texto final: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm .

Campanha competitiva futura exige regulamento, elegibilidade, apuração, tratamento de fraude/recursos, custo tributário e autorização quando aplicável antes de anunciar. Não classificar automaticamente competição de assinantes como “concurso cultural/esportivo isento”. Não comprar prêmio, protocolar promoção ou publicar campanha neste trabalho sem autorização do proprietário.

### 34.9 Operação física e experiência do reconhecimento

Fluxo do aluno: ver marco e critérios → acompanhar progresso verdadeiro → conquista elegível/revisão quando necessária → escolher opção disponível para seu país → confirmar endereço → receber confirmação/prazo → acompanhar envio → resolver problema → dar feedback opcional. O status de conquista, elegibilidade, pedido e entrega são separados.

Preservar a direção visual e a seção 22.5: objeto 3D/preview ou vídeo real do produto pode compor a revelação, com mesma identidade entre dispositivos. Animação breve e opcional, sem revelar endereço em tela compartilhada, interromper exercício, simular abertura de loot box ou confundir revisão pendente com prêmio liberado.

O objeto precisa parecer parte da marca pela qualidade, cuidado e mensagem, não pelo excesso de logo. Considerar cartão contextual com conquista real e instruções úteis. Nunca imprimir perda de peso/dados de saúde na embalagem. Pequeno custo de personalização pode aumentar o significado, mas testar resultado e taxa de erro antes de escalar.

Administração: catálogo por país/SKU/variante, fornecedores/cotações, lote/validade quando necessário, custo entregue por região, regras/marcos, elegibilidade, fila de revisão/recurso, pedidos, estoque/fornecedor, rastreamento, trocas, eventos financeiros e relatório de passivos gerenciais. Autorizar acesso por função: operação logística não recebe histórico de saúde completo.

Pedido ao fornecedor com idempotência, reconciliação e prova do resultado; retry não emite duas garrafas. Entrega manual inicial pode existir com registro e revisão, sem chamar isso de integração automática. Conferir amostras e contrato/SLA, nota fiscal/documentação aplicável, defeitos, avarias, extravio, substituição e responsabilidade. Dados de endereço enviados só ao necessário, com retenção apropriada.

### 34.10 Aquisição, retenção e expansão para a América Latina

Construir o crescimento sobre aulas boas, professores, ativação rápida, suporte, continuidade e margem. Recompensa é uma camada da experiência, não justificativa para prometer que treinar “se paga” ou que a pessoa ganhará dinheiro.

Proposta de validação por etapas:

1. Testar clareza dos marcos e preferência de produtos com usuários/público real; amostra pequena não prova demanda nacional.
2. Rodar primeiro reconhecimento digital e instrumentação, verificar contagem, recursos e riscos. Desenvolver o fluxo físico em teste com catálogo realista.
3. Após preço/margem e revisão do regulamento, executar piloto de fidelidade com obrigações integralmente financiadas. Dimensionar participantes/custo antes de assumir compromisso; não prometer benefício para todos e sortear quem recebe depois.
4. Medir satisfação, qualidade logística, retenção após conquista e interesse em continuar quando o próximo prêmio estiver distante. Abandono logo após resgate pode revelar subsídio à aquisição de brindes.
5. Escalar gradualmente no Brasil com margem e atendimento sustentáveis. Comparar regiões para frete/prazo e fornecedor, sem negar benefício já prometido a uma região mais cara.
6. Selecionar o primeiro país hispânico com dados de demanda, cobrança, suporte, tributação, logística, regras de promoção e conteúdo revisado. Não escolher apenas pelo tamanho da população nem supor que traduzir a UI conclui a entrada no mercado.
7. Preferir fornecimento/fulfillment local ao exportar suplementos ou objetos de baixo valor com frete internacional elevado. Catálogo pode variar por país com equivalência e condições transparentes; a identidade e a experiência permanecem consistentes.

Indicação pode entrar depois como programa separado: benefício por cliente novo real, elegível e liquidado conforme regras, com limites e custo de aquisição controlado. Sem recompensa por cadastro vazio, autoindicação, múltiplos níveis de recrutamento ou obrigação de publicar conteúdo. Contatos e campanhas só com consentimento/autorização correspondente. Não usar pedido de indicação como condição escondida para resgatar conquista.

Parcerias: procurar fornecedores de acessórios, marcas e profissionais compatíveis quando houver autorização para contato; preparar proposta com audiência real, projeções identificadas, direitos de marca, entrega e responsabilidade. Sem presumir patrocínio ou usar logotipos como parceiros antes de acordo.

Métricas: ativação, semanas de compromisso, retorno à aula, retenção por coorte/plano/país, receita e margem líquidas de recompensa, custo entregue, resgate esperado/máximo, passivo gerencial, avaria/extravio, fraude confirmada, falsos positivos, prazo de recurso, satisfação e retorno após entrega. Definir datas/fontes e excluir contas internas. Comparação causal requer desenho apropriado; se todos já têm um benefício prometido, não retirá-lo de um grupo silenciosamente para fazer A/B.

### 34.11 Implementação e aceite do módulo

Modelos/contratos: RewardProgram, RuleVersion, Enrollment, Milestone, ParticipationEvent, EligibilityDecision, AchievementLedger, BenefitEntitlement, BudgetCommitment, RewardSKU, CountryCatalog, Redemption, FulfillmentOrder, RiskCase, Appeal e AuditEvent, com nomes adaptados à arquitetura. Referenciar os eventos reais da sessão; não duplicar todo o motor nem colocar lógica de prêmio no componente de animação.

Estados: regra em rascunho/revisada/ativa/encerrada; conquista em progresso/atingida/em revisão; benefício elegível/solicitado/aprovado/negado com recurso quando cabível; pedido emitido/enviado/entregue/com ocorrência; fechamento/reversão com motivo. Definir transações, bloqueios de concorrência, idempotência e autorização por objeto. Ledger auditável com eventos compensatórios, sem saldo manipulável pelo cliente.

O motor de regras pode reproduzir a decisão a partir da versão e evidência, com explicação legível. Toda alteração futura tem vigência e não modifica silenciosamente compromissos anteriores. Simulador econômico interno separado da campanha ativa; mudar o preço simulado não muda a oferta do cliente.

Testar: repetição de evento; seek; relógio/fuso alterado; várias abas; mesma sessão em TV/watch/celular; ausência de sensor; treino adaptado; pausa legítima; reembolso/cancelamento; múltiplas contas e família no mesmo endereço; resgate concorrente; fornecedor que responde tarde; retry após pedido emitido; falha de orçamento; prazo/regra antiga; estoque/alternativa; produto com lote bloqueado; falso positivo e recurso; exclusão/minimização de dados. Não permitir que falta de saldo livre para novas campanhas cancele benefício adquirido.

Entregáveis adicionais: docs/REWARDS-PRODUCT.md; regra de teste e regulamento para revisão; catálogo com premissas/custos/licenças/dados de fornecedor; docs/REWARDS-ECONOMICS.md e simulador validado; modelo antifraude proporcional; plano operacional e países; interface aluno/admin; testes; estado real de cada integração.

Aplicar as skills Avora pertinentes: financeiro-compliance #0096 (margem) e #0402 (viabilidade), marketing-vendas #0078 (jornada) e #0238 (fidelização), produto-ecommerce-saas #0118 (crescimento pelo produto) e #0117 quando houver dados de churn. Ler os métodos reais e adaptar ao contexto; não reutilizar estatísticas promocionais das skills como evidência de retorno.

Critério de pronto desta etapa: programa claro e testável, fluxo navegável, decisões reproduzíveis, orçamento por obrigação, contagem consistente e nenhuma campanha/prêmio anunciado como ativo sem aprovação e condições reais. O objetivo é reconhecimento sustentável que fortalece a experiência de treinar e retornar, sem vigilância excessiva, competição prejudicial ou risco financeiro escondido.



## ANEXO A — METAMORPHOSIS

Fonte: texto.txt. Conteúdo integral original, reproduzido como referência visual. Aplicar a regra de prioridade da seção 32.

<!-- BEGIN ORIGINAL: texto.txt -->
~~~~~~~~text
PAPEL E ENTREGA
Atue como uma equipe de direção de arte, motion design, desenvolvimento criativo e engenharia gráfica. Implemente uma home imersiva chamada METAMORPHOSIS: uma viagem de 30 segundos por instalações escultóricas inspiradas no universo Gentle Monster. Entregue uma experiência 3D real, executada no navegador, com materiais ricos, transformações contínuas e interação com o mouse em todas as etapas. Quero o projeto funcionando. Assuma decisões de implementação e siga até concluir código, carregamento, animação, interação, adaptação a dispositivos e validação. Se eu fornecer uma gravação ou imagens da experiência original, use-as para calibrar formas, enquadramentos, cores e ritmo. O roteiro abaixo é a especificação principal; uma descrição textual sozinha não garante reprodução visual idêntica.

DIREÇÃO VISUAL
Ocupar a tela inteira. A câmera atravessa um mundo tridimensional contínuo. A linguagem mistura fotografia de produto, instalação de arte, engenharia mecânica exposta e metamorfose de materiais. Trabalhe escala monumental, espaço negativo, superfícies táteis e iluminação que revele volume. Paleta: branco mineral quente na abertura; lavanda e verde azulado na instalação da flor; azul profundo no corredor das cabeças; porcelana, cromo e violeta na composição final. O branco deve mostrar granulação e relevo sutis. Os metais devem ter reflexos definidos, escovação e variações de rugosidade. O tecido deve revelar trama, costuras, dobras e volume.

RELÓGIO MESTRE
Use um relógio mestre de 0 a 30 segundos. Os atos se sobrepõem nas transições, preservando continuidade espacial.

0 A 1,5s, ESTÚDIO MINERAL
Apresente óculos esculturais de metal com reflexos violetas, isolados em um estúdio branco. Desde o primeiro instante, combine um arco curto da câmera, um giro controlado do produto e uma luz retangular atravessando a superfície. Os primeiros três segundos precisam revelar forma, material e uma transformação iminente.

1,5 A 7s, ABERTURA DO MUNDO E DESINTEGRAÇÃO
Uma abertura arquitetônica cresce no cenário branco e revela gradualmente uma galeria lavanda e verde azulado. Mantenha céu, névoa e chão coerentes durante a passagem. Entre aproximadamente 2,62 e 3,78s, os óculos se desintegram a partir da própria superfície: uma frente de fratura percorre a armação, libera pequenas lâminas metálicas e consome o material original. A armação permanece ancorada enquanto se desfaz. Distribua cerca de 1.600 fragmentos instanciados, com origens reais na geometria, liberação escalonada e trajetória determinística. A primeira escultura é um rosto monumental de aparência sintética, com cabos, articulações e arcos cranianos expostos. A câmera se aproxima. Por volta de 5,55s, a máscara destrava: o painel central recolhe por uma dobradiça superior e os painéis laterais abrem em sequência. Deve haver sensação de mecanismo, peso e precisão. Libere a passagem antes de a câmera cruzar o rosto.

7 A 11,1s, FLOR MONUMENTAL
Revele uma flor tridimensional de pétalas volumosas de tecido, apoiada visualmente em uma instalação com chão e pequenas esculturas ao redor. O céu continua luminoso, com lavanda e verde azulado. A luz rasante revela trama, costuras e dobras. Preserve o chão até ele sair naturalmente do enquadramento ou se integrar à atmosfera.

11,1 A 13,65s, EXPLOSÃO E TÚNEL
As pétalas abrem uma passagem por meio de uma explosão coreografada: impulso inicial, suspensão breve e uma segunda expansão. Use arcos diferentes, profundidade, rotação e atrasos entre pétalas, formando um vórtice legível. Durante a suspensão, o tecido se transforma em metal. O centro da flor se transforma em anel e revela um túnel com estrias longitudinais, borda arredondada, marcas finas de usinagem e reflexos acetinados. Toda superfície clara deve conservar textura no close. A passagem escurece gradualmente entre aproximadamente 12,85 e 13,65s e esconde a troca de ambiente com sua própria geometria.

13,65 A 24s, UNIVERSO DAS CABEÇAS
Seis cabeças mecânicas gigantes entram alternadamente pelas laterais, de perfil, em um corredor azul profundo. Mostre o rosto e a construção mecânica aberta por trás. Até aproximadamente 22,4s, preserve uma passagem central estável, sem inclinação lateral da câmera. Depois, a câmera sobe e recua para compor o encerramento. As cabeças devem impressionar pela escala, pelos materiais e pela reação ao visitante.

22,2 A 30s, CONVERGÊNCIA FINAL
Inicie a composição final enquanto as cabeças se afastam. Revele uma escultura abstrata de cromo, uma aura escura e a marca GENTLE MONSTER em letras serifadas volumétricas. Use Tinos Bold ou o ativo tipográfico equivalente fornecido. A partir de aproximadamente 22,6s, cada letra gira individualmente de um perfil estreito até ficar voltada para a câmera, com defasagem precisa. Dê espaço e contraste a essa entrada. Os óculos finais começam a aparecer depois de 24,15s e ganham presença até 27,4s. Termine com o produto flutuando entre curvas metálicas e reflexos violetas.

MOUSE, TOQUE E TIPOGRAFIA
Em qualquer trecho, inclusive pausado, o movimento do mouse deve deslocar luzes e reflexos. Use amortecimento suave e um relógio de interação independente do relógio da viagem. No estúdio, permita uma pequena rotação do produto. Na primeira máscara, uma resposta discreta da orientação. Na flor, as pétalas próximas da direção do cursor respondem com pequenos movimentos. No final, o produto responde à posição do visitante. Restrinja a câmera durante passagens estreitas e remova os deslocamentos do produto antes da desintegração para manter os fragmentos alinhados. Nas cabeças, faça seleção individual por proximidade ao ponteiro: a cabeça apontada gira perceptivelmente, aproximadamente 20 graus, abre suas placas laterais e recebe uma luz mais quente. Apenas a escultura selecionada recebe o destaque principal. A resposta entra e retorna suavemente, sem saltos ou acúmulo de transformações. Inclua títulos editoriais nos momentos correspondentes: “Beyond human scale.”, “Monumental softness.”, “Beyond the face.” e “Shaped by light.” Anime sua entrada em sincronia com a viagem. Ao passar o mouse, as letras devem responder individualmente com pequenos giros e deslocamentos, mantendo leitura e estabilidade do layout. Em telas de toque, use arraste com um dedo para explorar luz e objetos. Preserve gestos essenciais do navegador. Respeite movimento reduzido: priorize uma composição estável e respostas suaves de luz, com reprodução disponível por escolha do visitante.

CONTROLES
Na parte inferior, centralize uma linha fina de progresso com reprodução/pausa, reinício e um pequeno botão 1,5×. A aceleração deve alterar apenas a duração da viagem: 30 segundos em 1× e 20 segundos em 1,5×. Não mostre minutos, segundos ou um painel de player. Use ícones visualmente pequenos, com áreas de toque de pelo menos 44 px, foco de teclado visível e nomes acessíveis. A barra permite avançar e voltar. Inclua navegação discreta pelos capítulos Studio, Bloom, Giants e Object. Roda do mouse, espaço e setas também devem funcionar. Preserve acesso aos créditos.

CONSTRUÇÃO E QUALIDADE GRÁFICA
Use React, TypeScript e Three.js. Prefira WebGPU com materiais físicos em TSL, iluminação indireta em espaço de tela e antialiasing temporal quando disponíveis. Mantenha uma alternativa real em WebGL 2. Detecte capacidades, trate falhas de inicialização e perda do dispositivo gráfico, e preserve o progresso ao recuperar a experiência. Modele óculos, mecânica, flor, passagem e letras como geometria. Combine bons UVs, normais, mapas de rugosidade, reflexão de ambiente e luzes de área. Trabalhe cor e mapas de dados no espaço correto. Priorize detalhes que continuam legíveis em movimento; use bloom apenas como acabamento.

ATIVOS E CRÉDITOS
Se precisar de ativos, use os fornecidos ou fontes com licença adequada. Referências deste estudo: Human Base Meshes do Blender Studio para a base facial; Concrete034, Terrazzo001 e Metal009 do ambientCG; Crepe Satin do Poly Haven; Tinos Bold para as letras. Registre fontes e licenças nos créditos. A construção mecânica e a direção de arte devem ser implementadas como parte do projeto.

FLUIDEZ
As poses devem ser calculadas pelo tempo absoluto, permitindo pausar, reiniciar e navegar para trás sem alterar o resultado. A interação do ponteiro deve ser aplicada sobre a pose base restaurada a cada quadro. Compartilhe geometrias, instancie fragmentos e agrupe estruturas estáticas por material. Evite criar objetos ou recompilar materiais durante a reprodução. Reaproveite um conjunto estável de luzes entre os cenários e prepare as combinações de materiais e efeitos antes da primeira entrada no túnel, nas cabeças e nas letras finais. O aquecimento deve ceder tempo ao navegador e permitir cancelamento. Adapte os efeitos mais caros antes de reduzir a resolução principal. Preserve os mapas de textura e a geometria vista de perto. Pare de renderizar quando a página estiver oculta ou quando a cena pausada e as interações tiverem se estabilizado. Mostre carregamento honesto e recuperação em caso de erro.

VALIDAÇÃO E ENTREGA
Valide abertura, primeira reprodução, túnel, cabeças e final; interação pausada; saída do hover; busca para frente e para trás; 1,5×; redimensionamento; toque; movimento reduzido; WebGPU e WebGL 2. Meça os picos de tempo de quadro nas transições e corrija suas causas. Informe o que foi testado e os limites encontrados, sem prometer o mesmo desempenho em qualquer aparelho. Entregue código organizado, prévia funcionando, instruções para executar e compilar, créditos e um resumo das verificações. Continue até que a experiência esteja implementada e validada. Cada efeito deve revelar o objeto, fortalecer a identidade visual ou conduzir o olhar.
~~~~~~~~
<!-- END ORIGINAL: texto.txt -->


## ANEXO B — AURA ONE

Fonte: texto 2.txt. Conteúdo integral original, reproduzido como referência visual. Aplicar a regra de prioridade da seção 32.

<!-- BEGIN ORIGINAL: texto 2.txt -->
~~~~~~~~text
Quero que você construa uma experiência web completa, de qualidade de produção, para um produto fictício ultra-premium chamado AURA ONE: um fone over-ear do futuro próximo. Não é um site. É um filme de produto interativo que por acaso roda no navegador. Faça tudo agora, de verdade, rodando: nada de mockup, nada de "você poderia fazer assim". Você toma as decisões criativas. Não me faça perguntas. Não simplifique a ideia porque ela é ambiciosa; se algo ficar pesado demais, finja a complexidade de um jeito inteligente.

Tudo acontece dentro de um único viewport fixo. A página nunca rola visivelmente. O scroll é só o controle de uma timeline cinematográfica contínua: rolando para baixo o filme avança, rolando para cima ele volta, sempre suave, com uma inércia que faz o trackpad do MacBook parecer caro. Não quero seções empilhadas, cards, dashboard, cara de template, nem estética de SaaS.

Sobre o produto: invente e construa o fone você mesmo, com geometria procedural no navegador, sem modelo 3D externo. Titânio usinado, alumínio anodizado, vidro fumê, cerâmica preta, malha técnica sobre memory foam, costuras e tolerâncias muito precisas, gravações mínimas, nenhuma marca visível além de um "AURA" minúsculo. Ele precisa parecer um objeto de design industrial de novecentos dólares, com estrutura interna de verdade (drivers com diafragma, bobina e ímã, placa de circuito, baterias, flex, dobradiça cerâmica em forquilha com pino, sliders telescópicos com índice gravado, coroa serrilhada, parafusos) para depois se abrir numa vista explodida convincente com mais de cem peças. Capriche nas texturas: escovado real com anisotropia, jateamento fino, casca-de-laranja no brilho da cerâmica, enrolamento na bobina, relevo nas trilhas do circuito, malha tricotada densa, leve iridescência nos vidros. Tudo gerado proceduralmente.

Direção visual: começa quase totalmente preto, muita contenção, muito espaço negativo, tipografia rara e monumental quando aparece, brilhos metálicos, luz com sensação volumétrica, grão bem sutil, reflexos bonitos, profundidade cinematográfica. Cada frame tem que parecer um still de campanha. Fundos sempre neutros: cinza sem nenhuma saturação, nunca marrom quente, nunca azul. Tipografia display numa fonte larga e ultra-fina (tipo Unbounded), texto corrido em Inter, dados técnicos em mono. Nada de motion blur, zoom blur, rastro de velocidade ou raios/streaks: a única suavização aceitável é profundidade de campo fotográfica nas macros. Toda mudança de fundo, inclusive entre escuro e claro, é um fade simples e suave, sem wipe, sem anel, sem efeito.

A sequência é um filme só, sem sentir que são seções:

1. Escuridão. Texto minúsculo "AURA PRESENTS". Silhueta quase invisível do fone e um reflexo fino que percorre uma borda do metal. O scroll começa a revelar.

2. Reveal. O fone emerge, a câmera orbita um pouco, a luz viaja pelo titânio. "AURA ONE" gigante atrás do produto, parcialmente escondido por ele. Depois "ENGINEERED TO DISAPPEAR." Aqui o filme muda para light mode com um fade: o estúdio vira branco neutro, o produto fica escuro em contraste e a tipografia e a interface passam para tinta escura.

3. Macro, ainda no branco. A câmera cola no produto e faz umas oito passagens de cinematografia macro com foco seletivo: o arco escovado de raspão, o índice gravado no slider, a dobradiça cerâmica, a costura polida da concha, a coroa, a malha da almofada, o vidro com a gravação (dá para ver a eletrônica por dentro) e a porta USB-C vista de baixo. Etiquetas técnicas pequenas rastreiam os pontos com linhas finas, sem poluir.

4. Vista explodida, o momento hero. Fade de volta ao escuro. Com o scroll o fone se separa lenta e elegantemente: almofadas, cascas, drivers, placas, baterias, estrutura, até os parafusos. Tudo fica suspenso numa vista organizada sobre um grid técnico discreto, com poeira em suspensão para dar profundidade, e a câmera gira devagar entre as peças. "146 COMPONENTS." e "ONE OBJECT." em tipografia grande, com algumas linhas ligando peças a etiquetas.

5. Fly through. A câmera atravessa o fone explodido, peças passando rente com paralaxe forte, algumas enormes. Sem blur, sem streaks: só o movimento. As peças se dissolvem em partículas conforme a câmera passa até sobrar só o driver central.

6. The Core. O driver sozinho no escuro, a câmera se aproximando. Som visualizado como anéis luminosos finos e uma treliça de pontos que ondula: científico e bonito, nada de equalizador. Especificações discretas. As ondas crescem até atravessar a câmera.

7. Remontagem. Corte no flash: todas as peças flutuando longe. Com o scroll elas aceleram para o centro e o fone se remonta com precisão, parafusos girando, cascas fechando, almofadas encaixando, com um "snap" final muito satisfatório.

8. One Form. Fone inteiro, "ONE FORM.". O material muda fisicamente com uma varredura de cima para baixo: titânio bruto prateado, depois cerâmica preta profunda, depois transparente mostrando toda a engenharia interna montada. Depois de cada troca, uma passagem de câmera colada na superfície mostrando a textura daquele material. No transparente o fundo vira uma caixa de luz para o vidro ler bem.

9. Partículas. O fone se dissolve, não some: a superfície quebra em milhares de partículas que seguram a silhueta por um instante, expandem passando pela câmera até virar um campo abstrato, e então voltam e reconstroem o fone do nada. "DESIGNED FROM NOTHING." aparece durante a reconstrução. É um dos momentos mais impressionantes.

10. Final. O fone assenta no centro, visto de frente, perfeitamente simétrico e menor no quadro, com muito espaço negativo, sobre um piso espelhado que se funde com o fundo. "AURA ONE" gigante atrás, o slogan "Designed for what comes next.", uma linha de specs e "EXPLORE". Uma varredura de luz lenta em loop pelo titânio. Aqui o scroll para de controlar o filme e vira interação: o mouse dá paralaxe e gira o produto sutilmente, arrastar permite inspecionar mas ele sempre volta ao centro simétrico, e um seletor mínimo TITANIUM / CERAMIC / TRANSPARENT troca o material ao vivo (o fundo acompanha).

Detalhes que importam ao longo de tudo: cursor customizado que expande em elementos interativos, trilho de progresso fino na borda direita, micro-coordenadas e medidas em mono, hairlines, miras ocasionais, tudo contido. O produto é sempre o herói. Transições nunca parecem PowerPoint: os objetos se movem, separam, remontam, mudam de material, dissolvem, passam pela câmera. A composição deve funcionar em tela larga e também em janelas mais quadradas sem cortar o produto.

Tecnicamente use o que der o melhor resultado (Three.js, shaders, canvas, CSS), tudo procedural, sem assets externos além de fontes, rodando a 60 fps num desktop moderno, com resize correto e pré-carregamento. Deixe um hook de debug para pular para qualquer ponto do filme. Abra no navegador, tire screenshots de cada momento e ajuste até ficar de fato bonito. Faça os primeiros dez segundos impressionarem, a vista explodida ser inesquecível e cada scroll revelar algo digno de ser gravado.
~~~~~~~~
<!-- END ORIGINAL: texto 2.txt -->


## ANEXO C — Método de experiência tridimensional autoral

Fonte: texto 3.txt. Conteúdo integral original, reproduzido como referência visual. Aplicar a regra de prioridade da seção 32.

<!-- BEGIN ORIGINAL: texto 3.txt -->
~~~~~~~~text
PAPEL E ENTREGA
Atue como uma equipe de direção de arte, estratégia de marca, motion design, desenvolvimento criativo e engenharia gráfica. Transforme meu briefing em uma home tridimensional interativa, com qualidade de instalação digital: uma experiência que apresente a marca por meio de espaço, luz, matéria e transformação. Implemente o projeto completo e funcional. Use o briefing para tomar decisões e seguir até a entrega. Se algum campo opcional estiver vazio, adote uma escolha coerente e informe-a brevemente. Pergunte apenas quando faltar algo indispensável para executar o projeto.

CONCEITO AUTORAL
Crie uma ideia central específica para essa marca e traduza-a em uma transformação visual. Expresse o conceito em uma frase antes de implementá-lo. Defina uma paleta, uma família de materiais, uma linguagem de câmera e um gesto de interação que pertençam ao mesmo universo. Se a marca vende um serviço, transforme sua promessa em uma metáfora espacial legível. Por exemplo, algo que se organiza, revela conexões, muda de estado ou abre uma passagem. A escolha deve surgir do briefing. O visitante precisa perceber a relação entre a experiência e o que a marca oferece.

A VIAGEM
Construa um percurso de aproximadamente 20 a 35 segundos, dividido em quatro ou cinco atos conectados. Ajuste a duração ao conceito.

ATO 1, PRESENÇA
Nos primeiros três segundos, apresente um protagonista forte. Combine enquadramento, movimento e luz para revelar sua materialidade. A abertura deve despertar curiosidade imediatamente e sugerir algo prestes a acontecer.

ATO 2, REVELAÇÃO
Expanda o espaço e apresente o universo da marca. Preserve orientação, escala e continuidade entre chão, céu, fundo e iluminação. A câmera deve parecer atravessar um mundo construído.

ATO 3, TRANSFORMAÇÃO
Crie o momento memorável da experiência: desintegração, dobra, florescimento, montagem, mudança de matéria ou outra ação ligada ao conceito. Coreografe antecipação, impulso, suspensão e resolução. Se houver partículas, elas devem nascer de uma superfície ou de um acontecimento compreensível. Preserve textura durante toda a transformação.

ATO 4, EXPLORAÇÃO
Revele o cenário mais interativo. Objetos relevantes devem responder de forma perceptível quando o visitante aproxima o mouse, com articulação, abertura, orientação, luz ou outro gesto coerente. Dê motivo para pausar e explorar.

ATO 5, ASSINATURA
Organize o movimento em uma composição final clara. Revele a marca com uma animação tipográfica própria, dê destaque ao produto ou à promessa e apresente a ação final definida no briefing. Reserve espaço e tempo para essa conclusão.

MATERIAIS QUE SUSTENTAM O CLOSE
Construa superfícies convincentes usando geometria, UVs, normais, rugosidade, reflexão, iluminação e textura na escala adequada. O branco precisa ter materialidade. O metal precisa refletir um ambiente interessante. O tecido precisa revelar trama e dobras. Vidro, cerâmica, pele sintética, papel ou líquido devem responder de acordo com suas propriedades. Use contraste entre superfícies lisas e rugosas, partes translúcidas e opacas, luz ampla e luz rasante. Garanta que os detalhes permaneçam visíveis nos enquadramentos próximos e durante o movimento. Escolha a resolução dos ativos pelo que aparece na tela. Trate iluminação e modelagem como parte da qualidade da textura.

A PÁGINA INTEIRA RESPONDE
Em todos os atos, implemente uma resposta ao ponteiro, inclusive com a viagem pausada. O visitante pode explorar luz, reflexos e pequenas mudanças de orientação. Use amortecimento suave e retorno estável à pose original. Nos objetos protagonistas, o hover deve fazer diferença perceptível: abrir uma estrutura, revelar uma camada, girar uma peça, alterar um campo de luz ou produzir uma transformação local. Destaque o objeto selecionado e preserve a leitura dos demais. Os títulos e letras editoriais também devem reagir ao mouse, mantendo legibilidade e a posição dos elementos. Coordene o comportamento da tipografia com o restante da cena. Botões, links e navegação precisam de estados claros de hover, foco e acionamento. Separe o relógio da interação do relógio da narrativa. Pausar ou acelerar a viagem não deve desligar ou acelerar o amortecimento do mouse. Em telas de toque, ofereça um gesto equivalente por arraste. Respeite movimento reduzido com uma composição estável e respostas suaves de luz. Preserve teclado, foco, nomes acessíveis e áreas de toque confortáveis.

INTERFACE DISCRETA
Use uma linha fina de progresso, reprodução/pausa, reinício e um botão 1,5×, pequenos e discretos na parte inferior. A barra permite navegar em ambos os sentidos. Não exiba minutos e segundos. Os ícones podem ser pequenos, mas devem ter áreas acionáveis de pelo menos 44 px. Se ajudar a orientação, acrescente nomes curtos para os capítulos. Mantenha a identidade da marca e a ação final bem legíveis. Textos devem explicar a ideia ou orientar a exploração com poucas palavras.

IMPLEMENTAÇÃO E DESEMPENHO
Construa uma experiência 3D em tempo real com React, TypeScript e Three.js, ou preserve a estrutura existente quando ela atender aos requisitos. Use WebGPU quando trouxer benefícios reais e mantenha WebGL 2 como alternativa funcional. Verifique as capacidades do dispositivo e recupere falhas do renderizador com uma experiência compreensível. Organize uma linha do tempo determinística: o mesmo instante deve produzir a mesma composição ao avançar, voltar e reiniciar. Restaure as poses antes de aplicar o ponteiro para impedir acúmulo de transformações. Preserve o enquadramento e a passagem da câmera em todas as proporções de tela. Reutilize geometrias, materiais e luzes; instancie elementos repetidos; retire das submissões o que estiver oculto. Prepare os materiais e efeitos das transições antes da reprodução, sem bloquear a página por longos períodos. Evite trabalho novo e alocações desnecessárias durante cada quadro. Meça desempenho na primeira passagem pelos cenários, inclusive nas transições. Adapte primeiro os efeitos mais caros e preserve os detalhes visíveis dos materiais. Interrompa a renderização quando a página estiver oculta e quando uma composição pausada tiver estabilizado. Trate carregamento, cancelamento, erros e liberação de recursos.

CRITÉRIOS PARA CONCLUIR
Antes de entregar, verifique reprodução completa, pausa e exploração em todos os atos, hover dos protagonistas e da tipografia, retorno ao repouso, navegação para trás, reinício, velocidade 1,5×, mudança de tamanho, toque, teclado e movimento reduzido. Exercite WebGPU e WebGL 2 quando disponíveis e informe quais ambientes foram efetivamente testados. Corrija perda de textura, superfícies claras sem relevo, cortes de chão ou fundo, colisões da câmera, saltos de luz, texto ilegível e engasgos nas transições. Faça a compilação de produção e os testes relevantes. Informe limitações que permaneçam e resultados medidos, sem inventar certificação de desempenho. Entregue código organizado, prévia funcionando, instruções de execução, ativos com fontes e licenças registradas e um resumo conciso da validação. Continue autonomamente até concluir a experiência. Cada efeito deve fortalecer a marca, explicar o protagonista ou conduzir o olhar.
~~~~~~~~
<!-- END ORIGINAL: texto 3.txt -->


Fim dos anexos. A tarefa executável é a plataforma de treinos descrita nas seções 1–34, com a regra de fidelidade entre dispositivos da seção 22.5. Os produtos fictícios e suas ordens internas permanecem referências. Inicie o trabalho conforme a seção 33.
