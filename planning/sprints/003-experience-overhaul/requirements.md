# requirements.md — Sprint 003: Experience Overhaul

## Goal

Product-quality pass over the working app: real dashboards with curriculum-progress analytics, a de-clichéd visual identity, one-click demo accounts with rich mock data, NotebookLM-style notes, client-side voice learning features, a teacher knowledge base grounded in KICD, a Playwright test suite, and professional documentation.

## User stories (MoSCoW)

### Must have
- **US-30 (Both):** App pages live in a shell with a sidebar (role-aware nav) and header; landing/onboarding/About share a site header.
- **US-31 (Teacher):** Dashboard shows curriculum progress per timetable (% of term plan delivered), sessions this week, understanding trend, and a revisit radar.
- **US-32 (Student):** Dashboard shows lectures/quizzes stats, average score, a learning streak, and activity sparkline.
- **US-33 (Both):** Landing page offers demo teacher/student accounts with one-click sign-in; demo data makes every dashboard chart non-empty.
- **US-34 (Both):** Any AI chat answer or lecture summary can be saved as a note; notes are searchable, editable, deletable, exportable as .md (NotebookLM-style).
- **US-35 (Teacher):** A knowledge base page lists curated KICD/CBC links (kicd.ac.ke) with a "use as research source" shortcut.
- **US-36 (Both):** Voice: mic input for chat questions; listen buttons on answers; quiz read-aloud mode.
- **US-37:** New visual identity with zero AI clichés (no purple gradients, no Inter); About page linked from the header; sign-in lands on /onboarding → role dashboard.
- **US-38:** Playwright suite: pure-logic specs, public-page specs, demo-flow E2E specs, KICD link-health specs.
- **US-39:** README + docs/ rewritten to senior-technical-writer standard; tech debt registered in planning/TECH_DEBT.md.

### Won't have (this sprint)
Magpie TTS (Q-001), KICD live scraping (RISK-005 — links only), per-learner analytics (R1, permanent), mobile app.

## Non-functional
- NFR-30: analytics are Convex queries over existing tables — no new writes on read paths.
- NFR-31: voice features are pure client-side Web Speech API; degrade gracefully when unsupported.
- NFR-32: fixtures mode still covers every flow end-to-end (DEC-010) — E2E tests run keyless.
