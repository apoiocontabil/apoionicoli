"""Gera o dossiê do produto (HTML) a partir dos dados da coleta.

Uso: python3 -I dossie.py <series.json> <pasta_criativos> <saida.html>
"""

import base64
import json
import os
import sys

series_path, criativos, saida = sys.argv[1:4]
series = json.load(open(series_path, encoding="utf-8"))


def img(nome):
    with open(os.path.join(criativos, nome), "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()


IMGS = {
    "mente": img("mente-campeona-909134582258810.jpg"),
    "sweets": img("sweets-by-alondra-2035673007091009.jpg"),
    "festy": img("festycake-1392797229091356.jpg"),
    "aprend": img("aprendizaje-virtual-1597523327800594.jpg"),
}

NICHOS = [
    # rótulo, mediana de dias no ar, com 60+ dias, amostra, anúncios no histórico, levam ao WhatsApp, escolhido
    ["Recetario para vender", 99, 26, 30, 5421, 11, True],
    ["Postres para vender", 91, 20, 30, 10989, 13, True],
    ["Postres en vaso", 75, 17, 29, 12093, 14, True],
    ["Megapack (infantil)", 225, 22, 30, 19464, 20, False],
    ["Actividades imprimibles", 38, 10, 30, 6887, 9, False],
    ["Recetas para diabéticos", 34, 7, 30, 4041, 18, False],
    ["Bebidas para vender", 32, 8, 30, 29771, 2, False],
    ["Planeaciones", 31, 8, 29, 1007, 12, False],
    ["Autismo actividades", 22, 12, 28, 1996, 14, False],
    ["Reto 21 días", 20, 9, 30, 12269, 0, False],
    ["Recetario keto", 15, 5, 29, 718, 10, False],
    ["Pan de muerto", 14, 5, 30, 50001, 0, False],
]

dados = {"series": series, "nichos": NICHOS}

HTML = open(os.path.join(os.path.dirname(__file__), "dossie_template.html"), encoding="utf-8").read()
HTML = HTML.replace("__DADOS__", json.dumps(dados, ensure_ascii=False))
for k, v in IMGS.items():
    HTML = HTML.replace(f"__IMG_{k.upper()}__", v)
open(saida, "w", encoding="utf-8").write(HTML)
print("ok", saida, round(len(HTML) / 1024), "KB")
