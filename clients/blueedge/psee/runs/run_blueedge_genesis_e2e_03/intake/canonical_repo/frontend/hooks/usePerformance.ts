// ── usePerformance — Web Vitals & Performance Monitoring ─────
// Tracks LCP, FID, CLS, TTFB, and custom render metrics
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  lcp: number | null;      // Largest Contentful Paint
  fid: number | null;      // First Input Delay
  cls: number | null;      // Cumulative Layout Shift
  ttfb: number | null;     // Time to First Byte
  fcp: number | null;      // First Contentful Paint
  renderTime: number | null;
}

const metrics: PerformanceMetrics = {
  lcp: null, fid: null, cls: null, ttfb: null, fcp: null, renderTime: null,
};

let initialized = false;

function initWebVitals() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1] as any;
    if (last) metrics.lcp = Math.round(last.renderTime || last.loadTime);
  });
  try { lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}

  // FID
  const fidObserver = new PerformanceObserver((list) => {
    const entry = list.getEntries()[0] as any;
    if (entry) metrics.fid = Math.round(entry.processingStart - entry.startTime);
  });
  try { fidObserver.observe({ type: 'first-input', buffered: true }); } catch {}

  // CLS
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (!entry.hadRecentInput) clsValue += entry.value;
    }
    metrics.cls = Math.round(clsValue * 1000) / 1000;
  });
  try { clsObserver.observe({ type: 'layout-shift', buffered: true }); } catch {}

  // Navigation timing
  const navObserver = new PerformanceObserver((list) => {
    const nav = list.getEntries()[0] as PerformanceNavigationTiming;
    if (nav) {
      metrics.ttfb = Math.round(nav.responseStart - nav.requestStart);
    }
  });
  try { navObserver.observe({ type: 'navigation', buffered: true }); } catch {}

  // FCP
  const fcpObserver = new PerformanceObserver((list) => {
    const entry = list.getEntries().find((e) => e.name === 'first-contentful-paint');
    if (entry) metrics.fcp = Math.round(entry.startTime);
  });
  try { fcpObserver.observe({ type: 'paint', buffered: true }); } catch {}
}

/** Track component render time */
export function useRenderTime(componentName: string) {
  const startRef = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - startRef.current;
    if (import.meta.env.MODE === 'development') {
      console.debug(`[Perf] ${componentName} rendered in ${duration.toFixed(1)}ms`);
    }
  });
}

/** Get all collected Web Vitals */
export function usePerformance() {
  useEffect(() => { initWebVitals(); }, []);

  const getMetrics = useCallback((): PerformanceMetrics => ({ ...metrics }), []);

  const getScore = useCallback((): 'good' | 'needs-improvement' | 'poor' => {
    const m = metrics;
    if (!m.lcp || !m.cls) return 'needs-improvement';
    if (m.lcp <= 2500 && (m.cls ?? 0) <= 0.1 && (m.fid ?? 0) <= 100) return 'good';
    if (m.lcp > 4000 || (m.cls ?? 0) > 0.25 || (m.fid ?? 0) > 300) return 'poor';
    return 'needs-improvement';
  }, []);

  return { getMetrics, getScore };
}

export default usePerformance;
