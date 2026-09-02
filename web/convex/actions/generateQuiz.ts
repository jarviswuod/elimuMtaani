"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { generateObject, useFixtures } from "../lib/claude";
import { QuizOutputSchema } from "../../lib/slides";
import { FIXTURE_QUIZ } from "../fixtures/lecture";

/** Auto-generated quiz for a lecture (US-03). Idempotent: reuses an existing quiz. */
export const run = action({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, args): Promise<Id<"quizzes">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.runQuery(api.quizzes.forLecture, { lectureId: args.lectureId });
    if (existing) return existing._id;

    const lecture = await ctx.runQuery(api.lectures.get, { id: args.lectureId });
    if (!lecture) throw new Error("Lecture not found");

    const output = useFixtures()
      ? FIXTURE_QUIZ
      : await generateObject({
          schema: QuizOutputSchema,
          prompt: `Create a short multiple-choice quiz (4-6 questions, exactly 4 options each) checking understanding of this lecture. Questions must be answerable from the lecture content alone.\n\nTopic: ${lecture.topic}\n\nLecture script:\n${lecture.script.slice(0, 8000)}`,
        });

    return await ctx.runMutation(internal.quizzes.create, {
      lectureId: args.lectureId,
      questions: output.questions,
    });
  },
});
