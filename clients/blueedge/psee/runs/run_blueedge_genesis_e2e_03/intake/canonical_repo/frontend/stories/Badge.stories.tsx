import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function Badge({ label, variant, size }: {
  label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; size?: 'sm' | 'md';
}) {
  const colors: Record<string, string> = { default: 'var(--text-secondary)', success: 'var(--green)', warning: 'var(--amber)', danger: 'var(--red)', info: 'var(--cyan)' };
  const c = colors[variant || 'default'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: size === 'sm' ? '2px 6px' : '4px 10px',
      borderRadius: 999, fontSize: size === 'sm' ? '0.65rem' : '0.75rem', fontWeight: 600,
      color: c, background: `${c}22`, border: `1px solid ${c}44` }}>
      {label}
    </span>
  );
}

const meta: Meta<typeof Badge> = { title: 'UI/Badge', component: Badge, tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'success', 'warning', 'danger', 'info'] } } };
export default meta;
type Story = StoryObj<typeof Badge>;

export const Active: Story = { args: { label: 'Active', variant: 'success' } };
export const Maintenance: Story = { args: { label: 'Maintenance', variant: 'warning' } };
export const Critical: Story = { args: { label: 'Critical Alert', variant: 'danger' } };
export const Info: Story = { args: { label: 'EV Charging', variant: 'info' } };
export const Small: Story = { args: { label: 'HAZMAT', variant: 'danger', size: 'sm' } };
