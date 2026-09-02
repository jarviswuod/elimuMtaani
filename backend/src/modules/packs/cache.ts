/**
 * Pack cache. OWNER: Member 3 (Pack API & Export).
 *
 * Two jobs, both load-bearing:
 *   1. Cost — the second teacher to ask about a sub-strand pays nothing.
 *   2. Demo insurance — pre-warm the demo path and a flaky venue network,
 *      an expired key, or a rate limit cannot break the presentation.
 */
import { createHash } from 'node:crypto';
import type { Pack, TeachingContext } from '@elimu/shared';
import { query } from '../../db/pool.js';

/** Stable key: any change in context produces a different pack. */
export function cacheKey(subStrandId: string, context: TeachingContext): string {
  const canonical = JSON.stringify({
    subStrandId,
    classSize: context.classSize,
    lessonMinutes: context.lessonMinutes,
    language: context.language,
    resources: context.resources,
  });
  return createHash('sha256').update(canonical).digest('hex').slice(0, 32);
}

export async function findCached(key: string): Promise<Pack | null> {
  const rows = await query<{ id: string; body: Pack }>(
    'SELECT id, body FROM packs WHERE cache_key = $1',
    [key],
  );
  const row = rows[0];
  if (!row) return null;
  return { ...row.body, id: row.id };
}

export async function savePack(_key: string, _pack: Pack): Promise<void> {
  // TODO(M3): INSERT ... ON CONFLICT (cache_key) DO UPDATE.
  throw new Error('not implemented');
}
