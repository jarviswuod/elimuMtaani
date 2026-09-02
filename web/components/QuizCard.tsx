"use client";

import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GeneratedBadge } from "./GeneratedBadge";

export function QuizCard({
  lectureId,
  onScored,
}: {
  lectureId: Id<"lectures">;
  onScored?: (score: number) => void;
}) {
  const quiz = useQuery(api.quizzes.forLecture, { lectureId });
  const generate = useAction(api.actions.generateQuiz.run);
  const recordScore = useMutation(api.quizzes.recordScore);
  const [busy, setBusy] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);

  async function startQuiz() {
    setBusy(true);
    try {
      await generate({ lectureId });
    } finally {
      setBusy(false);
    }
  }

  async function grade() {
    if (!quiz) return;
    const correct = quiz.questions.filter((q, i) => answers[i] === q.answerIdx).length;
    const score = correct / quiz.questions.length;
    setGraded(true);
    await recordScore({ quizId: quiz._id, score });
    onScored?.(score);
  }

  if (quiz === undefined) return null;

  if (quiz === null) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Check your understanding</h2>
        <p className="mt-1 text-sm text-muted-foreground">A short quiz on this lecture.</p>
        <button
          type="button"
          onClick={startQuiz}
          disabled={busy}
          className="mt-4 min-h-11 cursor-pointer rounded-xl bg-primary px-5 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {busy ? "Preparing quiz…" : "Take the quiz"}
        </button>
      </section>
    );
  }

  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);
  const correctCount = quiz.questions.filter((q, i) => answers[i] === q.answerIdx).length;

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Quiz</h2>
        <GeneratedBadge />
      </div>
      <ol className="mt-4 space-y-6">
        {quiz.questions.map((q, qi) => (
          <li key={q.q}>
            <p className="font-semibold">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-2 grid gap-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const isCorrect = graded && oi === q.answerIdx;
                const isWrongPick = graded && chosen && oi !== q.answerIdx;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={graded}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`min-h-11 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      isCorrect
                        ? "border-accent bg-accent/10 font-semibold"
                        : isWrongPick
                          ? "border-destructive bg-destructive/10"
                          : chosen
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-secondary"
                    } ${graded ? "cursor-default" : ""}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {graded && (
              <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
            )}
          </li>
        ))}
      </ol>
      {graded ? (
        <p className="mt-6 rounded-xl bg-muted p-4 text-center font-bold">
          Score: {correctCount}/{quiz.questions.length} (
          {Math.round((correctCount / quiz.questions.length) * 100)}%)
        </p>
      ) : (
        <button
          type="button"
          onClick={grade}
          disabled={!allAnswered}
          className="mt-6 min-h-11 w-full cursor-pointer rounded-xl bg-primary font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {allAnswered ? "Grade my answers" : "Answer all questions to grade"}
        </button>
      )}
    </section>
  );
}
