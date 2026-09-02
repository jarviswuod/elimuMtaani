"use client";

import { FormEvent, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/** Lecture-scoped chat — only rendered on student open-topic lectures (US-08). */
export function ChatPanel({ lectureId }: { lectureId: Id<"lectures"> }) {
  const messages = useQuery(api.chat.forLecture, { lectureId });
  const ask = useAction(api.actions.chat.ask);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

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
            <div
              key={m._id}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6 ${
                m.role === "user"
                  ? "ml-auto bg-primary text-on-primary"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.body}
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
          placeholder="e.g. Why does vapour rise?"
          className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
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
