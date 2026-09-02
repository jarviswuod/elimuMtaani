# requirements.md — Sprint 002: Game-Based Learning + Understanding Gate

## Goal

Add two connected capabilities to the lesson pipeline:
1. A **game branch**: every teacher-delivered lesson pack can include a real classroom game — library-matched first, custom-generated only when nothing fits — that is teacher-facilitated, classroom-only, and needs nothing digital.
2. An **understanding gate**: a topic ends with a short follow-up quiz and a whole-class teacher judgment; the sequence only advances when the class is ready, with review / another game round → re-quiz as the loop.

## The two hard rules (from the design doc)

- **R1 — Classroom-only, no learner surface.** No learner ever logs in, touches a screen, or has an individual score/answer/identity captured. Games use chalkboard, teams, physical space, oral scoring the teacher tracks herself. Any game concept requiring "a learner logs in" or "the system records who won" is rejected at the schema level.
- **R2 — It must feel like a real game.** Every game (library or generated) must specify turns/rounds, a challenge mechanic, and a win condition. "Answer these 10 questions in groups" fails; "first team to answer 3 in a row advances" passes. This is enforced by the output schema and a validation rule, not by hope.

## User stories (MoSCoW)

### Must have

- **US-20 (Teacher):** When my day's lecture is generated, the system checks a game library for a match to the topic; if one fits, I get that game adapted to my lesson content (questions/terms swapped in).
- **US-21 (Teacher):** If no library game fits, the system designs a new game from the lesson content — using only materials a normal classroom already has (chalkboard, exercise books, groups, the ground outside).
- **US-22 (Teacher):** The game appears as one more section of the lesson pack I already receive (alongside slides, narration, quiz) — with clear rules: setup, turns, scoring, win condition, timing, group sizes for a 40–60 learner class.
- **US-23 (Teacher):** After delivering a topic, the follow-up quiz tells me whether the class got it. If not, I get a one-tap "review round" option (quick recap + another round of the game) and can re-run the quiz. The day only advances when I say the class is ready.
- **US-24 (System):** Nothing about the gate stores individual learners — the only recorded fact is my whole-class judgment (ready / review again) and my stand-in quiz score.

### Should have

- **US-25 (Teacher):** I can rate a game after playing it ("worked / didn't work with my class") — this feeds the library's match quality and flags unplayable generated games for review.
- **US-26 (Team):** A seeded starter library of ~8 general games (relay race, team quiz rounds, concept bingo, describe-without-the-word, role-play, board race, hot seat, knockout rounds), each entry readable as real game rules.

### Could have

- **US-27 (Teacher):** Choose gate strictness per class ("most of the class" vs "everyone") as a stored preference the quiz summary respects.
- **US-28 (Teacher):** Print/export the game rules card separately for offline classroom use.

### Won't have (this sprint)

- Learner-facing game surfaces of any kind (permanent — R1); per-learner analytics (permanent); subject-specific game libraries (Q-004 resolved: entries are general and reusable); automated playability simulation (teacher review is the check, Q-006).

## Non-functional requirements

- **NFR-20:** Library match is attempted before any generation call (cost + quality: a proven game adapted is better and cheaper than a novel one).
- **NFR-21:** Generated games validate against a materials allowlist (chalkboard, exercise books, paper, groups, outdoor space, locally-free objects) — any other material fails validation and regenerates.
- **NFR-22:** The gate loop adds zero new model calls when the teacher chooses "review round" with an existing game — replay is free.
- **NFR-23:** Fixtures cover the game branch (sample library + one sample generated game) per DEC-010.
