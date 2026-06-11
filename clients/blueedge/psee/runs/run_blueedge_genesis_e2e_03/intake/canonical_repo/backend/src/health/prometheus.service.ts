// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Prometheus Metrics Exporter
// Exposes /health/prometheus in OpenMetrics text format
// ══════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';

interface MetricEntry {
  name: string;
  help: string;
  type: 'gauge' | 'counter' | 'histogram' | 'summary';
  value: number | Record<string, number>;
  labels?: Record<string, string>;
}

@Injectable()
export class PrometheusService {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private startTime = Date.now();

  // ── Counters ──────────────────────────────────────────
  incrementCounter(name: string, amount = 1, labels?: Record<string, string>) {
    const key = this.labelKey(name, labels);
    this.counters.set(key, (this.counters.get(key) || 0) + amount);
  }

  // ── Gauges ────────────────────────────────────────────
  setGauge(name: string, value: number, labels?: Record<string, string>) {
    const key = this.labelKey(name, labels);
    this.gauges.set(key, value);
  }

  // ── Histograms ────────────────────────────────────────
  observeHistogram(name: string, value: number, labels?: Record<string, string>) {
    const key = this.labelKey(name, labels);
    const arr = this.histograms.get(key) || [];
    arr.push(value);
    if (arr.length > 10000) arr.splice(0, arr.length - 10000); // Cap at 10k
    this.histograms.set(key, arr);
  }

  // ── Export ────────────────────────────────────────────
  export(): string {
    const lines: string[] = [];
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();

    // Process metrics
    lines.push(...this.metric('blueedge_process_uptime_seconds', 'gauge',
      'Process uptime in seconds', (Date.now() - this.startTime) / 1000));
    lines.push(...this.metric('blueedge_process_memory_heap_bytes', 'gauge',
      'Process heap memory in bytes', mem.heapUsed));
    lines.push(...this.metric('blueedge_process_memory_rss_bytes', 'gauge',
      'Process RSS memory in bytes', mem.rss));
    lines.push(...this.metric('blueedge_process_memory_external_bytes', 'gauge',
      'Process external memory in bytes', mem.external));
    lines.push(...this.metric('blueedge_process_cpu_user_seconds', 'counter',
      'CPU time in user mode (microseconds)', cpu.user / 1e6));
    lines.push(...this.metric('blueedge_process_cpu_system_seconds', 'counter',
      'CPU time in system mode (microseconds)', cpu.system / 1e6));

    // Custom counters
    for (const [key, value] of this.counters) {
      const { name, labels } = this.parseKey(key);
      lines.push(...this.metric(name, 'counter', `${name} counter`, value, labels));
    }

    // Custom gauges
    for (const [key, value] of this.gauges) {
      const { name, labels } = this.parseKey(key);
      lines.push(...this.metric(name, 'gauge', `${name} gauge`, value, labels));
    }

    // Custom histograms (summary style)
    for (const [key, values] of this.histograms) {
      const { name, labels } = this.parseKey(key);
      if (values.length === 0) continue;
      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((a, b) => a + b, 0);
      const labelsStr = labels ? this.labelsToStr(labels) : '';

      lines.push(`# HELP ${name} ${name} histogram`);
      lines.push(`# TYPE ${name} summary`);
      lines.push(`${name}{quantile="0.5"${labelsStr ? ',' + labelsStr : ''}} ${sorted[Math.floor(sorted.length * 0.5)]}`);
      lines.push(`${name}{quantile="0.9"${labelsStr ? ',' + labelsStr : ''}} ${sorted[Math.floor(sorted.length * 0.9)]}`);
      lines.push(`${name}{quantile="0.99"${labelsStr ? ',' + labelsStr : ''}} ${sorted[Math.floor(sorted.length * 0.99)]}`);
      lines.push(`${name}_sum${labelsStr ? '{' + labelsStr + '}' : ''} ${sum}`);
      lines.push(`${name}_count${labelsStr ? '{' + labelsStr + '}' : ''} ${values.length}`);
    }

    lines.push('');
    return lines.join('\n');
  }

  // ── Helpers ───────────────────────────────────────────
  private metric(name: string, type: string, help: string, value: number, labels?: Record<string, string>): string[] {
    const labelsStr = labels ? `{${this.labelsToStr(labels)}}` : '';
    return [
      `# HELP ${name} ${help}`,
      `# TYPE ${name} ${type}`,
      `${name}${labelsStr} ${value}`,
    ];
  }

  private labelKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const sorted = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
    return `${name}|${sorted.map(([k, v]) => `${k}=${v}`).join(',')}`;
  }

  private parseKey(key: string): { name: string; labels?: Record<string, string> } {
    const parts = key.split('|');
    if (parts.length === 1) return { name: parts[0] };
    const labels: Record<string, string> = {};
    parts[1].split(',').forEach(pair => {
      const [k, v] = pair.split('=');
      labels[k] = v;
    });
    return { name: parts[0], labels };
  }

  private labelsToStr(labels: Record<string, string>): string {
    return Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(',');
  }
}
