"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SlidePlayer } from "@/components/SlidePlayer";
import { QuizCard } from "@/components/QuizCard";
import { GameCard } from "@/components/GameCard";
import { GameReviewChecklist } from "@/components/GameReviewChecklist";
import { GameCompanionView } from "@/components/GameCompanionView";
import { ProgressNarrator } from "@/components/ProgressNarrator";

// dayRef = `${timetableId}_${weekIdx}_${dayIdx}`
export default function SessionPage({ params }: { params: Promise<{ dayRef: string }> }) {
  const { dayRef } = use(params);
  const [timetableIdRaw, weekRaw, dayRaw] = dayRef.split("_");
  const timetableId = timetableIdRaw as Id<"timetables">;
  const weekIdx = Number(weekRaw);
  const dayIdx = Number(dayRaw);

  const timetable = useQuery(api.timetables.get, { id: timetableId });
  const session = useQuery(api.sessions.forDay, { timetableId, weekIdx, dayIdx });
  const generate = useAction(api.actions.generateLecture.run);
  const recordAttempt = useMutation(api.sessions.recordAttempt);
  const advanceTopic = useMutation(api.sessions.advanceTopic);
  const mergeIntoNextDay = useMutation(api.timetables.mergeIntoNextDay);

  const [busy, setBusy] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [gateDone, setGateDone] = useState(false);
  const [merged, setMerged] = useState(false);

  const day = timetable?.weeks[weekIdx]?.days[dayIdx];
  const lecture = useQuery(
    api.lectures.get,
    day?.lectureId ? { id: day.lectureId } : "skip",
  );

  if (timetable === undefined) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">Loading…</main>;
  }
  if (!timetable || !day) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">Day not found.</main>;
  }

  // Lazy generation (RISK-001): a linked day NEVER regenerates.
  async function prepare() {
    setBusy(true);
    try {
      await generate({
        topic: day!.topic,
        source: "cbc",
        researchExcerpt: day!.objective,
        timetableRef: { timetableId, weekIdx, dayIdx },
      });
      // linkage happens server-side via timetableRef in a follow-up mutation below
    } finally {
      setBusy(false);
    }
  }

  async function onScored(score: number) {
    setLastScore(score);
  }

  async function judge(classReady: boolean, reviewAction?: "recap" | "game_round") {
    if (lastScore === null || !day?.lectureId) return;
    const sessionId = await recordAttempt({
      timetableId,
      weekIdx,
      dayIdx,
      lectureId: day.lectureId,
      quizScore: lastScore,
      classReady,
      reviewAction,
    });
    if (classReady) {
      await advanceTopic({ sessionId });
      setGateDone(true);
    }
  }

  const revisitSuggested = lastScore !== null && lastScore < 0.6;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/timetable/${timetableId}`}
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Timetable
      </Link>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{day.topic}</h1>
        <p className="shrink-0 text-sm text-muted-foreground">
          Week {weekIdx + 1} · Day {dayIdx + 1}
        </p>
      </div>
      <p className="mt-1 text-muted-foreground">{day.objective}</p>

      <div className="mt-8">
        {busy ? (
          <ProgressNarrator label="Preparing today's session" />
        ) : !day.lectureId ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-bold">This day&apos;s session hasn&apos;t been prepared yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              One click generates the narrated slides for this topic. Prepared once, kept forever.
            </p>
            <button
              type="button"
              onClick={prepare}
              className="mt-5 min-h-12 cursor-pointer rounded-xl bg-primary px-8 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Prepare this session
            </button>
          </div>
        ) : lecture === undefined || lecture === null ? (
          <p>Loading session…</p>
        ) : (
          <>
            <SlidePlayer slides={lecture.slides} mode="live" topic={lecture.topic} />

            {/* Game branch (Sprint 002): appears when ready — generated async */}
            {lecture.game && (
              <div className="mt-8 space-y-6">
                <GameCard game={lecture.game} lectureId={lecture._id} canRate />
                {lecture.game.source === "generated" && !lecture.game.teacherReviewed ? (
                  <GameReviewChecklist lectureId={lecture._id} onReviewed={() => {}} />
                ) : (
                  <GameCompanionView game={lecture.game} />
                )}
              </div>
            )}

            {/* Post-session understanding gate (US-07, DEC-017) */}
            <div className="mt-8">
              <h2 className="text-lg font-bold">After the session: check understanding</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Take the quiz standing in for your class, then make the call — the system prepares,
                you decide. No individual learner is ever recorded.
              </p>
              <div className="mt-4">
                <QuizCard lectureId={lecture._id} onScored={onScored} />
              </div>

              {lastScore !== null && !gateDone && (
                <div
                  className={`mt-6 rounded-2xl border p-6 ${revisitSuggested ? "border-destructive/40 bg-destructive/5" : "border-accent/40 bg-accent/5"}`}
                >
                  <p className="font-bold">
                    Class score: {Math.round(lastScore * 100)}% —{" "}
                    {revisitSuggested ? "a revisit looks wise." : "looking good."}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your call: is the class ready to move to the next topic?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => judge(true)}
                      className="min-h-11 cursor-pointer rounded-xl bg-primary px-5 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      Class got it — advance ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Zero model calls (NFR-22): replaying the game / recapping is free.
                        judge(false, lecture.game ? "game_round" : "recap");
                        setLastScore(null); // back to re-quiz state after the review round
                      }}
                      className="min-h-11 cursor-pointer rounded-xl border border-border bg-card px-5 font-semibold transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {lecture.game
                        ? "Not yet — another game round, then re-quiz"
                        : "Not yet — review round, then re-quiz"}
                    </button>
                    {revisitSuggested && !merged && (
                      <button
                        type="button"
                        onClick={async () => {
                          await judge(false, "recap");
                          const ok = await mergeIntoNextDay({ timetableId, weekIdx, dayIdx });
                          setMerged(Boolean(ok));
                        }}
                        className="min-h-11 cursor-pointer rounded-xl border border-destructive/40 px-5 font-semibold text-destructive transition-colors duration-200 hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        Merge into tomorrow&apos;s session
                      </button>
                    )}
                  </div>
                </div>
              )}

              {gateDone && (
                <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-6 text-center">
                  <p className="font-bold">Topic advanced ✓ — the next day is unlocked.</p>
                  <Link
                    href={`/teacher/timetable/${timetableId}`}
                    className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    Back to the timetable →
                  </Link>
                </div>
              )}

              {merged && (
                <p className="mt-4 rounded-xl bg-muted p-4 text-sm">
                  Merged. Tomorrow&apos;s session now opens with a recap of &ldquo;{day.topic}&rdquo;
                  and will be regenerated with the combined scope.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
