import { CATALOGO_VERSAO, plano, type Capacidade, type Cota } from './catalogo.js';

/**
 * Entitlements — a autoridade sobre o que uma conta pode fazer.
 *
 * Esta função é chamada NO SERVIDOR, em cada requisição que toca capacidade
 * paga, inclusive acesso direto à API e mídia privada. Esconder um botão não é
 * segurança (seção 24.7).
 */

export type EstadoAssinatura =
  | 'sem_assinatura'
  | 'em_teste'
  | 'ativa'
  | 'pagamento_falhou'
  | 'cancelada_ate_fim_do_periodo'
  | 'expirada';

export interface Assinatura {
  alunoId: string;
  planoId: string | null;
  estado: EstadoAssinatura;
  /** Instante em ms até o qual o acesso é válido. */
  validaAteMs: number | null;
  /** Versão do catálogo contratada. Muda de preço não altera direito vigente. */
  catalogoVersao: string;
}

export interface ConsumoDoCiclo {
  /** Consumo observado por capacidade, na unidade da cota. */
  [capacidade: string]: number;
}

export interface Decisao {
  permitido: boolean;
  motivo:
    | 'permitido'
    | 'plano_nao_inclui'
    | 'assinatura_inativa'
    | 'cota_esgotada'
    | 'capacidade_desconhecida';
  /** Quando há cota, quanto resta. Mostrado ao cliente ANTES de acabar. */
  restante?: number;
  cota?: Cota;
  /**
   * O que continua funcionando mesmo com a decisão negativa. O modo essencial
   * da aula NUNCA para porque a cota acabou (seção 24.4).
   */
  alternativaSempreDisponivel: string;
}

const ESTADOS_COM_ACESSO: EstadoAssinatura[] = ['em_teste', 'ativa', 'cancelada_ate_fim_do_periodo'];

/**
 * Capacidades que continuam disponíveis mesmo sem assinatura ativa, porque
 * dizem respeito a direitos já constituídos e não a acesso a conteúdo novo.
 */
const SEMPRE_DISPONIVEIS: Capacidade[] = ['historico', 'conquistas_digitais'];

export function decidir(params: {
  assinatura: Assinatura;
  capacidade: Capacidade;
  consumo: ConsumoDoCiclo;
  agoraMs: number;
}): Decisao {
  const { assinatura, capacidade, consumo, agoraMs } = params;
  const alternativa =
    'A aula, os controles, as explicações editoriais e o histórico continuam funcionando.';

  // Cancelar ou deixar de renovar não confisca o que já foi conquistado
  // (seção 34.2). Histórico e conquistas sobrevivem à assinatura.
  if (SEMPRE_DISPONIVEIS.includes(capacidade)) {
    return { permitido: true, motivo: 'permitido', alternativaSempreDisponivel: alternativa };
  }

  const acessoValido =
    ESTADOS_COM_ACESSO.includes(assinatura.estado) &&
    (assinatura.validaAteMs === null || assinatura.validaAteMs > agoraMs);

  if (!acessoValido || !assinatura.planoId) {
    return { permitido: false, motivo: 'assinatura_inativa', alternativaSempreDisponivel: alternativa };
  }

  const p = plano(assinatura.planoId);
  if (!p) return { permitido: false, motivo: 'capacidade_desconhecida', alternativaSempreDisponivel: alternativa };

  if (!p.capacidades.includes(capacidade)) {
    return { permitido: false, motivo: 'plano_nao_inclui', alternativaSempreDisponivel: alternativa };
  }

  const cota = p.cotas.find(c => c.capacidade === capacidade);
  if (!cota) {
    return { permitido: true, motivo: 'permitido', alternativaSempreDisponivel: alternativa };
  }

  const usado = consumo[capacidade] ?? 0;
  const restante = Math.max(0, cota.incluido - usado);
  if (restante <= 0) {
    // Cota esgotada NÃO interrompe o exercício e NÃO gera cobrança automática.
    return { permitido: false, motivo: 'cota_esgotada', restante: 0, cota, alternativaSempreDisponivel: alternativa };
  }

  return { permitido: true, motivo: 'permitido', restante, cota, alternativaSempreDisponivel: alternativa };
}

/** Fração consumida a partir da qual vale avisar o cliente com antecedência. */
export const LIMIAR_DE_AVISO = 0.8;

export function precisaAvisar(decisao: Decisao): boolean {
  if (!decisao.cota || decisao.restante === undefined) return false;
  const usadoFrac = 1 - decisao.restante / decisao.cota.incluido;
  return usadoFrac >= LIMIAR_DE_AVISO;
}

/** Assinatura de demonstração usada apenas em desenvolvimento e nos seeds. */
export function assinaturaDemo(alunoId: string, planoId: string, agoraMs: number): Assinatura {
  return {
    alunoId,
    planoId,
    estado: 'ativa',
    validaAteMs: agoraMs + 30 * 24 * 3_600_000,
    catalogoVersao: CATALOGO_VERSAO,
  };
}
