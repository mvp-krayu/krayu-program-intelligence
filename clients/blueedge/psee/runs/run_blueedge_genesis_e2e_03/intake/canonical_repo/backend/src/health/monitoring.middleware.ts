// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Monitoring Middleware
// Feeds request metrics to PrometheusService
// ══════════════════════════════════════════════════════════════

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrometheusService } from './prometheus.service';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  constructor(private readonly prom: PrometheusService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const path = this.normalizePath(req.path);
    const method = req.method;

    // Track active connections
    this.prom.setGauge('blueedge_http_active_connections', 1);

    // On response finish
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode.toString();
      const labels = { method, path, status };

      // Request counter
      this.prom.incrementCounter('blueedge_http_requests_total', 1, labels);

      // Latency histogram
      this.prom.observeHistogram('blueedge_http_request_duration_ms', duration, { method, path });

      // Error counter
      if (res.statusCode >= 400) {
        this.prom.incrementCounter('blueedge_http_errors_total', 1, { method, path, status });
      }

      // 5xx counter
      if (res.statusCode >= 500) {
        this.prom.incrementCounter('blueedge_http_5xx_total', 1, { method, path });
      }

      // Response size
      const size = parseInt(res.getHeader('content-length') as string, 10);
      if (!isNaN(size)) {
        this.prom.observeHistogram('blueedge_http_response_size_bytes', size, { method, path });
      }
    });

    next();
  }

  /** Normalize URL paths to prevent high cardinality (replace UUIDs/IDs) */
  private normalizePath(path: string): string {
    return path
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/\?.*$/, '');
  }
}
