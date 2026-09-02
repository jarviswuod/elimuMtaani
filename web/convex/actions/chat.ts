"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { generateText, useFixtures } from "../lib/claude";

/** Lecture-scoped multi-turn chat (US-08) — student open-topic lectures only. */
export const ask = action({
  args: { lectureId: v.id("lectures"), question: v.string() },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const lecture = await ctx.runQuery(api.lectures.get, { id: args.lectureId });
    if (!lecture) throw new Error("Lecture not found");
    if (lecture.source !== "open") throw new Error("Chat is only available on self-serve lectures");

    const history = await ctx.runQuery(api.chat.forLecture, { lectureId: args.lectureId });

    await ctx.runMutation(internal.chat.append, {
      lectureId: args.lectureId,
      role: "user",
      body: args.question,
    });

    const answer = useFixtures()
      ? "Great question! In fixtures mode I can only give this stock answer — set ANTHROPIC_API_KEY (and ELIMU_USE_FIXTURES=false) on the Convex deployment to chat for real. From the lecture: the sun drives the water cycle by evaporating water, which condenses into clouds and returns as rain."
      : await generateText({
          extraSystem: `You are answering follow-up questions about this specific lecture. Stay scoped to it; if asked something outside it, connect back to the lecture or say it's beyond this lesson.\n\nLECTURE "${lecture.topic}":\n${lecture.script.slice(0, 8000)}`,
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
