// BottomSheet — mobile-native action sheet sliding up from bottom
// Session 26: mobile UX polish

import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const sheetRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    // Prevent body scroll when sheet is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // On desktop, render as centered modal
  if (!isMobile) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" style={{ maxWidth: 420, maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
          {title && (
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '.88rem', fontWeight: 600 }}>{title}</h3>
              <button className="btn-ghost btn-sm" onClick={onClose} aria-label="Close">✕</button>
            </div>
          )}
          <div className="modal-body" style={{ padding: 16, overflowY: 'auto' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="bottom-sheet-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 998, animation: 'fadeIn .2s ease',
          backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        }}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Action sheet'}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
          background: 'var(--bg-card)', borderRadius: '16px 16px 0 0',
          border: '1px solid var(--border)', borderBottom: 'none',
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          animation: 'slideUpSheet .25s ease',
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}
      >
        {/* Drag handle */}
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '10px 0 6px',
        }}>
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: 'var(--text-muted)', opacity: 0.4,
          }} />
        </div>
        {title && (
          <div style={{
            padding: '0 16px 10px', borderBottom: '1px solid var(--border)',
            fontWeight: 600, fontSize: '.84rem', color: 'var(--text-primary)',
          }}>
            {title}
          </div>
        )}
        <div style={{ padding: 16, overflowY: 'auto', WebkitOverflowScrolling: 'touch', flex: 1 }}>
          {children}
        </div>
      </div>
      <style>{`@keyframes slideUpSheet{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </>
  );
}
