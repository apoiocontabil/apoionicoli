# Arquitetura e decisões

Skills aplicadas: `avora-codigo-automacao` #0127 (modelagem de schema), #0122
(design de API), #0130 (autenticação e autorização). Registro em
`docs/SKILLS-APPLIED.md`.

## 1. Isolamento do projeto novo

Exigência da seção 1 do briefing, verificada:

| Recurso | Valor | Verificação |
| --- | --- | --- |
| Pasta | `clareira/` dentro do repositório | O repositório estava **vazio** no início da sessão (só `.git`): nenhum projeto anterior foi tocado, sobrescrito ou migrado |
| Porta web | 5273 | `apps/web/vite.config.ts`, `strictPort: true` |
| Porta API | 5274 | `CLAREIRA_API_PORT`, padrão 5274 |
| Banco | `.dados/clareira.db` | Arquivo próprio; `.gitignore` o exclui |
| Credenciais | nenhuma | Nada de produção foi lido, reutilizado ou configurado |

## 2. Stack escolhida, com a alternativa considerada

Inspeção do ambiente antes de decidir: Node 22.22.2, npm 10.9.7, pnpm 10.33,
Python 3.11, Chromium do Playwright em `/opt/pw-browsers`, rede com proxy
(npm e Mixkit acessíveis; Pexels bloqueado com 403).

| Camada | Escolha | Alternativa considerada | Por quê |
| --- | --- | --- | --- |
| Monorepo | npm workspaces | pnpm, Turborepo | npm já está no ambiente e a árvore é pequena; uma ferramenta a mais não paga o custo |
| Domínio | pacote TS puro `@clareira/domain` | lógica dentro da API | O motor de sessão, as regras de conquista e o simulador precisam rodar **sem I/O** para serem testáveis e, no futuro, reaproveitáveis por cliente nativo. É o que a seção 25.1 pede |
| API | `node:http` + roteador próprio (~180 linhas) | Fastify, Express | A superfície é pequena e o caminho da requisição precisa ser auditável linha a linha para idempotência e autorização. Um framework escondia exatamente o que mais importa aqui |
| Banco | SQLite via `better-sqlite3` + migrações SQL | Prisma + Postgres | Migrações reproduzíveis sem passo de codegen, síncrono (sem corrida em transação), zero serviço externo para rodar local. **Trade-off assumido**: um banco de arquivo não serve operação multi-instância — a troca para Postgres é uma reescrita das migrações e do adaptador, não da aplicação |
| Senha | `scrypt` da biblioteca padrão | bcrypt, argon2 | Não inventar criptografia e não acrescentar dependência nativa. scrypt está no Node e é resistente a hardware dedicado |
| Web | React 18 + TypeScript + Vite | Next.js, Astro | Não há necessidade de SSR nesta etapa e o roteamento é pequeno demais para justificar um framework de aplicação |
| Roteamento web | History API + ~90 linhas próprias | react-router | Toda rota abre direto por URL, o botão voltar funciona e o foco vai para o conteúdo. Uma dependência para isso não se pagava |
| Motion | CSS + `requestAnimationFrame` próprio | **GSAP**, Motion | Decisão explícita: a direção escolhida precisa de `clip-path`, opacidade e translação amortecida — o navegador faz isso, e o determinismo de `pose(t)` é mais fácil de garantir com um laço próprio do que sincronizando uma timeline de terceiros. GSAP entra se e quando houver coreografia com scrub, reversão e nesting que justifique. **Está no repertório, não no bundle** |
| 3D | nenhum na aplicação | Three.js | A direção A não precisa de WebGL. Three.js ficou como devDependency da raiz, usado só pela exploração C, que é registro da comparação criativa |

### O que a decisão de motion custou e ganhou

Ganho: bundle de 205 KB (63 KB gzip) sem biblioteca de animação; nenhuma
disputa entre dois sistemas pela mesma propriedade; `pose(t)` verificável.
Custo: coreografia complexa futura (scroll com scrub, Flip entre rotas) terá
que ser escrita à mão ou motivar a entrada do GSAP. A troca é local — o sistema
de movimento está em `apps/web/src/design/movimento.ts`.

## 3. Fronteiras

```
packages/domain/          sem I/O, sem DOM, 100% testável
  session/                motor determinístico + intervalos de reprodução
  plans/                  catálogo comercial versionado + entitlements
  rewards/                regras de conquista + ledger
  economics/              simulador de unit economics
  design/                 paleta como fonte de verdade (espelhada em CSS)
  catalog/                contratos de conteúdo

apps/api/                 servidor; única camada que escreve no banco
  db/                     conexão, migrações SQL, seeds de desenvolvimento
  lib/                    auth, roteador HTTP, erros
  routes/                 acesso, catálogo, sessões, autoria, comercial, conquistas

apps/web/                 interface
  design/                 tokens e sistema de movimento
  scenes/                 Claro — o gesto autoral
  routes/                 as telas da jornada
  lib/                    cliente da API e roteamento
```

Regra de dependência: `web → domain`, `api → domain`. **Nunca** `domain → api`
ou `domain → web`. O domínio não conhece HTTP, banco nem DOM.

## 4. Entidades

Schema completo em `apps/api/src/db/migrations/001_inicial.sql`, com comentários
por decisão. Os pontos que merecem destaque:

- **`versoes_de_aula`** é append-only. A sessão referencia `(aula_id, versao)` e
  uma chave estrangeira composta garante que ela sempre aponte para uma versão
  que existe. Editar a aula mexe em `rascunhos_de_aula`, nunca aqui.
- **`comandos_de_sessao.comando_id`** é chave primária: a idempotência existe no
  banco, não só na aplicação. Dois retries convergem.
- **`ledger_conquistas`** tem índices únicos parciais para uma unidade por dia e
  por semana, por aluno. O limite é do banco, não da aplicação.
- **`medidas_corporais`** carrega `origem`, `metodo`, `responsavel`,
  `dispositivo`, `algoritmo_versao` e `incerteza`. Sem procedência, a linha não
  entra: estimativa nunca se confunde com medida.
- **`eventos_de_pagamento`** guarda `ocorrido_em_ms` do provedor além do
  `recebido_em_ms`, para descartar evento antigo que chega tarde, e
  `motivo_descarte` para a decisão ficar auditável.

## 5. Contratos de API

Convenções: base `/v1`, recursos no plural, corpo e resposta JSON, erro sempre
no formato `{ erro: { codigo, mensagem, detalhe }, correlacao }`. O `codigo` é
estável para a interface decidir; a `mensagem` é escrita para a pessoa ler.

| Método | Rota | O que garante |
| --- | --- | --- |
| POST | `/v1/acesso/cadastro` | Cria conta com papel `aluno` e assinatura `sem_assinatura` |
| POST | `/v1/acesso/entrar` | Mesma resposta e mesmo custo de tempo para conta inexistente e senha errada |
| POST | `/v1/acesso/recuperar` | Declara `integracaoDeEmail: 'pendente'` — não finge ter enviado |
| GET | `/v1/aulas` | Só aula publicada com versão; filtros conjuntivos de tempo, espaço, impacto e equipamento |
| GET | `/v1/hoje` | Recomendação **persistida** por aluno e dia local; `?regerar=1` é atualização solicitada, registrada como tal |
| POST | `/v1/sessoes` | Começa no início definido; prévia pública não transfere timestamp |
| POST | `/v1/sessoes/:id/comandos` | Idempotente por `id`; recusa conflito com 409 e a versão atual |
| GET | `/v1/sessoes/:id/estado` | Reconciliação explícita ao voltar de background |
| POST | `/v1/studio/aulas/:id/publicar` | Transição controlada; 409 com **bloqueios específicos** |
| GET | `/v1/entitlements` | Decisão do servidor por capacidade, com saldo e aviso antecipado |
| POST | `/v1/assinatura/contratar` | **Recusa** com as pendências reais |
| GET | `/v1/conquistas` | Progresso derivado do ledger; explicação sem expor antifraude |
| POST | `/v1/interno/simulador` | Exige papel `admin` |

### Comando de sessão — o contrato que mais importa

```jsonc
POST /v1/sessoes/:id/comandos
{
  "id": "cmd-único-do-cliente",   // idempotência
  "tipo": "pausar",
  "dispositivoId": "dev_ab12",    // controlador
  "versaoEsperada": 7,            // opcional: concorrência otimista
  "carga": { }
}
```

O servidor deriva a identidade da autenticação — **nunca** de um `userId`
enviado pelo cliente —, carimba o instante, valida permissão e estado, aplica
uma única vez e devolve o estado com a versão confirmada.

## 6. Dependências externas: estado real

Nenhuma está configurada. Em todos os casos existe o adaptador e a pendência
nomeada; em nenhum caso existe simulação apresentada como funcionando.

| Serviço | Estado | O que falta |
| --- | --- | --- |
| Pagamento | `nao_configurado` | Aprovar preço; credenciais no servidor; webhook assinado com idempotência e reconciliação |
| Vídeo | `nao_configurado` | Provedor com upload retomável, transcodificação, CDN e mídia privada com expiração |
| IA / voz | `nao_configurado` | Provedor, prompt versionado, limites por plano, timeouts e observabilidade de custo |
| E-mail | `nao_configurado` | Provedor para recuperação de acesso e lembretes |

`GET /v1/saude` declara os quatro. A interface diz o mesmo onde a decisão da
pessoa depende disso.

## 7. O que esta arquitetura deliberadamente NÃO faz

- Não tem fila, microserviço nem cache distribuído: não há problema que os
  justifique, e a seção 25.3 pede o contrário.
- Não tem SSR: nenhuma rota depende de SEO ou de primeiro byte crítico nesta
  etapa.
- Não usa LLM em nenhum caminho de decisão. Recomendação é regra versionada
  (`recomendacao-v1`); elegibilidade de conquista é função pura reproduzível.
