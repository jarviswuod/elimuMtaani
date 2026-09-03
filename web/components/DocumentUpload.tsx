"use client";

import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const KIND_BY_EXT: Record<string, "pdf" | "docx" | "pptx" | "csv" | "xlsx"> = {
  pdf: "pdf",
  docx: "docx",
  pptx: "pptx",
  csv: "csv",
  xlsx: "xlsx",
};

export function DocumentUpload() {
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const create = useMutation(api.documents.create);
  const fileRef = useRef<HTMLInputElement>(null);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !grade.trim() || !subject.trim()) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const kind = KIND_BY_EXT[ext];
    if (!kind) {
      setError("Unsupported file type — use PDF, DOCX, PPTX, CSV, or XLSX.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      await create({ storageId, title: file.name, kind, grade: grade.trim(), subject: subject.trim(), term });
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-6"
      data-testid="document-upload-form"
    >
      <h2 className="text-lg font-bold">Add a document to the knowledge base</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        PDF, DOCX, PPTX, CSV or XLSX. It&apos;s parsed and made searchable for the chatbot and student
        practice quizzes.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Grade, e.g. Grade 5"
          className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject, e.g. Science"
          className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <input
          type="number"
          min={1}
          max={3}
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          placeholder="Term"
          className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx,.pptx,.csv,.xlsx"
        className="mt-3 block w-full text-sm"
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={busy || !grade.trim() || !subject.trim()}
        className="mt-4 min-h-11 cursor-pointer rounded-xl bg-primary px-5 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
