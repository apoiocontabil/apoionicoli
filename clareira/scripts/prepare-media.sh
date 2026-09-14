#!/usr/bin/env bash
# Prepara a midia da vitrine publica a partir dos arquivos originais do Mixkit.
#
# Este script e a unica fonte de verdade das transformacoes aplicadas. Qualquer
# alteracao de recorte, duracao ou grade precisa ser feita aqui e refletida em
# docs/MEDIA-SOURCES.md, que registra origem, autor, licenca e transformacao de
# cada item.
#
# Uso:
#   SRC=/caminho/com/os/originais ./scripts/prepare-media.sh
#
# Os originais NAO sao versionados: baixe-os das paginas oficiais registradas em
# docs/MEDIA-SOURCES.md antes de rodar. Saida em apps/web/public/media/.
set -euo pipefail

SRC="${SRC:-$(pwd)/.media-src}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/apps/web/public/media"
mkdir -p "$OUT"

have() { [ -f "$SRC/$1" ] || { echo "faltando original: $SRC/$1" >&2; exit 1; }; }

# Perfil web: H.264 high, yuv420p (compatibilidade ampla, inclusive Safari/TV),
# sem faixa de audio (a vitrine e muda por decisao de produto; ver secao 21 do
# briefing: som nunca comeca sozinho), moov no inicio para inicio progressivo.
enc() { # enc <input> <filtros> <crf> <saida.mp4>
  ffmpeg -hide_banner -loglevel error -y -i "$1" \
    -an -vf "$2" -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf "$3" -preset slow -g 48 -movflags +faststart "$4"

  # Par VP9/WebM do mesmo corte. Dois motivos:
  #  1. Produto: melhor compressao em navegadores modernos; o MP4/H.264
  #     continua sendo o caminho de Safari, iOS e TVs.
  #  2. Verificacao: builds open-source do Chromium (inclusive o do Playwright
  #     usado na validacao) nao trazem H.264 e falham com
  #     DEMUXER_ERROR_NO_SUPPORTED_STREAMS. Sem o WebM nao e possivel observar
  #     o video realmente reproduzindo — so o poster.
  ffmpeg -hide_banner -loglevel error -y -i "$1" \
    -an -vf "$2" -c:v libvpx-vp9 -pix_fmt yuv420p \
    -crf "$(( $3 + 7 ))" -b:v 0 -row-mt 1 -cpu-used 4 -deadline good \
    -g 48 "${4%.mp4}.webm"
}

poster() { # poster <input> <segundo> <filtros> <saida>
  ffmpeg -hide_banner -loglevel error -y -ss "$2" -i "$1" -frames:v 1 \
    -vf "$3" -q:v 4 "$4"
}

# ---------------------------------------------------------------------------
# 1. sala — Mixkit 42898 "Woman exercising in her living room"
#    Sala domestica real, luz natural quente, corpo inteiro no quadro o tempo
#    todo. E a mídia da abertura: pessoa real treinando em casa.
#    Sem corte temporal: o clipe inteiro serve. Recorte vertical centrado na
#    pessoa (ela ocupa a faixa central-esquerda do quadro).
# ---------------------------------------------------------------------------
have mixkit-42898-720.mp4
enc "$SRC/mixkit-42898-720.mp4" "scale=1280:720" 25 "$OUT/sala-16x9.mp4"
enc "$SRC/mixkit-42898-720.mp4" "scale=854:480" 27 "$OUT/sala-16x9-480.mp4"
enc "$SRC/mixkit-42898-720.mp4" "crop=406:720:378:0,scale=406:720" 25 "$OUT/sala-9x16.mp4"
poster "$SRC/mixkit-42898-720.mp4" 2.0 "scale=1280:720" "$OUT/sala-16x9.jpg"
poster "$SRC/mixkit-42898-720.mp4" 2.0 "crop=406:720:378:0" "$OUT/sala-9x16.jpg"

# ---------------------------------------------------------------------------
# 2. aula — Mixkit 5061 "Woman following an online workout class"
#    Mergulho de triceps em cadeira, acompanhando aula pelo notebook. A camera
#    recua ao longo do clipe. Os primeiros ~3,5s enquadram apenas tronco e
#    pernas, sem cabeca: entrada em 3.6s para nao repetir o corte de corpo que
#    o briefing marca como criterio eliminatorio (secao 30, item 6).
# ---------------------------------------------------------------------------
have mixkit-5061-720.mp4
enc "$SRC/mixkit-5061-720.mp4" "trim=start=3.6,setpts=PTS-STARTPTS,scale=1280:720" 25 "$OUT/aula-16x9.mp4"
enc "$SRC/mixkit-5061-720.mp4" "trim=start=3.6,setpts=PTS-STARTPTS,crop=406:720:437:0" 25 "$OUT/aula-9x16.mp4"
poster "$SRC/mixkit-5061-720.mp4" 7.5 "scale=1280:720" "$OUT/aula-16x9.jpg"
poster "$SRC/mixkit-5061-720.mp4" 7.5 "crop=406:720:437:0" "$OUT/aula-9x16.jpg"

# ---------------------------------------------------------------------------
# 3. mobilidade — Mixkit 4942 "Girl doing stretching indoors"
#    Original ja vertical (720x1280). Alongamento sentado.
#    O original e visivelmente mais frio e dessaturado que os outros dois; uma
#    correcao leve de temperatura aproxima a coerencia pedida na secao 9 do
#    briefing. A correcao esta declarada em docs/MEDIA-SOURCES.md.
#    Nao gera versao 16:9: recortar essa composicao vertical cortaria o corpo.
# ---------------------------------------------------------------------------
have mixkit-4942-720.mp4
GRADE="colorbalance=rs=0.04:gs=0.01:bs=-0.05:rm=0.03:bm=-0.03,eq=saturation=1.10:contrast=1.03"
enc "$SRC/mixkit-4942-720.mp4" "scale=720:1280,$GRADE" 25 "$OUT/mobilidade-9x16.mp4"
poster "$SRC/mixkit-4942-720.mp4" 8.6 "scale=720:1280,$GRADE" "$OUT/mobilidade-9x16.jpg"

echo "--- gerado em $OUT ---"
ls -la "$OUT"
