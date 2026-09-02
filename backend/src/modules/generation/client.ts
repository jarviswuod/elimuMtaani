/**
 * The only place in the codebase that talks to the model.
 * OWNER: Member 2 (Generation Engine).
 *
 * Everything is a structured output — generators return typed objects, never prose
 * we have to parse. Zod schema in, validated object out.
 */
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
// Must be the v4 subpath — zodOutputFormat is typed against zod/v4, and plain
// `from 'zod'` (v3 classic) will not typecheck against it.
import type * as z from 'zod/v4';
import { config } from '../../config.js';

const client = new Anthropic({
  // Falls back to ANTHROPIC_API_KEY / an `ant auth login` profile when unset.
  apiKey: config.anthropicApiKey || undefined,
});

export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface GenerateOptions<T extends z.ZodTypeAny> {
  schema: T;
  /** Stable across all generators so it stays in the prompt cache. Keep it frozen. */
  system: string;
  prompt: string;
  /** Default 'high'. Use 'max' for the briefing — she cannot check that section. */
  effort?: Effort;
}

export async function generateJson<T extends z.ZodTypeAny>(
  opts: GenerateOptions<T>,
): Promise<z.infer<T>> {
  const response = await client.messages.parse({
    model: config.model,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: opts.effort ?? 'high',
      format: zodOutputFormat(opts.schema),
    },
    // Array form + cache_control so the frozen system prompt is cached across
    // the six generator calls in a single pack build.
    system: [{ type: 'text', text: opts.system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: opts.prompt }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error(`model declined: ${response.stop_details?.category ?? 'unknown'}`);
  }
  if (!response.parsed_output) {
    throw new Error('model returned no parseable output');
  }
  return response.parsed_output;
}

export { client as anthropic };
