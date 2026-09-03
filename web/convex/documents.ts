import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/** Client uploads the file bytes directly to this URL, then calls `create`. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || user.role !== "teacher") throw new Error("Teachers only");
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    kind: v.union(
      v.literal("pdf"),
      v.literal("docx"),
      v.literal("pptx"),
      v.literal("csv"),
      v.literal("xlsx"),
    ),
    grade: v.string(),
    subject: v.string(),
    term: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || user.role !== "teacher") throw new Error("Teachers only");
    const documentId = await ctx.db.insert("documents", {
      teacherId: user._id,
      title: args.title,
      kind: args.kind,
      storageId: args.storageId,
      grade: args.grade,
      subject: args.subject,
      term: args.term,
      status: "processing",
    });
    await ctx.scheduler.runAfter(0, api.actions.parseDocument.run, { documentId });
    return documentId;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    return await ctx.db
      .query("documents")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", user._id))
      .order("desc")
      .collect();
  },
});

/** Ready documents matching a grade/subject, for student practice-quiz and chat grounding. */
export const listReady = query({
  args: { grade: v.optional(v.string()), subject: v.optional(v.string()) },
  handler: async (ctx, { grade, subject }) => {
    const docs = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("status"), "ready"))
      .collect();
    return docs.filter(
      (d) => (!grade || d.grade === grade) && (!subject || d.subject === subject),
    );
  },
});

/** Scheduled parse action has no caller identity — fetch by id directly. */
export const getInternal = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => ctx.db.get(documentId),
});

export const listReadyInternal = internalQuery({
  args: { grade: v.optional(v.string()), subject: v.optional(v.string()) },
  handler: async (ctx, { grade, subject }) => {
    const docs = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("status"), "ready"))
      .collect();
    return docs.filter(
      (d) => (!grade || d.grade === grade) && (!subject || d.subject === subject),
    );
  },
});

export const getChunksByIds = internalQuery({
  args: { ids: v.array(v.id("documentChunks")) },
  handler: async (ctx, { ids }) => Promise.all(ids.map((id) => ctx.db.get(id))),
});

export const setStatus = internalMutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("processing"), v.literal("ready"), v.literal("failed")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { documentId, status, error }) => {
    await ctx.db.patch(documentId, { status, error });
  },
});

export const insertChunk = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    chunkIdx: v.number(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documentChunks", args);
  },
});
