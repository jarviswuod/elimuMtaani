"use client";

// Honest progress (NFR-02): name what's happening, never a bare spinner.
import { useEffect, useState } from "react";

const STAGES = [
  "Reading your topic…",
  "Structuring the outline…",
  "Writing the narration script…",
  "Designing the slides…",
  "Adding Kenya-context examples…",
  "Almost there — polishing…",
];

export function ProgressNarrator({ label = "Generating your lecture" }: { label?: string }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center" role="status" aria-live="polite">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
      <p className="text-lg font-bold">{label}</p>
      <p className="text-sm text-muted-foreground">{STAGES[stage]}</p>
    </div>
  );
}
