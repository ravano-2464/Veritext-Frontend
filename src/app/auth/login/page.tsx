'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome, Github, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthPageFallback } from '@/components/common/auth-page-fallback';
import { BrandLogo } from '@/components/common/brand-logo';
import { GuestOnly } from '@/components/common/guest-only';
import { PasswordInput } from '@/components/common/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import { LoginValues, loginSchema } from '@/lib/validators/auth.schemas';
import { authService } from '@/services/auth.service';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { AuthLanguageToggle } from '@/components/common/auth-language-toggle';

const getLoginErrorMessage = (error: unknown, loginCopy: Record<string, string>) => {
  if (error instanceof ApiError && error.status === 401) {
    return loginCopy.errorInvalidCredentials || 'Email atau password tidak cocok. Kalau belum punya akun, silakan daftar dulu.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return loginCopy.errorDefault || 'Sign in gagal. Coba lagi sebentar ya.';
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const registerSuccess = searchParams.get('registered') === '1';
  const resetSuccess = searchParams.get('reset') === '1';

  const authCopy = useDashboardCopy('auth');
  const loginCopy = authCopy.login;

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      setSubmitError(null);

      try {
        await login(values);
        router.replace(ROUTES.dashboard);
      } catch (error) {
        setSubmitError(getLoginErrorMessage(error, loginCopy));
      }
    },
    () => {
      setSubmitError(null);
    },
  );

  return (
    <div className="relative min-h-screen">
      <AuthLanguageToggle />
      <main className="grid min-h-screen place-items-center px-4 py-10">
        <Card className="w-full max-w-md border-border/60 bg-card/90">
          <CardHeader className="space-y-4">
            <BrandLogo />
            <CardTitle className="text-2xl">{loginCopy.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {registerSuccess && (
              <p
                role="status"
                className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700"
              >
                {loginCopy.successRegister}
              </p>
            )}
            {resetSuccess && (
              <p
                role="status"
                className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700"
              >
                {loginCopy.successReset}
              </p>
            )}
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">{loginCopy.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  placeholder="you@company.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{loginCopy.passwordLabel}</Label>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  aria-invalid={!!form.formState.errors.password}
                  placeholder={loginCopy.passwordPlaceholder}
                  {...form.register('password')}
                />
                {form.formState.errors.password?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  href={ROUTES.forgotPassword}
                >
                  {loginCopy.forgotPassword}
                </Link>
                <Link
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  href={ROUTES.findAccount}
                >
                  {loginCopy.findAccount}
                </Link>
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
                {loginCopy.continue}
              </Button>
            </form>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = authService.googleOauthUrl();
              }}
            >
              <Chrome data-icon="inline-start" />
              {loginCopy.continueGoogle}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = authService.githubOauthUrl();
              }}
            >
              <Github data-icon="inline-start" />
              {loginCopy.continueGithub}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {loginCopy.newHere}{' '}
              <Link
                className="font-medium text-foreground underline-offset-4 hover:underline"
                href={ROUTES.register}
              >
                {loginCopy.createAccount}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GuestOnly>
      <Suspense fallback={<AuthPageFallback title="Sign in to VeriText" />}>
        <LoginPageContent />
      </Suspense>
    </GuestOnly>
  );
}

