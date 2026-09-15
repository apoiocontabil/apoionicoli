# Clareira

Plataforma de treino em casa. Projeto novo, construído do zero a partir do
prompt mestre em `docs/BRIEF-MASTER.md`.

> **Sua casa abre um claro de luz e vira o seu estúdio pelo tempo que você tiver
> — e depois volta a ser sua casa.**

"Clareira" é nome de trabalho, substituível em
`packages/domain/src/plans/catalogo.ts`. Nenhum outro arquivo depende dele.

## Rodar

Requisitos: Node ≥ 20.11.

```bash
npm install
npm run db:reset && npm run db:seed
npm run dev
```

- Interface: <http://localhost:5273>
- API: <http://localhost:5274/v1/saude>

Contas de demonstração, senha `clareira-demo-2026`:

| Conta | Papel |
| --- | --- |
| `aluna@exemplo.local` | Aluno, plano Essencial |
| `instrutor@exemplo.local` | Autoria |
| `editor@exemplo.local` | Revisão e publicação |
| `admin@exemplo.local` | Administração, plano Completo |

Contas demo **não** têm atalho de privilégio: passam pela mesma autenticação e
pelas mesmas regras de autorização.

## Verificar

```bash
npm run validar     # typecheck + 112 testes + build
npm run percurso    # jornada completa em navegador real, com evidências
```

O percurso abre Chromium, percorre chegada → descoberta → acesso → hoje →
preparação → aula com pausa e retomada → conclusão → conquistas → studio do
professor, em desktop e celular, e verifica automaticamente contraste WCAG e
sobreposição sobre elementos interativos. Resultado em `docs/evidencias/`.

## O que existe

| Área | Estado |
| --- | --- |
| Abertura cinematográfica com pessoa real treinando em casa | Funcional |
| Descoberta por tempo, espaço e impacto que muda o conteúdo | Funcional |
| Acesso, perfil, recomendação estável por dia e fuso | Funcional |
| Motor de sessão determinístico com os 10 invariantes da seção 15 | Funcional, 29 testes |
| Estúdio de treino com pausa, retomada, alternativa e conclusão honesta | Funcional |
| Studio do professor com timeline e publicação versionada | Funcional |
| Catálogo comercial, entitlements no servidor, simulador econômico | Funcional |
| Conquistas com ledger idempotente e compensação | Funcional |
| Pagamento, upload de vídeo, IA, voz, e-mail | **Aguardando integração** |
| Clientes nativos (Watch, TV) | **Pendente**, contratos prontos |

Estado por requisito em `docs/REQUIREMENTS.md`. O que foi e o que **não** foi
verificado em `docs/VALIDATION.md`.

## Honestidade

Este projeto não simula o que não existe:

- **Nenhum preço é oferta.** A rota de contratação recusa, com as pendências.
- **Nenhum benefício físico é prometido.** `OFERTA_FISICA_ATIVA = false`.
- **A mídia é stock ilustrativo** e está rotulada como tal na interface, não só
  aqui. Os professores são perfis de demonstração.
- **Integração ausente se declara ausente** em `/v1/saude` e nas telas onde a
  decisão da pessoa depende disso.
- Nenhuma meta de desempenho é afirmada: o container não tem GPU e medir aqui
  não representaria dispositivo nenhum.

## Estrutura

```
packages/domain/   regras puras e testáveis, sem I/O nem DOM
apps/api/          servidor, banco, migrações, seeds
apps/web/          interface React
explorations/      as três direções criativas, executáveis
scripts/           preparo de mídia e verificação em navegador
docs/              briefing, decisões, matrizes e evidências
```

## Licenças

Código deste repositório: a definir com o proprietário.
Mídia e tipografia: origem, autor e licença de cada item em
`docs/MEDIA-SOURCES.md`, incluindo a pendência de arquivar o texto integral das
licenças antes de qualquer publicação comercial.
