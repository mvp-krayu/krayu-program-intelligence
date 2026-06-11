import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

interface Activity { id: string; type: string; message: string; timestamp: string; severity: 'info' | 'warning' | 'critical'; }
function ActivityFeed({ items }: { items: Activity[] }) {
  const colors = { info: 'var(--cyan)', warning: 'var(--amber)', critical: 'var(--red)' };
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Live Activity Feed</div>
      {items.map(item => (
        <div key={item.id} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: colors[item.severity], marginTop: 6, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{item.message}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof ActivityFeed> = { title: 'Realtime/ActivityFeed', component: ActivityFeed, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ActivityFeed>;
export const Default: Story = { args: { items: [
  { id: '1', type: 'arrival', message: 'Tanker TK-042 arrived at JAFZA Terminal 4', timestamp: '2 min ago', severity: 'info' },
  { id: '2', type: 'alert', message: 'Speed violation: Bus B-118 — 72 km/h in 60 zone', timestamp: '5 min ago', severity: 'warning' },
  { id: '3', type: 'critical', message: 'HAZMAT sensor triggered on TK-019 — H2S detected', timestamp: '8 min ago', severity: 'critical' },
  { id: '4', type: 'trip', message: 'Taxi TX-207 trip completed — DXB T3 to Dubai Marina', timestamp: '12 min ago', severity: 'info' },
  { id: '5', type: 'maintenance', message: 'Bus B-043 scheduled maintenance due in 3 days', timestamp: '18 min ago', severity: 'warning' },
] } };
