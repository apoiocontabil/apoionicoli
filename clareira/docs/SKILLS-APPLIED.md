# Skills: descoberta → leitura → aplicação → artefato → validação

Registro exigido pela seção 4 do briefing. Só aparecem aqui skills que foram
**efetivamente lidas nesta sessão** e que produziram uma decisão rastreável.
Nome decorativo sem consequência não entra.

## Descoberta

As skills estão em `~/.claude/skills/synced/<id>/`, distribuídas como plugin.
146 arquivos `SKILL.md`. As bibliotecas Avora usam documentos agrupados com
âncoras (`procedimentos-NNNN-NNNN.md#p-NNNN`) e, para parte dos procedimentos,
arquivos individuais em `references/NNNN.md` — as duas formas foram encontradas
e lidas.

**Não foram carregados os 1.161 procedimentos.** Foram abertos os pertinentes a
cada fase, como o briefing determina.

## Aplicadas

| Skill / procedimento | Lido | Decisão concreta | Artefato | Validação |
| --- | --- | --- | --- | --- |
| `cinematic-web-toolkit` (SKILL.md + references/tools.md) | Sim, integral | Escolher a menor combinação de ferramentas; conceito e storyboard **antes** de programar efeito; separar o relógio da cena do relógio da aula; não tratar URL de documentação como MCP | `docs/CREATIVE-DIRECTION.md`, `docs/STORYBOARD.md`, `apps/web/src/scenes/Claro.tsx` | Percurso no navegador com 48 capturas |
| `avora-direcao-criativa` #0189 — Análise de referências | Sim | Separar observação de hipótese: registrei quais referências foram **abertas** e quais só foram lidas por descrição | `docs/CREATIVE-DIRECTION.md` §1 e §4 | — |
| `avora-direcao-criativa` #0196 — Conceito criativo avançado | Sim | Entregar 5 conceitos com profundidade, não 1; os não escolhidos foram **realocados**, não descartados | `docs/CREATIVE-DIRECTION.md` §2 | — |
| `avora-direcao-criativa` #0193 — Storytelling visual | Sim | Narrativa central, sequência, momentos-chave e direção estética; o gesto do claro **fecha** o arco que abriu | `docs/STORYBOARD.md` | Cena 9 capturada |
| `avora-direcao-criativa` #0201 — Direção de arte | Sim | Três direções com ideia central distinguível e viabilidade comparada | `explorations/*.html` | `docs/evidencias/direcoes/` |
| `avora-design-branding` #0161 — Moodboard e curadoria | Sim | Curar poucas referências focadas e **extrair princípio**, não copiar; definir as anti-referências | `docs/CREATIVE-DIRECTION.md` §4 | — |
| `avora-design-branding` #0162 — Brand guidelines | Sim | Paleta com HEX + proporção + **acessibilidade WCAG**; escala tipográfica; grid | `packages/domain/src/design/paleta.ts`, `apps/web/src/design/tokens.css` | 20 testes de paleta |
| `avora-design-branding` #0165 — Diagnóstico de design | Sim | Auditar por área com critério, priorizar por impacto | Aplicado à crítica das três direções em §4 | — |
| `avora-design-branding` #0289 — Pesquisa de mercado visual | Sim | Mapear o saturado e achar o espaço vazio: o registro "preto + neon + caixa alta condensada" é o padrão da categoria, e por isso a direção B foi recusada | `docs/CREATIVE-DIRECTION.md` §4 | — |
| `avora-codigo-automacao` #0127 — Modelagem de schema | Sim | Constraints no banco como última linha de defesa; nomes sem abreviação; índices com propósito | `001_inicial.sql`, `002_rascunhos.sql` | Migrações aplicadas; 24 testes de API |
| `avora-codigo-automacao` #0122 — Design de API REST | Sim | Nomenclatura consistente, versionamento em `/v1`, erro padronizado, idempotência explícita | `apps/api/src/routes/*`, `docs/ARCHITECTURE.md` §5 | Testes de integração |
| `avora-codigo-automacao` #0130 — Autenticação e autorização | Sim | Não inventar criptografia (scrypt da stdlib); token de vida curta com **hash** no banco; falhar de forma segura; menor privilégio | `apps/api/src/lib/auth.ts` | Teste de isolamento por ID; enumeração de conta impedida |
| `avora-financeiro-compliance` #0306 e #0484 (via `indice.md`) | Índice lido; procedimentos localizados em `procedimentos-0293-0307.md#p-0306` e `procedimentos-0432-0484.md` | Modelar margem de contribuição, espaço econômico e ponto de equilíbrio **sem contar a mesma rubrica duas vezes**; tratar LTV/CAC como heurística | `packages/domain/src/economics/simulador.ts` | 19 testes; reproduz a tabela da seção 34.7 |

## Skills do briefing que NÃO foram aplicadas, e por quê

Honestidade importa mais que uma lista longa:

| Skill | Por que não |
| --- | --- |
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-performance`, `gsap-react` | **Decisão técnica**: a direção escolhida não usa GSAP (ver `docs/ARCHITECTURE.md` §2). Ler a API de uma biblioteca que não entra no bundle seria teatro. Entram quando houver coreografia com scrub/Flip que justifique |
| `avora-operacoes-rh` #0557 (briefing técnico) | O briefing do proprietário já é exaustivo; gerar um questionário de levantamento seria trabalho redundante |
| `avora-conteudo-copy` #0069–#0072 | O microcopy foi escrito diretamente contra as restrições do briefing (sem slogan, sem culpa, sem promessa). Procedimento de copy publicitária não se aplicava |
| `avora-produto-ecommerce-saas` #0117 (churn) | Condicional a dados de churn. Não existem |
| `avora-marketing-vendas` #0078, #0238 | Jornada de aquisição e fidelização dependem de oferta aprovada, que não existe |
| Product Tracking | Não encontrado nesta sessão |
| `spell-ui`, Spline, Unicorn Studio, Refero | MCP/editor não conectados nesta sessão. Nenhum `projectId` foi inventado, nenhuma cena foi alegada |

## Como as heurísticas foram adaptadas

Os procedimentos Avora dizem, em texto próprio, que "as instruções atuais do
usuário prevalecem sobre quantidades, formatos e heurísticas desta metodologia".
Foi o que se fez:

- #0201 pede "3 direções de arte": entregues 3, mas **implementadas e
  renderizadas**, porque a seção 8 do briefing exige composição materializada.
- #0162 pede um guia de marca completo em PDF/Figma: o guia virou **código
  executável e testado** (`paleta.ts` + `tokens.css` + teste), porque um
  documento que ninguém segue é inútil e aqui existe ferramenta para garantir.
- #0306 sugere razões de referência: tratadas como heurística, não como dado
  deste negócio. O simulador marca lacuna e mantém a conclusão condicional.
