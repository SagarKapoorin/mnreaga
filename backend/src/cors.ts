import cors from 'cors';
import { env } from './utils/env';

const allowedOrigins = env.ALLOWED_ORIGINS.split(',').filter(Boolean);

export default cors({
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});