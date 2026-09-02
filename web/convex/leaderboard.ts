import { query } from "./_generated/server";

/**
 * Leaderboard is a query, not a table (US-09). Ranks teachers by sessions
 * delivered and average class-understanding score. Display names only.
 */
export const rankings = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    const byTeacher = new Map<
      string,
      { teacherId: string; delivered: number; scoreSum: number; scoreCount: number; recovered: number }
    >();
    for (const s of sessions) {
      const entry =
        byTeacher.get(s.teacherId) ?? {
          teacherId: s.teacherId,
          delivered: 0,
          scoreSum: 0,
          scoreCount: 0,
          recovered: 0,
        };
      entry.delivered += 1;
      const latest = s.attempts[s.attempts.length - 1];
      if (latest) {
        entry.scoreSum += latest.quizScore;
        entry.scoreCount += 1;
      }
      // Honesty scores more than pretending (DEC from game-branch design):
      // a session that looped through a review and STILL advanced counts extra.
      if (s.attempts.length > 1 && s.status === "advanced") entry.recovered += 1;
      byTeacher.set(s.teacherId, entry);
    }

    const rows = [];
    for (const entry of byTeacher.values()) {
      const teacher = await ctx.db.get(entry.teacherId as never);
      const t = teacher as unknown as { displayName?: string } | null;
      rows.push({
        name: t?.displayName ?? "Teacher",
        delivered: entry.delivered,
        recovered: entry.recovered,
        avgScore: entry.scoreCount ? entry.scoreSum / entry.scoreCount : 0,
        points: entry.delivered * 10 + entry.recovered * 15,
      });
    }
    return rows.sort((a, b) => b.points - a.points).slice(0, 20);
  },
});

/** Delivered class sessions students may review (US-10). No learner data involved. */
export const deliveredSessions = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").order("desc").take(50);
    const out = [];
    for (const s of sessions) {
      const lecture = await ctx.db.get(s.lectureId);
      const teacher = await ctx.db.get(s.teacherId);
      if (!lecture) continue;
      out.push({
        sessionId: s._id,
        lectureId: s.lectureId,
        topic: lecture.topic,
        teacher: teacher?.displayName ?? "Teacher",
        deliveredAt: s.deliveredAt,
        advanced: s.status === "advanced",
      });
    }
    return out;
  },
});
