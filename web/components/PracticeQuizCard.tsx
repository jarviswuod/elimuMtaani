"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GeneratedBadge } from "./GeneratedBadge";

export function PracticeQuizCard({ practiceQuizId }: { practiceQuizId: Id<"practiceQuizzes"> }) {
  const quiz = useQuery(api.practiceQuizzes.get, { id: practiceQuizId });
  const history = useQuery(api.practiceQuizzes.history, { practiceQuizId });
  const recordScore = useMutation(api.practiceQuizzes.recordScore);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);

  if (quiz === undefined) return null;
  if (quiz === null) return <p className="text-sm text-muted-foreground">Quiz not found.</p>;

  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);
  const correctCount = quiz.questions.filter((q, i) => answers[i] === q.answerIdx).length;

  async function grade() {
    const score = correctCount / quiz!.questions.length;
    setGraded(true);
    await recordScore({ practiceQuizId, score });
  }

  function retake() {
    setAnswers({});
    setGraded(false);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{quiz.topic}</h2>
        <GeneratedBadge />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {quiz.grade} · {quiz.subject}
      </p>

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
            {graded && <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>}
          </li>
        ))}
      </ol>

      {graded ? (
        <div className="mt-6 space-y-3">
          <p className="rounded-xl bg-muted p-4 text-center font-bold">
            Score: {correctCount}/{quiz.questions.length} (
            {Math.round((correctCount / quiz.questions.length) * 100)}%)
          </p>
          <button
            type="button"
            onClick={retake}
            className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-card font-semibold transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Retake
          </button>
        </div>
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

      {history && history.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Past attempts</p>
          <ul className="mt-2 space-y-1">
            {history.map((h) => (
              <li key={h._id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{new Date(h.takenAt).toLocaleString()}</span>
                <span className="font-semibold">{Math.round(h.score * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
