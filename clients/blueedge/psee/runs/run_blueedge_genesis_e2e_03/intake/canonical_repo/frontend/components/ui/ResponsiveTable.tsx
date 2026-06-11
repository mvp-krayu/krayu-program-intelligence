// ResponsiveTable — table that transforms to card layout on mobile
// Session 26: mobile UX polish

import React, { useMemo } from 'react';
import { useMediaQuery } from '@/hooks';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  hideOnMobile?: boolean;
  width?: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
}

export default function ResponsiveTable({
  columns, data, onRowClick, emptyMessage = 'No records found', className = '', stickyHeader = false,
}: ResponsiveTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');

  // Filter columns for mobile
  const visibleCols = useMemo(
    () => isMobile ? columns.filter(c => !c.hideOnMobile) : columns,
    [columns, isMobile]
  );

  if (data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '32px 16px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: 8 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
        <p style={{ fontSize: '.74rem', color: 'var(--text-muted)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-card ${className}`} style={{ overflow: 'visible' }}>
      <table className="data-table">
        <thead style={stickyHeader ? { position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 } : {}}>
          <tr>
            {visibleCols.map(col => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={onRowClick ? { cursor: 'pointer' } : {}}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
            >
              {visibleCols.map(col => (
                <td key={col.key} data-label={col.label}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
