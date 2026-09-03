"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LeaderboardPage() {
  const rows = useQuery(api.leaderboard.rankings);
  const studentRows = useQuery(api.studentLeaderboard.rankings);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/teacher" className="text-sm font-semibold text-primary hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Teacher leaderboard</h1>
      <p className="mt-2 text-muted-foreground">
        Sessions delivered ×10 · recovered topics ×15 — honesty about a tough lesson scores more
        than pretending it went well.
      </p>

      {rows === undefined ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No sessions delivered yet. Deliver your first session to appear here.
        </p>
      ) : (
        <ol className="mt-8 space-y-3">
          {rows.map((r, i) => (
            <li
              key={r.name + i}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${
                  i === 0 ? "bg-primary text-on-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.delivered} session{r.delivered === 1 ? "" : "s"} delivered
                  {r.recovered > 0 && ` · ${r.recovered} topic${r.recovered === 1 ? "" : "s"} recovered 🔥`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-primary">{r.points} pts</p>
                <p className="text-xs text-muted-foreground">
                  avg understanding {Math.round(r.avgScore * 100)}%
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <h2 className="mt-12 text-2xl font-extrabold tracking-tight">Student leaderboard</h2>
      <p className="mt-2 text-muted-foreground">
        Points from quiz and practice-quiz activity — the same ranking students see themselves.
      </p>
      {studentRows === undefined ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : studentRows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No quiz attempts yet.
        </p>
      ) : (
        <ol className="mt-8 space-y-3">
          {studentRows.map((r, i) => (
            <li
              key={r.userId}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${
                  i === 0 ? "bg-primary text-on-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.quizzesTaken} quiz{r.quizzesTaken === 1 ? "" : "zes"} taken
                  {r.badge && ` · ${r.badge} badge`}
                </p>
              </div>
              <p className="text-lg font-extrabold text-primary">{r.points} pts</p>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
