/**
 * Cliente da API.
 *
 * Todo erro vira uma mensagem que o produto pode mostrar. Nenhuma tela
 * improvisa texto de erro a partir de um status HTTP cru.
 */

export class ErroDaApi extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensagem: string,
    readonly detalhe?: any,
    readonly correlacao?: string,
  ) {
    super(mensagem);
  }
}

const CHAVE_TOKEN = 'clareira.token';

export function tokenSalvo(): string | null {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function guardarToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(CHAVE_TOKEN, token);
    else localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    /* Navegação privada ou armazenamento bloqueado: a sessão vale só por esta aba. */
  }
}

/** Identidade do dispositivo, para o contrato de sessão entre telas. */
export function dispositivoId(): string {
  const chave = 'clareira.dispositivo';
  try {
    let id = localStorage.getItem(chave);
    if (!id) {
      id = `dev_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(chave, id);
    }
    return id;
  } catch {
    return `dev_efemero_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export async function api<T = any>(
  caminho: string,
  opcoes: { metodo?: string; corpo?: unknown; sinal?: AbortSignal } = {},
): Promise<T> {
  const resposta = await fetch(caminho, {
    method: opcoes.metodo ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(tokenSalvo() ? { authorization: `Bearer ${tokenSalvo()}` } : {}),
    },
    body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
    signal: opcoes.sinal,
  });

  const texto = await resposta.text();
  let corpo: any = null;
  try {
    corpo = texto ? JSON.parse(texto) : null;
  } catch {
    throw new ErroDaApi(resposta.status, 'resposta_invalida', 'A resposta do servidor veio incompleta. Tente de novo.');
  }

  if (!resposta.ok) {
    const e = corpo?.erro ?? {};
    // 401 limpa a sessão local: manter um token morto só gera erro em série.
    if (resposta.status === 401 && e.codigo === 'nao_autenticado') guardarToken(null);
    throw new ErroDaApi(
      resposta.status,
      e.codigo ?? 'erro',
      e.mensagem ?? 'Algo não funcionou. Tente de novo.',
      e.detalhe,
      corpo?.correlacao,
    );
  }
  return corpo as T;
}

// --- Tipos das respostas usadas pela interface -----------------------------

export interface MidiaDaAula {
  webmUrl: string;
  mp4Url: string;
  posterUrl: string;
  verticalWebmUrl: string | null;
  verticalMp4Url: string | null;
  verticalPosterUrl: string | null;
  ilustrativo: boolean;
  origem: string;
  licenca: string;
}

export interface AulaResumo {
  id: string;
  titulo: string;
  descricao: string;
  duracaoMs: number;
  nivel: string;
  modalidade: string;
  equipamentos: string[];
  espacoMinimo: string;
  impacto: string;
  demonstracaoPublica: boolean;
  professor: { id: string; nome: string; especialidades: string[] };
  midia: MidiaDaAula | null;
}

export const minutos = (ms: number) => Math.round(ms / 60_000);

export function textoDeEquipamento(equipamentos: string[]): string {
  return equipamentos.length === 0 ? 'sem equipamento' : equipamentos.join(', ');
}

export function textoDeEspaco(espaco: string): string {
  return { tapete: 'cabe num tapete', pequeno: 'sala pequena', medio: 'precisa de espaço' }[espaco] ?? espaco;
}

export function textoDeImpacto(impacto: string): string {
  return { sem_saltos: 'sem saltos', baixo: 'impacto baixo', moderado: 'impacto moderado' }[impacto] ?? impacto;
}
