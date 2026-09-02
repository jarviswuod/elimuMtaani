"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function TeacherHome() {
  const user = useQuery(api.users.current);
  const timetables = useQuery(api.timetables.listMine);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-accent">Teacher</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            {user ? `Karibu, ${user.displayName}` : "Loading…"}
          </h1>
        </div>
        <UserButton />
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/teacher/research"
          className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <p className="text-lg font-bold">Start a new term</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste one research source → get your full term timetable.
          </p>
        </Link>
        <Link
          href="/teacher/leaderboard"
          className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <p className="text-lg font-bold">Leaderboard</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sessions delivered and class understanding, across teachers.
          </p>
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold">My timetables</h2>
        {timetables === undefined ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : timetables.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No timetables yet — start a new term above.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {timetables.map((t) => (
              <li key={t._id}>
                <Link
                  href={`/teacher/timetable/${t._id}`}
                  className="block rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <p className="font-bold">
                    {t.grade} {t.subject}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Term {t.term} · {t.weeks.length} weeks
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
