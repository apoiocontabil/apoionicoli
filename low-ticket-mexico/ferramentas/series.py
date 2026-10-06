"""Série semanal de anúncios no ar por concorrente, para os gráficos do dossiê.

Uso: python3 -I series.py <historico-paginas.jsonl> [fatias-semanais.jsonl] > series.json

- Páginas pequenas: soma, a cada semana, as cópias ("mesmo_criativo") de cada criativo ativo.
- Páginas grandes coletadas em fatias semanais (minerar.mjs com "de"/"ate"): usa o total que a
  própria Biblioteca informa para a semana, que já conta as cópias.
"""

import datetime as dt
import json
import sys

HOJE = dt.date(2026, 10, 6)
INICIO = dt.date(2024, 11, 18)  # segunda-feira da semana do primeiro anúncio observado


def semanas():
    s = INICIO
    while s <= HOJE:
        yield s
        s += dt.timedelta(days=7)


def por_historico(ads):
    out = []
    for s in semanas():
        e = s + dt.timedelta(days=6)
        n = 0
        for a in ads:
            if not a.get("inicio"):
                continue
            ini = dt.date.fromisoformat(a["inicio"])
            fim = HOJE if a["ativo"] else dt.date.fromisoformat(a["fim"] or a["inicio"])
            if ini <= e and fim >= s:
                n += a.get("mesmo_criativo") or 1
        out.append(n)
    return out


def main():
    series = {}
    for linha in open(sys.argv[1], encoding="utf-8"):
        j = json.loads(linha)
        series[j["rotulo"]] = por_historico(j["ads"])
    if len(sys.argv) > 2:
        totais = {}
        nome = None
        for linha in open(sys.argv[2], encoding="utf-8"):
            j = json.loads(linha)
            nome = j["rotulo"].rsplit(" ", 1)[0]
            totais[j["de"]] = j.get("total") or 0
        series[nome] = [totais.get(s.isoformat(), 0) for s in semanas()]
    print(json.dumps({"inicio": INICIO.isoformat(), "semanas": len(list(semanas())), "series": series}, ensure_ascii=False))


if __name__ == "__main__":
    main()
