// GaugeChart — SVG circular gauge for compliance, health, utilization scores
// Session 26: animated, theme-aware, configurable thresholds

import React, { useState, useEffect } from 'react';

interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
  thickness?: number;
  color?: string;
  thresholds?: { red: number; amber: number; green: number };
  animated?: boolean;
  showTrend?: 'up' | 'down' | 'stable' | null;
  className?: string;
}

export default function GaugeChart({
  value, max = 100, label, unit = '%', size = 120, thickness = 10,
  color, thresholds, animated = true, showTrend = null, className = '',
}: GaugeChartProps) {
  const [animValue, setAnimValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) { setAnimValue(value); return; }
    setAnimValue(0);
    const timer = setTimeout(() => setAnimValue(value), 50);
    return () => clearTimeout(timer);
  }, [value, animated]);

  const pct = Math.min(animValue / max, 1);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - pct);

  // Auto-color based on thresholds
  let gaugeColor = color || '#06d6d6';
  if (thresholds && !color) {
    const pctVal = (value / max) * 100;
    if (pctVal >= thresholds.green) gaugeColor = '#22c55e';
    else if (pctVal >= thresholds.amber) gaugeColor = '#f59e0b';
    else gaugeColor = '#ef4444';
  }

  const trendIcon = showTrend === 'up' ? '↑' : showTrend === 'down' ? '↓' : showTrend === 'stable' ? '→' : '';
  const trendColor = showTrend === 'up' ? '#22c55e' : showTrend === 'down' ? '#ef4444' : '#f59e0b';

  return (
    <div className={`gauge-chart ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="var(--border, rgba(30,42,74,0.4))"
          strokeWidth={thickness}
        />
        {/* Value arc */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{
            transition: animated ? 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease' : 'none',
            filter: `drop-shadow(0 0 4px ${gaugeColor}44)`,
          }}
        />
        {/* Center text (rotated back) */}
        <g style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>
          <text
            x={cx} y={cy - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-primary, #e8ecf4)"
            fontFamily="DM Sans, sans-serif"
            fontWeight="700"
            fontSize={size * 0.2}
          >
            {Math.round(animValue)}{unit}
          </text>
          {showTrend && (
            <text
              x={cx} y={cy + size * 0.15}
              textAnchor="middle"
              fill={trendColor}
              fontFamily="DM Sans, sans-serif"
              fontWeight="600"
              fontSize={size * 0.1}
            >
              {trendIcon}
            </text>
          )}
        </g>
      </svg>
      {label && (
        <div style={{
          fontSize: 11,
          color: 'var(--text-muted, #8892a8)',
          textAlign: 'center',
          fontWeight: 500,
          maxWidth: size,
          lineHeight: 1.2,
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
