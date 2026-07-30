'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import { getCountryFlagUrl } from '@/lib/utils/country';
import { cn } from '@/lib/utils';

interface CountryFlagProps {
  countryCode?: string | null;
  countryName?: string;
  className?: string;
  iconClassName?: string;
}

export function CountryFlag({
  countryCode,
  countryName,
  className,
  iconClassName,
}: CountryFlagProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [countryCode]);

  if (!countryCode || hasError) {
    return (
      <span
        className={cn(
          'inline-flex h-4 w-6 items-center justify-center overflow-hidden rounded-[4px] border border-border/60 bg-muted/50',
          className,
        )}
      >
        <Globe className={cn('size-3.5 text-muted-foreground', iconClassName)} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex h-4 w-6 overflow-hidden rounded-[4px] border border-border/60 bg-muted/30 shadow-sm',
        className,
      )}
    >
      <Image
        src={getCountryFlagUrl(countryCode)}
        alt={countryName ? `${countryName} flag` : `${countryCode} flag`}
        width={24}
        height={16}
        sizes="24px"
        className="h-full w-full object-cover"
        onError={() => {
          setHasError(true);
        }}
      />
    </span>
  );
}
