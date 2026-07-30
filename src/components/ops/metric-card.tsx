'use client';

import React from 'react';
import { SparklineChart } from './sparkline-chart';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { direction: 'up' | 'down' | 'stable'; value: string; positive?: boolean };
  status?: 'healthy' | 'warning' | 'critical';
  sparkline?: number[];
}

export function MetricCard({
  label,
  value,
  unit = '',
  trend,
  status = 'healthy',
  sparkline,
}: MetricCardProps) {
  const statusColors = {
    healthy: 'border-l-2 border-l-emerald-500 shadow-[inset_1px_0_0_0_rgba(16,185,129,0.1)]',
    warning: 'border-l-2 border-l-amber-500 shadow-[inset_1px_0_0_0_rgba(245,158,11,0.1)]',
    critical: 'border-l-2 border-l-red-500 shadow-[inset_1px_0_0_0_rgba(239,68,68,0.1)]',
  };

  const sparklineColor =
    status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#3b82f6';

  return (
    <div
      className={cn(
        'relative bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 transition-all duration-300 hover:border-[#2f2f2f] flex flex-col justify-between overflow-hidden',
        statusColors[status],
      )}
    >
      {}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

      <div className="flex justify-between items-start z-10">
        <span className="text-xs font-medium text-[#737373] tracking-wide uppercase">{label}</span>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full border',
              trend.direction === 'stable'
                ? 'bg-neutral-900/50 text-neutral-400 border-neutral-800'
                : trend.positive
                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/35'
                  : 'bg-red-950/20 text-red-400 border-red-900/35',
            )}
          >
            {trend.direction === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : trend.direction === 'down' ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mt-3 z-10">
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-semibold font-mono tracking-tight text-[#f5f5f5]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-xs text-[#737373] font-medium ml-0.5">{unit}</span>}
        </div>

        {sparkline && sparkline.length > 0 && (
          <SparklineChart data={sparkline} color={sparklineColor} />
        )}
      </div>
    </div>
  );
}
