/**
 * Programa de reconhecimento — regras e ledger.
 *
 * Implementa a seção 34 do briefing. Três decisões estruturais:
 *
 * 1. O LEDGER ESTÁ NO SERVIDOR e é append-only. O cliente nunca envia seu saldo
 *    nem aprova seu próprio prêmio (34.4, item 1).
 * 2. A DECISÃO É REPRODUZÍVEL: dada a versão da regra e as evidências, a mesma
 *    decisão sai sempre, com explicação legível (34.11).
 * 3. REVERSÃO É EVENTO COMPENSATÓRIO, nunca edição silenciosa do histórico
 *    (34.4, item 11).
 *
 * O que este módulo deliberadamente NÃO pontua: calorias, peso perdido, carga
 * máxima, repetições ilimitadas, frequência cardíaca elevada e dias sem
 * descanso (34.3).
 */

export type TipoEventoLedger =
  | 'dia_de_participacao'
  | 'semana_de_compromisso'
  | 'ciclo_comercial_elegivel'
  | 'marco_atingido'
  | 'beneficio_solicitado'
  | 'beneficio_aprovado'
  | 'beneficio_negado'
  | 'em_revisao'
  | 'revisao_encerrada'
  | 'compensacao'
  | 'recurso_aberto'
  | 'recurso_decidido';

export interface EventoLedger {
  /** Chave de idempotência. Reenvio com a mesma chave não cria evento novo. */
  chave: string;
  tipo: TipoEventoLedger;
  alunoId: string;
  emMs: number;
  /** Versão da regra vigente quando o evento foi registrado. */
  regraVersao: string;
  /** Dia local (AAAA-MM-DD) no fuso declarado do aluno, quando aplicável. */
  diaLocal?: string;
  /** Identificador ISO da semana (AAAA-Www), quando aplicável. */
  semana?: string;
  marcoId?: string;
  /** De onde veio a evidência. Nenhuma isoladamente comprova execução física. */
  origem: 'reproducao_confirmada' | 'autodeclarado' | 'sensor' | 'revisao_profissional' | 'sistema';
  detalhe?: Record<string, unknown>;
  /** Chave do evento que este compensa, quando `tipo === 'compensacao'`. */
  compensa?: string;
}

export interface VersaoRegra {
  versao: string;
  vigenteDeMs: number;
  /** Dias de participação exigidos numa semana para creditar a semana. */
  diasPorSemanaPadrao: number;
  marcos: Marco[];
  /** Janela em que a contagem de cada marco corre. */
  descricaoPublica: string;
}

export interface Marco {
  id: string;
  rotulo: string;
  /** Semanas de compromisso exigidas. */
  semanasExigidas: number;
  /** Dentro de uma janela de quantas semanas. Dá espaço a descanso e férias. */
  janelaEmSemanas: number;
  /** Ciclos comerciais liquidados exigidos. Zero = reconhecimento digital. */
  ciclosPagosExigidos: number;
  camada: 'jornada' | 'fidelidade';
  /** Só marcos de fidelidade com orçamento financiado dão benefício físico. */
  beneficio: { tipo: 'digital' } | { tipo: 'fisico'; catalogoId: string };
}

/**
 * Regra vigente — RASCUNHO. `ofertaFisicaAtiva: false` significa que nenhum
 * benefício físico é prometido ao cliente. A infraestrutura existe e é
 * testável; a campanha não está ativa (34.1).
 */
export const REGRA_RASCUNHO: VersaoRegra = {
  versao: 'rascunho-2026-09-14',
  vigenteDeMs: Date.UTC(2026, 8, 14),
  diasPorSemanaPadrao: 3,
  descricaoPublica:
    'Uma unidade de participação por dia. A semana conta quando você cumpre a sua meta combinada. ' +
    'Repetir aulas no mesmo dia não acelera nada, e treino adaptado conta igual.',
  marcos: [
    {
      id: 'boas-vindas',
      rotulo: 'Primeira aula concluída',
      semanasExigidas: 0,
      janelaEmSemanas: 0,
      ciclosPagosExigidos: 0,
      camada: 'jornada',
      beneficio: { tipo: 'digital' },
    },
    {
      id: 'minha-constancia',
      rotulo: '4 semanas de compromisso',
      semanasExigidas: 4,
      janelaEmSemanas: 8,
      ciclosPagosExigidos: 0,
      camada: 'jornada',
      beneficio: { tipo: 'digital' },
    },
    {
      id: 'primeiro-objeto',
      rotulo: '12 semanas de compromisso',
      semanasExigidas: 12,
      janelaEmSemanas: 20,
      ciclosPagosExigidos: 6,
      camada: 'fidelidade',
      beneficio: { tipo: 'fisico', catalogoId: 'primeiro-objeto' },
    },
  ],
};

/** Nenhum benefício físico é oferecido enquanto isto for falso. */
export const OFERTA_FISICA_ATIVA = false;

export interface Evidencias {
  alunoId: string;
  /** Dias locais distintos com participação válida. */
  diasDeParticipacao: string[];
  /** Semanas ISO creditadas. */
  semanasDeCompromisso: string[];
  /** Ciclos comerciais liquidados conforme política. */
  ciclosPagosElegiveis: number;
  /** Marcos já concedidos, para não conceder duas vezes. */
  marcosConcedidos: string[];
  /** Marcos em revisão: não bloqueiam a aula nem apagam o progresso. */
  marcosEmRevisao: string[];
}

export interface DecisaoDeElegibilidade {
  marcoId: string;
  elegivel: boolean;
  /** Explicação legível para o aluno — sem expor detalhes de antifraude. */
  explicacao: string;
  faltam: { semanas: number; ciclosPagos: number };
  /** Verdadeiro quando o marco dá benefício físico e a oferta está desativada. */
  bloqueadoPorOfertaInativa: boolean;
  regraVersao: string;
}

/**
 * Decide a elegibilidade de um marco. Função pura: a mesma evidência e a mesma
 * versão de regra produzem sempre a mesma decisão e a mesma explicação.
 */
export function decidirMarco(params: {
  marco: Marco;
  evidencias: Evidencias;
  regra: VersaoRegra;
}): DecisaoDeElegibilidade {
  const { marco, evidencias, regra } = params;

  const semanas = contarSemanasNaJanela(evidencias.semanasDeCompromisso, marco.janelaEmSemanas);
  const faltamSemanas = Math.max(0, marco.semanasExigidas - semanas);
  const faltamCiclos = Math.max(0, marco.ciclosPagosExigidos - evidencias.ciclosPagosElegiveis);

  const jaConcedido = evidencias.marcosConcedidos.includes(marco.id);
  const emRevisao = evidencias.marcosEmRevisao.includes(marco.id);
  const bloqueadoPorOfertaInativa = marco.beneficio.tipo === 'fisico' && !OFERTA_FISICA_ATIVA;

  let explicacao: string;
  if (jaConcedido) {
    explicacao = 'Você já recebeu este reconhecimento.';
  } else if (emRevisao) {
    explicacao = 'Este marco está em revisão. Seu progresso continua registrado e sua aula não é afetada.';
  } else if (faltamSemanas > 0 && faltamCiclos > 0) {
    // O verbo concorda com o primeiro sujeito da enumeração.
    explicacao = `${verbo(faltamSemanas)} ${contagem(faltamSemanas, 'semana')} de compromisso e ${contagem(faltamCiclos, 'ciclo')} de assinatura.`;
  } else if (faltamSemanas > 0) {
    explicacao = `${verbo(faltamSemanas)} ${contagem(faltamSemanas, 'semana')} de compromisso.`;
  } else if (faltamCiclos > 0) {
    explicacao = `As semanas estão completas. ${verbo(faltamCiclos)} ${contagem(faltamCiclos, 'ciclo')} de assinatura.`;
  } else if (bloqueadoPorOfertaInativa) {
    explicacao =
      'Você cumpriu os critérios. O benefício físico ainda não está disponível: nenhuma campanha foi aberta.';
  } else {
    explicacao = 'Critérios cumpridos.';
  }

  return {
    marcoId: marco.id,
    elegivel: !jaConcedido && !emRevisao && faltamSemanas === 0 && faltamCiclos === 0 && !bloqueadoPorOfertaInativa,
    explicacao,
    faltam: { semanas: faltamSemanas, ciclosPagos: faltamCiclos },
    bloqueadoPorOfertaInativa,
    regraVersao: regra.versao,
  };
}

/** "Falta" para um, "Faltam" para vários — o verbo também concorda. */
function verbo(n: number): string {
  return n === 1 ? 'Falta' : 'Faltam';
}

/** "1 semana" / "3 semanas". */
function contagem(n: number, substantivo: string): string {
  return `${n} ${substantivo}${n === 1 ? '' : 's'}`;
}

/**
 * Conta semanas creditadas dentro da janela mais recente.
 * `janelaEmSemanas === 0` significa sem janela (marco pontual).
 */
function contarSemanasNaJanela(semanas: string[], janelaEmSemanas: number): number {
  const unicas = [...new Set(semanas)].sort();
  if (janelaEmSemanas <= 0) return unicas.length;
  return unicas.slice(-janelaEmSemanas).length;
}

// ---------------------------------------------------------------------------
// Ledger
// ---------------------------------------------------------------------------

/**
 * Aplica um evento ao ledger.
 *
 * Idempotente por `chave`: retries de rede, várias abas, web + app + relógio e
 * reenvios de fornecedor não geram unidades extras (34.4, itens 2 e 7).
 */
export function registrar(ledger: EventoLedger[], evento: EventoLedger): { ledger: EventoLedger[]; novo: boolean } {
  if (ledger.some(e => e.chave === evento.chave)) return { ledger, novo: false };

  // Um dia local rende no máximo uma unidade, mesmo com várias aulas (34.3).
  if (evento.tipo === 'dia_de_participacao' && evento.diaLocal) {
    const jaTem = ledger.some(
      e => e.tipo === 'dia_de_participacao' && e.alunoId === evento.alunoId && e.diaLocal === evento.diaLocal && !foiCompensado(ledger, e.chave),
    );
    if (jaTem) return { ledger, novo: false };
  }

  if (evento.tipo === 'semana_de_compromisso' && evento.semana) {
    const jaTem = ledger.some(
      e => e.tipo === 'semana_de_compromisso' && e.alunoId === evento.alunoId && e.semana === evento.semana && !foiCompensado(ledger, e.chave),
    );
    if (jaTem) return { ledger, novo: false };
  }

  return { ledger: [...ledger, evento], novo: true };
}

export function foiCompensado(ledger: EventoLedger[], chave: string): boolean {
  return ledger.some(e => e.tipo === 'compensacao' && e.compensa === chave);
}

/** Reverte um evento SEM apagar história: acrescenta uma compensação. */
export function compensar(
  ledger: EventoLedger[],
  params: { chave: string; alunoId: string; compensa: string; motivo: string; emMs: number; regraVersao: string },
): EventoLedger[] {
  const alvo = ledger.find(e => e.chave === params.compensa);
  if (!alvo) throw new Error(`evento ${params.compensa} não existe no ledger`);
  if (foiCompensado(ledger, params.compensa)) return ledger;
  return [
    ...ledger,
    {
      chave: params.chave,
      tipo: 'compensacao',
      alunoId: params.alunoId,
      emMs: params.emMs,
      regraVersao: params.regraVersao,
      origem: 'sistema',
      compensa: params.compensa,
      detalhe: { motivo: params.motivo },
    },
  ];
}

/** Deriva as evidências do aluno a partir do ledger. O saldo nunca vem do cliente. */
export function evidenciasDoLedger(ledger: EventoLedger[], alunoId: string): Evidencias {
  const meus = ledger.filter(e => e.alunoId === alunoId);
  const vale = (e: EventoLedger) => !foiCompensado(ledger, e.chave);

  return {
    alunoId,
    diasDeParticipacao: [...new Set(meus.filter(e => e.tipo === 'dia_de_participacao' && vale(e)).map(e => e.diaLocal!))].sort(),
    semanasDeCompromisso: [...new Set(meus.filter(e => e.tipo === 'semana_de_compromisso' && vale(e)).map(e => e.semana!))].sort(),
    ciclosPagosElegiveis: meus.filter(e => e.tipo === 'ciclo_comercial_elegivel' && vale(e)).length,
    marcosConcedidos: [...new Set(meus.filter(e => e.tipo === 'marco_atingido' && vale(e)).map(e => e.marcoId!))],
    marcosEmRevisao: [
      ...new Set(
        meus
          .filter(e => e.tipo === 'em_revisao' && vale(e) && !meus.some(f => f.tipo === 'revisao_encerrada' && f.marcoId === e.marcoId && f.emMs > e.emMs))
          .map(e => e.marcoId!),
      ),
    ],
  };
}

/** Dia local no fuso declarado do aluno, em AAAA-MM-DD. */
export function diaLocal(instanteMs: number, fusoIana: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: fusoIana,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(instanteMs));
}

/** Semana ISO (AAAA-Www) a partir de um dia local AAAA-MM-DD. */
export function semanaIso(dia: string): string {
  const [a, m, d] = dia.split('-').map(Number);
  const data = new Date(Date.UTC(a, m - 1, d));
  const diaSemana = (data.getUTCDay() + 6) % 7; // segunda = 0
  data.setUTCDate(data.getUTCDate() - diaSemana + 3); // quinta da mesma semana
  const ano = data.getUTCFullYear();
  const primeiraQuinta = new Date(Date.UTC(ano, 0, 4));
  const offset = (primeiraQuinta.getUTCDay() + 6) % 7;
  primeiraQuinta.setUTCDate(primeiraQuinta.getUTCDate() - offset + 3);
  const semana = 1 + Math.round((data.getTime() - primeiraQuinta.getTime()) / (7 * 86_400_000));
  return `${ano}-W${String(semana).padStart(2, '0')}`;
}
