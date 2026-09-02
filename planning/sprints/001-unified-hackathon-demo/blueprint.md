# blueprint.md — Sprint 001: Unified Hackathon Demo

## Architecture

Feature-sliced Next.js (App Router) app with **Convex as backend-for-frontend** (DEC-002/003). All AI/TTS/ingestion calls live in Convex **actions**; UI reads via realtime Convex **queries**. Clerk provides Google-only auth; role gating via route groups + a `users` table.

```
Browser (Next.js on Vercel)
  │  Clerk session (Google OAuth)
  ▼
Convex
  ├─ queries/mutations  ← realtime UI state (lectures, timetables, sessions, leaderboard)
  └─ actions            ← external calls: Claude API, TTS, KICD fetch, YT transcript
        │
        ├─ Claude claude-opus-4-8   (outline/script/slides, timetable — structured output, zod)
        ├─ Claude claude-haiku-4-5  (quiz feedback, simplified review)
        ├─ Claude plain messages + citations (research-grounded answers — DEC-011)
        └─ TTS: SpeechSynthesis (client) now → Magpie Zeroshot later (Q-001)
```

## Directory layout (new app; legacy scaffold untouched per DEC-012)

```
app/                                # Next.js App Router root (Builder may use web/ — record choice in DECISIONS.md)
  (marketing)/page.tsx              # landing page (frontend-design skill, last)
  onboarding/page.tsx               # one-time role picker
  student/
    page.tsx                        # topic input + my lectures
    lecture/[id]/page.tsx           # SlidePlayer mode=live + chat + quiz
    review/page.tsx                 # browse teacher sessions
    review/[sessionId]/page.tsx     # SlidePlayer mode=review (read-only, AI banner)
  teacher/
    page.tsx                        # dashboard: research → timetable entry
    research/page.tsx               # source intake (pasted | kicd | youtube)
    timetable/[id]/page.tsx         # weeks×days grid; day → deliver
    session/[dayRef]/page.tsx       # live delivery: SlidePlayer + post-session quiz + revisit flag
    leaderboard/page.tsx
  middleware.ts                     # Clerk auth + role route-group gating (RISK-004)
components/
  SlidePlayer.tsx                   # ONE renderer, mode: 'live' | 'review' (RISK-007)
  QuizCard.tsx  ChatPanel.tsx  ProgressNarrator.tsx  GeneratedBadge.tsx
convex/
  schema.ts                         # tables below
  users.ts                          # getOrCreate(clerkId), setRole
  lectures.ts                       # queries/mutations
  timetables.ts  sessions.ts  leaderboard.ts
  actions/
    generateLecture.ts              # topic|day → outline+script+slides (opus-4-8, zod structured output)
    generateTimetable.ts            # researchSource → weeks JSON (ONE call, zod, RISK-006 bounds + post-validation)
    generateQuiz.ts                 # lecture → questions (opus-4-8); feedback (haiku-4-5)
    chat.ts                         # lecture-scoped multi-turn (plain messages)
    research.ts                     # ingest: pasted (must) | kicd fetch/PDF parse | yt transcript (stretch)
    askWithSource.ts                # citations-enabled plain messages path (DEC-011)
    tts.ts                          # synthesize(text) → audioRef; SpeechSynthesis marker now, Magpie later
  fixtures/                         # sample lecture/timetable/quiz JSON (DEC-010)
lib/
  claude.ts                         # Anthropic SDK wrapper: zodOutputFormat, model consts (DEC-008), fixtures switch
  slides.ts                         # slide JSON schema (zod) — the frozen contract both renderers share
```

## Convex schema (tables)

```ts
users:           { clerkId: string, role: 'student'|'teacher', displayName: string }
lectures:        { topic: string, outline: string[], script: string, slides: Slide[],  // Slide = {title, bullets[], visual?, narration}
                   audioRef?: Id<_storage>, source: 'open'|'cbc',
                   timetableRef?: {timetableId, weekIdx, dayIdx}, deliveredBy?: Id<users>, createdBy: Id<users> }
chatMessages:    { lectureId: Id<lectures>, role: 'user'|'assistant', body: string }
quizzes:         { lectureId: Id<lectures>, questions: {q, options[4], answerIdx, explanation}[], score?: number, takenBy?: Id<users> }
researchSources: { teacherId: Id<users>, kind: 'kicd'|'youtube'|'pasted', title: string, originUrl?: string,
                   extractedText: string, grade: string, subject: string, term: number }
timetables:      { teacherId: Id<users>, researchSourceId: Id<researchSources>, grade, subject, term,
                   weeks: {days: {topic, objective, lectureId?: Id<lectures>}[]}[] }
sessions:        { timetableId: Id<timetables>, weekIdx: number, dayIdx: number, lectureId: Id<lectures>,
                   quizScore: number, revisitFlag: boolean, deliveredAt: number }
```

Indexes: `users.by_clerkId`, `lectures.by_createdBy`, `chatMessages.by_lectureId`, `sessions.by_timetableId`, `timetables.by_teacherId`.

## Key flows

1. **Student lecture (US-02/03/08):** topic → `generateLecture` (one structured-output call returning outline+script+slides) → insert lecture → SlidePlayer live with SpeechSynthesis narration per slide → `generateQuiz` → grade client-side → optional `chat`.
2. **Teacher timetable (US-04/05):** research intake → `research.ts` normalizes to `extractedText` → `generateTimetable` (ONE call; zod bounds weeks≤13, days=5; deterministic pad/trim post-validation) → grid render.
3. **Delivery (US-06/07):** open day → if `lectureId` missing, `generateLecture` with day topic + research excerpt (lazy, RISK-001) → SlidePlayer live → post-session quiz → `revisitFlag = score < 60%` → optional "merge into next day" mutation (prepends topic to next day's objective).
4. **Leaderboard (US-09):** query aggregating `sessions` by teacher: count + avg score. A query, not a table.
5. **Student review (US-10):** list `sessions` → SlidePlayer `mode='review'` + `GeneratedBadge` banner; simplified text via haiku-4-5 (cached on the lecture record).

## Contracts frozen this sprint

- `Slide` JSON schema in `lib/slides.ts` (RISK-007 — both renderers depend on it).
- `synthesize(text) → audioRef` in `convex/actions/tts.ts` (Q-001 swap point).
- `ResearchSource.extractedText` as the single ingestion output (RISK-005 cut point).
