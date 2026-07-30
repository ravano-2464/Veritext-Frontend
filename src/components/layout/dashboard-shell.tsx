'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  CreditCard,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanText,
  ShieldCheck,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import { useDashboardCopy, useI18n } from '@/components/providers/i18n-provider';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { BrandLogo } from '@/components/common/brand-logo';
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

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const shellCopy = useDashboardCopy('shell');
  const { language, setLanguage } = useI18n();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navItems = [
    { href: ROUTES.dashboard, label: shellCopy.nav.overview, icon: LayoutDashboard },
    { href: ROUTES.detector, label: shellCopy.nav.detector, icon: ScanText },
    { href: ROUTES.humanizer, label: shellCopy.nav.humanizer, icon: WandSparkles },
    { href: ROUTES.history, label: shellCopy.nav.history, icon: History },
    { href: ROUTES.analytics, label: shellCopy.nav.analytics, icon: BarChart3 },
    { href: ROUTES.api, label: shellCopy.nav.api, icon: KeyRound },
    { href: ROUTES.billing, label: shellCopy.nav.billing, icon: CreditCard },
    { href: ROUTES.admin, label: shellCopy.nav.admin, icon: ShieldCheck },
    { href: ROUTES.profile, label: shellCopy.nav.profile, icon: UserRound },
  ] as const;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      setIsLogoutDialogOpen(false);
      router.replace(ROUTES.login);
    } catch {
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navList = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: isActive ? 'secondary' : 'ghost' }),
              'justify-start gap-2',
              isActive && 'font-semibold',
            )}
          >
            <Icon />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      <header className="flex-none z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label={shellCopy.actions.openNavigation}
                  />
                }
              >
                <Menu />
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>
                    <BrandLogo />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">{navList}</div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-3">
              <BrandLogo className="hidden lg:inline-flex" />
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-40 shrink-0">
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
                      <SelectItem key={lang} value={lang}>
                        <CountryFlag countryCode={flagCode} className="mr-2 shrink-0" />
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden text-right sm:block w-28 md:w-48 min-w-0 overflow-hidden">
                <p className="text-sm font-medium truncate w-full">
                  {user?.fullName ?? shellCopy.fallbackUser.name}
                </p>
                <p
                  className="text-xs text-muted-foreground truncate w-full"
                  title={user?.email ?? shellCopy.fallbackUser.email}
                >
                  {user?.email ?? shellCopy.fallbackUser.email}
                </p>
              </div>
              <div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center shrink-0">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.fullName ?? ''}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                setIsLogoutDialogOpen(true);
              }}
            >
              <LogOut data-icon="inline-start" />
              {shellCopy.actions.signOut}
            </Button>
          </div>
        </div>
      </header>

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={(open) => {
          if (!isLoggingOut) {
            setIsLogoutDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{shellCopy.confirmSignOut.title}</AlertDialogTitle>
            <AlertDialogDescription>{shellCopy.confirmSignOut.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              {shellCopy.confirmSignOut.cancel}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              <LogOut data-icon="inline-start" />
              {isLoggingOut
                ? shellCopy.confirmSignOut.confirmLoading
                : shellCopy.confirmSignOut.confirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div id="dashboard-scroll-container" className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
          <aside className="hidden self-start rounded-2xl border border-border/60 bg-card/80 p-4 lg:sticky lg:top-6 lg:block">
            {navList}
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">{shellCopy.asideNote}</p>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
