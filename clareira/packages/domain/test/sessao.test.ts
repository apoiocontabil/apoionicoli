import { describe, expect, it } from 'vitest';
import { aplicar, criarSessao, reconciliar, respostaAindaValida, resumir } from '../src/session/maquina.js';
import { cobertura, fracaoCoberta, unir } from '../src/session/intervalos.js';
import type { Comando, EstadoSessao, VersaoAula } from '../src/session/tipos.js';

/**
 * Testes discriminantes dos dez invariantes da seção 15 do briefing.
 * Cada teste falha por um motivo específico: nenhum deles passa por acidente
 * se o motor estiver errado.
 */

const AULA: VersaoAula = {
  aulaId: 'aula-forca-pernas',
  versao: 3,
  midiaId: 'm1',
  duracaoMs: 720_000,
  etapas: [
    { id: 'e0', tipo: 'preparacao', rotulo: 'Preparação', inicioMs: 0, fimMs: 60_000, creditavel: false },
    { id: 'e1', tipo: 'demonstracao', rotulo: 'Agachamento — demonstração', inicioMs: 60_000, fimMs: 120_000, exercicioId: 'agachamento', creditavel: false },
    { id: 'e2', tipo: 'serie', rotulo: 'Agachamento — série 1', inicioMs: 120_000, fimMs: 240_000, exercicioId: 'agachamento', creditavel: true, alternativas: ['e2a'] },
    { id: 'e2a', tipo: 'alternativa', rotulo: 'Agachamento com apoio', inicioMs: 240_000, fimMs: 360_000, exercicioId: 'agachamento-apoio', creditavel: true },
    { id: 'e3', tipo: 'descanso', rotulo: 'Descanso', inicioMs: 360_000, fimMs: 420_000, duracaoPrescritaMs: 60_000, creditavel: false },
    { id: 'e4', tipo: 'serie', rotulo: 'Afundo — série 1', inicioMs: 420_000, fimMs: 600_000, exercicioId: 'afundo', creditavel: true },
    { id: 'e5', tipo: 'encerramento', rotulo: 'Desaceleração', inicioMs: 600_000, fimMs: 720_000, creditavel: false },
  ],
};

const DISPOSITIVO = 'tv-sala';
let seq = 0;
function cmd(tipo: Comando['tipo'], emMs: number, carga?: Record<string, unknown>, extra?: Partial<Comando>): Comando {
  return { id: `c${++seq}`, tipo, sessaoId: 's1', emMs, dispositivoId: DISPOSITIVO, carga, ...extra };
}

function nova(emMs = 0): EstadoSessao {
  return criarSessao({ id: 's1', alunoId: 'aluno-1', aula: AULA, dispositivoId: DISPOSITIVO, emMs });
}

/** Reproduz continuamente de `de` a `ate` em passos de 1s, a partir de `t0`. */
function reproduzir(estado: EstadoSessao, de: number, ate: number, t0: number): EstadoSessao {
  let e = estado;
  let relogio = t0;
  for (let p = de + 1000; p <= ate; p += 1000) {
    relogio += 1000;
    e = aplicar(e, cmd('progresso_midia', relogio, { posicaoMs: p }), AULA).estado;
  }
  return e;
}

describe('intervalos de reprodução', () => {
  it('une trechos sobrepostos e contíguos', () => {
    expect(unir([{ inicioMs: 0, fimMs: 10 }, { inicioMs: 5, fimMs: 20 }, { inicioMs: 40, fimMs: 50 }]))
      .toEqual([{ inicioMs: 0, fimMs: 20 }, { inicioMs: 40, fimMs: 50 }]);
  });

  it('não conta duas vezes o trecho assistido duas vezes', () => {
    const trechos = [{ inicioMs: 0, fimMs: 100 }, { inicioMs: 0, fimMs: 100 }];
    expect(cobertura(trechos, { inicioMs: 0, fimMs: 100 })).toBe(100);
  });

  it('mede fração coberta de um alvo parcialmente reproduzido', () => {
    expect(fracaoCoberta([{ inicioMs: 0, fimMs: 50 }], { inicioMs: 0, fimMs: 100 })).toBe(0.5);
  });
});

describe('[INV 1] pausa interrompe ações temporizadas dependentes', () => {
  it('tempo em pausa não vira tempo ativo', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 1_000), AULA).estado;
    e = aplicar(e, cmd('progresso_midia', 11_000, { posicaoMs: 10_000 }), AULA).estado;
    const ativoAntes = e.relogios.ativoMs;

    e = aplicar(e, cmd('pausar', 11_000), AULA).estado;
    // 60 segundos parados
    e = aplicar(e, cmd('progresso_midia', 71_000, { posicaoMs: 10_000 }), AULA).estado;

    expect(e.relogios.ativoMs).toBe(ativoAntes);
    expect(e.relogios.pausadoMs).toBe(60_000);
    expect(e.midia).toBe('pausada');
  });

  it('retomar devolve exatamente o estado anterior e não liga a mídia sozinha', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 100), AULA).estado; // e1 demonstração
    e = aplicar(e, cmd('avancar_etapa', 200), AULA).estado; // e2 série → exercitando
    expect(e.estado).toBe('exercitando');

    e = aplicar(e, cmd('pausar', 300), AULA).estado;
    e = aplicar(e, cmd('retomar', 400), AULA).estado;

    expect(e.estado).toBe('exercitando');
    expect(e.midia).toBe('pausada'); // a pessoa escolhe recomeçar
  });
});

describe('[INV 2] buffering não faz o cronômetro avançar como instrução reproduzida', () => {
  it('tempo em buffering vai para bufferingMs, nunca para ativoMs', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    e = aplicar(e, cmd('progresso_midia', 5_000, { posicaoMs: 5_000 }), AULA).estado;
    expect(e.relogios.ativoMs).toBe(5_000);

    e = aplicar(e, cmd('buffering_inicio', 5_000), AULA).estado;
    e = aplicar(e, cmd('buffering_fim', 20_000), AULA).estado;

    expect(e.relogios.ativoMs).toBe(5_000);
    expect(e.relogios.bufferingMs).toBe(15_000);
    expect(e.midia).toBe('reproduzindo');
  });

  it('buffering durante pausa volta para pausada, não para reproduzindo', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    e = aplicar(e, cmd('pausar', 1_000), AULA).estado;
    e = aplicar(e, cmd('buffering_inicio', 1_100), AULA).estado;
    e = aplicar(e, cmd('buffering_fim', 2_000), AULA).estado;
    expect(e.midia).toBe('pausada');
    expect(e.estado).toBe('pausado');
  });
});

describe('[INV 3] pular trecho não credita execução pulada', () => {
  it('reproduzir a série inteira credita a etapa', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    e = aplicar(e, cmd('seek', 10, { posicaoMs: 120_000 }), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 20), AULA).estado;
    e = reproduzir(e, 120_000, 240_000, 1_000);

    expect(e.etapasCreditadas).toContain('e2');
  });

  it('saltar por cima da série NÃO credita', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    // Salta do início direto para depois da série.
    const r = aplicar(e, cmd('seek', 1_000, { posicaoMs: 240_000 }), AULA);
    e = r.estado;

    expect(e.etapasCreditadas).not.toContain('e2');
    expect(e.trechosReproduzidos).toHaveLength(0);
  });

  it('avanço implausível de posição não vira trecho reproduzido', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    // 100 s de mídia em 1 s de relógio: não é reprodução, é salto.
    e = aplicar(e, cmd('progresso_midia', 1_000, { posicaoMs: 100_000 }), AULA).estado;
    expect(e.trechosReproduzidos).toHaveLength(0);
  });

  it('assistir duas vezes metade da série continua não creditando', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    e = aplicar(e, cmd('seek', 10, { posicaoMs: 120_000 }), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 20), AULA).estado;
    e = reproduzir(e, 120_000, 180_000, 1_000);
    e = aplicar(e, cmd('seek', 200_000, { posicaoMs: 120_000 }), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 200_100), AULA).estado;
    e = reproduzir(e, 120_000, 180_000, 200_200);

    expect(e.etapasCreditadas).not.toContain('e2');
  });

  it('seek recalcula o contexto e incrementa a revisão da etapa', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const revisaoAntes = e.etapaRevisao;
    e = aplicar(e, cmd('seek', 100, { posicaoMs: 430_000 }), AULA).estado;
    expect(e.etapaIndice).toBe(AULA.etapas.findIndex(x => x.id === 'e4'));
    expect(e.etapaRevisao).toBe(revisaoAntes + 1);
  });
});

describe('[INV 4] retomada e conclusão são idempotentes', () => {
  it('o mesmo comando aplicado duas vezes não muda nada na segunda', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const c = cmd('registrar_serie', 1_000, { etapaId: 'e2', repeticoesRealizadas: 12, origem: 'autodeclarado' });

    const r1 = aplicar(e, c, AULA);
    const r2 = aplicar(r1.estado, c, AULA);

    expect(r1.estado.series).toHaveLength(1);
    expect(r2.estado.series).toHaveLength(1);
    expect(r2.estado.versao).toBe(r1.estado.versao);
    expect(r2.eventos[0].detalhe?.motivo).toBe('duplicado');
  });

  it('concluir duas vezes não duplica histórico nem muda o instante final', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const c = cmd('concluir', 10_000);
    const r1 = aplicar(e, c, AULA);
    const r2 = aplicar(r1.estado, c, AULA);
    const r3 = aplicar(r2.estado, cmd('concluir', 20_000), AULA);

    expect(r1.estado.finalizadaEmMs).toBe(10_000);
    expect(r3.estado.finalizadaEmMs).toBe(10_000);
    expect(r3.estado.motivoFinal).toBe('completa');
  });

  it('sessão finalizada recusa progressão com a versão atual para reconciliar', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('concluir', 1_000), AULA).estado;
    const r = aplicar(e, cmd('avancar_etapa', 2_000), AULA);
    expect(r.recusa?.codigo).toBe('sessao_finalizada');
    expect(r.recusa?.versaoAtual).toBe(e.versao);
    expect(r.estado).toBe(e);
  });
});

describe('[INV 5] resposta atrasada não altera etapa já encerrada', () => {
  it('carimbo de contexto obsoleto é invalidado', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const carimbo = { etapaIndice: e.etapaIndice, etapaRevisao: e.etapaRevisao };
    expect(respostaAindaValida(e, carimbo)).toBe(true);

    e = aplicar(e, cmd('rever_explicacao', 1_000), AULA).estado;
    expect(respostaAindaValida(e, carimbo)).toBe(false);
  });

  it('nenhuma resposta vale depois da sessão finalizada', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const carimbo = { etapaIndice: e.etapaIndice, etapaRevisao: e.etapaRevisao };
    e = aplicar(e, cmd('concluir', 1_000), AULA).estado;
    expect(respostaAindaValida(e, carimbo)).toBe(false);
  });
});

describe('[INV 6] reentrada no enquadramento não inicia esforço automaticamente', () => {
  it('presença incerta não pausa sozinha e confirmar retorno espera a escolha', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 10), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 20), AULA).estado;
    expect(e.estado).toBe('exercitando');

    e = aplicar(e, cmd('presenca_incerta', 1_000, { confianca: 0.42 }), AULA).estado;
    expect(e.estado).toBe('ausencia_possivel');

    e = aplicar(e, cmd('confirmar_retorno', 5_000), AULA).estado;
    expect(e.estado).toBe('aguardando_retorno');
    expect(e.midia).toBe('pausada');

    e = aplicar(e, cmd('retomar', 6_000), AULA).estado;
    expect(e.estado).toBe('exercitando');
    expect(e.midia).toBe('pausada');
  });

  it('tempo em ausência possível não acumula em nenhum relógio', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    e = aplicar(e, cmd('presenca_incerta', 1_000), AULA).estado;
    const antes = { ...e.relogios };
    e = aplicar(e, cmd('confirmar_retorno', 61_000), AULA).estado;

    expect(e.relogios.ativoMs).toBe(antes.ativoMs);
    expect(e.relogios.descansoMs).toBe(antes.descansoMs);
    expect(e.relogios.pausadoMs).toBe(antes.pausadoMs);
  });
});

describe('[INV 7] transição visual não concede progresso', () => {
  it('nenhum comando de animação existe no motor; só eventos de domínio creditam', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    // Avançar etapa é navegação de contexto, não execução.
    e = aplicar(e, cmd('avancar_etapa', 100), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 200), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 300), AULA).estado;
    expect(e.etapasCreditadas).toHaveLength(0);
  });
});

describe('[INV 8 e 9] a sessão está presa a uma versão imutável de conteúdo', () => {
  it('comando com outra versão da aula é recusado', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const aulaEditada: VersaoAula = { ...AULA, versao: 4, etapas: AULA.etapas.slice(0, 3) };
    const r = aplicar(e, cmd('avancar_etapa', 1_000), aulaEditada);

    expect(r.recusa?.codigo).toBe('carga_invalida');
    expect(r.estado.etapaIndice).toBe(e.etapaIndice);
  });
});

describe('[INV 10] trocar de dispositivo não perde progresso confirmado', () => {
  it('versão conflitante é recusada com a versão atual, sem sobrescrever', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const r = aplicar(e, cmd('pausar', 1_000, undefined, { versaoEsperada: e.versao - 1 }), AULA);
    expect(r.recusa?.codigo).toBe('versao_conflitante');
    expect(r.recusa?.versaoAtual).toBe(e.versao);
  });

  it('reconciliar mantém a união dos créditos quando o local está à frente', () => {
    const base = nova(0);
    const local: EstadoSessao = { ...base, versao: 9, etapasCreditadas: ['e2'], trechosReproduzidos: [{ inicioMs: 120_000, fimMs: 240_000 }] };
    const servidor: EstadoSessao = { ...base, versao: 7, etapasCreditadas: ['e4'], trechosReproduzidos: [{ inicioMs: 420_000, fimMs: 600_000 }] };

    const juntos = reconciliar(local, servidor);
    expect(juntos.etapasCreditadas.sort()).toEqual(['e2', 'e4']);
    expect(juntos.trechosReproduzidos).toHaveLength(2);
  });

  it('servidor mais novo vence o local', () => {
    const base = nova(0);
    const local: EstadoSessao = { ...base, versao: 3 };
    const servidor: EstadoSessao = { ...base, versao: 11, estado: 'concluido' };
    expect(reconciliar(local, servidor).estado).toBe('concluido');
  });

  it('outro dispositivo não comanda a sessão de quem está no controle', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const doCelular: Comando = { id: 'x1', tipo: 'pausar', sessaoId: 's1', emMs: 1_000, dispositivoId: 'celular-de-outra-conta' };
    const r = aplicar(e, doCelular, AULA);
    expect(r.recusa?.codigo).toBe('controlador_nao_autorizado');
  });
});

describe('alternativas e registro', () => {
  it('só aceita alternativa aprovada para a etapa', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 10), AULA).estado;
    e = aplicar(e, cmd('avancar_etapa', 20), AULA).estado; // e2, que permite e2a

    const boa = aplicar(e, cmd('trocar_alternativa', 100, { etapaId: 'e2a' }), AULA);
    expect(boa.recusa).toBeUndefined();
    // Trocar alternativa move mídia e contexto de verdade, não só o rótulo.
    expect(boa.estado.relogios.posicaoMidiaMs).toBe(240_000);

    const ruim = aplicar(e, cmd('trocar_alternativa', 200, { etapaId: 'e4' }), AULA);
    expect(ruim.recusa?.codigo).toBe('carga_invalida');
  });

  it('origem do registro é obrigatória e distingue reprodução de autodeclarado', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    const ruim = aplicar(e, cmd('registrar_serie', 100, { etapaId: 'e2', origem: 'chutado' }), AULA);
    expect(ruim.recusa?.codigo).toBe('carga_invalida');

    e = aplicar(e, cmd('registrar_serie', 200, { etapaId: 'e2', origem: 'sensor', repeticoesRealizadas: 11 }), AULA).estado;
    e = aplicar(e, cmd('registrar_serie', 300, { etapaId: 'e2', origem: 'autodeclarado', repeticoesRealizadas: 12 }), AULA).estado;
    expect(resumir(e, AULA).seriesPorOrigem).toEqual({ sensor: 1, autodeclarado: 1 });
  });
});

describe('resumo verdadeiro da sessão', () => {
  it('encerrar parcialmente salva o que ocorreu sem fingir conclusão total', () => {
    let e = nova(0);
    e = aplicar(e, cmd('iniciar', 0), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 0), AULA).estado;
    e = aplicar(e, cmd('seek', 10, { posicaoMs: 120_000 }), AULA).estado;
    e = aplicar(e, cmd('reproduzir', 20), AULA).estado;
    e = reproduzir(e, 120_000, 240_000, 1_000);
    e = aplicar(e, cmd('encerrar_parcial', 500_000), AULA).estado;

    const r = resumir(e, AULA);
    expect(r.completa).toBe(false);
    expect(r.etapasCreditadas).toBe(1);
    expect(r.etapasCreditaveis).toBe(3);
    expect(r.tempoAtivoMs).toBeGreaterThan(0);
  });

  it('o motor é determinístico: mesma sequência produz o mesmo estado', () => {
    const comandos: Comando[] = [
      { id: 'a', tipo: 'iniciar', sessaoId: 's1', emMs: 0, dispositivoId: DISPOSITIVO },
      { id: 'b', tipo: 'reproduzir', sessaoId: 's1', emMs: 100, dispositivoId: DISPOSITIVO },
      { id: 'c', tipo: 'progresso_midia', sessaoId: 's1', emMs: 1_100, dispositivoId: DISPOSITIVO, carga: { posicaoMs: 1_000 } },
      { id: 'd', tipo: 'pausar', sessaoId: 's1', emMs: 2_000, dispositivoId: DISPOSITIVO },
      { id: 'e', tipo: 'retomar', sessaoId: 's1', emMs: 3_000, dispositivoId: DISPOSITIVO },
    ];
    const rodar = () => comandos.reduce((acc, c) => aplicar(acc, c, AULA).estado, nova(0));
    expect(JSON.stringify(rodar())).toBe(JSON.stringify(rodar()));
  });
});
