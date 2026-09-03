"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function StudentLeaderboardPage() {
  const rows = useQuery(api.studentLeaderboard.rankings);
  const mine = useQuery(api.studentLeaderboard.mine);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/student" className="text-sm font-semibold text-primary hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Leaderboard</h1>
      <p className="mt-2 text-muted-foreground">
        Points come from quiz and practice-quiz scores — 100 points per 100% quiz.
      </p>

      {mine && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Your standing</p>
            <p className="mt-1 text-2xl font-extrabold">{mine.points} pts</p>
          </div>
          {mine.badge && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              {mine.badge}
            </span>
          )}
        </div>
      )}

      {rows === undefined ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No quiz attempts yet — take a quiz to appear here.
        </p>
      ) : (
        <ol className="mt-8 space-y-3">
          {rows.map((r, i) => (
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
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-primary">{r.points} pts</p>
                {r.badge && <p className="text-xs text-muted-foreground">{r.badge}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
