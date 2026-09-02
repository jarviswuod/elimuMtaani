"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GeneratedBadge } from "./GeneratedBadge";

type Game = {
  source: "library" | "generated";
  name: string;
  setup: string;
  rules: string[];
  mechanics: { turns: string; challenge: string; winCondition: string };
  materials: string[];
  durationMinutes: number;
  groupPlan: string;
  teacherReviewed?: boolean;
};

/** The classroom game section of a lesson pack (Sprint 002). Teacher-facilitated, physical play — R1. */
export function GameCard({
  game,
  lectureId,
  canRate = false,
}: {
  game: Game;
  lectureId: Id<"lectures">;
  canRate?: boolean;
}) {
  const rateGame = useMutation(api.games.rateGame);
  const [rated, setRated] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Classroom game: {game.name}</h2>
        <GeneratedBadge
          label={game.source === "library" ? "From game library" : "AI-designed — review before class"}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {game.durationMinutes} min · {game.groupPlan} · Materials: {game.materials.join(", ")}
      </p>

      <div className="mt-4 space-y-4 text-sm leading-6">
        <div>
          <p className="font-bold uppercase tracking-wide text-accent text-xs">Setup</p>
          <p className="mt-1">{game.setup}</p>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wide text-accent text-xs">Rules — read aloud</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {game.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Turns</p>
            <p className="mt-0.5 text-xs">{game.mechanics.turns}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Challenge</p>
            <p className="mt-0.5 text-xs">{game.mechanics.challenge}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">How to win</p>
            <p className="mt-0.5 text-xs">{game.mechanics.winCondition}</p>
          </div>
        </div>
      </div>

      {canRate && !rated && !game.teacherReviewed && (
        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <p className="text-sm font-semibold">Did this game work with your class?</p>
          <button
            type="button"
            onClick={() => {
              void rateGame({ lectureId, worked: true });
              setRated(true);
            }}
            className="min-h-10 cursor-pointer rounded-full border border-accent/50 px-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Worked 👍
          </button>
          <button
            type="button"
            onClick={() => {
              void rateGame({ lectureId, worked: false });
              setRated(true);
            }}
            className="min-h-10 cursor-pointer rounded-full border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Didn&apos;t work 👎
          </button>
        </div>
      )}
      {(rated || game.teacherReviewed) && canRate && (
        <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
          Thanks — your rating improves future game matching.
        </p>
      )}
    </section>
  );
}
