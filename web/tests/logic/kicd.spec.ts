import { test, expect } from "@playwright/test";
import { KICD_LINKS, searchKicdLinks } from "../../lib/kicd";

test.describe("KICD link catalogue", () => {
  test("all entries have required fields", () => {
    for (const link of KICD_LINKS) {
      expect(link.id).toBeTruthy();
      expect(link.title).toBeTruthy();
      expect(link.description).toBeTruthy();
      expect(link.url).toMatch(/^https?:\/\//);
      expect(link.tags.length).toBeGreaterThan(0);
      expect(["curriculum", "framework", "assessment", "resources"]).toContain(link.category);
    }
  });

  test("ids are unique", () => {
    const ids = KICD_LINKS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("searchKicdLinks returns all when query is empty", () => {
    expect(searchKicdLinks("").length).toBe(KICD_LINKS.length);
  });

  test("searchKicdLinks filters by title keyword", () => {
    const results = searchKicdLinks("primary");
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      const haystack = (r.title + r.description + r.tags.join(" ")).toLowerCase();
      expect(haystack).toContain("primary");
    }
  });

  test("searchKicdLinks is case-insensitive", () => {
    const upper = searchKicdLinks("KICD");
    const lower = searchKicdLinks("kicd");
    expect(upper.length).toBe(lower.length);
  });
});
