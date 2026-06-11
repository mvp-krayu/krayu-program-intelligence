// Extracted from dashboard.html — DetailView
// Line 1635 | 82 lines

import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import { fmtTime } from '@/utils';

export default function DetailView({ items, open, onClose, data, title }: any) {
  const [tab, setTab] = useState('details');

  // Generate mock activity history for any record
  const history = useMemo(() => {
    if (!data) return [];
    const id = data.id || 'unknown';
    const now = Date.now();
    return [
      { type:'create', action:'Record created', user:'admin@blueedge.ae', time: now - 86400000*3, details:null },
      { type:'update', action:'Status updated', user:'ops.manager@blueedge.ae', time: now - 86400000*2, details:{ field:'status', old:'pending', new: data.status||'active' }},
      { type:'update', action:'Details modified', user:'admin@blueedge.ae', time: now - 86400000, details:{ field:'notes', old:'—', new:'Updated via dashboard' }},
      ...(data.status === 'active' ? [{ type:'system', action:'Auto-verified by system', user:'system', time: now - 3600000, details:null }] : []),
    ];
  }, [data]);

  // Legacy mode — just items grid, no modal
  if (items && !open && open !== false) {
    return (
      <div className="detail-grid">
        {items.filter(i => i.value != null && i.value !== '' && i.value !== '—').map((item, idx) => (
          <div key={idx} className="detail-item">
            <div className="dl">{item.label}</div>
            <div className="dv">{item.value}</div>
          </div>
        ))}
      </div>
    );
  }

  // Modal mode — data object auto-rendered + history tab
  if (!open || !data) return null;

  const fields = Object.entries(data).filter(([k,v]) => !['__v','createdAt','updatedAt'].includes(k) && v != null && v !== '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal record-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || 'Record Details'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="record-tabs">
          <button className={`record-tab ${tab==='details'?'active':''}`} onClick={() => setTab('details')}>📋 Details</button>
          <button className={`record-tab ${tab==='history'?'active':''}`} onClick={() => setTab('history')}>🕐 History ({history.length})</button>
        </div>
        <div className="modal-body">
          {tab === 'details' ? (
            <div className="detail-grid">
              {fields.map(([key, value]) => (
                <div key={key} className="detail-item">
                  <div className="dl">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, s => s.toUpperCase())}</div>
                  <div className="dv">{typeof value === 'boolean' ? (value ? '✓ Yes' : '✗ No') : typeof value === 'object' ? JSON.stringify(value) : String(value)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="timeline">
              {history.map((h, i) => (
                <div key={i} className={`timeline-item ${h.type}`}>
                  <div className="timeline-action">{h.action}</div>
                  <div className="timeline-meta">
                    <span>👤 {h.user}</span> · <span>🕐 {fmtTime(h.time)}</span>
                  </div>
                  {h.details && (
                    <div className="timeline-diff">
                      <span style={{color:'var(--text-muted)'}}>{h.details.field}:</span>{' '}
                      <span className="diff-old">{h.details.old}</span> → <span className="diff-new">{h.details.new}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
