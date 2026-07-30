'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status:
    | 'healthy'
    | 'warning'
    | 'critical'
    | 'info'
    | 'active'
    | 'idle'
    | 'failed'
    | 'UNKNOWN'
    | 'HEALTHY'
    | 'DEGRADED'
    | 'DOWN';
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, pulse = false, className, children }: StatusBadgeProps) {
  const norm = status.toLowerCase();

  const colorMap = {
    healthy: 'bg-emerald-950/35 text-emerald-400 border-emerald-900/50',
    active: 'bg-emerald-950/35 text-emerald-400 border-emerald-900/50',
    idle: 'bg-blue-950/35 text-blue-400 border-blue-900/50',
    info: 'bg-neutral-900/50 text-[#f5f5f5] border-[#1f1f1f]',
    warning: 'bg-amber-950/35 text-amber-400 border-amber-900/50',
    degraded: 'bg-amber-950/35 text-amber-400 border-amber-900/50',
    critical: 'bg-red-950/35 text-red-400 border-red-900/50',
    failed: 'bg-red-950/35 text-red-400 border-red-900/50',
    down: 'bg-red-950/35 text-red-400 border-red-900/50',
    unknown: 'bg-neutral-900/50 text-[#737373] border-[#1f1f1f]',
  };

  const currentStyle = colorMap[norm as keyof typeof colorMap] || colorMap.unknown;

  const dotColors = {
    healthy: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    active: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    idle: 'bg-blue-400 shadow-[0_0_8px_#3b82f6]',
    info: 'bg-[#f5f5f5] shadow-[0_0_8px_#ffffff]',
    warning: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    degraded: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    critical: 'bg-red-400 shadow-[0_0_8px_#ef4444]',
    failed: 'bg-red-400 shadow-[0_0_8px_#ef4444]',
    down: 'bg-red-400 shadow-[0_0_8px_#ef4444]',
    unknown: 'bg-neutral-400',
  };

  const dotColor = dotColors[norm as keyof typeof dotColors] || dotColors.unknown;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium font-sans border tracking-wide uppercase',
        currentStyle,
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColor,
            )}
          />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColor)} />
        </span>
      )}
      {!pulse && <span className={cn('inline-block h-1.5 w-1.5 rounded-full', dotColor)} />}
      <span>{children ?? status}</span>
    </span>
  );
}
