"use client";

import { FormEvent, useCallback, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSpeechInput, useSpeaking } from "./voice";

function BrainIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5a3 3 0 0 0-3 3v.2A3.5 3.5 0 0 0 6.5 12 3.5 3.5 0 0 0 5 15a3 3 0 0 0 3 3h.5a3.5 3.5 0 0 0 6.9.5A3 3 0 0 0 19 15a3.5 3.5 0 0 0-1.5-2.8A3.5 3.5 0 0 0 15 8.2V8a3 3 0 0 0-3-3Z" />
      <path d="M9 8v10M15 8v10M6.5 12h11" />
    </svg>
  );
}

function MicIcon({ listening }: { listening: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={listening ? "currentColor" : "none"} />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  );
}

function VolumeIcon({ speaking }: { speaking: boolean }) {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={speaking ? "currentColor" : "none"} />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

/**
 * Mwalimu Brain — floating general Q&A chatbot (Claude Sonnet 5), available on
 * every teacher and student page. Not scoped to a lecture — ask about any topic.
 */
export function MwalimuBrain() {
  const [open, setOpen] = useState(false);
  const messages = useQuery(api.brain.forUser, open ? {} : "skip");
  const ask = useAction(api.actions.brain.ask);
  const synthesizeAction = useAction(api.tts.synthesize);
  const synthesize = useCallback((text: string) => synthesizeAction({ text }), [synthesizeAction]);
  const clear = useMutation(api.brain.clear);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const onTranscript = useCallback(
    (text: string) => setInput((prev) => prev + (prev ? " " : "") + text),
    [],
  );
  const { state: micState, start: startMic, stop: stopMic } = useSpeechInput(onTranscript);
  const { speaking, speakText } = useSpeaking(synthesize);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    try {
      await ask({ question: q });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Mwalimu Brain" : "Open Mwalimu Brain — ask anything"}
        aria-expanded={open}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <BrainIcon />
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-50 flex max-h-[70vh] w-[22rem] max-w-[calc(100vw-3rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-border p-4">
            <div>
              <p className="font-display text-base font-bold">Mwalimu Brain</p>
              <p className="text-xs text-muted-foreground">Ask about anything — any topic, any subject.</p>
            </div>
            <button
              type="button"
              onClick={() => void clear()}
              title="Clear conversation"
              className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ minHeight: "12rem" }}>
            {messages === undefined || messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Hi! I&apos;m Mwalimu Brain. Ask me to explain a concept, dig deeper into a subject, or help
                you think through a topic.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m._id} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}>
                  <div
                    className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                      m.role === "user" ? "bg-primary text-on-primary" : "bg-muted text-foreground"
                    }`}
                  >
                    {m.body}
                  </div>
                  {m.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => speakText(m.body)}
                      title={speaking ? "Stop speaking" : "Listen"}
                      className="mt-1 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <VolumeIcon speaking={speaking} />
                      Listen
                    </button>
                  )}
                </div>
              ))
            )}
            {busy && (
              <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2" aria-label="Thinking">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={micState === "listening" ? "Listening…" : "Ask Mwalimu Brain…"}
              className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            {micState !== "unsupported" && (
              <button
                type="button"
                onClick={micState === "listening" ? stopMic : startMic}
                title={micState === "listening" ? "Stop" : "Speak your question"}
                className={`min-h-11 cursor-pointer rounded-xl border px-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  micState === "listening"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <MicIcon listening={micState === "listening"} />
              </button>
            )}
            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="min-h-11 cursor-pointer rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
