// TrendCard — StatCard with embedded sparkline and trend arrow
// Session 26: combines KPI display with visual trend

import React from 'react';
import { useAnimatedValue, useI18n } from '@/hooks';
import { fmt } from '@/utils';
import MiniSparkline from '@/components/charts/MiniSparkline';

interface TrendCardProps {
  label: string;
  value: string | number;
  trend?: number;         // percentage change (+/-)
  trendLabel?: string;    // e.g. "vs last month"
  sparkData?: number[];   // sparkline data points
  color?: string;
  sparkColor?: string;
  icon?: React.ReactNode;
  sub?: string;
  onClick?: () => void;
}

export default function TrendCard({
  label, value, trend, trendLabel, sparkData, color, sparkColor, icon, sub, onClick,
}: TrendCardProps) {
  const { t } = useI18n();
  const numericVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  const animated = useAnimatedValue(isNaN(numericVal) ? 0 : numericVal);
  const isNumeric = !isNaN(numericVal) && typeof value !== 'undefined';

  const formatAnimated = () => {
    if (!isNumeric) return value;
    const sv = String(value);
    const intVal = Math.round(animated);
    if (sv.startsWith('AED')) return `AED ${fmt(intVal)}`;
    if (sv.includes('%')) return `${animated.toFixed(1)}%`;
    const suffix = sv.replace(/[0-9,.%]+/g, '').trim();
    if (suffix && !sv.startsWith('AED')) return `${fmt(intVal)}${suffix ? ' ' + suffix : ''}`;
    return fmt(intVal);
  };

  const trendColor = trend == null ? undefined : trend > 0 ? '#22c55e' : trend < 0 ? '#ef4444' : '#f59e0b';
  const trendArrow = trend == null ? '' : trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
  const resolvedSparkColor = sparkColor || (trend != null && trend >= 0 ? '#22c55e' : '#ef4444') || '#06d6d6';

  return (
    <div
      className="stat-card trend-card"
      style={{ cursor: onClick ? 'pointer' : undefined, position: 'relative', overflow: 'hidden' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {icon && <span style={{ fontSize: 14, opacity: 0.8 }}>{icon}</span>}
            {t(label)}
          </div>
          <div className="stat-value counter-val" style={color ? { color: `var(--${color})` } : {}}>
            {formatAnimated()}
          </div>
          {(trend != null || sub) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {trend != null && (
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: trendColor,
                  background: `${trendColor}18`,
                  padding: '1px 6px',
                  borderRadius: 4,
                }}>
                  {trendArrow} {Math.abs(trend).toFixed(1)}%
                </span>
              )}
              {(trendLabel || sub) && (
                <span className="stat-sub" style={{ margin: 0 }}>{trendLabel || sub}</span>
              )}
            </div>
          )}
        </div>
        {sparkData && sparkData.length >= 2 && (
          <div style={{ marginLeft: 8, alignSelf: 'center' }}>
            <MiniSparkline data={sparkData} color={resolvedSparkColor} width={72} height={32} />
          </div>
        )}
      </div>
    </div>
  );
}
