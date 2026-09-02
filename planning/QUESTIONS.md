# QUESTIONS.md — elimuMtaani

Format: Q-NNN — question — status — owner — what unblocks it.

| ID | Question | Status | Notes |
|---|---|---|---|
| Q-001 | **Magpie TTS Zeroshot contract:** endpoint, auth scheme, request/response shape, voice cloning input, latency, rate limits, pricing? | **OPEN — main blocker for real TTS** | Not build-blocking: `convex/tts.ts` exposes `synthesize(text) → audioRef` and Checkpoints 1–3 implement it with browser `SpeechSynthesis` (client-side, zero cost). Swap to Magpie at Checkpoint 4 once the contract is verified. Fallbacks in order: Magpie → pre-generated fixture audio → SpeechSynthesis. |
| Q-002 | **Post-hackathon teacher lecture-management scope:** edit/regenerate slides, reorder timetable days, multi-class, school grouping? | OPEN — deferred | For the post-hackathon Architect session. Roadmap seeds listed in `DOMAIN.md`. |
| Q-003 | **What happens to the legacy Express/Postgres scaffold** (`backend/`, `frontend/`, `shared/`)? | OPEN — deferred | Frozen this sprint per DEC-012. Post-hackathon: delete, or archive to a `legacy/` branch. |
| Q-004 | **Game library entries: tied to one subject, or general?** | **RESOLVED → general** (DEC-015) | One entry ("relay race", "team quiz") reused across many topics by swapping questions in — no per-subject libraries. |
| Q-005 | **Library coverage vs. custom generation — where does the investment go?** | OPEN — team decision | Bigger library = new-game design rarely needed (cheap, proven, but bounded variety) vs. richer generation (novel, riskier — see RISK-009). Current posture: 8 seed entries, generation as fallback; revisit after ratings data (US-25) shows how often the fallback fires and how generated games rate. |
| Q-006 | **How do we verify a new game actually works in a real classroom** (40–60 learners, zero materials)? | OPEN — main quality gap of the game branch | Sprint 002 ships the plumbing: `teacherReviewed` flag + worked/didn't-work ratings + "review before class" badge. Still needed: a defined teacher-review step before the branch is considered done (who reviews, when, against what checklist). |
| Q-007 | **How strict is the "move on" gate — "everyone got it" or "most of the class got it"?** | OPEN — teaching policy, per-teacher | The system supports, never overrides (DEC-017): strictness is a stored per-class preference (US-27) that shapes the quiz summary's recommendation only. Default suggestion: "most of the class". |
