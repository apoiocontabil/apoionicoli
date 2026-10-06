"""Compara nichos a partir de buscas da Biblioteca de Anúncios (status=all) geradas por minerar.mjs.

Uso: python3 -I nichos.py <buscas.jsonl>

Para cada busca: anúncios no histórico, páginas distintas na amostra, parcela que leva ao WhatsApp,
parcela em vídeo, mediana de dias no ar, parcela com 60+ dias, ativos hoje e as páginas que mais aparecem.
"""

import collections
import json
import re
import statistics
import sys

PRECO = re.compile(r"\$\s?\d{2,4}(?:[.,]\d{2})?\s?(?:MXN|pesos|pesitos)?|\d{2,4}\s?(?:MXN|pesos|pesitos)", re.I)


def destino(link):
    link = (link or "").lower()
    if "whatsapp" in link or "wa.me" in link:
        return "whatsapp"
    if "m.me" in link or "messenger" in link:
        return "messenger"
    return "site" if link else "sem link"


def main():
    for linha in open(sys.argv[1], encoding="utf-8"):
        j = json.loads(linha)
        ads = [a for a in j["ads"] if a.get("dias")]
        if not ads:
            print(f"\n### {j.get('rotulo')}: sem dados")
            continue
        dias = [a["dias"] for a in ads]
        paginas = collections.Counter(a["page"] for a in ads)
        longos = collections.defaultdict(int)
        for a in ads:
            longos[a["page"]] = max(longos[a["page"]], a["dias"])
        dest = collections.Counter(destino(a.get("link")) for a in ads)
        fmt = collections.Counter(a.get("formato") for a in ads)
        precos = collections.Counter(p.strip() for a in ads for p in PRECO.findall(a.get("texto") or ""))
        n = len(ads)
        print(f"\n### {j.get('rotulo')}  (histórico: {j.get('total')} anúncios; amostra: {n})")
        print(f"páginas na amostra: {len(paginas)} | ativos hoje: {sum(a['ativo'] for a in ads)}/{n} | "
              f"whatsapp: {dest['whatsapp']}/{n} | vídeo: {fmt.get('VIDEO', 0)}/{n} | "
              f"mediana dias: {statistics.median(dias):.0f} | 60+ dias: {sum(d >= 60 for d in dias)}/{n}")
        print("preços:", ", ".join(f"{p} ({c})" for p, c in precos.most_common(6)))
        top = sorted(paginas, key=lambda p: (paginas[p], longos[p]), reverse=True)[:8]
        for p in top:
            curt = max((a.get("curtidas") or 0) for a in ads if a["page"] == p)
            print(f"  - {p}: {paginas[p]} anúncios, mais longo {longos[p]}d, {curt} curtidas")


if __name__ == "__main__":
    main()
