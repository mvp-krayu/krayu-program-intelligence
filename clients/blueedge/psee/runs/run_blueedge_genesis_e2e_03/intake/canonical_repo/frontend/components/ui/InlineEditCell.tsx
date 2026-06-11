// Extracted from dashboard.html — InlineEditCell
// Line 5729 | 24 lines

import React, { useState, useEffect, useRef } from 'react';

export default function InlineEditCell({ value, onSave, type = 'text' }: any) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => {
    if (draft !== value) onSave(draft);
    setEditing(false);
  };

  if (editing) {
    return <input ref={inputRef} className="inline-edit-input" type={type} value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={save} onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }} />;
  }
  return (
    <div className="inline-edit-cell" onClick={() => { setDraft(value); setEditing(true); }}>
      {value || <span style={{color:'var(--text-muted)'}}>—</span>}
      <span className="inline-edit-hint">✎</span>
    </div>
  );
}
