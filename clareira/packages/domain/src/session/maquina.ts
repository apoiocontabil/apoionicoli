import { COBERTURA_MINIMA_PARA_CREDITO, fracaoCoberta, unir } from './intervalos.js';
import type {
  Comando,
  EstadoDominio,
  EstadoSessao,
  Etapa,
  Evento,
  Resultado,
  VersaoAula,
} from './tipos.js';

/**
 * Motor de sessão determinístico.
 *
 * `aplicar` é uma função pura: mesmo estado + mesmo comando = mesmo resultado.
 * Não lê relógio do sistema, não faz I/O e não conhece interface. O instante
 * vem SEMPRE de `comando.emMs`, carimbado pelo servidor — o relógio local do
 * cliente não é autoridade (seção 34.4, item 2: relógio alterado não gera
 * unidades extras).
 *
 * Os dez invariantes da seção 15 estão marcados no código como [INV n].
 */

/** Estados em que a sessão não aceita mais comandos de progressão. */
const FINAIS: EstadoDominio[] = ['concluido', 'encerrado_parcial'];

/** Estados de domínio em que o tempo conta como esforço ativo. */
const ESTADOS_ATIVOS: EstadoDominio[] = ['exercitando', 'demonstrando'];

export function criarSessao(params: {
  id: string;
  alunoId: string;
  aula: VersaoAula;
  dispositivoId: string;
  emMs: number;
}): EstadoSessao {
  return {
    id: params.id,
    alunoId: params.alunoId,
    aulaId: params.aula.aulaId,
    aulaVersao: params.aula.versao,
    estado: 'preparando',
    estadoRetomada: null,
    midia: 'ociosa',
    etapaIndice: 0,
    etapaRevisao: 0,
    relogios: { ativoMs: 0, descansoMs: 0, pausadoMs: 0, bufferingMs: 0, posicaoMidiaMs: 0 },
    trechosReproduzidos: [],
    etapasCreditadas: [],
    series: [],
    versao: 1,
    controladorId: params.dispositivoId,
    comandosAplicados: [],
    ultimoInstanteMs: params.emMs,
    iniciadaEmMs: params.emMs,
    finalizadaEmMs: null,
    motivoFinal: null,
  };
}

function etapaAtual(aula: VersaoAula, estado: EstadoSessao): Etapa | undefined {
  return aula.etapas[estado.etapaIndice];
}

/**
 * Avança os relógios do intervalo desde o último comando, atribuindo o tempo ao
 * estado em que a sessão REALMENTE esteve.
 *
 * [INV 1] Em pausa, o tempo vai para `pausadoMs` — nenhuma ação temporizada
 *         dependente avança.
 * [INV 2] Em buffering, o tempo vai para `bufferingMs` e NUNCA para `ativoMs`:
 *         o cronômetro não avança como se a instrução tivesse sido reproduzida.
 */
function avancarRelogios(estado: EstadoSessao, ateMs: number): EstadoSessao {
  const delta = Math.max(0, ateMs - estado.ultimoInstanteMs);
  if (delta === 0) return { ...estado, ultimoInstanteMs: ateMs };

  const r = { ...estado.relogios };

  if (estado.midia === 'buffering') {
    r.bufferingMs += delta;
  } else if (estado.estado === 'pausado') {
    r.pausadoMs += delta;
  } else if (estado.estado === 'descansando') {
    r.descansoMs += delta;
  } else if (ESTADOS_ATIVOS.includes(estado.estado)) {
    // Só conta como ativo se a mídia estava de fato reproduzindo. Uma aula
    // parada na tela com o vídeo em erro não acumula esforço.
    if (estado.midia === 'reproduzindo') r.ativoMs += delta;
  }
  // 'ausencia_possivel' e 'aguardando_retorno' não acumulam em nenhum relógio:
  // não sabemos o que aconteceu, e inventar um número seria pior que a lacuna.

  return { ...estado, relogios: r, ultimoInstanteMs: ateMs };
}

function evento(tipo: Evento['tipo'], emMs: number, detalhe?: Record<string, unknown>): Evento {
  return detalhe ? { tipo, emMs, detalhe } : { tipo, emMs };
}

/**
 * Credita as etapas creditáveis cuja cobertura de reprodução atingiu o mínimo.
 *
 * [INV 3] Pular trecho não credita a execução pulada: o crédito olha para os
 *         trechos realmente reproduzidos, não para a posição alcançada.
 * [INV 7] Transição visual não concede progresso: nada aqui depende de animação.
 */
function creditarEtapas(estado: EstadoSessao, aula: VersaoAula, emMs: number): { estado: EstadoSessao; eventos: Evento[] } {
  const eventos: Evento[] = [];
  const creditadas = new Set(estado.etapasCreditadas);

  for (const etapa of aula.etapas) {
    if (!etapa.creditavel || creditadas.has(etapa.id)) continue;
    const fracao = fracaoCoberta(estado.trechosReproduzidos, { inicioMs: etapa.inicioMs, fimMs: etapa.fimMs });
    if (fracao >= COBERTURA_MINIMA_PARA_CREDITO) {
      creditadas.add(etapa.id);
      eventos.push(evento('etapa_creditada', emMs, { etapaId: etapa.id, fracao: Number(fracao.toFixed(4)) }));
    }
  }

  if (eventos.length === 0) return { estado, eventos };
  return { estado: { ...estado, etapasCreditadas: [...creditadas] }, eventos };
}

function recusar(estado: EstadoSessao, codigo: NonNullable<Resultado['recusa']>['codigo'], mensagem: string): Resultado {
  return {
    estado,
    eventos: [evento('comando_ignorado', estado.ultimoInstanteMs, { codigo, mensagem })],
    recusa: { codigo, mensagem, versaoAtual: estado.versao },
  };
}

/**
 * Aplica um comando à sessão.
 *
 * [INV 4] Idempotente por `comando.id`: cliques, reenvios e retries duplicados
 *         não duplicam séries, histórico ou estatísticas.
 * [INV 10] Concorrência otimista por `versaoEsperada`: um comando obsoleto de
 *          outro dispositivo é recusado com a versão atual, para o cliente
 *          reconciliar em vez de sobrescrever dado mais novo.
 */
export function aplicar(estado: EstadoSessao, comando: Comando, aula: VersaoAula): Resultado {
  // [INV 9] A sessão está presa a uma versão imutável de conteúdo. Aplicar um
  // comando com outra versão de aula seria reescrever a história.
  if (aula.aulaId !== estado.aulaId || aula.versao !== estado.aulaVersao) {
    return recusar(
      estado,
      'carga_invalida',
      `sessão está presa à aula ${estado.aulaId} v${estado.aulaVersao}; recebida ${aula.aulaId} v${aula.versao}`,
    );
  }

  // [INV 4] Idempotência: devolve o estado atual, sem reaplicar nem falhar.
  if (estado.comandosAplicados.includes(comando.id)) {
    return { estado, eventos: [evento('comando_ignorado', comando.emMs, { motivo: 'duplicado', comandoId: comando.id })] };
  }

  if (FINAIS.includes(estado.estado)) {
    // Concluir de novo é idempotente por natureza; qualquer outra progressão não.
    if (comando.tipo === 'concluir' || comando.tipo === 'encerrar_parcial') {
      return { estado, eventos: [evento('comando_ignorado', comando.emMs, { motivo: 'ja_finalizada' })] };
    }
    return recusar(estado, 'sessao_finalizada', 'a sessão já foi finalizada');
  }

  if (comando.versaoEsperada !== undefined && comando.versaoEsperada !== estado.versao) {
    return recusar(
      estado,
      'versao_conflitante',
      `comando esperava versão ${comando.versaoEsperada}, estado está em ${estado.versao}`,
    );
  }

  // Comandos que mudam a sessão só valem do controlador ativo. Consultar não
  // exige controle; comandar, sim (seção 22.4).
  const comandosDeControle: Comando['tipo'][] = ['pausar', 'retomar', 'avancar_etapa', 'seek', 'trocar_alternativa', 'concluir', 'encerrar_parcial'];
  if (
    comandosDeControle.includes(comando.tipo) &&
    estado.controladorId !== null &&
    estado.controladorId !== comando.dispositivoId
  ) {
    return recusar(estado, 'controlador_nao_autorizado', `dispositivo ${comando.dispositivoId} não é o controlador ativo`);
  }

  let e = avancarRelogios(estado, comando.emMs);
  const eventos: Evento[] = [];
  const etapa = etapaAtual(aula, e);

  switch (comando.tipo) {
    case 'iniciar': {
      if (e.estado !== 'preparando') return recusar(estado, 'transicao_invalida', 'só é possível iniciar a partir de "preparando"');
      const proxima = aula.etapas[0];
      e = {
        ...e,
        estado: proxima?.tipo === 'demonstracao' ? 'demonstrando' : 'exercitando',
        midia: 'carregando',
        etapaIndice: 0,
      };
      eventos.push(evento('sessao_iniciada', comando.emMs, { aulaId: aula.aulaId, versao: aula.versao }));
      eventos.push(evento('estado_mudou', comando.emMs, { de: 'preparando', para: e.estado }));
      break;
    }

    case 'reproduzir': {
      if (e.estado === 'pausado') return recusar(estado, 'transicao_invalida', 'use "retomar" para sair da pausa');
      e = { ...e, midia: 'reproduzindo' };
      eventos.push(evento('midia_mudou', comando.emMs, { para: 'reproduzindo' }));
      break;
    }

    case 'pausar': {
      // [INV 1] Guarda o estado de retomada para o contexto voltar exatamente
      // como estava, e para a interface, a fala e o vídeo ficarem coerentes.
      if (e.estado === 'pausado') {
        return { estado, eventos: [evento('comando_ignorado', comando.emMs, { motivo: 'ja_pausado' })] };
      }
      e = { ...e, estadoRetomada: e.estado, estado: 'pausado', midia: 'pausada' };
      eventos.push(evento('estado_mudou', comando.emMs, { de: estado.estado, para: 'pausado' }));
      break;
    }

    case 'retomar': {
      if (e.estado !== 'pausado' && e.estado !== 'aguardando_retorno') {
        return recusar(estado, 'transicao_invalida', 'só é possível retomar a partir de pausa ou espera de retorno');
      }
      const destino = e.estadoRetomada ?? 'exercitando';
      // A retomada NÃO liga a mídia sozinha: a pessoa escolhe recomeçar.
      // [INV 6] Reentrada no enquadramento não inicia esforço automaticamente.
      e = { ...e, estado: destino, estadoRetomada: null, midia: 'pausada' };
      eventos.push(evento('estado_mudou', comando.emMs, { de: estado.estado, para: destino }));
      break;
    }

    case 'buffering_inicio': {
      e = { ...e, midia: 'buffering' };
      eventos.push(evento('midia_mudou', comando.emMs, { para: 'buffering' }));
      break;
    }

    case 'buffering_fim': {
      if (e.midia !== 'buffering') {
        return { estado, eventos: [evento('comando_ignorado', comando.emMs, { motivo: 'nao_estava_em_buffering' })] };
      }
      // Volta a reproduzir só se o domínio não estiver pausado.
      e = { ...e, midia: e.estado === 'pausado' ? 'pausada' : 'reproduzindo' };
      eventos.push(evento('midia_mudou', comando.emMs, { para: e.midia }));
      break;
    }

    case 'erro_midia': {
      e = { ...e, midia: 'erro' };
      eventos.push(evento('midia_mudou', comando.emMs, { para: 'erro', detalhe: comando.carga?.mensagem }));
      break;
    }

    case 'progresso_midia': {
      const posMs = Number(comando.carga?.posicaoMs);
      if (!Number.isFinite(posMs) || posMs < 0) return recusar(estado, 'carga_invalida', 'posicaoMs inválida');

      const anterior = e.relogios.posicaoMidiaMs;
      // Só registra como reproduzido um avanço contínuo e para frente. Um salto
      // grande é seek disfarçado e não vira trecho reproduzido.
      const avancoPlausivel = posMs > anterior && posMs - anterior <= (Number(comando.carga?.toleranciaMs) || 2000);
      let trechos = e.trechosReproduzidos;
      if (avancoPlausivel && e.midia === 'reproduzindo') {
        trechos = unir([...trechos, { inicioMs: anterior, fimMs: posMs }]);
      }
      e = { ...e, relogios: { ...e.relogios, posicaoMidiaMs: posMs }, trechosReproduzidos: trechos };

      const cred = creditarEtapas(e, aula, comando.emMs);
      e = cred.estado;
      eventos.push(...cred.eventos);
      break;
    }

    case 'seek': {
      const posMs = Number(comando.carga?.posicaoMs);
      if (!Number.isFinite(posMs) || posMs < 0) return recusar(estado, 'carga_invalida', 'posicaoMs inválida');
      // [INV 3] Seek recalcula o contexto e NÃO adiciona trecho reproduzido.
      // [INV 5] A revisão da etapa muda: respostas de IA em voo ficam obsoletas.
      const novoIndice = indiceDaPosicao(aula, posMs, e.etapaIndice);
      e = {
        ...e,
        relogios: { ...e.relogios, posicaoMidiaMs: posMs },
        etapaIndice: novoIndice,
        etapaRevisao: e.etapaRevisao + 1,
      };
      eventos.push(evento('contexto_recalculado', comando.emMs, { motivo: 'seek', posicaoMs: posMs, etapaIndice: novoIndice, revisao: e.etapaRevisao }));
      break;
    }

    case 'rever_explicacao':
    case 'trocar_alternativa': {
      // Trocar alternativa muda mídia, instruções, equipamentos e contexto de
      // retorno — não só o título sobre o vídeo anterior (seção 14).
      if (comando.tipo === 'trocar_alternativa') {
        const alternativaId = String(comando.carga?.etapaId ?? '');
        const permitidas = etapa?.alternativas ?? [];
        if (!permitidas.includes(alternativaId)) {
          return recusar(estado, 'carga_invalida', `alternativa "${alternativaId}" não está aprovada para esta etapa`);
        }
        const indiceAlt = aula.etapas.findIndex(x => x.id === alternativaId);
        if (indiceAlt < 0) return recusar(estado, 'carga_invalida', 'alternativa não existe nesta versão da aula');
        e = { ...e, etapaIndice: indiceAlt, relogios: { ...e.relogios, posicaoMidiaMs: aula.etapas[indiceAlt].inicioMs } };
      }
      e = { ...e, etapaRevisao: e.etapaRevisao + 1 };
      eventos.push(evento('contexto_recalculado', comando.emMs, { motivo: comando.tipo, revisao: e.etapaRevisao }));
      break;
    }

    case 'avancar_etapa': {
      const proximo = e.etapaIndice + 1;
      if (proximo >= aula.etapas.length) {
        return recusar(estado, 'transicao_invalida', 'não há próxima etapa; use "concluir"');
      }
      const prox = aula.etapas[proximo];
      e = {
        ...e,
        etapaIndice: proximo,
        etapaRevisao: e.etapaRevisao + 1,
        estado: prox.tipo === 'descanso' ? 'descansando' : prox.tipo === 'demonstracao' ? 'demonstrando' : 'exercitando',
      };
      eventos.push(evento('etapa_mudou', comando.emMs, { etapaId: prox.id, indice: proximo }));
      break;
    }

    case 'iniciar_descanso': {
      e = { ...e, estado: 'descansando', midia: e.midia === 'reproduzindo' ? 'pausada' : e.midia };
      eventos.push(evento('estado_mudou', comando.emMs, { para: 'descansando' }));
      break;
    }

    case 'registrar_serie': {
      const carga = comando.carga ?? {};
      const etapaId = String(carga.etapaId ?? etapa?.id ?? '');
      if (!etapaId) return recusar(estado, 'carga_invalida', 'etapaId ausente');
      const origem = String(carga.origem ?? 'autodeclarado');
      if (!['reproducao', 'autodeclarado', 'sensor', 'profissional'].includes(origem)) {
        return recusar(estado, 'carga_invalida', `origem "${origem}" não é válida`);
      }
      e = {
        ...e,
        series: [
          ...e.series,
          {
            etapaId,
            exercicioId: etapa?.exercicioId,
            repeticoesPlanejadas: numeroOuIndefinido(carga.repeticoesPlanejadas),
            repeticoesRealizadas: numeroOuIndefinido(carga.repeticoesRealizadas),
            cargaKg: numeroOuIndefinido(carga.cargaKg),
            duracaoMs: numeroOuIndefinido(carga.duracaoMs),
            dificuldadePercebida: numeroOuIndefinido(carga.dificuldadePercebida),
            observacao: carga.observacao ? String(carga.observacao) : undefined,
            origem: origem as never,
            registradoEmMs: comando.emMs,
          },
        ],
      };
      eventos.push(evento('serie_registrada', comando.emMs, { etapaId, origem }));
      break;
    }

    case 'presenca_incerta': {
      // A ausência é uma HIPÓTESE. Perda de enquadramento não comprova abandono
      // (seção 17), então o estado guarda a incerteza em vez de pausar sozinho.
      if (e.estado === 'pausado' || e.estado === 'ausencia_possivel') {
        return { estado, eventos: [evento('comando_ignorado', comando.emMs, { motivo: 'ja_sinalizado' })] };
      }
      e = { ...e, estadoRetomada: e.estado, estado: 'ausencia_possivel' };
      eventos.push(evento('presenca_incerta', comando.emMs, { confianca: comando.carga?.confianca ?? null }));
      break;
    }

    case 'confirmar_retorno': {
      if (e.estado !== 'ausencia_possivel' && e.estado !== 'aguardando_retorno') {
        return recusar(estado, 'transicao_invalida', 'não havia ausência sinalizada');
      }
      // [INV 6] Voltar ao enquadramento NÃO recomeça o esforço: a sessão fica
      // aguardando a pessoa escolher continuar.
      e = { ...e, estado: 'aguardando_retorno', midia: 'pausada' };
      eventos.push(evento('retorno_confirmado', comando.emMs, {}));
      break;
    }

    case 'encerrar_parcial':
    case 'concluir': {
      const completa = comando.tipo === 'concluir';
      const cred = creditarEtapas(e, aula, comando.emMs);
      e = cred.estado;
      eventos.push(...cred.eventos);
      e = {
        ...e,
        estado: completa ? 'concluido' : 'encerrado_parcial',
        midia: 'pausada',
        finalizadaEmMs: comando.emMs,
        motivoFinal: completa ? 'completa' : 'parcial',
      };
      eventos.push(
        evento('sessao_finalizada', comando.emMs, {
          motivo: e.motivoFinal,
          // Resumo verdadeiro: sai do que foi registrado, não de um número para
          // preencher a tela (seção 14).
          etapasCreditadas: e.etapasCreditadas.length,
          etapasCreditaveis: aula.etapas.filter(x => x.creditavel).length,
          ativoMs: e.relogios.ativoMs,
        }),
      );
      break;
    }
  }

  e = { ...e, versao: e.versao + 1, comandosAplicados: [...e.comandosAplicados, comando.id] };
  return { estado: e, eventos };
}

function numeroOuIndefinido(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Índice da etapa que contém a posição; mantém o atual se nenhuma contiver. */
function indiceDaPosicao(aula: VersaoAula, posMs: number, padrao: number): number {
  const i = aula.etapas.findIndex(e => posMs >= e.inicioMs && posMs < e.fimMs);
  return i >= 0 ? i : padrao;
}

/**
 * Verifica se uma resposta assíncrona (IA, voz, sensor) ainda é válida.
 *
 * [INV 5] Uma resposta atrasada não altera uma etapa já encerrada: se o
 * contexto mudou desde que a pergunta foi feita, a resposta é descartada.
 */
export function respostaAindaValida(
  estado: EstadoSessao,
  carimbo: { etapaIndice: number; etapaRevisao: number },
): boolean {
  if (FINAIS.includes(estado.estado)) return false;
  return estado.etapaIndice === carimbo.etapaIndice && estado.etapaRevisao === carimbo.etapaRevisao;
}

/**
 * Reconcilia um estado local com o do servidor.
 *
 * [INV 10] Fechar, atualizar ou trocar de dispositivo não perde o progresso já
 * confirmado, e o local NUNCA sobrescreve dado mais novo do servidor.
 */
export function reconciliar(local: EstadoSessao, servidor: EstadoSessao): EstadoSessao {
  if (servidor.versao >= local.versao) return servidor;
  // O local está à frente: preserva o que ele confirmou, mas mantém a união do
  // que ambos registraram — perder crédito por uma corrida de rede seria pior.
  return {
    ...local,
    etapasCreditadas: [...new Set([...local.etapasCreditadas, ...servidor.etapasCreditadas])],
    trechosReproduzidos: unir([...local.trechosReproduzidos, ...servidor.trechosReproduzidos]),
    comandosAplicados: [...new Set([...local.comandosAplicados, ...servidor.comandosAplicados])],
  };
}

/** Resumo verdadeiro da sessão, derivado só do que foi efetivamente registrado. */
export function resumir(estado: EstadoSessao, aula: VersaoAula) {
  const creditaveis = aula.etapas.filter(e => e.creditavel);
  return {
    aulaId: estado.aulaId,
    versao: estado.aulaVersao,
    estado: estado.estado,
    etapasCreditadas: estado.etapasCreditadas.length,
    etapasCreditaveis: creditaveis.length,
    completa: estado.motivoFinal === 'completa',
    tempoAtivoMs: estado.relogios.ativoMs,
    tempoDescansoMs: estado.relogios.descansoMs,
    tempoPausadoMs: estado.relogios.pausadoMs,
    tempoBufferingMs: estado.relogios.bufferingMs,
    series: estado.series.length,
    /** Distingue reprodução de prática autodeclarada e de estimativa de sensor. */
    seriesPorOrigem: estado.series.reduce<Record<string, number>>((acc, s) => {
      acc[s.origem] = (acc[s.origem] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
