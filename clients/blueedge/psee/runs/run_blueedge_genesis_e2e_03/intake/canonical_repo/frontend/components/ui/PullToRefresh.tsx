// PullToRefresh — native-feel pull-to-refresh for mobile dashboards
// Session 26: mobile UX polish

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export default function PullToRefresh({ onRefresh, children, threshold = 80, disabled = false }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || refreshing) return;
    if (window.scrollY <= 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, [disabled, refreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || disabled || refreshing) return;
    const dy = Math.max(0, e.touches[0].clientY - startY.current);
    const dampened = Math.min(dy * 0.4, threshold * 1.5);
    setPullDistance(dampened);
  }, [pulling, disabled, refreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      try { await onRefresh(); } catch {}
      setRefreshing(false);
    }
    setPullDistance(0);
  }, [pulling, pullDistance, threshold, refreshing, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="ptr-container"
    >
      <div
        className={`ptr-indicator ${refreshing ? 'ptr-refreshing' : ''}`}
        style={{
          height: refreshing ? 48 : pullDistance,
          opacity: refreshing ? 1 : progress,
        }}
      >
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="var(--cyan)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: `rotate(${refreshing ? 0 : rotation}deg)` }}
          className={refreshing ? 'ptr-spinner' : ''}
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M21 21v-5h-5" />
        </svg>
      </div>
      {children}
    </div>
  );
}
