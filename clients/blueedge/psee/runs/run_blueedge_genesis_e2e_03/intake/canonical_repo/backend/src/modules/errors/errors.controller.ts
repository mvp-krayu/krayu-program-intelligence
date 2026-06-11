// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Frontend Error Ingestion Endpoint
// Receives error reports from browser clients, logs to Winston
// ══════════════════════════════════════════════════════════════

import { Controller, Post, Body, Logger, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

interface FrontendError {
  message: string;
  stack?: string;
  level: 'error' | 'warning' | 'info';
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
  breadcrumbs?: Array<{
    type: string;
    message: string;
    timestamp: string;
    data?: Record<string, any>;
  }>;
}

interface ErrorBatchDto {
  errors: FrontendError[];
}

@ApiTags('errors')
@Controller({ path: 'errors', version: '1' })
export class ErrorsController {
  private readonly logger = new Logger('FrontendErrors');

  @Post()
  @ApiOperation({ summary: 'Ingest frontend error reports' })
  async ingestErrors(@Body() batch: ErrorBatchDto) {
    if (!batch.errors || !Array.isArray(batch.errors)) {
      return { received: 0 };
    }

    // Cap at 50 errors per batch to prevent abuse
    const errors = batch.errors.slice(0, 50);

    for (const err of errors) {
      const sanitized = {
        message: String(err.message || '').slice(0, 1000),
        level: err.level || 'error',
        url: String(err.url || '').slice(0, 500),
        userId: err.userId ? String(err.userId).slice(0, 100) : undefined,
        stack: err.stack ? String(err.stack).slice(0, 3000) : undefined,
        context: err.context || {},
        breadcrumbCount: err.breadcrumbs?.length || 0,
        timestamp: err.timestamp,
      };

      if (sanitized.level === 'error') {
        this.logger.error(`[FRONTEND] ${sanitized.message}`, {
          ...sanitized,
          breadcrumbs: err.breadcrumbs?.slice(-10), // Last 10 breadcrumbs only
        });
      } else if (sanitized.level === 'warning') {
        this.logger.warn(`[FRONTEND] ${sanitized.message}`, sanitized);
      } else {
        this.logger.log(`[FRONTEND] ${sanitized.message}`, sanitized);
      }
    }

    return { received: errors.length, timestamp: new Date().toISOString() };
  }
}
