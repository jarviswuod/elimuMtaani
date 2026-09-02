/**
 * Pack service — cache lookup, generation, persistence. OWNER: Member 3.
 */
import type { Pack, PackRequest } from '@elimu/shared';
import { generatePack } from '../generation/index.js';
import { getSubStrandDetail } from '../curriculum/repository.js';
import { cacheKey, findCached, savePack } from './cache.js';

export async function getOrCreatePack(req: PackRequest): Promise<Pack> {
  const key = cacheKey(req.subStrandId, req.context);

  const cached = await findCached(key);
  if (cached) return cached;

  const subStrand = await getSubStrandDetail(req.subStrandId);
  if (!subStrand) throw new Error(`unknown sub-strand: ${req.subStrandId}`);

  const pack = await generatePack({ subStrand, context: req.context });
  await savePack(key, pack);
  return pack;
}

export async function getPackById(_id: string): Promise<Pack | null> {
  // TODO(M3): SELECT body FROM packs WHERE id = $1
  throw new Error('not implemented');
}
