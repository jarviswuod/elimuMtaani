"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SlidePlayer } from "@/components/SlidePlayer";
import { QuizCard } from "@/components/QuizCard";
import { ChatPanel } from "@/components/ChatPanel";

export default function LecturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lecture = useQuery(api.lectures.get, { id: id as Id<"lectures"> });

  if (lecture === undefined) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">Loading…</main>;
  }
  if (lecture === null) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <p>Lecture not found.</p>
        <Link href="/student" className="text-primary hover:underline">← Back</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/student" className="text-sm font-semibold text-primary hover:underline">
          ← My lectures
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">{lecture.topic}</h1>

      <SlidePlayer slides={lecture.slides} mode="live" topic={lecture.topic} />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
        <QuizCard lectureId={lecture._id} />
        {lecture.source === "open" && <ChatPanel lectureId={lecture._id} />}
      </div>
    </main>
  );
}
