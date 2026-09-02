import cors from 'cors';
import express from 'express';
import { config, VERSION } from './config.js';
import { dbHealthy } from './db/pool.js';
import { curriculumRouter } from './modules/curriculum/routes.js';
import { packsRouter } from './modules/packs/routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', async (_req, res) => {
    const db = (await dbHealthy()) ? 'up' : 'down';
    res.json({ ok: true, db, version: VERSION });
  });

  app.use('/api', curriculumRouter);
  app.use('/api', packsRouter);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'internal_error', detail: err.message });
  });

  return app;
}
