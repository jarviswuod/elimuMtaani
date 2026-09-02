/**
 * HTTP contract between frontend and backend.
 *
 * FROZEN CONTRACT. Frontend builds against this from minute one; backend fills it in.
 * If you need a new endpoint, add it here first and say so in the group chat.
 */

import type { Strand, SubStrand, SubStrandDetail, Subject } from './curriculum.js';
import type { Pack, PackRequest } from './pack.js';

export const API_ROUTES = {
  health: 'GET /api/health',
  subjects: 'GET /api/subjects',
  strands: 'GET /api/subjects/:subjectId/strands',
  subStrands: 'GET /api/strands/:strandId/sub-strands',
  subStrandDetail: 'GET /api/sub-strands/:id',
  createPack: 'POST /api/packs',
  getPack: 'GET /api/packs/:id',
  samplePack: 'GET /api/packs/sample',
  exportPack: 'GET /api/packs/:id/export?format=html|pdf',
} as const;

export interface HealthResponse {
  ok: boolean;
  db: 'up' | 'down';
  version: string;
}

export interface ApiError {
  error: string;
  detail?: string;
}

export type SubjectsResponse = Subject[];
export type StrandsResponse = Strand[];
export type SubStrandsResponse = SubStrand[];
export type SubStrandDetailResponse = SubStrandDetail;
export type CreatePackRequest = PackRequest;
export type CreatePackResponse = Pack;
export type GetPackResponse = Pack;
