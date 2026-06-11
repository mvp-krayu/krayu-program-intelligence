// Topbar — responsive top navigation bar with mobile menu toggle
// Session 26: mobile UX polish

import React from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useMediaQuery } from '@/hooks';

interface TopbarProps {
  onMenuToggle: () => void;
  onSearch: () => void;
  userRole: string;
  userName?: string;
  alertCount?: number;
  onLogout: () => void;
}

export default function Topbar({ onMenuToggle, onSearch, userRole, userName, alertCount = 0, onLogout }: TopbarProps) {
  const { t, lang, toggleLang } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        {isMobile && (
          <button
            className="mobile-menu-btn"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            style={{ display: 'flex' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <span className="topbar-logo">Blue Edge</span>
        {!isMobile && (
          <span style={{ fontSize: '.68rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
            Fleet Management
          </span>
        )}
      </div>
      <div className="topbar-right">
        {/* Global search trigger */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onSearch}
          aria-label="Search"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          {!isMobile && <span style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>⌘K</span>}
        </button>

        {/* Alerts indicator */}
        <button className="btn btn-ghost btn-sm" aria-label={`${alertCount} alerts`} style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--red)', border: '2px solid var(--bg-card)',
            }} />
          )}
        </button>

        {/* Language toggle */}
        <button
          className="btn btn-ghost btn-sm lang-toggle"
          onClick={toggleLang}
          aria-label="Toggle language"
        >
          {lang === 'en' ? 'عر' : 'EN'}
        </button>

        {/* User avatar / role */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--cyan)', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.7rem', fontWeight: 700,
            }}>
              {(userName || userRole)[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
