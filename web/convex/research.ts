import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Pasted-text research intake (US-04). KICD scrape / YouTube are stretch (RISK-005). */
export const submit = mutation({
  args: {
    kind: v.union(v.literal("kicd"), v.literal("youtube"), v.literal("pasted")),
    title: v.string(),
    originUrl: v.optional(v.string()),
    extractedText: v.string(),
    grade: v.string(),
    subject: v.string(),
    term: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || user.role !== "teacher") throw new Error("Teachers only");
    return await ctx.db.insert("researchSources", { ...args, teacherId: user._id });
  },
});

export const get = query({
  args: { id: v.id("researchSources") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});
