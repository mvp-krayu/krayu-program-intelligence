// Loading — enhanced loading state with spinner and optional skeleton
// Session 26: mobile UX polish

import React from 'react';

interface LoadingProps {
  text?: string;
  fullscreen?: boolean;
  skeleton?: boolean;
}

export default function Loading({ text = 'Loading data...', fullscreen = false, skeleton = false }: LoadingProps) {
  if (skeleton) {
    return (
      <div style={{ padding: '16px 0' }}>
        <div className="skeleton-shimmer" style={{ width: '200px', height: 24, borderRadius: 6, marginBottom: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton-shimmer" style={{ width: '60%', height: 10, borderRadius: 4, marginBottom: 8 }} />
              <div className="skeleton-shimmer" style={{ width: '40%', height: 22, borderRadius: 4 }} />
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="skeleton-shimmer" style={{ width: '30%', height: 16, borderRadius: 4, marginBottom: 16 }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div className="skeleton-shimmer" style={{ width: '15%', height: 12, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: '25%', height: 12, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: '20%', height: 12, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: '15%', height: 12, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="loading" style={fullscreen ? {
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)',
      zIndex: 9000,
    } : {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', gap: 12,
    }}>
      <div className="loading-spinner" />
      <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{text}</span>
    </div>
  );
}
