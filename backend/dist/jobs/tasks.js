"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warmCaches = exports.runSync = void 0;
const logger_1 = require("../utils/logger");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const retry_1 = require("../utils/retry");
const client_1 = require("@prisma/client");
const env_1 = require("../utils/env");
async function runSync() {
    const apiUrl = env_1.env.DATA_GOV_API_URL;
    const apiKey = env_1.env.DATA_GOV_API_KEY;
    // If no real API configured, fallback to seed script
    if (!apiUrl || !apiKey) {
        logger_1.logger.warn('DATA_GOV_API_URL or API_KEY not set; falling back to prisma:seed');
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)('npm run prisma:seed', { cwd: path_1.default.resolve(__dirname, '../..') }, (error, stdout, stderr) => {
                if (error) {
                    logger_1.logger.error('Seed fallback failed:', stderr);
                    return reject(error);
                }
                logger_1.logger.info('Seed fallback complete.');
                logger_1.logger.debug(stdout);
                resolve();
            });
        });
    }
    logger_1.logger.info('Running data sync from data.gov.in...');
    const prisma = new client_1.PrismaClient();
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
            logger_1.logger.info(`Fetching data for state ${stateName} (${stateCode}) for ${year}-${month}`);
            const params = {
                'api-key': apiKey,
                limit: 5000,
                format: 'json',
                // Filter by state name and financial year as per API spec
                'filters[state_name]': stateName,
                'filters[fin_year]': year,
                'filters[month]': month,
            };
            // Fetch data with retry/backoff
            const response = await (0, retry_1.retry)(() => axios_1.default.get(apiUrl, { params }), 3, 1000);
            const recs = response.data?.records || [];
            for (const rec of recs) {
                const rawName = (rec.district_name || rec.districtName || rec.district);
                const districtName = rawName?.trim();
                const district = await prisma.district.findFirst({ where: { districtName } });
                if (!district) {
                    logger_1.logger.warn(`Unknown district: ${districtName}`);
                    continue;
                }
                // Extract metrics: convert numeric strings to numbers
                const metrics = {};
                for (const [key, value] of Object.entries(rec)) {
                    if (['district_name', 'districtName', 'district', 'state_name', 'stateCode', 'state_code'].includes(key))
                        continue;
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
        logger_1.logger.info('Data sync from data.gov.in complete.');
    }
    catch (err) {
        logger_1.logger.error('Error during data sync:', err);
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}
exports.runSync = runSync;
/**
 * Pre-warm cache for states, districts, and compare endpoints.
 */
async function warmCaches() {
    logger_1.logger.info('Warming cache for hot endpoints...');
    try {
        const port = process.env.PORT || 5000;
        const base = `http://localhost:${port}/api`;
        // Warm states list
        await axios_1.default.get(`${base}/states`);
        // Fetch districts per state
        const statesRes = await axios_1.default.get(`${base}/states`);
        const states = statesRes.data.data;
        const districts = [];
        for (const { stateCode } of states) {
            const distRes = await axios_1.default.get(`${base}/states/${stateCode}/districts`);
            const list = distRes.data.data;
            districts.push(...list);
        }
        // Limit warming to first 20 districts
        const hotDistricts = districts.slice(0, 20);
        for (const name of hotDistricts) {
            await axios_1.default.get(`${base}/districts/${encodeURIComponent(name)}`);
            await axios_1.default.get(`${base}/districts/${encodeURIComponent(name)}/history`);
            await axios_1.default.get(`${base}/districts/${encodeURIComponent(name)}/compare`);
        }
        logger_1.logger.info('Cache warming complete.');
    }
    catch (err) {
        logger_1.logger.error('Cache warming error', err);
    }
}
exports.warmCaches = warmCaches;
