/**
 * The lesson spine is ARITHMETIC, not generation. OWNER: Member 2.
 *
 * Splitting the lesson into phases is a fixed proportion of the period length.
 * Doing this deterministically means it is free, instant, and always adds up to
 * the right number of minutes — which a model will occasionally get wrong.
 */
import type { LessonPhase, SpineSection, TeachingContext } from '@elimu/shared';

const PHASE_SHARE: { phase: LessonPhase; share: number }[] = [
  { phase: 'HOOK', share: 0.12 },
  { phase: 'BOARD', share: 0.2 },
  { phase: 'ACTIVITY', share: 0.38 },
  { phase: 'CHECK', share: 0.2 },
  { phase: 'CLOSURE', share: 0.1 },
];

export function buildSpine(context: TeachingContext): SpineSection {
  const total = context.lessonMinutes;
  let cursor = 0;

  const steps = PHASE_SHARE.map(({ phase, share }, i) => {
    const isLast = i === PHASE_SHARE.length - 1;
    const duration = isLast ? total - cursor : Math.max(1, Math.round(total * share));
    const step = {
      startMinute: cursor,
      durationMinutes: duration,
      phase,
      // TODO(M2): fill these from the sub-strand once the generators land.
      teacherDoes: '',
      learnersDo: '',
    };
    cursor += duration;
    return step;
  });

  return { provenance: 'template', sources: [], totalMinutes: total, steps };
}
