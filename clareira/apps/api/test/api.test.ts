import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import Database from 'better-sqlite3';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { criarServidor } from '../src/app.js';
import { derivarSenha } from '../src/lib/auth.js';
import type { Etapa } from '@clareira/domain';

/**
 * Testes de integração da API contra um banco em memória.
 *
 * Exercitam as mesmas rotas do servidor real (nenhuma segunda implementação) e
 * cobrem os cenários de aceite da seção 25.2 do briefing.
 */

const aqui = dirname(fileURLToPath(import.meta.url));
let servidor: Server;
let base: string;
let db: Database.Database;

const AGORA = Date.now();

function migrarEmMemoria(): Database.Database {
  const d = new Database(':memory:');
  d.pragma('foreign_keys = ON');
  const dir = resolve(aqui, '../src/db/migrations');
  for (const f of readdirSync(dir).filter(x => x.endsWith('.sql')).sort()) {
    d.exec(readFileSync(join(dir, f), 'utf8'));
  }
  return d;
}

function semear(d: Database.Database): void {
  const cria = (id: string, email: string, nome: string, papeis: string[]) => {
    const { hash, salt } = derivarSenha('senha-de-teste-123');
    d.prepare(
      `INSERT INTO usuarios (id, email, nome, senha_hash, senha_salt, fuso, criado_em_ms, demo)
       VALUES (?,?,?,?,?, 'America/Sao_Paulo', ?, 1)`,
    ).run(id, email, nome, hash, salt, AGORA);
    for (const p of papeis) d.prepare('INSERT INTO papeis (usuario_id, papel) VALUES (?,?)').run(id, p);
    d.prepare(
      `INSERT INTO assinaturas (aluno_id, plano_id, estado, valida_ate_ms, catalogo_versao, atualizado_em_ms)
       VALUES (?, 'essencial', 'ativa', ?, '2026-09-14.1', ?)`,
    ).run(id, AGORA + 30 * 86_400_000, AGORA);
  };

  cria('u_a', 'a@teste.local', 'Aluna A', ['aluno']);
  cria('u_b', 'b@teste.local', 'Aluna B', ['aluno']);
  cria('u_ed', 'ed@teste.local', 'Editor', ['aluno', 'editor']);

  d.prepare(`INSERT INTO professores (id, usuario_id, nome, especialidades, apresentacao)
             VALUES ('p1', NULL, 'Professor de teste', '[]', '')`).run();
  d.prepare(`INSERT INTO midias (id, webm_url, mp4_url, poster_url, duracao_ms, largura, altura, origem, licenca, ilustrativo, processamento)
             VALUES ('m1','/a.webm','/a.mp4','/a.jpg', 600000, 1280, 720, 'teste', 'teste', 1, 'pronto')`).run();
  d.prepare(`INSERT INTO midias (id, webm_url, mp4_url, poster_url, duracao_ms, largura, altura, origem, licenca, ilustrativo, processamento)
             VALUES ('m_incompleta','/b.webm','/b.mp4','/b.jpg', 600000, 1280, 720, 'teste', 'teste', 1, 'transcodificando')`).run();

  const etapas: Etapa[] = [
    { id: 'prep', tipo: 'preparacao', rotulo: 'Preparação', inicioMs: 0, fimMs: 60_000, creditavel: false },
    { id: 's1', tipo: 'serie', rotulo: 'Série 1', inicioMs: 60_000, fimMs: 300_000, exercicioId: 'ex1', creditavel: true },
    { id: 'fim', tipo: 'encerramento', rotulo: 'Fim', inicioMs: 300_000, fimMs: 600_000, creditavel: false },
  ];

  d.prepare(`INSERT INTO aulas (id, titulo, descricao, professor_id, duracao_ms, nivel, modalidade, equipamentos,
             espaco_minimo, impacto, estado, versao_publicada, midia_id, demonstracao_publica, criado_em_ms, atualizado_em_ms)
             VALUES ('aula_ok','Aula publicada','', 'p1', 600000, 'basico', 'Força', '[]', 'tapete', 'sem_saltos',
                     'publicada', 1, 'm1', 1, ?, ?)`).run(AGORA, AGORA);
  d.prepare(`INSERT INTO versoes_de_aula (aula_id, versao, midia_id, duracao_ms, etapas_json, publicada_em_ms, publicada_por)
             VALUES ('aula_ok', 1, 'm1', 600000, ?, ?, 'u_ed')`).run(JSON.stringify(etapas), AGORA);
  d.prepare(`INSERT INTO rascunhos_de_aula (aula_id, etapas_json, atualizado_em_ms, atualizado_por)
             VALUES ('aula_ok', ?, ?, 'u_ed')`).run(JSON.stringify(etapas), AGORA);

  // Aula em rascunho com mídia incompleta: para exercitar o bloqueio.
  d.prepare(`INSERT INTO aulas (id, titulo, descricao, professor_id, duracao_ms, nivel, modalidade, equipamentos,
             espaco_minimo, impacto, estado, versao_publicada, midia_id, demonstracao_publica, criado_em_ms, atualizado_em_ms)
             VALUES ('aula_rascunho','Rascunho','', 'p1', 600000, 'basico', 'Cardio', '[]', 'pequeno', 'baixo',
                     'rascunho', NULL, 'm_incompleta', 0, ?, ?)`).run(AGORA, AGORA);
}

async function chamar(caminho: string, opcoes: { metodo?: string; token?: string; corpo?: unknown } = {}) {
  const r = await fetch(`${base}${caminho}`, {
    method: opcoes.metodo ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(opcoes.token ? { authorization: `Bearer ${opcoes.token}` } : {}),
    },
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
  });
  return { status: r.status, corpo: (await r.json()) as any };
}

async function entrar(email: string): Promise<string> {
  const r = await chamar('/v1/acesso/entrar', { metodo: 'POST', corpo: { email, senha: 'senha-de-teste-123' } });
  return r.corpo.token as string;
}

beforeAll(async () => {
  db = migrarEmMemoria();
  semear(db);
  servidor = criarServidor(db, ['http://localhost:5273']);
  await new Promise<void>(res => servidor.listen(0, '127.0.0.1', res));
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>(res => servidor.close(() => res()));
  db.close();
});

describe('acesso', () => {
  it('não revela se a conta existe pela mensagem de erro', async () => {
    const inexistente = await chamar('/v1/acesso/entrar', { metodo: 'POST', corpo: { email: 'nao@existe.local', senha: 'qualquer-coisa' } });
    const senhaErrada = await chamar('/v1/acesso/entrar', { metodo: 'POST', corpo: { email: 'a@teste.local', senha: 'errada-mesmo-123' } });
    expect(inexistente.status).toBe(401);
    expect(senhaErrada.status).toBe(401);
    expect(inexistente.corpo.erro.mensagem).toBe(senhaErrada.corpo.erro.mensagem);
  });

  it('recuperação de acesso não finge ter enviado e-mail', async () => {
    const r = await chamar('/v1/acesso/recuperar', { metodo: 'POST', corpo: { email: 'a@teste.local' } });
    expect(r.corpo.integracaoDeEmail).toBe('pendente');
    expect(r.corpo.observacao).toContain('nenhuma mensagem foi enviada');
  });

  it('rota autenticada recusa sem token', async () => {
    expect((await chamar('/v1/hoje')).status).toBe(401);
  });
});

describe('isolamento entre alunos — acesso direto por ID na API', () => {
  it('uma aluna não lê a sessão de outra, mesmo com o ID em mãos', async () => {
    const tokenA = await entrar('a@teste.local');
    const tokenB = await entrar('b@teste.local');

    const criada = await chamar('/v1/sessoes', { metodo: 'POST', token: tokenA, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-a' } });
    expect(criada.status).toBe(200);
    const sessaoId = criada.corpo.sessao.id;

    const tentativa = await chamar(`/v1/sessoes/${sessaoId}`, { token: tokenB });
    // 404 e não 403: a existência da sessão alheia não é confirmada.
    expect(tentativa.status).toBe(404);
  });
});

describe('sessão — cenários de aceite da seção 25.2', () => {
  it('prévia pública não transfere timestamp: a sessão começa no início definido', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/sessoes', { metodo: 'POST', token, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-1' } });
    expect(r.corpo.sessao.relogios.posicaoMidiaMs).toBe(0);
    expect(r.corpo.sessao.estado).toBe('preparando');
    expect(r.corpo.sessao.etapasCreditadas).toEqual([]);
  });

  it('comando repetido não duplica nada', async () => {
    const token = await entrar('a@teste.local');
    const s = await chamar('/v1/sessoes', { metodo: 'POST', token, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-1' } });
    const id = s.corpo.sessao.id;

    const cmd = { id: 'cmd-unico-1', tipo: 'iniciar', dispositivoId: 'dev-1' };
    const p = await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: cmd });
    const q = await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: cmd });

    expect(p.corpo.duplicado).toBeUndefined();
    expect(q.corpo.duplicado).toBe(true);
    expect(q.corpo.sessao.versao).toBe(p.corpo.sessao.versao);
  });

  it('versão conflitante devolve 409 com a versão atual, para reconciliar', async () => {
    const token = await entrar('a@teste.local');
    const s = await chamar('/v1/sessoes', { metodo: 'POST', token, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-1' } });
    const id = s.corpo.sessao.id;
    await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: { id: 'c-a', tipo: 'iniciar', dispositivoId: 'dev-1' } });

    const obsoleto = await chamar(`/v1/sessoes/${id}/comandos`, {
      metodo: 'POST', token,
      corpo: { id: 'c-b', tipo: 'pausar', dispositivoId: 'dev-1', versaoEsperada: 1 },
    });
    expect(obsoleto.status).toBe(409);
    expect(obsoleto.corpo.erro.detalhe.versaoAtual).toBeGreaterThan(1);
  });

  it('encerrar parcialmente salva o que ocorreu sem fingir conclusão', async () => {
    const token = await entrar('a@teste.local');
    const s = await chamar('/v1/sessoes', { metodo: 'POST', token, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-1' } });
    const id = s.corpo.sessao.id;
    await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: { id: `${id}-1`, tipo: 'iniciar', dispositivoId: 'dev-1' } });
    const fim = await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: { id: `${id}-2`, tipo: 'encerrar_parcial', dispositivoId: 'dev-1' } });

    expect(fim.corpo.resumo.completa).toBe(false);
    expect(fim.corpo.resumo.etapasCreditadas).toBe(0);
  });

  it('o histórico reflete a sessão real, sem número inventado', async () => {
    const token = await entrar('a@teste.local');
    const h = await chamar('/v1/historico', { token });
    expect(Array.isArray(h.corpo.sessoes)).toBe(true);
    for (const s of h.corpo.sessoes) {
      expect(s.tempoAtivoMs).toBeGreaterThanOrEqual(0);
      expect(s.etapasCreditadas).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('recomendação do dia', () => {
  it('é estável: chamar de novo não troca o plano', async () => {
    const token = await entrar('a@teste.local');
    const um = await chamar('/v1/hoje', { token });
    const dois = await chamar('/v1/hoje', { token });
    expect(dois.corpo.aula.id).toBe(um.corpo.aula.id);
    expect(dois.corpo.persistida).toBe(true);
  });
});

describe('autoria — publicação é transição controlada', () => {
  it('bloqueia a publicação com motivo específico, e o editor continua editando', async () => {
    const token = await entrar('ed@teste.local');
    const r = await chamar('/v1/studio/aulas/aula_rascunho/publicar', { metodo: 'POST', token, corpo: {} });

    expect(r.status).toBe(409);
    const codigos = r.corpo.erro.detalhe.bloqueios.map((b: any) => b.codigo);
    expect(codigos).toContain('midia_incompleta'); // mídia ainda transcodificando
    expect(codigos).toContain('sem_etapas');
    expect(codigos).toContain('sem_revisao');
  });

  it('aluno comum não acessa o studio', async () => {
    const token = await entrar('a@teste.local');
    expect((await chamar('/v1/studio/aulas', { token })).status).toBe(403);
  });

  it('salvar rascunho com problema é permitido e devolve os problemas', async () => {
    const token = await entrar('ed@teste.local');
    const r = await chamar('/v1/studio/aulas/aula_rascunho/etapas', {
      metodo: 'PATCH', token,
      corpo: { etapas: [{ id: 'x', tipo: 'serie', rotulo: 'Invertida', inicioMs: 5000, fimMs: 1000, creditavel: true }] },
    });
    expect(r.corpo.salvo).toBe(true);
    expect(r.corpo.problemas[0]).toContain('termina antes de começar');
  });

  it('publicar cria versão imutável e preserva sessões em andamento', async () => {
    const tokenAluna = await entrar('a@teste.local');
    const s = await chamar('/v1/sessoes', { metodo: 'POST', token: tokenAluna, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-x' } });
    const sessaoId = s.corpo.sessao.id;
    expect(s.corpo.sessao.aulaVersao).toBe(1);

    const tokenEditor = await entrar('ed@teste.local');
    // A aula publicada precisa voltar a rascunho → revisão → aprovada para
    // ganhar uma versão nova; é justamente essa a transição controlada.
    await chamar('/v1/studio/aulas/aula_ok/estado', { metodo: 'POST', token: tokenEditor, corpo: { estado: 'rascunho' } });
    await chamar('/v1/studio/aulas/aula_ok/estado', { metodo: 'POST', token: tokenEditor, corpo: { estado: 'em_revisao' } });
    await chamar('/v1/studio/aulas/aula_ok/estado', { metodo: 'POST', token: tokenEditor, corpo: { estado: 'aprovada' } });
    const pub = await chamar('/v1/studio/aulas/aula_ok/publicar', { metodo: 'POST', token: tokenEditor, corpo: {} });

    expect(pub.status).toBe(200);
    expect(pub.corpo.versao).toBe(2);
    expect(pub.corpo.sessoesEmAndamentoPreservadas).toBeGreaterThan(0);

    // A sessão aberta continua na versão 1: editar não reescreveu a história.
    const depois = await chamar(`/v1/sessoes/${sessaoId}`, { token: tokenAluna });
    expect(depois.corpo.sessao.aulaVersao).toBe(1);
    expect(depois.corpo.aula.versao).toBe(1);
  });

  it('não é possível publicar mudando o estado direto para "publicada"', async () => {
    const token = await entrar('ed@teste.local');
    const r = await chamar('/v1/studio/aulas/aula_ok/estado', { metodo: 'POST', token, corpo: { estado: 'publicada' } });
    expect(r.status).toBe(422);
  });
});

describe('comercial', () => {
  it('o catálogo se declara como estudo e sem cobrança habilitada', async () => {
    const r = await chamar('/v1/planos');
    expect(r.corpo.operacao.cobrancaHabilitada).toBe(false);
    expect(r.corpo.avisos.precoEmEstudo).toContain('não realiza cobrança');
    for (const p of r.corpo.planos) expect(p.hipotese).toBe(true);
    // "Mais escolhido" não existe sem dado real.
    expect(JSON.stringify(r.corpo)).not.toContain('mais escolhido');
  });

  it('contratar é recusado explicitamente, com as pendências reais', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/assinatura/contratar', { metodo: 'POST', token, corpo: { planoId: 'completo' } });
    expect(r.status).toBe(409);
    expect(r.corpo.erro.detalhe.pendencias.length).toBeGreaterThan(0);
    expect(r.corpo.erro.detalhe.adaptadorPronto).toBe(true);
  });

  it('entitlement é decidido no servidor: Essencial não tem assistência generativa', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/entitlements', { token });
    expect(r.corpo.capacidades.aulas_publicadas.permitido).toBe(true);
    expect(r.corpo.capacidades.assistencia_generativa.permitido).toBe(false);
    expect(r.corpo.capacidades.assistencia_generativa.motivo).toBe('plano_nao_inclui');
    // Histórico e conquistas não dependem de plano.
    expect(r.corpo.capacidades.historico.permitido).toBe(true);
    expect(r.corpo.capacidades.conquistas_digitais.permitido).toBe(true);
  });

  it('o simulador é interno: aluno comum não acessa', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/interno/simulador', { metodo: 'POST', token, corpo: {} });
    expect(r.status).toBe(403);
  });
});

describe('conquistas', () => {
  it('a interface do aluno declara que nenhum benefício físico foi prometido', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/conquistas', { token });
    expect(r.corpo.regra.ofertaFisicaAtiva).toBe(false);
    expect(r.corpo.regra.aviso).toContain('Nenhuma campanha foi aberta');
  });

  it('cada marco explica o que falta, sem expor antifraude', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/conquistas', { token });
    for (const m of r.corpo.marcos) {
      expect(typeof m.explicacao).toBe('string');
      expect(m.explicacao.length).toBeGreaterThan(0);
      expect(m.explicacao.toLowerCase()).not.toContain('fraude');
      expect(m.explicacao.toLowerCase()).not.toContain('risco');
    }
  });

  it('o recurso registra e diz o estado real da revisão humana', async () => {
    const token = await entrar('a@teste.local');
    const r = await chamar('/v1/conquistas/recurso', { metodo: 'POST', token, corpo: { motivo: 'O vídeo travou e a aula não contou.' } });
    expect(r.corpo.ok).toBe(true);
    expect(r.corpo.revisaoHumana).toBe('pendente');
    expect(r.corpo.mensagem).toContain('sua aula não é afetada');
  });

  it('assistir sem creditar etapa não gera unidade de participação', async () => {
    const token = await entrar('b@teste.local');
    const s = await chamar('/v1/sessoes', { metodo: 'POST', token, corpo: { aulaId: 'aula_ok', dispositivoId: 'dev-b' } });
    const id = s.corpo.sessao.id;
    await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: { id: `${id}-i`, tipo: 'iniciar', dispositivoId: 'dev-b' } });
    await chamar(`/v1/sessoes/${id}/comandos`, { metodo: 'POST', token, corpo: { id: `${id}-f`, tipo: 'concluir', dispositivoId: 'dev-b' } });

    const c = await chamar('/v1/conquistas', { token });
    expect(c.corpo.progresso.diasDeParticipacao).toBe(0);
  });
});

describe('saúde e integrações', () => {
  it('declara cada integração externa como não configurada', async () => {
    const r = await chamar('/v1/saude');
    for (const estado of Object.values(r.corpo.integracoes)) {
      expect(estado).toBe('nao_configurado');
    }
  });
});
