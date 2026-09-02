import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function currentUser(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
}

export const save = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    sourceType: v.union(v.literal("chat"), v.literal("lecture"), v.literal("manual")),
    lectureId: v.optional(v.id("lectures")),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await currentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    return await ctx.db.insert("notes", { userId: user._id, ...args });
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: { id: v.id("notes"), title: v.string(), body: v.string() },
  handler: async (ctx, { id, title, body }) => {
    const user = await currentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const note = await ctx.db.get(id);
    if (!note || note.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(id, { title, body });
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    const user = await currentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const note = await ctx.db.get(id);
    if (!note || note.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});
