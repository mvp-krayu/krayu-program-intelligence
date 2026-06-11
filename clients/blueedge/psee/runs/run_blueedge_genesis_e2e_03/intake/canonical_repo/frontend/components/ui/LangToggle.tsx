// ── LangToggle — English / Arabic language switcher ─────────
import React from 'react';
import { useI18n } from '@/contexts/I18nContext';

export default function LangToggle() {
  const { lang, toggleLang, dir } = useI18n();

  return (
    <button
      className="lang-toggle"
      onClick={toggleLang}
      title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 10px', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)', background: 'transparent',
        color: 'var(--text-secondary)', cursor: 'pointer',
        fontSize: '0.8rem', fontWeight: 600,
        transition: 'all 0.15s ease',
      }}
    >
      {lang === 'en' ? (
        <>
          <span style={{ fontFamily: "'Noto Sans Arabic', sans-serif", fontSize: '0.85rem' }}>ع</span>
          <span>AR</span>
        </>
      ) : (
        <>
          <span>EN</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </>
      )}
    </button>
  );
}
