import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Language } from '@/types';
import { TRANSLATIONS } from '@/constants';

interface I18nContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() =>
    (localStorage.getItem('be-lang') as Language) || 'en'
  );

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('be-lang', next);
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      return next;
    });
  }, []);

  const t = useCallback((key: string): string => {
    return TRANSLATIONS[lang]?.[key] || key;
  }, [lang]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
