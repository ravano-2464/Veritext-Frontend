import React from 'react';
import { clsx } from 'clsx';
import { SentenceData } from './DetectionHeatmap';

interface DiffViewProps {
  originalText: string;
  sentences: SentenceData[];
  className?: string;
}

export function DiffView({ originalText, sentences, className }: DiffViewProps) {
  // Reconstruct text with highlights
  const renderHighlighted = () => {
    return sentences.map((data) => (
      <span
        key={data.sentenceIndex}
        className={clsx(
          'transition-colors duration-200',
          data.isSuspicious
            ? 'bg-red-500/20 text-red-950 dark:text-red-100 font-medium'
            : 'text-foreground/80',
        )}
      >
        {data.sentence}{' '}
      </span>
    ));
  };

  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      <div className="flex flex-col border border-border/50 rounded-xl overflow-hidden bg-background">
        <div className="bg-muted/30 border-b border-border/50 px-4 py-2 font-semibold text-sm text-muted-foreground flex items-center justify-between">
          <span>Original Text</span>
        </div>
        <div className="p-4 overflow-y-auto whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
          {originalText}
        </div>
      </div>

      <div className="flex flex-col border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm">
        <div className="bg-red-500/5 border-b border-border/50 px-4 py-2 font-semibold text-sm text-red-900/70 dark:text-red-400 flex items-center justify-between">
          <span>AI Suspect Sentences</span>
        </div>
        <div className="p-4 overflow-y-auto whitespace-pre-wrap text-[15px] leading-relaxed">
          {renderHighlighted()}
        </div>
      </div>
    </div>
  );
}
