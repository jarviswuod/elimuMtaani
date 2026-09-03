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
  args: {
    createdBy: v.id("users"),
    topic: v.string(),
    grade: v.string(),
    subject: v.string(),
    questions: questionsValidator,
  },
  handler: async (ctx, args) => ctx.db.insert("practiceQuizzes", args),
});

export const get = query({
  args: { id: v.id("practiceQuizzes") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const mine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    return await ctx.db
      .query("practiceQuizzes")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .order("desc")
      .collect();
  },
});

export const recordScore = mutation({
  args: { practiceQuizId: v.id("practiceQuizzes"), score: v.number() },
  handler: async (ctx, { practiceQuizId, score }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");
    await ctx.db.insert("practiceQuizAttempts", {
      practiceQuizId,
      userId: user._id,
      score,
      takenAt: Date.now(),
    });
    return score;
  },
});

export const history = query({
  args: { practiceQuizId: v.id("practiceQuizzes") },
  handler: async (ctx, { practiceQuizId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    const attempts = await ctx.db
      .query("practiceQuizAttempts")
      .withIndex("by_practiceQuizId", (q) => q.eq("practiceQuizId", practiceQuizId))
      .collect();
    return attempts
      .filter((a) => a.userId === user._id)
      .sort((a, b) => b.takenAt - a.takenAt);
  },
});
