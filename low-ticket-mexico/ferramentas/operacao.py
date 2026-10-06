"""Reconstrói a operação de um concorrente a partir do histórico de anúncios da Biblioteca do Meta.

Entrada: arquivo JSONL gerado por minerar.mjs com jobs do tipo "pagina" (status=all).
Saída: relatório em Markdown e um resumo em JSON por página.

Uso:
    python3 -I operacao.py <historico.jsonl> <pasta_saida> [historico_anterior.jsonl]

O que ele mede, para cada página:
- início da operação (primeiro anúncio) e ritmo de lançamento por semana;
- anúncios ativos ao mesmo tempo por semana (a escala aparece como subida dessa curva);
- fase de teste: semanas com muitos lançamentos e anúncios que morrem em até 7 dias;
- vencedores: anúncios que ficaram mais tempo no ar e criativos reaproveitados;
- ganchos (primeira linha do texto), formatos, botões, destinos e preços citados;
- com um histórico anterior: anúncios novos, desligados e sobreviventes desde a última coleta.
"""

import collections
import datetime as dt
import json
import os
import re
import sys

HOJE = dt.date(2026, 10, 6)
PRECO = re.compile(r"\$\s?\d{2,4}(?:[.,]\d{2})?\s?(?:MXN|pesos|pesitos)?|\d{2,4}\s?(?:MXN|pesos|pesitos)", re.I)


def data(s):
    return dt.date.fromisoformat(s) if s else None


def semana(d):
    return d - dt.timedelta(days=d.weekday())


def gancho(texto):
    linhas = [l.strip() for l in (texto or "").splitlines() if l.strip()]
    return (linhas[0] if linhas else "")[:140]


def dominio(link):
    if not link:
        return "sem link"
    m = re.match(r"https?://([^/]+)", link)
    host = m.group(1).lower() if m else link
    if "whatsapp" in host or host.startswith("wa.me"):
        return "WhatsApp"
    if "m.me" in host or "messenger" in host:
        return "Messenger"
    return host.replace("www.", "")


def carregar(caminho):
    paginas = collections.defaultdict(dict)
    for linha in open(caminho, encoding="utf-8"):
        job = json.loads(linha)
        for ad in job["ads"]:
            if ad.get("page_id") != job.get("page_id") and job.get("tipo") == "pagina":
                continue
            paginas[ad["page_id"]][ad["id"]] = ad
    return paginas


def analisar(ads):
    ads = [a for a in ads if a.get("inicio")]
    for a in ads:
        a["_ini"] = data(a["inicio"])
        a["_fim"] = HOJE if a["ativo"] else (data(a["fim"]) or a["_ini"])
        a["_dias"] = max(1, (a["_fim"] - a["_ini"]).days)
    if not ads:
        return None
    ads.sort(key=lambda a: a["_ini"])
    ini, fim = ads[0]["_ini"], HOJE
    semanas = []
    s = semana(ini)
    while s <= fim:
        e = s + dt.timedelta(days=6)
        lancados = [a for a in ads if s <= a["_ini"] <= e]
        ativos = [a for a in ads if a["_ini"] <= e and a["_fim"] >= s]
        curtos = [a for a in lancados if a["_dias"] <= 7 and not a["ativo"]]
        semanas.append({"semana": s.isoformat(), "lancados": len(lancados), "ativos": len(ativos), "morreram_em_7d": len(curtos)})
        s += dt.timedelta(days=7)

    pico = max(semanas, key=lambda x: x["ativos"])
    # Escala: primeira semana em que os ativos passam de 2x a mediana das 4 semanas anteriores (mínimo 5).
    escala = None
    for i in range(4, len(semanas)):
        base = sorted(x["ativos"] for x in semanas[i - 4:i])[1:3]
        ref = max(1, sum(base) / len(base))
        if semanas[i]["ativos"] >= max(5, 2 * ref):
            escala = semanas[i]["semana"]
            break
    teste = [x for x in semanas[:8] if x["lancados"] >= 3]
    vencedores = sorted(ads, key=lambda a: (a["_dias"], a.get("mesmo_criativo", 1)), reverse=True)[:8]
    ganchos = collections.Counter(gancho(a["texto"]) for a in ads if a.get("texto"))
    precos = collections.Counter(p.strip() for a in ads for p in PRECO.findall(a.get("texto") or ""))
    duracoes = sorted(a["_dias"] for a in ads)
    return {
        "pagina": ads[-1].get("page"),
        "curtidas": max((a.get("curtidas") or 0) for a in ads),
        "primeiro_anuncio": ini.isoformat(),
        "dias_de_operacao": (HOJE - ini).days,
        "total_anuncios": len(ads),
        "ativos_hoje": sum(1 for a in ads if a["ativo"]),
        "mediana_dias_no_ar": duracoes[len(duracoes) // 2],
        "morreram_em_7d": sum(1 for a in ads if a["_dias"] <= 7 and not a["ativo"]),
        "pico_ativos": pico,
        "inicio_escala": escala,
        "semanas_de_teste": teste,
        "formatos": collections.Counter(a.get("formato") or "?" for a in ads).most_common(),
        "botoes": collections.Counter(a.get("cta") or "?" for a in ads).most_common(),
        "destinos": collections.Counter(dominio(a.get("link")) for a in ads).most_common(6),
        "plataformas": collections.Counter(p for a in ads for p in a.get("plataformas", [])).most_common(),
        "precos_citados": precos.most_common(8),
        "ganchos_mais_usados": ganchos.most_common(10),
        "vencedores": [
            {"id": a["id"], "inicio": a["inicio"], "fim": a.get("fim"), "ativo": a["ativo"], "dias": a["_dias"],
             "mesmo_criativo": a.get("mesmo_criativo", 1), "formato": a.get("formato"), "gancho": gancho(a["texto"]),
             "titulo": a.get("titulo"), "destino": dominio(a.get("link")), "imagem": a.get("imagem") or a.get("video")}
            for a in vencedores
        ],
        "semanas": semanas,
    }


def diff(atual, anterior):
    novos = [i for i in atual if i not in anterior]
    desligados = [i for i, a in anterior.items() if a["ativo"] and i in atual and not atual[i]["ativo"]]
    sobreviventes = [i for i, a in atual.items() if a["ativo"] and i in anterior and anterior[i]["ativo"]]
    return {"novos": novos, "desligados": desligados, "sobreviventes": sobreviventes}


def markdown(r, d=None):
    out = [f"## {r['pagina']}", ""]
    out.append(f"- Primeiro anúncio: {r['primeiro_anuncio']} ({r['dias_de_operacao']} dias de operação)")
    out.append(f"- Anúncios no histórico: {r['total_anuncios']} · ativos hoje: {r['ativos_hoje']} · curtidas da página: {r['curtidas']}")
    out.append(f"- Mediana de dias no ar: {r['mediana_dias_no_ar']} · desligados em até 7 dias: {r['morreram_em_7d']}")
    out.append(f"- Pico de anúncios simultâneos: {r['pico_ativos']['ativos']} na semana de {r['pico_ativos']['semana']}")
    out.append(f"- Início da escala (ativos dobram sobre a mediana das 4 semanas anteriores): {r['inicio_escala'] or 'não detectado'}")
    out.append(f"- Formatos: {r['formatos']} · botões: {r['botoes']}")
    out.append(f"- Destinos: {r['destinos']}")
    out.append(f"- Preços citados: {r['precos_citados']}")
    if d:
        out.append(f"- Desde a última coleta: {len(d['novos'])} novos, {len(d['desligados'])} desligados, {len(d['sobreviventes'])} seguem no ar")
    out += ["", "### Vencedores (mais tempo no ar)", ""]
    for v in r["vencedores"]:
        estado = "ativo" if v["ativo"] else f"até {v['fim']}"
        out.append(f"- {v['dias']} dias ({v['inicio']}, {estado}) · {v['formato']} · {v['destino']} · reaproveitado {v['mesmo_criativo']}x · "
                   f"\"{v['gancho']}\" · https://www.facebook.com/ads/library/?id={v['id']}")
    out += ["", "### Ganchos mais repetidos", ""]
    for g, n in r["ganchos_mais_usados"]:
        out.append(f"- {n}x \"{g}\"")
    out += ["", "### Linha do tempo semanal (lançados / ativos / morreram em 7 dias)", ""]
    for s in r["semanas"]:
        if s["ativos"] or s["lancados"]:
            out.append(f"- {s['semana']}: {s['lancados']} / {s['ativos']} / {s['morreram_em_7d']} " + "█" * min(60, s["ativos"]))
    return "\n".join(out) + "\n"


def main():
    hist, pasta = sys.argv[1], sys.argv[2]
    ant = carregar(sys.argv[3]) if len(sys.argv) > 3 else {}
    os.makedirs(pasta, exist_ok=True)
    resumo = {}
    partes = ["# Operação dos concorrentes", "", f"Coleta de {HOJE.isoformat()} na Biblioteca de Anúncios do Meta.", ""]
    for pid, ads in carregar(hist).items():
        r = analisar(list(ads.values()))
        if not r:
            continue
        d = diff(ads, ant.get(pid, {})) if ant else None
        resumo[pid] = {**r, "diff": d}
        partes.append(markdown(r, d))
    open(os.path.join(pasta, "operacao.md"), "w", encoding="utf-8").write("\n".join(partes))
    json.dump(resumo, open(os.path.join(pasta, "operacao.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(resumo)} páginas analisadas -> {pasta}")


if __name__ == "__main__":
    main()
