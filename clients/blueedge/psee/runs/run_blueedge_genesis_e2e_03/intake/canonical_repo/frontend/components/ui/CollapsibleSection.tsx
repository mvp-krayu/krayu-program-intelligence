// CollapsibleSection — auto-collapses on mobile, always open on desktop
// Session 26: mobile UX polish

import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}

export default function CollapsibleSection({ title, children, defaultOpen = true, badge }: CollapsibleSectionProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Always open on desktop
  const open = isMobile ? isOpen : true;

  return (
    <div className="collapsible-section" style={{ marginBottom: 14 }}>
      {isMobile && (
        <button
          onClick={() => setIsOpen(o => !o)}
          className="collapsible-header"
          aria-expanded={open}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: open ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
            padding: '10px 14px', cursor: 'pointer', color: 'var(--text-primary)',
            fontFamily: 'var(--font)', fontSize: '.78rem', fontWeight: 600,
            WebkitTapHighlightColor: 'transparent',
            transition: 'border-radius .15s ease',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {title}
            {badge}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transition: 'transform .2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
      {!isMobile && title && (
        <h3 style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
          {title} {badge}
        </h3>
      )}
      <div style={{
        maxHeight: open ? '2000px' : '0',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transition: isMobile ? 'max-height .3s ease, opacity .2s ease' : 'none',
      }}>
        {children}
      </div>
    </div>
  );
}
