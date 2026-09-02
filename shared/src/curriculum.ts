/**
 * Curriculum tree types — mirrors the structure of a KICD Grade 10 curriculum design.
 *
 * FROZEN CONTRACT. Do not change without telling the whole team in the group chat.
 * Every node carries a SourceRef so the UI can cite a document + page.
 */

export interface SourceRef {
  /** stable slug of the design document, e.g. "kicd-csl-grade10" */
  docId: string;
  docTitle: string;
  /** page number in the published PDF */
  page: number;
  /** optional table/section label, e.g. "Strand 2.0 table" */
  section?: string;
}

export type Pathway = 'STEM' | 'SOCIAL_SCIENCES' | 'ARTS_SPORTS' | 'CORE';

export interface Subject {
  id: string;
  code: string;
  name: string;
  pathway: Pathway;
  grade: 10;
  source: SourceRef;
}

export interface Strand {
  id: string;
  subjectId: string;
  /** as printed in the design, e.g. "2.0" */
  code: string;
  title: string;
  order: number;
  source: SourceRef;
}

export interface LearningOutcome {
  id: string;
  /** verbatim from the design — never paraphrase this field */
  text: string;
  source: SourceRef;
}

export interface SuggestedExperience {
  id: string;
  /** verbatim from the design */
  text: string;
  /** resources the design quietly assumes, e.g. ["internet", "laboratory"] */
  assumedResources: string[];
  source: SourceRef;
}

export interface SubStrand {
  id: string;
  strandId: string;
  code: string;
  title: string;
  order: number;
  /** lesson allocation printed in the design */
  suggestedLessons: number;
  outcomes: LearningOutcome[];
  inquiryQuestions: string[];
  suggestedExperiences: SuggestedExperience[];
  coreCompetencies: string[];
  values: string[];
  /** pertinent and contemporary issues */
  pcis: string[];
  assessmentNotes?: string;
  source: SourceRef;
}

/** Convenience shape for the sub-strand detail endpoint. */
export interface SubStrandDetail extends SubStrand {
  strand: Strand;
  subject: Subject;
}
