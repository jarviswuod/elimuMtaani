# STATE.md — elimuMtaani

**Last updated:** 2026-09-02

## Current Phase

Architecture → Build handoff. The Architect Pack for Sprint 001 is complete and committed on branch `antonypeter`. No Sprint 001 code exists yet.

## Sprint Status

| Sprint | Status |
|---|---|
| 001-unified-hackathon-demo | **BUILT — all 4 checkpoints shipped** (2026-09-02) |
| 002-game-based-learning | **BUILT — checkpoints A/B/C shipped** (2026-09-02) |

## What shipped (2026-09-02)

**Sprint 001:** student topic→narrated lecture (SlidePlayer, SpeechSynthesis per Q-001 fallback) → quiz (instant grading) → lecture-scoped chat (open lectures only); teacher research (pasted text) → one-call term timetable (RISK-006 pad/trim) → sequential day-unlock grid → lazy session generation (RISK-001) → post-session gate; leaderboard (delivered ×10, recovered ×15); student read-only review with AI banner + haiku simplified summary.

**Sprint 002:** gameLibrary (8 general entries seeded) → deterministic match → haiku adapt → opus generate gated by the materials allowlist with named-violation retry + library fallback (DEC-015/016); GameCard with provenance badge + worked/didn't-work rating (US-25/Q-006); understanding gate as append-only sessions.attempts[] with advance-guard, game-round review (zero calls, NFR-22), merge-into-tomorrow escape hatch (DEC-017).

**Running state:** Convex deployment `fortunate-dove-790` has full schema + seeded library; `ELIMU_USE_FIXTURES=true` (no ANTHROPIC_API_KEY set). To go live: `cd web && npx convex env set ANTHROPIC_API_KEY sk-ant-... && npx convex env set ELIMU_USE_FIXTURES false`, then run the RISK-008 real-API smoke test.

**Remaining (cut-order items, not blockers):** Magpie TTS (Q-001), KICD scrape + YouTube transcripts (RISK-005 stretch), US-27 gate-strictness preference, US-28 printable game card.

## Next Action

Builder continues `planning/sprints/001-unified-hackathon-demo/handoff-prompt.md`, **Checkpoint 1** — auth is DONE (2026-09-02):

- Clerk: accountless dev app (`clerk init`), temp keys in `web/.env.local`, sign-in/sign-up pages, `proxy.ts` protects `/onboarding|/student|/teacher`
- Convex: project `elimu-mtaani` (deployment `fortunate-dove-790`), full 7-table schema pushed, `users.{current,ensureUser,setRole}` live
- Integration: `convex` JWT template created via Clerk Backend API, `CLERK_JWT_ISSUER_DOMAIN` set on the Convex deployment, `ConvexProviderWithClerk` wired in layout
- Onboarding role picker + role home pages render; signed-out access verified to redirect (307 → /sign-in)

Remaining for Checkpoint 1: `lib/claude.ts`, `lib/slides.ts`, `generateLecture` action, `SlidePlayer`, student topic→lecture flow.

**Update 2026-09-02 (later):** Clerk is now on the team's real app — CLI authenticated (anthonyonyango635@gmail.com), project linked to `app_3IlyEJXIUImwH5G4fA0O4HLklTz` ("elimu-mtasni", dev instance `ins_3IlyELbr…`, issuer `eternal-albacore-2958.clerk.accounts.dev`). The `convex` JWT template was re-created on this app (`jtmp_3Im02N8Uef3Nx2SJ13aKCrAvjb7`) and `CLERK_JWT_ISSUER_DOMAIN` updated on the Convex deployment. The earlier accountless app is orphaned/unused. Remaining Clerk task: enable Google-only OAuth in the dashboard (currently instance defaults). `/__clerk/:path*` proxy matcher and `Show`-based nav auth controls are in.

## Working Agreements

- Branch: all work on `antonypeter` until the team merges.
- The handoff is a folder, not a conversation: any scope/architecture change is recorded in `DECISIONS.md` before code changes.
- The pre-existing Express/Postgres scaffold (`backend/`, `frontend/`, `shared/`) is frozen this sprint (DEC-012).
- Every checkpoint must be demoable with no API keys via fixtures mode (DEC-010).

## Blockers

- Q-001: Magpie TTS contract unknown. Not build-blocking — Checkpoints 1–3 use browser SpeechSynthesis as the stand-in narrator.
