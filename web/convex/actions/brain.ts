"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { generateText, useFixtures, SONNET_MODEL } from "../lib/claude";

const BRAIN_SYSTEM = `You are Mwalimu Brain, a friendly always-available study assistant inside elimuMtaani, an education app for Kenya's Competency-Based Curriculum (CBC).
You help both teachers and students understand any topic or subject — not limited to one lecture. Use Kenya and East-Africa grounded examples where they help.
Keep answers clear, encouraging and appropriately concise for a spoken/read-aloud answer. Never invent curriculum requirements, exam formats, policies, or statistics — say so plainly if asked.
All your output is AI-generated and will be labelled as such to users.`;

/** Mwalimu Brain (Claude Sonnet 5) — the floating general Q&A chatbot, not scoped to a lecture. */
export const ask = action({
  args: { question: v.string() },
  handler: async (ctx, { question }): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.runQuery(api.users.current, {});
    if (!user) throw new Error("User not found");

    const history = await ctx.runQuery(api.brain.forUser, {});

    await ctx.runMutation(internal.brain.append, { userId: user._id, role: "user", body: question });

    const answer = useFixtures()
      ? "Great question! I'm running in fixtures mode right now — set ANTHROPIC_API_KEY (and ELIMU_USE_FIXTURES=false) on the Convex deployment so Mwalimu Brain can answer for real."
      : await generateText({
          model: SONNET_MODEL,
          extraSystem: BRAIN_SYSTEM,
          messages: [
            ...history.map((m) => ({ role: m.role, content: m.body })),
            { role: "user" as const, content: question },
          ],
        });

    await ctx.runMutation(internal.brain.append, { userId: user._id, role: "assistant", body: answer });
    return answer;
  },
});
