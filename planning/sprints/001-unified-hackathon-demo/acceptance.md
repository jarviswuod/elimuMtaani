# acceptance.md — Sprint 001: Unified Hackathon Demo

Acceptance is per checkpoint. A checkpoint passes only if its demo script runs clean **twice in a row**, once with fixtures ON and (from Checkpoint 1's smoke test onward) once with fixtures OFF.

## Checkpoint 1 — Walking skeleton

- [ ] `npm run dev` boots; Google sign-in via Clerk works; new user hits `/onboarding` exactly once; role persists in Convex `users`.
- [ ] Student and teacher are routed to their role homes; a student cannot open `/teacher/*` and vice versa.
- [ ] Student types a topic → progress narrator shows stages (never a bare spinner, NFR-02) → lecture renders as steppable slides with narration (SpeechSynthesis).
- [ ] Every generated slide view shows the `GeneratedBadge` (NFR-03).
- [ ] With `ELIMU_USE_FIXTURES=true` and NO API keys, the same flow works from committed fixtures (NFR-01).
- [ ] **Real-API smoke test (RISK-008):** fixtures OFF, one lecture generates against the live Claude API with `claude-opus-4-8`.

## Checkpoint 2 — Quiz + chat

- [ ] After a lecture, a quiz of ≥4 multiple-choice questions renders; selecting answers grades instantly with score + explanations.
- [ ] Quiz score persists on the quiz record; re-taking overwrites, never duplicates.
- [ ] Lecture-scoped chat answers follow-ups with lecture context; chat is ABSENT on review views and cbc lectures.

## Checkpoint 3 — Teacher path

- [ ] Teacher submits grade + subject + term + pasted text → research source saved with `extractedText`.
- [ ] "Generate timetable" produces a weeks×days grid in ONE model call (verify in logs, NFR-05); grid is never ragged (RISK-006 post-validation).
- [ ] Opening a day with no lecture generates one lazily and links it; reopening the same day does NOT regenerate (RISK-001).
- [ ] Post-session quiz records a session; score < 60% shows the revisit flag and offers "merge into next day"; accepting updates the next day's objective visibly.
- [ ] Timetable topics visibly relate to the pasted research text (spot-check 3 days).

## Checkpoint 4 — Leaderboard, review, TTS

- [ ] Leaderboard ranks ≥2 seeded teachers by sessions delivered and average quiz score; delivering a new session updates it live.
- [ ] Student review list shows delivered sessions; opening one renders the SAME lecture record read-only: no chat, no regenerate, "AI-generated revision aid" banner present (US-10, DEC-009).
- [ ] TTS: if Q-001 resolved, Magpie audio plays and is stored in Convex file storage; otherwise SpeechSynthesis still narrates (no regression).

## Final demo script (the 3-minute story)

1. Teacher signs in → pastes CBC source text → timetable for the term appears.
2. Opens Monday → live narrated slide session plays.
3. Takes the quiz, scores low → revisit flag → merges into Tuesday.
4. Leaderboard updates.
5. Student signs in → reviews the delivered session (simplified, read-only, AI banner).
6. Student types their own topic ("photosynthesis") → full lecture + chat + quiz.
7. Kill the network / remove keys → fixtures mode still demos the student flow.
