"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { generateObject, useFixtures } from "../lib/claude";
import { QuizOutputSchema } from "../../lib/slides";
import { FIXTURE_QUIZ } from "../fixtures/lecture";

/** Standalone practice quiz (Part 4) — sourced from knowledge-base documents, not a lecture. */
export const run = action({
  args: { topic: v.string(), grade: v.string(), subject: v.string() },
  handler: async (ctx, args): Promise<Id<"practiceQuizzes">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.runQuery(api.users.current, {});
    if (!user) throw new Error("User not found");

    if (useFixtures()) {
      return await ctx.runMutation(internal.practiceQuizzes.create, {
        createdBy: user._id,
        topic: args.topic,
        grade: args.grade,
        subject: args.subject,
        questions: FIXTURE_QUIZ.questions,
      });
    }

    const chunks: string[] = await ctx.runAction(api.documentSearch.search, {
      queryText: args.topic,
      grade: args.grade,
      subject: args.subject,
      limit: 6,
    });
    if (chunks.length === 0) {
      throw new Error(
        "No knowledge-base documents ready yet for this grade/subject — ask your teacher to upload one.",
      );
    }

    const output = await generateObject({
      schema: QuizOutputSchema,
      prompt: `Create a short multiple-choice quiz (4-6 questions, exactly 4 options each) on "${args.topic}" for a ${args.grade} ${args.subject} learner. Questions must be answerable from the reference material alone.\n\nReference material:\n${chunks.join("\n---\n").slice(0, 8000)}`,
    });

    return await ctx.runMutation(internal.practiceQuizzes.create, {
      createdBy: user._id,
      topic: args.topic,
      grade: args.grade,
      subject: args.subject,
      questions: output.questions,
    });
  },
});
