/**
 * Captura de evidências no navegador real (Chromium via Playwright).
 *
 * Usa o hook determinístico `window.__seek(segundos)` exposto pelas cenas:
 * a mesma instante produz sempre a mesma composição, então a captura é
 * reproduzível e serve como evidência do quadro em movimento — não de um
 * estado final estático.
 *
 *   node scripts/shoot.mjs <url> <prefixo> [--seek=0,1.2,2.4] [--w=1440] [--h=900]
 *                          [--dpr=2] [--wait=1200] [--reduced] [--out=dir]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const url = args[0];
const prefix = args[1] ?? 'shot';
const opt = Object.fromEntries(
  args.slice(2).filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? '1'];
  }),
);
if (!url) {
  console.error('uso: node scripts/shoot.mjs <url> <prefixo> [--seek=..] [--w=..] [--h=..]');
  process.exit(1);
}

const outDir = resolve(opt.out ?? 'docs/evidencias');
mkdirSync(outDir, { recursive: true });

const width = Number(opt.w ?? 1440);
const height = Number(opt.h ?? 900);
const seeks = (opt.seek ?? '').split(',').filter(Boolean).map(Number);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: [
    '--no-sandbox',
    '--autoplay-policy=no-user-gesture-required',
    // WebGL por software: o container não tem GPU. Serve para verificar que a
    // cena compõe e desenha; NÃO é medida de desempenho real de hardware.
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-dev-shm-usage',
  ],
});

const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: Number(opt.dpr ?? 2),
  reducedMotion: opt.reduced ? 'reduce' : 'no-preference',
  locale: 'pt-BR',
});
const page = await context.newPage();

const erros = [];
page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
page.on('pageerror', e => erros.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
await page.waitForTimeout(Number(opt.wait ?? 1200));

const temSeek = await page.evaluate(() => typeof window.__seek === 'function');

if (seeks.length && temSeek) {
  for (const s of seeks) {
    await page.evaluate(t => window.__seek(t), s);
    await page.waitForTimeout(320); // deixa o vídeo e o amortecimento assentarem
    const nome = `${prefix}-t${String(s).replace('.', '_')}.jpg`;
    await page.screenshot({ path: `${outDir}/${nome}`, type: 'jpeg', quality: 82 });
    console.log(`✓ ${nome}`);
  }
} else {
  await page.screenshot({ path: `${outDir}/${prefix}.jpg`, type: 'jpeg', quality: 82 });
  console.log(`✓ ${prefix}.jpg${seeks.length && !temSeek ? '  (sem hook __seek nesta página)' : ''}`);
}

if (erros.length) {
  console.log('\n⚠ erros de console:');
  for (const e of [...new Set(erros)].slice(0, 10)) console.log('   ' + e);
} else {
  console.log('· sem erros de console');
}

await browser.close();
