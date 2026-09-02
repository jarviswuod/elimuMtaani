/**
 * Night-Before Pack — the single artifact this product delivers.
 *
 * FROZEN CONTRACT. Do not change without telling the whole team in the group chat.
 *
 * Design rule: every section declares its `provenance`. The teacher cannot verify
 * our output, so we must always tell her where each line came from.
 */

import type { SourceRef } from './curriculum.js';

/** design = verbatim from the curriculum document; template = deterministic; generated = model output */
export type Provenance = 'design' | 'template' | 'generated';

export interface Provenanced {
  provenance: Provenance;
  sources: SourceRef[];
}

export type ResourceLevel = 'CHALK_ONLY' | 'CHALK_PLUS_MARKET' | 'OUTDOOR';

export interface TeachingContext {
  classSize: number;
  lessonMinutes: number;
  language: 'en' | 'sw';
  resources: ResourceLevel;
}

export interface PackRequest {
  subStrandId: string;
  context: TeachingContext;
}

// ---------------------------------------------------------------- sections

/** "What this actually is" — teaches the teacher the content she was never trained on. */
export interface BriefingSection extends Provenanced {
  summary: string;
  keyIdeas: { term: string; explanation: string }[];
  workedExamples: { prompt: string; walkthrough: string }[];
  /** misconceptions the TEACHER is likely to hold, not the learners */
  teacherMisconceptions: string[];
}

/** "Why it's here" — outcomes and inquiry questions, verbatim and cited. */
export interface WhySection extends Provenanced {
  outcomes: string[];
  inquiryQuestions: string[];
  coreCompetencies: string[];
  values: string[];
}

export type LessonPhase = 'HOOK' | 'BOARD' | 'ACTIVITY' | 'CHECK' | 'CLOSURE';

export interface SpineStep {
  /** minute offset from lesson start */
  startMinute: number;
  durationMinutes: number;
  phase: LessonPhase;
  teacherDoes: string;
  learnersDo: string;
}

/** "Tomorrow's 40 minutes" — minute-by-minute. Mostly arithmetic, not generation. */
export interface SpineSection extends Provenanced {
  totalMinutes: number;
  steps: SpineStep[];
}

export interface BoardPanel {
  order: number;
  /** what to draw/write, in chalk, in under 90 seconds */
  drawInstruction: string;
  /** what to say out loud while drawing it */
  sayWhileDrawing: string;
  /** optional rough ASCII sketch to copy onto the board */
  asciiSketch?: string;
}

/** "Board plan" — the chalkboard is the render target. No projector exists. */
export interface BoardSection extends Provenanced {
  panels: BoardPanel[];
}

export interface Material {
  item: string;
  quantity: string;
  /** where a teacher can actually get it */
  sourceHint: string;
  costKes?: number;
}

/** "The activity, with nothing" — a translation of a real design experience. */
export interface ActivitySection extends Provenanced {
  title: string;
  groupSize: number;
  groupCount: number;
  materials: Material[];
  steps: string[];
  /** if even the materials fail, do this */
  fallbackNoMaterials: string;
  /** which SuggestedExperience this was derived from */
  derivedFromExperienceId: string | null;
}

/** "They will ask you this" — pre-empts the off-script question. */
export interface QuestionsSection extends Provenanced {
  items: { question: string; answer: string }[];
  /** dignified script for admitting you don't know */
  dontKnowScript: string;
}

export type RubricLevel = 'EXCEEDING' | 'MEETING' | 'APPROACHING' | 'BELOW';

export interface RubricRow {
  outcome: string;
  descriptors: Record<RubricLevel, string>;
}

/** "How you'll know they got it" — quick checks plus the four-level rubric. */
export interface AssessmentSection extends Provenanced {
  quickChecks: string[];
  rubric: RubricRow[];
}

/** "What to verify" — honesty rendered as a section. */
export interface VerifySection {
  fromDesign: string[];
  generated: string[];
  teacherShouldVerify: string[];
}

// ---------------------------------------------------------------- pack

export interface Pack {
  id: string;
  subStrandId: string;
  subStrandTitle: string;
  strandTitle: string;
  subjectName: string;
  context: TeachingContext;
  generatedAt: string;
  modelId: string;
  sections: {
    briefing: BriefingSection;
    why: WhySection;
    spine: SpineSection;
    board: BoardSection;
    activity: ActivitySection;
    questions: QuestionsSection;
    assessment: AssessmentSection;
    verify: VerifySection;
  };
  /** non-fatal problems, e.g. "board plan generator failed, section omitted" */
  warnings: string[];
}

/** A pack stored on the device for offline use. */
export interface StoredPack {
  pack: Pack;
  savedAt: string;
  /** true once the teacher has opened it with no network */
  verifiedOffline: boolean;
}
