import type { Banco } from '../db/index.js';
import { json } from '../db/index.js';
import { Roteador, erros } from '../lib/http.js';
import { autenticar } from '../lib/auth.js';
import { diaLocal } from '@clareira/domain';

/**
 * Catálogo, descoberta e recomendação.
 *
 * Duas regras que valem em todas as rotas daqui:
 *  · Só aula PUBLICADA com versão aparece para aluno.
 *  · A recomendação do dia é PERSISTIDA por aluno e dia local: atualizar a
 *    página não troca o plano em silêncio (seção 13).
 */

const SELECT_AULA = `
  SELECT a.*, p.nome AS professor_nome, p.especialidades AS professor_especialidades,
         m.webm_url, m.mp4_url, m.poster_url,
         m.vertical_webm_url, m.vertical_mp4_url, m.vertical_poster_url,
         m.ilustrativo, m.origem AS midia_origem, m.licenca AS midia_licenca
  FROM aulas a
  JOIN professores p ON p.id = a.professor_id
  LEFT JOIN midias m ON m.id = a.midia_id`;

function mapearAula(l: any) {
  return {
    id: l.id,
    titulo: l.titulo,
    descricao: l.descricao,
    duracaoMs: l.duracao_ms,
    nivel: l.nivel,
    modalidade: l.modalidade,
    equipamentos: json<string[]>(l.equipamentos, []),
    espacoMinimo: l.espaco_minimo,
    impacto: l.impacto,
    estado: l.estado,
    versaoPublicada: l.versao_publicada,
    demonstracaoPublica: Boolean(l.demonstracao_publica),
    professor: {
      id: l.professor_id,
      nome: l.professor_nome,
      especialidades: json<string[]>(l.professor_especialidades, []),
    },
    midia: l.webm_url
      ? {
          webmUrl: l.webm_url,
          mp4Url: l.mp4_url,
          posterUrl: l.poster_url,
          verticalWebmUrl: l.vertical_webm_url,
          verticalMp4Url: l.vertical_mp4_url,
          verticalPosterUrl: l.vertical_poster_url,
          /** Stock ilustrativo é sempre identificado como tal na interface. */
          ilustrativo: Boolean(l.ilustrativo),
          origem: l.midia_origem,
          licenca: l.midia_licenca,
        }
      : null,
  };
}

export function rotasDeCatalogo(r: Roteador, db: Banco): void {
  r.get('/v1/aulas', ctx => {
    const minutos = Number(ctx.consulta.get('minutos') ?? 0);
    const espaco = ctx.consulta.get('espaco');
    const impacto = ctx.consulta.get('impacto');
    const equipamento = ctx.consulta.get('equipamento');

    const condicoes = [`a.estado = 'publicada'`, 'a.versao_publicada IS NOT NULL'];
    const args: any[] = [];

    if (minutos > 0) {
      // Cabe no tempo disponível, com folga de 1 minuto para preparação.
      condicoes.push('a.duracao_ms <= ?');
      args.push((minutos + 1) * 60_000);
    }
    if (espaco) {
      const ordem = ['tapete', 'pequeno', 'medio'];
      const maximo = ordem.indexOf(espaco);
      if (maximo >= 0) {
        condicoes.push(`a.espaco_minimo IN (${ordem.slice(0, maximo + 1).map(() => '?').join(',')})`);
        args.push(...ordem.slice(0, maximo + 1));
      }
    }
    if (impacto === 'sem_saltos') condicoes.push(`a.impacto = 'sem_saltos'`);
    if (impacto === 'baixo') condicoes.push(`a.impacto IN ('sem_saltos','baixo')`);

    let linhas = db.prepare(`${SELECT_AULA} WHERE ${condicoes.join(' AND ')} ORDER BY a.duracao_ms`).all(...args) as any[];

    // Equipamento é filtro de inclusão: "sem equipamento" significa que a aula
    // não exige nada além do corpo.
    if (equipamento === 'nenhum') {
      linhas = linhas.filter(l => json<string[]>(l.equipamentos, []).length === 0);
    } else if (equipamento) {
      linhas = linhas.filter(l => {
        const eq = json<string[]>(l.equipamentos, []);
        return eq.length === 0 || eq.every(x => x === equipamento);
      });
    }

    return {
      aulas: linhas.map(mapearAula),
      total: linhas.length,
      // Estado vazio que orienta a próxima ação, não um "nada encontrado".
      sugestaoSeVazio:
        linhas.length === 0
          ? 'Nenhuma aula publicada cabe nesses critérios hoje. Tente mais alguns minutos ou permita impacto baixo.'
          : null,
    };
  });

  r.get('/v1/aulas/:id', ctx => {
    const l = db.prepare(`${SELECT_AULA} WHERE a.id = ?`).get(ctx.params.id) as any;
    if (!l) throw erros.naoEncontrado('Aula');

    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    // Rascunho só aparece para quem tem papel de autoria.
    if (l.estado !== 'publicada' && !quem?.papeis.some(p => ['instrutor', 'editor', 'admin'].includes(p))) {
      throw erros.naoEncontrado('Aula');
    }

    const versao = l.versao_publicada
      ? (db.prepare('SELECT * FROM versoes_de_aula WHERE aula_id = ? AND versao = ?').get(l.id, l.versao_publicada) as any)
      : null;

    return {
      aula: mapearAula(l),
      versao: versao
        ? { versao: versao.versao, duracaoMs: versao.duracao_ms, etapas: json(versao.etapas_json, []), publicadaEmMs: versao.publicada_em_ms }
        : null,
    };
  });

  r.get('/v1/programas', () => {
    const linhas = db.prepare(`
      SELECT pr.*, p.nome AS professor_nome
      FROM programas pr JOIN professores p ON p.id = pr.professor_id
      ORDER BY pr.semanas`).all() as any[];

    return {
      programas: linhas.map(l => ({
        id: l.id,
        titulo: l.titulo,
        objetivo: l.objetivo,
        nivel: l.nivel,
        semanas: l.semanas,
        sessoesPorSemana: l.sessoes_por_semana,
        equipamentos: json<string[]>(l.equipamentos, []),
        preRequisitos: json<string[]>(l.pre_requisitos, []),
        oQueVoceAprende: json<string[]>(l.o_que_aprende, []),
        professor: { id: l.professor_id, nome: l.professor_nome },
        // Critérios comparáveis entre programas, não texto de venda.
        totalDeAulas: (db.prepare('SELECT COUNT(*) n FROM programa_aulas WHERE programa_id = ?').get(l.id) as any).n,
      })),
    };
  });

  r.get('/v1/professores', () => ({
    professores: (db.prepare('SELECT * FROM professores').all() as any[]).map(p => ({
      id: p.id,
      nome: p.nome,
      especialidades: json<string[]>(p.especialidades, []),
      apresentacao: p.apresentacao,
      fotoUrl: p.foto_url,
    })),
  }));

  r.get('/v1/exercicios/:id', ctx => {
    const e = db.prepare('SELECT * FROM exercicios WHERE id = ?').get(ctx.params.id) as any;
    if (!e) throw erros.naoEncontrado('Exercício');
    return {
      exercicio: {
        id: e.id,
        nome: e.nome,
        passoAPasso: json<string[]>(e.passo_a_passo, []),
        respiracao: e.respiracao,
        errosComuns: json<string[]>(e.erros_comuns, []),
        regressoes: json<string[]>(e.regressoes, []),
        progressoes: json<string[]>(e.progressoes, []),
        cuidados: json<string[]>(e.cuidados, []),
        musculos: json<string[]>(e.musculos, []),
        // Quem revisou e quando. Sem isso, o conteúdo não é apresentado como
        // orientação revisada.
        revisadoPor: e.revisado_por,
        revisadoEmMs: e.revisado_em_ms,
      },
    };
  });

  /**
   * Recomendação do dia. Estável por fuso e escolha salva: a primeira chamada
   * do dia decide e persiste; as seguintes devolvem a mesma coisa.
   * `?regerar=1` é uma atualização SOLICITADA, distinta de regeneração
   * involuntária, e fica registrada.
   */
  r.get('/v1/hoje', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();

    const dia = diaLocal(ctx.agoraMs, quem.fuso);
    const regerar = ctx.consulta.get('regerar') === '1';

    const existente = db.prepare('SELECT * FROM recomendacoes_do_dia WHERE aluno_id = ? AND dia_local = ?').get(quem.id, dia) as any;
    if (existente && !regerar) {
      const l = db.prepare(`${SELECT_AULA} WHERE a.id = ?`).get(existente.aula_id) as any;
      return { dia, aula: l ? mapearAula(l) : null, motivo: existente.motivo, regraVersao: existente.regra_versao, persistida: true };
    }

    const perfil = db.prepare('SELECT * FROM perfis WHERE usuario_id = ?').get(quem.id) as any;
    const minutos = perfil?.minutos_por_sessao ?? 20;
    const impactoMax = perfil?.impacto_maximo ?? 'moderado';
    const ordemImpacto = ['sem_saltos', 'baixo', 'moderado'];
    const permitidos = ordemImpacto.slice(0, ordemImpacto.indexOf(impactoMax) + 1);

    // Regra explícita e versionada. Não é um modelo: é uma regra auditável.
    const REGRA = 'recomendacao-v1';
    const candidatos = db.prepare(`
      ${SELECT_AULA}
      WHERE a.estado = 'publicada' AND a.versao_publicada IS NOT NULL
        AND a.duracao_ms <= ?
        AND a.impacto IN (${permitidos.map(() => '?').join(',')})
      ORDER BY a.duracao_ms DESC`).all((minutos + 1) * 60_000, ...permitidos) as any[];

    if (candidatos.length === 0) {
      return { dia, aula: null, motivo: 'Nenhuma aula publicada cabe nas suas preferências ainda.', regraVersao: REGRA, persistida: false };
    }

    // Alterna entre os candidatos por dia, de forma determinística: o mesmo
    // aluno no mesmo dia recebe sempre a mesma aula, sem repetir a de ontem.
    const semente = [...`${quem.id}${dia}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    const escolhida = candidatos[semente % candidatos.length];
    const motivo = `Cabe nos seus ${minutos} minutos, respeita o impacto que você prefere e usa ${
      json<string[]>(escolhida.equipamentos, []).length === 0 ? 'só o peso do corpo' : 'o equipamento que você tem'
    }.`;

    db.prepare(
      `INSERT INTO recomendacoes_do_dia (aluno_id, dia_local, aula_id, regra_versao, motivo, gerada_em_ms)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(aluno_id, dia_local) DO UPDATE SET aula_id=excluded.aula_id, motivo=excluded.motivo, gerada_em_ms=excluded.gerada_em_ms`,
    ).run(quem.id, dia, escolhida.id, REGRA, motivo, ctx.agoraMs);

    return { dia, aula: mapearAula(escolhida), motivo, regraVersao: REGRA, persistida: true, regerada: regerar };
  });

  r.get('/v1/historico', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const linhas = db.prepare(`
      SELECT s.id, s.aula_id, s.aula_versao, s.iniciada_em_ms, s.finalizada_em_ms, s.estado_json, a.titulo
      FROM sessoes s JOIN aulas a ON a.id = s.aula_id
      WHERE s.aluno_id = ? ORDER BY s.iniciada_em_ms DESC LIMIT 50`).all(quem.id) as any[];

    return {
      sessoes: linhas.map(l => {
        const e = json<any>(l.estado_json, {});
        return {
          id: l.id,
          aulaId: l.aula_id,
          titulo: l.titulo,
          aulaVersao: l.aula_versao,
          iniciadaEmMs: l.iniciada_em_ms,
          finalizadaEmMs: l.finalizada_em_ms,
          estado: e.estado,
          motivoFinal: e.motivoFinal,
          // Constância vem do histórico real, nunca de número gerado.
          etapasCreditadas: (e.etapasCreditadas ?? []).length,
          tempoAtivoMs: e.relogios?.ativoMs ?? 0,
        };
      }),
    };
  });
}
