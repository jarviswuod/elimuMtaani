/**
 * Curriculum endpoints. OWNER: Member 1 (Curriculum & Data).
 * Contract: shared/src/api.ts — do not invent routes that aren't listed there.
 */
import { Router } from 'express';
import * as repo from './repository.js';

export const curriculumRouter = Router();

curriculumRouter.get('/subjects', async (_req, res, next) => {
  try {
    res.json(await repo.listSubjects());
  } catch (err) {
    next(err);
  }
});

curriculumRouter.get('/subjects/:subjectId/strands', async (req, res, next) => {
  try {
    res.json(await repo.listStrands(req.params.subjectId));
  } catch (err) {
    next(err);
  }
});

curriculumRouter.get('/strands/:strandId/sub-strands', async (req, res, next) => {
  try {
    res.json(await repo.listSubStrands(req.params.strandId));
  } catch (err) {
    next(err);
  }
});

curriculumRouter.get('/sub-strands/:id', async (req, res, next) => {
  try {
    const detail = await repo.getSubStrandDetail(req.params.id);
    if (!detail) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.json(detail);
  } catch (err) {
    next(err);
  }
});
