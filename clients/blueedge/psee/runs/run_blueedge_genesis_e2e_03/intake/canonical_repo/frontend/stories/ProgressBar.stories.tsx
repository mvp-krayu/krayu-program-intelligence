import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function ProgressBar({ value, max, label, color, showPercent }: {
  value: number; max?: number; label?: string; color?: string; showPercent?: boolean;
}) {
  const m = max || 100;
  const pct = Math.min(value / m * 100, 100);
  const c = color || (pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--amber)' : 'var(--cyan)');
  return (
    <div style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.75rem' }}>
          {label && <span style={{ color: 'var(--text-secondary)' }}>{label}</span>}
          {showPercent && <span style={{ color: 'var(--text-muted)' }}>{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

const meta: Meta<typeof ProgressBar> = { title: 'UI/ProgressBar', component: ProgressBar, tags: ['autodocs'],
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } } };
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = { args: { value: 65, label: 'Fleet Utilization', showPercent: true } };
export const Low: Story = { args: { value: 20, label: 'Fuel Level', showPercent: true } };
export const High: Story = { args: { value: 92, label: 'Cargo Capacity', showPercent: true } };
export const Critical: Story = { args: { value: 98, label: 'Engine Temperature', showPercent: true } };
