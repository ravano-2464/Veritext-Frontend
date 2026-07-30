import { DetectionRecord } from '@/lib/types/api';
import { cn } from '@/lib/utils';

interface SentenceHeatmapProps {
  detection: DetectionRecord;
  copy: {
    title: string;
    sentenceLabel: string;
    aiLabel: string;
  };
}

const scoreClass = (score: number): string => {
  if (score >= 0.8) return 'bg-red-500/25 border-red-500/40';
  if (score >= 0.65) return 'bg-orange-500/20 border-orange-500/35';
  if (score >= 0.45) return 'bg-amber-500/15 border-amber-500/30';
  return 'bg-emerald-500/15 border-emerald-500/30';
};

export function SentenceHeatmap({ detection, copy }: SentenceHeatmapProps) {
  return (
    <section>
      <h3 className="text-lg font-semibold">{copy.title}</h3>
      <div className="mt-3 grid gap-2">
        {detection.sentenceAnalyses.map((sentence) => (
          <article
            key={`${detection.id}-${sentence.sentenceIndex}`}
            className={cn('rounded-xl border p-3 text-sm', scoreClass(sentence.aiProbability))}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {copy.sentenceLabel} {sentence.sentenceIndex + 1}
              </span>
              <span>
                {copy.aiLabel} {Math.round(sentence.aiProbability * 100)}%
              </span>
            </div>
            <p className="leading-relaxed">{sentence.sentence}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
