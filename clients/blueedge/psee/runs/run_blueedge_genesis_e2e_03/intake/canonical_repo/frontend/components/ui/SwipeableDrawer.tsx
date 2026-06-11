// SwipeableDrawer — gesture-driven mobile sidebar drawer
// Session 26: mobile UX polish

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface SwipeableDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: number;
}

export default function SwipeableDrawer({ open, onClose, children, side = 'left', width = 280 }: SwipeableDrawerProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startTime = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
    setDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - startX.current;
    const clamped = side === 'left' ? Math.min(0, dx) : Math.max(0, dx);
    setDragX(clamped);
  }, [dragging, side]);

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    const velocity = Math.abs(dragX) / (Date.now() - startTime.current);
    // Close if dragged past 40% or fast flick
    if (Math.abs(dragX) > width * 0.4 || velocity > 0.5) {
      onClose();
    }
    setDragX(0);
  }, [dragX, width, onClose]);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const translateX = open ? dragX : (side === 'left' ? -width : width);
  const overlayOpacity = open ? Math.max(0, 0.5 * (1 - Math.abs(dragX) / width)) : 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${open ? 'drawer-overlay-visible' : ''}`}
        style={{ opacity: overlayOpacity }}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div
        className={`drawer-panel drawer-${side} ${open ? 'drawer-open' : ''}`}
        style={{
          width,
          transform: `translateX(${translateX}px)`,
          transition: dragging ? 'none' : 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </>
  );
}
