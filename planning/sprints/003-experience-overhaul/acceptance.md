# acceptance.md — Sprint 003

- [ ] CP-A: every /teacher/* and /student/* page renders inside the sidebar shell; landing/About/onboarding share SiteHeader; About reachable from header; no `#7C3AED`/Inter anywhere (grep); sign-in lands on /onboarding.
- [ ] CP-B: demo teacher + demo student sign in from the landing page in one click; both dashboards show non-empty analytics from seeded data; teacher curriculum-progress ring equals seeded advanced/total ratio; revisit radar lists the seeded multi-attempt topic.
- [ ] CP-C: chat answer → "Save to notes" → appears on Notes page → edit, delete, export .md all work; mic button transcribes in Chrome and hides when unsupported; quiz read-aloud speaks; knowledge base renders every `lib/kicd.ts` link with working hrefs + research prefill.
- [ ] CP-D: `npx playwright test --project=logic` green; `--project=e2e` green keyless (fixtures); `@external` KICD link specs pass online / skip offline; README + 5 docs files read as professional documentation; TECH_DEBT.md registered.
- [ ] All checkpoints: `convex dev --once` + `next build` clean; one commit per checkpoint.
