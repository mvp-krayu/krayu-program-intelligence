import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function GaugeChart({ value, max, label, color, thresholds }: {
  value: number; max?: number; label: string; color?: string;
  thresholds?: { warning: number; danger: number };
}) {
  const m = max || 100;
  const pct = Math.min(value / m, 1);
  const t = thresholds || { warning: 70, danger: 90 };
  const c = value >= t.danger ? 'var(--red)' : value >= t.warning ? 'var(--amber)' : (color || 'var(--cyan)');
  return (
    <div style={{ textAlign: 'center', padding: 16 }}>
      <svg viewBox="0 0 120 80" width="200">
        <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="var(--border)" strokeWidth="8" strokeLinecap="round" />
        <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${pct * 157} 157`} />
        <text x="60" y="55" textAnchor="middle" fill={c} fontSize="22" fontWeight="700">{value}</text>
        <text x="60" y="72" textAnchor="middle" fill="var(--text-muted)" fontSize="8">{label}</text>
      </svg>
    </div>
  );
}

const meta: Meta<typeof GaugeChart> = {
  title: 'Charts/GaugeChart', component: GaugeChart, tags: ['autodocs'],
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } }, label: { control: 'text' } },
};
export default meta;
type Story = StoryObj<typeof GaugeChart>;

export const Default: Story = { args: { value: 72, label: 'Safety Score' } };
export const Warning: Story = { args: { value: 78, label: 'Fatigue Risk', thresholds: { warning: 70, danger: 90 } } };
export const Critical: Story = { args: { value: 95, label: 'Engine Temp °C', max: 120, thresholds: { warning: 80, danger: 100 } } };
export const Healthy: Story = { args: { value: 34, label: 'Fleet Idle %' } };
