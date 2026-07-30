import React from 'react';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import * as Tooltip from '@radix-ui/react-tooltip';

export type AiSourceStyle = 'CHATGPT' | 'CLAUDE' | 'GEMINI' | 'LLAMA' | 'MIXED' | 'UNKNOWN';

interface AiFingerprintBadgeProps {
  style: AiSourceStyle;
  confidence: number;
  className?: string;
}

export function AiFingerprintBadge({ style, confidence, className }: AiFingerprintBadgeProps) {
  if (style === 'UNKNOWN') {
    return null;
  }

  const getStyleConfig = (source: AiSourceStyle) => {
    switch (source) {
      case 'CHATGPT':
        return {
          label: 'ChatGPT-like Pattern',
          color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
          icon: Bot,
        };
      case 'CLAUDE':
        return {
          label: 'Claude-like Style',
          color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: Sparkles,
        };
      case 'GEMINI':
        return {
          label: 'Gemini-like Pattern',
          color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          icon: Sparkles,
        };
      case 'LLAMA':
        return {
          label: 'Llama-like Structure',
          color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          icon: Bot,
        };
      case 'MIXED':
        return {
          label: 'Mixed AI Patterns',
          color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'AI Generated',
          color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
          icon: Bot,
        };
    }
  };

  const config = getStyleConfig(style);
  const Icon = config.icon;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className={clsx(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-help',
              config.color,
              className,
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{config.label}</span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            sideOffset={4}
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Fingerprint Confidence
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs">{(confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
            <Tooltip.Arrow className="fill-border" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
