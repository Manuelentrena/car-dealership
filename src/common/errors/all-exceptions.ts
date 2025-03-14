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
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse = {
      statusCode: status,
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    // 🔥 Loguear el error con el Logger de NestJS
    logger.error(`HTTP ${status} Error: ${JSON.stringify(errorResponse)}`);

    response.status(status).json(errorResponse);
  }
}
