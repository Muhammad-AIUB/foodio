import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const message =
      typeof rawMessage === 'object' &&
      rawMessage !== null &&
      'message' in rawMessage
        ? (rawMessage as { message: string | string[] }).message
        : typeof rawMessage === 'string'
          ? rawMessage
          : 'Internal server error';

    this.logger.error(
      `[${req.method}] ${req.url} → ${status}`,
      exception instanceof Error ? exception.stack : '',
    );

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: Array.isArray(message) ? message[0] : message,
    });
  }
}
