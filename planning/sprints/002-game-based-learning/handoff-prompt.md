# handoff-prompt.md — Builder instructions, Sprint 002

You are the Builder for elimuMtaani Sprint 002. Prerequisite: Sprint 001 Checkpoints 1–3 shipped (lecture pipeline + teacher path + sessions). Read this sprint's `requirements.md` and `blueprint.md`, plus `planning/DECISIONS.md` (DEC-015..017) and `planning/RISKS.md` (RISK-009).

Hold two rules above everything: **R1** (classroom-only, no learner surface, no individual data — reject at schema level) and **R2** (real game mechanics — turns, challenge, win condition — enforced by zod, not vibes).

## Checkpoint A — Library + matching (demoable: "the system picked Concept Bingo for this topic")

1. `schema.ts`: add `gameLibrary` table + `lectures.game` optional field (shapes in blueprint.md, verbatim).
2. `convex/fixtures/gameLibrary.json`: 8 general entries (list in blueprint). Write each as rules a teacher reads aloud. Seed via internalMutation.
3. `convex/actions/matchGame.ts`: deterministic tag/keyword scoring first; haiku tiebreak only on equal scores. Unit-test the deterministic path with 3 topics.
4. `convex/actions/adaptGame.ts`: haiku, swaps lesson terms/questions into the matched entry. Provenance `library`.

## Checkpoint B — Generation fallback (demoable: novel topic → novel game, allowlist-clean)

1. `convex/actions/generateGame.ts`: opus, strict zod (game shape), prompt embeds R1/R2 + the worksheet-vs-game contrast table from the design doc.
2. `MATERIALS_ALLOWLIST` post-validation → one named-violation retry → library-closest fallback. Never ship a game with off-list materials.
3. Wire into `generateLecture.ts` after quiz generation; fixtures path returns the fixture game.
4. `components/GameCard.tsx` with provenance badge; render in lecture view + student review (read-only).

## Checkpoint C — Understanding gate (demoable: the quiz→review→re-quiz→advance loop)

1. `schema.ts`: `sessions.attempts[]` + `status` (blueprint shape). Migrate the Checkpoint-3 single-score writes to append an attempt.
2. `convex/gates.ts`: `recordAttempt`, `advanceTopic` (guard: latest attempt `classReady`). Timetable day N+1 locked until day N `advanced` or teacher-skipped.
3. Session page gate UI: score summary → advance / review round (recap | replay game — zero model calls) → re-quiz. Keep Sprint 001's merge-into-next-day as the escape hatch.
4. Post-game rating (worked / didn't work) → library counters / generated-game flag.

Run `acceptance.md` fully — the **worksheet test**, **materials test**, and **R1 audit** are the ones that fail silently if skipped. Update `planning/STATE.md` and commit per checkpoint (`sprint2 checkpoint A: ...`).

## Cut order if behind

US-28 print card → US-27 strictness preference → US-25 ratings → haiku tiebreak (pure deterministic match) → adaptGame (use library entry verbatim with a "swap in your own questions" note). **Never cut:** R1/R2 enforcement, the allowlist validation, the gate loop itself.
