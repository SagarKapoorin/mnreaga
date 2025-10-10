"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const tasks_1 = require("./tasks");
const logger_1 = require("../utils/logger");
const env_1 = require("../utils/env");
const schedule = env_1.env.SYNC_CRON;
function startScheduler() {
    logger_1.logger.info(`Scheduling sync job at cron ${schedule}`);
    node_cron_1.default.schedule(schedule, async () => {
        try {
            await (0, tasks_1.runSync)();
            await (0, tasks_1.warmCaches)();
        }
        catch (err) {
            logger_1.logger.error('Error in scheduled tasks', err);
        }
    });
}
exports.startScheduler = startScheduler;
