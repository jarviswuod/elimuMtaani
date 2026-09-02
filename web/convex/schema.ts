import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Sprint 001 schema — see planning/sprints/001-unified-hackathon-demo/blueprint.md
// Invariant: no learner PII beyond the Clerk identity (planning/DOMAIN.md).

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    role: v.optional(v.union(v.literal("student"), v.literal("teacher"))),
    displayName: v.string(),
  }).index("by_clerkId", ["clerkId"]),

  lectures: defineTable({
    topic: v.string(),
    outline: v.array(v.string()),
    script: v.string(),
    slides: v.array(
      v.object({
        title: v.string(),
        bullets: v.array(v.string()),
        visual: v.optional(v.string()),
        narration: v.string(),
      }),
    ),
    audioRef: v.optional(v.id("_storage")),
    source: v.union(v.literal("open"), v.literal("cbc")),
    timetableRef: v.optional(
      v.object({
        timetableId: v.id("timetables"),
        weekIdx: v.number(),
        dayIdx: v.number(),
      }),
    ),
    deliveredBy: v.optional(v.id("users")),
    createdBy: v.id("users"),
    simplifiedSummary: v.optional(v.string()), // cached haiku output for the student review view
  }).index("by_createdBy", ["createdBy"]),

  chatMessages: defineTable({
    lectureId: v.id("lectures"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    body: v.string(),
  }).index("by_lectureId", ["lectureId"]),

  quizzes: defineTable({
    lectureId: v.id("lectures"),
    questions: v.array(
      v.object({
        q: v.string(),
        options: v.array(v.string()),
        answerIdx: v.number(),
        explanation: v.string(),
      }),
    ),
    score: v.optional(v.number()),
    takenBy: v.optional(v.id("users")),
  }).index("by_lectureId", ["lectureId"]),

  researchSources: defineTable({
    teacherId: v.id("users"),
    kind: v.union(v.literal("kicd"), v.literal("youtube"), v.literal("pasted")),
    title: v.string(),
    originUrl: v.optional(v.string()),
    extractedText: v.string(),
    grade: v.string(),
    subject: v.string(),
    term: v.number(),
  }).index("by_teacherId", ["teacherId"]),

  timetables: defineTable({
    teacherId: v.id("users"),
    researchSourceId: v.id("researchSources"),
    grade: v.string(),
    subject: v.string(),
    term: v.number(),
    weeks: v.array(
      v.object({
        days: v.array(
          v.object({
            topic: v.string(),
            objective: v.string(),
            lectureId: v.optional(v.id("lectures")),
          }),
        ),
      }),
    ),
  }).index("by_teacherId", ["teacherId"]),

  // Understanding-gate shape (Sprint 002 blueprint / DEC-017): attempts are
  // aggregate-only — the teacher's stand-in score + whole-class judgment.
  // Never any individual learner data (R1).
  sessions: defineTable({
    timetableId: v.id("timetables"),
    weekIdx: v.number(),
    dayIdx: v.number(),
    lectureId: v.id("lectures"),
    teacherId: v.id("users"),
    attempts: v.array(
      v.object({
        quizScore: v.number(),
        classReady: v.boolean(),
        reviewAction: v.optional(v.union(v.literal("recap"), v.literal("game_round"))),
      }),
    ),
    status: v.union(v.literal("open"), v.literal("advanced")),
    deliveredAt: v.number(),
  })
    .index("by_timetableId", ["timetableId"])
    .index("by_teacherId", ["teacherId"]),
});
