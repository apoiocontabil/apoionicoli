# Estado atual e próximo passo

Atualizado em 14/09/2026, ao fim da primeira sessão de construção.

## Onde o projeto está

Etapas 1 a 3 da seção 29 concluídas e verificadas. Etapas 4 a 6 parcialmente
implementadas. Etapa 7 tem contratos prontos e clientes nativos pendentes de
ambiente. Etapa 8 automatizada no que o container permite.

**A jornada principal funciona de ponta a ponta**: chegada → descoberta →
acesso → hoje → preparação → aula com pausa e retomada → conclusão →
conquistas, mais uma operação real de autoria do professor com publicação
versionada.

112 testes passando. Build limpo. 48 capturas de navegador sem problema.

## Decisões tomadas que valem registro

1. **Direção criativa: "Claro"**, escolhida entre três implementadas, por vencer
   nos dois critérios eliminatórios do briefing. B e C não foram descartadas —
   seus mecanismos foram realocados para onde servem.
2. **Sem GSAP e sem Three.js na aplicação.** Decisão técnica documentada em
   `docs/ARCHITECTURE.md` §2, com o custo assumido.
3. **VP9/WebM ao lado do MP4.** Nasceu de uma limitação do ambiente de teste e
   virou melhoria de produto.
4. **Nome de trabalho "Clareira"**, substituível em um arquivo.

## Próximo passo preciso

Em ordem, pelo que destrava mais:

1. **Onboarding** (`J2`): a tela que coleta objetivo, disponibilidade,
   equipamento, espaço e impacto. O `PATCH /v1/perfil` já existe e a recomendação
   já lê o perfil — falta só a interface. É o maior ganho por menor esforço.
2. **Calendário** (`J6`): tabela `agendamentos` criada; faltam rota e tela.
3. **Edição do registro de série** (`J7`): o motor já grava com `origem`; falta a
   interface de correção preservando rastreabilidade.
4. **Verificar em Safari** — expõe o caminho H.264, `svh`, `safe-area` e autoplay,
   que hoje são a maior incerteza real.
5. **Área de evolução** (`J9`) e **avaliação corporal** (`R8`): o schema com
   procedência completa já existe.

## O que está bloqueado, e por quê

| Bloqueio | Dependência | Não é falta de implementação |
| --- | --- | --- |
| Cobrança | Preço aprovado + provedor + revisão legal | Adaptador e entitlements prontos |
| Upload de vídeo | Provedor de vídeo | Estados de processamento já modelados |
| Assistência por IA e voz | Provedor + prompt versionado | Modo essencial funciona sem |
| Apple Watch / Wear OS / TVs | macOS, Xcode, SDKs, hardware | Contrato de sessão e controlador prontos |
| Licença Mixkit integral | Texto carregado por JS | Rótulo registrado; ler antes de publicar |
| Clipes do Pexels | HTTP 403 no proxy | — |
| Acervo autoral | Não fornecido | É a única mídia apresentável como aula real |

## Ao retomar

Leia este arquivo, depois `docs/REQUIREMENTS.md` para o estado por requisito, e
confira o código antes de assumir qualquer coisa. `CLAUDE.md` tem os comandos e
os invariantes que não podem quebrar.
