"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Papa from "papaparse";
import mammoth from "mammoth";
import JSZip from "jszip";
import { embed } from "../lib/nvidia";
import { chunkText } from "../../lib/chunk";

async function extractPdf(buffer: Buffer): Promise<string> {
  // pdf-parse ships as CJS with no ESM default export shape guarantee — require() it directly.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const result = await pdfParse(buffer);
  return result.text as string;
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractPptx(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const na = Number(a.match(/slide(\d+)\.xml$/)?.[1] ?? 0);
      const nb = Number(b.match(/slide(\d+)\.xml$/)?.[1] ?? 0);
      return na - nb;
    });
  const slideTexts: string[] = [];
  for (const name of slideFiles) {
    const xml = await zip.files[name].async("string");
    const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) =>
      m[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'"),
    );
    if (texts.length) slideTexts.push(texts.join(" "));
  }
  return slideTexts.join("\n\n");
}

async function extractCsv(buffer: Buffer): Promise<string> {
  const parsed = Papa.parse<string[]>(buffer.toString("utf-8"), { skipEmptyLines: true });
  return parsed.data.map((row) => row.join(", ")).join("\n");
}

async function extractXlsx(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheets = workbook.SheetNames.map((name: string) => {
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
    return `# ${name}\n${csv}`;
  });
  return sheets.join("\n\n");
}

/** Parse an uploaded document, chunk + embed the text, mark it ready (or failed). */
export const run = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    try {
      const record = await ctx.runQuery(internal.documents.getInternal, { documentId });
      if (!record) throw new Error("Document not found");

      const blob = await ctx.storage.get(record.storageId);
      if (!blob) throw new Error("Uploaded file is missing from storage");
      const buffer = Buffer.from(await blob.arrayBuffer());

      let text: string;
      switch (record.kind) {
        case "pdf":
          text = await extractPdf(buffer);
          break;
        case "docx":
          text = await extractDocx(buffer);
          break;
        case "pptx":
          text = await extractPptx(buffer);
          break;
        case "csv":
          text = await extractCsv(buffer);
          break;
        case "xlsx":
          text = await extractXlsx(buffer);
          break;
        default:
          throw new Error(`Unsupported document kind: ${record.kind}`);
      }

      const chunks = chunkText(text);
      if (chunks.length === 0) throw new Error("No extractable text found in this file");

      const BATCH = 32;
      for (let i = 0; i < chunks.length; i += BATCH) {
        const batch = chunks.slice(i, i + BATCH);
        const embeddings = await embed(batch, "passage");
        for (let j = 0; j < batch.length; j++) {
          await ctx.runMutation(internal.documents.insertChunk, {
            documentId,
            text: batch[j],
            chunkIdx: i + j,
            embedding: embeddings[j],
          });
        }
      }

      await ctx.runMutation(internal.documents.setStatus, { documentId, status: "ready" });
    } catch (err) {
      await ctx.runMutation(internal.documents.setStatus, {
        documentId,
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown parsing error",
      });
    }
  },
});
