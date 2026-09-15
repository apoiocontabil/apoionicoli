/**
 * Servidor estático mínimo para inspecionar as explorações e a build de
 * produção no navegador. Não faz parte do runtime da aplicação — é ferramenta
 * de validação. A aplicação usa Vite em desenvolvimento.
 *
 *   node scripts/static-server.mjs [raiz] [porta]
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const port = Number(process.argv[3] ?? 5299);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(root, normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
  } catch {
    res.writeHead(404).end('não encontrado');
    return;
  }
  let size;
  try {
    size = statSync(file).size;
  } catch {
    res.writeHead(404).end('não encontrado');
    return;
  }
  const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';

  // Range: sem isso o <video> do Chromium não faz seek corretamente.
  const range = req.headers.range;
  if (range && type.startsWith('video/')) {
    const [startRaw, endRaw] = range.replace(/bytes=/, '').split('-');
    const start = Number(startRaw);
    const end = endRaw ? Number(endRaw) : size - 1;
    res.writeHead(206, {
      'content-range': `bytes ${start}-${end}/${size}`,
      'accept-ranges': 'bytes',
      'content-length': end - start + 1,
      'content-type': type,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'content-type': type, 'content-length': size, 'accept-ranges': 'bytes' });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`estático em http://127.0.0.1:${port}  (raiz: ${root})`);
});
