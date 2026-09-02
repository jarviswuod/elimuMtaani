# blueprint.md — Sprint 002: Game-Based Learning + Understanding Gate

## Where this fits in the existing architecture

The lecture pipeline (Sprint 001) already produces slides + narration + quiz. This sprint adds a **second optional branch** beside audio, following the same rule the audio branch uses: **check for something pre-made first; generate something new only if nothing fits.**

```
Lesson content ready (generateLecture output)
        │
        ├── audio branch (existing): pre-made fixture? ── else synthesize
        │
        └── game branch (NEW):
              matchGame(topic, subject) against gameLibrary
                │
                ├─ good match → adaptGame: swap lesson content into the
                │               library entry's structure (cheap call, haiku)
                │
                └─ no match  → generateGame: design new classroom-only game
                               from the lecture script (opus, strict schema)
                │
              game section added to the lecture record
```

## Convex schema additions (`web/convex/schema.ts`)

```ts
gameLibrary: defineTable({
  name: v.string(),                        // "Concept Bingo", "Board Race"
  thinkingType: v.union(v.literal("recall"), v.literal("application")),
  materials: v.array(v.string()),          // from MATERIALS_ALLOWLIST only
  playersAtOnce: v.string(),               // "whole class in teams of 5-6"
  durationMinutes: v.number(),
  // R2 — what makes it a GAME, required and non-empty:
  mechanics: v.object({
    turns: v.string(),                     // how turns/rounds work
    challenge: v.string(),                 // the tension: time, competition, luck
    winCondition: v.string(),              // how someone/some team wins
  }),
  tags: v.array(v.string()),               // topic-shape tags: "vocabulary", "sequencing", "categories"
  timesUsed: v.number(),
  worked: v.number(),                      // US-25 thumbs-up count
  didntWork: v.number(),
}).index("by_thinkingType", ["thinkingType"]),
```

`lectures` gains an optional field (additive, no migration pain):

```ts
game: v.optional(v.object({
  source: v.union(v.literal("library"), v.literal("generated")),  // provenance, DEC-009
  libraryEntryId: v.optional(v.id("gameLibrary")),
  name: v.string(),
  setup: v.string(),
  rules: v.array(v.string()),              // numbered, readable aloud
  mechanics: v.object({ turns: v.string(), challenge: v.string(), winCondition: v.string() }),
  materials: v.array(v.string()),
  durationMinutes: v.number(),
  groupPlan: v.string(),                   // how 40-60 learners split
  teacherReviewed: v.optional(v.boolean()), // US-25 / Q-006
})),
```

`sessions` gains the gate loop (replaces the one-shot revisit):

```ts
// CHANGED from Sprint 001's single quizScore/revisitFlag:
attempts: v.array(v.object({              // one entry per quiz run — aggregate only, never per-learner (R1)
  quizScore: v.number(),                  // teacher's stand-in score
  classReady: v.boolean(),                // the whole-class judgment call
  reviewAction: v.optional(v.union(v.literal("recap"), v.literal("game_round"))),
})),
status: v.union(v.literal("open"), v.literal("advanced")),  // gate state
```

## Convex actions (`web/convex/actions/`)

- `matchGame.ts` — deterministic first (tag/keyword overlap between topic + library tags, weighted by `worked/didntWork`), one `claude-haiku-4-5` tiebreak only if ≥2 candidates score equally. Returns entry or null. **Zero opus calls.**
- `adaptGame.ts` — haiku call: library entry + lecture script → the entry's structure with this lesson's questions/terms/examples swapped in. Provenance `library`.
- `generateGame.ts` — opus call with strict zod schema (the `game` shape above). Prompt encodes R1 + R2 + the worksheet-vs-game table from the design doc as few-shot contrast. **Post-validation:** every `materials[]` item must be in `MATERIALS_ALLOWLIST` (chalkboard, chalk, exercise books, paper, pens, desks, groups, outdoor space, stones/bottle-tops/local free objects); `mechanics.*` must be non-empty; on failure, one retry with the violation named, then fall back to the closest library entry (a proven game beats a broken novel one).
- `gates.ts` (mutations, not actions) — `recordAttempt(sessionId, quizScore, classReady, reviewAction?)`, `advanceTopic(sessionId)`. Advancing requires the latest attempt's `classReady === true`. Gate strictness is the teacher's call (US-27 preference is display-only guidance — the system supports, never overrides).

`generateLecture.ts` changes: after slides/quiz, call `matchGame` → `adaptGame` | `generateGame` and store `lecture.game`. Behind `ELIMU_USE_FIXTURES`, return the fixture game (NFR-23).

## Seed data

`web/convex/fixtures/gameLibrary.json` — 8 general entries (Q-004: general, not per-subject): relay race, team quiz knockout, concept bingo, describe-without-the-word, role-play trial, board race, hot seat, three-in-a-row advance. Each written as **real game rules** (R2 litmus: reads like a game, not an activity). Seeded via `npx convex import` or an `internalMutation` seed script.

## Frontend

- `components/GameCard.tsx` — renders the game section in the lecture/pack view: name, provenance badge (`From game library` / `AI-designed — review before class`, DEC-009), setup, numbered rules, win condition, group plan, duration. Print-friendly (US-28 stretch).
- `app/teacher/session/[dayRef]/page.tsx` (extend) — after-quiz gate UI: score summary → "Class got it → advance" / "Not yet → review round" (recap or replay game — no new generation, NFR-22) → re-quiz button. Advancing marks `sessions.status = "advanced"` and unlocks the next timetable day.
- Post-game one-tap rating (US-25): "Worked / Didn't work" → increments library counters or flags a generated game (`teacherReviewed`).
- Student review view: shows the game rules read-only (it's classroom history, not a playable surface — R1).

## What changes in Sprint 001's shipped code

Minimal and additive: `schema.ts` (+1 table, +2 field groups), `generateLecture.ts` (+game step), session page (+gate loop UI replacing the bare revisit flag). Sprint 001's revisit-merge ("combine with tomorrow") remains as the escape hatch when a class needs more than a same-day review round.

## Cost profile

Per lesson: 0 extra opus calls when a library match exists (haiku adapt only); 1 opus call worst-case. Gate loop: 0 calls. This is the library-first pattern doing its job (NFR-20).
