import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { randomUUID } from 'crypto';

export const CORRELATION_ID_HEADER = 'x-correlation-id';
export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Generate or extract correlation ID
    const correlationId = request.headers[CORRELATION_ID_HEADER] || randomUUID();
    const requestId = randomUUID();

    // Attach to request for downstream use
    request.correlationId = correlationId;
    request.requestId = requestId;

    // Set response headers
    response.setHeader(CORRELATION_ID_HEADER, correlationId);
    response.setHeader(REQUEST_ID_HEADER, requestId);

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const userId = request.user?.sub || 'anonymous';
    const role = request.user?.role || 'none';
    const startTime = Date.now();

    // Log request
    this.logger.log({
      message: `→ ${method} ${url}`,
      type: 'request',
      correlationId,
      requestId,
      method,
      url,
      ip,
      userAgent: userAgent.substring(0, 100),
      userId,
      role,
      contentLength: headers['content-length'] || 0,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          const logEntry: any = {
            message: `← ${method} ${url} ${statusCode} ${duration}ms`,
            type: 'response',
            correlationId,
            requestId,
            method,
            url,
            statusCode,
            duration,
            userId,
          };

          // Performance warnings
          if (duration > 5000) {
            logEntry.slow = true;
            this.logger.warn(logEntry);
          } else if (duration > 1000) {
            logEntry.slow = true;
            this.logger.log(logEntry);
          } else {
            this.logger.log(logEntry);
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error({
            message: `✗ ${method} ${url} ${error.status || 500} ${duration}ms — ${error.message}`,
            type: 'error',
            correlationId,
            requestId,
            method,
            url,
            statusCode: error.status || 500,
            duration,
            userId,
            errorName: error.name,
            errorMessage: error.message,
            stack: error.stack?.split('\n').slice(0, 5).join('\n'),
          });
        },
      }),
    );
  }
}
