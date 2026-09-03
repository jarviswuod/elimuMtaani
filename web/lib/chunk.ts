/** Paragraph-boundary-aware text chunking for the knowledge-base RAG pipeline. */
export function chunkText(
  text: string,
  { size = 1800, overlap = 200 }: { size?: number; overlap?: number } = {},
): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const paragraphs = clean.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length <= size) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current);
    if (para.length <= size) {
      current = para;
    } else {
      // A single paragraph longer than `size` — hard-split it.
      for (let i = 0; i < para.length; i += size - overlap) {
        chunks.push(para.slice(i, i + size));
      }
      current = "";
    }
  }
  if (current) chunks.push(current);

  if (chunks.length <= 1) return chunks;

  // Add overlap by prepending the tail of the previous chunk.
  return chunks.map((chunk, i) => {
    if (i === 0) return chunk;
    const prevTail = chunks[i - 1].slice(-overlap);
    return `${prevTail}\n\n${chunk}`;
  });
}
