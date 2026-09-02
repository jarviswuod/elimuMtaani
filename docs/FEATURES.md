# elimuMtaani — Feature Reference

## Teacher features

### Term planning
1. **Research source** — paste curriculum text, a KICD design URL, or a YouTube link.
2. **Timetable generation** — one LLM call produces a weeks-by-days breakdown (`generateTimetable`).
3. **Knowledge base** (`/teacher/knowledge`) — curated KICD/CBC links, searchable; each card has "Use as research source" to prefill the research form.

### Delivery
4. **Narrated slide session** — open any timetable day → `generateLecture` → `SlidePlayer` auto-advances with `speechSynthesis` narration.
5. **Understanding gate** — after a session a quiz is auto-generated (`generateQuiz`). The teacher enters the class score. If the class isn't ready, `recordAttempt` keeps the session open for a follow-up.
6. **Revisit radar** — dashboard widget listing topics with >1 attempt not yet advanced.

### Analytics (dashboard)
7. **Curriculum progress rings** — `ProgressRing` per timetable showing advanced/total days.
8. **Understanding trend** — `Sparkline` of the last 10 quiz scores.
9. **Leaderboard** — global ranking by sessions + recovered sessions.

### Classroom games
10. **Game library** — pre-seeded templates (recall / application). Teacher can attach a game to any lecture.
11. **AI game generation** — if no library match, `generateGame` creates custom rules grounded in the lecture content.

### Notes
12. **Save to notes** — bookmark any chat answer or manually type a note. Searchable + `.md` export.

---

## Student features

### Self-directed learning
1. **Open lecture** — type any topic → `generateLecture` → `SlidePlayer` with narration.
2. **Chat** — `ChatPanel` under every lecture; ask unlimited follow-ups.
3. **Voice input** — mic button transcribes question via `useSpeechInput` (Web Speech API).
4. **Listen** — speak any assistant answer via `useSpeaking`.
5. **Quiz** — 5-question auto-generated quiz after each lecture; score saved.

### Class review
6. **Session review** (`/student/review`) — browse teacher-delivered sessions; simplified summary via haiku.

### Progress
7. **Day streak** — computed from lecture creation timestamps.
8. **Badges** — First lecture, Curious 5, Quiz taker, Sharp shooter, 3-day streak.
9. **Weekly activity bar chart**.

### Notes
10. **Save to notes** — from chat answers or manually; searchable + `.md` export.

---

## Shared / infrastructure

- **Design system** — warm-paper tokens (`--primary: #1e6b4e`, `--accent: #c4521f`), Fraunces display, Karla body (no purple, no Inter).
- **Fixtures mode** — `ELIMU_USE_FIXTURES=true` skips all LLM calls and returns deterministic fixture data. Demos never depend on API keys.
- **Generated badge** — every AI output carries a visible `AI-generated` chip (DEC-009).
- **No learner PII** — quiz scores are teacher stand-ins; no individual student data (R1).
- **Demo accounts** — one-click sign-in from the landing page (`DemoLogin` component) using pre-seeded Clerk test users.
