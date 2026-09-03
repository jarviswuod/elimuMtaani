"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Web Speech API wrappers (CP-C, DEC-023).
// Both are client-only — guard with typeof window checks.

// ── Speech recognition (mic input) ──────────────────────────────────────────

export type RecognitionState = "idle" | "listening" | "processing" | "unsupported";

export function useSpeechInput(onTranscript: (text: string) => void) {
  const [state, setState] = useState<RecognitionState>("idle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = typeof window !== "undefined" ? (window as any) : undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: (new () => any) | undefined = w?.SpeechRecognition ?? w?.webkitSpeechRecognition;
    if (!SR) {
      setState("unsupported");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      if (transcript) onTranscript(transcript);
      setState("idle");
    };
    rec.onerror = () => setState("idle");
    rec.onend = () => setState((s: RecognitionState) => (s === "listening" ? "idle" : s));
    recRef.current = rec;
    return () => {
      rec.abort();
    };
  }, [onTranscript]);

  const start = useCallback(() => {
    if (state !== "idle" || !recRef.current) return;
    setState("listening");
    recRef.current.start();
  }, [state]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setState("idle");
  }, []);

  return { state, start, stop };
}

// ── Text to speech (spoken answers) ─────────────────────────────────────────

export function speak(text: string, { onEnd }: { onEnd?: () => void } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = 0.95;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

export function stopSpeaking() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

/**
 * `synthesize` (optional) tries NVIDIA TTS first (RISK-003 fallback chain);
 * on null/error, falls back to the browser's SpeechSynthesis.
 */
export function useSpeaking(synthesize?: (text: string) => Promise<{ url: string } | null>) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    stopSpeaking();
    setSpeaking(false);
  }, []);

  const speakText = useCallback(
    async (text: string) => {
      if (speaking) {
        stop();
        return;
      }
      setSpeaking(true);
      try {
        const result = await synthesize?.(text);
        if (result?.url) {
          const audio = new Audio(result.url);
          audioRef.current = audio;
          audio.onended = () => setSpeaking(false);
          audio.onerror = () => speak(text, { onEnd: () => setSpeaking(false) });
          await audio.play();
          return;
        }
      } catch {
        // fall through to browser TTS
      }
      speak(text, { onEnd: () => setSpeaking(false) });
    },
    [speaking, stop, synthesize],
  );

  return { speaking, speakText, stopSpeaking: stop };
}
