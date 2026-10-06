# Continuar daqui

Passagem da sessão na nuvem (6 de outubro de 2026) para uma sessão no computador do dono,
com o navegador logado. Leia este arquivo inteiro antes de qualquer coisa.

## Onde estamos

Primeira parte concluída: produto escolhido, concorrentes observados, público estudado e
oferta estruturada.

- **Produto:** Vasitos que Venden, receituário de postres en vaso para vender no México,
  com custo e lucro de cada receita. 99 MXN, 3 order bumps (49, 59, 39), upsell de 149,
  downsell de 79 e Club Vasitos a 79 MXN por mês. Venda no x1 pelo WhatsApp, checkout
  na Hotmart em pesos.
- **Concorrentes observados:** Mente Campeona (oferta direta), Sweets by Alondra (escada
  e calendário), FestyCake (escala pesada). Referências: Aprendizaje Virtual e Recetas
  Deliciosas. IDs em `concorrentes/paginas.json`.

## Leia nesta ordem

1. `produto/estrutura-do-produto.md`: escolha, posicionamento, oferta, conta, produção,
   critérios de validação
2. `produto/persona.md`: ICP, objeções, linguagem do público
3. `concorrentes/2026-10-06/operacao.md` e `festycake-semanas.jsonl`: operação de cada
   concorrente semana a semana
4. `rotina-de-observacao.md`: rotina semanal e mensal
5. `reports/Comportamento do consumidor no México.md`: pesquisa com fontes
6. `produto/dossie-vasitos-que-venden.html`: tudo junto, com gráficos (abrir no navegador)

## Próximo passo pedido pelo dono

Estratégia moldada no que já funciona para os concorrentes:

- criativos: imagem estilo panfleto com palavra-chave ("Escribe VASITOS") e vídeo
  vertical de mãos montando os copos com o preço por copo na tela;
- estrutura de campanha no Meta (clique para WhatsApp) com duplicação do criativo
  vencedor, como Mente Campeona (8 cópias) e FestyCake (114 cópias);
- roteiro do x1 no WhatsApp em espanhol mexicano ("tú", "sale", nada de "vosotros");
- página de checkout da Hotmart com os bumps e o upsell;
- página de venda para teste A/B contra o x1.

Skills a usar: estrutura-de-campanha-facebookinstagram-ads, copy-de-anuncios-meta-ads,
framework-de-criativo-para-anuncios, framework-de-teste-de-criativos,
estrategia-de-escala-de-anuncios, pagina-de-vendas-completa,
copy-de-pagina-de-obrigado-com-upsell, framework-de-gestao-de-objecoes-em-vendas-de-servico,
copy-com-voz-propria-textos-que-nao-parecem-ia.

## Decisões que ainda dependem do dono

1. Quem é a repostera que testa as receitas e é o rosto da marca
2. Aprovação do nome Vasitos que Venden e do preço de 99 MXN
3. Contas: Hotmart, gerenciador de anúncios do Meta, WhatsApp com número do México (+52)
4. Orçamento de teste: cerca de US$ 150 para 7 a 10 dias

## Navegador logado: cuidados

- Use a extensão Claude in Chrome, com o dono já logado. Nunca peça nem digite senhas.
- Leia a Biblioteca de Anúncios devagar (uma página por vez, pausas de 20 segundos ou
  mais). Coleta automatizada em volume com conta logada pode restringir a conta do
  Facebook, e é dela que sairão os anúncios.
- Com login, a Biblioteca deixa paginar o histórico completo; sem login, a paginação
  devolve "Rate limit exceeded" e o minerador precisa fatiar por data.
- Ainda não lidos: Etsy e o mercado da Hotmart (pedem navegador logado).

## Rodar a coleta semanal no computador

```bash
cd low-ticket-mexico/ferramentas
npm install
# Num computador com tela não precisa de xvfb-run; o script detecta.
# Indique o Chromium ou Chrome instalado se não for o caminho padrão:
CHROMIUM="/caminho/do/chrome" ./observar.sh
```
