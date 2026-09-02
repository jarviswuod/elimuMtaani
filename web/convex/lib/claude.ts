// Model gateway for all Convex actions (DEC-008). Node runtime only —
// import this exclusively from "use node" action files.
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";

export const GEN_MODEL = "claude-opus-4-8"; // generation: lectures, timetables, quizzes, games
export const CHEAP_MODEL = "claude-haiku-4-5"; // grading feedback, simplification, adaptation

/** Fixtures mode (DEC-010): demo insurance — no key or explicit flag → no external calls. */
export function useFixtures(): boolean {
  return process.env.ELIMU_USE_FIXTURES === "true" || !process.env.ANTHROPIC_API_KEY;
}

const client = () => new Anthropic();

// Stable system prompt — frozen so the prompt cache holds across calls (shared/prompt-caching rules).
export const SYSTEM_PROMPT = `You are the teaching engine of elimuMtaani, an education app for Kenya's Competency-Based Curriculum (CBC).
Your audience is Kenyan teachers and learners. Use Kenya and East-Africa grounded examples (shillings, matatus, Lake Victoria, local markets, county names) whenever they make a concept clearer.
Be engaging and fun — lessons are narrated aloud to a class that cannot rewind or research later, so cover the topic completely in plain language.
Never invent curriculum requirements, exam formats, policies, or statistics. If asked outside your scope, say so plainly.
All your output is AI-generated teaching support material and will be labelled as such to users.`;

/**
 * One structured-output call. Returns the schema-validated object.
 * Callers must handle fixtures mode BEFORE calling this.
 */
export async function generateObject<S extends z.ZodType>(opts: {
  schema: S;
  prompt: string;
  model?: string;
}): Promise<z.infer<S>> {
  const response = await client().messages.parse({
    model: opts.model ?? GEN_MODEL,
    max_tokens: 16000,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: opts.prompt }],
    output_config: { format: zodOutputFormat(opts.schema) },
  });
  if (response.parsed_output == null) {
    throw new Error(`Generation failed to parse (stop_reason: ${response.stop_reason})`);
  }
  return response.parsed_output;
}

/** Plain multi-turn text call (chat) — no structured output. */
export async function generateText(opts: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  extraSystem?: string;
  model?: string;
}): Promise<string> {
  const response = await client().messages.create({
    model: opts.model ?? GEN_MODEL,
    max_tokens: 4000,
    system: [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ...(opts.extraSystem ? [{ type: "text" as const, text: opts.extraSystem }] : []),
    ],
    messages: opts.messages,
  });
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text in response");
  return text.text;
}
