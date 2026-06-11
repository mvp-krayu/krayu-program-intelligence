// MobileBottomNav — Enhanced bottom tab bar with Lucide icons and active indicator
// Session 26: mobile UX polish

import React, { useState, useEffect } from 'react';
import { useI18n, useMediaQuery } from '@/hooks';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Home', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'vehicles', label: 'Fleet', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { id: 'alerts', label: 'Alerts', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: 'trips', label: 'Trips', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> },
  { id: 'more', label: 'More', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg> },
];

export default function MobileBottomNav({ page, onNavigate, onToggleMenu, alertCount }: {
  page: string;
  onNavigate: (id: string) => void;
  onToggleMenu: () => void;
  alertCount?: number;
}) {
  const { t } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [pressedId, setPressedId] = useState<string | null>(null);

  if (!isMobile) return null;

  const items = NAV_ITEMS.map(item => ({
    ...item,
    badge: item.id === 'alerts' ? alertCount : undefined,
  }));

  return (
    <nav className="mobile-bottom-nav" role="tablist" aria-label="Navigation">
      {items.map(item => {
        const isActive = item.id === 'more' ? false : page === item.id;
        const isPressed = pressedId === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            aria-label={t(item.label)}
            className={`bnav-item ${isActive ? 'active' : ''} ${isPressed ? 'pressed' : ''}`}
            onTouchStart={() => setPressedId(item.id)}
            onTouchEnd={() => { setPressedId(null); }}
            onClick={() => item.id === 'more' ? onToggleMenu() : onNavigate(item.id)}
          >
            <span className="bnav-icon">{item.icon}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="bnav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
            )}
            <span className="bnav-label">{t(item.label)}</span>
            {isActive && <span className="bnav-indicator" />}
          </button>
        );
      })}
    </nav>
  );
}
