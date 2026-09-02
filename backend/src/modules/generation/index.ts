/**
 * Pack orchestrator. OWNER: Member 2 (Generation Engine).
 *
 * Six independent generators run in parallel. A single failure degrades the pack
 * (a warning plus a missing section) — it never fails the whole request, because
 * a teacher with five sections at 9pm is far better off than one with none.
 */
import type { Pack, SubStrandDetail, TeachingContext } from '@elimu/shared';
import { config } from '../../config.js';
import { buildSpine } from './spine.js';

export interface GeneratePackInput {
  subStrand: SubStrandDetail;
  context: TeachingContext;
}

export async function generatePack(input: GeneratePackInput): Promise<Pack> {
  const warnings: string[] = [];

  // Deterministic sections first — these cannot fail and cost nothing.
  const spine = buildSpine(input.context);

  // TODO(M2): run the generated sections in parallel with Promise.allSettled,
  // push a warning for each rejection, and stamp provenance + sources yourself.
  //
  //   const [briefing, board, activity, questions, assessment] =
  //     await Promise.allSettled([...]);
  //
  // Effort guide: 'max' for the briefing (unverifiable by the user),
  // 'high' for activity and board, 'medium' for questions and rubric.

  void spine;
  void warnings;
  void config;
  throw new Error('generatePack not implemented yet — Member 2 owns this');
}
