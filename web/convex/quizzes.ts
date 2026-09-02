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

/** Record a score. Re-taking overwrites, never duplicates. */
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
    return score;
  },
});
