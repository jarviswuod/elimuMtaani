"use client";

// ONE renderer for both surfaces (RISK-007): teacher live delivery and
// student read-only review consume the same Lecture record.
import { useCallback, useEffect, useRef, useState } from "react";
import { GeneratedBadge } from "./GeneratedBadge";

type Slide = {
  title: string;
  bullets: string[];
  visual?: string;
  narration: string;
};

export function SlidePlayer({
  slides,
  mode,
  topic,
}: {
  slides: Slide[];
  mode: "live" | "review";
  topic: string;
}) {
  const [idx, setIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const slide = slides[idx];

  const stopNarration = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  // TTS stand-in for Magpie (Q-001): browser SpeechSynthesis, zero cost.
  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(slide.narration);
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    utteranceRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [slide]);

  useEffect(() => stopNarration, [stopNarration]); // cancel on unmount

  function go(next: number) {
    stopNarration();
    setIdx(Math.max(0, Math.min(slides.length - 1, next)));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-primary/5">
      {/* Slide surface */}
      <div className="bg-foreground p-4 sm:p-6">
        <div className="min-h-72 rounded-lg bg-card p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {topic} · Slide {idx + 1} of {slides.length}
            </p>
            <GeneratedBadge />
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{slide.title}</h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-muted-foreground sm:text-lg">
            {slide.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
          {slide.visual && (
            <p className="mt-6 rounded-lg border border-dashed border-border bg-muted/50 p-3 text-sm italic text-muted-foreground">
              Visual: {slide.visual}
            </p>
          )}
        </div>

        {/* Player bar */}
        <div className="mt-4 flex items-center gap-3 px-1">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            className="cursor-pointer rounded-full border border-card/30 px-4 py-2 text-sm font-semibold text-card transition-colors duration-200 hover:bg-card/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={speaking ? stopNarration : speak}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            {speaking ? (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                Stop narration
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7Z" /></svg>
                Play narration
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            disabled={idx === slides.length - 1}
            className="cursor-pointer rounded-full border border-card/30 px-4 py-2 text-sm font-semibold text-card transition-colors duration-200 hover:bg-card/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Next →
          </button>
          {mode === "review" && (
            <span className="ml-auto hidden text-xs font-semibold uppercase tracking-wide text-card/60 sm:block">
              Read-only review
            </span>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 bg-card py-3" aria-hidden="true">
        {slides.map((s, i) => (
          <button
            key={s.title + i}
            type="button"
            onClick={() => go(i)}
            className={`h-2 w-2 cursor-pointer rounded-full transition-colors duration-200 ${i === idx ? "bg-primary" : "bg-border hover:bg-secondary"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
