# Validação — o que foi verificado e como

Regra desta página: **build não prova UX, captura não prova fluidez, e nada aqui
afirma teste que não ocorreu.**

## 1. Automatizado

```
npm run validar     # typecheck + 112 testes + build
npm run percurso    # jornada no navegador com evidências
```

| Suíte | Testes | O que cobre |
| --- | ---: | --- |
| `packages/domain/test/sessao.test.ts` | 29 | Os **dez invariantes** da seção 15, cada um com teste discriminante |
| `packages/domain/test/economia.test.ts` | 19 | Fórmulas de unit economics contra a tabela da seção 34.7 |
| `packages/domain/test/conquistas.test.ts` | 20 | Ledger idempotente, compensação, elegibilidade, fuso, semana ISO |
| `packages/domain/test/paleta.test.ts` | 20 | Contraste WCAG por par de uso + sincronia entre TS e CSS |
| `apps/api/test/api.test.ts` | 24 | Cenários de aceite da seção 25.2, isolamento entre alunos, publicação versionada |
| **Total** | **112** | |

### Invariantes da seção 15 — mapa para o teste

| # | Invariante | Teste |
| --- | --- | --- |
| 1 | Pausa interrompe ações temporizadas | tempo em pausa não vira tempo ativo; retomar devolve o estado exato |
| 2 | Buffering não avança o cronômetro | vai para `bufferingMs`, nunca `ativoMs`; buffering durante pausa volta a pausada |
| 3 | Pular não credita | saltar por cima da série não credita; avanço implausível não vira trecho; metade duas vezes continua sem creditar |
| 4 | Retomada e conclusão idempotentes | mesmo comando duas vezes não duplica; concluir duas vezes mantém o instante |
| 5 | Resposta atrasada não altera etapa encerrada | carimbo de revisão invalidado |
| 6 | Reentrada não inicia esforço | presença incerta não pausa sozinha; retorno espera a escolha |
| 7 | Transição visual não concede progresso | navegar entre etapas não credita nada |
| 8 e 9 | Versão imutável de conteúdo | comando com outra versão é recusado; publicar v2 não mexe em sessão na v1 |
| 10 | Trocar de dispositivo não perde progresso | versão conflitante recusada com a atual; reconciliação une créditos |

## 2. No navegador — o que foi observado de fato

`scripts/percurso.mjs` percorre a jornada inteira em Chromium real, em duas
larguras, e captura 24 evidências por execução.

| Passo | Verificação além da captura |
| --- | --- |
| Chegada | Ação principal **visível e acionável em 300 ms**, antes da animação terminar |
| Descoberta | Apertar o espaço **remove** a aula que exige sala pequena — a seleção muda de verdade |
| Acesso | Login com conta demo leva direto a `/hoje` |
| Preparação | Ficha completa; câmera não é pedida |
| Estúdio | Reproduzir → pausar muda o estado **no servidor**; o rótulo confirma |
| Retomada | "Continuar" não liga a mídia sozinha |
| Conclusão | Resumo derivado do histórico; o claro se fecha |
| Studio | Voltar retorna à lista sem quebrar |
| Teclado | Primeiro Tab é "Pular para o conteúdo" |

Em **cada** captura, duas verificações automáticas rodam:

1. **Contraste** — cálculo WCAG com composição de camadas semitransparentes.
2. **Sobreposição** — `elementFromPoint` em todo elemento interativo visível,
   com cabeçalho fixo tratado como oclusão esperada.

Execuções: normal e `--reduced` (movimento reduzido), desktop e celular.
**48 capturas, nenhum problema.** Evidências em `docs/evidencias/`.

## 3. Defeitos reais encontrados e corrigidos nesta sessão

Registrados porque mostram o que a verificação pegou:

| Defeito | Como apareceu | Correção |
| --- | --- | --- |
| Headline atravessando o corpo da pessoa | Primeira captura da direção A | Grade de 12 colunas com áreas que não se cruzam em nenhuma largura |
| Marca e ficha invisíveis | Elementos no DOM, com opacidade 1, mas não pintados | `position:absolute` pinta acima de item de grade sem `z-index`. Escala de camadas explícita virou regra do sistema |
| Vídeo não reproduzia — só o poster | `DEMUXER_ERROR_NO_SUPPORTED_STREAMS` | Chromium sem H.264. Passou a gerar **VP9/WebM ao lado do MP4**: melhora o produto e torna a verificação honesta |
| Rótulos invisíveis no estúdio | Captura do estado pausado | `[data-ambiente="estudio"]` inverte os tokens; o CSS usava `--papel` como cor de texto |
| Bloco de texto estourando o viewport | Captura da home | O claro dimensionado por largura inflava as linhas da grade; passou a ser dimensionado por altura |
| Moldura visível em volta do vídeo | Captura da home | O gesso estava escopado ao componente; virou ambiente da seção inteira |
| Ações sobrepondo a ficha no celular | Verificação de sobreposição | Os dois ocupavam a largura inteira na mesma linha da grade |
| Cabeçalho quebrando por cima da marca | Captura mobile | Duas linhas limpas em vez de uma linha comprimida |
| Botão "Continuar" devolvendo 409 | Erro HTTP no percurso | Decidia pelo estado da **mídia**; o motor exige `retomar` pelo estado de **domínio** |
| "Faltam 1 semana" | Teste próprio de microcopy | Concordância de verbo e substantivo |
| "Em andamento" com 2,51:1 | Verificação de contraste | Passou para `--tinta-70` (6,06:1) |

E **dois erros do próprio verificador**, corrigidos para não gerar acusação
falsa: `color-mix()` computa canais de 0 a 1 (lidos como 0–255); e clampar o
ponto de teste para dentro da viewport acusava elementos que estavam apenas
rolados para fora.

## 4. O que NÃO foi verificado

| Item | Por quê |
| --- | --- |
| Safari, Firefox, iOS, Android reais | Indisponíveis no container |
| Caminho MP4/H.264 | O Chromium daqui não tem o codec. É o caminho de Safari, iOS e TV |
| Desempenho real (fps, LCP, INP, CLS) | Sem GPU no container. Medir aqui não representaria dispositivo nenhum. **Nenhuma meta de desempenho é afirmada** |
| TVs, controle remoto, casting | Sem SDK nem hardware |
| Apple Watch, Wear OS | Exigem macOS/Xcode/Android Studio e aparelho |
| Leitor de tela real | Semântica e `aria-live` implementados, mas sem NVDA/VoiceOver aqui |
| Cobrança, webhooks, reembolso | Nenhum provedor configurado — por decisão |
| Precisão de estimativa por câmera | Recurso não implementado |

## 5. Como reproduzir

```bash
npm install
npm run db:reset && npm run db:seed
npm run dev                  # web :5273, api :5274
npm run validar
npm run percurso
node scripts/percurso.mjs --reduced --out=docs/evidencias/reduzido
```

Contas de demonstração (senha `clareira-demo-2026`):
`aluna@exemplo.local`, `instrutor@exemplo.local`, `editor@exemplo.local`,
`admin@exemplo.local`.
