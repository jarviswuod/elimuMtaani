"use client";

import { FormEvent, useCallback, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSpeechInput, useSpeaking } from "./voice";

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

function BookmarkIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Lecture-scoped chat — only rendered on student open-topic lectures (US-08). */
export function ChatPanel({ lectureId }: { lectureId: Id<"lectures"> }) {
  const messages = useQuery(api.chat.forLecture, { lectureId });
  const ask = useAction(api.actions.chat.ask);
  const saveNote = useMutation(api.notes.save);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedMsgId, setSavedMsgId] = useState<string | null>(null);

  const onTranscript = useCallback(
    (text: string) => setInput((prev) => prev + (prev ? " " : "") + text),
    [],
  );
  const { state: micState, start: startMic, stop: stopMic } = useSpeechInput(onTranscript);
  const synthesizeAction = useAction(api.tts.synthesize);
  const synthesize = useCallback((text: string) => synthesizeAction({ text }), [synthesizeAction]);
  const { speaking, speakText } = useSpeaking(synthesize);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    try {
      await ask({ lectureId, question: q });
    } finally {
      setBusy(false);
    }
  }

  async function saveToNotes(body: string, msgId: string) {
    await saveNote({
      title: body.slice(0, 60) + (body.length > 60 ? "…" : ""),
      body,
      sourceType: "chat",
      lectureId,
    });
    setSavedMsgId(msgId);
    setTimeout(() => setSavedMsgId(null), 2000);
  }

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold">Ask about this lecture</h2>
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: "24rem" }}>
        {messages === undefined || messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Confused about something? Ask as many follow-up questions as you need.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}>
              <div
                className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                  m.role === "user"
                    ? "bg-primary text-on-primary"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.body}
              </div>
              {m.role === "assistant" && (
                <div className="mt-1 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => speakText(m.body)}
                    title={speaking ? "Stop speaking" : "Listen"}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <VolumeIcon speaking={speaking} />
                    Listen
                  </button>
                  <button
                    type="button"
                    onClick={() => saveToNotes(m.body, m._id as string)}
                    title="Save to notes"
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <BookmarkIcon />
                    {savedMsgId === (m._id as string) ? "Saved!" : "Save to notes"}
                  </button>
                </div>
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
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={micState === "listening" ? "Listening…" : "e.g. Why does vapour rise?"}
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
    </section>
  );
}
