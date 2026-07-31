'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthPageFallback } from '@/components/common/auth-page-fallback';
import { BrandLogo } from '@/components/common/brand-logo';
import { GuestOnly } from '@/components/common/guest-only';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/constants/routes';
import { FindAccountResponse } from '@/lib/types/api';
import { FindAccountValues, findAccountSchema } from '@/lib/validators/auth.schemas';
import { authService } from '@/services/auth.service';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { AuthLanguageToggle } from '@/components/common/auth-language-toggle';

const getSignInMethodLabel = (
  account: NonNullable<FindAccountResponse['account']>,
  findAccountCopy: Record<string, string>,
) => {
  if (account.provider === 'GOOGLE' && account.canResetPassword) {
    return findAccountCopy.providerGooglePassword || 'Google dan password';
  }

  if (account.provider === 'GOOGLE') {
    return findAccountCopy.providerGoogle || 'Google';
  }

  return findAccountCopy.providerEmailPassword || 'Email dan password';
};

function FindAccountPageContent() {
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [account, setAccount] = useState<FindAccountResponse['account']>(null);

  const authCopy = useDashboardCopy('auth');
  const findAccountCopy = authCopy.findAccount;

  const form = useForm<FindAccountValues>({
    resolver: zodResolver(findAccountSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      setSubmitError(null);
      setAccount(null);

      try {
        const response = await authService.findAccount(values);

        if (!response.found || !response.account) {
          setSubmitError(findAccountCopy.errorNotFound || 'Belum ada akun yang terdaftar dengan email ini.');
          return;
        }

        setAccount(response.account);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : (findAccountCopy.errorDefault || 'Pencarian akun gagal. Coba lagi sebentar ya.'),
        );
      }
    },
    () => {
      setSubmitError(null);
      setAccount(null);
    },
  );

  return (
    <div className="relative min-h-screen">
      <AuthLanguageToggle />
      <main className="grid min-h-screen place-items-center px-4 py-10">
        <Card className="w-full max-w-md border-border/60 bg-card/90">
          <CardHeader className="space-y-4">
            <BrandLogo />
            <div className="space-y-2">
              <CardTitle className="text-2xl">{findAccountCopy.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {findAccountCopy.description}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">{findAccountCopy.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  placeholder={findAccountCopy.emailPlaceholder || "you@company.com"}
                  {...form.register('email')}
                />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              {submitError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {submitError}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                )}
                {findAccountCopy.button}
              </Button>
            </form>

            {account && (
              <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-sm font-medium text-foreground">{account.fullName}</p>
                <p className="text-sm text-muted-foreground">{account.email}</p>
                <p className="text-sm text-muted-foreground">
                  {findAccountCopy.loginMethod.replace('{method}', getSignInMethodLabel(account, findAccountCopy))}
                </p>
                {account.canResetPassword ? (
                  <Link
                    className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    href={`${ROUTES.forgotPassword}?email=${encodeURIComponent(account.email)}`}
                  >
                    {findAccountCopy.continueReset}
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {findAccountCopy.googleInfo}
                  </p>
                )}
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground">
              <Link
                className="font-medium text-foreground underline-offset-4 hover:underline"
                href={ROUTES.login}
              >
                {findAccountCopy.backToSignIn}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function FindAccountPage() {
  return (
    <GuestOnly>
      <Suspense
        fallback={
          <AuthPageFallback
            title="Find your account"
            description="Cari akun berdasarkan email. Nanti kita tampilkan akun yang cocok dan metode login-nya."
          />
        }
      >
        <FindAccountPageContent />
      </Suspense>
    </GuestOnly>
  );
}

