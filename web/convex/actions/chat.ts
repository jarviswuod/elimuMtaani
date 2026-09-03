"use node";

import { action, ActionCtx } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { generateText, useFixtures } from "../lib/claude";

/** Lecture-scoped multi-turn chat (US-08). Grounded in the lecture script plus
 *  any matching knowledge-base documents (Part 1). */
export const ask = action({
  args: { lectureId: v.id("lectures"), question: v.string() },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const lecture = await ctx.runQuery(api.lectures.get, { id: args.lectureId });
    if (!lecture) throw new Error("Lecture not found");

    const history = await ctx.runQuery(api.chat.forLecture, { lectureId: args.lectureId });

    await ctx.runMutation(internal.chat.append, {
      lectureId: args.lectureId,
      role: "user",
      body: args.question,
    });

    const answer = useFixtures()
      ? "Great question! In fixtures mode I can only give this stock answer — set ANTHROPIC_API_KEY (and ELIMU_USE_FIXTURES=false) on the Convex deployment to chat for real. From the lecture: the sun drives the water cycle by evaporating water, which condenses into clouds and returns as rain."
      : await generateText({
          extraSystem: await buildGroundingContext(ctx, lecture, args.question),
          messages: [
            ...history.map((m) => ({ role: m.role, content: m.body })),
            { role: "user" as const, content: args.question },
          ],
        });

    await ctx.runMutation(internal.chat.append, {
      lectureId: args.lectureId,
      role: "assistant",
      body: answer,
    });
    return answer;
  },
});

type LectureDoc = {
  topic: string;
  script: string;
  timetableRef?: { timetableId: import("../_generated/dataModel").Id<"timetables"> } | null;
};

/** Base lecture-script grounding, plus knowledge-base chunks when any match (Part 1). */
async function buildGroundingContext(
  ctx: ActionCtx,
  lecture: LectureDoc,
  question: string,
): Promise<string> {
  let grade: string | undefined;
  let subject: string | undefined;
  if (lecture.timetableRef) {
    const timetable = await ctx.runQuery(api.timetables.get, { id: lecture.timetableRef.timetableId });
    grade = timetable?.grade;
    subject = timetable?.subject;
  }

  const kbChunks: string[] = await ctx.runAction(api.documentSearch.search, {
    queryText: `${lecture.topic}\n${question}`,
    grade,
    subject,
    limit: 4,
  });

  const base = `You are answering follow-up questions about this specific lecture. Stay scoped to it; if asked something outside it, connect back to the lecture or say it's beyond this lesson.\n\nLECTURE "${lecture.topic}":\n${lecture.script.slice(0, 8000)}`;
  if (kbChunks.length === 0) return base;
  return `${base}\n\nReference material from the teacher's uploaded documents (use it if relevant, ignore it otherwise):\n${kbChunks.join("\n---\n")}`;
}
