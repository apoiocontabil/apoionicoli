/**
 * Catálogo comercial versionado.
 *
 * AVISO QUE NÃO PODE SAIR DAQUI: nenhum preço deste arquivo é uma oferta
 * aprovada. São as hipóteses da seção 24 do briefing, para protótipo e
 * pesquisa. `publicavel: false` em todo o catálogo significa que a interface
 * mostra os planos como ESTUDO, com o aviso correspondente, e que nenhum
 * caminho de cobrança real está ligado.
 *
 * Centralizar nomes, preços por moeda/canal, períodos, trial, benefícios,
 * cotas e disponibilidade aqui é exigência da seção 24.7. Os entitlements são
 * derivados deste catálogo NO SERVIDOR — bloqueio visual não é segurança.
 */

/** Nome de trabalho da marca. Substituível sem tocar em nenhum outro arquivo. */
export const MARCA = {
  nome: 'Clareira',
  /** Frase de posicionamento em desenvolvimento, não identidade final. */
  posicionamento: 'Seu treino, no seu tempo.',
  /** Nenhum domínio foi registrado; este campo existe para configuração. */
  dominio: null as string | null,
} as const;

export type Capacidade =
  | 'aulas_publicadas'
  | 'programas'
  | 'explicacoes'
  | 'historico'
  | 'recomendacao_por_regras'
  | 'motor_de_sessao'
  | 'continuidade_entre_dispositivos'
  | 'conquistas_digitais'
  | 'assistencia_generativa'
  | 'assistencia_voz'
  | 'personalizacao_ampliada'
  | 'receitas_revisadas'
  | 'avaliacao_corporal_manual'
  | 'visao_experimental'
  | 'beneficio_fisico_quando_houver_programa';

export interface Cota {
  capacidade: Capacidade;
  /** Unidade compreensível para o cliente ANTES da compra (seção 24.4). */
  unidade: string;
  incluido: number;
  /** Excedente exige adesão explícita; nunca é debitado automaticamente. */
  excedenteDisponivel: boolean;
}

export interface Plano {
  id: string;
  nome: string;
  /** Em centavos, para evitar aritmética de ponto flutuante com dinheiro. */
  precoCentavos: number;
  moeda: 'BRL';
  periodo: 'mensal';
  /** Hipótese de estudo — nunca uma oferta publicada. */
  hipotese: true;
  capacidades: Capacidade[];
  cotas: Cota[];
  recomendadoPara: string;
  /** Por que este plano se adequa a quem. "Mais escolhido" exige dado real. */
  justificativaDaRecomendacao: string;
}

/**
 * Capacidades que NUNCA dependem de pagar mais (seção 24.3):
 * segurança, controle da sessão, privacidade, suporte de acesso e cancelamento.
 * Ficam fora do catálogo de propósito — não são moeda de troca.
 */
export const CAPACIDADES_UNIVERSAIS = [
  'controle_da_sessao',
  'pausar_e_retomar',
  'acessibilidade',
  'privacidade_e_consentimentos',
  'exportar_e_excluir_dados',
  'suporte_de_acesso',
  'cancelamento',
] as const;

const ESSENCIAL: Capacidade[] = [
  'aulas_publicadas',
  'programas',
  'explicacoes',
  'historico',
  'recomendacao_por_regras',
  'motor_de_sessao',
  'continuidade_entre_dispositivos',
  'conquistas_digitais',
];

export const CATALOGO_VERSAO = '2026-09-14.1';

export const PLANOS: Plano[] = [
  {
    id: 'essencial',
    nome: 'Essencial',
    precoCentavos: 2990,
    moeda: 'BRL',
    periodo: 'mensal',
    hipotese: true,
    capacidades: ESSENCIAL,
    cotas: [],
    recomendadoPara: 'quem quer treinar em casa com condução e rotina organizada',
    justificativaDaRecomendacao:
      'Inclui as aulas e programas publicados, as explicações, o histórico e a mesma experiência visual do plano maior. É satisfatório por si só.',
  },
  {
    id: 'completo',
    nome: 'Completo',
    precoCentavos: 4990,
    moeda: 'BRL',
    periodo: 'mensal',
    hipotese: true,
    capacidades: [
      ...ESSENCIAL,
      'assistencia_generativa',
      'assistencia_voz',
      'personalizacao_ampliada',
      'receitas_revisadas',
      'avaliacao_corporal_manual',
      'visao_experimental',
      'beneficio_fisico_quando_houver_programa',
    ],
    cotas: [
      {
        capacidade: 'assistencia_generativa',
        unidade: 'perguntas ao assistente por mês',
        incluido: 200,
        excedenteDisponivel: false,
      },
      {
        capacidade: 'assistencia_voz',
        unidade: 'minutos de voz por mês',
        incluido: 60,
        excedenteDisponivel: false,
      },
    ],
    recomendadoPara: 'quem quer ajuda contextual e organização alimentar revisada',
    justificativaDaRecomendacao:
      'Concentra as funções avançadas. Assistência por software NÃO é consulta com profissional humano: quando houver consulta, ela terá prestador, escopo e preço próprios.',
  },
];

/**
 * Avisos que a interface comercial é OBRIGADA a exibir enquanto o catálogo
 * estiver em estudo. Ficam no domínio para que nenhuma tela possa esquecê-los.
 */
export const AVISOS_OBRIGATORIOS = {
  precoEmEstudo:
    'Preços em estudo. Esta tela não realiza cobrança e não constitui oferta.',
  assistenciaNaoEhProfissional:
    'A assistência é software com conteúdo revisado por profissionais. Não é consulta individual com nutricionista ou personal.',
  visaoExperimental:
    'Recursos de câmera são experimentais, opcionais e limitados aos exercícios validados. Estimativas de visão não são medida clínica.',
  beneficioFisico:
    'Benefícios físicos dependem de um programa específico com orçamento e regulamento definidos. Não há campanha ativa.',
} as const;

export function plano(id: string): Plano | undefined {
  return PLANOS.find(p => p.id === id);
}

export function precoFormatado(p: Plano, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: p.moeda }).format(p.precoCentavos / 100);
}
