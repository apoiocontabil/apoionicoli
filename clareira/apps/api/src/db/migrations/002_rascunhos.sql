-- Rascunho editorial da aula, separado das versões publicadas.
--
-- A separação é o que torna o invariante 8 possível: o professor edita o
-- rascunho à vontade e nada disso toca uma sessão em andamento nem um registro
-- histórico. Publicar é copiar o rascunho para uma linha imutável em
-- versoes_de_aula.

CREATE TABLE rascunhos_de_aula (
  aula_id          TEXT PRIMARY KEY REFERENCES aulas(id) ON DELETE CASCADE,
  etapas_json      TEXT NOT NULL DEFAULT '[]',
  atualizado_em_ms INTEGER NOT NULL,
  atualizado_por   TEXT REFERENCES usuarios(id) ON DELETE SET NULL
);
