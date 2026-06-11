import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Preferences } from '@/types';
import { DEFAULT_PREFS } from '@/constants';

interface PrefsContextType {
  prefs: Preferences;
  setPref: (key: keyof Preferences, value: any) => void;
  resetPrefs: () => void;
}

const PrefsContext = createContext<PrefsContextType | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem('be-prefs') || '{}') }; }
    catch { return DEFAULT_PREFS; }
  });

  const setPref = useCallback((key: keyof Preferences, value: any) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('be-prefs', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    localStorage.setItem('be-prefs', JSON.stringify(DEFAULT_PREFS));
  }, []);

  return (
    <PrefsContext.Provider value={{ prefs, setPref, resetPrefs }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
