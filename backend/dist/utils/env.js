"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const zod_1 = require("zod");
/**
 * Environment variable schema and validation.
 * Throws at startup if required vars are missing or invalid.
 */
const schema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    DATA_GOV_API_KEY: zod_1.z.string().optional(),
    DATA_GOV_API_URL: zod_1.z.string().url().optional(),
    SYNC_CRON: zod_1.z.string(),
    PORT: zod_1.z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), zod_1.z.number().int().positive()).default(5000),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    ALLOWED_ORIGINS: zod_1.z.string().default(''),
});
exports.env = schema.parse(process.env);
