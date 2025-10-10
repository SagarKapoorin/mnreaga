"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const cache_1 = require("../utils/cache");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
// GET /api/states
router.get('/', (0, cache_1.cache)(21600), (0, asyncHandler_1.wrap)(async (req, res, next) => {
    try {
        const states = await prisma.district.findMany({
            distinct: ['stateCode'],
            select: { stateCode: true, stateName: true },
        });
        res.json({ success: true, data: states, timestamp: new Date().toISOString() });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/states/:stateCode/districts
router.get('/:stateCode/districts', (0, cache_1.cache)(3600), (0, asyncHandler_1.wrap)(async (req, res, next) => {
    try {
        const { stateCode } = req.params;
        const districts = await prisma.district.findMany({
            where: { stateCode },
            select: { districtName: true },
        });
        res.json({ success: true, data: districts.map(d => d.districtName), timestamp: new Date().toISOString() });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
