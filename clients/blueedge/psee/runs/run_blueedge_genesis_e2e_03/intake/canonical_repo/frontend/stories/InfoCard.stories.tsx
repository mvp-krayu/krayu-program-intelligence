import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function InfoCard({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: 16 }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>{title}</h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof InfoCard> = { title: 'Data/InfoCard', component: InfoCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof InfoCard>;
export const VehicleDetails: Story = { args: { title: 'Vehicle Info', items: [
  { label: 'VIN', value: 'WDB9634031L795832' }, { label: 'Plate', value: 'DXB T-4521' },
  { label: 'Fleet', value: 'Tanker' }, { label: 'Status', value: 'Active' },
  { label: 'Odometer', value: '142,380 km' }, { label: 'Fuel', value: '78%' },
] } };
export const DriverProfile: Story = { args: { title: 'Driver Profile', items: [
  { label: 'Name', value: 'أحمد الفارسي' }, { label: 'License', value: 'UAE-DXB-29481' },
  { label: 'HAZMAT Cert', value: 'Valid until Dec 2026' }, { label: 'Safety Score', value: '92/100' },
] } };
