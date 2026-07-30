'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface QueueProgressBarProps {
  active: number;
  concurrency: number;
  waiting: number;
  className?: string;
}

export function QueueProgressBar({
  active,
  concurrency,
  waiting,
  className,
}: QueueProgressBarProps) {
  const totalBlocks = 10;

  const safeConcurrency = Math.max(1, concurrency);
  const activeRatio = active / safeConcurrency;

  const activeBlocks = Math.min(totalBlocks, Math.round(activeRatio * totalBlocks));
  const emptyBlocks = totalBlocks - activeBlocks;

  const blocksHtml = (
    <span className="font-mono text-xs tracking-tight select-none">
      <span className="text-emerald-500">{'■'.repeat(activeBlocks)}</span>
      <span className="text-neutral-800">{'□'.repeat(emptyBlocks)}</span>
    </span>
  );

  return (
    <div className={cn('flex items-center gap-3 font-mono text-xs text-[#737373]', className)}>
      {blocksHtml}
      <div className="flex gap-2">
        <span className="text-[#f5f5f5] font-semibold">
          {active} <span className="text-[#737373] font-normal">active</span>
        </span>
        <span className="text-neutral-600">|</span>
        <span
          className={cn(
            waiting > 100
              ? 'text-amber-400 font-semibold animate-pulse'
              : waiting > 500
                ? 'text-red-400 font-semibold animate-pulse'
                : 'text-[#737373]',
          )}
        >
          {waiting} <span className="text-[#737373] font-normal">waiting</span>
        </span>
      </div>
    </div>
  );
}
