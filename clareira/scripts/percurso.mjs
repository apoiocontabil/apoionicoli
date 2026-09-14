/**
 * Percurso de validação no navegador real.
 *
 * Percorre a jornada inteira — chegada, descoberta, acesso, hoje, preparação,
 * aula com pausa e retomada, conclusão, conquistas, studio do professor — e
 * captura evidência de cada momento, em desktop e em celular.
 *
 * Não é teste unitário: é a verificação de que a experiência funciona no
 * navegador, que a seção 30 do briefing exige explicitamente.
 *
 *   node scripts/percurso.mjs [--base=http://127.0.0.1:5273] [--reduced]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const opt = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? '1'];
  }),
);
const BASE = opt.base ?? 'http://127.0.0.1:5273';
const OUT = opt.out ?? 'docs/evidencias/app';
mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const CELULAR = { width: 390, height: 844 };

const navegador = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: [
    '--no-sandbox',
    '--autoplay-policy=no-user-gesture-required',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-dev-shm-usage',
  ],
});

const problemas = [];
const passos = [];

/**
 * Procura texto visível com contraste abaixo do exigido pela WCAG 2.1.
 *
 * Existe porque um defeito real passou despercebido: no estúdio de treino os
 * tokens são invertidos, e usar `--papel` como cor de texto deixou rótulos de
 * botão invisíveis no escuro. Conferir isso a olho não escala.
 */
async function conferirContraste(page) {
  return page.evaluate(() => {
    const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

    /**
     * `color-mix()` computa como `color(srgb 0.94 0.92 0.88)`, com canais de 0 a
     * 1 — e não de 0 a 255 como `rgb()`. Ler os dois do mesmo jeito fazia todo
     * fundo claro parecer preto e acusava contraste ruim em tudo.
     */
    const rgba = s => {
      const n = (s.match(/[\d.]+(?=%?)/g) ?? []).map(Number);
      if (/^color\(/.test(s)) {
        const canais = n.slice(0, 3).map(v => v * 255);
        return n.length > 3 ? [...canais, n[3]] : canais;
      }
      return n;
    };

    const composto = (frente, fundo) => {
      const a = frente[3] ?? 1;
      return [0, 1, 2].map(i => frente[i] * a + fundo[i] * (1 - a));
    };

    /**
     * Sobe na árvore acumulando os fundos e compondo do opaco para cima.
     * Um véu semitransparente (o rótulo sobre o vídeo, por exemplo) PARTICIPA
     * do contraste; ignorá-lo acusava falha onde não havia.
     */
    const fundoDe = el => {
      const pilha = [];
      let n = el;
      let base = [255, 255, 255];
      while (n && n !== document.documentElement) {
        const bg = rgba(getComputedStyle(n).backgroundColor);
        const a = bg.length >= 3 ? (bg[3] ?? 1) : 0;
        if (a > 0.995) { base = bg.slice(0, 3); break; }
        if (a > 0) pilha.push(bg);
        n = n.parentElement;
      }
      // Compõe de trás para frente: o mais distante primeiro.
      let atual = base;
      for (const camada of pilha.reverse()) atual = composto(camada, atual);
      return atual;
    };

    const razao = (a, b) => {
      const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
      return (hi + 0.05) / (lo + 0.05);
    };

    const fracos = [];
    const alvos = document.querySelectorAll('button, a, p, h1, h2, h3, li, label, span, dd, dt');
    for (const el of alvos) {
      // Só folhas com texto próprio e visível.
      const texto = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      if (!texto) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.15) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      // Texto com cor transparente é efeito de gradiente recortado, não falha.
      const cor = rgba(cs.color);
      if ((cor[3] ?? 1) === 0) continue;

      const fundo = fundoDe(el);
      const efetiva = composto(cor, fundo);
      const px = parseFloat(cs.fontSize);
      const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
      const minimo = grande ? 3 : 4.5;
      const v = razao(efetiva, fundo);
      if (v < minimo) fracos.push({ texto: texto.slice(0, 42), razao: v.toFixed(2) });
    }
    // Remove duplicatas do mesmo texto.
    const vistos = new Set();
    return fracos.filter(f => !vistos.has(f.texto) && vistos.add(f.texto));
  });
}

/**
 * Confere que nada está POR CIMA de um elemento interativo visível.
 *
 * Existe porque uma colisão real escapou: no celular, as ações da chegada
 * caíram em cima da ficha técnica. "Animação que cobre informação" é critério
 * eliminatório do briefing, e conferir isso a olho em toda largura não escala.
 */
async function conferirSobreposicao(page) {
  return page.evaluate(() => {
    const cobertos = [];
    for (const el of document.querySelectorAll('button, a[href], input, select, textarea')) {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.15) continue;

      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      // Centro fora da viewport significa fora de vista, não coberto. Forçar o
      // ponto para dentro criava acusação falsa em tudo que estava rolado.
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const emCima = document.elementFromPoint(x, y);
      if (!emCima) continue;
      if (el === emCima || el.contains(emCima) || emCima.contains(el)) continue;

      // Cabeçalho fixo ou grudado cobrindo conteúdo JÁ ROLADO é comportamento
      // esperado, não defeito: a pessoa rola de volta. O que essa camada não
      // pode fazer é engolir o alvo de uma âncora — e isso se resolve com
      // scroll-margin, não escondendo a acusação.
      let n = emCima;
      let sobreposicaoEsperada = false;
      while (n && n !== document.body) {
        const pos = getComputedStyle(n).position;
        if (pos === 'fixed' || pos === 'sticky') { sobreposicaoEsperada = true; break; }
        n = n.parentElement;
      }
      if (sobreposicaoEsperada) continue;

      cobertos.push({
        alvo: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 36),
        porCima: `${emCima.tagName.toLowerCase()}.${(emCima.className || '').toString().split(' ')[0] || '-'}`,
      });
    }
    return cobertos;
  });
}

async function percorrer(nome, viewport, sufixo) {
  const ctx = await navegador.newContext({
    viewport,
    deviceScaleFactor: 2,
    locale: 'pt-BR',
    reducedMotion: opt.reduced ? 'reduce' : 'no-preference',
    hasTouch: viewport.width <= 800,
    isMobile: viewport.width <= 800,
  });
  const page = await ctx.newPage();

  const erros = [];
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) erros.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`); });
  page.on('pageerror', e => erros.push(String(e)));

  const foto = async (id, espera = 900) => {
    await page.waitForTimeout(espera);
    await page.screenshot({ path: `${OUT}/${id}-${sufixo}.jpg`, type: 'jpeg', quality: 82 });
    passos.push(`${id}-${sufixo}`);
    const fracos = await conferirContraste(page);
    for (const f of fracos) problemas.push(`[${id}-${sufixo}] contraste ${f.razao}:1 em "${f.texto}"`);
    const cobertos = await conferirSobreposicao(page);
    for (const c of cobertos) problemas.push(`[${id}-${sufixo}] "${c.alvo}" está coberto por ${c.porCima}`);
  };

  // 1. Chegada
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await foto('01-chegada', 4200);

  // A ação principal precisa estar acionável ANTES da animação terminar.
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const botaoCedo = page.getByRole('link', { name: 'Ver uma aula' });
  if (!(await botaoCedo.isVisible())) problemas.push('A ação principal não está visível no primeiro segundo.');

  // 2. Descoberta — trocar um controle precisa trocar a aula de verdade
  // Os três filtros são conjuntivos, então a asserção precisa partir de um
  // ponto em que a aula de 20 minutos ESTÁ na seleção (30 min, sala pequena,
  // impacto baixo) e apertar o espaço para vê-la sair. Uma tentativa anterior
  // deste teste só mexia no tempo e acusava um defeito que não existia: com
  // tapete + sem saltos, aquela aula já estava fora por outro critério.
  await page.goto(`${BASE}/?minutos=30&espaco=pequeno&impacto=baixo#comecar`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const antes = await page.locator('#comecar .grade .cartao h3').allTextContents();
  await page.getByRole('button', { name: 'Só um tapete' }).click();
  await page.waitForTimeout(1400);
  const depois = await page.locator('#comecar .grade .cartao h3').allTextContents();
  if (JSON.stringify(antes) === JSON.stringify(depois)) {
    problemas.push(`Apertar o espaço não mudou a seleção (antes: ${antes.length}, depois: ${depois.length}).`);
  }
  await foto('02-descoberta', 600);

  // 3. Acesso
  await page.goto(`${BASE}/entrar`, { waitUntil: 'networkidle' });
  await foto('03-entrar', 1400);

  // 3b. Conta nova → onboarding. Uma conta por execução, para o percurso poder
  // rodar de novo sem colidir com o cadastro anterior.
  const emailNovo = `percurso-${Date.now().toString(36)}@exemplo.local`;
  await page.goto(`${BASE}/criar-conta`, { waitUntil: 'networkidle' });
  await page.fill('#nome', 'Percurso');
  await page.fill('#email', emailNovo);
  await page.fill('#senha', 'percurso-de-teste-2026');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await page.waitForURL('**/comecar', { timeout: 15_000 });
  await foto('03b-onboarding', 1200);

  // Responde as perguntas de escolha única; a de múltipla e a de texto são
  // puladas de propósito, para provar que nada é obrigatório.
  const respostas = ['Retomar uma rotina', 'Estou começando', '3 dias', '20 minutos', 'Uma sala pequena', 'Prefiro sem saltos'];
  for (const r of respostas) {
    await page.getByRole('button', { name: r, exact: false }).first().click();
    await page.waitForTimeout(320);
  }
  await page.getByRole('button', { name: /Pular esta|Continuar/ }).click();  // equipamentos
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Terminar' }).click();
  await page.waitForURL('**/hoje', { timeout: 15_000 });
  await foto('03c-onboarding-fim', 1600);

  // O que foi respondido precisa ter MUDADO a recomendação de verdade.
  const perfil = await page.evaluate(async () => {
    const r = await fetch('/v1/acesso/eu', { headers: { authorization: `Bearer ${localStorage.getItem('clareira.token')}` } });
    return (await r.json()).perfil;
  });
  if (perfil?.minutosPorSessao !== 20 || perfil?.espaco !== 'pequeno' || perfil?.impactoMaximo !== 'sem_saltos') {
    problemas.push(`O onboarding não gravou o perfil como respondido: ${JSON.stringify(perfil)}`);
  }

  // 3c. Volta para a conta de demonstração, que já tem histórico.
  await page.evaluate(() => localStorage.removeItem('clareira.token'));
  await page.goto(`${BASE}/entrar`, { waitUntil: 'networkidle' });
  await page.fill('#email', 'aluna@exemplo.local');
  await page.fill('#senha', 'clareira-demo-2026');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/hoje', { timeout: 15_000 });
  await foto('04-hoje', 1800);

  // 4. Preparação
  await page.getByRole('link', { name: /Preparar e começar/ }).click();
  await page.waitForURL('**/preparar', { timeout: 15_000 });
  await foto('05-preparar', 1400);

  // 5. Estúdio de treino
  await page.getByRole('button', { name: /começar/i }).click();
  await page.waitForURL(/\/sessao\//, { timeout: 15_000 });
  await page.waitForTimeout(1500);
  await foto('06-estudio', 900);

  // Reproduzir, deixar correr, pausar — e conferir que o estado muda de verdade
  await page.getByRole('button', { name: 'Reproduzir' }).click();
  await page.waitForTimeout(3500);
  const pausar = page.getByRole('button', { name: 'Pausar' });
  if (await pausar.isVisible()) {
    await pausar.click();
    await page.waitForTimeout(900);
    const rotulo = await page.locator('.estudio-topo .etiqueta').textContent();
    if (!/pausad/i.test(rotulo ?? '')) problemas.push(`Pausar não refletiu no estado (li "${rotulo}").`);
    await foto('07-pausado', 600);
    // Retomar não pode ligar a mídia sozinha.
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(800);
  } else {
    problemas.push('O botão Pausar não apareceu depois de reproduzir.');
  }

  // 6. Conclusão — o claro se fecha
  await page.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForURL(/\/fim$/, { timeout: 15_000 });
  await foto('08-fim', 2600);

  // 7. Conquistas
  await page.goto(`${BASE}/conquistas`, { waitUntil: 'networkidle' });
  await foto('09-conquistas', 1200);

  // 8. Planos
  await page.goto(`${BASE}/planos`, { waitUntil: 'networkidle' });
  await foto('10-planos', 1200);

  // 9. Studio do professor (conta com papel de edição)
  await page.goto(`${BASE}/entrar`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('clareira.token'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#email', 'editor@exemplo.local');
  await page.fill('#senha', 'clareira-demo-2026');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/hoje', { timeout: 15_000 });
  await page.goto(`${BASE}/studio`, { waitUntil: 'networkidle' });
  await foto('11-studio-lista', 1400);

  const primeira = page.locator('.grade .cartao').first();
  await primeira.click();
  await page.waitForURL(/\/studio\/aula\//, { timeout: 15_000 });
  await foto('12-studio-editor', 1800);

  // Navegação reversa precisa funcionar sem quebrar
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  if (!page.url().includes('/studio')) problemas.push('O botão voltar não retornou para a lista do Studio.');

  // Teclado: o primeiro alvo tem que ser "Pular para o conteúdo"
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const focado = await page.evaluate(() => document.activeElement?.textContent?.trim());
  if (focado !== 'Pular para o conteúdo') {
    problemas.push(`O primeiro alvo de teclado é "${focado}", não o atalho de pular para o conteúdo.`);
  }

  if (erros.length) {
    for (const e of [...new Set(erros)]) {
      // O 404 do favicon não é defeito do produto.
      if (/favicon/i.test(e)) continue;
      // Mensagem genérica do console sem URL: o par com a linha HTTP já diz.
      if (/^Failed to load resource/.test(e)) continue;
      problemas.push(`[console ${sufixo}] ${e}`);
    }
  }

  await ctx.close();
  console.log(`✓ percurso ${nome} concluído`);
}

await percorrer('desktop', DESKTOP, 'desktop');
await percorrer('celular', CELULAR, 'celular');

await navegador.close();

console.log(`\n${passos.length} capturas em ${OUT}`);
if (problemas.length) {
  console.log('\n⚠ problemas encontrados:');
  for (const p of problemas) console.log('   · ' + p);
  process.exitCode = 1;
} else {
  console.log('\n· nenhum problema encontrado no percurso');
}
