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

function toNum(v: any): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function mapPerf(
  year: number,
  month: number,
  metrics: Record<string, any>,
  districtName: string,
  stateName: string
) {
  return {
    month: String(month),
    year,
    districtName,
    stateName,
    jobCardsIssued: toNum(
      metrics['Total_No_of_Active_Job_Cards'] ??
      metrics['Total_No_of_JobCards_issued'] ??
      metrics['Total_No_of_Job_Cards']
    ),
    jobCardsWithEmployment: toNum(metrics['Total_Households_Worked']),
    employmentProvided: toNum(metrics['Total_Individuals_Worked']),
    personDaysGenerated: toNum(metrics['Persondays_of_Central_Liability_so_far']),
    averageDaysPerHousehold: toNum(metrics['Average_days_of_employment_provided_per_Household']),
    totalExpenditureCrores: toNum(metrics['Total_Exp']),
    wageExpenditureCrores: toNum(metrics['Wages'] ?? metrics['wagesPaid']),
    materialExpenditureCrores: toNum(metrics['Material_and_skilled_Wages']),
    worksCompleted: toNum(metrics['Number_of_Completed_Works'] ?? metrics['workCompleted']),
    worksInProgress: toNum(metrics['Number_of_Ongoing_Works']),
    scWorkers: toNum(metrics['SC_workers_against_active_workers']),
    stWorkers: toNum(metrics['ST_workers_against_active_workers']),
    womenWorkers: toNum(metrics['Women_Persondays']),
    performanceScore: typeof metrics.performanceScore === 'number'
      ? metrics.performanceScore
      : toNum(metrics['Average_days_of_employment_provided_per_Household']),
  };
}

router.get(
  '/',
  cache(1209600),
  wrap(async (req, res, next) => {
    try {
      const list = await prisma.district.findMany({
        select: {
          id: true,
          districtName: true,
          stateName: true,
          stateCode: true,
        },
        orderBy: { districtName: 'asc' },
      });
      const data = list.map((d) => ({
        id: d.id,
        name: d.districtName,
        state: d.stateName,
        stateCode: d.stateCode,
      }));
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (err) {
      next(err);
    }
  })
);
router.get(
  '/current',
  cache(172800),
  wrap(async (req, res, next) => {
    try {
      // Find latest year & month across all records
      const latest = await prisma.monthlyPerformance.findFirst({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        select: { year: true, month: true },
      });
      if (!latest) {
        res.json({ success: true, data: [], timestamp: new Date().toISOString() });
        return;
      }
      const { year, month } = latest;
      // Get all performances for the latest month/year
      const recs = await prisma.monthlyPerformance.findMany({
        where: { year, month },
        include: { district: { select: { districtName: true, stateName: true } } },
      });
      const data = recs.map((r) =>
        mapPerf(r.year, r.month, r.metrics as Record<string, any>, r.district.districtName, r.district.stateName)
      );
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (err) {
      next(err);
    }
  })
);

const historyQuerySchema = z.object({ months: z.coerce.number().min(1).max(120).default(12) });

router.get('/:name', cache(172800), wrap(async (req, res, next) => {
  try {
    const name = normalizeDistrictName(req.params.name);
    const district = await prisma.district.findFirst({ where: { districtName: name } });
    if (!district) {
      res.status(404).json({ success: false, error: 'District not found', timestamp: new Date().toISOString() });
      return;
    }

    const record = await prisma.monthlyPerformance.findFirst({
      where: { districtId: district.id },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    if (!record) {
      res.status(404).json({ success: false, error: 'Performance data not found', timestamp: new Date().toISOString() });
      return;
    }
    // Flatten metrics JSON to response shape
    const perf = mapPerf(
      record.year,
      record.month,
      record.metrics as Record<string, any>,
      district.districtName,
      district.stateName
    );
    res.json({ success: true, data: perf, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}));

router.get('/:name/history', cache(172800), validate(historyQuerySchema, 'query'), wrap(async (req, res, next) => {
  try {
    const name = normalizeDistrictName(req.params.name);
    const { months } = req.query as any;
    const district = await prisma.district.findFirst({ where: { districtName: name } });
    if (!district) {
      res.status(404).json({ success: false, error: 'District not found', timestamp: new Date().toISOString() });
      return;
    }

    // Fetch all historical records for this district
    const raw = await prisma.monthlyPerformance.findMany({
      where: { districtId: district.id },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
    // Build continuous series of 'months' length
    const seriesRaw = fillSeries(raw, months as number);
    // Map raw series to flat MonthlyPerformance objects
    const records = seriesRaw.map((rec: any) => {
      const metrics = rec.metrics || {};
      return mapPerf(rec.year, rec.month, metrics, district.districtName, district.stateName);
    });
    // Compute date range strings
    const startDate = `${seriesRaw[0].year}-${String(seriesRaw[0].month).padStart(2, '0')}-01`;
    const last = seriesRaw[seriesRaw.length - 1];
    const endDate = `${last.year}-${String(last.month).padStart(2, '0')}-01`;
    res.json({ success: true, data: { records, startDate, endDate }, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}));

router.get('/:name/compare', cache(172800), wrap(async (req, res, next) => {
  try {
    const name = normalizeDistrictName(req.params.name);
    const district = await prisma.district.findFirst({ where: { districtName: name } });
    if (!district) {
      res.status(404).json({ success: false, error: 'District not found', timestamp: new Date().toISOString() });
      return;
    }

    // Latest performance record
    const perfRec = await prisma.monthlyPerformance.findFirst({
      where: { districtId: district.id },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    if (!perfRec) {
      res.status(404).json({ success: false, error: 'Performance data not found', timestamp: new Date().toISOString() });
      return;
    }
    const { year, month } = perfRec;
    // Map district performance
    const districtPerf = mapPerf(year, month, perfRec.metrics as Record<string, any>, district.districtName, district.stateName);
    // Fetch all records for same month/year for state and national
    const stateRecs = await prisma.monthlyPerformance.findMany({
      where: { year, month, district: { stateCode: district.stateCode } },
      select: { metrics: true },
    });
    const nationalRecs = await prisma.monthlyPerformance.findMany({
      where: { year, month },
      select: { metrics: true },
    });
    // Compute averages across metrics
    const averageMetrics = (recs: { metrics: any }[]) => {
      const sums: Record<string, number> = {};
      const counts: Record<string, number> = {};
      for (const r of recs) {
        const m = r.metrics;
        if (m && typeof m === 'object') {
          for (const key in m) {
            const val = m[key];
            if (typeof val === 'number') {
              sums[key] = (sums[key] || 0) + val;
              counts[key] = (counts[key] || 0) + 1;
            }
          }
        }
      }
      const avg: Record<string, number> = {};
      for (const key in sums) {
        avg[key] = sums[key] / counts[key];
      }
      return avg;
    };
    const stateAvgMetrics = averageMetrics(stateRecs);
    const nationalAvgMetrics = averageMetrics(nationalRecs);
    const statePerf = mapPerf(year, month, stateAvgMetrics, 'State Average', district.stateName);
    const nationalPerf = mapPerf(year, month, nationalAvgMetrics, 'National Average', 'India');
    res.json({ success: true, data: { district: districtPerf, stateAverage: statePerf, nationalAverage: nationalPerf }, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}));

export default router;