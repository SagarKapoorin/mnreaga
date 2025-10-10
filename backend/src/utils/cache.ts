import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';

// Single shared Redis client for caching
const redis = new Redis(process.env.REDIS_URL);

/**
 * Caching middleware: checks Redis for cached response and returns if found,
 * otherwise captures the JSON response and stores it with TTL.
 * @param ttlSeconds Time to live in seconds
 */
export function cache(ttlSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
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
      res.json = (body: any) => {
        redis.set(key, JSON.stringify(body), 'EX', ttlSeconds);
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}

// Expose redis for warming caches
export { redis };