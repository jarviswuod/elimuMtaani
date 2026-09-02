import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[elimu] backend listening on :${config.port} (${config.nodeEnv})`);
  if (config.useFixtures) console.log('[elimu] ELIMU_USE_FIXTURES=true — generators return fixtures');
});
