"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { ProgressNarrator } from "@/components/ProgressNarrator";

export default function StudentHome() {
  const router = useRouter();
  const user = useQuery(api.users.current);
  const lectures = useQuery(api.lectures.listMine);
  const generate = useAction(api.actions.generateLecture.run);
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!topic.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const id = await generate({ topic: topic.trim(), source: "open" });
      router.push(`/student/lecture/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed — try again.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-accent">Student</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            {user ? `Karibu, ${user.displayName}` : "Loading…"}
          </h1>
        </div>
        <UserButton />
      </header>

      {busy ? (
        <div className="mt-10">
          <ProgressNarrator />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-border bg-card p-6">
          <label htmlFor="topic" className="text-lg font-bold">
            What do you want to learn today?
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, The French Revolution, Fractions…"
              className="min-h-12 flex-1 rounded-xl border border-border bg-background px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <button
              type="submit"
              disabled={!topic.trim()}
              className="min-h-12 cursor-pointer rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Generate lecture
            </button>
          </div>
          {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
          <p className="mt-3 text-xs text-muted-foreground">
            Lectures are AI-generated and clearly labelled. Narration plays right in your browser.
          </p>
        </form>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold">My lectures</h2>
        {lectures === undefined ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : lectures.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nothing yet — generate your first lecture above.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {lectures.map((l) => (
              <li key={l._id}>
                <Link
                  href={`/student/lecture/${l._id}`}
                  className="block rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <p className="font-bold">{l.topic}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {l.slides.length} slides · {l.source === "open" ? "self-serve" : "class lesson"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10">
        <Link href="/student/review" className="text-sm font-semibold text-primary hover:underline">
          Review class sessions your teacher delivered →
        </Link>
      </div>
    </main>
  );
}
