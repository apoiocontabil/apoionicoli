import type { Etapa } from '../session/tipos.js';

/** Papéis, com menor privilégio. Autoria, acompanhamento e operação são separados. */
export type Papel = 'aluno' | 'instrutor' | 'nutricionista' | 'editor' | 'suporte' | 'admin';

export type EstadoPublicacao = 'rascunho' | 'em_revisao' | 'aprovada' | 'publicada' | 'arquivada';

export interface Professor {
  id: string;
  nome: string;
  /** Especialidades verificadas. Não inventar credencial. */
  especialidades: string[];
  apresentacao: string;
  fotoUrl: string | null;
}

export interface Midia {
  id: string;
  /** Fonte WebM e MP4 — os dois caminhos, não um só (ver docs/MEDIA-SOURCES.md). */
  webmUrl: string;
  mp4Url: string;
  posterUrl: string;
  /** Variante vertical, quando existir. Nunca esticar a horizontal. */
  verticalWebmUrl: string | null;
  verticalMp4Url: string | null;
  verticalPosterUrl: string | null;
  duracaoMs: number;
  largura: number;
  altura: number;
  /** Procedência obrigatória: nada entra no catálogo sem origem e licença. */
  origem: string;
  licenca: string;
  /** Verdadeiro quando é stock ilustrativo, não aula autoral da plataforma. */
  ilustrativo: boolean;
}

export interface Exercicio {
  id: string;
  nome: string;
  passoAPasso: string[];
  respiracao: string;
  errosComuns: string[];
  regressoes: string[];
  progressoes: string[];
  cuidados: string[];
  musculos: string[];
  /** Quem revisou o conteúdo instrucional e quando. */
  revisadoPor: string | null;
  revisadoEmMs: number | null;
}

export interface Aula {
  id: string;
  titulo: string;
  /** Descrição em linguagem natural, nunca slug. */
  descricao: string;
  professorId: string;
  duracaoMs: number;
  nivel: 'iniciacao' | 'basico' | 'intermediario' | 'avancado';
  /** Modalidade em português natural, não identificador interno. */
  modalidade: string;
  equipamentos: string[];
  /** Espaço mínimo necessário, em passos, para caber numa sala pequena. */
  espacoMinimo: 'tapete' | 'pequeno' | 'medio';
  impacto: 'sem_saltos' | 'baixo' | 'moderado';
  estado: EstadoPublicacao;
  versaoPublicada: number | null;
  midiaId: string | null;
  /** Aula de demonstração pública: nunca concede progresso. */
  demonstracaoPublica: boolean;
}

export interface VersaoPublicada {
  aulaId: string;
  versao: number;
  midiaId: string;
  duracaoMs: number;
  etapas: Etapa[];
  publicadaEmMs: number;
  publicadaPor: string;
}

export interface Programa {
  id: string;
  titulo: string;
  objetivo: string;
  nivel: Aula['nivel'];
  semanas: number;
  sessoesPorSemana: number;
  equipamentos: string[];
  preRequisitos: string[];
  professorId: string;
  aulaIds: string[];
  oQueVoceAprende: string[];
}

/** Motivos pelos quais uma aula NÃO pode ser publicada. Bloqueio específico, não genérico. */
export interface BloqueioDePublicacao {
  codigo: 'sem_midia' | 'midia_incompleta' | 'sem_etapas' | 'sem_revisao' | 'etapas_invalidas' | 'sem_equipamento_declarado';
  mensagem: string;
}
