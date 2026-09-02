/**
 * Loads the hand-entered curriculum JSON from data/curriculum/*.json into Postgres.
 *
 * OWNER: Member 1 (Curriculum & Data).
 * Run with: npm run seed
 *
 * The JSON files are the source of truth and live in git — Postgres is a queryable
 * copy. That way a broken database never costs us the corpus.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, '../../../data/curriculum');

async function main() {
  const files = (await readdir(dataDir)).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    console.warn('[seed] no curriculum JSON found in data/curriculum — nothing to load');
    console.warn('[seed] Member 1: hand-enter one strand first, see data/curriculum/README.md');
    await pool.end();
    return;
  }

  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));
    console.log(`[seed] loading ${file} (${raw.subject?.name ?? 'unknown subject'})`);

    // TODO(M1): insert source_documents, subjects, strands, sub_strands,
    // learning_outcomes, suggested_experiences. Use ON CONFLICT DO UPDATE so
    // re-running the seed is safe — you will run it many times today.
    throw new Error('seed not implemented yet — Member 1 owns this');
  }
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  });
