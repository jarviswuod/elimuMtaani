import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { FIXTURE_LECTURE, FIXTURE_QUIZ } from "./fixtures/lecture";

// Idempotent demo seeder (CP-B). Run once after deploying:
//   npx convex run seedDemo:run '{"teacherClerkId":"...","studentClerkId":"..."}'
// Safe to re-run — guards on existing rows.

export const run = internalMutation({
  args: {
    teacherClerkId: v.string(),
    studentClerkId: v.string(),
  },
  handler: async (ctx, { teacherClerkId, studentClerkId }) => {
    // ── Upsert users ──────────────────────────────────────────────────────────
    let teacherId = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", teacherClerkId))
      .unique()
      .then((u) => u?._id);

    if (!teacherId) {
      teacherId = await ctx.db.insert("users", {
        clerkId: teacherClerkId,
        role: "teacher",
        displayName: "Demo Teacher",
      });
    } else {
      await ctx.db.patch(teacherId, { role: "teacher", displayName: "Demo Teacher" });
    }

    let studentId = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", studentClerkId))
      .unique()
      .then((u) => u?._id);

    if (!studentId) {
      studentId = await ctx.db.insert("users", {
        clerkId: studentClerkId,
        role: "student",
        displayName: "Demo Student",
      });
    } else {
      await ctx.db.patch(studentId, { role: "student", displayName: "Demo Student" });
    }

    // ── Guard: skip if timetable already seeded ───────────────────────────────
    const existingTimetables = await ctx.db
      .query("timetables")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId!))
      .collect();
    if (existingTimetables.length > 0) return { teacherId, studentId, skipped: true };

    // ── Research source ───────────────────────────────────────────────────────
    const sourceId = await ctx.db.insert("researchSources", {
      teacherId: teacherId!,
      kind: "kicd",
      title: "KICD CBC Grade 8 Integrated Science Design",
      originUrl: "http://kicd.ac.ke/curriculum-designs/",
      extractedText:
        "Grade 8 Integrated Science covers: The Water Cycle and Weather Patterns; " +
        "Photosynthesis and the Carbon Cycle; Electricity and Circuits; Cells and Micro-organisms; " +
        "Forces and Motion; Sound and Light; The Solar System. " +
        "Learning outcomes emphasise inquiry, local context, and practical application.",
      grade: "Grade 8",
      subject: "Integrated Science",
      term: 1,
    });

    // ── Timetable — 2 weeks, mix of statuses ─────────────────────────────────
    const topics = [
      { topic: "The Water Cycle", objective: "Explain the stages of the water cycle" },
      { topic: "Evaporation in Kenya", objective: "Relate evaporation to local climate" },
      { topic: "Condensation and Cloud Formation", objective: "Describe how clouds form" },
      { topic: "Precipitation and Run-off", objective: "Explain rainfall and run-off" },
      { topic: "Human Impact on the Water Cycle", objective: "Analyse deforestation effects" },
      { topic: "Introduction to Photosynthesis", objective: "State the inputs and outputs" },
      { topic: "Chlorophyll and Sunlight", objective: "Explain the role of chlorophyll" },
      { topic: "The Carbon Cycle Overview", objective: "Link photosynthesis to carbon cycling" },
      { topic: "Plants and Oxygen Production", objective: "Measure oxygen from leaves" },
      { topic: "Review: Water & Carbon Cycles", objective: "Consolidate both cycles" },
    ];

    const timetableId = await ctx.db.insert("timetables", {
      teacherId: teacherId!,
      researchSourceId: sourceId,
      grade: "Grade 8",
      subject: "Integrated Science",
      term: 1,
      weeks: [
        { days: topics.slice(0, 5).map((t) => ({ topic: t.topic, objective: t.objective })) },
        { days: topics.slice(5).map((t) => ({ topic: t.topic, objective: t.objective })) },
      ],
    });

    // ── Lectures for the first 7 topics ──────────────────────────────────────
    const now = Date.now();
    const DAY = 24 * 3600 * 1000;

    const lectureIds: Array<ReturnType<typeof ctx.db.insert>> = [];
    for (let i = 0; i < 7; i++) {
      const lectureId = await ctx.db.insert("lectures", {
        topic: topics[i].topic,
        outline: FIXTURE_LECTURE.outline,
        script: FIXTURE_LECTURE.script,
        slides: FIXTURE_LECTURE.slides,
        source: "cbc",
        timetableRef: { timetableId, weekIdx: Math.floor(i / 5), dayIdx: i % 5 },
        deliveredBy: teacherId!,
        createdBy: teacherId!,
      });
      lectureIds.push(lectureId as unknown as ReturnType<typeof ctx.db.insert>);
    }
    const resolvedLectureIds = lectureIds as unknown as string[];

    // ── Sessions: 5 advanced, 1 multi-attempt-open, 1 open ───────────────────
    const scores = [0.85, 0.9, 0.75, 0.88, 0.82, 0.55, 0.6];
    const statuses: Array<"advanced" | "open"> = [
      "advanced", "advanced", "advanced", "advanced", "advanced", "open", "open",
    ];
    for (let i = 0; i < 7; i++) {
      const weekIdx = Math.floor(i / 5);
      const dayIdx = i % 5;
      const attempts =
        i === 5
          ? [
              { quizScore: 0.48, classReady: false, reviewAction: "recap" as const },
              { quizScore: scores[i], classReady: false },
            ]
          : [{ quizScore: scores[i], classReady: statuses[i] === "advanced" }];

      await ctx.db.insert("sessions", {
        timetableId,
        weekIdx,
        dayIdx,
        lectureId: resolvedLectureIds[i] as unknown as import("./_generated/dataModel").Id<"lectures">,
        teacherId: teacherId!,
        attempts,
        status: statuses[i],
        deliveredAt: now - (6 - i) * DAY,
      });

      // quiz for each session
      await ctx.db.insert("quizzes", {
        lectureId: resolvedLectureIds[i] as unknown as import("./_generated/dataModel").Id<"lectures">,
        questions: FIXTURE_QUIZ.questions,
        score: scores[i],
        takenBy: teacherId!,
      });
    }

    // ── Student: open lectures + quizzes for streak/badges ───────────────────
    const studentTopics = [
      "Photosynthesis",
      "The Water Cycle",
      "Forces and Motion",
      "Sound Waves",
      "Electricity Basics",
    ];
    for (let i = 0; i < studentTopics.length; i++) {
      const lectureId = await ctx.db.insert("lectures", {
        topic: studentTopics[i],
        outline: FIXTURE_LECTURE.outline,
        script: FIXTURE_LECTURE.script,
        slides: FIXTURE_LECTURE.slides,
        source: "open",
        createdBy: studentId!,
      });

      const quizScore = [0.9, 0.7, 0.85, 0.6, 0.95][i];
      await ctx.db.insert("quizzes", {
        lectureId: lectureId as unknown as import("./_generated/dataModel").Id<"lectures">,
        questions: FIXTURE_QUIZ.questions,
        score: quizScore,
        takenBy: studentId!,
      });

      // stagger creation times over the past 5 days for streak calculation
      // (Convex doesn't let us set _creationTime — streak will read actual creation time)
    }

    // ── Chat messages for the first teacher lecture ───────────────────────────
    await ctx.db.insert("chatMessages", {
      lectureId: resolvedLectureIds[0] as unknown as import("./_generated/dataModel").Id<"lectures">,
      role: "user",
      body: "Why does evaporation happen faster on a hot day?",
    });
    await ctx.db.insert("chatMessages", {
      lectureId: resolvedLectureIds[0] as unknown as import("./_generated/dataModel").Id<"lectures">,
      role: "assistant",
      body:
        "On a hot day the sun transfers more energy to the water molecules. " +
        "The faster-moving molecules at the surface break free of the liquid's surface tension and " +
        "escape as vapour. Near Lake Victoria you can actually see this morning haze rising before 9 am.",
    });

    // ── Saved notes ───────────────────────────────────────────────────────────
    await ctx.db.insert("notes", {
      userId: teacherId!,
      title: "Water cycle recap — key points for class",
      body:
        "1. Evaporation driven by solar energy.\n2. Condensation at altitude.\n3. " +
        "Precipitation returns water to ground.\n4. Local example: Lake Victoria morning haze.",
      sourceType: "chat",
      lectureId: resolvedLectureIds[0] as unknown as import("./_generated/dataModel").Id<"lectures">,
      topic: "The Water Cycle",
    });
    await ctx.db.insert("notes", {
      userId: studentId!,
      title: "Photosynthesis — things to remember",
      body:
        "Inputs: CO₂ + H₂O + sunlight.\n" +
        "Output: glucose + oxygen.\n" +
        "Chlorophyll captures light in the green parts of leaves.\n" +
        "Good analogy: leaves are tiny solar panels that make food.",
      sourceType: "lecture",
      topic: "Photosynthesis",
    });

    return { teacherId, studentId, timetableId, skipped: false };
  },
});
