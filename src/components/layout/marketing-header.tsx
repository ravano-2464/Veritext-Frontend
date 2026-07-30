'use client';

import * as React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { BrandLogo } from '@/components/common/brand-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useDashboardCopy, useI18n } from '@/components/providers/i18n-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CountryFlag } from '@/components/common/country-flag';
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

export function MarketingHeader() {
  const { isAuthenticated } = useAuth();
  const marketingCopy = useDashboardCopy('marketing');
  const shellCopy = useDashboardCopy('shell');
  const { language, setLanguage } = useI18n();

  const links = [
    { href: '#features', label: marketingCopy.header.features },
    { href: '#analytics', label: marketingCopy.header.analytics },
    { href: '#api', label: marketingCopy.header.api },
    { href: '#pricing', label: marketingCopy.header.pricing },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <ThemeToggle />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-36 sm:w-44 shrink-0">
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value as DashboardLanguage);
              }}
            >
              <SelectTrigger
                aria-label={shellCopy.language.label}
                className="h-9 w-full min-w-0 overflow-hidden"
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
              <SelectContent>
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

          {isAuthenticated ? (
            <Link href={ROUTES.dashboard} className={buttonVariants({ size: 'sm' })}>
              {marketingCopy.header.dashboard}
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'hidden sm:inline-flex',
                )}
              >
                {marketingCopy.header.signIn}
              </Link>
              <Link href={ROUTES.register} className={buttonVariants({ size: 'sm' })}>
                {marketingCopy.header.startFree}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
