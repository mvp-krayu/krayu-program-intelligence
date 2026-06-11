import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const MOCK_VEHICLES = [
  { id: 'V001', plate: 'DXB-7291', type: 'Tanker', driver: 'Ahmed Al-Rashid', status: 'Active', fuel: '87%', speed: 62 },
  { id: 'V008', plate: 'DXB-4490', type: 'Tanker', driver: 'Mohammed Hassan', status: 'Active', fuel: '65%', speed: 45 },
  { id: 'V022', plate: 'BUS-1103', type: 'Bus', driver: 'Khalid Ibrahim', status: 'Active', fuel: '92%', speed: 38 },
  { id: 'V045', plate: 'TAXI-2201', type: 'Taxi', driver: 'Omar Farid', status: 'Idle', fuel: '54%', speed: 0 },
  { id: 'V012', plate: 'DXB-8834', type: 'Tanker', driver: 'Saeed Al-Mansoori', status: 'Active', fuel: '78%', speed: 55 },
  { id: 'V033', plate: 'BUS-2204', type: 'Bus', driver: 'Yusuf Bakr', status: 'Maintenance', fuel: '40%', speed: 0 },
  { id: 'V067', plate: 'TAXI-3301', type: 'Taxi', driver: 'Tariq Noor', status: 'Offline', fuel: '12%', speed: 0 },
];

function DataTableStory() {
  return (
    <div className="table-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Fleet Vehicles</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{MOCK_VEHICLES.length} vehicles</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Plate', 'Type', 'Driver', 'Status', 'Fuel', 'Speed'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem',
                  fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_VEHICLES.map(v => {
              const statusColor: Record<string, string> = {
                Active: 'green', Idle: 'amber', Offline: 'red', Maintenance: 'blue',
              };
              return (
                <tr key={v.id} className="clickable-row" style={{ cursor: 'pointer' }}>
                  <td style={{ padding: '10px 14px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--mono)' }}>{v.plate}</td>
                  <td style={{ padding: '10px 14px', fontSize: '0.85rem' }}>{v.type}</td>
                  <td style={{ padding: '10px 14px', fontSize: '0.85rem' }}>{v.driver}</td>
                  <td style={{ padding: '10px 14px' }}><span className={`badge badge-${statusColor[v.status]}`}>{v.status}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>{v.fuel}</td>
                  <td style={{ padding: '10px 14px', fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>{v.speed > 0 ? `${v.speed} km/h` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.75rem', color: 'var(--text-muted)',
      }}>
        <span>Showing 1-7 of 247</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, '...', 35].map((p, i) => (
            <button key={i} className={`pg-btn ${p === 1 ? 'active' : ''}`} style={{
              padding: '4px 10px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: p === 1 ? 'var(--cyan)' : 'transparent',
              color: p === 1 ? '#000' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem',
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof DataTableStory> = {
  title: 'Components/DataTable',
  component: DataTableStory,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DataTableStory>;

export const Default: Story = {};
