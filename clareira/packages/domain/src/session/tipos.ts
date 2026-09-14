/**
 * Motor de sessão — tipos do domínio.
 *
 * A máquina de estados e os eventos editoriais são a AUTORIDADE da sessão
 * (seção 15 do briefing). A animação e a assistência apresentam ou solicitam;
 * não decidem tempo, conclusão, crédito de exercício nem permissão.
 */

/** Estado de domínio da sessão. Ortogonal ao estado da mídia. */
export type EstadoDominio =
  | 'preparando'
  | 'demonstrando'
  | 'exercitando'
  | 'descansando'
  | 'pausado'
  | 'ausencia_possivel'
  | 'aguardando_retorno'
  | 'concluido'
  | 'encerrado_parcial';

/**
 * Estado da mídia. Vive em paralelo ao estado de domínio: buffering NÃO é um
 * estado de domínio, senão o retorno perderia o contexto do exercício.
 */
export type EstadoMidia =
  | 'ociosa'
  | 'carregando'
  | 'reproduzindo'
  | 'pausada'
  | 'buffering'
  | 'erro';

export type TipoEtapa =
  | 'preparacao'
  | 'demonstracao'
  | 'exercicio'
  | 'serie'
  | 'descanso'
  | 'explicacao'
  | 'alternativa'
  | 'lembrete'
  | 'encerramento';

export interface Etapa {
  id: string;
  tipo: TipoEtapa;
  rotulo: string;
  /** Posição na mídia, em ms. Etapas independentes da mídia usam `duracaoPrescritaMs`. */
  inicioMs: number;
  fimMs: number;
  exercicioId?: string;
  /** Descanso e pausas prescritas correm em relógio próprio, não no da mídia. */
  duracaoPrescritaMs?: number;
  /** Se a etapa conta como execução para histórico e conquistas. */
  creditavel: boolean;
  /** Etapas alternativas aprovadas para esta, por id. */
  alternativas?: string[];
}

/**
 * Versão IMUTÁVEL de uma aula. A sessão referencia `aulaId` + `versao`:
 * editar a aula publicada cria uma versão nova e não altera retroativamente
 * sessões em andamento nem registros históricos (invariante 8 e 9).
 */
export interface VersaoAula {
  aulaId: string;
  versao: number;
  midiaId: string;
  duracaoMs: number;
  etapas: Etapa[];
}

export interface Intervalo {
  inicioMs: number;
  fimMs: number;
}

export interface RegistroSerie {
  etapaId: string;
  exercicioId?: string;
  repeticoesPlanejadas?: number;
  repeticoesRealizadas?: number;
  cargaKg?: number;
  duracaoMs?: number;
  dificuldadePercebida?: number;
  observacao?: string;
  /** De onde veio o registro. Reprodução ≠ prática autodeclarada ≠ sensor. */
  origem: 'reproducao' | 'autodeclarado' | 'sensor' | 'profissional';
  registradoEmMs: number;
}

export interface Relogios {
  /** Tempo em que houve instrução efetivamente reproduzida em esforço. */
  ativoMs: number;
  /** Tempo de descanso prescrito decorrido. */
  descansoMs: number;
  /** Tempo em pausa explícita do aluno. */
  pausadoMs: number;
  /** Tempo perdido em buffering. NUNCA é somado ao ativo (invariante 2). */
  bufferingMs: number;
  /** Última posição conhecida da mídia, em ms. */
  posicaoMidiaMs: number;
}

export interface EstadoSessao {
  id: string;
  alunoId: string;
  aulaId: string;
  /** Versão imutável de conteúdo à qual esta sessão está presa. */
  aulaVersao: number;

  estado: EstadoDominio;
  /** Estado ao qual retomar depois de pausa ou ausência. */
  estadoRetomada: EstadoDominio | null;
  midia: EstadoMidia;

  etapaIndice: number;
  /**
   * Revisão do contexto da etapa. Incrementa a cada seek, troca de clipe,
   * revisão de explicação ou mudança de alternativa. Uma resposta de IA
   * carimbada com revisão antiga é descartada (invariante 5).
   */
  etapaRevisao: number;

  relogios: Relogios;
  /** Trechos de mídia REALMENTE reproduzidos, normalizados e sem sobreposição. */
  trechosReproduzidos: Intervalo[];
  /** Ids de etapa creditadas. Pular trecho não credita (invariante 3). */
  etapasCreditadas: string[];
  series: RegistroSerie[];

  /** Versão do estado, para concorrência otimista entre dispositivos. */
  versao: number;
  /** Dispositivo que hoje comanda a sessão. */
  controladorId: string | null;
  /** Ids de comando já aplicados — a base da idempotência (invariante 4). */
  comandosAplicados: string[];

  ultimoInstanteMs: number;
  iniciadaEmMs: number;
  finalizadaEmMs: number | null;
  motivoFinal: 'completa' | 'parcial' | null;
}

export type TipoComando =
  | 'iniciar'
  | 'reproduzir'
  | 'pausar'
  | 'retomar'
  | 'buffering_inicio'
  | 'buffering_fim'
  | 'erro_midia'
  | 'progresso_midia'
  | 'seek'
  | 'avancar_etapa'
  | 'rever_explicacao'
  | 'trocar_alternativa'
  | 'registrar_serie'
  | 'iniciar_descanso'
  | 'presenca_incerta'
  | 'confirmar_retorno'
  | 'encerrar_parcial'
  | 'concluir';

export interface Comando {
  /** Identificador único do comando. Reenvio com o mesmo id é ignorado. */
  id: string;
  tipo: TipoComando;
  sessaoId: string;
  /** Instante do servidor, em ms. O relógio local do cliente não é autoridade. */
  emMs: number;
  /** Dispositivo que emitiu. */
  dispositivoId: string;
  /** Versão de estado que o emissor acredita estar corrigindo. */
  versaoEsperada?: number;
  carga?: Record<string, unknown>;
}

export type TipoEvento =
  | 'sessao_iniciada'
  | 'estado_mudou'
  | 'midia_mudou'
  | 'etapa_mudou'
  | 'etapa_creditada'
  | 'serie_registrada'
  | 'contexto_recalculado'
  | 'presenca_incerta'
  | 'retorno_confirmado'
  | 'sessao_finalizada'
  | 'comando_ignorado';

export interface Evento {
  tipo: TipoEvento;
  emMs: number;
  detalhe?: Record<string, unknown>;
}

export interface Resultado {
  estado: EstadoSessao;
  eventos: Evento[];
  /** Preenchido quando o comando foi recusado; o estado volta inalterado. */
  recusa?: {
    codigo:
      | 'sessao_finalizada'
      | 'versao_conflitante'
      | 'transicao_invalida'
      | 'controlador_nao_autorizado'
      | 'carga_invalida';
    mensagem: string;
    /** Versão atual, para o cliente reconciliar em vez de sobrescrever. */
    versaoAtual: number;
  };
}
