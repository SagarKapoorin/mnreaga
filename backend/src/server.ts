// Load and validate environment variables
import { env } from './utils/env';

import app from './app';
import { startScheduler } from './jobs/scheduler';
import { logger } from './utils/logger';
import { redis } from './utils/cache';
import http from 'http';

const port = env.PORT;
// Create HTTP server for graceful shutdown
const server = http.createServer(app).listen(port, () => {
  logger.info(`Server running on port ${port}`);
  startScheduler();
});

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutdown signal received, closing server...');
  server.close(() => {
    logger.info('HTTP server closed');
    redis.quit(() => logger.info('Redis client disconnected'));
    process.exit(0);
  });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);