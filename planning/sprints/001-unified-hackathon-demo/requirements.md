# requirements.md — Sprint 001: Unified Hackathon Demo

## Goal

A single deployed web app where a **teacher** goes from one research source → term timetable → delivered narrated session → leaderboard, and a **student** goes from any topic → narrated lecture → chat → quiz, plus read-only review of teacher sessions. Demoable at every checkpoint.

## User stories (MoSCoW)

### Must have

- **US-01 (Both):** As a user, I sign in with Google (Clerk) and pick my role once (student/teacher); the app routes me to my role's home thereafter.
- **US-02 (Student):** As a student, I type any topic and get a generated lecture: outline → narrated script → synced HTML/CSS slides I can step through while narration plays (browser SpeechSynthesis acceptable).
- **US-03 (Student):** As a student, I get an auto-generated quiz after the lecture and see my score immediately.
- **US-04 (Teacher):** As a teacher, I select grade + subject + term and submit ONE research source — pasted text (must), KICD scrape or YouTube transcript (stretch).
- **US-05 (Teacher):** As a teacher, I generate a term timetable (weeks → days → topics) grounded in my research source, rendered as a grid.
- **US-06 (Teacher):** As a teacher, I open a timetable day and deliver a live narrated slide session, generated on demand via the same pipeline as US-02.
- **US-07 (Teacher):** As a teacher, I take the post-session quiz standing in for the class; a low score sets a rule-based "revisit" flag with an option to merge the topic into the next day.

### Should have

- **US-08 (Student):** As a student, I ask lecture-scoped follow-up questions in a multi-turn chat (open-topic lectures only).
- **US-09 (Teacher):** As a teacher, I see a leaderboard ranking teachers by sessions delivered and average quiz score.
- **US-10 (Student):** As a student, I browse teacher-delivered sessions and review one in a simplified read-only view (no chat, no regenerate, AI-generated banner visible).

### Could have

- **US-11:** Magpie TTS Zeroshot narration replacing SpeechSynthesis (blocked on Q-001).
- **US-12:** KICD live scrape and YouTube transcript ingestion (RISK-005 stretch).
- **US-13:** Landing page per `frontend-design` skill.

### Won't have (this sprint)

- Video encoding (DEC-001); per-learner data of any kind; lecture editing/regeneration management (Q-002); offline/PWA; multi-class per teacher; school grouping.

## Non-functional requirements

- **NFR-01:** Every checkpoint demos with `ELIMU_USE_FIXTURES=true` and zero API keys (DEC-010).
- **NFR-02:** Lecture generation p50 under ~30s with honest progress UI (never a bare spinner).
- **NFR-03:** All generated content visibly labelled AI-generated; research-grounded answers cite source title + locator (DEC-009).
- **NFR-04:** No learner PII beyond Clerk identity (DOMAIN.md invariant).
- **NFR-05:** Timetable generation is one model call; lectures generate lazily per day (RISK-001).
