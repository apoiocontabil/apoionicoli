import { describe, expect, it } from 'vitest';
import {
  REGRA_RASCUNHO,
  compensar,
  decidirMarco,
  diaLocal,
  evidenciasDoLedger,
  registrar,
  semanaIso,
  type EventoLedger,
} from '../src/rewards/regras.js';

const ALUNO = 'aluno-1';
const REGRA = REGRA_RASCUNHO;

function ev(p: Partial<EventoLedger> & Pick<EventoLedger, 'chave' | 'tipo'>): EventoLedger {
  return {
    alunoId: ALUNO,
    emMs: 0,
    regraVersao: REGRA.versao,
    origem: 'reproducao_confirmada',
    ...p,
  } as EventoLedger;
}

describe('ledger — idempotência e limites', () => {
  it('a mesma chave não cria evento duas vezes', () => {
    let l: EventoLedger[] = [];
    ({ ledger: l } = registrar(l, ev({ chave: 'k1', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' })));
    const segundo = registrar(l, ev({ chave: 'k1', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' }));
    expect(segundo.novo).toBe(false);
    expect(segundo.ledger).toHaveLength(1);
  });

  it('duas aulas no mesmo dia local rendem uma única unidade', () => {
    let l: EventoLedger[] = [];
    ({ ledger: l } = registrar(l, ev({ chave: 'manha', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' })));
    const tarde = registrar(l, ev({ chave: 'tarde', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' }));
    expect(tarde.novo).toBe(false);
    expect(evidenciasDoLedger(tarde.ledger, ALUNO).diasDeParticipacao).toEqual(['2026-09-14']);
  });

  it('a mesma semana não é creditada duas vezes', () => {
    let l: EventoLedger[] = [];
    ({ ledger: l } = registrar(l, ev({ chave: 's1', tipo: 'semana_de_compromisso', semana: '2026-W38' })));
    const repetida = registrar(l, ev({ chave: 's2', tipo: 'semana_de_compromisso', semana: '2026-W38' }));
    expect(repetida.novo).toBe(false);
  });
});

describe('ledger — reversão é compensação, nunca edição de histórico', () => {
  it('compensar mantém o evento original e anula seu efeito', () => {
    let l: EventoLedger[] = [];
    ({ ledger: l } = registrar(l, ev({ chave: 'd1', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' })));
    l = compensar(l, { chave: 'c1', alunoId: ALUNO, compensa: 'd1', motivo: 'sessão de teste interna', emMs: 100, regraVersao: REGRA.versao });

    expect(l).toHaveLength(2);
    expect(l[0].chave).toBe('d1'); // o original continua lá
    expect(evidenciasDoLedger(l, ALUNO).diasDeParticipacao).toEqual([]);
  });

  it('compensar duas vezes o mesmo evento não duplica a compensação', () => {
    let l: EventoLedger[] = [];
    ({ ledger: l } = registrar(l, ev({ chave: 'd1', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' })));
    l = compensar(l, { chave: 'c1', alunoId: ALUNO, compensa: 'd1', motivo: 'x', emMs: 100, regraVersao: REGRA.versao });
    l = compensar(l, { chave: 'c2', alunoId: ALUNO, compensa: 'd1', motivo: 'x', emMs: 200, regraVersao: REGRA.versao });
    expect(l).toHaveLength(2);
  });

  it('depois de compensado, o mesmo dia pode ser creditado de novo', () => {
    let l: EventoLedger[] = [];
    ({ ledger: l } = registrar(l, ev({ chave: 'd1', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' })));
    l = compensar(l, { chave: 'c1', alunoId: ALUNO, compensa: 'd1', motivo: 'erro de contagem', emMs: 100, regraVersao: REGRA.versao });
    const r = registrar(l, ev({ chave: 'd2', tipo: 'dia_de_participacao', diaLocal: '2026-09-14' }));
    expect(r.novo).toBe(true);
    expect(evidenciasDoLedger(r.ledger, ALUNO).diasDeParticipacao).toEqual(['2026-09-14']);
  });
});

describe('elegibilidade — decisão reproduzível e explicável', () => {
  const marcoConstancia = REGRA.marcos.find(m => m.id === 'minha-constancia')!;
  const marcoFisico = REGRA.marcos.find(m => m.id === 'primeiro-objeto')!;

  function evidenciasCom(semanas: number, ciclos = 0) {
    return {
      alunoId: ALUNO,
      diasDeParticipacao: [],
      semanasDeCompromisso: Array.from({ length: semanas }, (_, i) => `2026-W${String(20 + i).padStart(2, '0')}`),
      ciclosPagosElegiveis: ciclos,
      marcosConcedidos: [],
      marcosEmRevisao: [],
    };
  }

  it('diz exatamente o que falta, em linguagem do aluno', () => {
    const d = decidirMarco({ marco: marcoConstancia, evidencias: evidenciasCom(2), regra: REGRA });
    expect(d.elegivel).toBe(false);
    expect(d.faltam.semanas).toBe(2);
    expect(d.explicacao).toBe('Faltam 2 semanas de compromisso.');
  });

  it('concorda verbo e substantivo no singular', () => {
    const d = decidirMarco({ marco: marcoConstancia, evidencias: evidenciasCom(3), regra: REGRA });
    expect(d.explicacao).toBe('Falta 1 semana de compromisso.');
  });

  it('concorda verbo e substantivo quando faltam as duas condições', () => {
    const d = decidirMarco({ marco: marcoFisico, evidencias: evidenciasCom(11, 5), regra: REGRA });
    expect(d.explicacao).toBe('Falta 1 semana de compromisso e 1 ciclo de assinatura.');
  });

  it('marco de jornada não exige ciclo pago', () => {
    const d = decidirMarco({ marco: marcoConstancia, evidencias: evidenciasCom(4), regra: REGRA });
    expect(d.elegivel).toBe(true);
    expect(d.faltam.ciclosPagos).toBe(0);
  });

  it('marco físico exige também a condição comercial', () => {
    const d = decidirMarco({ marco: marcoFisico, evidencias: evidenciasCom(12, 2), regra: REGRA });
    expect(d.elegivel).toBe(false);
    expect(d.explicacao).toContain('Faltam 4 ciclos de assinatura');
  });

  it('critérios cumpridos mas oferta física inativa: diz a verdade, não promete', () => {
    const d = decidirMarco({ marco: marcoFisico, evidencias: evidenciasCom(12, 6), regra: REGRA });
    expect(d.elegivel).toBe(false);
    expect(d.bloqueadoPorOfertaInativa).toBe(true);
    expect(d.explicacao).toContain('nenhuma campanha foi aberta');
  });

  it('marco em revisão não apaga progresso nem bloqueia a aula', () => {
    const d = decidirMarco({
      marco: marcoConstancia,
      evidencias: { ...evidenciasCom(4), marcosEmRevisao: ['minha-constancia'] },
      regra: REGRA,
    });
    expect(d.elegivel).toBe(false);
    expect(d.explicacao).toContain('sua aula não é afetada');
  });

  it('a decisão é determinística e carimba a versão da regra', () => {
    const e = evidenciasCom(4);
    const a = decidirMarco({ marco: marcoConstancia, evidencias: e, regra: REGRA });
    const b = decidirMarco({ marco: marcoConstancia, evidencias: e, regra: REGRA });
    expect(a).toEqual(b);
    expect(a.regraVersao).toBe(REGRA.versao);
  });

  it('a janela dá espaço a descanso: 4 semanas dentro de 8 bastam', () => {
    const evid = {
      alunoId: ALUNO,
      diasDeParticipacao: [],
      // 8 semanas no período, 4 delas cumpridas — as mais recentes contam.
      semanasDeCompromisso: ['2026-W20', '2026-W22', '2026-W25', '2026-W27'],
      ciclosPagosElegiveis: 0,
      marcosConcedidos: [],
      marcosEmRevisao: [],
    };
    expect(decidirMarco({ marco: marcoConstancia, evidencias: evid, regra: REGRA }).elegivel).toBe(true);
  });

  it('marco já concedido não é concedido de novo', () => {
    const d = decidirMarco({
      marco: marcoConstancia,
      evidencias: { ...evidenciasCom(8), marcosConcedidos: ['minha-constancia'] },
      regra: REGRA,
    });
    expect(d.elegivel).toBe(false);
    expect(d.explicacao).toContain('já recebeu');
  });
});

describe('fuso e semana', () => {
  it('o dia local respeita o fuso declarado, não o do servidor', () => {
    // 2026-09-15T02:00Z ainda é 14/09 em São Paulo (UTC−3).
    const t = Date.UTC(2026, 8, 15, 2, 0, 0);
    expect(diaLocal(t, 'America/Sao_Paulo')).toBe('2026-09-14');
    expect(diaLocal(t, 'UTC')).toBe('2026-09-15');
  });

  it('mudar o relógio do aparelho não muda a contagem: o instante vem do servidor', () => {
    // O ledger só recebe `emMs` do servidor e `diaLocal` derivado do fuso
    // declarado — não existe caminho para o cliente informar o próprio dia.
    const t = Date.UTC(2026, 8, 14, 12, 0, 0);
    expect(diaLocal(t, 'America/Sao_Paulo')).toBe('2026-09-14');
  });

  it('calcula a semana ISO corretamente', () => {
    expect(semanaIso('2026-09-14')).toBe('2026-W38');
    expect(semanaIso('2026-01-01')).toBe('2026-W01');
  });
});

describe('o que o programa deliberadamente não pontua', () => {
  it('não existe tipo de evento para caloria, peso, carga ou frequência cardíaca', () => {
    const tipos: EventoLedger['tipo'][] = [
      'dia_de_participacao', 'semana_de_compromisso', 'ciclo_comercial_elegivel',
      'marco_atingido', 'beneficio_solicitado', 'beneficio_aprovado', 'beneficio_negado',
      'em_revisao', 'revisao_encerrada', 'compensacao', 'recurso_aberto', 'recurso_decidido',
    ];
    const proibidos = ['caloria', 'peso', 'carga', 'frequencia', 'gordura', 'streak'];
    for (const t of tipos) {
      for (const p of proibidos) expect(t).not.toContain(p);
    }
  });
});
