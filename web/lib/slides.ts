import { z } from "zod";

// FROZEN CONTRACT (Sprint 001 blueprint, RISK-007): both renderers — teacher
// live delivery and student read-only review — consume exactly this shape.

export const SlideSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).describe("3-5 short bullets a learner can read at a glance"),
  visual: z
    .string()
    .optional()
    .describe("Optional description of a simple visual the teacher can draw or show"),
  narration: z
    .string()
    .describe("What the narrator says over this slide — conversational, engaging, Kenya-context examples"),
});

export const LectureOutputSchema = z.object({
  outline: z.array(z.string()).describe("The lecture outline, 4-8 points"),
  script: z.string().describe("The full narration script joined together"),
  slides: z.array(SlideSchema).describe("5-9 slides covering the topic completely"),
});

export const QuizOutputSchema = z.object({
  questions: z
    .array(
      z.object({
        q: z.string(),
        options: z.array(z.string()).describe("Exactly 4 answer options"),
        answerIdx: z.number().describe("Index (0-3) of the correct option"),
        explanation: z.string().describe("One-sentence explanation of the correct answer"),
      }),
    )
    .describe("4-6 multiple-choice questions covering the lecture"),
});

export const TimetableOutputSchema = z.object({
  weeks: z
    .array(
      z.object({
        days: z
          .array(
            z.object({
              topic: z.string(),
              objective: z.string().describe("One-sentence learning objective for the day"),
            }),
          )
          .describe("Exactly 5 teaching days, Monday to Friday"),
      }),
    )
    .describe("Up to 13 term weeks in teaching order"),
});

export type Slide = z.infer<typeof SlideSchema>;
export type LectureOutput = z.infer<typeof LectureOutputSchema>;
export type QuizOutput = z.infer<typeof QuizOutputSchema>;
export type TimetableOutput = z.infer<typeof TimetableOutputSchema>;
