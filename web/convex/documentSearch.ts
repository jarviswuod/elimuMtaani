import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { embed, useFixtures } from "./lib/nvidia";

/** Vector-search the knowledge base for chunks relevant to `queryText`. */
export const search = action({
  args: {
    queryText: v.string(),
    grade: v.optional(v.string()),
    subject: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { queryText, grade, subject, limit = 6 }): Promise<string[]> => {
    if (useFixtures()) return [];

    const readyDocs = await ctx.runQuery(internal.documents.listReadyInternal, { grade, subject });
    if (readyDocs.length === 0) return [];
    const allowedIds = new Set(readyDocs.map((d) => d._id));

    const [vector] = await embed([queryText], "query");
    // Over-fetch: vectorSearch has no "id IN (...)" filter, so we hydrate and
    // filter to the allowed documents afterward.
    const hits = await ctx.vectorSearch("documentChunks", "by_embedding", {
      vector,
      limit: limit * 3,
    });

    const chunks = await ctx.runQuery(internal.documents.getChunksByIds, {
      ids: hits.map((h) => h._id),
    });

    return chunks
      .filter((c): c is NonNullable<typeof c> => c !== null && allowedIds.has(c.documentId))
      .slice(0, limit)
      .map((c) => c.text);
  },
});
