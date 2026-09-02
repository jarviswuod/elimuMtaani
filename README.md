# elimuMtaani

**AI-assisted lesson planning and self-directed learning for Kenya's CBC classrooms.**

elimuMtaani turns one curriculum research source into a full term timetable — then delivers each day as a narrated slide session, graded by a quick post-session quiz, with a classroom game ready when the class needs it. Students explore any topic independently, quiz themselves, and chat with an AI tutor about what they're learning.

> Built for Kenya. Grounded in KICD/CBC. No learner data stored.

---

## Quick start

```bash
# 1. Clone and enter the web app
git clone <repo>
cd elimuMtaani/web

# 2. Environment
cp .env.example .env.local
# Fill in NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY (see docs/OPERATIONS.md)

# 3. Install dependencies
npm install

# 4. Start Convex (schema push + watch)
npx convex dev &

# 5. Start Next.js
npm run dev
```

Open http://localhost:3000.

### Demo accounts (no sign-up needed)

Click **"Try it now"** on the landing page, or use the one-click buttons in the Demo section:

| Role | Email | Password |
|---|---|---|
| Teacher | `demo.teacher+clerk_test@elimumtaani.dev` | `ElimuMtaani-Demo-2026` |
| Student | `demo.student+clerk_test@elimumtaani.dev` | `ElimuMtaani-Demo-2026` |

Re-seed demo data at any time (idempotent):
```bash
npx convex run seedDemo:run '{
  "teacherClerkId": "user_3Im80msH3dJWljfX3HXib6K5rxQ",
  "studentClerkId": "user_3Im814hfv2lCqkW4kuycX0gniEN"
}'
```

---

## Architecture

```
web/                          Next.js 16 App Router (the product)
  app/
    page.tsx                  Landing page
    about/                    About page
    onboarding/               Role selection (teacher / student)
    teacher/                  Teacher-only routes (AppShell layout)
      page.tsx                Analytics dashboard
      research/               Term planning start
      timetable/[id]          Week-by-day timetable view
      session/[dayRef]        Deliver a session (lecture + quiz + game)
      knowledge/              KICD knowledge base
      notes/                  Saved notes
      leaderboard/            Teacher ranking
    student/                  Student-only routes (AppShell layout)
      page.tsx                Dashboard (lecture input + stats)
      lecture/[id]            Slide player + chat + quiz
      review/                 Class session review
      notes/                  Saved notes
  components/
    AppShell.tsx              Authenticated sidebar + header shell
    SiteHeader.tsx            Marketing header (landing, about, onboarding)
    ChatPanel.tsx             Lecture chat with mic input + save-to-notes
    SlidePlayer.tsx           Narrated slide deck (speechSynthesis)
    QuizCard.tsx              Self-graded quiz
    GameCard.tsx              Teacher-facilitated classroom game
    NotesView.tsx             Searchable notes with .md export
    DemoLogin.tsx             One-click Clerk password sign-in
    charts.tsx                Pure-SVG charts (ProgressRing, Sparkline, BarRow)
    voice.ts                  useSpeechInput + useSpeaking (Web Speech API)
  convex/                     Convex backend (DB + serverless functions)
    schema.ts                 9-table schema
    analytics.ts              Read-only analytics queries
    notes.ts                  Notes CRUD
    seedDemo.ts               Idempotent demo data seeder
    actions/                  LLM-calling server actions
  lib/
    streak.ts                 computeStreak() — pure function, tested
    kicd.ts                   Curated KICD/CBC links
  tests/
    logic/                    Pure-function Playwright specs
    e2e/                      Browser E2E + KICD link health
  docs/                       Technical documentation
  planning/                   Sprint packs + tech debt register
```

**Stack**: Next.js 16 · Convex · Clerk v7 · Tailwind CSS · Playwright

---

## Testing

```bash
cd web

# Pure function tests (no browser, fast)
npx playwright test --project=logic

# E2E tests (requires dev server)
npx playwright test --project=e2e

# KICD link health (requires internet)
npx playwright test --grep @external
```

See `docs/TESTING.md` for full details.

---

## Key design decisions

| # | Decision | Choice |
|---|---|---|
| DEC-009 | Every AI-generated artifact is labelled | `GeneratedBadge` component on all output |
| DEC-010 | Fixtures mode | `ELIMU_USE_FIXTURES=true` → deterministic demo data |
| DEC-015 | Game library is general, not per-subject | Reusable across topics |
| DEC-017 | Session attempts are aggregate-only | Teacher's class judgment, never individual learner scores |
| DEC-019 | Design tokens: warm-paper, no purple, no Inter | Fraunces + Karla; `--primary: #1e6b4e` (green) |
| DEC-021 | SVG charts, no chart library | `charts.tsx`: ProgressRing, Sparkline, BarRow |
| DEC-022 | Notes model | NotebookLM-style; `notes` table with `by_userId` index |
| DEC-023 | Voice: Web Speech API | Zero cost; client-only; graceful unsupported fallback |

Full decision log: `planning/DECISIONS.md`.

---

## Invariants

- **R1 — No learner PII**: No individual student score, answer, or identity is ever stored. `sessions.attempts` records the teacher's aggregate class judgment only.
- **No learner login**: No child ever authenticates. The system is teacher + student (own account) only.
- **NFR-30 — No writes on read paths**: `analytics.ts` queries are read-only.

---

## Documentation

| Doc | Contents |
|---|---|
| `docs/DATA_MODEL.md` | All 9 Convex tables with field types and invariants |
| `docs/FEATURES.md` | Per-role feature walkthrough |
| `docs/TESTING.md` | Running Playwright, tags, CI notes |
| `docs/OPERATIONS.md` | Env vars, deployments, fixtures mode, demo accounts |
| `planning/TECH_DEBT.md` | Known issues with severity and target quarters |
| `planning/sprints/` | Sprint packs (requirements, blueprint, acceptance) |
