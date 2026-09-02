# handoff-prompt.md — Builder instructions, Sprint 001

You are the **Builder** for elimuMtaani. Your scope is exactly this sprint pack. Read, in order: `planning/CONTEXT.md`, `planning/DECISIONS.md`, `planning/RISKS.md`, this sprint's `requirements.md`, `blueprint.md`, `acceptance.md`. Do not redefine scope; if reality contradicts the pack, add a dated note to `planning/DECISIONS.md` and continue.

## Ground rules

- Branch: `antonypeter`. Commit at every checkpoint with message `checkpoint N: <what demos now>`.
- The legacy `backend/`, `frontend/`, `shared/`, `docker/`, `data/` directories are FROZEN (DEC-012). Build the new app in `app/` per `blueprint.md` (if you must deviate to `web/`, record it in DECISIONS.md first).
- Models: `claude-opus-4-8` (generation), `claude-haiku-4-5` (grading/simplification). Never any other ID (DEC-008, RISK-008).
- Structured output via zod for lecture/timetable/quiz; plain messages + citations for research answers (DEC-011). These are separate code paths — do not merge them.
- Every generation action must honor `ELIMU_USE_FIXTURES=true` by returning committed fixtures with zero external calls (DEC-010). Write the fixture the moment you write the action.
- Every generated artifact renders with `GeneratedBadge` (DEC-009).
- Stop and demo at each checkpoint before starting the next. A half-built Checkpoint 3 with a working Checkpoint 2 beats the reverse.

## Checkpoint 1 — Walking skeleton (build this first, it alone is a demo)

1. Scaffold: `create-next-app` (TypeScript, App Router, Tailwind) + `npx convex dev` + Clerk via the official Clerk+Convex template (RISK-004). Env: `NEXT_PUBLIC_CONVEX_URL`, Clerk keys, `ANTHROPIC_API_KEY`, `ELIMU_USE_FIXTURES`.
2. `convex/schema.ts` — all 7 tables from blueprint.md, verbatim, with the listed indexes.
3. Onboarding role picker → `users.setRole`; `middleware.ts` gates `/teacher/*` and `/student/*` by role.
4. `lib/claude.ts` (SDK wrapper: model consts, zodOutputFormat helper, fixtures switch) + `lib/slides.ts` (frozen Slide zod schema).
5. `convex/actions/generateLecture.ts` — ONE structured-output call: topic → {outline, script, slides[]}. Insert lecture.
6. `components/SlidePlayer.tsx` with `mode` prop (build 'live' now, stub 'review'); SpeechSynthesis narration per slide; `ProgressNarrator` during generation (stage names, no bare spinner).
7. Student home: topic input → lecture page.
✅ Run acceptance.md Checkpoint 1, including the fixtures-OFF smoke test.

## Checkpoint 2 — Quiz + chat

1. `convex/actions/generateQuiz.ts` (opus-4-8, zod: 4–6 MCQs) + `QuizCard` with client-side grading, haiku-4-5 feedback optional.
2. `convex/actions/chat.ts` — multi-turn, lecture script as context; `ChatPanel` only on `source === 'open'` lectures.
✅ acceptance.md Checkpoint 2.

## Checkpoint 3 — Teacher path

1. `convex/actions/research.ts` — pasted text path ONLY first: save ResearchSource with extractedText. (KICD fetch / YouTube transcript: stretch, same output field, add only if ahead of schedule — RISK-005.)
2. `convex/actions/generateTimetable.ts` — ONE call, zod bounds, deterministic pad/trim post-validation (RISK-006). Grid UI at `teacher/timetable/[id]`.
3. Day open → lazy `generateLecture` with day topic + research excerpt; link `lectureId` back onto the day (RISK-001 — never regenerate a linked day).
4. Delivery page reuses `SlidePlayer mode='live'`; post-session quiz → insert Session with `revisitFlag = score < 0.6`; "merge into next day" mutation.
✅ acceptance.md Checkpoint 3.

## Checkpoint 4 — Leaderboard, review, TTS

1. `convex/leaderboard.ts` query (aggregate sessions by teacher) + page.
2. Student review: sessions list → `SlidePlayer mode='review'` (no chat/regenerate, mandatory "AI-generated revision aid" banner); simplified summary via haiku-4-5 cached on the lecture.
3. TTS: only if Q-001 is answered — implement Magpie in `convex/actions/tts.ts` behind the existing `synthesize` signature; otherwise leave SpeechSynthesis.
4. Landing page last, per the `frontend-design` skill (DEC-007).
✅ acceptance.md Checkpoint 4 + final demo script, twice.

## Cut order if behind (RISK-002)

Magpie TTS → YouTube transcript → KICD scrape → leaderboard → student review → chat. **Never cut:** student lecture flow, teacher timetable, day→lecture delivery.

## When done

Update `planning/STATE.md` (checkpoint reached, blockers), commit, push. Return to the Architect for the post-hackathon roadmap (Q-002, DOMAIN.md).
