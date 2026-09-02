import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const forLecture = query({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, { lectureId }) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_lectureId", (q) => q.eq("lectureId", lectureId))
      .collect();
  },
});

export const append = internalMutation({
  args: {
    lectureId: v.id("lectures"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", args);
  },
});
