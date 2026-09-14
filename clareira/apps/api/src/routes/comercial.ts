import type { Banco } from '../db/index.js';
import { Roteador, erros, texto } from '../lib/http.js';
import { autenticar, registrarAuditoria } from '../lib/auth.js';
import {
  AVISOS_OBRIGATORIOS, CAPACIDADES_UNIVERSAIS, CATALOGO_VERSAO, PLANOS,
  cenarioBase, cenarioEstresse, decidir, precisaAvisar, simular,
  type Assinatura, type Capacidade,
} from '@clareira/domain';

/**
 * Módulo comercial.
 *
 * ESTADO REAL: nenhum provedor de pagamento está configurado. O que existe é o
 * adaptador, o catálogo versionado, os entitlements no servidor e os testes. A
 * API recusa explicitamente qualquer tentativa de cobrança (seção 24.7: sem
 * credenciais, entregar adaptador e pendências precisas — não simular).
 */

export function assinaturaDe(db: Banco, alunoId: string): Assinatura {
  const a = db.prepare('SELECT * FROM assinaturas WHERE aluno_id = ?').get(alunoId) as any;
  if (!a) {
    return { alunoId, planoId: null, estado: 'sem_assinatura', validaAteMs: null, catalogoVersao: CATALOGO_VERSAO };
  }
  return {
    alunoId,
    planoId: a.plano_id,
    estado: a.estado,
    validaAteMs: a.valida_ate_ms,
    catalogoVersao: a.catalogo_versao,
  };
}

function consumoDoCiclo(db: Banco, alunoId: string, agoraMs: number): Record<string, number> {
  const ciclo = new Date(agoraMs).toISOString().slice(0, 7); // AAAA-MM
  const linhas = db.prepare('SELECT capacidade, quantidade FROM consumo_do_ciclo WHERE aluno_id = ? AND ciclo = ?')
    .all(alunoId, ciclo) as any[];
  return Object.fromEntries(linhas.map(l => [l.capacidade, l.quantidade]));
}

/**
 * Verificação de entitlement. É esta função — e não a interface — que decide.
 * Chamada em toda rota que toca capacidade paga, inclusive acesso direto à API.
 */
export function exigirCapacidade(db: Banco, alunoId: string, capacidade: Capacidade, agoraMs: number) {
  const d = decidir({
    assinatura: assinaturaDe(db, alunoId),
    capacidade,
    consumo: consumoDoCiclo(db, alunoId, agoraMs),
    agoraMs,
  });
  if (!d.permitido) {
    throw erros.semPermissao(
      d.motivo === 'cota_esgotada'
        ? `Sua franquia deste ciclo terminou. ${d.alternativaSempreDisponivel}`
        : `Seu plano não inclui este recurso. ${d.alternativaSempreDisponivel}`,
    );
  }
  return d;
}

export function rotasComerciais(r: Roteador, db: Banco): void {
  r.get('/v1/planos', () => ({
    catalogoVersao: CATALOGO_VERSAO,
    /** A interface é obrigada a exibir estes avisos. */
    avisos: AVISOS_OBRIGATORIOS,
    /** Nunca dependem de pagar mais. */
    capacidadesUniversais: CAPACIDADES_UNIVERSAIS,
    planos: PLANOS.map(p => ({
      id: p.id,
      nome: p.nome,
      precoCentavos: p.precoCentavos,
      moeda: p.moeda,
      periodo: p.periodo,
      hipotese: p.hipotese,
      capacidades: p.capacidades,
      cotas: p.cotas,
      recomendadoPara: p.recomendadoPara,
      justificativaDaRecomendacao: p.justificativaDaRecomendacao,
    })),
    /**
     * Estado honesto da operação comercial. Nenhum checkout existe.
     * "Mais escolhido" não aparece: não há dado real que sustente.
     */
    operacao: {
      cobrancaHabilitada: false,
      provedor: null,
      motivo: 'Nenhum provedor de pagamento foi configurado e nenhum preço foi aprovado.',
    },
  }));

  r.get('/v1/entitlements', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();

    const assinatura = assinaturaDe(db, quem.id);
    const consumo = consumoDoCiclo(db, quem.id, ctx.agoraMs);
    const todas: Capacidade[] = [
      'aulas_publicadas', 'programas', 'explicacoes', 'historico', 'recomendacao_por_regras',
      'motor_de_sessao', 'continuidade_entre_dispositivos', 'conquistas_digitais',
      'assistencia_generativa', 'assistencia_voz', 'personalizacao_ampliada',
      'receitas_revisadas', 'avaliacao_corporal_manual', 'visao_experimental',
      'beneficio_fisico_quando_houver_programa',
    ];

    return {
      assinatura,
      capacidades: Object.fromEntries(
        todas.map(c => {
          const d = decidir({ assinatura, capacidade: c, consumo, agoraMs: ctx.agoraMs });
          return [c, {
            permitido: d.permitido,
            motivo: d.motivo,
            restante: d.restante,
            unidade: d.cota?.unidade,
            // Aviso antecipado: o cliente sabe antes de acabar (seção 24.4).
            avisar: precisaAvisar(d),
          }];
        }),
      ),
    };
  });

  /**
   * Tentativa de contratação. Recusa deliberada e explícita: o produto não
   * abre um checkout de mentira nem simula assinatura ativa.
   */
  r.post('/v1/assinatura/contratar', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    const planoId = texto(ctx.corpo, 'planoId', { max: 40 });
    registrarAuditoria(db, { atorId: quem.id, acao: 'tentou_contratar', objeto: 'assinatura', objetoId: planoId, correlacao: ctx.correlacao, agoraMs: ctx.agoraMs });

    throw erros.conflito(
      'A contratação não está disponível: nenhum preço foi aprovado e nenhum provedor de pagamento está configurado.',
      {
        pendencias: [
          'Aprovar preço, moeda, período e condições da oferta.',
          'Configurar provedor de pagamento com credenciais no servidor.',
          'Implementar confirmação por webhook assinado, com idempotência e reconciliação.',
          'Revisar termos, política de privacidade e regras de cancelamento.',
        ],
        adaptadorPronto: true,
      },
    );
  });

  /**
   * Simulador econômico interno. Nunca exposto ao aluno: exige papel de
   * administração. Entradas editáveis, lacunas marcadas, conclusão condicional.
   */
  r.post('/v1/interno/simulador', ctx => {
    const quem = autenticar(db, ctx.token, ctx.agoraMs);
    if (!quem) throw erros.naoAutenticado();
    if (!quem.papeis.includes('admin')) throw erros.semPermissao('O simulador é interno.');

    const entrada = (ctx.corpo ?? {}) as any;
    const base = entrada.cenario === 'estresse' ? cenarioEstresse() : cenarioBase();

    // Permite sobrepor qualquer entrada — é um simulador, não uma tabela fixa.
    const params = entrada.sobrepor ? { ...base, ...entrada.sobrepor } : base;
    const resultado = simular(params);

    return {
      resultado,
      leitura: {
        conclusao: resultado.conclusaoIncondicional
          ? 'Todas as rubricas foram informadas.'
          : 'Conclusão CONDICIONAL: há custos não informados. Os números abaixo mudam quando eles entrarem.',
        lacunas: resultado.lacunas,
        avisos: resultado.avisos,
      },
    };
  });
}
