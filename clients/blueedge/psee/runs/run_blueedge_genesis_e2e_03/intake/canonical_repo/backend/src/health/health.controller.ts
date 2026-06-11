import { Controller, Get, Header, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheService } from '../common/cache';
import { PerformanceMiddleware } from '../common/logging';
import { FleetEventEmitter } from '../events';
import { PrometheusService } from './prometheus.service';

@ApiTags('health')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly performanceMiddleware: PerformanceMiddleware,
    private readonly eventEmitter: FleetEventEmitter,
    private readonly prometheus: PrometheusService,
  ) {}

  @Get() @ApiOperation({ summary: "Health check — liveness probe" }) @ApiResponse({ status: 200, description: "Service is alive" })
  async check() {
    const cacheStats = await this.cacheService.getStats();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'blue-edge-fleet-api',
      version: '2.13.0',
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heap: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      },
      cache: cacheStats,
      events: { totalEmitted: this.eventEmitter.getEventCount() },
    };
  }

  @Get('ready') @ApiOperation({ summary: 'Readiness probe — checks dependencies' }) @ApiResponse({ status: 200, description: 'All checks passed' })
  async readiness() {
    const cacheStats = await this.cacheService.getStats();
    return {
      status: cacheStats.connected ? 'ready' : 'degraded',
      checks: {
        cache: cacheStats.connected ? 'up' : 'down (fallback to memory)',
        events: 'up',
        logging: 'up',
      },
    };
  }

  @Get('metrics') @ApiOperation({ summary: 'Performance metrics and system stats' })
  async metrics() {
    return {
      endpoints: this.performanceMiddleware.getMetrics(),
      topSlowest: this.performanceMiddleware.getTopSlowest(10),
      cache: await this.cacheService.getStats(),
      events: { totalEmitted: this.eventEmitter.getEventCount() },
      process: {
        uptime: process.uptime(),
        memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        cpu: process.cpuUsage(),
      },
    };
  }

  @Get('cache/stats') @ApiOperation({ summary: 'Cache hit/miss statistics' })
  async cacheStats() {
    return this.cacheService.getStats();
  }

  @Get('cache/flush') @ApiOperation({ summary: 'Flush all caches' })
  async flushCache() {
    await this.cacheService.flushAll();
    return { status: 'flushed', timestamp: new Date().toISOString() };
  }

  @Get('prometheus') @ApiOperation({ summary: 'Prometheus metrics export (OpenMetrics format)' })
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async prometheusMetrics() {
    // Inject live process metrics
    const mem = process.memoryUsage();
    this.prometheus.setGauge('blueedge_process_heap_bytes', mem.heapUsed);
    this.prometheus.setGauge('blueedge_process_rss_bytes', mem.rss);
    this.prometheus.setGauge('blueedge_process_external_bytes', mem.external);
    const cacheStats = await this.cacheService.getStats();
    this.prometheus.setGauge('blueedge_cache_hits_total', cacheStats.hits || 0);
    this.prometheus.setGauge('blueedge_cache_misses_total', cacheStats.misses || 0);
    this.prometheus.setGauge('blueedge_cache_connected', cacheStats.connected ? 1 : 0);
    this.prometheus.setGauge('blueedge_events_total', this.eventEmitter.getEventCount());
    return this.prometheus.export();
  }
}
