import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function ChartCard({ title, subtitle, children, className }: {
  title: string; subtitle?: string; children?: React.ReactNode; className?: string;
}) {
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: 20, border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        {children || '[Chart Area]'}
      </div>
    </div>
  );
}

const meta: Meta<typeof ChartCard> = {
  title: 'Charts/ChartCard', component: ChartCard, tags: ['autodocs'],
  argTypes: { title: { control: 'text' }, subtitle: { control: 'text' } },
};
export default meta;
type Story = StoryObj<typeof ChartCard>;

export const Default: Story = { args: { title: 'Fleet Utilization', subtitle: 'Last 30 days' } };
export const WithSubtitle: Story = { args: { title: 'Fuel Consumption', subtitle: 'AED per km by fleet type' } };
export const TankerMetrics: Story = { args: { title: 'Tanker Delivery Rate', subtitle: 'JAFZA Terminal 4 — Weekly' } };
