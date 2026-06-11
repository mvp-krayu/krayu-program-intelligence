import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';

describe('useVirtualScroll', () => {
  it('calculates total height correctly', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 1000, itemHeight: 40, containerHeight: 400 })
    );
    expect(result.current.totalHeight).toBe(40000);
  });

  it('returns only visible items + overscan', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 1000, itemHeight: 40, containerHeight: 400, overscan: 5 })
    );
    // Visible: 400/40 = 10 items, + 5 overscan below = ~15 items
    expect(result.current.virtualItems.length).toBeLessThanOrEqual(20);
    expect(result.current.virtualItems.length).toBeGreaterThan(0);
  });

  it('virtual items have correct offsetTop', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 100, itemHeight: 50, containerHeight: 300 })
    );
    const items = result.current.virtualItems;
    if (items.length > 0) {
      expect(items[0].offsetTop).toBe(0);
      if (items.length > 1) {
        expect(items[1].offsetTop).toBe(50);
      }
    }
  });

  it('provides containerRef', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 100, itemHeight: 30, containerHeight: 300 })
    );
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerRef.current).toBeNull(); // Not mounted
  });

  it('provides scrollTo function', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 500, itemHeight: 40, containerHeight: 400 })
    );
    expect(typeof result.current.scrollTo).toBe('function');
  });

  it('handles zero items', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 0, itemHeight: 40, containerHeight: 400 })
    );
    expect(result.current.totalHeight).toBe(0);
    expect(result.current.virtualItems).toHaveLength(0);
  });

  it('handles single item', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({ itemCount: 1, itemHeight: 40, containerHeight: 400 })
    );
    expect(result.current.totalHeight).toBe(40);
    expect(result.current.virtualItems.length).toBeGreaterThanOrEqual(1);
  });
});
