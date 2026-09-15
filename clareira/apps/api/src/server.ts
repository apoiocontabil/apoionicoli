import { abrir } from './db/index.js';
import { criarServidor } from './app.js';

/**
 * Servidor da API.
 *
 * Porta 5274 por padrão — separada de qualquer implementação anterior, como
 * exige a seção 1 do briefing. O banco também é próprio (ver db/index.ts).
 */

const PORTA = Number(process.env.CLAREIRA_API_PORT ?? 5274);
const ORIGENS = (process.env.CLAREIRA_ORIGENS ?? 'http://localhost:5273,http://127.0.0.1:5273').split(',');

const db = abrir();
const servidor = criarServidor(db, ORIGENS);

servidor.listen(PORTA, () => {
  console.log(`clareira-api em http://127.0.0.1:${PORTA}`);
  console.log(`origens permitidas: ${ORIGENS.join(', ')}`);
});

for (const sinal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sinal, () => servidor.close(() => process.exit(0)));
}
