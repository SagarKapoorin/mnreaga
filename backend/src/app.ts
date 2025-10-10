import express from 'express';
import client from 'prom-client';
import { randomUUID } from 'crypto';
import cors from './cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health';
import statesRouter from './routes/states';
import districtsRouter from './routes/districts';
import { errorHandler } from './utils/errorHandler';

const app = express();
// Prometheus metrics
client.collectDefaultMetrics({ prefix: 'mgnrega_' });
// /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
// Assign a unique request ID to each request
app.use((req, res, next) => {
  const requestId = randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

app.use(helmet());
app.use(cors);
// Request logging with correlation ID
morgan.token('id', (req, res) => (res as any).locals.requestId);
app.use(
  morgan(
    ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
  )
);
app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

app.use('/api/health', healthRouter);
app.use('/api/states', statesRouter);
app.use('/api/districts', districtsRouter);

app.use(errorHandler);

export default app;