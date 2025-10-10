"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
/**
 * Retry helper: invokes an async function up to `retries` times with exponential backoff.
 * @param fn Async function to execute
 * @param retries Number of attempts (default: 3)
 * @param delayMs Initial delay in milliseconds (default: 500)
 */
async function retry(fn, retries = 3, delayMs = 500) {
    let attempt = 0;
    let error;
    while (attempt < retries) {
        try {
            return await fn();
        }
        catch (err) {
            error = err;
            attempt++;
            if (attempt < retries) {
                await new Promise((res) => setTimeout(res, delayMs * Math.pow(2, attempt - 1)));
            }
        }
    }
    throw error;
}
exports.retry = retry;
