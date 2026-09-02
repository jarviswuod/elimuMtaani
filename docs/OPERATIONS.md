# elimuMtaani — Operations Guide

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL (set by `npx convex dev`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (server-side only) |
| `ANTHROPIC_API_KEY` | No | Required for live LLM calls; omit to run in fixtures mode |
| `ELIMU_USE_FIXTURES` | No | Set `"true"` to force fixtures mode even if API key is present |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Defaults to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Defaults to `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | No | Set to `/onboarding` for post-login redirect |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | No | Set to `/onboarding` |

Copy `.env.example` to `.env.local` and fill in values.

## Convex deployment

```bash
# Development (watches for changes)
npx convex dev

# One-time push (CI or after schema changes)
npx convex dev --once

# Run a mutation (e.g. seed demo data)
npx convex run seedDemo:run '{"teacherClerkId":"...","studentClerkId":"..."}'
```

## Demo accounts

Two Clerk test users pre-exist in the `elimuMtaani` Clerk app:

| Role | Email | Password |
|---|---|---|
| Teacher | `demo.teacher+clerk_test@elimumtaani.dev` | `ElimuMtaani-Demo-2026` |
| Student | `demo.student+clerk_test@elimumtaani.dev` | `ElimuMtaani-Demo-2026` |

Re-seed mock data at any time:
```bash
npx convex run seedDemo:run '{
  "teacherClerkId": "user_3Im80msH3dJWljfX3HXib6K5rxQ",
  "studentClerkId": "user_3Im814hfv2lCqkW4kuycX0gniEN"
}'
```
The seeder is idempotent — it skips if timetables already exist for the teacher.

## Fixtures mode

When `ANTHROPIC_API_KEY` is not set or `ELIMU_USE_FIXTURES=true`:
- `generateLecture`, `generateQuiz`, `generateTimetable`, `generateGame`, and chat all return data from `convex/fixtures/`.
- No external API calls are made; the app is fully functional.
- This is the default on the `fortunate-dove-790` deployment.

## Going live (removing fixtures)

1. Obtain an Anthropic API key.
2. Set `ANTHROPIC_API_KEY` in Convex environment variables (`npx convex env set ANTHROPIC_API_KEY sk-ant-...`).
3. Remove or unset `ELIMU_USE_FIXTURES`.
4. Redeploy: `npx convex dev --once`.

## Clerk setup checklist

- Password strategy enabled (required for demo accounts).
- Google OAuth enabled (primary sign-in for real users).
- Sign-in/sign-up URLs match env vars.
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/onboarding`.
