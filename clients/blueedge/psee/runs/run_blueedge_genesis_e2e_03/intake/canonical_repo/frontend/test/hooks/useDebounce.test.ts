import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );
    expect(result.current).toBe('first');

    rerender({ value: 'second' });
    expect(result.current).toBe('first'); // Not yet updated

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('second'); // Now updated
  });

  it('cancels previous timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => { vi.advanceTimersByTime(100); });
    rerender({ value: 'c' });
    act(() => { vi.advanceTimersByTime(100); });
    rerender({ value: 'd' });
    expect(result.current).toBe('a'); // Still first value

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('d'); // Jumped to last
  });

  it('works with custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'start' } }
    );
    rerender({ value: 'end' });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('start'); // Still waiting
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current).toBe('end'); // Now updated at 500ms
  });

  it('handles number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 42 } }
    );
    rerender({ value: 99 });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe(99);
  });

  it('handles null/undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: null as string | null } }
    );
    expect(result.current).toBeNull();
    rerender({ value: 'text' });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe('text');
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('debounces callback execution', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 200));

    act(() => { result.current('a'); });
    act(() => { result.current('b'); });
    act(() => { result.current('c'); });
    expect(callback).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(200); });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('c');
  });
});
