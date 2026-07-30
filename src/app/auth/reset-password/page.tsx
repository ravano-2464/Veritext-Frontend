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
import { PasswordInput } from '@/components/common/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import { ResetPasswordValues, resetPasswordSchema } from '@/lib/validators/auth.schemas';
import { authService } from '@/services/auth.service';

const getResetPasswordErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) {
    return 'Link reset password sudah tidak valid atau sudah kedaluwarsa.';
  }

  if (error instanceof ApiError && error.status === 409) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Password baru gagal disimpan. Coba lagi sebentar ya.';
};

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      form.clearErrors('root');

      if (!token) {
        form.setError('root', {
          message: 'Token reset password tidak ditemukan. Ulangi dari halaman forgot password.',
        });
        return;
      }

      try {
        await authService.resetPassword(token, values.password);
        router.replace(`${ROUTES.login}?reset=1`);
      } catch (error) {
        form.setError('root', {
          message: getResetPasswordErrorMessage(error),
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
            <CardTitle className="text-2xl">Create a new password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Buat password baru untuk akun kamu. Setelah berhasil, kamu akan diarahkan ke halaman
              login.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              Token reset password tidak ditemukan. Mulai lagi dari halaman forgot password.
            </p>
          )}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                aria-invalid={!!form.formState.errors.password}
                placeholder="Create a strong password"
                {...form.register('password')}
              />
              {form.formState.errors.password?.message && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                aria-invalid={!!form.formState.errors.confirmPassword}
                placeholder="Repeat your new password"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
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
              Save New Password
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Need another reset link?{' '}
            <Link
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href={ROUTES.forgotPassword}
            >
              Back to forgot password
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <GuestOnly>
      <Suspense
        fallback={
          <AuthPageFallback
            title="Create a new password"
            description="Buat password baru untuk akun kamu. Setelah berhasil, kamu akan diarahkan ke halaman login."
          />
        }
      >
        <ResetPasswordPageContent />
      </Suspense>
    </GuestOnly>
  );
}
