"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProgressRing, Sparkline } from "@/components/charts";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function TeacherDashboard() {
  const user = useQuery(api.users.current);
  const stats = useQuery(api.analytics.teacherStats);
  const timetables = useQuery(api.timetables.listMine);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user ? `Karibu, ${user.displayName}` : "Loading…"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your term at a glance — plan, deliver, and pace to the class.
          </p>
        </div>
        <Link
          href="/teacher/research"
          className="min-h-11 cursor-pointer rounded-full bg-primary px-6 py-2.5 font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          + New term
        </Link>
      </div>

      {/* Stat row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="teacher-stats">
        <StatCard
          label="Sessions delivered"
          value={stats ? String(stats.sessionsDelivered) : "—"}
          sub={stats ? `${stats.sessionsThisWeek} this week` : undefined}
        />
        <StatCard
          label="Avg understanding"
          value={stats ? `${Math.round(stats.avgUnderstanding * 100)}%` : "—"}
          sub="latest quiz per session"
        />
        <StatCard label="Points" value={stats ? String(stats.points) : "—"} sub="leaderboard score" />
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Understanding trend
          </p>
          <div className="mt-3">
            {stats && stats.trend.length > 0 ? (
              <Sparkline values={stats.trend} label="Class understanding trend" />
            ) : (
              <p className="text-sm text-muted-foreground">No sessions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum progress */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Curriculum progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How far each term plan has moved — days advanced through the understanding gate.
        </p>
        {stats === undefined || timetables === undefined ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : stats === null || stats.curriculum.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-bold">No term plans yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste one research source and get a full term timetable in under a minute.
            </p>
            <Link
              href="/teacher/research"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 font-bold text-on-primary transition-colors hover:bg-primary/90"
            >
              Start a term
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {stats.curriculum.map((c) => (
              <Link
                key={c.timetableId}
                href={`/teacher/timetable/${c.timetableId}`}
                className="flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ProgressRing value={c.pct} size={84} label={`${c.label} progress`} />
                <div className="min-w-0">
                  <p className="font-bold">{c.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.advanced} of {c.total} days advanced
                  </p>
                  <p className="mt-1 text-xs font-bold text-primary">Open timetable →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Revisit radar */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Revisit radar</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Topics still looping in the understanding gate — your class needs another pass here.
        </p>
        {stats && stats.revisitRadar.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {stats.revisitRadar.map((r) => (
              <li
                key={r.topic}
                className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent/5 px-4 py-3"
              >
                <p className="font-bold">{r.topic}</p>
                <p className="text-sm text-muted-foreground">
                  {r.attempts} attempt{r.attempts === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Nothing looping — every taught topic has advanced. 🎯
          </p>
        )}
      </section>
    </main>
  );
}
