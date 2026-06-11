import type { Meta, StoryObj } from '@storybook/react';

// ── StatCard Component (inline for Storybook isolation) ──────
function StatCard({ label, value, trend, icon, color }: {
  label: string; value: string | number; trend?: string; icon?: string; color?: string;
}) {
  return (
    <div className="stat-card" style={{ minWidth: 200 }}>
      <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
      </div>
      <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: color || 'var(--text-primary)' }}>
        {value}
      </div>
      {trend && (
        <div className="stat-trend" style={{ fontSize: '0.75rem', color: trend.startsWith('+') ? 'var(--green)' : trend.startsWith('-') ? 'var(--red)' : 'var(--text-muted)', marginTop: 4 }}>
          {trend}
        </div>
      )}
    </div>
  );
}

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
  },
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: { label: 'Total Vehicles', value: 247, trend: '+12 this week', icon: '🚛' },
};

export const WithPositiveTrend: Story = {
  args: { label: 'Active Drivers', value: 189, trend: '+8.2% vs last month', icon: '👤' },
};

export const WithNegativeTrend: Story = {
  args: { label: 'Fuel Cost', value: 'AED 142,800', trend: '-3.1% vs last month', icon: '⛽' },
};

export const CyanAccent: Story = {
  args: { label: 'Fleet Utilization', value: '94.2%', trend: '+2.1%', icon: '📊', color: 'var(--cyan)' },
};

export const AlertCount: Story = {
  args: { label: 'Active Alerts', value: 7, trend: '3 critical', icon: '⚠️', color: 'var(--red)' },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      <StatCard label="Total Vehicles" value={247} trend="+12 this week" icon="🚛" />
      <StatCard label="Active Drivers" value={189} trend="+8.2%" icon="👤" />
      <StatCard label="Active Alerts" value={7} icon="⚠️" color="var(--red)" />
      <StatCard label="Fleet Utilization" value="94.2%" trend="+2.1%" icon="📊" color="var(--cyan)" />
    </div>
  ),
};
