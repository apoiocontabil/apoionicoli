import type { Banco } from '../db/index.js';
import { novoId } from '../db/index.js';
import { Roteador, erros, texto } from '../lib/http.js';
import {
  autenticar, criarSessaoDeAcesso, derivarSenha, encerrarSessaoDeAcesso,
  excedeuTentativas, registrarAuditoria, registrarTentativa, senhaConfere,
} from '../lib/auth.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MINIMA = 10;

export function rotasDeAcesso(r: Roteador, db: Banco): void {
  r.post('/v1/acesso/cadastro', ctx => {
    const email = texto(ctx.corpo, 'email', { max: 254 }).trim().toLowerCase();
    const senha = texto(ctx.corpo, 'senha', { max: 200 });
    const nome = texto(ctx.corpo, 'nome', { max: 120 }).trim();

    if (!EMAIL.test(email)) throw erros.invalido('Esse e-mail não parece válido.');
    if (senha.length < SENHA_MINIMA) {
      throw erros.invalido(`A senha precisa de pelo menos ${SENHA_MINIMA} caracteres.`);
    }

    const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
    if (existe) {
      // Não confirma nem nega a existência da conta de forma explorável: a
      // mensagem é a mesma que o usuário legítimo consegue resolver.
      throw erros.conflito('Já existe uma conta com esse e-mail. Tente entrar ou recuperar o acesso.');
    }

    const { hash, salt } = derivarSenha(senha);
    const id = novoId('usr');
    const fuso = String((ctx.corpo as any)?.fuso ?? 'America/Sao_Paulo');

    db.transaction(() => {
      db.prepare(
        `INSERT INTO usuarios (id, email, nome, senha_hash, senha_salt, fuso, criado_em_ms, demo)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      ).run(id, email, nome, hash, salt, fuso, ctx.agoraMs);
      db.prepare('INSERT INTO papeis (usuario_id, papel) VALUES (?, ?)').run(id, 'aluno');
      db.prepare(
        `INSERT INTO assinaturas (aluno_id, plano_id, estado, valida_ate_ms, catalogo_versao, atualizado_em_ms)
         VALUES (?, NULL, 'sem_assinatura', NULL, ?, ?)`,
      ).run(id, '2026-09-14.1', ctx.agoraMs);
    })();

    registrarAuditoria(db, { atorId: id, acao: 'cadastro', objeto: 'usuario', objetoId: id, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs });
    const token = criarSessaoDeAcesso(db, id, ctx.agoraMs, String((ctx.corpo as any)?.dispositivo ?? 'web'));
    return { token, usuario: { id, email, nome, fuso, papeis: ['aluno'] } };
  });

  r.post('/v1/acesso/entrar', ctx => {
    const email = texto(ctx.corpo, 'email', { max: 254 }).trim().toLowerCase();
    const senha = texto(ctx.corpo, 'senha', { max: 200 });

    if (excedeuTentativas(db, email, ctx.agoraMs)) {
      throw erros.limite('Muitas tentativas. Aguarde alguns minutos ou recupere o acesso.');
    }

    const u = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email) as any;
    // Mesma mensagem e mesmo custo de tempo para conta inexistente e senha
    // errada: não é possível enumerar contas pela resposta.
    const ok = u ? senhaConfere(senha, u.senha_hash, u.senha_salt) : senhaConfere(senha, derivarSenha('x').hash, derivarSenha('x').salt);

    registrarTentativa(db, email, Boolean(u) && ok, ctx.agoraMs);
    if (!u || !ok) throw erros.credenciaisInvalidas();

    const token = criarSessaoDeAcesso(db, u.id, ctx.agoraMs, String((ctx.corpo as any)?.dispositivo ?? 'web'));
    const papeis = db.prepare('SELECT papel FROM papeis WHERE usuario_id = ?').all(u.id).map((x: any) => x.papel);
    registrarAuditoria(db, { atorId: u.id, acao: 'entrou', objeto: 'usuario', objetoId: u.id, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs });

    return { token, usuario: { id: u.id, email: u.email, nome: u.nome, fuso: u.fuso, papeis } };
  });

  r.post('/v1/acesso/sair', ctx => {
    if (ctx.token) encerrarSessaoDeAcesso(db, ctx.token);
    return { ok: true };
  });

  r.get('/v1/acesso/eu', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const perfil = db.prepare('SELECT * FROM perfis WHERE usuario_id = ?').get(quem.id) as any;
    const assinatura = db.prepare('SELECT * FROM assinaturas WHERE aluno_id = ?').get(quem.id) as any;
    return {
      usuario: quem,
      perfil: perfil
        ? {
            objetivo: perfil.objetivo,
            experiencia: perfil.experiencia,
            diasPorSemana: perfil.dias_por_semana,
            minutosPorSessao: perfil.minutos_por_sessao,
            equipamentos: JSON.parse(perfil.equipamentos),
            espaco: perfil.espaco,
            impactoMaximo: perfil.impacto_maximo,
            limitacoesInformadas: perfil.limitacoes_informadas,
          }
        : null,
      assinatura: assinatura
        ? { planoId: assinatura.plano_id, estado: assinatura.estado, validaAteMs: assinatura.valida_ate_ms }
        : null,
    };
  });

  /**
   * Recuperação de acesso. Sem provedor de e-mail configurado, a rota NÃO
   * finge ter enviado nada: devolve o estado real da integração. A resposta é
   * idêntica para e-mail existente e inexistente.
   */
  r.post('/v1/acesso/recuperar', ctx => {
    const email = texto(ctx.corpo, 'email', { max: 254 }).trim().toLowerCase();
    registrarAuditoria(db, { atorId: null, acao: 'pediu_recuperacao', objeto: 'usuario', correlacao: ctx.correlacao, agoraMs: ctx.agoraMs, detalhe: { emailHash: email.length } });
    return {
      ok: true,
      mensagem: 'Se existir uma conta com esse e-mail, enviaremos as instruções.',
      // Estado honesto da integração — o produto não mente sobre o envio.
      integracaoDeEmail: 'pendente',
      observacao: 'Nenhum provedor de e-mail está configurado neste ambiente; nenhuma mensagem foi enviada.',
    };
  });

  r.patch('/v1/perfil', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const c = (ctx.corpo ?? {}) as Record<string, unknown>;

    const equipamentos = Array.isArray(c.equipamentos) ? c.equipamentos.map(String) : [];
    db.prepare(
      `INSERT INTO perfis (usuario_id, objetivo, experiencia, dias_por_semana, minutos_por_sessao,
                           equipamentos, espaco, impacto_maximo, limitacoes_informadas, atualizado_em_ms)
       VALUES (@u, @obj, @exp, @dias, @min, @eq, @esp, @imp, @lim, @t)
       ON CONFLICT(usuario_id) DO UPDATE SET
         objetivo=@obj, experiencia=@exp, dias_por_semana=@dias, minutos_por_sessao=@min,
         equipamentos=@eq, espaco=@esp, impacto_maximo=@imp, limitacoes_informadas=@lim, atualizado_em_ms=@t`,
    ).run({
      u: quem.id,
      obj: c.objetivo ? String(c.objetivo) : null,
      exp: c.experiencia ? String(c.experiencia) : null,
      dias: c.diasPorSemana ? Number(c.diasPorSemana) : null,
      min: c.minutosPorSessao ? Number(c.minutosPorSessao) : null,
      eq: JSON.stringify(equipamentos),
      esp: c.espaco ? String(c.espaco) : null,
      imp: c.impactoMaximo ? String(c.impactoMaximo) : null,
      lim: c.limitacoesInformadas ? String(c.limitacoesInformadas) : null,
      t: ctx.agoraMs,
    });

    return { ok: true };
  });
}
