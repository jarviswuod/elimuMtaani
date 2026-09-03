"use client";

import { useEffect, useRef, useState } from "react";

type Game = {
  name: string;
  rules: string[];
  materials: string[];
  durationMinutes: number;
};

/** Teacher-facing companion display during live game delivery: timer + a manual, unpersisted scoreboard. */
export function GameCompanionView({ game }: { game: Game }) {
  const [secondsLeft, setSecondsLeft] = useState(game.durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [teamA, setTeamA] = useState(0);
  const [teamB, setTeamB] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <p className="font-bold">{game.name} — companion display</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Project this screen. Scores here are for display only — nothing is saved.
      </p>

      <div className="mt-5 flex flex-col items-center gap-3 rounded-xl bg-muted p-6">
        <p className="font-display text-5xl font-extrabold tabular-nums">
          {mm}:{ss}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={secondsLeft === 0}
            className="min-h-10 cursor-pointer rounded-full bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {running ? "Pause" : secondsLeft === 0 ? "Time's up" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setSecondsLeft(game.durationMinutes * 60);
            }}
            className="min-h-10 cursor-pointer rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {[
          { label: "Team A", value: teamA, set: setTeamA },
          { label: "Team B", value: teamB, set: setTeamB },
        ].map((team) => (
          <div key={team.label} className="rounded-xl border border-border p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{team.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{team.value}</p>
            <div className="mt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => team.set((v) => Math.max(0, v - 1))}
                className="h-8 w-8 cursor-pointer rounded-full border border-border text-lg transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => team.set((v) => v + 1)}
                className="h-8 w-8 cursor-pointer rounded-full border border-border text-lg transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Rules — read aloud
        </p>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
          {game.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
