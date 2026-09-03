"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProgressNarrator } from "@/components/ProgressNarrator";

const GRADES = ["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

export default function ResearchPage() {
  const router = useRouter();
  const submit = useMutation(api.research.submit);
  const generateTimetable = useAction(api.actions.generateTimetable.run);
  const [grade, setGrade] = useState("Grade 8");
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState(1);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const sourceId = await submit({
        kind: "pasted",
        title: title.trim() || `${subject} ${grade} Term ${term} source`,
        extractedText: text.trim(),
        grade,
        subject: subject.trim(),
        term,
      });
      const timetableId = await generateTimetable({ researchSourceId: sourceId });
      router.push(`/teacher/timetable/${timetableId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  if (busy) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <ProgressNarrator label="Building your term timetable" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link href="/teacher" className="text-sm font-semibold text-primary hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Research a term</h1>
      <p className="mt-2 text-muted-foreground">
        Paste your source material — curriculum design text, notes, a syllabus extract. The
        timetable is generated from it and nothing else.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold">
            Grade
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Subject
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Integrated Science"
              className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </label>
          <label className="block text-sm font-semibold">
            Term
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
              <option value={3}>Term 3</option>
            </select>
          </label>
        </div>

        <label className="block text-sm font-semibold">
          Source title <span className="font-normal text-muted-foreground">(optional)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. KICD Integrated Science Grade 8 design, Strand 3"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </label>

        <label className="block text-sm font-semibold">
          Paste your source material
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste curriculum text, learning outcomes, topic lists, or a source link…"
            className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </label>

        {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

        <button
          type="submit"
          className="min-h-12 w-full cursor-pointer rounded-xl bg-primary font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Generate my term timetable
        </button>
        <p className="text-xs text-muted-foreground">
          KICD page scraping and YouTube transcripts are coming — pasted text is the reliable path
          today. The generated timetable is AI-generated and labelled as such.
        </p>
      </form>
    </main>
  );
}
