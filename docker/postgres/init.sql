-- Runs once, on first container start, before the app migrations.
-- Keep this minimal: real schema lives in backend/db/migrations/.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
