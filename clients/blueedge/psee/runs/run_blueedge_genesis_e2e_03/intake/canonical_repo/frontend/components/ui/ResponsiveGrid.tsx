// ResponsiveGrid — auto-responsive grid wrapper with breakpoint-aware columns
// Session 26: mobile UX polish

import React from 'react';
import { useMediaQuery } from '@/hooks';

interface ResponsiveGridProps {
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveGrid({
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 14,
  children,
  className = '',
}: ResponsiveGridProps) {
  const isXl = useMediaQuery('(min-width: 1280px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isMd = useMediaQuery('(min-width: 768px)');

  const columns = isXl ? (cols.xl || 4)
    : isLg ? (cols.lg || 3)
    : isMd ? (cols.md || 2)
    : (cols.sm || 1);

  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}
