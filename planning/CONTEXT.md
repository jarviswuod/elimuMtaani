# CONTEXT.md — elimuMtaani

**Last updated:** 2026-09-02 — Session 1
**Current phase:** Architecture (Sprint 001 unified pack generated, not yet built)
**Current sprint:** 001-unified-hackathon-demo

---

## What We Are Building

A role-based web app (student/teacher) for a 3-hour hackathon demo. Teachers research a topic from one real source (KICD curriculum, YouTube, or pasted text), get an AI-generated term timetable for one class, deliver live narrated lecture sessions per timetable day with a rule-based comprehension check, and see a simple leaderboard. Students independently generate open-topic narrated lectures with chat and a quiz, and can also review teacher-delivered sessions in a simplified read-only view.

## Why It Matters

Teachers in Kenya's CBC system — often starting from home with no ready lesson content — need to go from "what should I teach, and when" to an actual engaging, deliverable classroom session. Students need both a self-serve way to explore any topic and a way to catch up on what was taught in class.

## Users

| Role | Technical level | Frequency |
|---|---|---|
| Student | Low — casual web/app user | Per-topic (self-serve) or per-class (review) |
| Teacher | Low-medium — comfortable with web forms | Per research/timetable cycle (per term), per lesson (daily) |

## Core Workflow

**Teacher:**
1. Google sign-in (Clerk), one-time role picker → "Teacher"
2. Selects grade + subject + term, submits one research source (KICD scrape, YouTube transcript, or pasted text)
3. Triggers generation of a term timetable (weekly/daily topic breakdown) grounded in that research
4. Selects a timetable day, delivers a live narrated slide session (auto-generated on demand, reusing the student lecture pipeline)
5. Takes the post-session quiz standing in for the class; app computes a rule-based "revisit" flag if the score is low, with an option to combine with the next day's session
6. Views a simple leaderboard ranking teachers by sessions delivered / average quiz score

**Student:**
1. Google sign-in (Clerk), one-time role picker → "Student"
2. Types any topic → Claude-generated outline + narrated script → synced HTML/CSS slides + audio → lecture-scoped multi-turn chat → auto-graded quiz
3. Separately, can browse and review any teacher-delivered session in a simplified read-only view (no chat, no regenerate)

## Key Entities

- **User** — Clerk identity + role (student/teacher)
- **Lecture** — topic or timetable-day-linked, outline, script, slide data, audio ref, source (open/cbc), optional `timetableRef`/`deliveredBy`
- **ChatMessage** — lecture-scoped multi-turn Q&A (student open-topic lectures only)
- **Quiz** — generated questions, answers, score
- **ResearchSource** — one teacher-submitted source (KICD/YouTube/pasted), extracted text, grade/subject/term
- **Timetable** — teacher + grade + subject + term, weeks/days breakdown, each day optionally linked to a lecture
- **Session** — a delivered live session's quiz result and rule-based comprehension flag, feeds the leaderboard

## Technology Stack

- Frontend: Next.js (App Router), deployed on Vercel
- Backend logic: Convex actions (Claude calls, Magpie TTS calls, KICD scrape/PDF parse, YouTube transcript fetch [stretch])
- Database: Convex
- Auth: Clerk, Google OAuth only
- LLM: Claude API (Anthropic) — `claude-opus-4-8` for generation, `claude-haiku-4-5` for grading/simplification (see DEC-008)
- TTS: Magpie TTS Zeroshot (contract unresolved — see Q-001; fallback is browser SpeechSynthesis)
- Landing page: built per the `frontend-design` skill

## Architectural Pattern

Layered / feature-sliced Next.js app with Convex as backend-for-frontend — see `planning/sprints/001-unified-hackathon-demo/blueprint.md` and `docs/ARCHITECTURE.md`

## Sprint History

| Sprint | Name | Status | Key Decisions |
|---|---|---|---|
| 001 | Unified Hackathon Demo (Teacher + Student) | Architect pack complete, not built | DEC-001–DEC-011: no video encoding, Convex as sole backend, Convex persistence, real-but-narrowed research/timetable/delivery scope, KICD live scrape, unified sprint merge, frontend-design skill landing page, verified model IDs, provenance labels, fixtures mode, citations/structured-output split |

**Note:** This sprint originally existed in two draft forms — "001-student-core-path" (student-only) and a planned separate "002-teacher-cbc-path" — before the operator requested the expanded teacher research/timetable/delivery/leaderboard scope. Per DEC-006, both were merged into this single unified Sprint 001. No code was written against either earlier draft.

**Note on the repo:** This repository also contains an earlier Express/Postgres/React-PWA scaffold (`backend/`, `frontend/`, `shared/`, `docker/`, `data/`) from a prior product direction ("night-before teaching packs"). Per DEC-009/DEC-012 it is left untouched this sprint; its provenance model and demo-insurance patterns were carried into this pack. Cleanup is a post-hackathon question (Q-002 adjacent).

## Open Questions

See `planning/QUESTIONS.md` — Q-001 (Magpie TTS contract) is the main blocker; Q-002 (post-hackathon teacher lecture-management scope) and the roadmap items in `DOMAIN.md` are for later.

## Known Risks

See `planning/RISKS.md` — highest-attention items for this sprint: RISK-003 (TTS contract), RISK-005 (three research integrations), RISK-006 (timetable structured output), RISK-007 (two renderers, one data model).

## Key Decisions Made

See `planning/DECISIONS.md`

## What Comes Next

Hand `planning/sprints/001-unified-hackathon-demo/handoff-prompt.md` to the Builder agent. Builder should follow the phased implementation sequence in that file so a working demo exists at multiple checkpoints, not just at the very end. After the hackathon demo, return to the Architect to plan the post-hackathon roadmap items listed in `planning/DOMAIN.md`.
