/**
 * A complete, realistic Pack used to unblock frontend work on minute one.
 *
 * !!! PLACEHOLDER CONTENT — the citations below are INVENTED page numbers. !!!
 * Member 1 replaces this with real hand-entered curriculum data. Never ship a
 * demo where the visible citations come from this file.
 */

import type { Pack } from '../pack.js';

const SRC = {
  docId: 'kicd-csl-grade10',
  docTitle: 'Grade 10 Community Service Learning Curriculum Design (SAMPLE)',
  page: 24,
  section: 'Strand 2.0',
};

export const SAMPLE_PACK: Pack = {
  id: 'sample',
  subStrandId: 'ss-csl-2-1',
  subStrandTitle: '2.1 Identifying Community Needs',
  strandTitle: '2.0 Community Needs Assessment',
  subjectName: 'Community Service Learning',
  context: {
    classSize: 52,
    lessonMinutes: 40,
    language: 'en',
    resources: 'CHALK_ONLY',
  },
  generatedAt: '2026-09-02T20:47:00.000Z',
  modelId: 'sample-fixture',
  sections: {
    briefing: {
      provenance: 'generated',
      sources: [SRC],
      summary:
        'A community needs assessment is a structured way of finding out what a community actually lacks, ' +
        'rather than what an outsider assumes it lacks. It has three moves: gather evidence, sort the ' +
        'findings by urgency and feasibility, then agree on one need the group can realistically act on.',
      keyIdeas: [
        {
          term: 'Felt need vs observed need',
          explanation:
            'A felt need is what community members say they lack. An observed need is what an outsider ' +
            'measures. They often disagree, and the gap itself is useful data.',
        },
        {
          term: 'Prioritisation',
          explanation:
            'Not every need can be addressed. Learners rank needs on two axes: how urgent, and how ' +
            'feasible for a school group with no budget.',
        },
        {
          term: 'Asset-based thinking',
          explanation:
            'Every community already holds resources — people, skills, spaces. An assessment lists assets ' +
            'alongside needs so the plan builds on what exists.',
        },
      ],
      workedExamples: [
        {
          prompt: 'A market has no waste collection point. Is that a felt need or an observed need?',
          walkthrough:
            'Ask first. If traders complain about refuse, it is a felt need. If traders say nothing but you ' +
            'can see uncollected waste, it is observed. Record both, and note who said what — that record ' +
            'is what separates an assessment from an opinion.',
        },
      ],
      teacherMisconceptions: [
        'That a needs assessment is the same as a list of problems. It is not — it pairs needs with assets.',
        'That the teacher should choose the need for the class. The learner-led choice is the assessed competency.',
      ],
    },
    why: {
      provenance: 'design',
      sources: [SRC],
      outcomes: [
        'By the end of the sub-strand, the learner should be able to identify needs within the local community.',
        'By the end of the sub-strand, the learner should be able to prioritise identified community needs.',
      ],
      inquiryQuestions: ['How can we tell what our community really needs?'],
      coreCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Citizenship'],
      values: ['Responsibility', 'Respect', 'Unity'],
    },
    spine: {
      provenance: 'template',
      sources: [SRC],
      totalMinutes: 40,
      steps: [
        {
          startMinute: 0,
          durationMinutes: 5,
          phase: 'HOOK',
          teacherDoes: 'Ask: "If a stranger visited our village tomorrow, what is the first problem they would notice?"',
          learnersDo: 'Call out answers. Teacher writes 6 on the board without judging any of them.',
        },
        {
          startMinute: 5,
          durationMinutes: 8,
          phase: 'BOARD',
          teacherDoes: 'Draw the two-column table (Needs | Assets) and the urgency/feasibility grid.',
          learnersDo: 'Copy both into exercise books.',
        },
        {
          startMinute: 13,
          durationMinutes: 15,
          phase: 'ACTIVITY',
          teacherDoes: 'Split into 9 groups. Assign each a location. Circulate and prompt with "who told you that?"',
          learnersDo: 'Each group lists 3 needs and 3 assets for their location, then places needs on the grid.',
        },
        {
          startMinute: 28,
          durationMinutes: 8,
          phase: 'CHECK',
          teacherDoes: 'Take one need from three groups. Ask the class: felt or observed? Urgent or not?',
          learnersDo: 'Defend their placement using evidence, not opinion.',
        },
        {
          startMinute: 36,
          durationMinutes: 4,
          phase: 'CLOSURE',
          teacherDoes: 'Restate the inquiry question and set the homework prompt.',
          learnersDo: 'Write one sentence: the need their group would act on, and why.',
        },
      ],
    },
    board: {
      provenance: 'generated',
      sources: [SRC],
      panels: [
        {
          order: 1,
          drawInstruction: 'Split the board vertically. Head the left column "NEEDS", the right "ASSETS".',
          sayWhileDrawing:
            '"Every community has two lists, not one. Most people only ever write the left one."',
          asciiSketch: '  NEEDS        |      ASSETS\n---------------+---------------\n  1.           |   1.\n  2.           |   2.\n  3.           |   3.',
        },
        {
          order: 2,
          drawInstruction: 'Bottom-right corner: a 2x2 grid. Vertical axis URGENT, horizontal axis FEASIBLE.',
          sayWhileDrawing:
            '"Now we sort. Top-right is where we act — urgent and possible for us. Top-left we report to someone with more power."',
          asciiSketch:
            '  URGENT\n    ^\n    | report |  ACT\n    |--------+-------\n    | later  |  quick win\n    +----------------> FEASIBLE',
        },
      ],
    },
    activity: {
      provenance: 'generated',
      sources: [SRC],
      title: 'Nine corners of one community',
      groupSize: 6,
      groupCount: 9,
      materials: [
        { item: 'Exercise book page', quantity: '1 per group', sourceHint: 'Learners already have these', costKes: 0 },
        { item: 'Chalk', quantity: '2 sticks', sourceHint: 'School store', costKes: 0 },
      ],
      steps: [
        'Assign each group one location they all know: market, borehole, dispensary, bus stop, primary school, church/mosque, football pitch, main road, their own street.',
        'Each group lists 3 needs and 3 assets for that location from memory. 6 minutes.',
        'Each group marks their most urgent need with a star, and writes F if a school group could realistically act on it.',
        'Two groups swap pages and challenge one entry each: "who told you that?"',
        'Three groups read one starred need aloud for the whole-class check.',
      ],
      fallbackNoMaterials:
        'Run it entirely verbally in a circle. Each group reports orally and the teacher records on the board. No paper needed.',
      derivedFromExperienceId: 'exp-csl-2-1-a',
    },
    questions: {
      provenance: 'generated',
      sources: [SRC],
      items: [
        {
          question: 'What if the community disagrees about what it needs?',
          answer:
            'Disagreement is a finding, not a failure. Record both positions and who holds them. An assessment reports the disagreement rather than resolving it.',
        },
        {
          question: 'Can we choose a need we cannot fix?',
          answer:
            'You can identify it, but the grid exists so you also name who can act. Referring a need upward is a legitimate outcome.',
        },
        {
          question: 'Is money always the answer?',
          answer:
            'Ask what the community already has. Many needs are met by organising existing assets — people, time, space — before any money is involved.',
        },
      ],
      dontKnowScript:
        '"That is a good question and I do not want to guess at it. Write it on the board — it is now our inquiry question for next lesson, and whoever finds a sourced answer presents it."',
    },
    assessment: {
      provenance: 'template',
      sources: [SRC],
      quickChecks: [
        'Point at one entry on a group page and ask: felt or observed?',
        'Ask any learner to name one asset in their location. If they can only name needs, the asset idea has not landed.',
        'Exit sentence: one need plus one reason. Read five at random.',
      ],
      rubric: [
        {
          outcome: 'Identifies needs within the local community',
          descriptors: {
            EXCEEDING:
              'Identifies needs and distinguishes felt from observed, citing who reported each one.',
            MEETING: 'Identifies at least three relevant needs in the local community.',
            APPROACHING: 'Identifies one or two needs, some of them general rather than local.',
            BELOW: 'Lists problems unrelated to the local community, or none.',
          },
        },
        {
          outcome: 'Prioritises identified community needs',
          descriptors: {
            EXCEEDING: 'Ranks needs on both urgency and feasibility and justifies the ranking with evidence.',
            MEETING: 'Ranks needs by urgency and gives a reason.',
            APPROACHING: 'Attempts a ranking without a stated reason.',
            BELOW: 'Does not distinguish between needs.',
          },
        },
      ],
    },
    verify: {
      fromDesign: [
        'Learning outcomes, quoted verbatim',
        'Key inquiry question',
        'Core competencies and values',
        'Lesson allocation',
      ],
      generated: [
        'The content briefing and worked example',
        'Board panels and what to say',
        'The activity and its material list',
        'Anticipated learner questions',
        'Rubric descriptor wording',
      ],
      teacherShouldVerify: [
        'That the nine assigned locations exist near your school — swap any that do not.',
        'That the rubric wording matches the assessment guidance your school has adopted.',
        'The felt/observed distinction against your own subject notes before you teach it as fact.',
      ],
    },
  },
  warnings: ['This is placeholder fixture data. Citations are not real.'],
};
