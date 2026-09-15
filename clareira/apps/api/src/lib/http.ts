import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

/**
 * Roteador mínimo sobre `node:http`.
 *
 * Uma dependência de framework não se justifica para a superfície desta API, e
 * manter o caminho da requisição explícito torna idempotência, autorização e
 * tratamento de erro auditáveis linha a linha.
 */

export interface Contexto {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  consulta: URLSearchParams;
  corpo: unknown;
  token: string | null;
  /** Id de correlação: viaja no log e na resposta, para rastrear uma falha. */
  correlacao: string;
  agoraMs: number;
}

export type Manipulador = (ctx: Contexto) => Promise<unknown> | unknown;

interface Rota {
  metodo: string;
  partes: string[];
  manipulador: Manipulador;
}

export class ErroHttp extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensagem: string,
    readonly detalhe?: unknown,
  ) {
    super(mensagem);
  }
}

export const erros = {
  naoAutenticado: () => new ErroHttp(401, 'nao_autenticado', 'Entre para continuar.'),
  credenciaisInvalidas: () => new ErroHttp(401, 'credenciais_invalidas', 'E-mail ou senha não conferem.'),
  semPermissao: (o?: string) => new ErroHttp(403, 'sem_permissao', o ?? 'Você não tem permissão para esta ação.'),
  naoEncontrado: (o = 'Recurso') => new ErroHttp(404, 'nao_encontrado', `${o} não encontrado.`),
  invalido: (m: string, d?: unknown) => new ErroHttp(422, 'entrada_invalida', m, d),
  conflito: (m: string, d?: unknown) => new ErroHttp(409, 'conflito', m, d),
  limite: (m: string) => new ErroHttp(429, 'limite_excedido', m),
};

export class Roteador {
  private rotas: Rota[] = [];

  registrar(metodo: string, caminho: string, manipulador: Manipulador): this {
    this.rotas.push({ metodo, partes: caminho.split('/').filter(Boolean), manipulador });
    return this;
  }

  get(c: string, h: Manipulador) { return this.registrar('GET', c, h); }
  post(c: string, h: Manipulador) { return this.registrar('POST', c, h); }
  patch(c: string, h: Manipulador) { return this.registrar('PATCH', c, h); }
  delete(c: string, h: Manipulador) { return this.registrar('DELETE', c, h); }

  private casar(metodo: string, caminho: string): { rota: Rota; params: Record<string, string> } | null {
    const partes = caminho.split('/').filter(Boolean);
    for (const rota of this.rotas) {
      if (rota.metodo !== metodo || rota.partes.length !== partes.length) continue;
      const params: Record<string, string> = {};
      let casou = true;
      for (let i = 0; i < rota.partes.length; i++) {
        const esperado = rota.partes[i];
        if (esperado.startsWith(':')) params[esperado.slice(1)] = decodeURIComponent(partes[i]);
        else if (esperado !== partes[i]) { casou = false; break; }
      }
      if (casou) return { rota, params };
    }
    return null;
  }

  async atender(req: IncomingMessage, res: ServerResponse, origensPermitidas: string[]): Promise<void> {
    const correlacao = randomUUID();
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const origem = req.headers.origin;

    if (origem && origensPermitidas.includes(origem)) {
      res.setHeader('access-control-allow-origin', origem);
      res.setHeader('access-control-allow-credentials', 'true');
      res.setHeader('vary', 'origin');
    }
    res.setHeader('access-control-allow-headers', 'content-type, authorization');
    res.setHeader('access-control-allow-methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('x-correlacao', correlacao);

    if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }

    const casado = this.casar(req.method ?? 'GET', url.pathname);
    if (!casado) {
      responder(res, 404, { erro: { codigo: 'nao_encontrado', mensagem: 'Rota não encontrada.' }, correlacao });
      return;
    }

    try {
      const corpo = await lerCorpo(req);
      const autorizacao = req.headers.authorization;
      const token = autorizacao?.startsWith('Bearer ') ? autorizacao.slice(7) : null;

      const resultado = await casado.rota.manipulador({
        req, res,
        params: casado.params,
        consulta: url.searchParams,
        corpo,
        token,
        correlacao,
        agoraMs: Date.now(),
      });

      if (res.writableEnded) return;
      responder(res, 200, resultado ?? { ok: true });
    } catch (e) {
      if (e instanceof ErroHttp) {
        responder(res, e.status, {
          erro: { codigo: e.codigo, mensagem: e.message, detalhe: e.detalhe },
          correlacao,
        });
        return;
      }
      // Log estruturado sem dado sensível; o cliente recebe só a correlação.
      console.error(JSON.stringify({
        nivel: 'erro', correlacao, rota: url.pathname, metodo: req.method,
        mensagem: e instanceof Error ? e.message : String(e),
      }));
      responder(res, 500, {
        erro: { codigo: 'erro_interno', mensagem: 'Algo falhou do nosso lado. Tente de novo.' },
        correlacao,
      });
    }
  }
}

function responder(res: ServerResponse, status: number, corpo: unknown): void {
  const texto = JSON.stringify(corpo);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(texto);
}

const LIMITE_CORPO_BYTES = 1_000_000;

async function lerCorpo(req: IncomingMessage): Promise<unknown> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const pedacos: Buffer[] = [];
  let total = 0;
  for await (const pedaco of req) {
    total += (pedaco as Buffer).length;
    if (total > LIMITE_CORPO_BYTES) throw erros.invalido('Corpo da requisição grande demais.');
    pedacos.push(pedaco as Buffer);
  }
  if (pedacos.length === 0) return undefined;
  const texto = Buffer.concat(pedacos).toString('utf8');
  try {
    return JSON.parse(texto);
  } catch {
    throw erros.invalido('Corpo não é JSON válido.');
  }
}

/** Leitura tipada e validada de campos do corpo. Nada entra sem validação. */
export function campo(corpo: unknown, nome: string): unknown {
  if (typeof corpo !== 'object' || corpo === null) throw erros.invalido('Corpo ausente.');
  return (corpo as Record<string, unknown>)[nome];
}

export function texto(corpo: unknown, nome: string, opcoes: { max?: number; obrigatorio?: boolean } = {}): string {
  const v = campo(corpo, nome);
  if (v === undefined || v === null || v === '') {
    if (opcoes.obrigatorio === false) return '';
    throw erros.invalido(`O campo "${nome}" é obrigatório.`);
  }
  if (typeof v !== 'string') throw erros.invalido(`O campo "${nome}" precisa ser texto.`);
  if (opcoes.max && v.length > opcoes.max) throw erros.invalido(`O campo "${nome}" excede ${opcoes.max} caracteres.`);
  return v;
}

export function inteiro(corpo: unknown, nome: string, opcoes: { min?: number; max?: number } = {}): number {
  const v = Number(campo(corpo, nome));
  if (!Number.isFinite(v)) throw erros.invalido(`O campo "${nome}" precisa ser número.`);
  if (opcoes.min !== undefined && v < opcoes.min) throw erros.invalido(`"${nome}" precisa ser no mínimo ${opcoes.min}.`);
  if (opcoes.max !== undefined && v > opcoes.max) throw erros.invalido(`"${nome}" precisa ser no máximo ${opcoes.max}.`);
  return v;
}
