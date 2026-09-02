-- Elimu / Mwalimu wa Grade 10 — initial schema.
--
-- DESIGN RULE, DO NOT BREAK: there is no learner in this schema.
-- No student table, no names, no submitted work, no photographs, no attendance.
-- The system is structurally incapable of holding a child's data. If a task ever
-- seems to need one of those columns, the task is wrong — raise it with the team.

CREATE TABLE IF NOT EXISTS source_documents (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  publisher    TEXT NOT NULL DEFAULT 'KICD',
  published_on DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subjects (
  id         TEXT PRIMARY KEY,
  code       TEXT NOT NULL,
  name       TEXT NOT NULL,
  pathway    TEXT NOT NULL CHECK (pathway IN ('STEM','SOCIAL_SCIENCES','ARTS_SPORTS','CORE')),
  grade      INT  NOT NULL DEFAULT 10,
  doc_id     TEXT NOT NULL REFERENCES source_documents(id),
  doc_page   INT  NOT NULL
);

CREATE TABLE IF NOT EXISTS strands (
  id          TEXT PRIMARY KEY,
  subject_id  TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,
  title       TEXT NOT NULL,
  sort_order  INT  NOT NULL,
  doc_id      TEXT NOT NULL REFERENCES source_documents(id),
  doc_page    INT  NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_strands (
  id                TEXT PRIMARY KEY,
  strand_id         TEXT NOT NULL REFERENCES strands(id) ON DELETE CASCADE,
  code              TEXT NOT NULL,
  title             TEXT NOT NULL,
  sort_order        INT  NOT NULL,
  suggested_lessons INT  NOT NULL DEFAULT 1,
  inquiry_questions TEXT[] NOT NULL DEFAULT '{}',
  core_competencies TEXT[] NOT NULL DEFAULT '{}',
  values_taught     TEXT[] NOT NULL DEFAULT '{}',
  pcis              TEXT[] NOT NULL DEFAULT '{}',
  assessment_notes  TEXT,
  doc_id            TEXT NOT NULL REFERENCES source_documents(id),
  doc_page          INT  NOT NULL
);

-- Verbatim from the design document. Never paraphrase these rows.
CREATE TABLE IF NOT EXISTS learning_outcomes (
  id            TEXT PRIMARY KEY,
  sub_strand_id TEXT NOT NULL REFERENCES sub_strands(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INT  NOT NULL,
  doc_id        TEXT NOT NULL REFERENCES source_documents(id),
  doc_page      INT  NOT NULL
);

-- Verbatim from the design document, plus the resources it quietly assumes.
CREATE TABLE IF NOT EXISTS suggested_experiences (
  id                TEXT PRIMARY KEY,
  sub_strand_id     TEXT NOT NULL REFERENCES sub_strands(id) ON DELETE CASCADE,
  text              TEXT NOT NULL,
  assumed_resources TEXT[] NOT NULL DEFAULT '{}',
  sort_order        INT  NOT NULL,
  doc_id            TEXT NOT NULL REFERENCES source_documents(id),
  doc_page          INT  NOT NULL
);

-- Generated packs. Cached by (sub_strand, context) so a second teacher asking the
-- same question pays nothing and gets an answer instantly. Also demo insurance.
CREATE TABLE IF NOT EXISTS packs (
  id            TEXT PRIMARY KEY,
  sub_strand_id TEXT NOT NULL REFERENCES sub_strands(id) ON DELETE CASCADE,
  cache_key     TEXT NOT NULL,
  context       JSONB NOT NULL,
  body          JSONB NOT NULL,
  model_id      TEXT NOT NULL,
  warnings      TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS packs_cache_key_idx ON packs (cache_key);
CREATE INDEX IF NOT EXISTS strands_subject_idx ON strands (subject_id, sort_order);
CREATE INDEX IF NOT EXISTS sub_strands_strand_idx ON sub_strands (strand_id, sort_order);
