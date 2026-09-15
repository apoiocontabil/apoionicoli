import Database from 'better-sqlite3';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));

/**
 * Banco de desenvolvimento em arquivo próprio deste projeto.
 * Não compartilha caminho, porta ou credencial com nenhuma implementação
 * anterior (exigência da seção 1 do briefing).
 */
export const CAMINHO_DO_BANCO = process.env.CLAREIRA_DB ?? resolve(aqui, '../../../../.dados/clareira.db');

export type Banco = Database.Database;

let instancia: Banco | null = null;

export function abrir(caminho = CAMINHO_DO_BANCO): Banco {
  if (instancia) return instancia;
  if (caminho !== ':memory:') mkdirSync(dirname(caminho), { recursive: true });

  const db = new Database(caminho);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  // Sem isso, uma escrita concorrente derruba a outra com SQLITE_BUSY.
  db.pragma('busy_timeout = 5000');

  migrar(db);
  instancia = db;
  return db;
}

export function fechar(): void {
  instancia?.close();
  instancia = null;
}

/**
 * Migrações reproduzíveis: arquivos .sql aplicados em ordem de nome, uma única
 * vez, dentro de uma transação. O nome aplicado fica registrado, então rodar de
 * novo é seguro.
 */
export function migrar(db: Banco): string[] {
  db.exec(`CREATE TABLE IF NOT EXISTS migracoes (
    nome TEXT PRIMARY KEY,
    aplicada_em_ms INTEGER NOT NULL
  )`);

  const dir = resolve(aqui, 'migrations');
  const arquivos = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  const jaAplicadas = new Set(
    db.prepare('SELECT nome FROM migracoes').all().map((r: any) => r.nome as string),
  );

  const aplicadas: string[] = [];
  for (const arquivo of arquivos) {
    if (jaAplicadas.has(arquivo)) continue;
    const sql = readFileSync(join(dir, arquivo), 'utf8');
    const transacao = db.transaction(() => {
      db.exec(sql);
      db.prepare('INSERT INTO migracoes (nome, aplicada_em_ms) VALUES (?, ?)').run(arquivo, Date.now());
    });
    transacao();
    aplicadas.push(arquivo);
  }
  return aplicadas;
}

/** Identificador opaco e ordenável por tempo, sem depender de dependência externa. */
export function novoId(prefixo: string): string {
  const tempo = Date.now().toString(36);
  const aleatorio = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `${prefixo}_${tempo}${aleatorio}`;
}

export function json<T>(texto: string | null | undefined, padrao: T): T {
  if (!texto) return padrao;
  try {
    return JSON.parse(texto) as T;
  } catch {
    return padrao;
  }
}
