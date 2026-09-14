# Matriz de dispositivos

Regra: **compatibilidade comercial só para combinação verificada.** Uma janela
redimensionada não valida TV, controle remoto, casting, sensor ou autoplay de
hardware real.

## O que foi efetivamente testado nesta sessão

| Alvo | Como | Resultado |
| --- | --- | --- |
| Desktop 1440×900, DPR 2 | Chromium (build do Playwright), percurso completo | Jornada inteira funcional; 24 capturas |
| Celular 390×844, DPR 2, toque | Mesmo navegador com emulação de toque e `isMobile` | Jornada inteira funcional; 24 capturas |
| Movimento reduzido | `reducedMotion: 'reduce'` nos dois tamanhos | Composição final estável, conteúdo completo, nenhum problema |
| Teclado | Tab a partir do topo | Primeiro alvo é "Pular para o conteúdo"; Espaço pausa a aula |
| Contraste | Cálculo WCAG em cada captura | Nenhum texto abaixo do mínimo |
| Sobreposição | `elementFromPoint` em cada elemento interativo | Nada coberto |

### Limitação importante do ambiente de teste

O Chromium empacotado é build **open-source sem H.264**. O MP4 falha com
`DEMUXER_ERROR_NO_SUPPORTED_STREAMS` e só o poster aparece. Por isso o pipeline
passou a gerar **VP9/WebM ao lado do MP4** — o que também melhora o produto. As
capturas mostram vídeo de verdade reproduzindo, não pôster.

Consequência honesta: **o caminho MP4/H.264 não foi exercitado neste ambiente.**
Ele é justamente o caminho de Safari, iOS e TVs. Precisa ser verificado em
navegador com codec proprietário antes de qualquer afirmação sobre esses alvos.

## Famílias no mapa

Nenhuma foi excluída por falta de hardware agora.

| Família | Experiência pretendida | Estado | Dependência real |
| --- | --- | --- | --- |
| Desktop Chromium | Completa, incluindo autoria | **Verificado** | — |
| Desktop Safari / Firefox | Completa | **Não verificado** | Navegador indisponível no container |
| iPhone / iPad (Safari) | Descoberta, treino, histórico | **Não verificado** | Safari real; `safe-area`, orientação, autoplay `playsInline`, H.264 |
| Android (Chrome) | Mesmos fluxos | **Parcialmente inferido** | Emulação de toque feita no Chromium desktop; falta aparelho real |
| Apple TV / tvOS | Vídeo em destaque, comando à distância | Pendente | App tvOS; foco por controle remoto; lifecycle. AirPlay é caminho distinto |
| Android TV / Google TV | Catálogo e aula | Pendente | App próprio; APIs de mídia. Cast é integração separada |
| Samsung Tizen / LG webOS | Aula e navegação por foco | Pendente | SDK, empacotamento, certificado, codecs por geração de engine |
| **Apple Watch** (prioridade do proprietário) | Telas correspondentes em proporção compacta, controle, fase, tempo, hápticos | Pendente | macOS + Xcode + conta de desenvolvedor + aparelho. **Indisponíveis neste ambiente.** O contrato de sessão e o controlador já existem em `@clareira/domain` e na API (`POST /v1/sessoes/:id/controlador`), então o app nativo consome contrato pronto |
| Wear OS | Idem, com Health Services | Pendente | Android Studio + aparelho |
| Garmin e outros | Funcionalidade possível pela plataforma | Pendente | Avaliar SDK vigente e elegibilidade |

## Fidelidade visual entre categorias (seção 22.5)

Comparação feita entre desktop 1440×900 e celular 390×844, mesmos dados, mesmo
instante da cena:

| Critério | Resultado |
| --- | --- |
| Mesma identidade e paleta | Sim — os mesmos tokens |
| Mesma sequência narrativa | Sim — o claro abre, o texto entra por linha, a ficha fecha |
| Mesmos elementos principais presentes | Sim — nenhum bloco some no celular |
| Mesmo gesto de passagem | Sim — mesma `pose(t)`, mesmo código |
| Proporções ajustadas sem descaracterizar | Sim — a grade reflui de 2 áreas para 1 coluna |
| Mídia reenquadrada sem deformar | Sim — vertical dedicada e `object-fit: cover`. **Nunca** `scale` sobre layout fixo |
| Alvos de toque ≥44px | Sim — `--alvo-min` em todo botão e link de navegação |
| Nenhuma ação essencial dependente de hover | Sim — hover é realce, nunca acionamento |

### Divergências registradas

1. **Cabeçalho**: desktop em uma linha, celular em duas (marca, depois
   navegação). Tentar uma linha só escondia destinos por baixo da marca. A
   divergência preserva o acesso, que vale mais que a simetria.
2. **Proporção do claro**: no desktop, 16:9 com altura mandando; no celular, a
   linha da grade manda e o recorte é `cover` com `object-position: center 30%`,
   para preservar cabeça e tronco. É recorte, não deformação.
3. **Ficha técnica**: desktop no canto inferior direito, ao lado do texto;
   celular abaixo das ações, em linha própria — porque no celular os dois
   ocupam a largura inteira e dividir linha causava colisão.

## Próximos passos por ordem de custo

1. Verificar em Safari real (desktop e iOS) — expõe o caminho H.264, `svh`,
   `safe-area` e autoplay.
2. Verificar em Android real.
3. Modo de apresentação para tela grande, com foco navegável — dá TV utilizável
   antes de qualquer app nativo.
4. Apple Watch: decidir arquitetura (SwiftUI + HealthKit), consumir o contrato
   de sessão existente, e homologar em hardware.
