import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function EmptyState({ icon, title, description, action }: {
  icon?: string; title: string; description?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="empty-state" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center',
    }}>
      {icon && (
        <div className="empty-state-icon" style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--bg-card)', border: '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', marginBottom: 16,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 360 }}>
          {description}
        </p>
      )}
      {action && (
        <button className="btn btn-cyan" style={{ marginTop: 16 }} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoVehicles: Story = {
  args: {
    icon: '🚛',
    title: 'No vehicles found',
    description: 'Start by adding your first vehicle to the fleet.',
    action: { label: 'Add Vehicle', onClick: () => {} },
  },
};

export const NoAlerts: Story = {
  args: { icon: '✅', title: 'All clear!', description: 'No active alerts at this time.' },
};

export const NoResults: Story = {
  args: { icon: '🔍', title: 'No results found', description: 'Try adjusting your search or filter criteria.' },
};

export const NoData: Story = {
  args: { icon: '📊', title: 'No data available', description: 'Data will appear here once vehicles start reporting.' },
};
