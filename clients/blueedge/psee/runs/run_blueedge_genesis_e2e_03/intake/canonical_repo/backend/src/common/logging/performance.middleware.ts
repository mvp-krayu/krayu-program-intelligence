import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface EndpointMetrics {
  count: number;
  totalMs: number;
  maxMs: number;
  minMs: number;
  p95: number[];
  errors: number;
  lastAccessed: number;
}

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Performance');
  private metrics = new Map<string, EndpointMetrics>();
  private readonly SLOW_THRESHOLD_MS = 1000;
  private readonly METRICS_WINDOW = 100; // Keep last 100 for percentile calc

  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();
    const key = `${req.method} ${this.normalizePath(req.path)}`;

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      this.recordMetric(key, durationMs, res.statusCode);

      if (durationMs > this.SLOW_THRESHOLD_MS) {
        this.logger.warn({
          message: `Slow endpoint: ${key} took ${Math.round(durationMs)}ms`,
          type: 'slow_endpoint',
          endpoint: key,
          duration: Math.round(durationMs),
          statusCode: res.statusCode,
        });
      }
    });

    next();
  }

  private normalizePath(path: string): string {
    // Replace UUIDs with :id for grouping
    return path.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      ':id',
    );
  }

  private recordMetric(key: string, durationMs: number, statusCode: number): void {
    let metric = this.metrics.get(key);
    if (!metric) {
      metric = { count: 0, totalMs: 0, maxMs: 0, minMs: Infinity, p95: [], errors: 0, lastAccessed: Date.now() };
      this.metrics.set(key, metric);
    }

    metric.count++;
    metric.totalMs += durationMs;
    metric.maxMs = Math.max(metric.maxMs, durationMs);
    metric.minMs = Math.min(metric.minMs, durationMs);
    metric.lastAccessed = Date.now();
    if (statusCode >= 400) metric.errors++;

    // Rolling window for percentile
    metric.p95.push(durationMs);
    if (metric.p95.length > this.METRICS_WINDOW) metric.p95.shift();
  }

  // ──────── Expose metrics for health endpoint ────────

  getMetrics(): Record<string, {
    count: number;
    avgMs: number;
    maxMs: number;
    minMs: number;
    p95Ms: number;
    errorRate: number;
  }> {
    const result: Record<string, any> = {};
    for (const [key, m] of this.metrics) {
      const sorted = [...m.p95].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      result[key] = {
        count: m.count,
        avgMs: Math.round(m.totalMs / m.count),
        maxMs: Math.round(m.maxMs),
        minMs: Math.round(m.minMs),
        p95Ms: Math.round(sorted[p95Index] || 0),
        errorRate: m.count > 0 ? Math.round((m.errors / m.count) * 100) / 100 : 0,
      };
    }
    return result;
  }

  getTopSlowest(n: number = 10): Array<{ endpoint: string; avgMs: number; p95Ms: number; count: number }> {
    return Object.entries(this.getMetrics())
      .sort(([, a], [, b]) => b.p95Ms - a.p95Ms)
      .slice(0, n)
      .map(([endpoint, m]) => ({ endpoint, avgMs: m.avgMs, p95Ms: m.p95Ms, count: m.count }));
  }
}
