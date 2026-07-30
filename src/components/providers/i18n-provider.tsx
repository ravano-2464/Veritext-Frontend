'use client';

import * as React from 'react';
import {
  DashboardCopyMap,
  DashboardLanguage,
  DashboardPageKey,
  dashboardDictionaries,
} from '@/i18n/dictionaries';

const LANGUAGE_STORAGE_KEY = 'veritext-dashboard-language';

interface I18nContextValue {
  language: DashboardLanguage;
  setLanguage: (language: DashboardLanguage) => void;
  dashboard: DashboardCopyMap;
}

const I18nContext = React.createContext<I18nContextValue | undefined>(undefined);

const isDashboardLanguage = (value: string): value is DashboardLanguage =>
  ['en', 'id', 'zh', 'es', 'ar', 'hi', 'pt', 'ja', 'ko', 'fr', 'de', 'ru'].includes(value);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<DashboardLanguage>('en');

  React.useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isDashboardLanguage(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = React.useCallback((nextLanguage: DashboardLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const contextValue = React.useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      dashboard: dashboardDictionaries[language],
    }),
    [language, setLanguage],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider.');
  }

  return context;
}

export function useDashboardCopy<Page extends DashboardPageKey>(
  page: Page,
): DashboardCopyMap[Page] {
  const { dashboard } = useI18n();
  return dashboard[page];
}
