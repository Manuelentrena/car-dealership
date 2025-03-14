import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';

const logPath =
  process.env.NODE_ENV === 'production'
    ? '/var/www/app/logs/error.log'
    : 'logs/error.log';

const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      filename: logPath,
      level: 'error',
    }),
  ],
});

export default logger;
