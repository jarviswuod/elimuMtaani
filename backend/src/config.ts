import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: required('DATABASE_URL', 'postgres://elimu:elimu@localhost:5432/elimu'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  /**
   * The teacher cannot verify what we generate, so quality is a safety property here.
   * Do not downgrade this to save money — use the cache instead.
   */
  model: process.env.ELIMU_MODEL ?? 'claude-opus-5',

  /** When true, generators return fixtures instead of calling the API. Keeps the demo cheap. */
  useFixtures: process.env.ELIMU_USE_FIXTURES === 'true',
} as const;

export const VERSION = '0.1.0';
