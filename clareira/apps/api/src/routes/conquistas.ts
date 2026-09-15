import type { Banco } from '../db/index.js';
import { json } from '../db/index.js';
import { Roteador, erros } from '../lib/http.js';
import { autenticar, registrarAuditoria } from '../lib/auth.js';
import {
  OFERTA_FISICA_ATIVA, REGRA_RASCUNHO, decidirMarco, diaLocal, evidenciasDoLedger,
  semanaIso, type EventoLedger,
} from '@clareira/domain';

/**
 * Conquistas — leitura para o aluno e escrita a partir de eventos reais.
 *
 * O cliente NUNCA envia saldo nem aprova o próprio prêmio (seção 34.4, item 1).
 * A única escrita vem de `creditarParticipacao`, chamada pelo servidor quando
 * uma sessão é finalizada com execução creditada.
 */

function carregarLedger(db: Banco, alunoId: string): EventoLedger[] {
  return (db.prepare('SELECT * FROM ledger_conquistas WHERE aluno_id = ? ORDER BY em_ms').all(alunoId) as any[]).map(l => ({
    chave: l.chave,
    tipo: l.tipo,
    alunoId: l.aluno_id,
    emMs: l.em_ms,
    regraVersao: l.regra_versao,
    diaLocal: l.dia_local ?? undefined,
    semana: l.semana ?? undefined,
    marcoId: l.marco_id ?? undefined,
    origem: l.origem,
    detalhe: json(l.detalhe_json, undefined),
    compensa: l.compensa ?? undefined,
  }));
}

function inserir(db: Banco, e: EventoLedger): boolean {
  try {
    db.prepare(
      `INSERT INTO ledger_conquistas (chave, tipo, aluno_id, em_ms, regra_versao, dia_local, semana, marco_id, origem, detalhe_json, compensa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      e.chave, e.tipo, e.alunoId, e.emMs, e.regraVersao,
      e.diaLocal ?? null, e.semana ?? null, e.marcoId ?? null, e.origem,
      e.detalhe ? JSON.stringify(e.detalhe) : null, e.compensa ?? null,
    );
    return true;
  } catch (err: any) {
    // Os índices únicos parciais do schema garantem o limite de uma unidade por
    // dia e por semana no BANCO, não só na aplicação. Colisão é resultado
    // esperado de retry, não erro a propagar.
    if (String(err?.code ?? '').includes('SQLITE_CONSTRAINT')) return false;
    throw err;
  }
}

/**
 * Credita participação a partir de uma sessão finalizada.
 *
 * A chave de idempotência deriva da sessão: reenvios de web, app, relógio e
 * retries convergem para o mesmo evento (seção 34.4, itens 2 e 7).
 */
export function creditarParticipacao(
  db: Banco,
  params: { alunoId: string; sessaoId: string; fuso: string; agoraMs: number; houveExecucao: boolean },
): void {
  // Assistir sem executar nenhuma etapa creditável não gera unidade.
  if (!params.houveExecucao) return;

  const dia = diaLocal(params.agoraMs, params.fuso);
  const semana = semanaIso(dia);

  inserir(db, {
    chave: `dia:${params.alunoId}:${dia}`,
    tipo: 'dia_de_participacao',
    alunoId: params.alunoId,
    emMs: params.agoraMs,
    regraVersao: REGRA_RASCUNHO.versao,
    diaLocal: dia,
    origem: 'reproducao_confirmada',
    detalhe: { sessaoId: params.sessaoId },
  });

  // A semana é creditada quando a meta individual da semana é atingida.
  const dias = (db
    .prepare(`SELECT COUNT(*) n FROM ledger_conquistas
              WHERE aluno_id = ? AND tipo = 'dia_de_participacao' AND semana IS NULL
                AND dia_local >= ? AND dia_local <= ?`)
    .get(params.alunoId, primeiroDiaDaSemana(dia), ultimoDiaDaSemana(dia)) as any).n as number;

  const perfil = db.prepare('SELECT dias_por_semana FROM perfis WHERE usuario_id = ?').get(params.alunoId) as any;
  const meta = perfil?.dias_por_semana ?? REGRA_RASCUNHO.diasPorSemanaPadrao;

  if (dias >= meta) {
    inserir(db, {
      chave: `semana:${params.alunoId}:${semana}`,
      tipo: 'semana_de_compromisso',
      alunoId: params.alunoId,
      emMs: params.agoraMs,
      regraVersao: REGRA_RASCUNHO.versao,
      semana,
      origem: 'sistema',
      detalhe: { diasContados: dias, metaIndividual: meta },
    });
  }

  // Marcos atingidos viram evento; nenhum deles dispara compra ou envio.
  const evid = evidenciasDoLedger(carregarLedger(db, params.alunoId), params.alunoId);
  for (const marco of REGRA_RASCUNHO.marcos) {
    const d = decidirMarco({ marco, evidencias: evid, regra: REGRA_RASCUNHO });
    if (d.elegivel) {
      inserir(db, {
        chave: `marco:${params.alunoId}:${marco.id}:${REGRA_RASCUNHO.versao}`,
        tipo: 'marco_atingido',
        alunoId: params.alunoId,
        emMs: params.agoraMs,
        regraVersao: REGRA_RASCUNHO.versao,
        marcoId: marco.id,
        origem: 'sistema',
      });
    }
  }
}

function primeiroDiaDaSemana(dia: string): string {
  const [a, m, d] = dia.split('-').map(Number);
  const data = new Date(Date.UTC(a, m - 1, d));
  data.setUTCDate(data.getUTCDate() - ((data.getUTCDay() + 6) % 7));
  return data.toISOString().slice(0, 10);
}
function ultimoDiaDaSemana(dia: string): string {
  const [a, m, d] = dia.split('-').map(Number);
  const data = new Date(Date.UTC(a, m - 1, d));
  data.setUTCDate(data.getUTCDate() + (6 - ((data.getUTCDay() + 6) % 7)));
  return data.toISOString().slice(0, 10);
}

export function rotasDeConquistas(r: Roteador, db: Banco): void {
  r.get('/v1/conquistas', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();

    const ledger = carregarLedger(db, quem.id);
    const evid = evidenciasDoLedger(ledger, quem.id);
    const ciclos = (db.prepare(
      `SELECT COUNT(*) n FROM ledger_conquistas WHERE aluno_id = ? AND tipo = 'ciclo_comercial_elegivel'`,
    ).get(quem.id) as any).n;

    const marcos = REGRA_RASCUNHO.marcos.map(m => {
      const d = decidirMarco({ marco: m, evidencias: { ...evid, ciclosPagosElegiveis: ciclos }, regra: REGRA_RASCUNHO });
      return {
        id: m.id,
        rotulo: m.rotulo,
        camada: m.camada,
        semanasExigidas: m.semanasExigidas,
        janelaEmSemanas: m.janelaEmSemanas,
        ciclosPagosExigidos: m.ciclosPagosExigidos,
        tipoBeneficio: m.beneficio.tipo,
        concedido: evid.marcosConcedidos.includes(m.id),
        emRevisao: evid.marcosEmRevisao.includes(m.id),
        // O que já contou, o que falta e por quê — sem expor antifraude.
        elegivel: d.elegivel,
        explicacao: d.explicacao,
        faltam: d.faltam,
      };
    });

    return {
      regra: {
        versao: REGRA_RASCUNHO.versao,
        descricaoPublica: REGRA_RASCUNHO.descricaoPublica,
        /** Enquanto falso, nenhum benefício físico é prometido a ninguém. */
        ofertaFisicaAtiva: OFERTA_FISICA_ATIVA,
        aviso: OFERTA_FISICA_ATIVA
          ? null
          : 'O programa de benefícios físicos está em estudo. Nenhuma campanha foi aberta e nada foi prometido.',
      },
      progresso: {
        diasDeParticipacao: evid.diasDeParticipacao.length,
        semanasDeCompromisso: evid.semanasDeCompromisso.length,
        ciclosPagosElegiveis: ciclos,
        ultimosDias: evid.diasDeParticipacao.slice(-14),
      },
      marcos,
    };
  });

  /**
   * Contestação. Uma falha da plataforma não pode tirar progresso legítimo
   * (seção 34.3), então o recurso é um evento registrado, não um e-mail.
   */
  r.post('/v1/conquistas/recurso', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const motivo = String((ctx.corpo as any)?.motivo ?? '').slice(0, 2000);
    if (!motivo) throw erros.invalido('Conte o que aconteceu para podermos revisar.');

    const chave = `recurso:${quem.id}:${ctx.agoraMs}`;
    inserir(db, {
      chave,
      tipo: 'recurso_aberto',
      alunoId: quem.id,
      emMs: ctx.agoraMs,
      regraVersao: REGRA_RASCUNHO.versao,
      marcoId: (ctx.corpo as any)?.marcoId ? String((ctx.corpo as any).marcoId) : undefined,
      origem: 'autodeclarado',
      detalhe: { motivo },
    });
    registrarAuditoria(db, { atorId: quem.id, acao: 'recurso_aberto', objeto: 'conquista', objetoId: chave, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs });

    return {
      ok: true,
      protocolo: chave,
      mensagem: 'Recebemos. Seu progresso continua registrado e sua aula não é afetada enquanto revisamos.',
      // Fila de revisão humana ainda não tem operação por trás. Dizer isso.
      revisaoHumana: 'pendente',
    };
  });
}
