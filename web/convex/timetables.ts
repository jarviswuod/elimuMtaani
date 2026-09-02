import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

const weeksValidator = v.array(
  v.object({
    days: v.array(
      v.object({
        topic: v.string(),
        objective: v.string(),
        lectureId: v.optional(v.id("lectures")),
      }),
    ),
  }),
);

export const create = internalMutation({
  args: {
    clerkId: v.string(),
    researchSourceId: v.id("researchSources"),
    grade: v.string(),
    subject: v.string(),
    term: v.number(),
    weeks: weeksValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");
    return await ctx.db.insert("timetables", {
      teacherId: user._id,
      researchSourceId: args.researchSourceId,
      grade: args.grade,
      subject: args.subject,
      term: args.term,
      weeks: args.weeks,
    });
  },
});

export const get = query({
  args: { id: v.id("timetables") },
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
    return await ctx.db
      .query("timetables")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", user._id))
      .order("desc")
      .take(10);
  },
});

/** Link a lazily generated lecture onto its day (RISK-001: reopening never regenerates). */
export const linkLecture = internalMutation({
  args: {
    timetableId: v.id("timetables"),
    weekIdx: v.number(),
    dayIdx: v.number(),
    lectureId: v.id("lectures"),
  },
  handler: async (ctx, args) => {
    const tt = await ctx.db.get(args.timetableId);
    if (!tt) throw new Error("Timetable not found");
    const weeks = tt.weeks.map((w, wi) => ({
      days: w.days.map((d, di) =>
        wi === args.weekIdx && di === args.dayIdx ? { ...d, lectureId: args.lectureId } : d,
      ),
    }));
    await ctx.db.patch(args.timetableId, { weeks });
  },
});

/** "Merge into next day" escape hatch (US-07 / DEC-017): prepend the misunderstood topic. */
export const mergeIntoNextDay = mutation({
  args: { timetableId: v.id("timetables"), weekIdx: v.number(), dayIdx: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const tt = await ctx.db.get(args.timetableId);
    if (!tt) throw new Error("Timetable not found");

    const flatIdx = args.weekIdx * 5 + args.dayIdx;
    const nextWeek = Math.floor((flatIdx + 1) / 5);
    const nextDay = (flatIdx + 1) % 5;
    if (nextWeek >= tt.weeks.length) return false; // last day of term — nothing to merge into

    const current = tt.weeks[args.weekIdx].days[args.dayIdx];
    const weeks = tt.weeks.map((w, wi) => ({
      days: w.days.map((d, di) =>
        wi === nextWeek && di === nextDay
          ? {
              ...d,
              topic: `Recap: ${current.topic} + ${d.topic}`,
              objective: `Revisit "${current.topic}" (class needs another pass), then: ${d.objective}`,
              lectureId: undefined, // force regeneration with the merged scope
            }
          : d,
      ),
    }));
    await ctx.db.patch(args.timetableId, { weeks });
    return true;
  },
});
