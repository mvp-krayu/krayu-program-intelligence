import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function TrendCard({ label, value, trend, trendLabel, icon }: {
  label: string; value: string; trend: number; trendLabel?: string; icon?: string;
}) {
  const up = trend >= 0;
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px 20px', border: '1px solid var(--border)', minWidth: 180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', marginTop: 4, color: up ? 'var(--green)' : 'var(--red)' }}>
        {up ? '▲' : '▼'} {Math.abs(trend)}% {trendLabel || 'vs last month'}
      </div>
    </div>
  );
}

const meta: Meta<typeof TrendCard> = {
  title: 'Charts/TrendCard', component: TrendCard, tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TrendCard>;

export const Positive: Story = { args: { label: 'Active Vehicles', value: '342', trend: 5.2, icon: '🚛' } };
export const Negative: Story = { args: { label: 'Fuel Cost', value: 'AED 1.2M', trend: -3.1, icon: '⛽' } };
export const TankerKPI: Story = { args: { label: 'Deliveries Today', value: '47', trend: 12, trendLabel: 'vs yesterday', icon: '🛢️' } };
export const BusKPI: Story = { args: { label: 'On-Time Rate', value: '94.2%', trend: 1.8, icon: '🚌' } };
export const TaxiKPI: Story = { args: { label: 'Avg Fare', value: 'AED 38', trend: -2.4, icon: '🚕' } };
