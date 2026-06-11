// ChartCard — React wrapper for Chart.js 4 with full theme awareness
// Session 30: auto-adapts to dark/light theme via CSS variables + data-theme

import React, { useEffect, useRef, useCallback } from 'react';
import { useI18n } from '@/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Chart, ChartType, ChartData,
  CategoryScale, LinearScale, RadialLinearScale, LogarithmicScale, TimeScale,
  BarController, LineController, DoughnutController, PieController, PolarAreaController, RadarController, ScatterController, BubbleController,
  BarElement, LineElement, PointElement, ArcElement,
  Filler, Legend, Title, Tooltip, SubTitle,
} from 'chart.js';

Chart.register(
  CategoryScale, LinearScale, RadialLinearScale, LogarithmicScale,
  BarController, LineController, DoughnutController, PieController, PolarAreaController, RadarController, ScatterController, BubbleController,
  BarElement, LineElement, PointElement, ArcElement,
  Filler, Legend, Title, Tooltip, SubTitle,
);

export const CHART_PALETTE = ['#06d6d6','#3b82f6','#22c55e','#f59e0b','#ef4444','#a855f7','#ec4899','#6366f1','#14b8a6','#f97316','#84cc16','#f43f5e'];
export const CHART_PALETTE_ALPHA = CHART_PALETTE.map(c => c + '33');

// ── Theme-aware chart colors ────────────────────────────────
export function getChartThemeColors(isDark: boolean) {
  return {
    textColor:    isDark ? '#8892a8' : '#475569',
    mutedColor:   isDark ? '#5a6480' : '#94a3b8',
    gridColor:    isDark ? 'rgba(30,42,74,0.4)' : 'rgba(0,0,0,0.06)',
    tooltipBg:    isDark ? '#0d1b3e' : '#ffffff',
    tooltipText:  isDark ? '#e8ecf4' : '#0f172a',
    tooltipBorder:isDark ? '#1e293b' : '#e2e8f0',
    legendColor:  isDark ? '#8892a8' : '#475569',
    titleColor:   isDark ? '#e8ecf4' : '#0f172a',
    // For radial charts
    angleLineColor: isDark ? 'rgba(30,42,74,0.5)' : 'rgba(0,0,0,0.08)',
    pointLabelColor:isDark ? '#8892a8' : '#475569',
  };
}

/** Hook for pages that build custom chart options */
export function useChartTheme() {
  const { isDark } = useTheme();
  return getChartThemeColors(isDark);
}

interface ChartCardProps {
  title?: string;
  type: ChartType;
  data: ChartData;
  options?: any;
  height?: number;
  className?: string;
  compact?: boolean;
  loading?: boolean;
}

export default function ChartCard({ title, type, data, options, height = 220, className = '', compact = false, loading = false }: ChartCardProps) {
  const { t } = useI18n();
  const { isDark, resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const tc = getChartThemeColors(isDark);
    const isRadial = type === 'doughnut' || type === 'pie' || type === 'polarArea' || type === 'radar';

    const defaultOpts: any = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeOutQuart' },
      interaction: { mode: 'index' as const, intersect: false },
      plugins: {
        legend: {
          display: !compact,
          position: 'bottom' as const,
          labels: {
            color: tc.legendColor,
            font: { family: 'DM Sans, sans-serif', size: compact ? 10 : 11 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: compact ? 8 : 14,
          },
        },
        tooltip: {
          backgroundColor: tc.tooltipBg,
          titleColor: tc.tooltipText,
          bodyColor: tc.tooltipText,
          borderColor: tc.tooltipBorder,
          borderWidth: isDark ? 0 : 1,
          titleFont: { family: 'DM Sans, sans-serif', size: 12, weight: 'bold' as const },
          bodyFont: { family: 'DM Sans, sans-serif', size: 11 },
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
        },
      },
      scales: !isRadial ? {
        x: {
          ticks: { color: tc.mutedColor, font: { family: 'DM Sans, sans-serif', size: compact ? 9 : 10 } },
          grid: { color: tc.gridColor },
        },
        y: {
          ticks: { color: tc.mutedColor, font: { family: 'DM Sans, sans-serif', size: compact ? 9 : 10 } },
          grid: { color: tc.gridColor },
        },
      } : undefined,
    };

    // Deep merge user options
    let mergedOpts = deepMerge(defaultOpts, options || {});

    // ── FORCE theme colors on ALL scales (override any hardcoded page colors) ──
    if (mergedOpts.scales) {
      for (const key of Object.keys(mergedOpts.scales)) {
        const scale = mergedOpts.scales[key];
        if (!scale) continue;

        // Standard axis (x, y, y1, etc.)
        if (scale.ticks) {
          scale.ticks.color = tc.mutedColor;
          if (scale.ticks.font) scale.ticks.font.family = scale.ticks.font.family || 'DM Sans, sans-serif';
        }
        if (scale.grid) {
          scale.grid.color = tc.gridColor;
        }
        if (scale.title && scale.title.display) {
          scale.title.color = tc.textColor;
        }

        // Radial scale (radar charts)
        if (scale.angleLines) {
          scale.angleLines.color = tc.angleLineColor;
        }
        if (scale.pointLabels) {
          scale.pointLabels.color = tc.pointLabelColor;
          if (scale.pointLabels.font) scale.pointLabels.font.family = scale.pointLabels.font.family || 'DM Sans, sans-serif';
        }
        if (key === 'r' && scale.grid) {
          scale.grid.color = tc.gridColor;
        }
      }
    }

    // Force legend color
    if (mergedOpts.plugins?.legend?.labels) {
      mergedOpts.plugins.legend.labels.color = tc.legendColor;
    }

    chartRef.current = new Chart(canvasRef.current, { type, data, options: mergedOpts });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [type, JSON.stringify(data), resolvedTheme, compact]);

  return (
    <div className={`chart-card ${className}`} style={compact ? { padding: '12px' } : {}}>
      {title && <h4 style={{ fontSize: compact ? '12px' : undefined, color: 'var(--text-primary)' }}>{t(title)}</h4>}
      {loading ? (
        <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <div className="loading-spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : (
        <div style={{ height, position: 'relative' }}><canvas ref={canvasRef} /></div>
      )}
    </div>
  );
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
