"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { synthesizeSpeech, useFixtures } from "./lib/nvidia";

/**
 * NVIDIA Magpie TTS Zeroshot, behind the interface RISK-003 already named.
 * Fixtures mode / any failure → return null so the client falls back to the
 * browser's SpeechSynthesis (planning/RISKS.md fallback chain).
 */
export const synthesize = action({
  args: { text: v.string() },
  handler: async (ctx, { text }): Promise<{ url: string } | null> => {
    if (useFixtures()) return null;
    try {
      const audio = await synthesizeSpeech(text);
      const blob = new Blob([audio], { type: "audio/wav" });
      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);
      return url ? { url } : null;
    } catch {
      return null;
    }
  },
});
