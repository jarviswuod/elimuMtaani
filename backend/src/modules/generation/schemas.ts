/**
 * Zod schemas for structured model output. OWNER: Member 2 (Generation Engine).
 *
 * These mirror the section types in @elimu/shared, minus the provenance fields —
 * provenance is stamped by our code, never by the model. The model is not allowed
 * to tell us how trustworthy it is.
 */
// v4 subpath — required for compatibility with zodOutputFormat. See client.ts.
import * as z from 'zod/v4';

export const BriefingOutput = z.object({
  summary: z.string(),
  keyIdeas: z.array(z.object({ term: z.string(), explanation: z.string() })).min(2).max(5),
  workedExamples: z.array(z.object({ prompt: z.string(), walkthrough: z.string() })).min(1).max(3),
  teacherMisconceptions: z.array(z.string()).min(1).max(4),
});

export const ActivityOutput = z.object({
  title: z.string(),
  groupSize: z.number().int().positive(),
  materials: z.array(
    z.object({
      item: z.string(),
      quantity: z.string(),
      sourceHint: z.string(),
      costKes: z.number().nonnegative(),
    }),
  ),
  steps: z.array(z.string()).min(3).max(8),
  fallbackNoMaterials: z.string(),
});

export const BoardOutput = z.object({
  panels: z
    .array(
      z.object({
        drawInstruction: z.string(),
        sayWhileDrawing: z.string(),
        asciiSketch: z.string().optional(),
      }),
    )
    .min(1)
    .max(4),
});

export const QuestionsOutput = z.object({
  items: z.array(z.object({ question: z.string(), answer: z.string() })).min(3).max(8),
  dontKnowScript: z.string(),
});

export const RubricOutput = z.object({
  quickChecks: z.array(z.string()).min(2).max(4),
  rubric: z.array(
    z.object({
      outcome: z.string(),
      descriptors: z.object({
        EXCEEDING: z.string(),
        MEETING: z.string(),
        APPROACHING: z.string(),
        BELOW: z.string(),
      }),
    }),
  ),
});
