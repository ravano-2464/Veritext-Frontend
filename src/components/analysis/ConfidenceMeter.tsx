import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { clsx } from 'clsx';

interface ConfidenceMeterProps {
  score: number; // 0 to 1
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConfidenceMeter({
  score,
  label = 'AI Probability',
  size = 'md',
  className,
}: ConfidenceMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return controls.stop;
  }, [score, count]);

  const sizeClasses = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', stroke: 6, labelText: 'text-xs' },
    md: { container: 'w-40 h-40', text: 'text-4xl', stroke: 8, labelText: 'text-sm' },
    lg: { container: 'w-56 h-56', text: 'text-6xl', stroke: 12, labelText: 'text-base' },
  };

  const { container, text, stroke, labelText } = sizeClasses[size];
  const radius = 50 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - displayValue * circumference;

  const getColor = (val: number) => {
    if (val < 0.2) return '#22c55e'; // green-500
    if (val < 0.5) return '#eab308'; // yellow-500
    if (val < 0.8) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <div className={clsx('relative flex flex-col items-center justify-center', className)}>
      <div className={clsx('relative', container)}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/20"
          />
          {/* Animated Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={getColor(displayValue)}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-colors duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className={clsx('font-bold font-mono tracking-tighter', text)}>
            {Math.round(displayValue * 100)}
            <span className="text-muted-foreground ml-1 text-sm">%</span>
          </motion.span>
          <span className={clsx('text-muted-foreground font-medium mt-1', labelText)}>{label}</span>
        </div>
      </div>
    </div>
  );
}
