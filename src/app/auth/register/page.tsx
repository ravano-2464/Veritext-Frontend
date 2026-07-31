'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { RegisterValues, registerSchema } from '@/lib/validators/auth.schemas';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { AuthLanguageToggle } from '@/components/common/auth-language-toggle';

const getRegisterErrorMessage = (error: unknown, registerCopy: Record<string, string>) => {
  if (error instanceof ApiError && error.status === 409) {
    return registerCopy.errorConflict || 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return registerCopy.errorDefault || 'Pendaftaran gagal. Coba lagi sebentar ya.';
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const authCopy = useDashboardCopy('auth');
  const registerCopy = authCopy.register;

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      setSubmitError(null);

      try {
        await register(values);
        router.replace(`${ROUTES.login}?registered=1`);
      } catch (error) {
        setSubmitError(getRegisterErrorMessage(error, registerCopy));
      }
    },
    () => {
      setSubmitError(null);
    },
  );

  return (
    <GuestOnly>
      <div className="relative min-h-screen">
        <AuthLanguageToggle />
        <main className="grid min-h-screen place-items-center px-4 py-10">
          <Card className="w-full max-w-md border-border/60 bg-card/90">
            <CardHeader className="space-y-4">
              <BrandLogo />
              <CardTitle className="text-2xl">{registerCopy.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="fullName">{registerCopy.fullNameLabel}</Label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    aria-invalid={!!form.formState.errors.fullName}
                    placeholder={registerCopy.fullNamePlaceholder}
                    {...form.register('fullName')}
                  />
                  {form.formState.errors.fullName?.message && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{registerCopy.emailLabel}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!form.formState.errors.email}
                    placeholder={registerCopy.emailPlaceholder}
                    {...form.register('email')}
                  />
                  {form.formState.errors.email?.message && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{registerCopy.passwordLabel}</Label>
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    aria-invalid={!!form.formState.errors.password}
                    placeholder={registerCopy.passwordPlaceholder}
                    {...form.register('password')}
                  />
                  {form.formState.errors.password?.message && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
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
                  {registerCopy.button}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                {registerCopy.alreadyHaveAccount}{' '}
                <Link
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                  href={ROUTES.login}
                >
                  {registerCopy.signIn}
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </GuestOnly>
  );
}

