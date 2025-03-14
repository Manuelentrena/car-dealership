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

    const errorMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Extraer solo el mensaje de error sin el JSON completo
    const errorText =
      typeof errorMessage === 'object' && 'message' in errorMessage
        ? errorMessage.message
        : errorMessage;

    // 🔥 Loguear el error con el Logger de NestJS
    // 🔥 Log más limpio
    logger.error(`HTTP ${status} | ${new Date().toISOString()} | ${errorText}`);

    response.status(status).json({
      statusCode: status,
      message: errorText,
      timestamp: new Date().toISOString(),
    });
  }
}
