import type { Banco } from '../db/index.js';
import { json, novoId } from '../db/index.js';
import { Roteador, erros, texto } from '../lib/http.js';
import { autenticar, registrarAuditoria, temPapel } from '../lib/auth.js';
import type { BloqueioDePublicacao, Etapa } from '@clareira/domain';

/**
 * Studio de autoria do professor.
 *
 * O que esta rota garante, e que uma tabela de vídeos com contadores não
 * garante (seção 20):
 *  · Publicação é TRANSIÇÃO CONTROLADA, não um booleano que o cliente escreve.
 *  · O bloqueio de publicação é ESPECÍFICO: diz exatamente o que falta.
 *  · Publicar cria uma VERSÃO IMUTÁVEL; sessões antigas mantêm a sua.
 *  · Mídia enviada ≠ transcodificada ≠ pronta ≠ publicada.
 */

function exigirAutoria(db: Banco, ctx: { token: string | null; agoraMs: number }) {
  const quem = autenticar(db, ctx.token, ctx.agoraMs);
  if (!quem) throw erros.naoAutenticado();
  if (!temPapel(quem, 'instrutor', 'editor', 'admin')) {
    throw erros.semPermissao('Esta área é do time de conteúdo.');
  }
  return quem;
}

/** Valida as etapas: sobreposição e lacuna quebram o motor de sessão. */
function validarEtapas(etapas: Etapa[], duracaoMs: number): string[] {
  const problemas: string[] = [];
  if (etapas.length === 0) return ['A aula não tem nenhuma etapa marcada.'];

  const ordenadas = [...etapas].sort((a, b) => a.inicioMs - b.inicioMs);
  for (const e of ordenadas) {
    if (e.fimMs <= e.inicioMs) problemas.push(`"${e.rotulo}" termina antes de começar.`);
    if (e.fimMs > duracaoMs) problemas.push(`"${e.rotulo}" passa do fim da mídia.`);
  }
  for (let i = 1; i < ordenadas.length; i++) {
    // Alternativas ficam fora da linha principal e podem sobrepor de propósito.
    if (ordenadas[i].tipo === 'alternativa' || ordenadas[i - 1].tipo === 'alternativa') continue;
    if (ordenadas[i].inicioMs < ordenadas[i - 1].fimMs) {
      problemas.push(`"${ordenadas[i].rotulo}" começa antes de "${ordenadas[i - 1].rotulo}" terminar.`);
    }
  }
  const ids = etapas.map(e => e.id);
  if (new Set(ids).size !== ids.length) problemas.push('Há etapas com o mesmo identificador.');

  for (const e of etapas) {
    for (const alt of e.alternativas ?? []) {
      if (!ids.includes(alt)) problemas.push(`"${e.rotulo}" aponta para uma alternativa que não existe.`);
    }
  }
  return problemas;
}

/** Tudo que impede a publicação, com motivo legível. */
function bloqueiosDePublicacao(db: Banco, aulaId: string): BloqueioDePublicacao[] {
  const a = db.prepare('SELECT * FROM aulas WHERE id = ?').get(aulaId) as any;
  if (!a) throw erros.naoEncontrado('Aula');
  const bloqueios: BloqueioDePublicacao[] = [];

  if (!a.midia_id) {
    bloqueios.push({ codigo: 'sem_midia', mensagem: 'Nenhuma mídia foi associada a esta aula.' });
  } else {
    const m = db.prepare('SELECT * FROM midias WHERE id = ?').get(a.midia_id) as any;
    if (!m || m.processamento !== 'pronto') {
      bloqueios.push({
        codigo: 'midia_incompleta',
        mensagem: `A mídia está em "${m?.processamento ?? 'ausente'}". Só é possível publicar com ela pronta.`,
      });
    }
  }

  const rascunho = db.prepare('SELECT etapas_json FROM rascunhos_de_aula WHERE aula_id = ?').get(aulaId) as any;
  const etapas = json<Etapa[]>(rascunho?.etapas_json, []);
  if (etapas.length === 0) {
    bloqueios.push({ codigo: 'sem_etapas', mensagem: 'A linha do tempo ainda não tem etapas marcadas.' });
  } else {
    const problemas = validarEtapas(etapas, a.duracao_ms);
    if (problemas.length) {
      bloqueios.push({ codigo: 'etapas_invalidas', mensagem: problemas.join(' ') });
    }
  }

  if (a.estado !== 'aprovada') {
    bloqueios.push({
      codigo: 'sem_revisao',
      mensagem: `A aula está em "${a.estado}". Só publicamos depois da revisão aprovar.`,
    });
  }

  if (json<string[]>(a.equipamentos, []).length === 0 && a.espaco_minimo === undefined) {
    bloqueios.push({ codigo: 'sem_equipamento_declarado', mensagem: 'Declare equipamento e espaço mínimo.' });
  }

  return bloqueios;
}

export function rotasDeAutoria(r: Roteador, db: Banco): void {
  r.get('/v1/studio/aulas', ctx => {
    exigirAutoria(db, ctx);
    const linhas = db.prepare(`
      SELECT a.*, p.nome AS professor_nome, m.processamento AS midia_processamento, m.poster_url
      FROM aulas a JOIN professores p ON p.id = a.professor_id
      LEFT JOIN midias m ON m.id = a.midia_id
      ORDER BY a.atualizado_em_ms DESC`).all() as any[];

    return {
      aulas: linhas.map(l => ({
        id: l.id,
        titulo: l.titulo,
        estado: l.estado,
        versaoPublicada: l.versao_publicada,
        duracaoMs: l.duracao_ms,
        professor: l.professor_nome,
        posterUrl: l.poster_url,
        // Estados de processamento distintos e visíveis para o editor.
        midiaProcessamento: l.midia_processamento ?? 'ausente',
        atualizadoEmMs: l.atualizado_em_ms,
      })),
    };
  });

  r.get('/v1/studio/aulas/:id', ctx => {
    exigirAutoria(db, ctx);
    const a = db.prepare('SELECT * FROM aulas WHERE id = ?').get(ctx.params.id) as any;
    if (!a) throw erros.naoEncontrado('Aula');

    const rascunho = db.prepare('SELECT * FROM rascunhos_de_aula WHERE aula_id = ?').get(ctx.params.id) as any;
    const midia = a.midia_id ? (db.prepare('SELECT * FROM midias WHERE id = ?').get(a.midia_id) as any) : null;
    const versoes = db.prepare('SELECT versao, publicada_em_ms FROM versoes_de_aula WHERE aula_id = ? ORDER BY versao DESC').all(ctx.params.id);

    return {
      aula: {
        id: a.id, titulo: a.titulo, descricao: a.descricao, duracaoMs: a.duracao_ms,
        nivel: a.nivel, modalidade: a.modalidade, equipamentos: json<string[]>(a.equipamentos, []),
        espacoMinimo: a.espaco_minimo, impacto: a.impacto, estado: a.estado,
        versaoPublicada: a.versao_publicada,
      },
      midia: midia && {
        id: midia.id, webmUrl: midia.webm_url, mp4Url: midia.mp4_url, posterUrl: midia.poster_url,
        duracaoMs: midia.duracao_ms, processamento: midia.processamento,
        origem: midia.origem, licenca: midia.licenca, ilustrativo: Boolean(midia.ilustrativo),
      },
      etapas: json<Etapa[]>(rascunho?.etapas_json, []),
      versoes,
      bloqueios: bloqueiosDePublicacao(db, ctx.params.id),
    };
  });

  /** Autosave do rascunho. Não toca em nada publicado. */
  r.patch('/v1/studio/aulas/:id/etapas', ctx => {
    const quem = exigirAutoria(db, ctx);
    const a = db.prepare('SELECT * FROM aulas WHERE id = ?').get(ctx.params.id) as any;
    if (!a) throw erros.naoEncontrado('Aula');

    const etapas = (ctx.corpo as any)?.etapas;
    if (!Array.isArray(etapas)) throw erros.invalido('Envie a lista de etapas.');

    const problemas = validarEtapas(etapas as Etapa[], a.duracao_ms);

    db.prepare(
      `INSERT INTO rascunhos_de_aula (aula_id, etapas_json, atualizado_em_ms, atualizado_por)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(aula_id) DO UPDATE SET etapas_json=excluded.etapas_json,
         atualizado_em_ms=excluded.atualizado_em_ms, atualizado_por=excluded.atualizado_por`,
    ).run(ctx.params.id, JSON.stringify(etapas), ctx.agoraMs, quem.id);
    db.prepare('UPDATE aulas SET atualizado_em_ms = ? WHERE id = ?').run(ctx.agoraMs, ctx.params.id);

    // Salvar um rascunho com problema é permitido — o professor está no meio do
    // trabalho. O que não é permitido é PUBLICAR com problema.
    return { salvo: true, emMs: ctx.agoraMs, problemas };
  });

  /** Transição de estado editorial: rascunho → em_revisao → aprovada. */
  r.post('/v1/studio/aulas/:id/estado', ctx => {
    const quem = exigirAutoria(db, ctx);
    const destino = texto(ctx.corpo, 'estado', { max: 20 });
    const a = db.prepare('SELECT * FROM aulas WHERE id = ?').get(ctx.params.id) as any;
    if (!a) throw erros.naoEncontrado('Aula');

    const permitidas: Record<string, string[]> = {
      rascunho: ['em_revisao'],
      em_revisao: ['aprovada', 'rascunho'],
      aprovada: ['publicada', 'rascunho'],
      publicada: ['arquivada', 'rascunho'],
      arquivada: ['rascunho'],
    };
    if (!permitidas[a.estado]?.includes(destino)) {
      throw erros.invalido(`Não dá para ir de "${a.estado}" para "${destino}".`);
    }
    // Aprovar exige papel de revisão; instrutor não aprova o próprio trabalho.
    if (destino === 'aprovada' && !temPapel(quem, 'editor', 'admin')) {
      throw erros.semPermissao('A aprovação é do time de revisão.');
    }
    if (destino === 'publicada') {
      throw erros.invalido('Use a rota de publicação: publicar cria uma versão imutável.');
    }

    db.prepare('UPDATE aulas SET estado = ?, atualizado_em_ms = ? WHERE id = ?').run(destino, ctx.agoraMs, ctx.params.id);
    registrarAuditoria(db, { atorId: quem.id, acao: `estado:${destino}`, objeto: 'aula', objetoId: ctx.params.id, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs, detalhe: { de: a.estado } });
    return { estado: destino, bloqueios: bloqueiosDePublicacao(db, ctx.params.id) };
  });

  /**
   * Publicação. Cria uma versão nova e imutável.
   * Sessões já em andamento continuam na versão delas (invariantes 8 e 9).
   */
  r.post('/v1/studio/aulas/:id/publicar', ctx => {
    const quem = exigirAutoria(db, ctx);
    if (!temPapel(quem, 'editor', 'admin')) throw erros.semPermissao('A publicação é do time de revisão.');

    const bloqueios = bloqueiosDePublicacao(db, ctx.params.id);
    if (bloqueios.length > 0) {
      // Bloqueio ESPECÍFICO, não "erro ao publicar". O editor continua editando.
      throw erros.conflito('Ainda não dá para publicar.', { bloqueios });
    }

    const a = db.prepare('SELECT * FROM aulas WHERE id = ?').get(ctx.params.id) as any;
    const rascunho = db.prepare('SELECT etapas_json FROM rascunhos_de_aula WHERE aula_id = ?').get(ctx.params.id) as any;
    const proxima = (a.versao_publicada ?? 0) + 1;

    db.transaction(() => {
      db.prepare(
        `INSERT INTO versoes_de_aula (aula_id, versao, midia_id, duracao_ms, etapas_json, publicada_em_ms, publicada_por)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(ctx.params.id, proxima, a.midia_id, a.duracao_ms, rascunho.etapas_json, ctx.agoraMs, quem.id);
      db.prepare(`UPDATE aulas SET estado = 'publicada', versao_publicada = ?, atualizado_em_ms = ? WHERE id = ?`)
        .run(proxima, ctx.agoraMs, ctx.params.id);
    })();

    registrarAuditoria(db, { atorId: quem.id, acao: 'publicou', objeto: 'aula', objetoId: ctx.params.id, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs, detalhe: { versao: proxima } });

    const sessoesEmAndamento = (db.prepare(
      `SELECT COUNT(*) n FROM sessoes WHERE aula_id = ? AND finalizada_em_ms IS NULL`,
    ).get(ctx.params.id) as any).n;

    return {
      versao: proxima,
      publicadaEmMs: ctx.agoraMs,
      // Prova explícita do invariante 8 para quem publicou.
      sessoesEmAndamentoPreservadas: sessoesEmAndamento,
      observacao: sessoesEmAndamento > 0
        ? `${sessoesEmAndamento} sessão(ões) em andamento continuam na versão anterior. Elas não mudam.`
        : null,
    };
  });

  /** Biblioteca de mídia, com procedência visível. */
  r.get('/v1/studio/midias', ctx => {
    exigirAutoria(db, ctx);
    return {
      midias: (db.prepare('SELECT * FROM midias ORDER BY id').all() as any[]).map(m => ({
        id: m.id, posterUrl: m.poster_url, webmUrl: m.webm_url, mp4Url: m.mp4_url,
        duracaoMs: m.duracao_ms, largura: m.largura, altura: m.altura,
        processamento: m.processamento,
        origem: m.origem, licenca: m.licenca, ilustrativo: Boolean(m.ilustrativo),
      })),
      // Estado real do pipeline de upload.
      upload: {
        habilitado: false,
        motivo: 'Nenhum provedor de vídeo está configurado neste ambiente.',
        pendencias: [
          'Escolher e configurar um provedor de vídeo (upload, transcodificação, CDN, mídia privada).',
          'Implementar envio retomável com progresso em bytes, cancelamento e processamento idempotente.',
          'Separar os estados enviado / transcodificando / pronto / publicado no fluxo real.',
        ],
      },
    };
  });
}
