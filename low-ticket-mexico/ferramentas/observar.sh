#!/usr/bin/env bash
# Coleta semanal dos concorrentes: histórico de cada página e buscas do nicho,
# reconstrução da operação e comparação com a coleta anterior.
#
# Uso: ./observar.sh            (coleta de hoje)
#      ./observar.sh 2026-10-13 (força a data da pasta)
set -euo pipefail

AQUI="$(cd "$(dirname "$0")" && pwd)"
RAIZ="$(cd "$AQUI/.." && pwd)"
DATA="${1:-$(date +%F)}"
SAIDA="$RAIZ/concorrentes/$DATA"
ANTERIOR="$(ls -d "$RAIZ"/concorrentes/20*/ 2>/dev/null | sed 's#/$##' | grep -v "/$DATA$" | sort | tail -1 || true)"

mkdir -p "$SAIDA"
cd "$AQUI"
[ -d node_modules ] || npm install --silent

# Num servidor sem tela, xvfb-run abre o navegador visível, que a Biblioteca bloqueia menos.
RODAR=(node)
if [ -z "${DISPLAY:-}" ] && command -v xvfb-run >/dev/null; then RODAR=(xvfb-run -a node); fi
export HEADED=1 PERFIL="${PERFIL:-$AQUI/.perfil-chromium}" PAUSA="${PAUSA:-20000}"

"${RODAR[@]}" minerar.mjs "$RAIZ/concorrentes/paginas.json" "$SAIDA/historico-paginas.jsonl" 60
"${RODAR[@]}" minerar.mjs "$RAIZ/concorrentes/buscas.json" "$SAIDA/buscas-nichos.jsonl" 15

if [ -n "$ANTERIOR" ] && [ -f "$ANTERIOR/historico-paginas.jsonl" ]; then
  python3 -I operacao.py "$SAIDA/historico-paginas.jsonl" "$SAIDA" "$ANTERIOR/historico-paginas.jsonl"
else
  python3 -I operacao.py "$SAIDA/historico-paginas.jsonl" "$SAIDA"
fi
python3 -I nichos.py "$SAIDA/buscas-nichos.jsonl" > "$SAIDA/nichos.txt"

echo "Coleta em $SAIDA (comparada com: ${ANTERIOR:-nenhuma})"
grep -E "^## |Desde a última coleta" "$SAIDA/operacao.md" || true
