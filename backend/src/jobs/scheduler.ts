import cron from 'node-cron';
import { runSync, warmCaches } from './tasks';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

const schedule = env.SYNC_CRON;

export function startScheduler() {
  logger.info(`Scheduling sync job at cron ${schedule}`);
  cron.schedule(schedule, async () => {
    try {
      await runSync();
      await warmCaches();
    } catch (err) {
      logger.error('Error in scheduled tasks', err);
    }
  });
}