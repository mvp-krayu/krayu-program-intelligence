// ResponsiveGrid — adaptive grid wrapper that adjusts cols by viewport
// Session 26: mobile UX polish

import React from 'react';
import { useMediaQuery } from '@/hooks';

interface ResponsiveGridProps {
  cols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ResponsiveGrid({
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = 12,
  children,
  className = '',
  style,
}: ResponsiveGridProps) {
  const isXs = useMediaQuery('(max-width: 480px)');
  const isSm = useMediaQuery('(max-width: 768px)');
  const isMd = useMediaQuery('(max-width: 1024px)');
  const isLg = useMediaQuery('(max-width: 1440px)');

  const colCount = isXs ? (cols.xs ?? 1)
    : isSm ? (cols.sm ?? 2)
    : isMd ? (cols.md ?? 2)
    : isLg ? (cols.lg ?? 3)
    : (cols.xl ?? 4);

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// HorizontalScroll — for mobile gauge rows and chip sets
export function HorizontalScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        gap: 8,
        paddingBottom: 6,
        scrollSnapType: 'x mandatory',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {children}
    </div>
  );
}
