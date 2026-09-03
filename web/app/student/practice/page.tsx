"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PracticeQuizCard } from "@/components/PracticeQuizCard";
import { ProgressNarrator } from "@/components/ProgressNarrator";

export default function PracticePage() {
  const myQuizzes = useQuery(api.practiceQuizzes.mine);
  const generate = useAction(api.actions.generatePracticeQuiz.run);
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<Id<"practiceQuizzes"> | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!topic.trim() || !grade.trim() || !subject.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const id = await generate({ topic: topic.trim(), grade: grade.trim(), subject: subject.trim() });
      setActiveId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/student" className="text-sm font-semibold text-primary hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Practice quizzes</h1>
      <p className="mt-2 text-muted-foreground">
        Generated from your teacher&apos;s uploaded knowledge-base documents — pick a grade, subject and
        topic to practice.
      </p>

      {busy ? (
        <div className="mt-8">
          <ProgressNarrator label="Building your practice quiz" />
        </div>
      ) : activeId ? (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="mb-4 text-sm font-semibold text-primary hover:underline"
          >
            ← New practice quiz
          </button>
          <PracticeQuizCard practiceQuizId={activeId} />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Grade
              <input
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Grade 5"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </label>
            <label className="block text-sm font-semibold">
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Science"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Topic
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The water cycle"
              className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </label>
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={!topic.trim() || !grade.trim() || !subject.trim()}
            className="min-h-12 w-full cursor-pointer rounded-xl bg-primary font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Generate practice quiz
          </button>
        </form>
      )}

      {!busy && !activeId && myQuizzes && myQuizzes.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold">Your past practice quizzes</h2>
          <ul className="mt-4 space-y-2">
            {myQuizzes.map((q) => (
              <li key={q._id}>
                <button
                  type="button"
                  onClick={() => setActiveId(q._id)}
                  className="block w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <p className="font-semibold">{q.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {q.grade} · {q.subject}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
