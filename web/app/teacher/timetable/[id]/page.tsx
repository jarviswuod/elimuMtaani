"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GeneratedBadge } from "@/components/GeneratedBadge";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function TimetablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const timetable = useQuery(api.timetables.get, { id: id as Id<"timetables"> });
  const sessions = useQuery(api.sessions.forTimetable, {
    timetableId: id as Id<"timetables">,
  });

  if (timetable === undefined) {
    return <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">Loading…</main>;
  }
  if (timetable === null) {
    return <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">Timetable not found.</main>;
  }

  const advanced = new Set(
    (sessions ?? []).filter((s) => s.status === "advanced").map((s) => `${s.weekIdx}-${s.dayIdx}`),
  );
  // Understanding gate (DEC-017): day N+1 unlocks when day N is advanced.
  // The teacher can always open any past day; only strictly-future days lock.
  let firstOpenFlat = 0;
  outer: for (let w = 0; w < timetable.weeks.length; w++) {
    for (let d = 0; d < 5; d++) {
      if (!advanced.has(`${w}-${d}`)) {
        firstOpenFlat = w * 5 + d;
        break outer;
      }
      firstOpenFlat = w * 5 + d + 1;
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/teacher" className="text-sm font-semibold text-primary hover:underline">
        ← Dashboard
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {timetable.grade} {timetable.subject} — Term {timetable.term}
        </h1>
        <GeneratedBadge label="AI-generated timetable" />
      </div>

      <div className="mt-8 space-y-6">
        {timetable.weeks.map((week, wi) => (
          <section key={wi}>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">
              Week {wi + 1}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {week.days.map((day, di) => {
                const flat = wi * 5 + di;
                const isAdvanced = advanced.has(`${wi}-${di}`);
                const locked = flat > firstOpenFlat;
                return (
                  <Link
                    key={di}
                    href={locked ? "#" : `/teacher/session/${id}_${wi}_${di}`}
                    aria-disabled={locked}
                    className={`block rounded-xl border p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      locked
                        ? "cursor-not-allowed border-border bg-muted/40 opacity-55"
                        : isAdvanced
                          ? "border-accent/60 bg-accent/5 hover:-translate-y-0.5 hover:shadow-md"
                          : "border-border bg-card hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
                    }`}
                    onClick={(e) => locked && e.preventDefault()}
                  >
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      {DAY_NAMES[di]}
                      {isAdvanced && <span className="ml-2 text-accent">✓ taught</span>}
                      {locked && <span className="ml-2">🔒</span>}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5">{day.topic}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{day.objective}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Days unlock in order as your class is ready to move on — you make that call after each
        session&apos;s quiz. Locked days open automatically once the previous one is advanced.
      </p>
    </main>
  );
}
