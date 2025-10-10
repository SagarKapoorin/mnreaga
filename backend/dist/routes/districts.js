"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const validate_1 = require("../validate");
const dates_1 = require("../utils/dates");
const strings_1 = require("../utils/strings");
const cache_1 = require("../utils/cache");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const historyQuerySchema = zod_1.z.object({ months: zod_1.z.coerce.number().min(1).max(120).default(12) });
router.get('/:name', (0, cache_1.cache)(1800), (0, asyncHandler_1.wrap)(async (req, res, next) => {
    try {
        const name = (0, strings_1.normalizeDistrictName)(req.params.name);
        const district = await prisma.district.findFirst({ where: { districtName: name } });
        if (!district) {
            res.status(404).json({ success: false, error: 'District not found', timestamp: new Date().toISOString() });
            return;
        }
        const perf = await prisma.monthlyPerformance.findFirst({
            where: { districtId: district.id },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        res.json({ success: true, data: perf, timestamp: new Date().toISOString() });
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:name/history', (0, cache_1.cache)(3600), (0, validate_1.validate)(historyQuerySchema, 'query'), (0, asyncHandler_1.wrap)(async (req, res, next) => {
    try {
        const name = (0, strings_1.normalizeDistrictName)(req.params.name);
        const { months } = req.query;
        const district = await prisma.district.findFirst({ where: { districtName: name } });
        if (!district) {
            res.status(404).json({ success: false, error: 'District not found', timestamp: new Date().toISOString() });
            return;
        }
        const now = new Date();
        // TODO: calculate correct start date based on 'months'
        const records = await prisma.monthlyPerformance.findMany({
            where: { districtId: district.id },
            orderBy: [{ year: 'asc' }, { month: 'asc' }],
        });
        const series = (0, dates_1.fillSeries)(records, months);
        res.json({ success: true, data: series, timestamp: new Date().toISOString() });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/districts/:name/compare
router.get('/:name/compare', (0, cache_1.cache)(21600), (0, asyncHandler_1.wrap)(async (req, res, next) => {
    try {
        const name = (0, strings_1.normalizeDistrictName)(req.params.name);
        const district = await prisma.district.findFirst({ where: { districtName: name } });
        if (!district) {
            res.status(404).json({ success: false, error: 'District not found', timestamp: new Date().toISOString() });
            return;
        }
        // Latest performance
        const perf = await prisma.monthlyPerformance.findFirst({
            where: { districtId: district.id },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        if (!perf) {
            res.status(404).json({ success: false, error: 'Performance data not found', timestamp: new Date().toISOString() });
            return;
        }
        const { year, month } = perf;
        // Fetch all records for same month/year for state and national
        const stateRecs = await prisma.monthlyPerformance.findMany({
            where: { year, month, district: { stateCode: district.stateCode } },
            select: { metrics: true },
        });
        const nationalRecs = await prisma.monthlyPerformance.findMany({
            where: { year, month },
            select: { metrics: true },
        });
        // Compute averages
        const averageMetrics = (records) => {
            const sums = {};
            const counts = {};
            for (const r of records) {
                const m = r.metrics;
                if (m && typeof m === 'object') {
                    for (const key of Object.keys(m)) {
                        const val = m[key];
                        if (typeof val === 'number') {
                            sums[key] = (sums[key] || 0) + val;
                            counts[key] = (counts[key] || 0) + 1;
                        }
                    }
                }
            }
            const avg = {};
            for (const key of Object.keys(sums)) {
                avg[key] = sums[key] / counts[key];
            }
            return avg;
        };
        const stateAverage = averageMetrics(stateRecs);
        const nationalAverage = averageMetrics(nationalRecs);
        res.json({
            success: true,
            data: { district: perf, stateAverage, nationalAverage },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
