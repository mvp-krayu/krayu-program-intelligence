// PageHeader — responsive page header with collapsible actions
// Session 26: mobile UX polish

import React, { useState } from 'react';
import { useI18n, useMediaQuery } from '@/hooks';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  right?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: { label: string; color?: string };
}

export default function PageHeader({ title, subtitle, breadcrumb, right, actions, badge }: PageHeaderProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [actionsExpanded, setActionsExpanded] = useState(false);

  return (
    <div className="page-header">
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && (
          <div className="breadcrumb" style={{ fontSize: '.65rem', color: 'var(--text-muted)', marginBottom: 2 }}>
            {t('Dashboard')} / <span style={{ color: 'var(--text-secondary)' }}>{t(breadcrumb)}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ margin: 0, lineHeight: 1.3 }}>{t(title)}</h2>
          {badge && (
            <span style={{
              fontSize: '.6rem', fontWeight: 600,
              padding: '2px 8px', borderRadius: 12,
              background: `var(--${badge.color || 'cyan'})`,
              color: badge.color === 'amber' || badge.color === 'green' ? '#000' : '#000',
            }}>
              {badge.label}
            </span>
          )}
        </div>
        {subtitle && !isMobile && (
          <div className="subtitle" style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{t(subtitle)}</div>
        )}
      </div>
      <div className="ph-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {right}
        {isMobile && actions && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setActionsExpanded(e => !e)}
            aria-label="Toggle actions"
            style={{ padding: '6px 8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        )}
        {!isMobile && actions}
      </div>
      {isMobile && actionsExpanded && actions && (
        <div style={{
          width: '100%', display: 'flex', flexWrap: 'wrap', gap: 6,
          paddingTop: 8, borderTop: '1px solid var(--border)',
          animation: 'slideUp 0.15s ease',
        }}>
          {actions}
        </div>
      )}
    </div>
  );
}
