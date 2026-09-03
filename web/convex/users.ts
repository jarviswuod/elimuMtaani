import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** The signed-in user's record, or null if signed out / not yet created. */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

/** Create the user row on first sign-in (idempotent). */
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      displayName: identity.name ?? identity.email ?? "New user",
    });
  },
});

/** Teacher's student roster (US: "manage students") — every student user, active or not. */
export const listStudents = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || user.role !== "teacher") return [];
    const all = await ctx.db.query("users").collect();
    return all
      .filter((u) => u.role === "student")
      .map((u) => ({ _id: u._id, displayName: u.displayName }));
  },
});

/** One-time role selection from the onboarding screen. */
export const setRole = mutation({
  args: { role: v.union(v.literal("student"), v.literal("teacher")) },
  handler: async (ctx, { role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found — call ensureUser first");
    if (user.role) return user.role; // role is one-time; ignore repeat picks
    await ctx.db.patch(user._id, { role });
    return role;
  },
});
