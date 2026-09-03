import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";
import { GAME_LIBRARY_SEED } from "./fixtures/gameLibrary";

/** Idempotent seed of the starter library (US-26). Run: npx convex run games:seed */
export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("gameLibrary").collect();
    const names = new Set(existing.map((g) => g.name));
    let added = 0;
    for (const entry of GAME_LIBRARY_SEED) {
      if (!names.has(entry.name)) {
        await ctx.db.insert("gameLibrary", entry);
        added++;
      }
    }
    return { added, total: existing.length + added };
  },
});

export const listLibrary = internalQuery({
  args: {},
  handler: async (ctx) => ctx.db.query("gameLibrary").collect(),
});

export const attachGame = internalMutation({
  args: {
    lectureId: v.id("lectures"),
    game: v.object({
      source: v.union(v.literal("library"), v.literal("generated")),
      libraryEntryId: v.optional(v.id("gameLibrary")),
      name: v.string(),
      setup: v.string(),
      rules: v.array(v.string()),
      mechanics: v.object({
        turns: v.string(),
        challenge: v.string(),
        winCondition: v.string(),
      }),
      materials: v.array(v.string()),
      durationMinutes: v.number(),
      groupPlan: v.string(),
      teacherReviewed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.lectureId, { game: args.game });
    if (args.game.libraryEntryId) {
      const entry = await ctx.db.get(args.game.libraryEntryId);
      if (entry) await ctx.db.patch(entry._id, { timesUsed: entry.timesUsed + 1 });
    }
  },
});

/** Pre-class review gate (RISK-009/Q-006): teacher confirms the checklist before "Start". */
export const markReviewed = mutation({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, { lectureId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const lecture = await ctx.db.get(lectureId);
    if (!lecture?.game) throw new Error("No game on this lecture");
    await ctx.db.patch(lectureId, { game: { ...lecture.game, teacherReviewed: true } });
  },
});

/** Post-game rating (US-25): feeds library match quality; flags generated games (Q-006). */
export const rateGame = mutation({
  args: { lectureId: v.id("lectures"), worked: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const lecture = await ctx.db.get(args.lectureId);
    if (!lecture?.game) throw new Error("No game on this lecture");

    if (lecture.game.libraryEntryId) {
      const entry = await ctx.db.get(lecture.game.libraryEntryId);
      if (entry) {
        await ctx.db.patch(entry._id, {
          worked: entry.worked + (args.worked ? 1 : 0),
          didntWork: entry.didntWork + (args.worked ? 0 : 1),
        });
      }
    }
    // Generated games: a rating IS the teacher review (Q-006 plumbing).
    await ctx.db.patch(args.lectureId, {
      game: { ...lecture.game, teacherReviewed: true },
    });
  },
});
