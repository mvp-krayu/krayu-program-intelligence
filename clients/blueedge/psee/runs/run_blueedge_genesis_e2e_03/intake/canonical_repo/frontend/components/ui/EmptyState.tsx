// EmptyState — friendly zero-state for tables and data sections
// Session 26: UX polish

import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  icon = '📋',
  title = 'No data yet',
  description = 'Items will appear here once added.',
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className="empty-state" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: compact ? '24px 16px' : '48px 24px',
      textAlign: 'center', color: 'var(--text-muted)',
    }}>
      <span style={{ fontSize: compact ? '2rem' : '3rem', marginBottom: 8, opacity: 0.6 }}>{icon}</span>
      <div style={{ fontSize: compact ? '.82rem' : '.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: '.75rem', maxWidth: 300, lineHeight: 1.5, marginBottom: action ? 12 : 0 }}>
        {description}
      </div>
      {action}
    </div>
  );
}
