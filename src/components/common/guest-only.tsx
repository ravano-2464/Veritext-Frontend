'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/constants/routes';

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (status !== 'loading' && isAuthenticated) {
      router.replace(ROUTES.dashboard);
    }
  }, [status, isAuthenticated, router]);

  if (status === 'loading') {
    return null;
  }

  return <>{children}</>;
}
