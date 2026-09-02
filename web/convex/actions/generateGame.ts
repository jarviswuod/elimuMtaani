"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { z } from "zod";
import { generateObject, useFixtures, CHEAP_MODEL } from "../lib/claude";
import { FIXTURE_GAME } from "../fixtures/gameLibrary";

// R1/DEC-018: any material outside this list fails validation. No digital
// surface a learner touches, nothing a normal classroom doesn't have.
const MATERIALS_ALLOWLIST = [
  "chalkboard", "blackboard", "chalk", "exercise book", "exercise books", "book",
  "paper", "slips", "pen", "pens", "pencil", "pencils", "desk", "desks",
  "groups", "teams", "outdoor space", "playground", "ground", "stones",
  "bottle tops", "sticks", "string", "nothing", "none",
];

function materialsValid(materials: string[]): string | null {
  for (const m of materials) {
    const lower = m.toLowerCase();
    if (!MATERIALS_ALLOWLIST.some((ok) => lower.includes(ok))) return m;
  }
  return null;
}

// DEC-016: the schema IS the real-game bar — mechanics are required.
const GameOutputSchema = z.object({
  name: z.string(),
  setup: z.string().describe("How the teacher sets the game up, 2-3 sentences"),
  rules: z.array(z.string()).describe("4-7 numbered rules a teacher reads aloud"),
  mechanics: z.object({
    turns: z.string().describe("How turns/rounds work"),
    challenge: z.string().describe("The tension: time pressure, competition, constraint"),
    winCondition: z.string().describe("How a learner or team wins"),
  }),
  materials: z
    .array(z.string())
    .describe(
      "ONLY: chalkboard, chalk, exercise books, paper, pens, desks, groups, outdoor space, stones, bottle tops, sticks, string — nothing digital, nothing bought",
    ),
  durationMinutes: z.number(),
  groupPlan: z.string().describe("How a class of 40-60 learners splits into this game"),
});

const WORKSHEET_VS_GAME = `THE BAR (this is a hard requirement, not a suggestion):
| NOT a game (a worksheet wearing a game label) | AN ACTUAL game |
| "Answer these 10 questions in your groups" | "First team to answer 3 in a row correctly advances to the next round" |
| "Discuss the topic with your partner" | "One partner describes the term without saying the word; the other guesses before time runs out" |
Your output must read like real game rules: turns, a challenge mechanic, and a way to win.`;

/**
 * Game branch (Sprint 002): library-first (DEC-015) — deterministic match →
 * haiku adapt; only design new (opus) when nothing fits; allowlist-validate →
 * one named retry → library fallback. Attaches the game to the lecture.
 */
export const run = action({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, args): Promise<string> => {
    const lecture = await ctx.runQuery(api.lectures.get, { id: args.lectureId });
    if (!lecture) throw new Error("Lecture not found");
    if (lecture.game) return lecture.game.name; // idempotent

    if (useFixtures()) {
      await ctx.runMutation(internal.games.attachGame, {
        lectureId: args.lectureId,
        game: FIXTURE_GAME,
      });
      return FIXTURE_GAME.name;
    }

    const library = await ctx.runQuery(internal.games.listLibrary, {});

    // 1) Deterministic match (NFR-20): tag/keyword overlap, weighted by ratings. Zero model calls.
    const topicWords = `${lecture.topic} ${lecture.outline.join(" ")}`.toLowerCase();
    let best: { entry: (typeof library)[number]; score: number } | null = null;
    for (const entry of library) {
      const hits = entry.tags.filter((t) => topicWords.includes(t.toLowerCase())).length;
      if (hits === 0) continue;
      const ratingBoost = (entry.worked - entry.didntWork) * 0.25;
      const score = hits + ratingBoost;
      if (!best || score > best.score) best = { entry, score };
    }

    // 2) Match found → adapt with haiku (cheap): swap lesson content into the proven structure.
    if (best) {
      const adapted = await generateObject({
        model: CHEAP_MODEL,
        schema: GameOutputSchema,
        prompt: [
          `Adapt this proven classroom game to the lesson below. Keep the game's structure, mechanics and materials EXACTLY — only swap in this lesson's terms, questions and examples.`,
          `GAME "${best.entry.name}": turns: ${best.entry.mechanics.turns} | challenge: ${best.entry.mechanics.challenge} | win: ${best.entry.mechanics.winCondition} | materials: ${best.entry.materials.join(", ")} | players: ${best.entry.playersAtOnce} | ${best.entry.durationMinutes} min`,
          `LESSON "${lecture.topic}":\n${lecture.script.slice(0, 5000)}`,
          WORKSHEET_VS_GAME,
        ].join("\n\n"),
      });
      await ctx.runMutation(internal.games.attachGame, {
        lectureId: args.lectureId,
        game: { ...adapted, source: "library" as const, libraryEntryId: best.entry._id },
      });
      return adapted.name;
    }

    // 3) No match → design new (opus), allowlist-gated with one named-violation retry.
    const basePrompt = [
      `Design a brand-new classroom game teaching this lesson to a Kenyan class of 40-60 learners.`,
      `HARD RULES: teacher-facilitated and classroom-only. No learner logs into anything; no screens; no individual scores recorded anywhere. Materials ONLY from: chalkboard, chalk, exercise books, paper, pens, desks, groups, outdoor space, stones, bottle tops, sticks, string.`,
      WORKSHEET_VS_GAME,
      `LESSON "${lecture.topic}":\n${lecture.script.slice(0, 5000)}`,
    ].join("\n\n");

    let game = await generateObject({ schema: GameOutputSchema, prompt: basePrompt });
    let violation = materialsValid(game.materials);
    if (violation) {
      game = await generateObject({
        schema: GameOutputSchema,
        prompt: `${basePrompt}\n\nYour previous attempt used the material "${violation}", which a normal classroom does NOT have. Redesign using only the allowed materials list.`,
      });
      violation = materialsValid(game.materials);
    }

    if (violation && library.length > 0) {
      // Fall back to the closest library entry — a proven game beats a broken novel one.
      const fallback = library[0];
      await ctx.runMutation(internal.games.attachGame, {
        lectureId: args.lectureId,
        game: {
          source: "library" as const,
          libraryEntryId: fallback._id,
          name: `${fallback.name} (swap in this lesson's questions)`,
          setup: `Use the standard ${fallback.name} setup with questions and terms from "${lecture.topic}".`,
          rules: [fallback.mechanics.turns, fallback.mechanics.challenge, fallback.mechanics.winCondition],
          mechanics: fallback.mechanics,
          materials: fallback.materials,
          durationMinutes: fallback.durationMinutes,
          groupPlan: fallback.playersAtOnce,
        },
      });
      return fallback.name;
    }

    await ctx.runMutation(internal.games.attachGame, {
      lectureId: args.lectureId,
      game: { ...game, source: "generated" as const },
    });
    return game.name;
  },
});
