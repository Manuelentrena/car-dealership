import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logPath =
  process.env.NODE_ENV === 'production'
    ? '/var/www/app/logs/error.log' // Winston lo interpretará como una ruta relativa dentro de /var/www/app/dist/ (porque ahí se ejecuta el código).
    : 'logs/error.log';

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
      ),
    }),
    new winston.transports.File({
      filename: logPath,
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
      ),
    }),
  ],
});

export default logger;
