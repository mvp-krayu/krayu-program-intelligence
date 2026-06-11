// StatusBadge — consistent status indicators with semantic colors
// Session 26: UX polish

import React from 'react';

type StatusType = 'active' | 'online' | 'warning' | 'pending' | 'error' | 'critical' | 'info' | 'neutral' | 'offline';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  dot?: boolean;
}

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  active:   { label: 'Active',   className: 'status-active' },
  online:   { label: 'Online',   className: 'status-online' },
  warning:  { label: 'Warning',  className: 'status-warning' },
  pending:  { label: 'Pending',  className: 'status-pending' },
  error:    { label: 'Error',    className: 'status-error' },
  critical: { label: 'Critical', className: 'status-critical' },
  info:     { label: 'Info',     className: 'status-info' },
  neutral:  { label: 'Inactive', className: 'status-neutral' },
  offline:  { label: 'Offline',  className: 'status-neutral' },
};

export default function StatusBadge({ status, label, dot = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.neutral;
  return (
    <span className={`status-badge ${config.className}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />}
      {label || config.label}
    </span>
  );
}
