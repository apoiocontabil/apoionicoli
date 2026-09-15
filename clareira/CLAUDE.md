# Clareira — regras permanentes

Plataforma de treino em casa. Projeto **novo**, construído do zero a partir do
prompt mestre de 11/09/2026 (`docs/BRIEF-MASTER.md`). Nome de trabalho
substituível em `packages/domain/src/plans/catalogo.ts`.

## Comandos reais

```bash
npm install
npm run db:reset && npm run db:seed   # banco de desenvolvimento + dados demo
npm run dev                           # web :5273 + api :5274
npm test                              # 112 testes
npm run typecheck
npm run build
npm run validar                       # typecheck + test + build
npm run percurso                      # percurso no navegador com evidências
```

Porta web **5273**, API **5274**, banco em `.dados/clareira.db`. Nenhuma delas é
compartilhada com implementação anterior.

## Invariantes que não podem quebrar

1. **A pose é função do tempo absoluto.** `pose(t)` é pura; avançar, voltar ou
   reiniciar produz a mesma composição. O offset do ponteiro é aplicado sobre a
   pose base restaurada, nunca acumulado.
2. **O motor de sessão é a autoridade.** Animação e assistência apresentam
   estado; não creditam execução, não decidem tempo, não concedem permissão.
   Os dez invariantes da seção 15 estão em `packages/domain/src/session/` e
   cobertos por `packages/domain/test/sessao.test.ts`.
3. **Entitlement é decidido no servidor**, em `exigirCapacidade`. Esconder botão
   não é segurança.
4. **Conteúdo publicado é imutável.** Publicar cria versão nova; sessão em
   andamento continua na versão dela.
5. **O ledger de conquistas é append-only.** Reversão é evento compensatório,
   nunca edição de histórico. O cliente nunca envia saldo.
6. **Toda camada declara seu `z-index`.** Elemento `position:absolute` pinta
   acima de item de grade sem z-index — isso já fez blocos de texto sumirem.
7. **Dentro de `[data-ambiente="estudio"]` os tokens são invertidos**: use
   sempre o nome semântico (`--tinta` é texto, `--papel` é fundo). Usar valor
   fixo deixou rótulos invisíveis no escuro.
8. **Dinheiro em centavos inteiros. Instantes em ms UTC carimbados pelo
   servidor.** O relógio do cliente não é autoridade.

## Honestidade — não negociável

- Nenhum preço é oferta. `operacao.cobrancaHabilitada` é `false` e a rota de
  contratação **recusa** com as pendências reais.
- `OFERTA_FISICA_ATIVA = false`: nenhum benefício físico é prometido.
- Mídia stock é rotulada como ilustrativa na interface, não só na documentação.
- Integração ausente se declara ausente (`/v1/saude`), nunca simula sucesso.
- Nada de "mais escolhido" sem dado, preço riscado sem base, escassez falsa ou
  depoimento fictício.

## Documentos

| Arquivo | O que é |
| --- | --- |
| `docs/BRIEF-MASTER.md` | O briefing completo, íntegro |
| `docs/REQUIREMENTS.md` | Matriz de cobertura com estado e evidência |
| `docs/ARCHITECTURE.md` | Stack, decisões, contratos |
| `docs/CREATIVE-DIRECTION.md` | Conceito, 3 direções, decisão, sistema visual |
| `docs/STORYBOARD.md` | Cena a cena |
| `docs/MEDIA-SOURCES.md` | Origem, licença e transformação de cada mídia |
| `docs/PRICING-MODEL.md` | Hipóteses de preço e unit economics |
| `docs/REWARDS-PRODUCT.md` | Programa de reconhecimento |
| `docs/DEVICE-MATRIX.md` | O que foi testado, onde, e o que falta |
| `docs/VALIDATION.md` | O que foi verificado e como |
| `docs/roteiro-de-validacao.html` | Roteiro de validação para o dono do produto |
| `docs/SKILLS-APPLIED.md` | Skills lidas → decisão → artefato |
| `docs/PROGRESS.md` | Estado atual e próximo passo preciso |

## Ao retomar

Leia `docs/PROGRESS.md` e confira o código antes de assumir qualquer coisa.
