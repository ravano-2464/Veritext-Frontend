import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SentenceData {
  sentenceIndex: number;
  sentence: string;
  aiProbability: number;
  confidence: number;
  isSuspicious?: boolean;
}

interface DetectionHeatmapProps {
  sentences: SentenceData[];
  className?: string;
}

function getHeatmapColor(probability: number): string {
  // Map probability (0-1) to a color scale.
  // 0 -> green/transparent, 1 -> deep red
  if (probability < 0.2) return 'bg-transparent hover:bg-green-500/10 text-foreground';
  if (probability < 0.4) return 'bg-yellow-500/10 hover:bg-yellow-500/20 text-foreground';
  if (probability < 0.6)
    return 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-950 dark:text-orange-100';
  if (probability < 0.8) return 'bg-red-500/30 hover:bg-red-500/40 text-red-950 dark:text-red-100';
  return 'bg-red-500/50 hover:bg-red-500/60 font-medium text-red-950 dark:text-red-100';
}

export function DetectionHeatmap({ sentences, className }: DetectionHeatmapProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        className={twMerge(
          'leading-relaxed text-lg p-6 rounded-xl border border-border/50 bg-background/50 shadow-inner',
          className,
        )}
      >
        {sentences.map((data) => (
          <Tooltip.Root key={data.sentenceIndex}>
            <Tooltip.Trigger asChild>
              <span
                className={clsx(
                  'inline px-0.5 rounded-sm transition-colors duration-200 cursor-help',
                  getHeatmapColor(data.aiProbability),
                )}
              >
                {data.sentence}{' '}
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                sideOffset={4}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">AI Probability:</span>
                    <span className="font-mono font-medium">
                      {(data.aiProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-mono font-medium">
                      {(data.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Tooltip.Arrow className="fill-border" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
