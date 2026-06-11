// MobileTableWrapper — responsive card-list view for tables on mobile
// Session 26: mobile UX polish

import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks';

interface Column {
  key: string;
  label: string;
  primary?: boolean;
  badge?: boolean;
}

interface MobileTableWrapperProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  renderActions?: (row: any) => React.ReactNode;
  children: React.ReactNode; // Desktop table
}

function StatusBadge({ value }: { value: string }) {
  const color = /active|online|pass|good|complete/i.test(value) ? 'var(--green)'
    : /warning|pending|medium|partial/i.test(value) ? 'var(--amber)'
    : /critical|offline|fail|expired|high/i.test(value) ? 'var(--red)'
    : 'var(--text-secondary)';
  return (
    <span style={{
      fontSize: '.68rem', padding: '2px 8px', borderRadius: 10,
      background: `${color}22`, color, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{value}</span>
  );
}

export default function MobileTableWrapper({ columns, data, onRowClick, renderActions, children }: MobileTableWrapperProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isMobile) return <>{children}</>;

  const primaryCol = columns.find(c => c.primary) || columns[0];
  const secondaryColumns = columns.filter(c => c !== primaryCol).slice(0, 4);

  return (
    <div className="mobile-card-list">
      {data.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8rem' }}>
          No records found
        </div>
      )}
      {data.map((row, i) => (
        <div
          key={row.id || i}
          className="mobile-card-item"
          onClick={() => onRowClick?.(row)}
          role={onRowClick ? 'button' : undefined}
          tabIndex={onRowClick ? 0 : undefined}
        >
          <div className="mci-header">
            <span className="mci-title">{row[primaryCol.key]}</span>
            {renderActions && <div className="mci-actions">{renderActions(row)}</div>}
          </div>
          <div className="mci-fields">
            {secondaryColumns.map(col => (
              <div key={col.key} className="mci-field">
                <span className="mci-label">{col.label}</span>
                {col.badge ? <StatusBadge value={String(row[col.key] ?? '—')} />
                  : <span className="mci-value">{String(row[col.key] ?? '—')}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
