"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ReviewListPage() {
  const sessions = useQuery(api.leaderboard.deliveredSessions);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/student" className="text-sm font-semibold text-primary hover:underline">
        ← My lectures
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Review class sessions</h1>
      <p className="mt-2 text-muted-foreground">
        Lessons your teachers delivered, simplified for revision. Read-only.
      </p>

      {sessions === undefined ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No class sessions delivered yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {sessions.map((s) => (
            <li key={s.sessionId}>
              <Link
                href={`/student/review/${s.sessionId}`}
                className="block rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <p className="font-bold">{s.topic}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Delivered by {s.teacher} · {new Date(s.deliveredAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
