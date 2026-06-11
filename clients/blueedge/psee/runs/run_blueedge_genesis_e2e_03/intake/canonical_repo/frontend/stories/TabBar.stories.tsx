import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

function TabBar({ tabs, activeTab, onTabChange }: {
  tabs: string[]; activeTab?: string; onTabChange?: (tab: string) => void;
}) {
  const [active, setActive] = useState(activeTab || tabs[0]);
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
      {tabs.map(tab => (
        <button key={tab} onClick={() => { setActive(tab); onTabChange?.(tab); }}
          style={{ padding: '8px 16px', border: 'none', borderBottom: active === tab ? '2px solid var(--cyan)' : '2px solid transparent',
            background: 'none', color: active === tab ? 'var(--cyan)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: active === tab ? 600 : 400 }}>
          {tab}
        </button>
      ))}
    </div>
  );
}

const meta: Meta<typeof TabBar> = { title: 'Layout/TabBar', component: TabBar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof TabBar>;

export const FleetTabs: Story = { args: { tabs: ['Dashboard', 'Fleet', 'Analytics', 'HAZMAT', 'Compliance'] } };
export const SimpleTabs: Story = { args: { tabs: ['Overview', 'Details', 'History'] } };
export const ManyTabs: Story = { args: { tabs: ['Dashboard', 'Vehicles', 'Drivers', 'Routes', 'Schedules', 'Reports', 'Settings'] } };
