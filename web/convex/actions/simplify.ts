"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { generateText, useFixtures, CHEAP_MODEL } from "../lib/claude";

/** Simplified revision summary for the student review view (US-10) — haiku, cached on the lecture. */
export const run = action({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, args): Promise<string> => {
    const lecture = await ctx.runQuery(api.lectures.get, { id: args.lectureId });
    if (!lecture) throw new Error("Lecture not found");
    if (lecture.simplifiedSummary) return lecture.simplifiedSummary; // cached

    const summary = useFixtures()
      ? "In simple words: the sun heats water in lakes and rivers, the water rises into the sky as vapour, forms clouds, and falls back as rain. That loop is the water cycle — it fills our rivers and waters our farms, and protecting trees protects the rain."
      : await generateText({
          model: CHEAP_MODEL,
          extraSystem:
            "Rewrite lessons for a student revising alone: shorter sentences, simpler words, keep the Kenya examples. 4-6 sentences max.",
          messages: [
            {
              role: "user",
              content: `Summarize this lesson simply for revision:\n\nTopic: ${lecture.topic}\n\n${lecture.script.slice(0, 6000)}`,
            },
          ],
        });

    await ctx.runMutation(internal.lectures.setSimplifiedSummary, {
      lectureId: args.lectureId,
      summary,
    });
    return summary;
  },
});
