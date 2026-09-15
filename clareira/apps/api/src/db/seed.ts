import { abrir, fechar } from './index.js';
import { derivarSenha } from '../lib/auth.js';
import { CATALOGO_VERSAO, type Etapa } from '@clareira/domain';

/**
 * Dados de demonstração — SOMENTE desenvolvimento.
 *
 * Regras que este arquivo respeita (seções 9, 20 e 25):
 *  · Toda mídia é stock ILUSTRATIVO e está marcada como tal. Nenhuma dessas
 *    pessoas é professora da plataforma ou aluna satisfeita.
 *  · Os professores são FICTÍCIOS e identificados como tais. Nenhuma credencial
 *    inventada é apresentada como verificada.
 *  · As contas demo não recebem nenhum privilégio especial: têm papel normal e
 *    passam pela mesma autenticação.
 *  · As instruções de exercício estão marcadas como NÃO revisadas, porque não
 *    foram revisadas por profissional habilitado.
 */

if (process.env.NODE_ENV === 'production') {
  console.error('Recusando rodar seeds de demonstração em produção.');
  process.exit(1);
}

const db = abrir();
const agora = Date.now();
const M = '/media';

const LICENCA_MIXKIT = 'Mixkit Free License (rótulo da página do item; texto integral pendente de arquivamento — ver docs/MEDIA-SOURCES.md)';

function limpar() {
  const tabelas = [
    'comandos_de_sessao', 'sessoes', 'recomendacoes_do_dia', 'agendamentos',
    'ledger_conquistas', 'consumo_do_ciclo', 'eventos_de_pagamento', 'assinaturas',
    'medidas_corporais', 'consentimentos', 'perfis', 'programa_aulas', 'programas',
    'versoes_de_aula', 'rascunhos_de_aula', 'aulas', 'exercicios', 'midias',
    'professores', 'papeis', 'sessoes_de_acesso', 'tentativas_de_acesso', 'auditoria', 'usuarios',
  ];
  for (const t of tabelas) db.prepare(`DELETE FROM ${t}`).run();
}

function usuario(id: string, email: string, nome: string, senha: string, papeis: string[]) {
  const { hash, salt } = derivarSenha(senha);
  db.prepare(
    `INSERT INTO usuarios (id, email, nome, senha_hash, senha_salt, fuso, criado_em_ms, demo)
     VALUES (?, ?, ?, ?, ?, 'America/Sao_Paulo', ?, 1)`,
  ).run(id, email, nome, hash, salt, agora);
  for (const p of papeis) db.prepare('INSERT INTO papeis (usuario_id, papel) VALUES (?, ?)').run(id, p);
}

const semear = db.transaction(() => {
  limpar();

  // --- Contas de demonstração --------------------------------------------
  usuario('usr_aluna', 'aluna@exemplo.local', 'Aluna de demonstração', 'clareira-demo-2026', ['aluno']);
  usuario('usr_instrutor', 'instrutor@exemplo.local', 'Instrutor de demonstração', 'clareira-demo-2026', ['aluno', 'instrutor']);
  usuario('usr_editor', 'editor@exemplo.local', 'Editor de demonstração', 'clareira-demo-2026', ['aluno', 'editor']);
  usuario('usr_admin', 'admin@exemplo.local', 'Administração de demonstração', 'clareira-demo-2026', ['aluno', 'admin']);

  db.prepare(
    `INSERT INTO perfis (usuario_id, objetivo, experiencia, dias_por_semana, minutos_por_sessao,
                         equipamentos, espaco, impacto_maximo, limitacoes_informadas, atualizado_em_ms)
     VALUES ('usr_aluna', 'retomar uma rotina', 'iniciante', 3, 20, '[]', 'pequeno', 'baixo', NULL, ?)`,
  ).run(agora);

  for (const id of ['usr_aluna', 'usr_instrutor', 'usr_editor', 'usr_admin']) {
    db.prepare(
      `INSERT INTO assinaturas (aluno_id, plano_id, estado, valida_ate_ms, catalogo_versao, atualizado_em_ms)
       VALUES (?, 'essencial', 'ativa', ?, ?, ?)`,
    ).run(id, agora + 30 * 24 * 3_600_000, CATALOGO_VERSAO, agora);
  }
  // A conta de admin tem o plano Completo apenas para exercitar entitlements.
  db.prepare(`UPDATE assinaturas SET plano_id = 'completo' WHERE aluno_id = 'usr_admin'`).run();

  // --- Professores (FICTÍCIOS, identificados) -----------------------------
  db.prepare(
    `INSERT INTO professores (id, usuario_id, nome, especialidades, apresentacao, foto_url)
     VALUES (?, ?, ?, ?, ?, NULL)`,
  ).run(
    'prof_1', 'usr_instrutor', 'Professor de demonstração',
    JSON.stringify(['força com peso corporal', 'mobilidade']),
    'Perfil fictício criado para desenvolvimento. Nenhuma credencial real está representada aqui. ' +
    'Será substituído pelo time real antes de qualquer publicação.',
  );

  // --- Mídia (stock ilustrativo, procedência registrada) -------------------
  const midias: Array<[string, string, string, string, string | null, string | null, string | null, number, number, number, string]> = [
    ['mid_sala', `${M}/sala-16x9.webm`, `${M}/sala-16x9.mp4`, `${M}/sala-16x9.jpg`,
      `${M}/sala-9x16.webm`, `${M}/sala-9x16.mp4`, `${M}/sala-9x16.jpg`,
      14_180, 1280, 720, 'Mixkit 42898 — Woman exercising in her living room'],
    ['mid_aula', `${M}/aula-16x9.webm`, `${M}/aula-16x9.mp4`, `${M}/aula-16x9.jpg`,
      `${M}/aula-9x16.webm`, `${M}/aula-9x16.mp4`, `${M}/aula-9x16.jpg`,
      6_400, 1280, 720, 'Mixkit 5061 — Woman following an online workout class (entrada em 3,6 s)'],
    ['mid_mobilidade', `${M}/mobilidade-9x16.webm`, `${M}/mobilidade-9x16.mp4`, `${M}/mobilidade-9x16.jpg`,
      null, null, null, 10_220, 720, 1280, 'Mixkit 4942 — Girl doing stretching indoors (correção de cor declarada)'],
  ];
  for (const m of midias) {
    db.prepare(
      `INSERT INTO midias (id, webm_url, mp4_url, poster_url, vertical_webm_url, vertical_mp4_url,
                           vertical_poster_url, duracao_ms, largura, altura, origem, licenca, ilustrativo, processamento)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,'pronto')`,
    ).run(...m, LICENCA_MIXKIT);
  }

  // --- Exercícios (instruções NÃO revisadas — marcado) ---------------------
  const exercicios = [
    ['ex_agachamento', 'Agachamento livre',
      ['Pés na largura dos ombros.', 'Desça empurrando o quadril para trás.', 'Desça até onde for confortável.', 'Suba empurrando o chão.'],
      'Inspire ao descer, solte o ar ao subir.',
      ['Joelho colapsando para dentro.', 'Calcanhar saindo do chão.'],
      ['Agachar até uma cadeira.', 'Reduzir a amplitude.'],
      ['Aumentar a pausa embaixo.', 'Agachamento em apoio unilateral.'],
      ['Se doer o joelho, reduza a amplitude e procure orientação.'],
      ['quadríceps', 'glúteo']],
    ['ex_afundo', 'Afundo alternado',
      ['Um pé à frente, outro atrás.', 'Desça a perna de trás em direção ao chão.', 'Volte empurrando o pé da frente.'],
      'Solte o ar ao subir.',
      ['Tronco caindo para frente.', 'Passo curto demais.'],
      ['Apoiar a mão numa parede.', 'Reduzir a descida.'],
      ['Aumentar o tempo sob tensão.'],
      ['Evite se houver dor em joelho ou tornozelo sem orientação.'],
      ['quadríceps', 'glúteo', 'estabilizadores']],
    ['ex_alongamento', 'Alongamento sentado',
      ['Sente com as pernas estendidas.', 'Leve o tronco à frente sem forçar.', 'Respire e permaneça.'],
      'Respiração lenta e contínua.',
      ['Puxar com força até doer.', 'Prender a respiração.'],
      ['Flexionar levemente os joelhos.'],
      ['Aumentar o tempo de permanência.'],
      ['Alongamento não deve causar dor aguda.'],
      ['posterior de coxa', 'lombar']],
  ];
  for (const [id, nome, passos, resp, erros, reg, prog, cuid, musc] of exercicios) {
    db.prepare(
      `INSERT INTO exercicios (id, nome, passo_a_passo, respiracao, erros_comuns, regressoes, progressoes,
                               cuidados, musculos, revisado_por, revisado_em_ms)
       VALUES (?,?,?,?,?,?,?,?,?, NULL, NULL)`,
    ).run(id, nome, JSON.stringify(passos), resp, JSON.stringify(erros), JSON.stringify(reg),
          JSON.stringify(prog), JSON.stringify(cuid), JSON.stringify(musc));
  }

  // --- Aulas ---------------------------------------------------------------
  interface Def { id: string; titulo: string; descricao: string; dur: number; nivel: string; mod: string; eq: string[]; esp: string; imp: string; midia: string; demo: boolean; etapas: Etapa[]; publicar: boolean }

  const etapasForca = (dur: number): Etapa[] => [
    { id: 'prep', tipo: 'preparacao', rotulo: 'Preparação', inicioMs: 0, fimMs: Math.round(dur * 0.1), creditavel: false },
    { id: 'demo1', tipo: 'demonstracao', rotulo: 'Agachamento — como fazer', inicioMs: Math.round(dur * 0.1), fimMs: Math.round(dur * 0.2), exercicioId: 'ex_agachamento', creditavel: false },
    { id: 'serie1', tipo: 'serie', rotulo: 'Agachamento — série 1', inicioMs: Math.round(dur * 0.2), fimMs: Math.round(dur * 0.45), exercicioId: 'ex_agachamento', creditavel: true, alternativas: ['alt1'] },
    { id: 'alt1', tipo: 'alternativa', rotulo: 'Agachamento na cadeira', inicioMs: Math.round(dur * 0.2), fimMs: Math.round(dur * 0.45), exercicioId: 'ex_agachamento', creditavel: true },
    { id: 'desc1', tipo: 'descanso', rotulo: 'Descanso', inicioMs: Math.round(dur * 0.45), fimMs: Math.round(dur * 0.55), duracaoPrescritaMs: Math.round(dur * 0.1), creditavel: false },
    { id: 'serie2', tipo: 'serie', rotulo: 'Afundo — série 1', inicioMs: Math.round(dur * 0.55), fimMs: Math.round(dur * 0.85), exercicioId: 'ex_afundo', creditavel: true },
    { id: 'fim', tipo: 'encerramento', rotulo: 'Desaceleração', inicioMs: Math.round(dur * 0.85), fimMs: dur, creditavel: false },
  ];

  const defs: Def[] = [
    { id: 'aula_forca_12', titulo: 'Força para pernas em 12 minutos', descricao: 'Uma sequência curta de força para pernas, com peso do corpo, que cabe num tapete.', dur: 12 * 60_000, nivel: 'basico', mod: 'Força com peso do corpo', eq: [], esp: 'tapete', imp: 'sem_saltos', midia: 'mid_sala', demo: true, etapas: etapasForca(12 * 60_000), publicar: true },
    { id: 'aula_forca_20', titulo: 'Corpo inteiro em 20 minutos', descricao: 'Força de corpo inteiro sem equipamento, com alternativas mais fáceis em cada série.', dur: 20 * 60_000, nivel: 'basico', mod: 'Força com peso do corpo', eq: [], esp: 'pequeno', imp: 'baixo', midia: 'mid_sala', demo: false, etapas: etapasForca(20 * 60_000), publicar: true },
    { id: 'aula_mob_10', titulo: 'Mobilidade e respiração em 10 minutos', descricao: 'Uma sessão calma de mobilidade para abrir o dia ou encerrar o treino.', dur: 10 * 60_000, nivel: 'iniciacao', mod: 'Mobilidade', eq: [], esp: 'tapete', imp: 'sem_saltos', midia: 'mid_mobilidade', demo: false, etapas: [
      { id: 'prep', tipo: 'preparacao', rotulo: 'Preparação', inicioMs: 0, fimMs: 60_000, creditavel: false },
      { id: 'along', tipo: 'serie', rotulo: 'Alongamento sentado', inicioMs: 60_000, fimMs: 8 * 60_000, exercicioId: 'ex_alongamento', creditavel: true },
      { id: 'fim', tipo: 'encerramento', rotulo: 'Respiração final', inicioMs: 8 * 60_000, fimMs: 10 * 60_000, creditavel: false },
    ], publicar: true },
    // Rascunho de propósito: exercita o bloqueio de publicação no Studio.
    { id: 'aula_rascunho', titulo: 'Cardio leve em 15 minutos (rascunho)', descricao: 'Em construção. Serve para demonstrar o bloqueio específico de publicação.', dur: 15 * 60_000, nivel: 'basico', mod: 'Cardio', eq: [], esp: 'pequeno', imp: 'baixo', midia: 'mid_aula', demo: false, etapas: [], publicar: false },
  ];

  for (const d of defs) {
    db.prepare(
      `INSERT INTO aulas (id, titulo, descricao, professor_id, duracao_ms, nivel, modalidade, equipamentos,
                          espaco_minimo, impacto, estado, versao_publicada, midia_id, demonstracao_publica,
                          criado_em_ms, atualizado_em_ms)
       VALUES (?,?,?, 'prof_1', ?,?,?,?,?,?, ?, ?, ?, ?, ?, ?)`,
    ).run(d.id, d.titulo, d.descricao, d.dur, d.nivel, d.mod, JSON.stringify(d.eq), d.esp, d.imp,
          d.publicar ? 'publicada' : 'rascunho', d.publicar ? 1 : null, d.midia, d.demo ? 1 : 0, agora, agora);

    db.prepare(
      `INSERT INTO rascunhos_de_aula (aula_id, etapas_json, atualizado_em_ms, atualizado_por)
       VALUES (?, ?, ?, 'usr_instrutor')`,
    ).run(d.id, JSON.stringify(d.etapas), agora);

    if (d.publicar) {
      db.prepare(
        `INSERT INTO versoes_de_aula (aula_id, versao, midia_id, duracao_ms, etapas_json, publicada_em_ms, publicada_por)
         VALUES (?, 1, ?, ?, ?, ?, 'usr_editor')`,
      ).run(d.id, d.midia, d.dur, JSON.stringify(d.etapas), agora);
    }
  }

  // --- Programas -----------------------------------------------------------
  db.prepare(
    `INSERT INTO programas (id, titulo, objetivo, nivel, semanas, sessoes_por_semana, equipamentos,
                            pre_requisitos, professor_id, o_que_aprende)
     VALUES (?,?,?,?,?,?,?,?, 'prof_1', ?)`,
  ).run(
    'prog_retomada', 'Retomada em 4 semanas',
    'Voltar a treinar sem pressa, construindo constância antes de intensidade.',
    'iniciacao', 4, 3, JSON.stringify([]), JSON.stringify([]),
    JSON.stringify(['Agachar com segurança', 'Organizar 3 sessões por semana', 'Reconhecer quando reduzir a intensidade']),
  );
  db.prepare(
    `INSERT INTO programas (id, titulo, objetivo, nivel, semanas, sessoes_por_semana, equipamentos,
                            pre_requisitos, professor_id, o_que_aprende)
     VALUES (?,?,?,?,?,?,?,?, 'prof_1', ?)`,
  ).run(
    'prog_forca', 'Força em casa, 8 semanas',
    'Progredir em força usando o peso do corpo e o espaço que você tem.',
    'basico', 8, 3, JSON.stringify([]), JSON.stringify(['Conseguir agachar sem dor']),
    JSON.stringify(['Progressões de agachamento e afundo', 'Como ajustar carga sem equipamento', 'Quando descansar']),
  );

  const vinculos: Array<[string, string, number]> = [
    ['prog_retomada', 'aula_mob_10', 0],
    ['prog_retomada', 'aula_forca_12', 1],
    ['prog_forca', 'aula_forca_12', 0],
    ['prog_forca', 'aula_forca_20', 1],
  ];
  for (const [p, a, o] of vinculos) {
    db.prepare('INSERT INTO programa_aulas (programa_id, aula_id, ordem) VALUES (?,?,?)').run(p, a, o);
  }
});

semear();

console.log('Seeds de demonstração aplicados.');
console.log('');
console.log('  Contas (senha: clareira-demo-2026)');
console.log('    aluna@exemplo.local       — aluno, plano Essencial');
console.log('    instrutor@exemplo.local   — autoria');
console.log('    editor@exemplo.local      — revisão e publicação');
console.log('    admin@exemplo.local       — administração, plano Completo');
console.log('');
console.log('  Todo o conteúdo é de demonstração. Professores são fictícios,');
console.log('  a mídia é stock ilustrativo e as instruções NÃO foram revisadas');
console.log('  por profissional habilitado.');

fechar();
