import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function AlertRow({ severity, type, message, vehicle, time }: {
  severity: 'critical' | 'warning' | 'info';
  type: string; message: string; vehicle: string; time: string;
}) {
  const sevColors = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue)' };
  const sevBg = { critical: 'rgba(239,68,68,0.1)', warning: 'rgba(245,158,11,0.1)', info: 'rgba(59,130,246,0.1)' };

  return (
    <div className="alert-row" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: sevColors[severity], flexShrink: 0,
      }} />
      <span className={`badge badge-${severity === 'critical' ? 'red' : severity === 'warning' ? 'amber' : 'blue'}`}
        style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
        {severity}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {type}: {message}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
          {vehicle}
        </div>
      </div>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {time}
      </span>
    </div>
  );
}

function Toast({ variant, message, onClose }: {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const borders = { success: 'var(--green)', error: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue)' };

  return (
    <div className="toast" style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 'var(--radius)',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderLeft: `3px solid ${borders[variant]}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxWidth: 400,
    }}>
      <span>{icons[variant]}</span>
      <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)',
        cursor: 'pointer', fontSize: '1rem', padding: 4,
      }}>×</button>
    </div>
  );
}

// AlertRow Meta
const alertMeta: Meta<typeof AlertRow> = {
  title: 'Components/AlertRow',
  component: AlertRow,
  tags: ['autodocs'],
};
export default alertMeta;
type AlertStory = StoryObj<typeof AlertRow>;

export const Critical: AlertStory = {
  args: {
    severity: 'critical', type: 'Speed Alert',
    message: 'Vehicle exceeded 120 km/h in restricted zone',
    vehicle: 'DXB-7291 (Ahmed Al-Rashid)', time: '2 min ago',
  },
};

export const Warning: AlertStory = {
  args: {
    severity: 'warning', type: 'Fuel Alert',
    message: 'Fuel level below 15%',
    vehicle: 'TAXI-3301 (Tariq Noor)', time: '15 min ago',
  },
};

export const Info: AlertStory = {
  args: {
    severity: 'info', type: 'Geofence',
    message: 'Vehicle entered JAFZA Free Zone',
    vehicle: 'DXB-8834 (Saeed Al-Mansoori)', time: '1 hr ago',
  },
};

export const AlertList: AlertStory = {
  render: () => (
    <div className="table-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Active Alerts</h3>
      </div>
      <AlertRow severity="critical" type="Speed Alert" message="Vehicle exceeded 120 km/h" vehicle="DXB-7291" time="2 min ago" />
      <AlertRow severity="warning" type="Fuel Alert" message="Fuel level below 15%" vehicle="TAXI-3301" time="15 min ago" />
      <AlertRow severity="info" type="Geofence" message="Entered JAFZA Free Zone" vehicle="DXB-8834" time="1 hr ago" />
      <AlertRow severity="warning" type="Maintenance" message="Oil change overdue by 500km" vehicle="BUS-1103" time="3 hr ago" />
    </div>
  ),
};

export const ToastVariants: AlertStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toast variant="success" message="Vehicle DXB-7291 added successfully" />
      <Toast variant="error" message="Failed to connect to GPS module" />
      <Toast variant="warning" message="Driver license expires in 7 days" />
      <Toast variant="info" message="New firmware update available for 12 devices" />
    </div>
  ),
};
