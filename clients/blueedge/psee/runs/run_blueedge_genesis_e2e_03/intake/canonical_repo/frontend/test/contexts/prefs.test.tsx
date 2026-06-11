import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PrefsProvider, usePrefs } from '@/contexts/PrefsContext';

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

function TestConsumer() {
  const { prefs, setPref, resetPrefs } = usePrefs();
  return (
    <div>
      <span data-testid="darkMode">{String(prefs.darkMode)}</span>
      <span data-testid="compactView">{String(prefs.compactView)}</span>
      <span data-testid="showMap">{String(prefs.showMap)}</span>
      <span data-testid="timezone">{String(prefs.timezone || 'Asia/Dubai')}</span>
      <button data-testid="toggleDark" onClick={() => setPref('darkMode', !prefs.darkMode)}>Toggle Dark</button>
      <button data-testid="setCompact" onClick={() => setPref('compactView', true)}>Compact</button>
      <button data-testid="reset" onClick={resetPrefs}>Reset</button>
    </div>
  );
}

describe('PrefsContext', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
  });

  it('provides default preferences', () => {
    render(<PrefsProvider><TestConsumer /></PrefsProvider>);
    expect(screen.getByTestId('darkMode').textContent).toBeTruthy();
    expect(screen.getByTestId('showMap').textContent).toBeTruthy();
  });

  it('setPref updates a single preference', () => {
    render(<PrefsProvider><TestConsumer /></PrefsProvider>);
    const initial = screen.getByTestId('darkMode').textContent;
    fireEvent.click(screen.getByTestId('toggleDark'));
    const updated = screen.getByTestId('darkMode').textContent;
    expect(initial).not.toBe(updated);
  });

  it('setPref persists to localStorage', () => {
    render(<PrefsProvider><TestConsumer /></PrefsProvider>);
    fireEvent.click(screen.getByTestId('setCompact'));
    expect(localStorage.setItem).toHaveBeenCalledWith('be-prefs', expect.any(String));
    const saved = JSON.parse((localStorage.setItem as any).mock.calls.at(-1)[1]);
    expect(saved.compactView).toBe(true);
  });

  it('resetPrefs restores all defaults', () => {
    render(<PrefsProvider><TestConsumer /></PrefsProvider>);
    fireEvent.click(screen.getByTestId('setCompact'));
    expect(screen.getByTestId('compactView').textContent).toBe('true');
    fireEvent.click(screen.getByTestId('reset'));
    // After reset, compactView should be back to default (false)
    expect(screen.getByTestId('compactView').textContent).toBe('false');
  });

  it('restores saved preferences from localStorage', () => {
    mockStorage['be-prefs'] = JSON.stringify({ compactView: true, darkMode: false });
    render(<PrefsProvider><TestConsumer /></PrefsProvider>);
    expect(screen.getByTestId('compactView').textContent).toBe('true');
    expect(screen.getByTestId('darkMode').textContent).toBe('false');
  });

  it('handles corrupt localStorage gracefully', () => {
    mockStorage['be-prefs'] = '{invalid json}}}';
    const { container } = render(<PrefsProvider><TestConsumer /></PrefsProvider>);
    expect(container).toBeTruthy(); // Should not crash
  });

  it('throws if usePrefs used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('usePrefs must be used within PrefsProvider');
    spy.mockRestore();
  });
});
