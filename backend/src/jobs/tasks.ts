import { logger } from '../utils/logger';
import { exec } from 'child_process';
import path from 'path';
import axios from 'axios';
import { retry } from '../utils/retry';
import { PrismaClient } from '@prisma/client';
import { env } from '../utils/env';

export async function runSync() {
  const apiUrl = env.DATA_GOV_API_URL;
  const apiKey = env.DATA_GOV_API_KEY;
  // If no real API configured, fallback to seed script
  if (!apiUrl || !apiKey) {
    logger.warn('DATA_GOV_API_URL or API_KEY not set; falling back to prisma:seed');
    return new Promise<void>((resolve, reject) => {
      exec(
        'npm run prisma:seed',
        { cwd: path.resolve(__dirname, '../..') },
        (error, stdout, stderr) => {
          if (error) {
            logger.error('Seed fallback failed:', stderr);
            return reject(error);
          }
          logger.info('Seed fallback complete.');
          logger.debug(stdout);
          resolve();
        }
      );
    });
  }
  logger.info('Running data sync from data.gov.in...');
  const prisma = new PrismaClient();
  try {
    // Determine latest month to sync
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    // Fetch distinct state codes and names from DB
    const states = await prisma.district.findMany({
      distinct: ['stateCode'],
      select: { stateCode: true, stateName: true }
    });
    for (const { stateCode, stateName } of states) {
      logger.info(`Fetching data for state ${stateName} (${stateCode}) for ${year}-${month}`);
      const params: Record<string, any> = {
        'api-key': apiKey,
        limit: 5000,
        format: 'json',
        // Filter by state name and financial year as per API spec
        'filters[state_name]': stateName,
        'filters[fin_year]': year,
        'filters[month]': month,
      };
      // Fetch data with retry/backoff
      const response = await retry(() => axios.get(apiUrl, { params }), 3, 1000);
      const recs: any[] = response.data?.records || [];
      for (const rec of recs) {
        const rawName = (rec.district_name || rec.districtName || rec.district) as string;
        const districtName = rawName?.trim();
        const district = await prisma.district.findFirst({ where: { districtName } });
        if (!district) {
          logger.warn(`Unknown district: ${districtName}`);
          continue;
        }
        // Extract metrics: convert numeric strings to numbers
        const metrics: Record<string, any> = {};
        for (const [key, value] of Object.entries(rec)) {
          if (['district_name', 'districtName', 'district', 'state_name', 'stateCode', 'state_code'].includes(key)) continue;
          const num = Number(value);
          metrics[key] = isNaN(num) ? value : num;
        }
        await prisma.monthlyPerformance.upsert({
          where: { districtId_year_month: { districtId: district.id, year, month } },
          create: { districtId: district.id, year, month, metrics },
          update: { metrics },
        });
      }
    }
    logger.info('Data sync from data.gov.in complete.');
  } catch (err: any) {
    logger.error('Error during data sync:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Pre-warm cache for states, districts, and compare endpoints.
 */
export async function warmCaches() {
  logger.info('Warming cache for hot endpoints...');
  try {
    const port = process.env.PORT || 5000;
    const base = `http://localhost:${port}/api`;
    // Warm states list
    await axios.get(`${base}/states`);
    // Fetch districts per state
    const statesRes = await axios.get(`${base}/states`);
    const states: { stateCode: string }[] = statesRes.data.data;
    const districts: string[] = [];
    for (const { stateCode } of states) {
      const distRes = await axios.get(`${base}/states/${stateCode}/districts`);
      const list: string[] = distRes.data.data;
      districts.push(...list);
    }
    // Limit warming to first 20 districts
    const hotDistricts = districts.slice(0, 20);
    for (const name of hotDistricts) {
      await axios.get(`${base}/districts/${encodeURIComponent(name)}`);
      await axios.get(`${base}/districts/${encodeURIComponent(name)}/history`);
      await axios.get(`${base}/districts/${encodeURIComponent(name)}/compare`);
    }
    logger.info('Cache warming complete.');
  } catch (err) {
    logger.error('Cache warming error', err);
  }
}