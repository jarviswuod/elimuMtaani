"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function TeacherHome() {
  const user = useQuery(api.users.current);

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
          <p className="text-lg font-bold">Start research</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit one source, generate your term timetable. (Checkpoint 3)
          </p>
        </Link>
        <div className="rounded-2xl border border-dashed border-border p-6 opacity-70">
          <p className="text-lg font-bold">Leaderboard</p>
          <p className="mt-1 text-sm text-muted-foreground">Coming in Checkpoint 4.</p>
        </div>
      </div>
    </main>
  );
}
