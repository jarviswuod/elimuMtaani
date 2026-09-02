/**
 * Pack endpoints. OWNER: Member 3 (Pack API & Export).
 * Contract: shared/src/api.ts
 */
import { SAMPLE_PACK } from '@elimu/shared';
import { Router } from 'express';
import * as z from 'zod/v4';
import { getOrCreatePack, getPackById } from './service.js';

export const packsRouter = Router();

const PackRequestSchema = z.object({
  subStrandId: z.string().min(1),
  context: z.object({
    classSize: z.number().int().min(1).max(200),
    lessonMinutes: z.number().int().min(20).max(120),
    language: z.enum(['en', 'sw']),
    resources: z.enum(['CHALK_ONLY', 'CHALK_PLUS_MARKET', 'OUTDOOR']),
  }),
});

/**
 * Fixture endpoint. Lets the frontend build the full pack view before the
 * curriculum data or the generators exist. Keep this working all day.
 */
packsRouter.get('/packs/sample', (_req, res) => {
  res.json(SAMPLE_PACK);
});

packsRouter.post('/packs', async (req, res, next) => {
  const parsed = PackRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', detail: parsed.error.message });
    return;
  }
  try {
    res.json(await getOrCreatePack(parsed.data));
  } catch (err) {
    next(err);
  }
});

packsRouter.get('/packs/:id', async (req, res, next) => {
  try {
    const pack = await getPackById(req.params.id);
    if (!pack) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.json(pack);
  } catch (err) {
    next(err);
  }
});

// TODO(M3): GET /packs/:id/export?format=html|pdf
// The export must be a SINGLE self-contained file with inline CSS and no external
// requests — that is what makes it survive on a phone with no network and share
// over WhatsApp or Bluetooth.
