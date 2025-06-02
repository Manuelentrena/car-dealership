import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import logger from '../config/winston.config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let errorText = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorText =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as any).message
          : String(res);
    } else if (exception instanceof Error) {
      // 🔴 Errores personalizados del fileFilter
      status = 400;
      errorText = exception.message;
    }

    logger.error(`HTTP ${status} | ${new Date().toISOString()} | ${errorText}`);

    response.status(status).json({
      statusCode: status,
      message: errorText,
      timestamp: new Date().toISOString(),
    });
  }
}
