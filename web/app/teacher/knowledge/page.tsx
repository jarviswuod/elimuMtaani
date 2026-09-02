"use client";

import { useState } from "react";
import Link from "next/link";
import { KICD_LINKS, searchKicdLinks } from "@/lib/kicd";

const CATEGORY_LABELS: Record<string, string> = {
  curriculum: "Curriculum",
  framework: "Framework",
  assessment: "Assessment",
  resources: "Resources",
};

const CATEGORY_COLORS: Record<string, string> = {
  curriculum: "border-primary/30 bg-primary/5 text-primary",
  framework: "border-secondary/30 bg-secondary/5 text-secondary",
  assessment: "border-accent/30 bg-accent/5 text-accent",
  resources: "border-border bg-muted text-muted-foreground",
};

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const results = searchKicdLinks(search);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">KICD / CBC</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Knowledge base</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated links to official CBC curriculum materials from{" "}
            <a
              href="http://kicd.ac.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-primary"
            >
              kicd.ac.ke
            </a>
            . Use these as research sources for your term plans.
          </p>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by subject, grade, or topic…"
        className="mt-6 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />

      {results.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No links match &ldquo;{search}&rdquo;.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {results.map((link) => (
            <div
              key={link.id}
              className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold">{link.title}</h2>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CATEGORY_COLORS[link.category]}`}
                    >
                      {CATEGORY_LABELS[link.category]}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{link.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {link.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Open →
                </a>
                <Link
                  href={`/teacher/research?url=${encodeURIComponent(link.url)}&title=${encodeURIComponent(link.title)}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Use as research source
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 rounded-xl bg-muted p-4 text-xs leading-6 text-muted-foreground">
        <span className="font-bold">Links tested automatically.</span>{" "}
        These links are checked against the live KICD site in the test suite (
        <code className="rounded bg-background px-1 py-0.5">tests/e2e/kicd-links.spec.ts</code>
        ). If a link is broken, open an issue or update{" "}
        <code className="rounded bg-background px-1 py-0.5">lib/kicd.ts</code>.
      </p>
    </main>
  );
}
