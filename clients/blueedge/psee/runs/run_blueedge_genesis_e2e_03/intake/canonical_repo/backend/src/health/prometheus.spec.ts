// ══════════════════════════════════════════════════════════════
// PrometheusService — Unit Tests
// ══════════════════════════════════════════════════════════════
import { PrometheusService } from './prometheus.service';

describe('PrometheusService', () => {
  let service: PrometheusService;

  beforeEach(() => {
    service = new PrometheusService();
  });

  describe('Counters', () => {
    it('increments counter by 1', () => {
      service.incrementCounter('blueedge_http_requests_total');
      service.incrementCounter('blueedge_http_requests_total');
      const output = service.export();
      expect(output).toContain('blueedge_http_requests_total 2');
    });

    it('increments counter by custom amount', () => {
      service.incrementCounter('blueedge_http_requests_total', 5);
      const output = service.export();
      expect(output).toContain('blueedge_http_requests_total 5');
    });

    it('supports labels on counters', () => {
      service.incrementCounter('blueedge_http_requests_total', 1, { method: 'GET', path: '/vehicles' });
      service.incrementCounter('blueedge_http_requests_total', 3, { method: 'POST', path: '/vehicles' });
      const output = service.export();
      expect(output).toContain('method="GET"');
      expect(output).toContain('method="POST"');
    });
  });

  describe('Gauges', () => {
    it('sets gauge value', () => {
      service.setGauge('blueedge_active_connections', 42);
      const output = service.export();
      expect(output).toContain('blueedge_active_connections 42');
    });

    it('overwrites gauge value', () => {
      service.setGauge('blueedge_active_connections', 42);
      service.setGauge('blueedge_active_connections', 10);
      const output = service.export();
      expect(output).toContain('blueedge_active_connections 10');
      expect(output).not.toContain('blueedge_active_connections 42');
    });

    it('supports labels on gauges', () => {
      service.setGauge('blueedge_cache_size', 1000, { cache: 'redis' });
      service.setGauge('blueedge_cache_size', 50, { cache: 'memory' });
      const output = service.export();
      expect(output).toContain('cache="redis"');
      expect(output).toContain('cache="memory"');
    });
  });

  describe('Histograms', () => {
    it('observes histogram values', () => {
      service.observeHistogram('blueedge_http_request_duration_ms', 10);
      service.observeHistogram('blueedge_http_request_duration_ms', 20);
      service.observeHistogram('blueedge_http_request_duration_ms', 50);
      const output = service.export();
      expect(output).toContain('blueedge_http_request_duration_ms');
      expect(output).toContain('quantile="0.5"');
      expect(output).toContain('quantile="0.9"');
      expect(output).toContain('quantile="0.99"');
      expect(output).toContain('_sum');
      expect(output).toContain('_count');
    });

    it('calculates sum and count correctly', () => {
      service.observeHistogram('blueedge_latency', 100);
      service.observeHistogram('blueedge_latency', 200);
      service.observeHistogram('blueedge_latency', 300);
      const output = service.export();
      expect(output).toContain('blueedge_latency_sum 600');
      expect(output).toContain('blueedge_latency_count 3');
    });
  });

  describe('Export', () => {
    it('exports valid OpenMetrics text format', () => {
      service.incrementCounter('blueedge_test_counter');
      service.setGauge('blueedge_test_gauge', 99);
      const output = service.export();
      expect(output).toContain('# HELP');
      expect(output).toContain('# TYPE');
      expect(output).toContain('counter');
      expect(output).toContain('gauge');
    });

    it('includes process metrics', () => {
      const output = service.export();
      expect(output).toContain('blueedge_process_uptime_seconds');
      expect(output).toContain('blueedge_process_memory_heap_bytes');
      expect(output).toContain('blueedge_process_memory_rss_bytes');
      expect(output).toContain('blueedge_process_cpu_user_seconds');
    });

    it('returns empty-ish output when no custom metrics', () => {
      const output = service.export();
      expect(typeof output).toBe('string');
      expect(output.length).toBeGreaterThan(0);
      // Should still have process metrics
      expect(output).toContain('blueedge_process');
    });
  });
});
