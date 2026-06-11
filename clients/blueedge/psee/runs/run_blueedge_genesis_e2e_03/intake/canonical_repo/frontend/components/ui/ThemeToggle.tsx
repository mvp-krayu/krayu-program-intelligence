// ── ThemeToggle — Dark / Light / System theme switcher ───────
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const icon = resolvedTheme === 'dark' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  const options: { value: 'dark' | 'light' | 'system'; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
        title={`Theme: ${theme} (right-click for options)`}
        aria-label={`Switch theme, currently ${resolvedTheme}`}
      >
        {icon}
      </button>
      {showMenu && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '4px', minWidth: 140,
          boxShadow: 'var(--shadow)', zIndex: 999,
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setTheme(opt.value); setShowMenu(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '8px 12px', border: 'none', borderRadius: 'var(--radius-sm)',
                background: theme === opt.value ? 'var(--cyan-glow)' : 'transparent',
                color: theme === opt.value ? 'var(--cyan)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left',
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
              {theme === opt.value && <span style={{ marginLeft: 'auto' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
