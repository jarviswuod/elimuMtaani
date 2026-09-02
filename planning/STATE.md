# STATE.md — elimuMtaani

**Last updated:** 2026-09-02

## Current Phase

Architecture → Build handoff. The Architect Pack for Sprint 001 is complete and committed on branch `antonypeter`. No Sprint 001 code exists yet.

## Sprint Status

| Sprint | Status |
|---|---|
| 001-unified-hackathon-demo | **In build — Checkpoint 1 auth done** |
| 002-game-based-learning | **Pack complete — blocked on 001 Checkpoints 1–3** |

## Next Action

Builder continues `planning/sprints/001-unified-hackathon-demo/handoff-prompt.md`, **Checkpoint 1** — auth is DONE (2026-09-02):

- Clerk: accountless dev app (`clerk init`), temp keys in `web/.env.local`, sign-in/sign-up pages, `proxy.ts` protects `/onboarding|/student|/teacher`
- Convex: project `elimu-mtaani` (deployment `fortunate-dove-790`), full 7-table schema pushed, `users.{current,ensureUser,setRole}` live
- Integration: `convex` JWT template created via Clerk Backend API, `CLERK_JWT_ISSUER_DOMAIN` set on the Convex deployment, `ConvexProviderWithClerk` wired in layout
- Onboarding role picker + role home pages render; signed-out access verified to redirect (307 → /sign-in)

Remaining for Checkpoint 1: `lib/claude.ts`, `lib/slides.ts`, `generateLecture` action, `SlidePlayer`, student topic→lecture flow.

**Note:** the accountless Clerk app is unclaimed — run `npx clerk@latest open` on the host to get the claim URL (do not paste it into logs/PRs) and claim it into the team's Clerk account before the demo. Google-only OAuth is configured post-claim.

## Working Agreements

- Branch: all work on `antonypeter` until the team merges.
- The handoff is a folder, not a conversation: any scope/architecture change is recorded in `DECISIONS.md` before code changes.
- The pre-existing Express/Postgres scaffold (`backend/`, `frontend/`, `shared/`) is frozen this sprint (DEC-012).
- Every checkpoint must be demoable with no API keys via fixtures mode (DEC-010).

## Blockers

- Q-001: Magpie TTS contract unknown. Not build-blocking — Checkpoints 1–3 use browser SpeechSynthesis as the stand-in narrator.
