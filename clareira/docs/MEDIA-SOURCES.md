# Fontes, licenças e transformações de mídia

Registro obrigatório da seção 9 do briefing. Cada item foi **assistido** antes de
ser escolhido — não selecionado por descrição. A forma de verificação está na
coluna correspondente.

Data da curadoria: 14/09/2026. Executada nesta sessão.

## 1. Itens em uso

| ID interno | Origem | Autor/creditação na página | Licença declarada | Resolução original | Duração original | Como foi verificado |
| --- | --- | --- | --- | --- | --- | --- |
| `sala` | [Mixkit — Woman exercising in her living room (42898)](https://mixkit.co/free-stock-video/woman-exercising-in-her-living-room-42898/) | Página Mixkit não nomeia autor individual | "Free License" (rótulo exibido na página do item) | Página indica 1920×1080; arquivo obtido é 1280×720 | 14,18 s, 23,976 fps | Baixado, `ffprobe` nos metadados, contact sheet de 12 quadros a 1 fps inspecionado quadro a quadro |
| `aula` | [Mixkit — Woman following an online workout class (5061)](https://mixkit.co/free-stock-video/woman-following-an-online-workout-class-5061/) | Página Mixkit não nomeia autor individual | "Free License" (rótulo exibido na página do item) | Página indica 1920×1080; arquivo obtido é 1280×720 | 10,00 s, 24 fps | Idem |
| `mobilidade` | [Mixkit — Girl doing stretching indoors (4942)](https://mixkit.co/free-stock-video/girl-doing-stretching-indoors-4942/) | Página Mixkit não nomeia autor individual | "Free License" (rótulo exibido na página do item) | Página indica 1080×1920; arquivo obtido é 720×1280 | 10,22 s, 23,976 fps | Idem |

### Estado da verificação de licença — pendência real

O rótulo **"Free License"** aparece na página de cada item e o resumo da Mixkit
associa essa licença a uso comercial. O **texto integral** da "Stock Video Free
License" é carregado dinamicamente por JavaScript em <https://mixkit.co/license/>
e **não foi capturado nesta sessão** (o HTML estático retorna apenas o índice de
licenças). Portanto:

- O uso atual é de **desenvolvimento e demonstração local**.
- Antes de qualquer publicação comercial, o texto integral da licença de cada
  item precisa ser lido e arquivado, junto com <https://mixkit.co/terms/>.
- Não afirmar "licença comercial confirmada" enquanto isso não for feito.
- Um acervo conter vídeos gratuitos não significa licença comercial de todos os
  itens (seção 9 do briefing).

### Pexels — bloqueado nesta sessão

Os quatro candidatos do Pexels listados no briefing (8836896, 8026946, 9001929)
**não puderam ser avaliados**: as requisições a `pexels.com` retornaram HTTP 403
através do proxy desta sessão. Não foram baixados, não foram assistidos e não
estão em uso. Não é uma afirmação sobre a licença do Pexels — é indisponibilidade
de acesso. Próximo passo: obter os arquivos por um ambiente com acesso, registrar
autor (MART PRODUCTION, olia danilevich) e conferir a
[licença do Pexels](https://www.pexels.com/license/).

## 2. Transformações aplicadas

Todas geradas por `scripts/prepare-media.sh`, que é a única fonte de verdade.
Os arquivos originais **não são versionados**; o script os lê de `.media-src/`.

| Saída | Origem | Transformação | Motivo |
| --- | --- | --- | --- |
| `sala-16x9.mp4` | 42898 | Reencode H.264 high / yuv420p / CRF 25 / faststart / **sem faixa de áudio** | Vitrine muda por decisão de produto (seção 21: som não começa sozinho) |
| `sala-16x9-480.mp4` | 42898 | Idem em 854×480, CRF 27 | Variante para rede/dispositivo limitado |
| `sala-9x16.mp4` | 42898 | `crop=406:720:378:0` | Reenquadre vertical centrado na pessoa, preservando corpo inteiro e leitura do movimento. **Sem esticar** — é recorte, não distorção |
| `aula-16x9.mp4` | 5061 | `trim=start=3.6` + reencode | Os primeiros ~3,5 s do original enquadram só tronco e pernas, sem cabeça. Entrar em 3,6 s evita o corte de corpo que a seção 30, item 6, marca como eliminatório |
| `aula-9x16.mp4` | 5061 | `trim=start=3.6` + `crop=406:720:437:0` | Reenquadre vertical após a entrada |
| `mobilidade-9x16.mp4` | 4942 | **Correção de cor declarada**: `colorbalance` (leve deslocamento quente) + `eq=saturation=1.10:contrast=1.03` | O original é visivelmente mais frio e dessaturado que os outros dois. A seção 9 pede temperatura e exposição compatíveis entre os clipes escolhidos. A correção é leve e está declarada aqui |
| `*.jpg` | todos | Quadro único extraído, `-q:v 4` | Poster imediato; nenhuma tela preta esperando o vídeo |

Nenhum clipe foi espelhado, invertido para fabricar loop, acelerado, desacelerado
ou esticado para outra razão de aspecto.

## 3. Observações honestas sobre o conteúdo

- **`sala`** é o único dos três que lê inequivocamente como **sala de casa**:
  sofá, cortina, quadros, plantas, tapete, luz de janela. É por isso que ela
  abre a experiência.
- **`aula`**: o ambiente é interno e amplo, com plantas e janelas grandes; lê
  mais como **loft ou espaço comum** do que como sala doméstica típica. Usado no
  momento de "acompanhar uma aula", onde o notebook e a postura da pessoa
  carregam o sentido, e não a arquitetura.
- **`mobilidade`** e **`aula`** parecem ter a **mesma pessoa** (mesma tatuagem no
  braço, mesmo corte de cabelo). Isso ajuda a continuidade, mas significa que o
  elenco visível hoje são **duas pessoas**, não seis. Não sugerir diversidade de
  elenco que a mídia atual não tem.
- Nenhuma dessas pessoas é professora da plataforma, aluna satisfeita ou
  participante de aula autoral. Na interface elas aparecem **apenas** em contexto
  ilustrativo de ambientação, e a demonstração de aula é rotulada como
  demonstração. Não sugerir endosso das pessoas retratadas.

## 4. Tipografia

| Família | Uso | Licença | Origem |
| --- | --- | --- | --- |
| Fraunces | Display / títulos editoriais | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Fraunces) |
| Inter | Texto corrido e interface | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Inter) |

Ambas suportam latim estendido (PT-BR e ES). As fontes são carregadas por
`@fontsource`-style self-host **ou** por Google Fonts conforme decisão de
privacidade; hoje a web usa a pilha do sistema como fallback declarado, com as
famílias acima como primeira escolha quando disponíveis. Ver
`apps/web/src/design/tokens.css`.

## 5. O que falta

| Pendência | Bloqueio | Próximo passo |
| --- | --- | --- |
| Texto integral das licenças Mixkit arquivado | Modal carregado por JS | Ler e arquivar antes de publicação comercial |
| Clipes Pexels avaliados | HTTP 403 no proxy desta sessão | Obter em ambiente com acesso; registrar autoria |
| Acervo autoral do proprietário | Não fornecido | Substituir stock por aulas reais; é a única mídia que pode ser apresentada como aula da plataforma |
| Áudio/música | Nenhuma faixa licenciada disponível | Ver seção 21; nenhuma faixa comercial foi embutida |
