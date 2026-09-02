# ARCHITECTURE.md — elimuMtaani

## Pattern

**Layered, feature-sliced Next.js (App Router) with Convex as backend-for-frontend.**

- **Presentation** — Next.js route groups per role (`/student/*`, `/teacher/*`), shared components (`SlidePlayer`, `QuizCard`, `ChatPanel`, `ProgressNarrator`, `GeneratedBadge`). Clerk handles auth UI; middleware gates route groups by role.
- **Application** — Convex queries/mutations for realtime state (lectures, timetables, sessions, leaderboard) and Convex **actions** for anything that leaves the platform: Claude API, TTS, source ingestion. The UI never calls external APIs directly.
- **Domain** — 7 entities (see `planning/DOMAIN.md`) as Convex tables; the `Slide` JSON schema (`lib/slides.ts`) is the frozen contract between generation and both renderers.
- **Infrastructure** — Vercel (frontend), Convex cloud (DB, actions, file storage), Clerk (Google OAuth), Anthropic (`claude-opus-4-8` / `claude-haiku-4-5`), Magpie TTS Zeroshot (pending Q-001; browser SpeechSynthesis until then).

## Why this shape

- **One backend surface (Convex)** — no server ops, realtime queries free, actions give a safe home for API keys (DEC-002/003).
- **One lecture pipeline, two renderers** — teacher delivery and student review render the same `Lecture` record via `SlidePlayer` modes, preventing model divergence (RISK-007).
- **Lazy generation + persistence as cache** — timetables are one structured-output call; day lectures generate on first open only (RISK-001).
- **Split call paths** — structured output (zod) for shapes the UI depends on; plain messages with citations for research-grounded answers, because the API cannot do both in one call (DEC-011).
- **Fixtures as a first-class mode** — every action returns committed fixtures under `ELIMU_USE_FIXTURES=true`, so demos never depend on keys or wifi (DEC-010).
- **Provenance posture** — all generated content is visibly labelled; grounded answers cite their source (DEC-009). No learner PII beyond Clerk identity, structurally.

## Repository layout

```
app/  components/  convex/  lib/     ← Sprint 001 app (see sprint blueprint.md for full tree)
planning/                            ← 120x Operators Kit Architect Pack (source of truth for scope)
docs/                                ← this file + legacy team brief
backend/ frontend/ shared/ docker/ data/   ← legacy scaffold, FROZEN per DEC-012
```

The authoritative, detailed blueprint for the current sprint is `planning/sprints/001-unified-hackathon-demo/blueprint.md`.
