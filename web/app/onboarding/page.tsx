"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SiteHeader } from "@/components/SiteHeader";

export default function OnboardingPage() {
  const router = useRouter();
  const user = useQuery(api.users.current);
  const ensureUser = useMutation(api.users.ensureUser);
  const setRole = useMutation(api.users.setRole);

  // Create the user row on first visit.
  useEffect(() => {
    if (user === null) void ensureUser();
  }, [user, ensureUser]);

  // Already picked a role? Go straight home.
  useEffect(() => {
    if (user?.role) router.replace(user.role === "teacher" ? "/teacher" : "/student");
  }, [user, router]);

  async function pick(role: "student" | "teacher") {
    await ensureUser();
    await setRole({ role });
    router.replace(role === "teacher" ? "/teacher" : "/student");
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Karibu! How will you use elimu<span className="text-primary">Mtaani</span>?
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick once — this decides your home screen.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => pick("teacher")}
            className="cursor-pointer rounded-2xl border border-border bg-card p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <p className="text-lg font-bold">I&apos;m a teacher</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Research, plan a term timetable, and deliver narrated sessions.
            </p>
          </button>
          <button
            type="button"
            onClick={() => pick("student")}
            className="cursor-pointer rounded-2xl border border-border bg-card p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <p className="text-lg font-bold">I&apos;m a student</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn any topic with narrated lectures, chat, and quizzes.
            </p>
          </button>
        </div>
      </div>
      </main>
    </div>
  );
}
