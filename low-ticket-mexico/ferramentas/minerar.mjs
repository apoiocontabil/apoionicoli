// Minerador da Biblioteca de Anúncios do Meta a partir dos dados estruturados da própria página.
// Uso: node minerar.mjs <jobs.json> <saida.jsonl> [rolagens_max]
// jobs.json = [{ "tipo": "busca", "country": "MX", "q": "postres para vender", "status": "all" },
//              { "tipo": "pagina", "country": "MX", "page_id": "611888315337555", "status": "all" }]
import { chromium } from 'playwright';
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs';

const [jobsPath, outPath, scrollsArg = '25'] = process.argv.slice(2);
const jobs = JSON.parse(readFileSync(jobsPath, 'utf8'));
const MAX_SCROLLS = Number(scrollsArg);
writeFileSync(outPath, '');

function urlDe(job) {
  // A ordem dos parâmetros importa: a Biblioteca devolve zero resultados com outra ordem.
  const ini = `https://www.facebook.com/ads/library/?active_status=${job.status || 'all'}&ad_type=all&country=${job.country || 'ALL'}`;
  // Sem login a Biblioteca não pagina; "de"/"ate" fatiam o histórico pela data de início.
  const datas = job.de ? `&start_date%5Bmin%5D=${job.de}&start_date%5Bmax%5D=${job.ate || job.de}` : '';
  if (job.tipo === 'pagina') return `${ini}&is_targeted_country=false&media_type=all&search_type=page${datas}&view_all_page_id=${job.page_id}`;
  return `${ini}&q=${encodeURIComponent(job.q)}&search_type=keyword_unordered&media_type=all`;
}

// Extrai objetos JSON completos que começam em '{"ad_archive_id"'.
function extrair(texto) {
  const achados = [];
  let i = 0;
  while ((i = texto.indexOf('{"ad_archive_id"', i)) !== -1) {
    let prof = 0, emStr = false, esc = false, j = i;
    for (; j < texto.length; j++) {
      const c = texto[j];
      if (emStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') emStr = false; continue; }
      if (c === '"') emStr = true;
      else if (c === '{') prof++;
      else if (c === '}') { prof--; if (prof === 0) break; }
    }
    try { achados.push(JSON.parse(texto.slice(i, j + 1))); } catch {}
    i = j + 1;
  }
  return achados;
}

const dia = (s) => (s ? new Date(s * 1000).toISOString().slice(0, 10) : null);
function resumir(a, job) {
  const s = a.snapshot || {};
  const card = (s.cards || [])[0] || {};
  const ini = a.start_date, fim = a.is_active ? Math.floor(Date.parse('2026-10-06') / 1000) : a.end_date;
  return {
    job: job.rotulo || job.q || job.page_id, country: job.country,
    id: a.ad_archive_id, page_id: a.page_id, page: s.page_name, curtidas: s.page_like_count,
    ativo: a.is_active, inicio: dia(ini), fim: a.is_active ? null : dia(a.end_date),
    dias: ini && fim ? Math.max(1, Math.round((fim - ini) / 86400)) : null,
    mesmo_criativo: a.collation_count || 1, formato: s.display_format,
    plataformas: a.publisher_platform || [], cta: s.cta_type || card.cta_type, botao: s.cta_text || card.cta_text,
    link: s.link_url || card.link_url, titulo: s.title || card.title,
    texto: ((s.body && s.body.text) || card.body || '').slice(0, 1500),
    imagem: (s.images && s.images[0] && (s.images[0].original_image_url || s.images[0].resized_image_url)) || card.original_image_url || null,
    video: (s.videos && s.videos[0] && (s.videos[0].video_preview_image_url)) || card.video_preview_image_url || null,
    video_url: (s.videos && s.videos[0] && (s.videos[0].video_sd_url || s.videos[0].video_hd_url)) || card.video_sd_url || null,
    n_cards: (s.cards || []).length,
  };
}

// PERFIL guarda cookies entre execuções; HEADED=1 abre o navegador visível (use com xvfb-run num servidor).
const opcoes = {
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
  headless: process.env.HEADED !== '1',
  args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  locale: 'en-US', viewport: { width: 1366, height: 900 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
};
if (process.env.HTTPS_PROXY) opcoes.proxy = { server: process.env.HTTPS_PROXY };
const ctx = await chromium.launchPersistentContext(process.env.PERFIL || '.perfil-chromium', opcoes);
const browser = { close: () => ctx.close() };

const PAUSA = Number(process.env.PAUSA || 45000);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// A Biblioteca limita a frequência: entre uma busca e outra espera PAUSA ms,
// e quando o total volta zero espera mais e tenta de novo.
async function run(job) {
  for (let t = 0; t < 3; t++) {
    const r = await run1(job);
    if (r !== 0) return;
    console.log(`  zero resultados, nova tentativa em ${(PAUSA * 2) / 1000}s`);
    await espera(PAUSA * 2);
  }
}

async function run1(job) {
  const page = await ctx.newPage();
  const vistos = new Map();
  let total = null;
  page.on('response', async (r) => {
    const u = r.url();
    if (!(u.includes('/api/graphql') || r.request().resourceType() === 'document')) return;
    try {
      const t = await r.text();
      const m = t.match(/"search_results_connection":\{"count":(\d+)/);
      if (m) total = Number(m[1]);
      for (const a of extrair(t)) if (!vistos.has(a.ad_archive_id)) vistos.set(a.ad_archive_id, a);
    } catch {}
  });
  try {
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      await page.goto(urlDe(job), { waitUntil: 'domcontentloaded', timeout: 60000 });
      try { await page.waitForFunction(() => /Library ID/.test(document.body.innerText), null, { timeout: 20000 }); break; }
      catch { await page.waitForTimeout(6000 * (tentativa + 1)); }
    }
    let parado = 0, antes = -1;
    for (let i = 0; i < MAX_SCROLLS && parado < 3; i++) {
      // Rolar até o fim da página dispara a busca da próxima leva de anúncios.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(2500);
      if (vistos.size === antes) parado++; else parado = 0;
      antes = vistos.size;
    }
    if (total === 0 && vistos.size === 0) return 0;
    const ads = [...vistos.values()].map((a) => resumir(a, job));
    appendFileSync(outPath, JSON.stringify({ ...job, total, n: ads.length, ads }) + '\n');
    console.log(`${job.country} | ${job.rotulo || job.q || job.page_id} | total=${total} | lidos=${ads.length}`);
  } catch (e) {
    console.log(`${job.country} | ${job.q || job.page_id} | erro ${e.message.slice(0, 80)}`);
  } finally {
    await page.close();
    await espera(PAUSA);
  }
}

const fila = [...jobs];
const CONC = Number(process.env.CONC || 1);
await Promise.all(Array.from({ length: CONC }, async () => { while (fila.length) await run(fila.shift()); }));
await browser.close();
