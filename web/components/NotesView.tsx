"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function downloadMd(title: string, body: string) {
  const content = `# ${title}\n\n${body}`;
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function NoteCard({ note }: { note: NonNullable<ReturnType<typeof useQuery<typeof api.notes.listMine>>>[number] }) {
  const update = useMutation(api.notes.update);
  const remove = useMutation(api.notes.remove);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await update({ id: note._id, title, body });
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="group rounded-2xl border border-border bg-card p-5">
      {editing ? (
        <div className="flex flex-col gap-3">
          <input
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="min-h-32 rounded-xl border border-border bg-background px-3 py-2 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-on-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setTitle(note.title); setBody(note.body); setEditing(false); }}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-bold hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold leading-5">{note.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                {note.sourceType}{note.topic ? ` · ${note.topic}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg border border-border p-1.5 text-xs hover:bg-muted"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => downloadMd(note.title, note.body)}
                className="rounded-lg border border-border p-1.5 text-xs hover:bg-muted"
                title="Export as Markdown"
              >
                ⬇️
              </button>
              <button
                onClick={() => remove({ id: note._id })}
                className="rounded-lg border border-border p-1.5 text-xs text-destructive hover:bg-destructive/10"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{note.body}</p>
        </>
      )}
    </div>
  );
}

export function NotesView() {
  const notes = useQuery(api.notes.listMine);
  const [search, setSearch] = useState("");

  const filtered =
    notes?.filter(
      (n) =>
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase()) ||
        (n.topic ?? "").toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved from lectures, chats, and your own writing.
          </p>
        </div>
        {notes && notes.length > 0 && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="min-h-10 w-full rounded-xl border border-border bg-background px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-64"
          />
        )}
      </div>

      {notes === undefined ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-bold">No notes yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save answers from chat or lecture summaries — they appear here, searchable and exportable.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No notes match &ldquo;{search}&rdquo;.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
