"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const crypto_1 = require("crypto");
const cors_1 = __importDefault(require("./cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const health_1 = __importDefault(require("./routes/health"));
const states_1 = __importDefault(require("./routes/states"));
const districts_1 = __importDefault(require("./routes/districts"));
const errorHandler_1 = require("./utils/errorHandler");
const app = (0, express_1.default)();
// Prometheus metrics
prom_client_1.default.collectDefaultMetrics({ prefix: 'mgnrega_' });
// /metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(await prom_client_1.default.register.metrics());
});
// Assign a unique request ID to each request
app.use((req, res, next) => {
    const requestId = (0, crypto_1.randomUUID)();
    res.locals.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
});
app.use((0, helmet_1.default)());
app.use(cors_1.default);
// Request logging with correlation ID
morgan_1.default.token('id', (req, res) => res.locals.requestId);
app.use((0, morgan_1.default)(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);
app.use('/api/health', health_1.default);
app.use('/api/states', states_1.default);
app.use('/api/districts', districts_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
