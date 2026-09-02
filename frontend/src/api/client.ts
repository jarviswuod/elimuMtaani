/**
 * Typed API client. OWNER: Member 4 (Prep Flow).
 *
 * Types come from @elimu/shared, so this compiles against the contract before
 * the backend implements a single endpoint.
 */
import type {
  CreatePackRequest,
  HealthResponse,
  Pack,
  Strand,
  SubStrand,
  SubStrandDetail,
  Subject,
} from '@elimu/shared';

const BASE = import.meta.env.VITE_API_URL ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return (await res.json()) as T;
}

export const api = {
  health: () => get<HealthResponse>('/api/health'),
  subjects: () => get<Subject[]>('/api/subjects'),
  strands: (subjectId: string) => get<Strand[]>(`/api/subjects/${subjectId}/strands`),
  subStrands: (strandId: string) => get<SubStrand[]>(`/api/strands/${strandId}/sub-strands`),
  subStrand: (id: string) => get<SubStrandDetail>(`/api/sub-strands/${id}`),

  /** Build the whole pack view against this until POST /api/packs is live. */
  samplePack: () => get<Pack>('/api/packs/sample'),

  async createPack(body: CreatePackRequest): Promise<Pack> {
    const res = await fetch(`${BASE}/api/packs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${res.status} POST /api/packs`);
    return (await res.json()) as Pack;
  },
};
