import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import type { Banco } from '../db/index.js';
import { novoId } from '../db/index.js';
import type { Papel } from '@clareira/domain';

/**
 * Autenticação e sessão de acesso.
 *
 * Princípios aplicados (avora-codigo-automacao #0130): não inventar
 * criptografia, menor privilégio, token de vida curta, falhar de forma segura.
 *
 * scrypt é a função de derivação: está na biblioteca padrão do Node, é
 * resistente a hardware dedicado e não acrescenta dependência nativa extra.
 */

const SCRYPT_N = 16_384;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const TAMANHO_HASH = 64;

/** Validade da sessão de acesso. Curta o bastante para limitar dano por vazamento. */
export const VALIDADE_SESSAO_MS = 14 * 24 * 3_600_000;

/** Tentativas de acesso permitidas por e-mail dentro da janela. */
export const LIMITE_TENTATIVAS = 8;
export const JANELA_TENTATIVAS_MS = 15 * 60_000;

export function derivarSenha(senha: string, saltHex?: string): { hash: string; salt: string } {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : randomBytes(16);
  const hash = scryptSync(senha.normalize('NFKC'), salt, TAMANHO_HASH, { N: SCRYPT_N, r: SCRYPT_r, p: SCRYPT_p });
  return { hash: hash.toString('hex'), salt: salt.toString('hex') };
}

export function senhaConfere(senha: string, hashHex: string, saltHex: string): boolean {
  const { hash } = derivarSenha(senha, saltHex);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(hashHex, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * O token vai para o cliente; no banco guardamos apenas o seu hash. Um dump do
 * banco não permite se passar por ninguém.
 */
export function novoToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashDoToken(token) };
}

export function hashDoToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export interface Autenticado {
  id: string;
  email: string;
  nome: string;
  fuso: string;
  papeis: Papel[];
}

export function criarSessaoDeAcesso(db: Banco, usuarioId: string, agoraMs: number, dispositivo?: string): string {
  const { token, hash } = novoToken();
  db.prepare(
    `INSERT INTO sessoes_de_acesso (token_hash, usuario_id, criado_em_ms, expira_em_ms, dispositivo)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(hash, usuarioId, agoraMs, agoraMs + VALIDADE_SESSAO_MS, dispositivo ?? null);
  return token;
}

export function encerrarSessaoDeAcesso(db: Banco, token: string): void {
  db.prepare('DELETE FROM sessoes_de_acesso WHERE token_hash = ?').run(hashDoToken(token));
}

export function autenticar(db: Banco, token: string | null, agoraMs: number): Autenticado | null {
  if (!token) return null;
  const linha = db
    .prepare(
      `SELECT u.id, u.email, u.nome, u.fuso, s.expira_em_ms
       FROM sessoes_de_acesso s JOIN usuarios u ON u.id = s.usuario_id
       WHERE s.token_hash = ?`,
    )
    .get(hashDoToken(token)) as any;

  if (!linha) return null;
  if (linha.expira_em_ms <= agoraMs) {
    db.prepare('DELETE FROM sessoes_de_acesso WHERE token_hash = ?').run(hashDoToken(token));
    return null;
  }

  const papeis = db
    .prepare('SELECT papel FROM papeis WHERE usuario_id = ?')
    .all(linha.id)
    .map((r: any) => r.papel as Papel);

  return { id: linha.id, email: linha.email, nome: linha.nome, fuso: linha.fuso, papeis };
}

export function temPapel(quem: Autenticado | null, ...papeis: Papel[]): boolean {
  if (!quem) return false;
  return papeis.some(p => quem.papeis.includes(p));
}

/**
 * Limita tentativas por e-mail. Devolve `true` quando a tentativa deve ser
 * recusada antes mesmo de verificar a senha.
 */
export function excedeuTentativas(db: Banco, email: string, agoraMs: number): boolean {
  const desde = agoraMs - JANELA_TENTATIVAS_MS;
  const r = db
    .prepare('SELECT COUNT(*) AS n FROM tentativas_de_acesso WHERE email = ? AND em_ms > ? AND sucesso = 0')
    .get(email.toLowerCase(), desde) as any;
  return r.n >= LIMITE_TENTATIVAS;
}

export function registrarTentativa(db: Banco, email: string, sucesso: boolean, agoraMs: number): void {
  db.prepare('INSERT INTO tentativas_de_acesso (email, em_ms, sucesso) VALUES (?, ?, ?)').run(
    email.toLowerCase(),
    agoraMs,
    sucesso ? 1 : 0,
  );
}

export function registrarAuditoria(
  db: Banco,
  params: { atorId: string | null; acao: string; objeto: string; objetoId?: string; correlacao?: string; detalhe?: unknown; agoraMs: number },
): void {
  db.prepare(
    `INSERT INTO auditoria (id, ator_id, acao, objeto, objeto_id, em_ms, correlacao, detalhe_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    novoId('aud'),
    params.atorId,
    params.acao,
    params.objeto,
    params.objetoId ?? null,
    params.agoraMs,
    params.correlacao ?? null,
    params.detalhe ? JSON.stringify(params.detalhe) : null,
  );
}
