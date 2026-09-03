import { query } from "./_generated/server";

const BADGE_THRESHOLDS: Array<{ min: number; badge: string }> = [
  { min: 500, badge: "Gold" },
  { min: 200, badge: "Silver" },
  { min: 50, badge: "Bronze" },
];

/** Badge is a pure function of points — never stored, never stale. */
export function badgeFor(points: number): string | null {
  return BADGE_THRESHOLDS.find((t) => points >= t.min)?.badge ?? null;
}

/**
 * Student leaderboard (Part 2): ranks students against each other by points
 * from individually-attributable quiz activity only (lecture quizzes +
 * practice quizzes). Games stay classroom-aggregate — no per-student data.
 * Global ranking — no classroom/cohort grouping exists in the schema (v1).
 */
export const rankings = query({
  args: {},
  handler: async (ctx) => {
    const [quizAttempts, practiceAttempts] = await Promise.all([
      ctx.db.query("quizAttempts").collect(),
      ctx.db.query("practiceQuizAttempts").collect(),
    ]);

    const points = new Map<string, number>();
    const attempts = new Map<string, number>();
    for (const a of quizAttempts) {
      points.set(a.userId, (points.get(a.userId) ?? 0) + Math.round(a.score * 100));
      attempts.set(a.userId, (attempts.get(a.userId) ?? 0) + 1);
    }
    for (const a of practiceAttempts) {
      points.set(a.userId, (points.get(a.userId) ?? 0) + Math.round(a.score * 100));
      attempts.set(a.userId, (attempts.get(a.userId) ?? 0) + 1);
    }

    const rows = [];
    for (const [userId, pts] of points) {
      const student = await ctx.db.get(userId as never);
      const s = student as unknown as { displayName?: string } | null;
      rows.push({
        userId,
        name: s?.displayName ?? "Learner",
        points: pts,
        badge: badgeFor(pts),
        quizzesTaken: attempts.get(userId) ?? 0,
      });
    }
    return rows.sort((a, b) => b.points - a.points).slice(0, 50);
  },
});

/** The signed-in student's own rank/points/badge, or null if they have no attempts yet. */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    const [quizAttempts, practiceAttempts] = await Promise.all([
      ctx.db
        .query("quizAttempts")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect(),
      ctx.db
        .query("practiceQuizAttempts")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect(),
    ]);
    const points =
      quizAttempts.reduce((sum, a) => sum + Math.round(a.score * 100), 0) +
      practiceAttempts.reduce((sum, a) => sum + Math.round(a.score * 100), 0);
    return { points, badge: badgeFor(points) };
  },
});
