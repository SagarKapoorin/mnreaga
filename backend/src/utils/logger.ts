import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';

dotenv.config();

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});