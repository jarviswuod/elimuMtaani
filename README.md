# Elimu — Mwalimu wa Grade 10

Night-before teaching packs for a Grade 10 teacher preparing a strand she was never
trained for, with no textbook and no internet in the room.

Built online at night. Used entirely offline in the classroom. Holds no learner data.

## The one-sentence version

Turn a KICD curriculum design — which states *outcomes* but never the *content* — into a
teachable 40 minutes she understands, can deliver with chalk to 50 learners, and can defend
to a quality assurance officer.

## The rule that shapes every decision

**She cannot verify our output.** Nobody in that room can. So provenance matters more than
polish: every line in a pack either traces to the design document with a page number, or is
visibly labelled as generated. A confident falsehood taught to fifty children is the failure
mode this project exists to prevent.

## Start it

```bash
cp .env.example .env          # add ANTHROPIC_API_KEY
npm install                   # workspaces: shared, backend, frontend
npm run up                    # docker compose: postgres + backend + frontend
npm run migrate               # apply backend/db/migrations
npm run seed                  # load data/curriculum/*.json
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health
- Sample pack (works before anything else is built): http://localhost:4000/api/packs/sample

Set `ELIMU_USE_FIXTURES=true` while building UI so hot reloads don't burn API credits.

## Layout

```
shared/     FROZEN contracts — types shared by backend and frontend
backend/    Express + Postgres. Three modules: curriculum, generation, packs
frontend/   React PWA. Offline-first, print-first
docker/     compose + Dockerfiles + postgres init
data/       hand-entered curriculum corpus (the grounding source)
docs/       team brief
```

## Ownership

| Directory | Owner |
|---|---|
| `data/curriculum/`, `backend/db/`, `backend/src/modules/curriculum/` | Member 1 — Curriculum & Data |
| `backend/src/modules/generation/` | Member 2 — Generation Engine |
| `backend/src/modules/packs/` | Member 3 — Pack API, Cache & Export |
| `frontend/src/features/`, `frontend/src/api/`, `frontend/src/components/` | Member 4 — Prep Flow |
| `frontend/src/offline/`, `frontend/src/print/`, `frontend/public/` | Member 5 — Offline, Print & Share |
| `shared/`, `docker/`, root configs | **Frozen** — changes need a group decision |

Stay in your own directories. Need something in someone else's? Ask them — don't reach in.
Full brief with per-member features: [docs/Elimu-Team-Brief.pdf](docs/Elimu-Team-Brief.pdf).

## Four things we are deliberately not building

- **No learner-facing anything.** No child logs in. There is no student table in the schema
  and there must never be one — it's a structural property, not a policy promise.
- **No vector database or embeddings.** The corpus is a few dozen sub-strands. It's a JSON
  file. Chunked-PDF retrieval would also break our citations, which is the whole product.
- **No PDF parser.** Hand-enter the curriculum. See `data/curriculum/README.md`.
- **No on-device model.** "No internet in the room" is not "no internet ever". She preps at
  home on data; the *artifact* is what goes offline.
