"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const STATUS_STYLE: Record<string, string> = {
  processing: "border-secondary/30 bg-secondary/5 text-secondary",
  ready: "border-accent/30 bg-accent/5 text-accent",
  failed: "border-destructive/30 bg-destructive/5 text-destructive",
};

export function DocumentList() {
  const documents = useQuery(api.documents.listMine);

  if (documents === undefined) return null;
  if (documents.length === 0) {
    return <p className="mt-6 text-sm text-muted-foreground">No documents uploaded yet.</p>;
  }

  return (
    <div className="mt-6 grid gap-3">
      {documents.map((doc) => (
        <div
          key={doc._id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
        >
          <div className="min-w-0">
            <p className="font-semibold">{doc.title}</p>
            <p className="text-xs text-muted-foreground">
              {doc.kind.toUpperCase()} · {doc.grade} · {doc.subject} · Term {doc.term}
            </p>
            {doc.status === "failed" && doc.error && (
              <p className="mt-1 text-xs text-destructive">{doc.error}</p>
            )}
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLE[doc.status]}`}
          >
            {doc.status}
          </span>
        </div>
      ))}
    </div>
  );
}
