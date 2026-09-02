import { test, expect } from "@playwright/test";
import { computeStreak } from "../../lib/streak";

const DAY = 24 * 3600 * 1000;

test.describe("computeStreak", () => {
  test("returns 0 for empty timestamps", () => {
    expect(computeStreak([], Date.now())).toBe(0);
  });

  test("returns 1 for a single activity today", () => {
    const now = Date.now();
    expect(computeStreak([now], now)).toBe(1);
  });

  test("counts consecutive days ending today", () => {
    const now = Date.now();
    const t = [now, now - DAY, now - 2 * DAY];
    expect(computeStreak(t, now)).toBe(3);
  });

  test("counts consecutive days ending yesterday", () => {
    const now = Date.now();
    const yesterday = now - DAY;
    const t = [yesterday, yesterday - DAY, yesterday - 2 * DAY];
    expect(computeStreak(t, now)).toBe(3);
  });

  test("returns 0 if last activity was 2+ days ago", () => {
    const now = Date.now();
    const t = [now - 3 * DAY, now - 4 * DAY];
    expect(computeStreak(t, now)).toBe(0);
  });

  test("ignores duplicate same-day entries", () => {
    const now = Date.now();
    const t = [now, now - 100, now - 200]; // all same day
    expect(computeStreak(t, now)).toBe(1);
  });

  test("does not count a gap in the middle", () => {
    const now = Date.now();
    // today + day-before-yesterday (skip yesterday)
    const t = [now, now - 2 * DAY];
    expect(computeStreak(t, now)).toBe(1);
  });
});
