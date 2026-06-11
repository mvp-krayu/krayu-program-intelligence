import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ── StatusBadge Component ────────────────────────────────────
function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' | 'lg' }) {
  const colorMap: Record<string, string> = {
    active: 'green', online: 'green', completed: 'green', success: 'green',
    idle: 'amber', warning: 'amber', pending: 'amber', scheduled: 'amber',
    offline: 'red', critical: 'red', error: 'red', overdue: 'red',
    inactive: 'red', expired: 'red',
    maintenance: 'blue', 'in-transit': 'blue', 'in-progress': 'blue',
    info: 'cyan',
  };
  const color = colorMap[status.toLowerCase()] || 'cyan';
  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : '';

  return (
    <span className={`badge badge-${color} ${sizeClass}`}>
      {status}
    </span>
  );
}

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Active', 'Idle', 'Offline', 'Maintenance', 'In-Transit', 'Critical', 'Warning', 'Pending', 'Completed'],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Active: Story = { args: { status: 'Active' } };
export const Idle: Story = { args: { status: 'Idle' } };
export const Offline: Story = { args: { status: 'Offline' } };
export const Maintenance: Story = { args: { status: 'Maintenance' } };
export const Critical: Story = { args: { status: 'Critical' } };
export const Small: Story = { args: { status: 'Active', size: 'sm' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['Active', 'Idle', 'Offline', 'Maintenance', 'In-Transit', 'Critical', 'Warning', 'Pending', 'Completed', 'Info'].map(s => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  ),
};
