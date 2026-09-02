"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { generateObject, useFixtures } from "../lib/claude";
import { LectureOutputSchema } from "../../lib/slides";
import { FIXTURE_LECTURE } from "../fixtures/lecture";

/**
 * Student open-topic lecture OR teacher cbc day lecture (US-02, US-06).
 * ONE structured-output call → insert → returns the lecture id.
 */
export const run = action({
  args: {
    topic: v.string(),
    source: v.union(v.literal("open"), v.literal("cbc")),
    researchExcerpt: v.optional(v.string()),
    timetableRef: v.optional(
      v.object({
        timetableId: v.id("timetables"),
        weekIdx: v.number(),
        dayIdx: v.number(),
      }),
    ),
  },
  handler: async (ctx, args): Promise<Id<"lectures">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const output = useFixtures()
      ? { ...FIXTURE_LECTURE, outline: [...FIXTURE_LECTURE.outline] }
      : await generateObject({
          schema: LectureOutputSchema,
          prompt: [
            `Create a narrated slide lecture on the topic: "${args.topic}".`,
            args.source === "cbc"
              ? "This is a classroom lesson a teacher will deliver live to a Kenyan CBC class. Make it engaging, fun, and complete — learners cannot rewind or research later."
              : "This is a self-serve lecture for a curious Kenyan student. Keep it clear, friendly and complete.",
            args.researchExcerpt
              ? `Ground the content in this research material the teacher provided:\n---\n${args.researchExcerpt.slice(0, 6000)}\n---`
              : "",
            "Produce 5-9 slides. Each slide needs a spoken narration paragraph.",
          ]
            .filter(Boolean)
            .join("\n\n"),
        });

    const lectureId = await ctx.runMutation(internal.lectures.create, {
      clerkId: identity.subject,
      topic: args.topic,
      outline: output.outline,
      script: output.script ?? output.slides.map((s) => s.narration).join("\n\n"),
      slides: output.slides,
      source: args.source,
      timetableRef: args.timetableRef,
    });
    // Link onto the timetable day so reopening never regenerates (RISK-001).
    if (args.timetableRef) {
      await ctx.runMutation(internal.timetables.linkLecture, {
        ...args.timetableRef,
        lectureId,
      });
    }
    return lectureId;
  },
});
