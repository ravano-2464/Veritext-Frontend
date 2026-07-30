'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function LiveIndicator({ active = true, onClick, className }: LiveIndicatorProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono transition-all duration-200 focus:outline-none select-none',
        active
          ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/30'
          : 'bg-neutral-900/40 text-neutral-500 border-[#1f1f1f] hover:bg-neutral-900/60',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {active && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full h-2 w-2 transition-colors duration-200',
            active ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-neutral-600',
          )}
        />
      </span>
      <span className="font-semibold tracking-wider uppercase">{active ? 'Live' : 'Paused'}</span>
    </button>
  );
}
