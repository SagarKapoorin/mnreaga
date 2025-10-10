"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load and validate environment variables
const env_1 = require("./utils/env");
const app_1 = __importDefault(require("./app"));
const scheduler_1 = require("./jobs/scheduler");
const logger_1 = require("./utils/logger");
const cache_1 = require("./utils/cache");
const http_1 = __importDefault(require("http"));
const port = env_1.env.PORT;
// Create HTTP server for graceful shutdown
const server = http_1.default.createServer(app_1.default).listen(port, () => {
    logger_1.logger.info(`Server running on port ${port}`);
    (0, scheduler_1.startScheduler)();
});
// Graceful shutdown
const shutdown = () => {
    logger_1.logger.info('Shutdown signal received, closing server...');
    server.close(() => {
        logger_1.logger.info('HTTP server closed');
        cache_1.redis.quit(() => logger_1.logger.info('Redis client disconnected'));
        process.exit(0);
    });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
