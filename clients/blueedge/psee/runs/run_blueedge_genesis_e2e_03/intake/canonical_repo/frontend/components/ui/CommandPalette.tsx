// Extracted from dashboard.html — CommandPalette
// Line 5543 | 56 lines

import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function CommandPalette({ open, onClose, onNavigate, sections }: any) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  const allItems = useMemo(() => {
    if (!sections) return [];
    return sections.flatMap(s => s.items.map(item => ({ ...item, section: s.title })));
  }, [sections]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(item => item.label.toLowerCase().includes(q) || item.section.toLowerCase().includes(q) || (item.id && item.id.toLowerCase().includes(q)));
  }, [allItems, query]);

  useEffect(() => { if (open) { setQuery(''); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  useEffect(() => { setActiveIdx(0); }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && filtered[activeIdx]) { onNavigate(filtered[activeIdx].id); onClose(); }
    else if (e.key === 'Escape') onClose();
  };

  if (!open) return null;
  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <span style={{color:'var(--text-muted)',fontSize:'1rem'}}>🔍</span>
          <input ref={inputRef} className="cmd-input" placeholder="Type a page name to navigate..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey} />
          <kbd style={{background:'var(--bg-primary)',border:'1px solid var(--border)',borderRadius:3,padding:'2px 6px',fontSize:'.6rem',color:'var(--text-muted)',fontFamily:'var(--mono)'}}>ESC</kbd>
        </div>
        <div className="cmd-results">
          {filtered.length === 0 ? <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',fontSize:'.8rem'}}>No results found</div> :
          filtered.slice(0, 12).map((item, i) => (
            <div key={item.id} className={`cmd-item ${i === activeIdx ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onClose(); }}
              onMouseEnter={() => setActiveIdx(i)}>
              <div className="cmd-icon"><Icon name={item.icon || 'cube'} size={14} /></div>
              <span className="cmd-label">{item.label}</span>
              <span className="cmd-section">{item.section}</span>
            </div>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
