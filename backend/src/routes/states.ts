import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { cache } from '../utils/cache';
import { wrap } from '../utils/asyncHandler';
const router = Router();

// GET /api/states
router.get('/', cache(21600), wrap(async (req, res, next) => {
  try {
    const states = await prisma.district.findMany({
      distinct: ['stateCode'],
      select: { stateCode: true, stateName: true },
    });
    res.json({ success: true, data: states, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}));

// GET /api/states/:stateCode/districts
router.get('/:stateCode/districts', cache(3600), wrap(async (req, res, next) => {
  try {
    const { stateCode } = req.params;
    const districts = await prisma.district.findMany({
      where: { stateCode },
      select: { districtName: true },
    });
    res.json({ success: true, data: districts.map(d => d.districtName), timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}));

export default router;