# blueprint.md — Sprint 003: Experience Overhaul

See the approved build plan (mirrored in handoff-prompt.md) for full detail. Summary:

## Structure
- `components/SiteHeader.tsx` (marketing surfaces) + `components/AppShell.tsx` (sidebar + header for /teacher/* and /student/* via role layouts `app/{teacher,student}/layout.tsx`).
- Design tokens v2 in `app/globals.css` (same variable names — components restyle for free): warm paper `#FAF6EF`, ink `#1F2A24`, primary deep green `#1E6B4E`, accent terracotta `#C4521F`; fonts Fraunces (display) + Karla (body). DEC-019.
- `convex/analytics.ts` (`teacherStats`, `studentStats`) — read-only aggregations; charts as pure SVG in `components/charts.tsx` (DEC-021).
- `convex/schema.ts` + `notes` table `{userId, title, body, sourceType chat|lecture|manual, lectureId?, topic?}` index by_userId; `convex/notes.ts` CRUD (DEC-024).
- `convex/seedDemo.ts` idempotent mock-data seeder keyed by demo clerkIds (DEC-020); Clerk test users created via CLI, password sign-in from landing via `components/DemoLogin.tsx`.
- `lib/kicd.ts` curated CBC links + `app/teacher/knowledge/page.tsx`.
- `components/voice.ts` Web Speech hooks (DEC-022); wired into ChatPanel + QuizCard.
- Pure helpers extracted for testability: `lib/timetable.ts` (padTrimWeeks), `lib/games.ts` (materials allowlist), `lib/streak.ts` (DEC-023: Playwright runs logic + e2e).
- `playwright.config.ts`: `logic` project (no browser) + `e2e` project (chromium, webServer).

## Data flow (analytics)
sessions/timetables/quizzes/lectures → analytics queries (pure reads) → dashboard cards + SVG charts. Curriculum progress = advanced sessions / (weeks × 5) per timetable.

## Invariants preserved
R1/no-learner-data (analytics are teacher-standin + student-own aggregates only), DEC-009 badges everywhere, DEC-010 fixtures cover all flows.
