# Tech Debt Register

Tracked items for post-launch remediation. Severity: 🔴 High · 🟡 Medium · 🟢 Low.

| ID | Title | Severity | Owner | Target |
|---|---|---|---|---|
| TD-001 | Full-table scan in leaderboard query | 🟡 | backend | Q4-2026 |
| TD-002 | `sessions.forDay` linear scan (no index on `deliveredAt`) | 🟡 | backend | Q4-2026 |
| TD-003 | Chat messages unpaginated — will blow up for long sessions | 🟡 | backend | Q4-2026 |
| TD-004 | `any` type in `sessions.requireTeacher` auth guard | 🟢 | backend | Q1-2027 |
| TD-005 | Stale `frontend/ shared/` scaffold directories (never migrated content) | 🟢 | infra | Q4-2026 |
| TD-006 | Magpie Q-001: voice AI provider decision pending (Web Speech vs. paid TTS) | 🟡 | product | Q1-2027 |
| TD-007 | KICD scrape RISK-005: kicd.ac.ke has no public API; URL structure may change | 🟡 | product | ongoing |
| TD-008 | `computeStreak` reads `_creationTime` only — no way to backfill timestamps | 🟢 | backend | Q1-2027 |
| TD-009 | Clerk app name typo in dashboard (cosmetic) | 🟢 | infra | anytime |
| TD-010 | `notesView` has no pagination — all notes fetched on load | 🟢 | frontend | Q1-2027 |

## Notes

- **TD-001 / TD-002**: Leaderboard and session analytics do `collect()` on large tables. Add composite indexes when row counts exceed ~10k.
- **TD-003**: `chat.forLecture` returns all messages. Add cursor-based pagination before going live at scale.
- **TD-005**: `frontend/`, `shared/`, `backend/`, `data/`, `docker/` directories at the repo root are scaffold remnants. `backend/`, `data/`, `docker/` were deleted locally but not committed. Safe to remove in a cleanup PR.
- **TD-007**: KICD link health tests (`@external`) catch URL regressions automatically. When a link breaks, update `lib/kicd.ts`.
