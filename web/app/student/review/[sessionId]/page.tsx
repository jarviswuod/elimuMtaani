"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SlidePlayer } from "@/components/SlidePlayer";
import { GameCard } from "@/components/GameCard";

/**
 * Read-only review of a teacher-delivered session (US-10).
 * No chat, no regenerate — and the mandatory AI banner (DEC-009).
 */
export default function ReviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const sessions = useQuery(api.leaderboard.deliveredSessions);
  const entry = sessions?.find((s) => s.sessionId === sessionId);
  const lecture = useQuery(
    api.lectures.get,
    entry ? { id: entry.lectureId as Id<"lectures"> } : "skip",
  );
  const simplify = useAction(api.actions.simplify.run);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    if (lecture && !summary) {
      if (lecture.simplifiedSummary) setSummary(lecture.simplifiedSummary);
      else void simplify({ lectureId: lecture._id }).then(setSummary).catch(() => {});
    }
  }, [lecture, summary, simplify]);

  if (sessions === undefined) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">Loading…</main>;
  }
  if (!entry || lecture === null) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">Session not found.</main>;
  }
  if (lecture === undefined) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">Loading…</main>;
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <Link href="/student/review" className="text-sm font-semibold text-primary hover:underline">
        ← All class sessions
      </Link>

      {/* Mandatory banner (DEC-009) */}
      <div className="mt-4 rounded-xl border border-secondary/50 bg-secondary/10 p-3 text-sm">
        This is an AI-generated revision aid based on your teacher&apos;s lesson — your
        teacher&apos;s class session is the source.
      </div>

      <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{lecture.topic}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Delivered by {entry.teacher}</p>

      {summary && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent">
            In simple words
          </h2>
          <p className="mt-2 leading-7">{summary}</p>
        </div>
      )}

      <div className="mt-6">
        <SlidePlayer slides={lecture.slides} mode="review" topic={lecture.topic} />
      </div>

      {/* Classroom game shown read-only — it's class history, not a playable surface (R1) */}
      {lecture.game && (
        <div className="mt-8">
          <GameCard game={lecture.game} lectureId={lecture._id} canRate={false} />
        </div>
      )}
    </main>
  );
}
