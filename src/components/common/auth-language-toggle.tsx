'use client';

import * as React from 'react';
import { useDashboardCopy, useI18n } from '@/components/providers/i18n-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CountryFlag } from '@/components/common/country-flag';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { DashboardLanguage } from '@/i18n/dictionaries';

const LANGUAGE_FLAGS: Record<string, string> = {
  en: 'US',
  id: 'ID',
  zh: 'CN',
  es: 'ES',
  ar: 'SA',
  hi: 'IN',
  pt: 'BR',
  ja: 'JP',
  ko: 'KR',
  fr: 'FR',
  de: 'DE',
  ru: 'RU',
};

export function AuthLanguageToggle() {
  const { language, setLanguage } = useI18n();
  const shellCopy = useDashboardCopy('shell');

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      <div className="w-36 sm:w-40 shrink-0">
        <Select
          value={language}
          onValueChange={(value) => {
            setLanguage(value as DashboardLanguage);
          }}
        >
          <SelectTrigger
            aria-label={shellCopy.language.label}
            className="h-9 w-full min-w-0 overflow-hidden bg-background/80 backdrop-blur-md border-border/60"
          >
            <SelectValue placeholder={shellCopy.language.placeholder}>
              {(value) => {
                const lang = typeof value === 'string' ? value : '';
                const flagCode = LANGUAGE_FLAGS[lang];
                const label = shellCopy.language.options[lang as DashboardLanguage] || lang;
                if (!flagCode) return label;
                return (
                  <span className="flex items-center gap-2 text-xs sm:text-sm min-w-0 w-full">
                    <CountryFlag countryCode={flagCode} className="shrink-0" />
                    <span className="truncate flex-1">{label}</span>
                  </span>
                );
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md">
            {Object.entries(LANGUAGE_FLAGS).map(([lang, flagCode]) => {
              const label = shellCopy.language.options[lang as DashboardLanguage] || lang;
              return (
                <SelectItem key={lang} value={lang} className="text-xs sm:text-sm">
                  <CountryFlag countryCode={flagCode} className="mr-2 shrink-0" />
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border border-border/60 bg-background/80 p-0.5 backdrop-blur-md flex items-center justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
