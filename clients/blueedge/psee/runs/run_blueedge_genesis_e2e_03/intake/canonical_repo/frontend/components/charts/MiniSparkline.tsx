// MiniSparkline — lightweight inline SVG sparkline chart
// Session 26: No chart.js dependency, pure SVG for performance

import React, { useMemo } from 'react';

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  showDot?: boolean;
  showMinMax?: boolean;
  animated?: boolean;
  className?: string;
}

export default function MiniSparkline({
  data, width = 80, height = 28, color = '#06d6d6',
  fill = true, showDot = true, showMinMax = false, animated = true, className = '',
}: MiniSparklineProps) {
  const { path, fillPath, lastPoint, minPoint, maxPoint } = useMemo(() => {
    if (!data || data.length < 2) return { path: '', fillPath: '', lastPoint: null, minPoint: null, maxPoint: null };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 3;
    const w = width - pad * 2;
    const h = height - pad * 2;

    const points = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * w,
      y: pad + h - ((v - min) / range) * h,
      v,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
      d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const fd = `${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    const last = points[points.length - 1];
    const minPt = points.reduce((a, b) => a.v < b.v ? a : b);
    const maxPt = points.reduce((a, b) => a.v > b.v ? a : b);

    return { path: d, fillPath: fd, lastPoint: last, minPoint: minPt, maxPoint: maxPt };
  }, [data, width, height]);

  if (!data || data.length < 2) return null;

  const trend = data[data.length - 1] >= data[0] ? 'up' : 'down';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`mini-sparkline ${className}`}
      style={{ overflow: 'visible', verticalAlign: 'middle' }}
    >
      {fill && (
        <path
          d={fillPath}
          fill={`${color}18`}
          style={animated ? { animation: 'sparkFadeIn 0.6s ease-out' } : {}}
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={animated ? {
          strokeDasharray: width * 3,
          strokeDashoffset: width * 3,
          animation: 'sparkDraw 1s ease-out forwards',
        } : {}}
      />
      {showDot && lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={color}
          stroke="var(--bg-card)"
          strokeWidth={1.5}
          style={animated ? { animation: 'sparkPulse 2s ease-in-out infinite' } : {}}
        />
      )}
      {showMinMax && minPoint && maxPoint && (
        <>
          <circle cx={minPoint.x} cy={minPoint.y} r={1.5} fill="#ef4444" />
          <circle cx={maxPoint.x} cy={maxPoint.y} r={1.5} fill="#22c55e" />
        </>
      )}
      <style>{`
        @keyframes sparkDraw { to { stroke-dashoffset: 0; } }
        @keyframes sparkFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sparkPulse { 0%,100% { r: 2.5; opacity: 1; } 50% { r: 3.5; opacity: 0.7; } }
      `}</style>
    </svg>
  );
}
