# acceptance.md — Sprint 002: Game-Based Learning + Understanding Gate

## Game branch

- [ ] Generating a lecture on a vocabulary-shaped topic returns a game with `source: "library"` (match found), with the lesson's own terms/questions swapped into the library structure.
- [ ] Generating a lecture on a deliberately odd topic (no library fit) returns `source: "generated"` — and the game passes the R2 litmus: it has explicit turns, a challenge mechanic, and a win condition that a teacher can read aloud as rules.
- [ ] **Worksheet test:** prompt-inject a temptation (topic phrased as "answer these questions in groups") — the generated output must still be a structured game (rounds/advancement/scoring), not the worksheet restated.
- [ ] **Materials test:** no generated game ever lists a material outside the allowlist (run 5 generations, grep materials). A violation regenerates once, then falls back to a library entry.
- [ ] **R1 audit:** grep schema + generated output for any learner-identifying or learner-digital concept (login, device, per-learner score). Zero hits. `sessions.attempts` stores only aggregate stand-in scores + the teacher's judgment.
- [ ] Game section renders in the pack with the correct provenance badge (`From game library` vs `AI-designed — review before class`).
- [ ] With `ELIMU_USE_FIXTURES=true` and no API keys, the fixture game renders end-to-end.

## Understanding gate

- [ ] After a session quiz, the teacher sees the gate: "advance" or "review round".
- [ ] Choosing "review round → replay game" issues **zero** model calls and returns to the re-quiz state.
- [ ] Re-running the quiz appends a new entry to `sessions.attempts` (never overwrites — the loop history is visible).
- [ ] `advanceTopic` succeeds only when the latest attempt has `classReady: true`; the next timetable day stays locked until then.
- [ ] The strand builds topic by topic: day N+1 is only reachable after day N's session is `advanced` (or explicitly skipped by the teacher — her call, not the system's).
- [ ] Sprint 001's "merge into next day" still works as the escape hatch from the gate.

## Library health

- [ ] Seed loads all 8 general game entries; each entry's `mechanics` fields are non-empty and read as game rules.
- [ ] Post-game "worked / didn't work" rating updates the library counters; a "didn't work" on a generated game flags it (`teacherReviewed: false` path visible for Q-006 review).

## Demo script addition (extends Sprint 001's story)

1. Teacher opens Tuesday's session → pack now ends with "Board Race: Water Cycle edition" (library badge).
2. Delivers, quizzes low → gate offers review → replays the game round → re-quiz passes → advances to Wednesday.
3. Point at the screen: "No learner touched anything. The game is chalk and teams; the system only ever knew the class was ready."
