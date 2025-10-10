"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, property) => {
    return (req, res, next) => {
        try {
            schema.parse(req[property]);
            next();
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.errors, timestamp: new Date().toISOString() });
        }
    };
};
exports.validate = validate;
