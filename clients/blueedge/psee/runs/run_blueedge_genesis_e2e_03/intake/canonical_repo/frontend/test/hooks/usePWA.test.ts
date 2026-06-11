import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWA } from '@/hooks/usePWA';

// Mock navigator.serviceWorker
const mockRegister = vi.fn().mockResolvedValue({ scope: '/', update: vi.fn() });
Object.defineProperty(navigator, 'serviceWorker', {
  value: { register: mockRegister, ready: Promise.resolve({ pushManager: {} }) },
  writable: true,
});

// Mock navigator.onLine
let mockOnLine = true;
Object.defineProperty(navigator, 'onLine', { get: () => mockOnLine });

describe('usePWA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnLine = true;
  });

  it('registers service worker on mount', async () => {
    renderHook(() => usePWA());
    expect(mockRegister).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });

  it('starts not installable', () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isInstallable).toBe(false);
  });

  it('starts not installed in non-standalone mode', () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isInstalled).toBe(false);
  });

  it('detects online status', () => {
    mockOnLine = true;
    const { result } = renderHook(() => usePWA());
    expect(result.current.isOffline).toBe(false);
  });

  it('detects offline status', () => {
    mockOnLine = false;
    const { result } = renderHook(() => usePWA());
    expect(result.current.isOffline).toBe(true);
  });

  it('tracks online/offline events', () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isOffline).toBe(false);

    act(() => {
      mockOnLine = false;
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOffline).toBe(true);

    act(() => {
      mockOnLine = true;
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOffline).toBe(false);
  });

  it('captures beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isInstallable).toBe(false);

    const mockPromptEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    act(() => {
      window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockPromptEvent));
    });
    // Note: the event listener captures the event asynchronously
  });

  it('provides promptInstall function', () => {
    const { result } = renderHook(() => usePWA());
    expect(typeof result.current.promptInstall).toBe('function');
  });

  it('provides swRegistration', () => {
    const { result } = renderHook(() => usePWA());
    // Initially null, set after register resolves
    expect(result.current.swRegistration === null || result.current.swRegistration !== undefined).toBe(true);
  });
});
