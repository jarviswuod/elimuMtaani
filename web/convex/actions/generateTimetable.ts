"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { generateObject, useFixtures } from "../lib/claude";
import { TimetableOutputSchema } from "../../lib/slides";
import { FIXTURE_TIMETABLE } from "../fixtures/timetable";

/**
 * ONE structured-output call → term timetable grid (US-05, NFR-05).
 * RISK-006 mitigation: deterministic pad/trim so the grid is never ragged.
 */
export const run = action({
  args: { researchSourceId: v.id("researchSources") },
  handler: async (ctx, args): Promise<Id<"timetables">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const source = await ctx.runQuery(api.research.get, { id: args.researchSourceId });
    if (!source) throw new Error("Research source not found");

    const raw = useFixtures()
      ? FIXTURE_TIMETABLE
      : await generateObject({
          schema: TimetableOutputSchema,
          prompt: [
            `Create a term teaching timetable for ${source.grade} ${source.subject}, Term ${source.term}, Kenya CBC.`,
            `Structure: 8-13 weeks, EXACTLY 5 teaching days (Monday-Friday) per week. One focused topic per day with a one-sentence learning objective.`,
            `Ground every topic in this research material the teacher provided — do not invent curriculum content beyond it:`,
            `---\n${source.extractedText.slice(0, 12000)}\n---`,
            `Order topics so each builds on the previous. End weeks with consolidation where natural.`,
          ].join("\n\n"),
        });

    // Deterministic post-validation (RISK-006): never render a ragged grid.
    const weeks = raw.weeks
      .slice(0, 13)
      .map((w) => {
        const days = w.days.slice(0, 5);
        while (days.length < 5) {
          days.push({
            topic: "Revision and practice",
            objective: "Consolidate this week's topics with practice questions.",
          });
        }
        return { days: days.map((d) => ({ topic: d.topic, objective: d.objective })) };
      })
      .filter((w) => w.days.some((d) => d.topic.trim().length > 0));
    if (weeks.length === 0) throw new Error("Timetable generation produced no weeks");

    return await ctx.runMutation(internal.timetables.create, {
      clerkId: identity.subject,
      researchSourceId: args.researchSourceId,
      grade: source.grade,
      subject: source.subject,
      term: source.term,
      weeks,
    });
  },
});
