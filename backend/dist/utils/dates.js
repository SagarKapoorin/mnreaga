"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillSeries = void 0;
/**
 * Generate a continuous time series for the past `months` months (including current),
 * filling missing entries with null metrics.
 * @param records Array of records with { year, month, ... }
 * @param months Number of months to include, ending at the current month
 * @returns Array of length `months` sorted ascending by date
 */
function fillSeries(records, months) {
    // Build lookup for existing records by "year-month"
    const map = new Map();
    for (const r of records) {
        const key = `${r.year}-${r.month}`;
        map.set(key, r);
    }
    const result = new Array(months);
    // Start from current year/month
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // JS months are 0-11
    // Fill array backwards so that result[months-1] is the current month
    for (let i = months - 1; i >= 0; i--) {
        const key = `${year}-${month}`;
        if (map.has(key)) {
            result[i] = map.get(key);
        }
        else {
            result[i] = { year, month, metrics: null };
        }
        // Move to previous month
        month--;
        if (month === 0) {
            year--;
            month = 12;
        }
    }
    return result;
}
exports.fillSeries = fillSeries;
