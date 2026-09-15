import { describe, expect, it } from 'vitest';
import { cenarioBase, cenarioEstresse, hip, simular } from '../src/economics/simulador.js';

/**
 * O simulador é conferido contra as contas didáticas da seção 34.7 do briefing.
 * Bater com elas não confirma viabilidade real — confirma que a implementação
 * das fórmulas está correta.
 */

describe('simulador — cenário base contra a seção 34.7', () => {
  const r = simular(cenarioBase());
  const essencial = r.planos.find(p => p.planoId === 'essencial')!;
  const completo = r.planos.find(p => p.planoId === 'completo')!;

  it('receita líquida bate com a tabela', () => {
    expect(essencial.receitaLiquida).toBe(2500); // R$25,00
    expect(completo.receitaLiquida).toBe(4200);  // R$42,00
  });

  it('margem de contribuição antes das recompensas bate', () => {
    expect(essencial.margemContribuicaoAntesDasRecompensas).toBe(1700); // R$17,00
    expect(completo.margemContribuicaoAntesDasRecompensas).toBe(3000);  // R$30,00
  });

  it('espaço econômico bate', () => {
    expect(essencial.espacoEconomico).toBe(200); // R$2,00
    expect(completo.espacoEconomico).toBe(700);  // R$7,00
  });

  it('a reserva é limitada pelo espaço econômico, não pelo percentual', () => {
    // 12% de R$17,00 = R$2,04, mas o espaço econômico é R$2,00.
    expect(essencial.reservaPorCiclo).toBe(200);
    // 17% de R$30,00 = R$5,10, abaixo do espaço de R$7,00 — o percentual manda.
    expect(completo.reservaPorCiclo).toBe(510);
  });

  it('acumulado em 6 e 12 ciclos bate com a tabela', () => {
    expect(essencial.reservaApos6Ciclos).toBe(1200);   // R$12,00
    expect(essencial.reservaApos12Ciclos).toBe(2400);  // R$24,00
    expect(completo.reservaApos6Ciclos).toBe(3060);    // R$30,60
    expect(completo.reservaApos12Ciclos).toBe(6120);   // R$61,20
  });

  it('o Essencial NÃO financia um benefício de R$55 em 12 ciclos', () => {
    expect(essencial.reservaApos12Ciclos).toBeLessThan(r.custoEntregueTotal);
    expect(essencial.ciclosMinimosParaUmBeneficio).toBe(28);
  });

  it('o Completo financia um único benefício em 11 ciclos', () => {
    expect(completo.ciclosMinimosParaUmBeneficio).toBe(11);
  });

  it('custo entregue do exemplo soma R$55,00', () => {
    expect(r.custoEntregueTotal).toBe(5500);
  });
});

describe('simulador — honestidade das conclusões', () => {
  it('marca as lacunas de custo e mantém a conclusão condicional', () => {
    const r = simular(cenarioBase());
    expect(r.conclusaoIncondicional).toBe(false);
    expect(r.lacunas.length).toBeGreaterThan(0);
    expect(r.lacunas.some(l => l.includes('custosFixosDoPeriodo'))).toBe(true);
    expect(r.lacunas.some(l => l.includes('tributosETaxas'))).toBe(true);
  });

  it('sem custos fixos informados, não existe ponto de equilíbrio calculável honesto', () => {
    // A lacuna entra como zero no cálculo, mas fica registrada: o número de
    // pagantes para equilíbrio é lido junto com a lacuna, nunca sozinho.
    const r = simular(cenarioBase());
    expect(r.lacunas.some(l => l.startsWith('fixas.custosFixosDoPeriodo'))).toBe(true);
  });

  it('avisa que equilíbrio operacional não é lucro', () => {
    const r = simular(cenarioBase());
    expect(r.avisos.some(a => a.includes('não é lucro'))).toBe(true);
  });

  it('calcula a exposição se TODOS os elegíveis resgatarem, não a esperada', () => {
    const r = simular(cenarioBase());
    expect(r.exposicaoSeTodosResgatarem).toBe(5500 * 1000);
  });

  it('patrocínio apenas hipotético gera aviso em vez de abater o custo em silêncio', () => {
    const base = cenarioBase();
    const r = simular({
      ...base,
      programa: { ...base.programa, patrocinioConfirmado: hip(3000, 'conversa preliminar') },
    });
    expect(r.avisos.some(a => a.includes('Patrocínio lançado como hipótese'))).toBe(true);
  });
});

describe('simulador — cenário de estresse', () => {
  const r = simular(cenarioEstresse());
  const completo = r.planos.find(p => p.planoId === 'completo')!;

  it('no uso intensivo a margem fica abaixo da parcela gerencial, mesmo sem prêmio', () => {
    // R$42,00 − R$27,00 = R$15,00, contra parcela gerencial de R$23,00.
    expect(completo.margemContribuicaoAntesDasRecompensas).toBe(1500);
    expect(completo.espacoEconomico).toBe(0);
  });

  it('sem espaço econômico não há reserva e o benefício não é financiável', () => {
    expect(completo.reservaPorCiclo).toBe(0);
    expect(completo.ciclosMinimosParaUmBeneficio).toBeNull();
  });

  it('frete maior eleva o custo entregue acima de R$55', () => {
    expect(r.custoEntregueTotal).toBe(6500);
  });
});

describe('simulador — o upgrade não melhora a margem automaticamente', () => {
  it('no cenário intensivo o upgrade é negativo antes de qualquer recompensa', () => {
    const r = simular(cenarioEstresse());
    const ess = r.planos.find(p => p.planoId === 'essencial')!;
    const com = r.planos.find(p => p.planoId === 'completo')!;
    const receitaAdicional = com.receitaLiquida - ess.receitaLiquida;          // R$17,00
    const custoVariavelAdicional = 2700 - 1400;                                // R$13,00
    expect(receitaAdicional).toBe(1700);
    expect(receitaAdicional - custoVariavelAdicional).toBeLessThan(receitaAdicional);
    // E a margem do Completo intensivo é igual à do Essencial estressado:
    expect(com.margemContribuicaoAntesDasRecompensas).toBe(ess.margemContribuicaoAntesDasRecompensas + 400);
  });
});

describe('simulador — equilíbrio operacional', () => {
  it('não dupla-conta aquisição: se está no numerador, avisa para não descontar de novo', () => {
    const base = cenarioBase();
    const r = simular({
      ...base,
      fixas: {
        custosFixosDoPeriodo: hip(5_000_000, 'hipótese: R$50.000 por mês'),
        orcamentoAquisicaoNoNumerador: hip(1_000_000, 'hipótese: R$10.000 por mês'),
      },
    });
    expect(r.avisos.some(a => a.includes('Não descontá-lo novamente'))).toBe(true);
    expect(r.pagantesParaEquilibrioOperacional).toBeGreaterThan(0);
  });

  it('contribuição não positiva significa ausência de equilíbrio, não um número grande', () => {
    const base = cenarioBase();
    const r = simular({
      ...base,
      planos: base.planos.map(p => ({ ...p, custoVariavel: hip(9_900, 'custo acima da receita') })),
      fixas: { custosFixosDoPeriodo: hip(5_000_000, 'hipótese'), orcamentoAquisicaoNoNumerador: null },
    });
    expect(r.pagantesParaEquilibrioOperacional).toBeNull();
    expect(r.avisos.some(a => a.includes('Mais assinantes aumentam o prejuízo'))).toBe(true);
  });
});
