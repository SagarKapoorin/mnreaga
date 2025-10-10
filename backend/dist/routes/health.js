"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma = new client_1.PrismaClient();
const redis = new ioredis_1.default(process.env.REDIS_URL);
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        const dbStatus = 'up';
        const redisStatus = (await redis.ping()) === 'PONG' ? 'up' : 'down';
        res.json({
            success: true,
            data: { db: dbStatus, redis: redisStatus },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
