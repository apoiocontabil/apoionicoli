# Low ticket México

Operação de produto digital barato vendido no México: escolha do produto, observação dos
concorrentes, estudo do público e estrutura da oferta. Projeto separado da Clareira.

## O que tem aqui

| Pasta | Conteúdo |
| --- | --- |
| `ferramentas/` | Minerador da Biblioteca de Anúncios do Meta e scripts de análise |
| `concorrentes/` | Histórico de anúncios de cada concorrente observado, uma coleta por data |
| `research_notes/` | Notas da pesquisa sobre o consumidor mexicano, com fontes |
| `reports/` | Relatórios consolidados |
| `rotina-de-observacao.md` | O que observar nos concorrentes, com que frequência e como registrar |

## Rodar o minerador

Requisitos: Node 20+, Python 3.10+, Chromium (o Playwright usa o do sistema via `CHROMIUM`).

```bash
cd ferramentas
npm install
# Busca por palavra-chave ou histórico de uma página, definidos num arquivo de jobs
PERFIL=.perfil-chromium HEADED=1 PAUSA=20000 xvfb-run -a node minerar.mjs jobs.json saida.jsonl 40
python3 -I operacao.py saida.jsonl ../concorrentes/AAAA-MM-DD [coleta_anterior.jsonl]
python3 -I nichos.py buscas.jsonl
```

Formato de `jobs.json`:

```json
[
  { "tipo": "busca", "country": "MX", "q": "postres para vender", "status": "all", "rotulo": "postres" },
  { "tipo": "pagina", "country": "MX", "page_id": "611888315337555", "status": "all", "rotulo": "Sweets by Alondra" }
]
```

A Biblioteca limita a frequência de buscas. Sem navegador visível (`HEADED=1` com `xvfb-run`
num servidor) e sem pausa entre buscas, ela passa a devolver zero resultados. Numa máquina
com tela, rode sem `xvfb-run`.

## Limites do que a Biblioteca mostra

Fora da União Europeia ela não mostra gasto, alcance nem vendas. O que dá para medir:
data de início e fim de cada anúncio, quantos rodam ao mesmo tempo, quantas vezes o mesmo
criativo foi reaproveitado, formato, botão, destino e texto. Tempo no ar e escala de
anúncios simultâneos são os sinais públicos de que uma oferta paga a própria conta.
