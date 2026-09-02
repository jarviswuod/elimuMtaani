# DOMAIN.md — elimuMtaani

## Domain

AI-assisted teaching and self-directed learning for Kenya's Competency-Based Curriculum (CBC), delivered as narrated slide "lectures" generated on demand.

## Glossary (Kenya CBC context)

| Term | Meaning |
|---|---|
| CBC | Competency-Based Curriculum — Kenya's national curriculum framework |
| KICD | Kenya Institute of Curriculum Development — publishes official curriculum designs |
| Curriculum design | KICD document stating learning **outcomes** per grade/subject (states *what*, never the *content*) |
| Grade | Class level (e.g. Grade 10). One teacher ↔ one class group per timetable |
| Term | School term (3 per year, ~13 weeks; ~8 teaching weeks ≈ 40 teaching days) |
| Strand / sub-strand | KICD's topic hierarchy within a subject |
| Lecture | In this app: a generated outline + narrated script + synced HTML/CSS slides (+ audio ref). Never encoded video (DEC-001) |
| Session | A teacher-delivered lecture occurrence with a post-session quiz score and revisit flag |
| Revisit flag | Rule-based: quiz score below threshold → "revisit" suggested; teacher may merge the topic into the next timetable day |
| Game-based learning | An optional branch of the lesson pack: a teacher-facilitated, classroom-only game (chalkboard, teams, physical space) with real game mechanics — turns, a challenge, a win condition. Library-matched first, generated only if nothing fits (DEC-015/016/018) |
| Understanding gate | The loop that connects topics: topic delivered → short follow-up quiz → whole-class teacher judgment → advance, or review/game-replay → re-quiz. The system prepares the quiz; the teacher makes the call; no individual learner is ever tracked (DEC-017) |

## Entities

| Entity | Identity | Key fields | Notes |
|---|---|---|---|
| **User** | Clerk `clerkId` | role: `student` \| `teacher` | Role chosen once at onboarding. No PII stored beyond what Clerk holds |
| **Lecture** | Convex id | topic, outline, script, slides (JSON), audioRef?, source: `open` \| `cbc`, timetableRef?, deliveredBy?, createdBy | `cbc` lectures are timetable-day-linked; `open` lectures are student self-serve |
| **ChatMessage** | Convex id | lectureId, role: `user` \| `assistant`, body | Only on student `open` lectures |
| **Quiz** | Convex id | lectureId, questions (JSON: q, options, answerIdx, explanation), score?, takenBy? | Auto-generated with the lecture; graded client-side against stored answers |
| **ResearchSource** | Convex id | teacherId, kind: `kicd` \| `youtube` \| `pasted`, title, originUrl?, extractedText, grade, subject, term | Exactly one source grounds one timetable (narrowed scope, DEC-004) |
| **Timetable** | Convex id | teacherId, grade, subject, term, weeks (JSON: week → days → {topic, objective, lectureId?}) | Generated once per research cycle, structured output (RISK-006) |
| **Session** | Convex id | timetableId, weekIdx, dayIdx, lectureId, attempts[] (quizScore, classReady, reviewAction), status: open\|advanced, deliveredAt | Feeds the leaderboard; attempts are the understanding-gate loop (Sprint 002 evolves the Sprint-001 single quizScore/revisitFlag) |
| **GameLibraryEntry** | Convex id | name, thinkingType: recall\|application, materials[] (allowlist-only), playersAtOnce, durationMinutes, mechanics {turns, challenge, winCondition}, tags[], timesUsed, worked, didntWork | General-purpose (not per-subject, DEC-015); each entry reads as real game rules (DEC-016) |
| **Game** (on Lecture) | embedded | source: library\|generated, libraryEntryId?, name, setup, rules[], mechanics, materials[], durationMinutes, groupPlan, teacherReviewed? | One more section of the lesson pack; teacher-facilitated, classroom-only (DEC-018) |

## Invariants

- No learner PII beyond the Clerk identity. No marks tied to real student names, no attendance, no photos. Sessions store the *teacher's* stand-in quiz score only.
- **No learner ever logs into anything; no digital surface a learner touches.** Games are teacher-facilitated physical play; the understanding gate stores only aggregate scores and the teacher's whole-class judgment (DEC-017/018). If a feature needs "a learner logs in" or "the system records who won," it doesn't belong here.
- Every generated artifact is labelled generated (provenance posture carried from the prior scaffold, DEC-009); research answers cite their source.
- A Lecture is self-contained render data (slides JSON + script); both renderers (teacher live, student review) read the same record (RISK-007).

## Post-hackathon roadmap (not Sprint 001)

- Teacher lecture management: edit/regenerate slides, reorder timetable days, multi-class support (Q-002)
- Real class delivery analytics (aggregate, never per-learner)
- Offline/PWA support for classroom delivery without internet (pattern exists in the legacy scaffold)
- Automated KICD ingestion across all grades/subjects; YouTube transcript ingestion if cut from Sprint 001
- Magpie TTS Zeroshot production integration + voice selection (pending Q-001)
- Richer leaderboard (streaks, coverage %) and school-level grouping
