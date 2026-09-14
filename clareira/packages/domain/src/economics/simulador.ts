/**
 * Simulador econômico interno.
 *
 * Implementa as fórmulas das seções 24.5, 34.6 e 34.7 do briefing. Existe
 * justamente para NÃO ser uma tabela fixa que sempre conclui que o negócio é
 * lucrativo: todas as entradas são editáveis, cada lacuna de custo é marcada e
 * a conclusão fica condicional enquanto houver lacuna.
 *
 * Todo valor monetário é em CENTAVOS, inteiro. Dinheiro não usa ponto
 * flutuante.
 *
 * Nada aqui é cotação, alíquota ou projeção comercial. Os números do cenário
 * padrão são os exemplos didáticos e FICTÍCIOS da seção 34.7.
 */

export type Origem = 'hipotese' | 'observado' | 'cotacao' | 'lacuna';

export interface Valor {
  centavos: number;
  origem: Origem;
  /** De onde veio. Obrigatório quando a origem não é hipótese. */
  fonte?: string;
}

export function hip(centavos: number, nota?: string): Valor {
  return { centavos, origem: 'hipotese', fonte: nota };
}
export function lacuna(nota: string): Valor {
  return { centavos: 0, origem: 'lacuna', fonte: nota };
}

export interface EntradasDoPlano {
  planoId: string;
  nome: string;
  receitaBruta: Valor;
  /** Deduções: descontos, tributos, taxas de cobrança, estornos e perdas. */
  deducoes: Valor;
  /** Vídeo, IA/voz, suporte variável, royalties e demais custos variáveis. */
  custoVariavel: Valor;
  /**
   * Parcela gerencial destinada a custos fixos, recuperação de aquisição e
   * resultado mínimo planejado. É META, não custo comprovado, e não pode ser
   * descontada de novo em outra rubrica do mesmo cálculo.
   */
  parcelaGerencial: Valor;
  /** Percentual da margem positiva reservado a recompensas. Parâmetro, não benchmark. */
  percentualReserva: number;
  pagantes: number;
}

export interface EntradasDoPrograma {
  /** Custo ENTREGUE de um benefício, com todas as rubricas da seção 34.6. */
  custoEntregue: {
    compra: Valor;
    personalizacao: Valor;
    embalagem: Valor;
    separacaoManuseio: Valor;
    frete: Valor;
    tributosETaxas: Valor;
    atendimento: Valor;
    provisaoTrocaAvariaExtravio: Valor;
    processamentoEValidacao: Valor;
  };
  /** Caixa operacional livre por participante, após obrigações e reservas. */
  caixaLivrePorParticipante: Valor;
  /** Patrocínio só entra depois de compromisso confiável e condições de entrega. */
  patrocinioConfirmado: Valor;
}

export interface EntradasFixas {
  custosFixosDoPeriodo: Valor;
  /**
   * Orçamento de aquisição somado ao numerador do ponto de equilíbrio. Se
   * usado aqui, NÃO pode ser descontado de novo no denominador.
   */
  orcamentoAquisicaoNoNumerador: Valor | null;
}

export interface ResultadoDoPlano {
  planoId: string;
  nome: string;
  receitaLiquida: number;
  margemContribuicaoAntesDasRecompensas: number;
  espacoEconomico: number;
  reservaPorCiclo: number;
  contribuicaoAposReservar: number;
  reservaApos6Ciclos: number;
  reservaApos12Ciclos: number;
  /** `null` quando a reserva é zero: não é financiável neste cenário. */
  ciclosMinimosParaUmBeneficio: number | null;
}

export interface ResultadoDaSimulacao {
  cenario: string;
  custoEntregueTotal: number;
  planos: ResultadoDoPlano[];
  /** Contribuição média ponderada positiva por pagante. */
  contribuicaoMediaPonderada: number;
  /** `null` quando a contribuição média não é positiva. */
  pagantesParaEquilibrioOperacional: number | null;
  exposicaoSeTodosResgatarem: number;
  quantidadeAdicionalFinanciavel: number;
  lacunas: string[];
  /** Verdadeiro apenas quando NÃO há lacuna de custo em nenhuma entrada. */
  conclusaoIncondicional: boolean;
  avisos: string[];
}

function somar(valores: Valor[]): number {
  return valores.reduce((t, v) => t + v.centavos, 0);
}

function coletarLacunas(rotulo: string, valores: Record<string, Valor>): string[] {
  return Object.entries(valores)
    .filter(([, v]) => v.origem === 'lacuna')
    .map(([k, v]) => `${rotulo}.${k}: ${v.fonte ?? 'custo não informado'}`);
}

export function simular(params: {
  cenario: string;
  planos: EntradasDoPlano[];
  programa: EntradasDoPrograma;
  fixas: EntradasFixas;
}): ResultadoDaSimulacao {
  const { cenario, planos, programa, fixas } = params;
  const lacunas: string[] = [];
  const avisos: string[] = [];

  // --- Custo entregue de um benefício (seção 34.6) -------------------------
  const ce = programa.custoEntregue;
  lacunas.push(...coletarLacunas('custoEntregue', ce as unknown as Record<string, Valor>));
  const custoEntregueBruto = somar(Object.values(ce));
  // Patrocínio confirmado abate o custo; esperado NÃO abate.
  const custoEntregueTotal = Math.max(0, custoEntregueBruto - programa.patrocinioConfirmado.centavos);
  if (programa.patrocinioConfirmado.centavos > 0 && programa.patrocinioConfirmado.origem === 'hipotese') {
    avisos.push(
      'Patrocínio lançado como hipótese está abatendo o custo entregue. Enquanto não houver contrato e condições de entrega, trate o custo sem esse abatimento.',
    );
  }

  // --- Por plano -----------------------------------------------------------
  const resultados: ResultadoDoPlano[] = planos.map(p => {
    lacunas.push(
      ...coletarLacunas(p.planoId, {
        receitaBruta: p.receitaBruta,
        deducoes: p.deducoes,
        custoVariavel: p.custoVariavel,
        parcelaGerencial: p.parcelaGerencial,
      }),
    );

    const receitaLiquida = p.receitaBruta.centavos - p.deducoes.centavos;
    const margem = receitaLiquida - p.custoVariavel.centavos;

    // Espaço econômico = max(0, margem − parcela gerencial). A parcela já
    // cobre fixos, aquisição e resultado: não desconte de novo adiante.
    const espaco = Math.max(0, margem - p.parcelaGerencial.centavos);

    // Reserva = menor entre (percentual × margem positiva), espaço econômico
    // e caixa livre por participante.
    const porPercentual = margem > 0 ? Math.floor(margem * p.percentualReserva) : 0;
    const reserva = Math.max(
      0,
      Math.min(porPercentual, espaco, programa.caixaLivrePorParticipante.centavos),
    );

    return {
      planoId: p.planoId,
      nome: p.nome,
      receitaLiquida,
      margemContribuicaoAntesDasRecompensas: margem,
      espacoEconomico: espaco,
      reservaPorCiclo: reserva,
      contribuicaoAposReservar: margem - reserva,
      reservaApos6Ciclos: reserva * 6,
      reservaApos12Ciclos: reserva * 12,
      ciclosMinimosParaUmBeneficio: reserva > 0 ? Math.ceil(custoEntregueTotal / reserva) : null,
    };
  });

  // --- Equilíbrio operacional (seção 24.5) ---------------------------------
  const totalPagantes = planos.reduce((t, p) => t + p.pagantes, 0);
  const contribuicaoPonderada =
    totalPagantes > 0
      ? planos.reduce((t, p, i) => t + resultados[i].contribuicaoAposReservar * p.pagantes, 0) / totalPagantes
      : 0;

  const numerador =
    fixas.custosFixosDoPeriodo.centavos + (fixas.orcamentoAquisicaoNoNumerador?.centavos ?? 0);
  const pagantesParaEquilibrio =
    contribuicaoPonderada > 0 ? Math.ceil(numerador / contribuicaoPonderada) : null;

  if (contribuicaoPonderada <= 0) {
    avisos.push(
      'A contribuição média ponderada não é positiva: não existe ponto de equilíbrio operacional neste cenário. Mais assinantes aumentam o prejuízo.',
    );
  }
  if (fixas.orcamentoAquisicaoNoNumerador) {
    avisos.push(
      'Orçamento de aquisição somado ao numerador do equilíbrio. Não descontá-lo novamente na parcela gerencial de cada plano.',
    );
  }
  lacunas.push(...coletarLacunas('fixas', { custosFixosDoPeriodo: fixas.custosFixosDoPeriodo }));

  // --- Exposição se TODOS os elegíveis resgatarem (seção 34.6) --------------
  // Benefício garantido não pode ser dimensionado por taxa esperada de resgate.
  const exposicaoSeTodosResgatarem = custoEntregueTotal * totalPagantes;

  const saldoLivreTotal = resultados.reduce(
    (t, r, i) => t + r.reservaPorCiclo * planos[i].pagantes,
    0,
  );
  const quantidadeAdicionalFinanciavel =
    custoEntregueTotal > 0 ? Math.floor(saldoLivreTotal / custoEntregueTotal) : 0;

  // Equilíbrio operacional sozinho não recupera investimento inicial nem
  // atinge lucro planejado.
  avisos.push(
    'Equilíbrio operacional não é lucro nem recuperação de investimento inicial. Margem de contribuição não é lucro líquido.',
  );

  const lacunasUnicas = [...new Set(lacunas)];
  return {
    cenario,
    custoEntregueTotal,
    planos: resultados,
    contribuicaoMediaPonderada: Math.round(contribuicaoPonderada),
    pagantesParaEquilibrioOperacional: pagantesParaEquilibrio,
    exposicaoSeTodosResgatarem,
    quantidadeAdicionalFinanciavel,
    lacunas: lacunasUnicas,
    conclusaoIncondicional: lacunasUnicas.length === 0,
    avisos,
  };
}

// ---------------------------------------------------------------------------
// Cenários de referência. Os valores reproduzem os exemplos FICTÍCIOS da
// seção 34.7 do briefing, para que o simulador possa ser conferido contra ele.
// ---------------------------------------------------------------------------

export const CUSTO_ENTREGUE_EXEMPLO: EntradasDoPrograma['custoEntregue'] = {
  compra: hip(2500, 'exemplo didático da seção 34.7 — não é cotação'),
  personalizacao: hip(500, 'exemplo didático'),
  embalagem: hip(0, 'incluído em personalização no exemplo da seção 34.7'),
  separacaoManuseio: hip(300, 'exemplo didático: operação'),
  frete: hip(1700, 'exemplo didático'),
  tributosETaxas: lacuna('tributos sobre brinde não apurados; exige revisão contábil'),
  atendimento: lacuna('custo de atendimento por resgate não medido'),
  provisaoTrocaAvariaExtravio: hip(500, 'exemplo didático: contingência'),
  processamentoEValidacao: lacuna('custo de antifraude e revisão por resgate não medido'),
};

export function cenarioBase(): Parameters<typeof simular>[0] {
  return {
    cenario: 'base — reproduz os exemplos fictícios da seção 34.7',
    planos: [
      {
        planoId: 'essencial',
        nome: 'Essencial',
        receitaBruta: hip(2990, 'hipótese de preço da seção 24.3'),
        deducoes: hip(490, 'valor agregado fictício da seção 34.7; não é estimativa tributária'),
        custoVariavel: hip(800, 'exemplo didático'),
        parcelaGerencial: hip(1500, 'meta gerencial, não custo comprovado'),
        percentualReserva: 0.12,
        pagantes: 700,
      },
      {
        planoId: 'completo',
        nome: 'Completo',
        receitaBruta: hip(4990, 'hipótese de preço da seção 24.3'),
        deducoes: hip(790, 'valor agregado fictício da seção 34.7'),
        custoVariavel: hip(1200, 'exemplo didático'),
        parcelaGerencial: hip(2300, 'meta gerencial'),
        percentualReserva: 0.17,
        pagantes: 300,
      },
    ],
    programa: {
      custoEntregue: CUSTO_ENTREGUE_EXEMPLO,
      caixaLivrePorParticipante: hip(1000, 'suposição de caixa suficiente, como na tabela da seção 34.7'),
      patrocinioConfirmado: { centavos: 0, origem: 'observado', fonte: 'nenhum contrato de patrocínio existe' },
    },
    fixas: {
      custosFixosDoPeriodo: lacuna('folha, produção, ferramentas e infraestrutura não orçados'),
      orcamentoAquisicaoNoNumerador: null,
    },
  };
}

/** Cenário de estresse exigido pela seção 24.5: uso intensivo, frete maior, zero crescimento. */
export function cenarioEstresse(): Parameters<typeof simular>[0] {
  const base = cenarioBase();
  return {
    ...base,
    cenario: 'estresse — uso intensivo, frete maior, 100% de resgate elegível',
    planos: base.planos.map(p =>
      p.planoId === 'completo'
        ? { ...p, custoVariavel: hip(2700, 'cenário de uso intensivo da seção 34.7') }
        : { ...p, custoVariavel: hip(1400, 'uso acima da mediana') },
    ),
    programa: {
      ...base.programa,
      custoEntregue: { ...base.programa.custoEntregue, frete: hip(2700, 'frete de região distante, +R$10') },
    },
  };
}
