# elimuMtaani — Data Model

All tables live in a single Convex deployment (`fortunate-dove-790.convex.cloud`).

## Core invariants

- **R1 (No learner PII)**: No individual student score, answer, or identity is ever stored. `sessions.attempts` records aggregate class readiness judged by the teacher.
- **DEC-009 (Generated badge)**: Every AI-generated document carries a visible label.
- **NFR-30 (Read-only analytics paths)**: `analytics.ts` queries never write.

---

## Tables

### `users`
| Field | Type | Notes |
|---|---|---|
| `clerkId` | `string` | Clerk user ID — primary identity link |
| `displayName` | `string` | From Clerk profile |
| `role` | `"teacher" \| "student" \| undefined` | Set once on onboarding |

Index: `by_clerkId`

---

### `lectures`
| Field | Type | Notes |
|---|---|---|
| `topic` | `string` | Human-readable topic |
| `outline` | `string[]` | Section headings |
| `script` | `string` | Full narration script |
| `slides` | `Slide[]` | See sub-type below |
| `source` | `"open" \| "cbc"` | Open = student-generated; cbc = timetable day |
| `timetableRef` | `{timetableId, weekIdx, dayIdx}?` | For cbc lectures only |
| `deliveredBy` | `users._id?` | Teacher who delivered (cbc) |
| `createdBy` | `users._id` | Author (teacher or student) |
| `simplifiedSummary` | `string?` | Cached haiku for student review |
| `game` | `GameData?` | Teacher-facilitated game attached to this lecture |
| `audioRef` | `_storage?` | TTS audio (future) |

Sub-type `Slide`: `{ title, bullets: string[], visual?, narration }`.

Index: `by_createdBy`

---

### `gameLibrary`
General-purpose classroom game templates (not subject-specific per DEC-015).

| Field | Type |
|---|---|
| `name` | `string` |
| `thinkingType` | `"recall" \| "application"` |
| `materials` | `string[]` |
| `playersAtOnce` | `string` |
| `durationMinutes` | `number` |
| `mechanics` | `{turns, challenge, winCondition}` |
| `tags` | `string[]` |
| `timesUsed / worked / didntWork` | `number` |

Index: `by_thinkingType`

---

### `chatMessages`
| Field | Type |
|---|---|
| `lectureId` | `lectures._id` |
| `role` | `"user" \| "assistant"` |
| `body` | `string` |

Index: `by_lectureId`

---

### `quizzes`
| Field | Type | Notes |
|---|---|---|
| `lectureId` | `lectures._id` | |
| `questions` | `Question[]` | `{q, options, answerIdx, explanation}` |
| `score` | `number?` | 0–1; teacher stand-in score (not learner) |
| `takenBy` | `users._id?` | The user who graded |

Index: `by_lectureId`

---

### `researchSources`
| Field | Type |
|---|---|
| `teacherId` | `users._id` |
| `kind` | `"kicd" \| "youtube" \| "pasted"` |
| `title` | `string` |
| `originUrl` | `string?` |
| `extractedText` | `string` |
| `grade / subject / term` | `string / string / number` |

Index: `by_teacherId`

---

### `timetables`
| Field | Type |
|---|---|
| `teacherId` | `users._id` |
| `researchSourceId` | `researchSources._id` |
| `grade / subject / term` | `string / string / number` |
| `weeks` | `{ days: { topic, objective, lectureId? }[] }[]` |

Index: `by_teacherId`

---

### `sessions`
Understanding-gate records. One per timetable day delivered (DEC-017).

| Field | Type | Notes |
|---|---|---|
| `timetableId` | `timetables._id` | |
| `weekIdx / dayIdx` | `number` | Position in timetable |
| `lectureId` | `lectures._id` | Delivered lecture |
| `teacherId` | `users._id` | |
| `attempts` | `Attempt[]` | Aggregate scores only — R1 holds |
| `status` | `"open" \| "advanced"` | Advanced = class understood |
| `deliveredAt` | `number` | Unix ms |

`Attempt`: `{ quizScore: number, classReady: boolean, reviewAction?: "recap" \| "game_round" }`.

Indexes: `by_timetableId`, `by_teacherId`

---

### `notes`
NotebookLM-style user notes (CP-C, DEC-022).

| Field | Type |
|---|---|
| `userId` | `users._id` |
| `title` | `string` |
| `body` | `string` |
| `sourceType` | `"chat" \| "lecture" \| "manual"` |
| `lectureId` | `lectures._id?` |
| `topic` | `string?` |

Index: `by_userId`
