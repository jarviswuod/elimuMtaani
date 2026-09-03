import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

const questionsValidator = v.array(
  v.object({
    q: v.string(),
    options: v.array(v.string()),
    answerIdx: v.number(),
    explanation: v.string(),
  }),
);

export const create = internalMutation({
  args: { lectureId: v.id("lectures"), questions: questionsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizzes", {
      lectureId: args.lectureId,
      questions: args.questions,
    });
  },
});

export const forLecture = query({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, { lectureId }) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_lectureId", (q) => q.eq("lectureId", lectureId))
      .first();
  },
});

/** Record a score. `quizzes.score`/`takenBy` stays the latest-attempt cache;
 *  every attempt (including retakes) is also kept in `quizAttempts`. */
export const recordScore = mutation({
  args: { quizId: v.id("quizzes"), score: v.number() },
  handler: async (ctx, { quizId, score }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    await ctx.db.patch(quizId, { score, takenBy: user?._id });
    if (user) {
      await ctx.db.insert("quizAttempts", { quizId, userId: user._id, score, takenAt: Date.now() });
    }
    return score;
  },
});

/** This user's past attempts on a lecture's quiz, most recent first. */
export const history = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, { quizId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_quizId", (q) => q.eq("quizId", quizId))
      .collect();
    return attempts
      .filter((a) => a.userId === user._id)
      .sort((a, b) => b.takenAt - a.takenAt);
  },
});
