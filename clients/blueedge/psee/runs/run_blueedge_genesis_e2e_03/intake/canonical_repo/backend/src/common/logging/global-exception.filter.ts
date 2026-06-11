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
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = (request as any).correlationId || 'unknown';
    const requestId = (request as any).requestId || 'unknown';

    let status: number;
    let message: string;
    let error: string;
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        error = exception.name;
      } else {
        message = (res as any).message || exception.message;
        error = (res as any).error || exception.name;
        details = (res as any).details;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = exception.name;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      error = 'UnknownError';
    }

    // Structured error log
    const logPayload = {
      type: 'exception',
      correlationId,
      requestId,
      method: request.method,
      url: request.url,
      statusCode: status,
      error,
      message: exception instanceof Error ? exception.message : String(exception),
      userId: (request as any).user?.sub || 'anonymous',
      ip: request.ip,
      stack: exception instanceof Error ? exception.stack?.split('\n').slice(0, 8).join('\n') : undefined,
    };

    if (status >= 500) {
      this.logger.error(logPayload);
    } else if (status >= 400) {
      this.logger.warn(logPayload);
    }

    // Structured error response
    const errorResponse = {
      success: false,
      error: {
        code: status,
        type: error,
        message: Array.isArray(message) ? message : [message],
        details: details || undefined,
      },
      meta: {
        correlationId,
        requestId,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }
}
