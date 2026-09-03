// NVIDIA gateway for embeddings + TTS (Part 1/3 of the KB + voice work).
// Mirrors the shape of ../lib/claude.ts: one small gateway, fixtures-safe.
// No "use node" here — everything below is plain `fetch`, so this module can
// be imported from either a V8 action or a "use node" action.

const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";
const EMBED_MODEL = "nvidia/nv-embedqa-e5-v5"; // 1024-dim — matches schema.ts documentChunks.by_embedding

function apiKey(): string {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY is not set on this Convex deployment");
  return key;
}

/** Reuse the same fixtures flag as Anthropic (DEC-010) — one switch, both providers. */
export { useFixtures } from "./claude";

/** Batch-embed text for the KB vector index. `inputType` follows the asymmetric-retrieval contract. */
export async function embed(
  texts: string[],
  inputType: "query" | "passage",
): Promise<number[][]> {
  if (texts.length === 0) return [];
  const res = await fetch(`${NVIDIA_BASE}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: EMBED_MODEL,
      input_type: inputType,
      encoding_format: "float",
    }),
  });
  if (!res.ok) {
    throw new Error(`NVIDIA embeddings request failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { data: Array<{ embedding: number[]; index: number }> };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

// ── TTS (Magpie TTS Zeroshot) ────────────────────────────────────────────────
// planning/RISKS.md RISK-003 / QUESTIONS.md Q-001: the exact hosted contract
// (auth header shape, request fields, response encoding, sync-vs-async) was
// still unverified when this was written. This follows NVIDIA's documented
// NVCF invoke/poll pattern for build.nvidia.com function models — CONFIRM
// against the model's "Try API" panel with a real key before relying on it,
// and adjust `parseAudioResponse` if the response shape differs.
const NVCF_INVOKE_URL = "https://ai.api.nvidia.com/v1/audio/nvidia/magpie-tts-zeroshot";
const NVCF_STATUS_URL = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/status";

function parseAudioResponse(json: unknown): ArrayBuffer {
  const body = json as { audio?: string };
  if (!body.audio) throw new Error("NVIDIA TTS response had no `audio` field — verify the contract");
  const buf = Buffer.from(body.audio, "base64");
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/** Synthesize speech for one string. Throws on any failure — callers must catch and fall back. */
export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const res = await fetch(NVCF_INVOKE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ text, language: "en-US", voice: "default" }),
  });

  if (res.status === 202) {
    const reqId = res.headers.get("NVCF-REQID");
    if (!reqId) throw new Error("NVIDIA TTS returned 202 with no NVCF-REQID to poll");
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise((r) => setTimeout(r, 500));
      const poll = await fetch(`${NVCF_STATUS_URL}/${reqId}`, {
        headers: { Authorization: `Bearer ${apiKey()}` },
      });
      if (poll.status === 202) continue;
      if (!poll.ok) throw new Error(`NVIDIA TTS poll failed (${poll.status}): ${await poll.text()}`);
      return parseAudioResponse(await poll.json());
    }
    throw new Error("NVIDIA TTS polling timed out");
  }

  if (!res.ok) throw new Error(`NVIDIA TTS request failed (${res.status}): ${await res.text()}`);
  return parseAudioResponse(await res.json());
}
