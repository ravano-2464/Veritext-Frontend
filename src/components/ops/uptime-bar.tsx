'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface UptimeBarProps {
  history: boolean[];
  className?: string;
}

export function UptimeBar({ history, className }: UptimeBarProps) {
  const paddedHistory = React.useMemo(() => {
    const requiredLength = 90;
    if (history.length >= requiredLength) {
      return history.slice(-requiredLength);
    }
    const padding = Array(requiredLength - history.length).fill(true);
    return [...padding, ...history];
  }, [history]);

  const uptimePct = React.useMemo(() => {
    const healthyCount = paddedHistory.filter(Boolean).length;
    return ((healthyCount / paddedHistory.length) * 100).toFixed(2);
  }, [paddedHistory]);

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      <div className="flex justify-between items-center text-[10px] text-[#737373] font-mono">
        <span>90d ago</span>
        <span className="text-emerald-400 font-semibold">{uptimePct}% uptime</span>
        <span>Today</span>
      </div>

      <div className="flex gap-[2px] items-center justify-between w-full h-[18px]">
        <TooltipProvider delay={100}>
          {paddedHistory.map((isHealthy, index) => {
            const dayNum = 90 - index;
            const dateStr = dayNum === 0 ? 'Today' : `${dayNum} days ago`;
            const statusText = isHealthy ? '100% Operational' : 'Degraded Performance';

            return (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      'flex-1 h-full rounded-[1px] transition-all hover:scale-y-125 cursor-pointer',
                      isHealthy
                        ? 'bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_4px_#10b981]'
                        : 'bg-amber-500 hover:bg-amber-400 hover:shadow-[0_0_4px_#f59e0b]',
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-[#111111] border border-[#1f1f1f] text-[11px] font-mono p-2 text-[#f5f5f5] rounded shadow-lg">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#737373]">{dateStr}</span>
                    <span
                      className={cn(
                        'font-semibold',
                        isHealthy ? 'text-emerald-400' : 'text-amber-450',
                      )}
                    >
                      {statusText}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
