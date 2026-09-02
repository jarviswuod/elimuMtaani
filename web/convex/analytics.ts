import { query } from "./_generated/server";
import { computeStreak } from "../lib/streak";

// Read-only aggregations (NFR-30). R1 holds: teacher stats are the teacher's
// own stand-in scores; student stats are the student's own activity.

async function currentUser(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
}

export const teacherStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (!user || user.role !== "teacher") return null;

    const timetables = await ctx.db
      .query("timetables")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", user._id))
      .collect();
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", user._id))
      .collect();

    // Curriculum progress per timetable: advanced days / total plan days (US-31)
    const curriculum = timetables.map((t) => {
      const total = t.weeks.length * 5;
      const advanced = sessions.filter(
        (s) => s.timetableId === t._id && s.status === "advanced",
      ).length;
      return {
        timetableId: t._id,
        label: `${t.grade} ${t.subject} · Term ${t.term}`,
        advanced,
        total,
        pct: total ? advanced / total : 0,
      };
    });

    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const sessionsThisWeek = sessions.filter((s) => s.deliveredAt >= weekAgo).length;

    // Understanding trend: latest score of the last 10 sessions, oldest first
    const trend = [...sessions]
      .sort((a, b) => a.deliveredAt - b.deliveredAt)
      .slice(-10)
      .map((s) => s.attempts[s.attempts.length - 1]?.quizScore ?? 0);

    // Revisit radar: topics looping in the gate — >1 attempt, not yet advanced
    const revisitRadar = [];
    for (const s of sessions) {
      if (s.attempts.length > 1 && s.status !== "advanced") {
        const lecture = await ctx.db.get(s.lectureId);
        if (lecture) {
          revisitRadar.push({ topic: lecture.topic, attempts: s.attempts.length });
        }
      }
    }

    const scored = sessions
      .map((s) => s.attempts[s.attempts.length - 1]?.quizScore)
      .filter((x): x is number => x !== undefined);
    const recovered = sessions.filter(
      (s) => s.attempts.length > 1 && s.status === "advanced",
    ).length;

    return {
      curriculum,
      sessionsDelivered: sessions.length,
      sessionsThisWeek,
      avgUnderstanding: scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : 0,
      trend,
      revisitRadar: revisitRadar.slice(0, 5),
      points: sessions.length * 10 + recovered * 15,
    };
  },
});

export const studentStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (!user || user.role !== "student") return null;

    const lectures = await ctx.db
      .query("lectures")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .collect();
    const openLectures = lectures.filter((l) => l.source === "open");

    // Quizzes the student actually took
    const quizzes = [];
    for (const l of openLectures) {
      const quiz = await ctx.db
        .query("quizzes")
        .withIndex("by_lectureId", (q) => q.eq("lectureId", l._id))
        .first();
      if (quiz?.score !== undefined) quizzes.push(quiz);
    }
    const avgScore = quizzes.length
      ? quizzes.reduce((a, q) => a + (q.score ?? 0), 0) / quizzes.length
      : 0;

    // Day streak + weekly activity from lecture creation times (US-32)
    const timestamps = openLectures.map((l) => l._creationTime);
    const streak = computeStreak(timestamps, Date.now());

    const weekly: number[] = Array(8).fill(0); // last 8 weeks, oldest first
    const now = Date.now();
    for (const t of timestamps) {
      const weeksAgo = Math.floor((now - t) / (7 * 24 * 3600 * 1000));
      if (weeksAgo < 8) weekly[7 - weeksAgo] += 1;
    }

    // Badges (cool feature): earned from own activity only
    const badges = [
      { name: "First lecture", earned: openLectures.length >= 1 },
      { name: "Curious 5", earned: openLectures.length >= 5 },
      { name: "Quiz taker", earned: quizzes.length >= 1 },
      { name: "Sharp shooter", earned: quizzes.some((q) => (q.score ?? 0) >= 0.8) },
      { name: "3-day streak", earned: streak >= 3 },
    ];

    return {
      lecturesGenerated: openLectures.length,
      quizzesTaken: quizzes.length,
      avgScore,
      streak,
      weekly,
      badges,
      recentTopics: openLectures
        .sort((a, b) => b._creationTime - a._creationTime)
        .slice(0, 5)
        .map((l) => ({ id: l._id, topic: l.topic })),
    };
  },
});
