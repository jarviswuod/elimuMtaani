/**
 * Curriculum tree reads. OWNER: Member 1 (Curriculum & Data).
 *
 * Every function must return objects that carry their SourceRef — the UI cites
 * a document and page, so a query that drops doc_id/doc_page is a bug.
 */
import type { Strand, SubStrand, SubStrandDetail, Subject } from '@elimu/shared';

export async function listSubjects(): Promise<Subject[]> {
  // TODO(M1): SELECT from subjects JOIN source_documents, map to Subject.
  // Use `query<T>` from ../../db/pool.js.
  throw new Error('not implemented');
}

export async function listStrands(_subjectId: string): Promise<Strand[]> {
  // TODO(M1)
  throw new Error('not implemented');
}

export async function listSubStrands(_strandId: string): Promise<SubStrand[]> {
  // TODO(M1)
  throw new Error('not implemented');
}

/** Used by the generation pipeline — must include outcomes and experiences. */
export async function getSubStrandDetail(_id: string): Promise<SubStrandDetail | null> {
  // TODO(M1)
  throw new Error('not implemented');
}
