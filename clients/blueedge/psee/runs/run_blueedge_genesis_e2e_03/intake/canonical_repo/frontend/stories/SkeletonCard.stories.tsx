import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ── SkeletonCard Component ───────────────────────────────────
function SkeletonCard({ variant = 'stat' }: { variant?: 'stat' | 'chart' | 'table' | 'gauge' }) {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
    borderRadius: 'var(--radius-sm)',
  };

  if (variant === 'stat') {
    return (
      <div className="stat-card" style={{ minWidth: 200, padding: 16 }}>
        <div style={{ ...shimmerStyle, height: 12, width: '60%', marginBottom: 12 }} />
        <div style={{ ...shimmerStyle, height: 28, width: '40%', marginBottom: 8 }} />
        <div style={{ ...shimmerStyle, height: 10, width: '50%' }} />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="chart-card" style={{ padding: 16 }}>
        <div style={{ ...shimmerStyle, height: 14, width: '30%', marginBottom: 16 }} />
        <div style={{ ...shimmerStyle, height: 200, width: '100%' }} />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="table-card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          {[40, 25, 20, 15].map((w, i) => (
            <div key={i} style={{ ...shimmerStyle, height: 14, width: `${w}%` }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
            {[40, 25, 20, 15].map((w, j) => (
              <div key={j} style={{ ...shimmerStyle, height: 12, width: `${w}%` }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // gauge
  return (
    <div className="gauge-card" style={{ padding: 16, textAlign: 'center' }}>
      <div style={{ ...shimmerStyle, width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px' }} />
      <div style={{ ...shimmerStyle, height: 12, width: '60%', margin: '0 auto' }} />
    </div>
  );
}

const meta: Meta<typeof SkeletonCard> = {
  title: 'Components/SkeletonCard',
  component: SkeletonCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['stat', 'chart', 'table', 'gauge'] },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonCard>;

export const Stat: Story = { args: { variant: 'stat' } };
export const Chart: Story = { args: { variant: 'chart' } };
export const Table: Story = { args: { variant: 'table' } };
export const Gauge: Story = { args: { variant: 'gauge' } };

export const DashboardSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} variant="stat" />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <SkeletonCard variant="chart" />
        <SkeletonCard variant="gauge" />
      </div>
      <SkeletonCard variant="table" />
    </div>
  ),
};
