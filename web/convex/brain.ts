import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** "Mwalimu Brain" message history for the signed-in user — capped to the last 50 (TD-003 pattern). */
export const forUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    const messages = await ctx.db
      .query("brainMessages")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
    return messages.reverse();
  },
});

export const append = internalMutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    body: v.string(),
  },
  handler: async (ctx, args) => ctx.db.insert("brainMessages", args),
});

/** Clear this user's Brain history (fresh start button). */
export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return;
    const messages = await ctx.db
      .query("brainMessages")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    await Promise.all(messages.map((m) => ctx.db.delete(m._id)));
  },
});
