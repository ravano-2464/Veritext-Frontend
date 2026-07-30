'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to Sentry or another error tracking service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center bg-background">
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error while rendering this section. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
