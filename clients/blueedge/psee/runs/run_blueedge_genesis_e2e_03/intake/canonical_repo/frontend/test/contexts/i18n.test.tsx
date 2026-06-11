import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { I18nProvider, useI18n } from '@/contexts/I18nContext';

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

function TestConsumer() {
  const { lang, dir, t, toggleLang } = useI18n();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="t-vehicles">{t('Vehicles')}</span>
      <span data-testid="t-drivers">{t('Drivers')}</span>
      <span data-testid="t-unknown">{t('Unknown Key')}</span>
      <button data-testid="toggle" onClick={toggleLang}>Toggle</button>
    </div>
  );
}

describe('I18nContext', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
    document.documentElement.dir = 'ltr';
  });

  it('defaults to English', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
  });

  it('restores saved language from localStorage', () => {
    mockStorage['be-lang'] = 'ar';
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('ar');
    expect(screen.getByTestId('dir').textContent).toBe('rtl');
  });

  it('toggles between en and ar', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('en');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('lang').textContent).toBe('ar');
    expect(screen.getByTestId('dir').textContent).toBe('rtl');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
  });

  it('translates known keys in Arabic', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    fireEvent.click(screen.getByTestId('toggle')); // switch to Arabic
    expect(screen.getByTestId('t-vehicles').textContent).toBe('المركبات');
    expect(screen.getByTestId('t-drivers').textContent).toBe('السائقين');
  });

  it('returns key as-is in English (fallback)', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    expect(screen.getByTestId('t-vehicles').textContent).toBe('Vehicles');
    expect(screen.getByTestId('t-drivers').textContent).toBe('Drivers');
  });

  it('returns key for unknown translations', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    expect(screen.getByTestId('t-unknown').textContent).toBe('Unknown Key');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('t-unknown').textContent).toBe('Unknown Key');
  });

  it('persists language to localStorage', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    fireEvent.click(screen.getByTestId('toggle'));
    expect(localStorage.setItem).toHaveBeenCalledWith('be-lang', 'ar');
  });

  it('sets document.dir for RTL support', () => {
    render(<I18nProvider><TestConsumer /></I18nProvider>);
    fireEvent.click(screen.getByTestId('toggle'));
    expect(document.documentElement.dir).toBe('rtl');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('throws if useI18n used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useI18n must be used within I18nProvider');
    spy.mockRestore();
  });
});
