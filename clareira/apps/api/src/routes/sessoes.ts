import type { Banco } from '../db/index.js';
import { json, novoId } from '../db/index.js';
import { Roteador, erros, texto } from '../lib/http.js';
import { autenticar, registrarAuditoria } from '../lib/auth.js';
import {
  aplicar, criarSessao, resumir, diaLocal, semanaIso,
  type Comando, type EstadoSessao, type VersaoAula,
} from '@clareira/domain';
import { creditarParticipacao } from './conquistas.js';

/**
 * Sessões de treino.
 *
 * O servidor é a AUTORIDADE: ele carimba o instante, valida a permissão, aplica
 * o comando uma única vez e devolve o estado com a versão confirmada. O cliente
 * nunca envia o próprio progresso pronto.
 */

function carregarVersao(db: Banco, aulaId: string, versao: number): VersaoAula {
  const v = db.prepare('SELECT * FROM versoes_de_aula WHERE aula_id = ? AND versao = ?').get(aulaId, versao) as any;
  if (!v) throw erros.naoEncontrado('Versão da aula');
  return {
    aulaId: v.aula_id,
    versao: v.versao,
    midiaId: v.midia_id,
    duracaoMs: v.duracao_ms,
    etapas: json(v.etapas_json, []),
  };
}

function carregarSessao(db: Banco, id: string, alunoId: string): { estado: EstadoSessao; aula: VersaoAula } {
  const s = db.prepare('SELECT * FROM sessoes WHERE id = ?').get(id) as any;
  if (!s) throw erros.naoEncontrado('Sessão');
  // Isolamento entre usuários testado por ID direto, não por esconder botão.
  if (s.aluno_id !== alunoId) throw erros.naoEncontrado('Sessão');
  return { estado: json<EstadoSessao>(s.estado_json, {} as EstadoSessao), aula: carregarVersao(db, s.aula_id, s.aula_versao) };
}

export function rotasDeSessao(r: Roteador, db: Banco): void {
  r.post('/v1/sessoes', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();

    const aulaId = texto(ctx.corpo, 'aulaId', { max: 100 });
    const dispositivoId = texto(ctx.corpo, 'dispositivoId', { max: 100 });

    const aula = db.prepare('SELECT * FROM aulas WHERE id = ?').get(aulaId) as any;
    if (!aula) throw erros.naoEncontrado('Aula');
    if (aula.estado !== 'publicada' || !aula.versao_publicada) {
      throw erros.invalido('Esta aula ainda não está publicada.');
    }

    const versao = carregarVersao(db, aulaId, aula.versao_publicada);
    const id = novoId('ses');
    // A sessão SEMPRE começa no seu início definido. Um timestamp vindo de uma
    // prévia pública não é aceito aqui (invariante 7 e cenário da seção 25.2).
    const estado = criarSessao({ id, alunoId: quem.id, aula: versao, dispositivoId, emMs: ctx.agoraMs });

    db.prepare(
      `INSERT INTO sessoes (id, aluno_id, aula_id, aula_versao, estado_json, versao, controlador_id, iniciada_em_ms, finalizada_em_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(id, quem.id, aulaId, versao.versao, JSON.stringify(estado), estado.versao, dispositivoId, ctx.agoraMs);

    registrarAuditoria(db, { atorId: quem.id, acao: 'sessao_criada', objeto: 'sessao', objetoId: id, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs });
    return { sessao: estado, aula: versao };
  });

  r.get('/v1/sessoes/:id', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const { estado, aula } = carregarSessao(db, ctx.params.id, quem.id);
    return { sessao: estado, aula, resumo: resumir(estado, aula) };
  });

  /**
   * Aplica um comando. Ponto único de escrita de sessão.
   *
   * Idempotência em duas camadas: o motor ignora comando repetido, e o banco
   * tem `comandos_de_sessao.comando_id` como chave primária. Duas abas, dois
   * dispositivos e retries de rede convergem no mesmo estado.
   */
  r.post('/v1/sessoes/:id/comandos', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();

    const corpo = (ctx.corpo ?? {}) as Record<string, unknown>;
    const comandoId = texto(ctx.corpo, 'id', { max: 100 });
    const tipo = texto(ctx.corpo, 'tipo', { max: 40 }) as Comando['tipo'];
    const dispositivoId = texto(ctx.corpo, 'dispositivoId', { max: 100 });

    const jaAplicado = db.prepare('SELECT resultado FROM comandos_de_sessao WHERE comando_id = ?').get(comandoId) as any;
    const { estado, aula } = carregarSessao(db, ctx.params.id, quem.id);

    if (jaAplicado) {
      return { sessao: estado, aula, resumo: resumir(estado, aula), duplicado: true };
    }

    const comando: Comando = {
      id: comandoId,
      tipo,
      sessaoId: ctx.params.id,
      // O instante é do SERVIDOR. Relógio local alterado não conta.
      emMs: ctx.agoraMs,
      dispositivoId,
      versaoEsperada: corpo.versaoEsperada === undefined ? undefined : Number(corpo.versaoEsperada),
      carga: (corpo.carga ?? {}) as Record<string, unknown>,
    };

    const resultado = aplicar(estado, comando, aula);

    if (resultado.recusa) {
      // Recusa devolve a versão atual para o cliente reconciliar, e é 409 —
      // não 500 e não um sucesso falso.
      throw erros.conflito(resultado.recusa.mensagem, {
        codigo: resultado.recusa.codigo,
        versaoAtual: resultado.recusa.versaoAtual,
        sessao: estado,
      });
    }

    const novo = resultado.estado;
    db.transaction(() => {
      db.prepare(
        `UPDATE sessoes SET estado_json = ?, versao = ?, finalizada_em_ms = ? WHERE id = ?`,
      ).run(JSON.stringify(novo), novo.versao, novo.finalizadaEmMs, ctx.params.id);

      db.prepare(
        `INSERT INTO comandos_de_sessao (comando_id, sessao_id, tipo, em_ms, dispositivo, carga_json, resultado)
         VALUES (?, ?, ?, ?, ?, ?, 'aplicado')`,
      ).run(comandoId, ctx.params.id, tipo, ctx.agoraMs, dispositivoId, JSON.stringify(comando.carga ?? {}));

      // Conclusão alimenta o ledger de conquistas — no servidor, com chave de
      // idempotência derivada da sessão, e nunca a partir de saldo do cliente.
      if (novo.motivoFinal !== null) {
        creditarParticipacao(db, {
          alunoId: quem.id,
          sessaoId: ctx.params.id,
          fuso: quem.fuso,
          agoraMs: ctx.agoraMs,
          // Só credita participação se houve etapa creditada de verdade.
          houveExecucao: novo.etapasCreditadas.length > 0,
        });
      }
    })();

    return { sessao: novo, aula, resumo: resumir(novo, aula), eventos: resultado.eventos };
  });

  /**
   * Reconciliação explícita: o cliente conta em que versão acha que está e o
   * servidor devolve o estado verdadeiro. Usado ao voltar de background, trocar
   * de aba ou reconectar.
   */
  r.get('/v1/sessoes/:id/estado', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const { estado, aula } = carregarSessao(db, ctx.params.id, quem.id);
    const versaoLocal = Number(ctx.consulta.get('versaoLocal') ?? 0);
    return {
      sessao: estado,
      aula,
      resumo: resumir(estado, aula),
      servidorMaisNovo: estado.versao > versaoLocal,
      instanteServidorMs: ctx.agoraMs,
    };
  });

  /** Transfere o controle para outro dispositivo, de forma explícita. */
  r.post('/v1/sessoes/:id/controlador', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const dispositivoId = texto(ctx.corpo, 'dispositivoId', { max: 100 });
    const { estado, aula } = carregarSessao(db, ctx.params.id, quem.id);

    const novo: EstadoSessao = { ...estado, controladorId: dispositivoId, versao: estado.versao + 1 };
    db.prepare('UPDATE sessoes SET estado_json = ?, versao = ?, controlador_id = ? WHERE id = ?')
      .run(JSON.stringify(novo), novo.versao, dispositivoId, ctx.params.id);

    registrarAuditoria(db, { atorId: quem.id, acao: 'controlador_trocado', objeto: 'sessao', objetoId: ctx.params.id, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs, detalhe: { dispositivoId } });
    return { sessao: novo, aula };
  });
}

export { diaLocal, semanaIso };
