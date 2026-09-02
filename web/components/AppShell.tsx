"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

type NavItem = { href: string; label: string; icon: ReactNode };

const icon = (d: string) => (
  <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const TEACHER_NAV: NavItem[] = [
  { href: "/teacher", label: "Dashboard", icon: icon("M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10") },
  { href: "/teacher/research", label: "New term", icon: icon("M12 5v14M5 12h14") },
  { href: "/teacher/knowledge", label: "Knowledge base", icon: icon("M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z") },
  { href: "/teacher/notes", label: "Notes", icon: icon("M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z") },
  { href: "/teacher/leaderboard", label: "Leaderboard", icon: icon("M18 20V10M12 20V4M6 20v-6") },
];

const STUDENT_NAV: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: icon("M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10") },
  { href: "/student/review", label: "Class review", icon: icon("M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5") },
  { href: "/student/notes", label: "Notes", icon: icon("M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z") },
];

/** Authenticated shell: sidebar + header for /teacher/* and /student/* (US-30). */
export function AppShell({ role, children }: { role: "teacher" | "student"; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = role === "teacher" ? TEACHER_NAV : STUDENT_NAV;

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="App">
      <Link
        href="/"
        className="mb-4 flex items-center gap-2 rounded-md px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-lg font-bold text-on-primary">
          e
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          elimu<span className="text-accent">Mtaani</span>
        </span>
      </Link>
      {nav.map((item) => {
        const active =
          item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              active
                ? "bg-primary text-on-primary"
                : "text-foreground hover:bg-muted"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto rounded-xl bg-muted p-3 text-xs leading-5 text-muted-foreground">
        {role === "teacher"
          ? "All AI content is labelled. No learner ever logs in or is recorded."
          : "Lectures and answers are AI-generated and labelled — your teacher is the source."}
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-card shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* App header */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-lg p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-bold uppercase tracking-wider text-accent">
            {role === "teacher" ? "Teacher" : "Student"}
          </p>
          <div className="ml-auto">
            <UserButton />
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
