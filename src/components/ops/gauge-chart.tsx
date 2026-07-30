'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeChartProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function GaugeChart({
  value,
  label,
  size = 120,
  strokeWidth = 8,
  className,
}: GaugeChartProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const getZoneColor = (val: number) => {
    if (val >= 85) return 'stroke-red-500';
    if (val >= 70) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  const zoneColorClass = getZoneColor(clampedValue);

  return (
    <div className={cn('flex flex-col items-center justify-center font-mono', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#1f1f1f"
            strokeWidth={strokeWidth}
            className="transition-all duration-300"
          />
          {}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            className={cn('transition-all duration-500 ease-out', zoneColorClass)}
            style={{
              transformOrigin: '50% 50%',
              transform: 'rotate(90deg)',
            }}
          />
        </svg>
        {}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-[#f5f5f5] mt-1">
            {clampedValue}
            <span className="text-xs text-[#737373] font-medium ml-0.5">%</span>
          </span>
          <span className="text-[10px] text-[#737373] font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
