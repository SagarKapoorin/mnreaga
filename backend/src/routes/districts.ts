import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../validate';
import { fillSeries } from '../utils/dates';
import { normalizeDistrictName } from '../utils/strings';
import { cache } from '../utils/cache';
import { wrap } from '../utils/asyncHandler';

const prisma = new PrismaClient();
const router = Router();

const historyQuerySchema = z.object({ months: z.coerce.number().min(1).max(120).default(12) });

router.get('/:name', cache(1800), wrap(async (req, res, next) => {
  try {
    const name = normalizeDistrictName(req.params.name);
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
  } catch (err) {
    next(err);
  }
}));

router.get('/:name/history', cache(3600), validate(historyQuerySchema, 'query'), wrap(async (req, res, next) => {
  try {
    const name = normalizeDistrictName(req.params.name);
    const { months } = req.query as any;
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

    const series = fillSeries(records, months as number);
    res.json({ success: true, data: series, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}));

// GET /api/districts/:name/compare
router.get('/:name/compare', cache(21600), wrap(async (req, res, next) => {
  try {
    const name = normalizeDistrictName(req.params.name);
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
    const averageMetrics = (records: { metrics: any }[]) => {
      const sums: Record<string, number> = {};
      const counts: Record<string, number> = {};
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
      const avg: Record<string, number> = {};
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
  } catch (err) {
    next(err);
  }
}));

export default router;