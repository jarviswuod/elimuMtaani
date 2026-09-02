# QUESTIONS.md — elimuMtaani

Format: Q-NNN — question — status — owner — what unblocks it.

| ID | Question | Status | Notes |
|---|---|---|---|
| Q-001 | **Magpie TTS Zeroshot contract:** endpoint, auth scheme, request/response shape, voice cloning input, latency, rate limits, pricing? | **OPEN — main blocker for real TTS** | Not build-blocking: `convex/tts.ts` exposes `synthesize(text) → audioRef` and Checkpoints 1–3 implement it with browser `SpeechSynthesis` (client-side, zero cost). Swap to Magpie at Checkpoint 4 once the contract is verified. Fallbacks in order: Magpie → pre-generated fixture audio → SpeechSynthesis. |
| Q-002 | **Post-hackathon teacher lecture-management scope:** edit/regenerate slides, reorder timetable days, multi-class, school grouping? | OPEN — deferred | For the post-hackathon Architect session. Roadmap seeds listed in `DOMAIN.md`. |
| Q-003 | **What happens to the legacy Express/Postgres scaffold** (`backend/`, `frontend/`, `shared/`)? | OPEN — deferred | Frozen this sprint per DEC-012. Post-hackathon: delete, or archive to a `legacy/` branch. |
