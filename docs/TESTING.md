# elimuMtaani — Testing Guide

## Test runner

All tests use **Playwright**. There is no separate Jest / Vitest setup.

```bash
cd web
npx playwright test               # all projects (logic + e2e)
npx playwright test --project=logic   # pure-function tests only (fast, no browser)
npx playwright test --project=e2e     # browser E2E only
npx playwright test --grep @external  # KICD link health only (requires internet)
```

## Projects

| Project | Match | Browser | Notes |
|---|---|---|---|
| `logic` | `tests/logic/**/*.spec.ts` | none | Pure TS imports — runs in process |
| `e2e` | `tests/e2e/**/*.spec.ts` | Chromium | Requires dev server |

The `webServer` config auto-starts `npm run dev` on port 3000 before the e2e suite runs. On CI set `CI=true` to disable the reuse-existing-server flag.

## Test files

### `tests/logic/streak.spec.ts`
Tests `computeStreak()` from `lib/streak.ts` — edge cases: empty, single day, consecutive, gap, duplicate, stale.

### `tests/logic/kicd.spec.ts`
Tests the KICD link catalogue from `lib/kicd.ts` — field validation, unique IDs, search function.

### `tests/e2e/public.spec.ts`
- Landing page renders with title + demo section
- Header "About" link navigates to `/about`
- `/about` renders CBC content
- `/teacher` and `/student` redirect unauthenticated users

### `tests/e2e/kicd-links.spec.ts`
Tagged `@external` — makes real HTTP requests to `kicd.ac.ke`. Each URL in `lib/kicd.ts` must return < 500. Skips gracefully when offline.

## Adding tests

1. Logic tests go in `tests/logic/`. Import directly from `lib/` or `convex/`.
2. E2E tests go in `tests/e2e/`. Use the Playwright `page` fixture.
3. Tests that require internet access: tag with `@external` in the test name.

## CI

Add to GitHub Actions:
```yaml
- run: npx playwright install chromium
- run: npx playwright test --project=logic
- run: npx playwright test --project=e2e
```
