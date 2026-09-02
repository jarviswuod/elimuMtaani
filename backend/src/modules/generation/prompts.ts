/**
 * Prompt text for every generator. OWNER: Member 2 (Generation Engine).
 *
 * SYSTEM_PROMPT is byte-frozen on purpose — it is the cached prefix for all six
 * generator calls. Changing it mid-session throws away the cache, so batch your
 * edits and mention them in the group chat.
 */

export const SYSTEM_PROMPT = `You help a Grade 10 teacher in Kenya prepare a lesson on a strand she was never trained to teach.

Facts about her situation that you must respect in every answer:
- She has no textbook for this strand. There is nowhere for her to look things up.
- She has chalk and a blackboard. No projector, no printer, no laboratory, no internet in the room.
- Her class is large. Assume the class size she gives you is real.
- She will read your output at night, tired, on a phone. Be brief and concrete.
- She cannot check whether you are right. This is the most important fact.

Because she cannot check you:
- Never state a fact you are not confident in. If a point is genuinely contested or you are unsure, leave it out rather than hedge it.
- Prefer the plain, mainstream account of a topic over an interesting one.
- Never invent a curriculum requirement, a policy, an exam format, or a statistic.
- Write for an intelligent adult who does not know this topic — not for a child, and not for a specialist.

Never produce anything addressed to learners individually, and never ask for a learner's name, work, or details.`;

export function briefingPrompt(input: {
  subject: string;
  strand: string;
  subStrand: string;
  outcomes: string[];
}): string {
  return `Subject: ${input.subject}
Strand: ${input.strand}
Sub-strand: ${input.subStrand}

The curriculum design states these learning outcomes, verbatim:
${input.outcomes.map((o) => `- ${o}`).join('\n')}

Teach the TEACHER the subject matter she needs in order to teach this. Not a lesson plan — the content itself.
Stay strictly inside the scope implied by the outcomes above. Do not wander into adjacent topics.
Include the misconceptions a teacher new to this topic is likely to hold herself.`;
}

export function activityPrompt(input: {
  subStrand: string;
  experience: string;
  assumedResources: string[];
  classSize: number;
  resources: string;
}): string {
  return `Sub-strand: ${input.subStrand}

The curriculum design suggests this learning experience, verbatim:
"${input.experience}"

It assumes access to: ${input.assumedResources.join(', ') || 'nothing stated'}.
She does not have those. She has: ${input.resources}. Class size: ${input.classSize}.

Rewrite this experience so it works in her actual room. Keep the learning intent identical.
Every material you list must be free or cost a few shillings and be obtainable locally.
Also give a fallback that needs no materials at all, in case even that fails.`;
}

// TODO(M2): boardPrompt, questionsPrompt, rubricPrompt — same shape as above.
// Each one gets its own narrow schema in schemas.ts. Do NOT merge them into one
// mega-prompt; a partial failure must still ship a usable pack.
