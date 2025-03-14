import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logPath =
  process.env.NODE_ENV === 'production'
    ? '/var/www/app/logs/error.log'
    : 'logs/error.log';

// 📌 Formato con colores para la consola
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }),
);

// 📌 Formato sin colores para el archivo
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }),
);

const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: consoleFormat, // 🔥 Agregar formato con colores
    }),
    new winston.transports.File({
      filename: logPath,
      level: 'error',
      format: fileFormat, // 🔥 Formato sin colores para el archivo
    }),
  ],
});

export default logger;
