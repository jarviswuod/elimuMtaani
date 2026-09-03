"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function StudentsPage() {
  const students = useQuery(api.users.listStudents);
  const rankings = useQuery(api.studentLeaderboard.rankings);

  const rows = students?.map((s) => {
    const rank = rankings?.find((r) => r.userId === s._id);
    return {
      id: s._id,
      name: s.displayName,
      points: rank?.points ?? 0,
      badge: rank?.badge ?? null,
      quizzesTaken: rank?.quizzesTaken ?? 0,
    };
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/teacher" className="text-sm font-semibold text-primary hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Students</h1>
      <p className="mt-2 text-muted-foreground">
        Every learner on the platform, with their quiz activity and leaderboard standing.
      </p>

      {rows === undefined ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No students have signed up yet.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Quizzes taken</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Badge</th>
              </tr>
            </thead>
            <tbody>
              {[...rows]
                .sort((a, b) => b.points - a.points)
                .map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.quizzesTaken}</td>
                    <td className="px-4 py-3 font-bold text-primary">{r.points}</td>
                    <td className="px-4 py-3">
                      {r.badge ? (
                        <span className="rounded-full border border-accent/30 bg-accent/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                          {r.badge}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
