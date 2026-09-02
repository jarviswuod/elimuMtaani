import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireTeacher(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user || user.role !== "teacher") throw new Error("Teachers only");
  return user;
}

export const forDay = query({
  args: { timetableId: v.id("timetables"), weekIdx: v.number(), dayIdx: v.number() },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_timetableId", (q) => q.eq("timetableId", args.timetableId))
      .collect();
    return (
      sessions.find((s) => s.weekIdx === args.weekIdx && s.dayIdx === args.dayIdx) ?? null
    );
  },
});

export const forTimetable = query({
  args: { timetableId: v.id("timetables") },
  handler: async (ctx, { timetableId }) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_timetableId", (q) => q.eq("timetableId", timetableId))
      .collect();
  },
});

/**
 * Record one quiz run of the understanding gate (DEC-017). Appends an attempt —
 * never overwrites, so the loop history stays visible. Aggregate data only (R1).
 */
export const recordAttempt = mutation({
  args: {
    timetableId: v.id("timetables"),
    weekIdx: v.number(),
    dayIdx: v.number(),
    lectureId: v.id("lectures"),
    quizScore: v.number(),
    classReady: v.boolean(),
    reviewAction: v.optional(v.union(v.literal("recap"), v.literal("game_round"))),
  },
  handler: async (ctx, args) => {
    const user = await requireTeacher(ctx);
    const existing = await ctx.db
      .query("sessions")
      .withIndex("by_timetableId", (q) => q.eq("timetableId", args.timetableId))
      .collect();
    const session = existing.find((s) => s.weekIdx === args.weekIdx && s.dayIdx === args.dayIdx);

    const attempt = {
      quizScore: args.quizScore,
      classReady: args.classReady,
      reviewAction: args.reviewAction,
    };
    if (session) {
      await ctx.db.patch(session._id, { attempts: [...session.attempts, attempt] });
      return session._id;
    }
    return await ctx.db.insert("sessions", {
      timetableId: args.timetableId,
      weekIdx: args.weekIdx,
      dayIdx: args.dayIdx,
      lectureId: args.lectureId,
      teacherId: user._id,
      attempts: [attempt],
      status: "open",
      deliveredAt: Date.now(),
    });
  },
});

/** Advance only when the latest attempt says the class is ready — the teacher's call. */
export const advanceTopic = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, { sessionId }) => {
    await requireTeacher(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");
    const latest = session.attempts[session.attempts.length - 1];
    if (!latest?.classReady) throw new Error("Latest attempt is not marked class-ready");
    await ctx.db.patch(sessionId, { status: "advanced" });
  },
});
