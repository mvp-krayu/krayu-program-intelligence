import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Override the global localStorage mock for these tests
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
  removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
  clear: vi.fn(() => Object.keys(mockStorage).forEach(k => delete mockStorage[k])),
});

function TestConsumer() {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <span data-testid="isDark">{String(isDark)}</span>
      <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
      <button data-testid="setLight" onClick={() => setTheme('light')}>Light</button>
      <button data-testid="setDark" onClick={() => setTheme('dark')}>Dark</button>
      <button data-testid="setSystem" onClick={() => setTheme('system')}>System</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark', 'light');
  });

  it('defaults to dark theme', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(screen.getByTestId('isDark').textContent).toBe('true');
  });

  it('restores saved theme from localStorage', () => {
    mockStorage['be-theme'] = 'light';
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('toggles between dark and light', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('resolved').textContent).toBe('light');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('setTheme updates to specific theme', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('setLight'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('isDark').textContent).toBe('false');
  });

  it('persists theme to localStorage', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('setLight'));
    expect(localStorage.setItem).toHaveBeenCalledWith('be-theme', 'light');
  });

  it('applies data-theme attribute to document', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    fireEvent.click(screen.getByTestId('setLight'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('adds/removes CSS class on documentElement', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(screen.getByTestId('setLight'));
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('system theme resolves to dark by default (matchMedia mock)', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('setSystem'));
    expect(screen.getByTestId('theme').textContent).toBe('system');
    // Our mock matchMedia returns false for prefers-color-scheme: light → resolves dark
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('throws if useTheme used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useTheme must be used within ThemeProvider');
    spy.mockRestore();
  });
});
