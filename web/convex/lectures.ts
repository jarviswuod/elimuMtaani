import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

const slideValidator = v.object({
  title: v.string(),
  bullets: v.array(v.string()),
  visual: v.optional(v.string()),
  narration: v.string(),
});

/** Insert a generated lecture (called from the generateLecture action). */
export const create = internalMutation({
  args: {
    clerkId: v.string(),
    topic: v.string(),
    outline: v.array(v.string()),
    script: v.string(),
    slides: v.array(slideValidator),
    source: v.union(v.literal("open"), v.literal("cbc")),
    timetableRef: v.optional(
      v.object({
        timetableId: v.id("timetables"),
        weekIdx: v.number(),
        dayIdx: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");
    return await ctx.db.insert("lectures", {
      topic: args.topic,
      outline: args.outline,
      script: args.script,
      slides: args.slides,
      source: args.source,
      timetableRef: args.timetableRef,
      createdBy: user._id,
      deliveredBy: args.source === "cbc" ? user._id : undefined,
    });
  },
});

export const setSimplifiedSummary = internalMutation({
  args: { lectureId: v.id("lectures"), summary: v.string() },
  handler: async (ctx, { lectureId, summary }) => {
    await ctx.db.patch(lectureId, { simplifiedSummary: summary });
  },
});

export const get = query({
  args: { id: v.id("lectures") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    const lectures = await ctx.db
      .query("lectures")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .order("desc")
      .take(30);
    return lectures;
  },
});
