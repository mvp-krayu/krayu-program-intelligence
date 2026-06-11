// MobileCardList — Card-based data view for mobile (replaces tables on small screens)
// Session 27: mobile UX polish

import React from 'react';
import { useMediaQuery, useI18n } from '@/hooks';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

interface MobileCardListProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  className?: string;
}

export default function MobileCardList({ data, columns, onRowClick, emptyMessage, className = '' }: MobileCardListProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useI18n();

  if (!isMobile) return null; // Only renders on mobile

  if (data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">{t(emptyMessage || 'No records found')}</div>
      </div>
    );
  }

  const highPriCols = columns.filter(c => c.priority !== 'low');
  const primaryCol = columns[0];
  const secondaryCol = columns[1];

  return (
    <div className={`mobile-card-list ${className}`}>
      {data.map((row, idx) => (
        <div
          key={idx}
          className="mobile-card-item touch-active"
          onClick={() => onRowClick?.(row)}
          role={onRowClick ? 'button' : undefined}
          tabIndex={onRowClick ? 0 : undefined}
        >
          <div className="mobile-card-primary">
            <span className="mobile-card-title">
              {primaryCol?.render ? primaryCol.render(row[primaryCol.key], row) : row[primaryCol?.key]}
            </span>
            {secondaryCol && (
              <span className="mobile-card-subtitle">
                {secondaryCol.render ? secondaryCol.render(row[secondaryCol.key], row) : row[secondaryCol.key]}
              </span>
            )}
          </div>
          <div className="mobile-card-fields">
            {highPriCols.slice(2).map(col => (
              <div key={col.key} className="mobile-card-field">
                <span className="mobile-card-field-label">{t(col.label)}</span>
                <span className="mobile-card-field-value">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </span>
              </div>
            ))}
          </div>
          {onRowClick && (
            <svg className="mobile-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          )}
        </div>
      ))}
    </div>
  );
}
