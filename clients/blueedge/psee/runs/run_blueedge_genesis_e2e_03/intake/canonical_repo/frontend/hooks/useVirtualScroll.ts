// ── useVirtualScroll — Virtual scrolling for large lists ─────
// Renders only visible items + buffer for smooth scrolling
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;        // Extra items rendered above/below viewport
}

interface VirtualScrollResult {
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  containerRef: React.RefObject<HTMLDivElement>;
  scrollTo: (index: number) => void;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualScrollOptions): VirtualScrollResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;

  const virtualItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const items: { index: number; offsetTop: number }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, offsetTop: i * itemHeight });
    }
    return items;
  }, [scrollTop, itemCount, itemHeight, containerHeight, overscan]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollTop(container.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((index: number) => {
    containerRef.current?.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
  }, [itemHeight]);

  return { virtualItems, totalHeight, containerRef: containerRef as any, scrollTo };
}

export default useVirtualScroll;
