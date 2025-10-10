"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap = void 0;
/**
 * Wraps an async route handler to catch errors and forward to Express error handler.
 * Ensures proper RequestHandler typing (returns void).
 */
function wrap(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
exports.wrap = wrap;
