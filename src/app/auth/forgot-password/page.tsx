'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
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
import { ApiError } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import { ForgotPasswordValues, forgotPasswordSchema } from '@/lib/validators/auth.schemas';
import { authService } from '@/services/auth.service';

const getForgotPasswordErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 404) {
    return 'Email ini belum terdaftar. Coba cek lagi atau cari akun terlebih dulu.';
  }

  if (error instanceof ApiError && error.status === 400) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Permintaan reset password gagal. Coba lagi sebentar ya.';
};

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      form.clearErrors('root');

      try {
        const response = await authService.forgotPassword(values);
        router.replace(`${ROUTES.resetPassword}?token=${encodeURIComponent(response.resetToken)}`);
      } catch (error) {
        form.setError('root', {
          message: getForgotPasswordErrorMessage(error),
        });
      }
    },
    () => {
      form.clearErrors('root');
    },
  );

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md border-border/60 bg-card/90">
        <CardHeader className="space-y-4">
          <BrandLogo />
          <div className="space-y-2">
            <CardTitle className="text-2xl">Forgot password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Masukkan email akun kamu. Kalau ditemukan, kita lanjut ke halaman buat password baru.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
            {form.formState.errors.root?.message && (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {form.formState.errors.root.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              )}
              Continue to Reset
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Remember your password?{' '}
              <Link
                className="font-medium text-foreground underline-offset-4 hover:underline"
                href={ROUTES.login}
              >
                Back to sign in
              </Link>
            </p>
            <p className="mt-2">
              Not sure which email you used?{' '}
              <Link
                className="font-medium text-foreground underline-offset-4 hover:underline"
                href={ROUTES.findAccount}
              >
                Find account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <GuestOnly>
      <Suspense
        fallback={
          <AuthPageFallback
            title="Forgot password"
            description="Masukkan email akun kamu. Kalau ditemukan, kita lanjut ke halaman buat password baru."
            footerLines={2}
          />
        }
      >
        <ForgotPasswordPageContent />
      </Suspense>
    </GuestOnly>
  );
}
