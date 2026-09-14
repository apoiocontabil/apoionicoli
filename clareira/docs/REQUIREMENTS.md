# Matriz de requisitos e cobertura

Estados: **Funcional** (implementado e verificado) · **Aguardando integração**
(código pronto, falta serviço externo) · **Experimental** (delimitado, a validar)
· **Pendente** (não implementado, com dependência e próximo passo).

Sequenciar não autoriza excluir. Todo requisito do briefing está aqui, inclusive
os que ainda não foram feitos.

## Etapa 1 — Fundação

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| F1 | Projeto novo isolado, porta e banco próprios | 1 | Funcional | `docs/ARCHITECTURE.md` §1; repositório estava vazio |
| F2 | Briefing preservado no projeto | 3 | Funcional | `docs/BRIEF-MASTER.md`, 1.225 linhas íntegras |
| F3 | CLAUDE.md curto com comandos reais | 3 | Funcional | `CLAUDE.md`; comandos executados nesta sessão |
| F4 | Matriz de requisitos | 29 | Funcional | este arquivo |
| F5 | Registro de skills aplicadas | 4 | Funcional | `docs/SKILLS-APPLIED.md` |

## Etapa 2 — Direção criativa

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| C1 | Três direções **materializadas**, não nomeadas | 8 | Funcional | `explorations/*.html` executáveis; `docs/evidencias/direcoes/` |
| C2 | Mesma mensagem de produto nas três | 8 | Funcional | Título, apoio, ações e ficha idênticos |
| C3 | Escolha fundamentada em critérios do briefing | 8 | Funcional | `docs/CREATIVE-DIRECTION.md` §4–5 |
| C4 | Storyboard por cena com contrato completo | 8 | Funcional | `docs/STORYBOARD.md` |
| C5 | Gesto visual autoral perceptível | 8 | Funcional | O claro abre na chegada e **fecha** na conclusão |
| C6 | Mecanismos não acumulados na mesma página | 7 | Funcional | Passagem → preparação; montagem → biblioteca; realocação registrada |
| C7 | Curadoria de mídia real, assistida antes de escolher | 9 | Funcional | `docs/MEDIA-SOURCES.md`; contact sheets inspecionados |
| C8 | Licença de cada item registrada | 9 | **Parcial** | Rótulo "Free License" registrado; **texto integral pendente** de arquivamento |
| C9 | Candidatos do Pexels avaliados | 9 | Pendente | HTTP 403 no proxy desta sessão. Obter em ambiente com acesso |
| C10 | Acervo autoral do proprietário | 9 | Pendente | Não fornecido. É a única mídia apresentável como aula da plataforma |

## Etapa 3 — Primeira sequência integrada

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| S1 | Abertura com pessoa real treinando em casa | 30 | Funcional | `docs/evidencias/app/01-chegada-*.jpg` |
| S2 | Ação principal acionável antes do fim da animação | 30 | Funcional | Verificado em `scripts/percurso.mjs` |
| S3 | Descoberta por tempo/espaço/impacto que muda o conteúdo | 13 | Funcional | Percurso verifica a troca real; consequência exibida em texto |
| S4 | Estado da descoberta na URL, compartilhável, botão voltar | 11.2 | Funcional | `?minutos=&espaco=&impacto=` |
| S5 | Login sem repetir a introdução | 12 | Funcional | `/entrar` → `/hoje` direto |
| S6 | Preparação sem painel técnico; câmera não pedida | 14 | Funcional | `docs/evidencias/app/05-preparar-*.jpg` |
| S7 | Estúdio com professor legível e controles essenciais | 14 | Funcional | `06-estudio-*`, `07-pausado-*` |
| S8 | Pausa e retomada sem perder contexto | 15 | Funcional | Percurso pausa, confere estado e retoma |
| S9 | Conclusão com resumo verdadeiro | 14 | Funcional | `08-fim-*`; números derivados do histórico |
| S10 | Nenhuma tipografia sobre o corpo, em nenhuma largura | 30 | Funcional | Grade sem cruzamento + verificação de sobreposição automática |

## Etapa 4 — Jornada persistida

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| J1 | Cadastro, autenticação, papéis, isolamento | 26 | Funcional | `apps/api/test/api.test.ts` |
| J2 | Onboarding com preferências | 13 | Funcional | 8 perguntas, todas puláveis; sem pedir peso, altura, câmera ou microfone. Percurso confirma que o perfil é gravado e muda a seleção |
| J3 | Recomendação estável por dia e fuso | 13 | Funcional | `recomendacoes_do_dia` persistida; teste no percurso e na API |
| J4 | Motor determinístico com os 10 invariantes | 15 | Funcional | 29 testes discriminantes |
| J5 | Histórico real, incluindo conclusão parcial | 13 | Funcional | `/v1/historico`; tela Hoje |
| J6 | Calendário: agendar, reagendar, descanso | 13 | Pendente | Tabela `agendamentos` criada; **falta rota e tela** |
| J7 | Ficha por exercício/série com origem do registro | 13 | **Parcial** | Motor registra com `origem`; **falta a tela de edição do registro** |
| J8 | Biblioteca com busca, filtros, favoritos | 13 | Pendente | Filtros existem na descoberta; falta busca textual e favoritos |
| J9 | Evolução além do peso | 13 | Pendente | Conquistas cobrem constância; falta a área de evolução |

## Etapa 5 — Conteúdo e operação

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| A1 | Studio com preview, timeline e propriedades | 20 | Funcional | `11-studio-lista-*`, `12-studio-editor-*` |
| A2 | Marcação de preparação/demonstração/série/descanso/alternativa | 20 | Funcional | Editor de etapas com tipo e crédito |
| A3 | Autosave com estado comunicado | 20 | Funcional | "Tudo salvo / Salvando… / Alterações não salvas" |
| A4 | Rascunho → revisão → aprovada → publicada | 20 | Funcional | Transições validadas; instrutor não aprova o próprio trabalho |
| A5 | Publicação versionada; sessões antigas preservadas | 20 | Funcional | Teste de API confirma sessão em v1 após publicar v2 |
| A6 | Bloqueio de publicação **específico** | 20 | Funcional | Códigos `sem_midia`, `midia_incompleta`, `sem_etapas`, `sem_revisao`, `etapas_invalidas` |
| A7 | Upload de vídeo real com retomada e progresso | 20 | Aguardando integração | Sem provedor. Pendências listadas em `/v1/studio/midias` |
| A8 | Múltiplos ângulos, áudios, legendas | 20 | Pendente | Exige acervo com múltiplas faixas |
| A9 | Prévia como aluno em desktop/celular/TV | 20 | Pendente | Preview central existe; falta o modo de prévia por formato |
| A10 | Administração: alunos, permissões, auditoria, métricas | 20 | **Parcial** | Tabela `auditoria` gravando; **falta a interface** |

## Etapa 6 — Assistência e comercial

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| M1 | Catálogo versionado, preços como hipótese | 24 | Funcional | `catalogo.ts`; tela declara estudo antes do número |
| M2 | Entitlements no servidor | 24.7 | Funcional | `exigirCapacidade`; teste confirma que Essencial não tem IA |
| M3 | Cotas em unidades compreensíveis, com aviso antecipado | 24.4 | Funcional | `precisaAvisar` em 80% do consumo |
| M4 | Contratação recusada sem provedor | 24.7 | Funcional | 409 com pendências |
| M5 | Checkout, webhooks, reconciliação | 24.7 | Aguardando integração | Tabela `eventos_de_pagamento` pronta para ordem e duplicata |
| M6 | Simulador econômico com lacunas marcadas | 24.5 | Funcional | 19 testes; reproduz a tabela da seção 34.7 |
| M7 | Assistência generativa contextual | 16 | Aguardando integração | Sem provedor. Estúdio declara isso na tela |
| M8 | Voz com franquia e interrupção | 16 | Pendente | Depende de M7 |
| M9 | Modo essencial funcionando sem IA | 16 | Funcional | Explicações editoriais e botões independem de provedor |

## Etapa 7 — Módulos completos e dispositivos

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| R1 | Ledger idempotente com versão de regra | 34.4 | Funcional | 20 testes; índices únicos no banco |
| R2 | Marcos com explicação do que falta | 34.3 | Funcional | Tela de conquistas |
| R3 | Reversão por compensação | 34.4 | Funcional | `compensar()`; histórico preservado |
| R4 | Recurso e contestação | 34.3 | **Parcial** | Registro funciona; **fila de revisão humana não existe** e a tela diz isso |
| R5 | Oferta física desativada | 34.1 | Funcional | `OFERTA_FISICA_ATIVA = false` |
| R6 | Catálogo de SKU, fornecedor, frete, estoque | 34.9 | Pendente | Exige decisão comercial e fornecedor |
| R7 | Nutrição, receitas, plano alimentar | 19 | Pendente | Não implementado nesta etapa |
| R8 | Avaliação corporal com procedência | 18 | **Parcial** | Tabela com procedência completa; **faltam rotas e telas** |
| R9 | Câmera e visão experimental | 17 | Pendente | Nenhuma permissão é pedida. Requer escopo por exercício antes de implementar |
| R10 | Internacionalização | 23 | Pendente | Textos em PT-BR no código; **falta externalização** |
| R11 | PWA / offline | 22 | Pendente | Sem service worker |
| R12 | Apple Watch (prioridade explícita) | 22.2 | Pendente | Exige macOS + Xcode + conta de desenvolvimento, indisponíveis aqui. Contratos de sessão prontos em `@clareira/domain` |
| R13 | Wear OS | 22.3 | Pendente | Idem, com Health Services |
| R14 | TVs (tvOS, Android TV, Tizen, webOS) | 22.1 | Pendente | Exige SDK e hardware. Ver `docs/DEVICE-MATRIX.md` |
| R15 | Pareamento celular/TV com QR | 22 | Pendente | Contrato de controlador existe no motor (`controladorId`) |

## Etapa 8 — Qualidade

| ID | Requisito | § | Estado | Evidência / próximo passo |
| --- | --- | --- | --- | --- |
| Q1 | Build, typecheck e testes | 30 | Funcional | 112 testes; `npm run validar` |
| Q2 | Verificação no navegador, desktop e celular | 30 | Funcional | `scripts/percurso.mjs`, 48 capturas |
| Q3 | Contraste verificado automaticamente | 23 | Funcional | Teste de paleta + verificação em cada captura |
| Q4 | Sobreposição sobre elementos interativos | 30 | Funcional | Verificação automática no percurso |
| Q5 | Teclado e foco | 23 | Funcional | Atalho de pular; foco ao navegar; Espaço pausa |
| Q6 | Movimento reduzido | 10 | Funcional | Percurso roda com `--reduced`; evidência separada |
| Q7 | Cenário sem WebGL | 23 | Não aplicável | A aplicação não usa WebGL. A exploração C tem alternativa |
| Q8 | Leitor de tela | 23 | **Parcial** | Semântica, `aria-live` e rótulos prontos; **falta teste com leitor real** |
| Q9 | Medição de desempenho em dispositivo representativo | 27 | Pendente | O container não tem GPU; medir aqui não representaria nada |
| Q10 | Revisão de segurança | 26 | **Parcial** | Isolamento por ID testado; limitação de tentativas; **falta revisão dedicada** |
