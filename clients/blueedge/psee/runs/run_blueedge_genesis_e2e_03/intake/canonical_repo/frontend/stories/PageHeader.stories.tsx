import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

const meta: Meta<typeof PageHeader> = { title: 'Layout/PageHeader', component: PageHeader, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = { args: { title: 'Fleet Overview', subtitle: '342 vehicles across 3 fleet types' } };
export const TankerOps: Story = { args: { title: 'Tanker Operations', subtitle: 'Oil & Gas Fleet — JAFZA Region' } };
export const WithActions: Story = {
  args: { title: 'Vehicles', subtitle: '342 total',
    actions: React.createElement('button', { style: { padding: '8px 16px', background: 'var(--cyan)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' } }, '+ Add Vehicle') },
};
