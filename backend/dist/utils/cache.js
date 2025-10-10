"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.cache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
// Single shared Redis client for caching
const redis = new ioredis_1.default(process.env.REDIS_URL);
exports.redis = redis;
/**
 * Caching middleware: checks Redis for cached response and returns if found,
 * otherwise captures the JSON response and stores it with TTL.
 * @param ttlSeconds Time to live in seconds
 */
function cache(ttlSeconds) {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        try {
            const cached = await redis.get(key);
            if (cached) {
                res.setHeader('X-Cache', 'HIT');
                res.json(JSON.parse(cached));
                return;
            }
            // Override res.json to cache the result
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                redis.set(key, JSON.stringify(body), 'EX', ttlSeconds);
                res.setHeader('X-Cache', 'MISS');
                return originalJson(body);
            };
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
exports.cache = cache;
