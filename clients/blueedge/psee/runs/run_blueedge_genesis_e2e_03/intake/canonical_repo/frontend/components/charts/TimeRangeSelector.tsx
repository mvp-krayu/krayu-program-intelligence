// TimeRangeSelector — pill-style time range toggle for dashboards
// Session 26: compact, animated, consistent with Blue Edge dark theme

import React from 'react';

interface TimeRangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
  options?: { label: string; value: string }[];
  className?: string;
}

const DEFAULT_OPTIONS = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'YTD', value: 'ytd' },
];

export default function TimeRangeSelector({ value, onChange, options = DEFAULT_OPTIONS, className = '' }: TimeRangeSelectorProps) {
  return (
    <div className={`time-range-selector ${className}`} style={{
      display: 'inline-flex',
      gap: 2,
      background: 'var(--bg-tertiary, #0a1628)',
      borderRadius: 8,
      padding: 3,
      border: '1px solid var(--border, rgba(30,42,74,0.6))',
    }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '4px 12px',
            fontSize: 11,
            fontWeight: value === opt.value ? 600 : 400,
            fontFamily: 'DM Sans, sans-serif',
            color: value === opt.value ? '#fff' : 'var(--text-muted, #8892a8)',
            background: value === opt.value ? 'var(--cyan, #06d6d6)' : 'transparent',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.02em',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
