"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProgressNarrator } from "@/components/ProgressNarrator";
import { BarRow } from "@/components/charts";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const user = useQuery(api.users.current);
  const stats = useQuery(api.analytics.studentStats);
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
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {user ? `Karibu, ${user.displayName}` : "Loading…"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Learn anything — narrated, quizzed, and saved to your notebook.
      </p>

      {busy ? (
        <div className="mt-8">
          <ProgressNarrator />
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-border bg-card p-6"
          data-testid="topic-form"
        >
          <label htmlFor="topic" className="font-display text-lg font-bold">
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
              className="min-h-12 cursor-pointer rounded-xl bg-primary px-6 font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Generate lecture
            </button>
          </div>
          {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
        </form>
      )}

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="student-stats">
        <StatCard
          label="Lectures"
          value={stats ? String(stats.lecturesGenerated) : "—"}
          sub="topics you explored"
        />
        <StatCard
          label="Quizzes"
          value={stats ? String(stats.quizzesTaken) : "—"}
          sub={stats ? `avg score ${Math.round(stats.avgScore * 100)}%` : undefined}
        />
        <StatCard
          label="Streak"
          value={stats ? `${stats.streak} day${stats.streak === 1 ? "" : "s"}` : "—"}
          sub="learn today to keep it 🔥"
        />
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Weekly activity
          </p>
          <div className="mt-3">
            {stats ? <BarRow values={stats.weekly} label="Lectures per week" /> : null}
          </div>
        </div>
      </div>

      {/* Badges */}
      {stats && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.badges.map((b) => (
              <span
                key={b.name}
                className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
                  b.earned
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground opacity-60"
                }`}
              >
                {b.earned ? "★ " : "☆ "}
                {b.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Recent + review */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Recent lectures</h2>
          {stats === undefined ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
          ) : !stats || stats.recentTopics.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing yet — generate your first lecture above.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {stats.recentTopics.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/student/lecture/${t.id}`}
                    className="block rounded-xl border border-border px-4 py-3 font-bold transition-colors duration-150 hover:border-secondary hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {t.topic}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Catch up on class</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Review lessons your teacher delivered, simplified for revision — and save the good
            parts to your notes.
          </p>
          <Link
            href="/student/review"
            className="mt-4 inline-block rounded-full border border-border bg-background px-5 py-2 text-sm font-bold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Browse class sessions →
          </Link>
        </section>
      </div>
    </main>
  );
}
