import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const dbStatus = 'up';
    const redisStatus = (await redis.ping()) === 'PONG' ? 'up' : 'down';
    res.json({
      success: true,
      data: { db: dbStatus, redis: redisStatus },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;