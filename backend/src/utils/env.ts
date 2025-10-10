import dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

/**
 * Environment variable schema and validation.
 * Throws at startup if required vars are missing or invalid.
 */
const schema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  DATA_GOV_API_KEY: z.string().optional(),
  DATA_GOV_API_URL: z.string().url().optional(),
  SYNC_CRON: z.string(),
  PORT: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive()
  ).default(5000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ALLOWED_ORIGINS: z.string().default(''),
});

export const env = schema.parse(process.env);