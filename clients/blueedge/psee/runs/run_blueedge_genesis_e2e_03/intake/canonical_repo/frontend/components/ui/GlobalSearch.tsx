// Extracted from dashboard.html — GlobalSearch
// Line 1160 | 62 lines

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '@/hooks';
import { SEARCH_INDEX } from '@/constants';
import { hasAccess } from '@/utils';

export default function GlobalSearch({ onNavigate, userRole }: any) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); setOpen(true); }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(item => {
      const accessible = hasAccess(userRole, item.id);
      const matches = item.label.toLowerCase().includes(q) || item.keywords.includes(q) || item.section.toLowerCase().includes(q);
      return matches && accessible;
    }).slice(0, 12);
  }, [query, userRole]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof results> = {};
    results.forEach(r => { if (!groups[r.section]) groups[r.section] = []; groups[r.section].push(r); });
    return groups;
  }, [results]);

  return (
    <div className="global-search">
      <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input ref={inputRef} placeholder={t('Search modules...')} value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { if (query.length >= 2) setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 200)} />
      {!query && <span className="search-kbd">⌘K</span>}
      {open && query.length >= 2 && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="sr-empty">No modules matching "{query}"</div>
          ) : (
            Object.entries(grouped).map(([section, items]) => (
              <div key={section}>
                <div className="sr-section">{section}</div>
                {items.map(item => (
                  <div key={item.id} className="sr-item" onMouseDown={() => { onNavigate(item.id); setQuery(''); setOpen(false); }}>
                    <Icon name={item.id === 'overview' ? 'dashboard' : item.id === 'tanker' ? 'tanker' : item.id === 'bus' ? 'bus' : item.id === 'taxi' ? 'taxi' : 'cube'} className="sr-icon" />
                    <span className="sr-label">{item.label}</span>
                    <span className="sr-section-name">{section}</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
