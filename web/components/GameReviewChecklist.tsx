"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const CHECKS = [
  "Materials listed are on hand",
  "Rules are clear enough to read aloud",
  "Duration is realistic for this class",
];

/** Pre-class review gate (RISK-009/Q-006) for a freshly generated game. */
export function GameReviewChecklist({
  lectureId,
  onReviewed,
}: {
  lectureId: Id<"lectures">;
  onReviewed: () => void;
}) {
  const markReviewed = useMutation(api.games.markReviewed);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const allChecked = CHECKS.every((_, i) => checked[i]);

  return (
    <section className="rounded-2xl border border-secondary/40 bg-secondary/5 p-6">
      <p className="font-bold">Review before class</p>
      <p className="mt-1 text-sm text-muted-foreground">
        This game was AI-designed. Confirm the checklist before starting it with your class.
      </p>
      <ul className="mt-4 space-y-2">
        {CHECKS.map((label, i) => (
          <li key={label}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              {label}
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!allChecked}
        onClick={async () => {
          await markReviewed({ lectureId });
          onReviewed();
        }}
        className="mt-4 min-h-11 w-full cursor-pointer rounded-xl bg-primary px-5 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Confirmed — ready to start
      </button>
    </section>
  );
}
