"use client";

import { useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function StudentHome() {
  const user = useQuery(api.users.current);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-accent">Student</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            {user ? `Karibu, ${user.displayName}` : "Loading…"}
          </h1>
        </div>
        <UserButton />
      </header>
      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <p className="text-lg font-bold">What do you want to learn today?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Narrated lectures on any topic land here in Checkpoint 1's next step —
          the generation pipeline.
        </p>
      </div>
    </main>
  );
}
