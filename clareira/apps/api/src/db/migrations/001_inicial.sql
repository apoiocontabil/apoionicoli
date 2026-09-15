-- ===========================================================================
-- Clareira — schema inicial.
--
-- Decisões registradas em docs/ARCHITECTURE.md. Resumo das que afetam o schema:
--  · Dinheiro em CENTAVOS inteiros. Nunca ponto flutuante.
--  · Instantes em MILISSEGUNDOS INTEIROS UTC, carimbados pelo servidor.
--  · Conteúdo é VERSIONADO e imutável depois de publicado: editar cria versão
--    nova e não altera sessões em andamento nem histórico (invariantes 8 e 9).
--  · Toda medida corporal carrega procedência: valor, unidade, origem, método,
--    responsável e incerteza.
--  · O ledger de conquistas é APPEND-ONLY; reversão é evento compensatório.
-- ===========================================================================

PRAGMA foreign_keys = ON;

-- --- Pessoas e acesso ------------------------------------------------------

CREATE TABLE usuarios (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nome          TEXT NOT NULL,
  senha_hash    TEXT NOT NULL,
  senha_salt    TEXT NOT NULL,
  fuso          TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  criado_em_ms  INTEGER NOT NULL,
  -- Conta de demonstração: existe apenas em desenvolvimento e NUNCA concede
  -- atalho de privilégio. É só um rótulo para os seeds serem identificáveis.
  demo          INTEGER NOT NULL DEFAULT 0 CHECK (demo IN (0, 1))
);

CREATE TABLE papeis (
  usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  papel      TEXT NOT NULL CHECK (papel IN ('aluno','instrutor','nutricionista','editor','suporte','admin')),
  PRIMARY KEY (usuario_id, papel)
);

CREATE TABLE sessoes_de_acesso (
  token_hash    TEXT PRIMARY KEY,
  usuario_id    TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_em_ms  INTEGER NOT NULL,
  expira_em_ms  INTEGER NOT NULL,
  dispositivo   TEXT
);
CREATE INDEX idx_sessoes_acesso_usuario ON sessoes_de_acesso(usuario_id);

CREATE TABLE tentativas_de_acesso (
  email       TEXT NOT NULL,
  em_ms       INTEGER NOT NULL,
  sucesso     INTEGER NOT NULL CHECK (sucesso IN (0, 1))
);
CREATE INDEX idx_tentativas_email_em ON tentativas_de_acesso(email, em_ms);

-- --- Preferências e consentimentos ----------------------------------------

CREATE TABLE perfis (
  usuario_id            TEXT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  objetivo              TEXT,
  experiencia           TEXT,
  dias_por_semana       INTEGER,
  minutos_por_sessao    INTEGER,
  equipamentos          TEXT NOT NULL DEFAULT '[]',
  espaco                TEXT,
  impacto_maximo        TEXT,
  limitacoes_informadas TEXT,
  atualizado_em_ms      INTEGER NOT NULL
);

-- Consentimento por finalidade, com revogação e retenção explícitas.
CREATE TABLE consentimentos (
  id             TEXT PRIMARY KEY,
  usuario_id     TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  finalidade     TEXT NOT NULL CHECK (finalidade IN ('camera','microfone','dados_corporais','fotos','acompanhamento_profissional','lembretes')),
  concedido_em_ms INTEGER NOT NULL,
  revogado_em_ms  INTEGER,
  retencao_dias   INTEGER
);
CREATE INDEX idx_consent_usuario ON consentimentos(usuario_id, finalidade);

-- --- Catálogo --------------------------------------------------------------

CREATE TABLE professores (
  id             TEXT PRIMARY KEY,
  usuario_id     TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  nome           TEXT NOT NULL,
  especialidades TEXT NOT NULL DEFAULT '[]',
  apresentacao   TEXT NOT NULL DEFAULT '',
  foto_url       TEXT
);

CREATE TABLE midias (
  id                  TEXT PRIMARY KEY,
  webm_url            TEXT NOT NULL,
  mp4_url             TEXT NOT NULL,
  poster_url          TEXT NOT NULL,
  vertical_webm_url   TEXT,
  vertical_mp4_url    TEXT,
  vertical_poster_url TEXT,
  duracao_ms          INTEGER NOT NULL,
  largura             INTEGER NOT NULL,
  altura              INTEGER NOT NULL,
  -- Procedência obrigatória. Sem origem e licença, não entra no catálogo.
  origem              TEXT NOT NULL,
  licenca             TEXT NOT NULL,
  -- 1 = stock ilustrativo; 0 = conteúdo autoral da plataforma.
  ilustrativo         INTEGER NOT NULL DEFAULT 1 CHECK (ilustrativo IN (0, 1)),
  -- Estados do processamento: enviado ≠ transcodificado ≠ pronto ≠ publicado.
  processamento       TEXT NOT NULL DEFAULT 'pronto'
                      CHECK (processamento IN ('enviando','transcodificando','pronto','erro'))
);

CREATE TABLE exercicios (
  id             TEXT PRIMARY KEY,
  nome           TEXT NOT NULL,
  passo_a_passo  TEXT NOT NULL DEFAULT '[]',
  respiracao     TEXT NOT NULL DEFAULT '',
  erros_comuns   TEXT NOT NULL DEFAULT '[]',
  regressoes     TEXT NOT NULL DEFAULT '[]',
  progressoes    TEXT NOT NULL DEFAULT '[]',
  cuidados       TEXT NOT NULL DEFAULT '[]',
  musculos       TEXT NOT NULL DEFAULT '[]',
  revisado_por   TEXT,
  revisado_em_ms INTEGER
);

CREATE TABLE aulas (
  id                   TEXT PRIMARY KEY,
  titulo               TEXT NOT NULL,
  descricao            TEXT NOT NULL DEFAULT '',
  professor_id         TEXT NOT NULL REFERENCES professores(id),
  duracao_ms           INTEGER NOT NULL,
  nivel                TEXT NOT NULL CHECK (nivel IN ('iniciacao','basico','intermediario','avancado')),
  modalidade           TEXT NOT NULL,
  equipamentos         TEXT NOT NULL DEFAULT '[]',
  espaco_minimo        TEXT NOT NULL CHECK (espaco_minimo IN ('tapete','pequeno','medio')),
  impacto              TEXT NOT NULL CHECK (impacto IN ('sem_saltos','baixo','moderado')),
  estado               TEXT NOT NULL DEFAULT 'rascunho'
                       CHECK (estado IN ('rascunho','em_revisao','aprovada','publicada','arquivada')),
  versao_publicada     INTEGER,
  midia_id             TEXT REFERENCES midias(id),
  demonstracao_publica INTEGER NOT NULL DEFAULT 0 CHECK (demonstracao_publica IN (0, 1)),
  criado_em_ms         INTEGER NOT NULL,
  atualizado_em_ms     INTEGER NOT NULL
);
CREATE INDEX idx_aulas_estado ON aulas(estado);
CREATE INDEX idx_aulas_selecao ON aulas(estado, duracao_ms, impacto, espaco_minimo);

-- Versões publicadas são IMUTÁVEIS. Nada aqui é atualizado depois de inserido.
CREATE TABLE versoes_de_aula (
  aula_id         TEXT NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  versao          INTEGER NOT NULL,
  midia_id        TEXT NOT NULL REFERENCES midias(id),
  duracao_ms      INTEGER NOT NULL,
  etapas_json     TEXT NOT NULL,
  publicada_em_ms INTEGER NOT NULL,
  publicada_por   TEXT NOT NULL REFERENCES usuarios(id),
  PRIMARY KEY (aula_id, versao)
);

CREATE TABLE programas (
  id                TEXT PRIMARY KEY,
  titulo            TEXT NOT NULL,
  objetivo          TEXT NOT NULL,
  nivel             TEXT NOT NULL,
  semanas           INTEGER NOT NULL,
  sessoes_por_semana INTEGER NOT NULL,
  equipamentos      TEXT NOT NULL DEFAULT '[]',
  pre_requisitos    TEXT NOT NULL DEFAULT '[]',
  professor_id      TEXT NOT NULL REFERENCES professores(id),
  o_que_aprende     TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE programa_aulas (
  programa_id TEXT NOT NULL REFERENCES programas(id) ON DELETE CASCADE,
  aula_id     TEXT NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  ordem       INTEGER NOT NULL,
  PRIMARY KEY (programa_id, aula_id)
);

-- --- Sessões de treino -----------------------------------------------------

CREATE TABLE sessoes (
  id              TEXT PRIMARY KEY,
  aluno_id        TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  aula_id         TEXT NOT NULL REFERENCES aulas(id),
  -- A sessão é presa a uma VERSÃO. Publicar outra versão não a altera.
  aula_versao     INTEGER NOT NULL,
  estado_json     TEXT NOT NULL,
  versao          INTEGER NOT NULL,
  controlador_id  TEXT,
  iniciada_em_ms  INTEGER NOT NULL,
  finalizada_em_ms INTEGER,
  FOREIGN KEY (aula_id, aula_versao) REFERENCES versoes_de_aula(aula_id, versao)
);
CREATE INDEX idx_sessoes_aluno ON sessoes(aluno_id, iniciada_em_ms DESC);

-- Comandos aplicados: a trilha que sustenta idempotência e auditoria.
CREATE TABLE comandos_de_sessao (
  comando_id   TEXT PRIMARY KEY,
  sessao_id    TEXT NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL,
  em_ms        INTEGER NOT NULL,
  dispositivo  TEXT NOT NULL,
  carga_json   TEXT,
  resultado    TEXT NOT NULL
);
CREATE INDEX idx_comandos_sessao ON comandos_de_sessao(sessao_id, em_ms);

-- --- Recomendação e calendário --------------------------------------------

-- A recomendação do dia é PERSISTIDA: recarregar a página não troca o plano.
CREATE TABLE recomendacoes_do_dia (
  aluno_id     TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia_local    TEXT NOT NULL,
  aula_id      TEXT NOT NULL REFERENCES aulas(id),
  regra_versao TEXT NOT NULL,
  motivo       TEXT NOT NULL,
  gerada_em_ms INTEGER NOT NULL,
  PRIMARY KEY (aluno_id, dia_local)
);

CREATE TABLE agendamentos (
  id           TEXT PRIMARY KEY,
  aluno_id     TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia_local    TEXT NOT NULL,
  aula_id      TEXT REFERENCES aulas(id),
  tipo         TEXT NOT NULL CHECK (tipo IN ('treino','descanso')),
  estado       TEXT NOT NULL DEFAULT 'planejado' CHECK (estado IN ('planejado','concluido','remarcado','perdido')),
  criado_em_ms INTEGER NOT NULL
);
CREATE INDEX idx_agenda_aluno_dia ON agendamentos(aluno_id, dia_local);

-- --- Medidas corporais -----------------------------------------------------

CREATE TABLE medidas_corporais (
  id              TEXT PRIMARY KEY,
  aluno_id        TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo            TEXT NOT NULL,
  valor           REAL NOT NULL,
  unidade         TEXT NOT NULL,
  -- Procedência obrigatória (seção 18): estimativa nunca se confunde com medida.
  origem          TEXT NOT NULL CHECK (origem IN ('informado','dispositivo','profissional','estimado')),
  metodo          TEXT NOT NULL,
  responsavel     TEXT,
  dispositivo     TEXT,
  algoritmo_versao TEXT,
  incerteza       TEXT,
  medido_em_ms    INTEGER NOT NULL
);
CREATE INDEX idx_medidas_aluno ON medidas_corporais(aluno_id, tipo, medido_em_ms DESC);

-- --- Comercial -------------------------------------------------------------

CREATE TABLE assinaturas (
  aluno_id        TEXT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  plano_id        TEXT,
  estado          TEXT NOT NULL CHECK (estado IN ('sem_assinatura','em_teste','ativa','pagamento_falhou','cancelada_ate_fim_do_periodo','expirada')),
  valida_ate_ms   INTEGER,
  -- Versão do catálogo contratada: mudança de preço não altera direito vigente.
  catalogo_versao TEXT NOT NULL,
  atualizado_em_ms INTEGER NOT NULL
);

-- Consumo por ciclo, para as cotas anunciadas serem as mesmas no servidor.
CREATE TABLE consumo_do_ciclo (
  aluno_id    TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  ciclo       TEXT NOT NULL,
  capacidade  TEXT NOT NULL,
  quantidade  REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (aluno_id, ciclo, capacidade)
);

-- Eventos do provedor de pagamento: idempotência e tolerância a fora de ordem.
CREATE TABLE eventos_de_pagamento (
  evento_id     TEXT PRIMARY KEY,
  aluno_id      TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo          TEXT NOT NULL,
  recebido_em_ms INTEGER NOT NULL,
  -- Instante do provedor: usado para descartar evento antigo chegando tarde.
  ocorrido_em_ms INTEGER NOT NULL,
  carga_json    TEXT NOT NULL,
  aplicado      INTEGER NOT NULL DEFAULT 0 CHECK (aplicado IN (0, 1)),
  motivo_descarte TEXT
);

-- --- Conquistas ------------------------------------------------------------

-- APPEND-ONLY. Nenhuma linha é alterada ou removida: reversão é compensação.
CREATE TABLE ledger_conquistas (
  chave        TEXT PRIMARY KEY,
  tipo         TEXT NOT NULL,
  aluno_id     TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  em_ms        INTEGER NOT NULL,
  regra_versao TEXT NOT NULL,
  dia_local    TEXT,
  semana       TEXT,
  marco_id     TEXT,
  origem       TEXT NOT NULL,
  detalhe_json TEXT,
  compensa     TEXT REFERENCES ledger_conquistas(chave)
);
CREATE INDEX idx_ledger_aluno ON ledger_conquistas(aluno_id, em_ms);
CREATE UNIQUE INDEX idx_ledger_dia ON ledger_conquistas(aluno_id, dia_local)
  WHERE tipo = 'dia_de_participacao';
CREATE UNIQUE INDEX idx_ledger_semana ON ledger_conquistas(aluno_id, semana)
  WHERE tipo = 'semana_de_compromisso';

-- --- Auditoria -------------------------------------------------------------

CREATE TABLE auditoria (
  id          TEXT PRIMARY KEY,
  ator_id     TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  acao        TEXT NOT NULL,
  objeto      TEXT NOT NULL,
  objeto_id   TEXT,
  em_ms       INTEGER NOT NULL,
  correlacao  TEXT,
  detalhe_json TEXT
);
CREATE INDEX idx_auditoria_objeto ON auditoria(objeto, objeto_id, em_ms DESC);
