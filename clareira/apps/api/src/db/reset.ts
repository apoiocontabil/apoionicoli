import { rmSync } from 'node:fs';
import { CAMINHO_DO_BANCO, abrir, fechar } from './index.js';

/** Apaga o banco de DESENVOLVIMENTO deste projeto e reaplica as migrações. */
if (process.env.NODE_ENV === 'production') {
  console.error('Recusando apagar banco em produção.');
  process.exit(1);
}
for (const sufixo of ['', '-wal', '-shm']) {
  try { rmSync(`${CAMINHO_DO_BANCO}${sufixo}`); } catch { /* já não existe */ }
}
abrir();
console.log(`Banco recriado em ${CAMINHO_DO_BANCO}`);
fechar();
