/** Consecutive-day activity streak ending today or yesterday. Pure — tested in tests/logic. */
export function computeStreak(timestamps: number[], now: number): number {
  if (timestamps.length === 0) return 0;
  const DAY = 24 * 3600 * 1000;
  const days = new Set(timestamps.map((t) => Math.floor(t / DAY)));
  const today = Math.floor(now / DAY);
  // A streak survives if the latest activity was today or yesterday.
  let cursor = days.has(today) ? today : days.has(today - 1) ? today - 1 : -1;
  if (cursor === -1) return 0;
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}
