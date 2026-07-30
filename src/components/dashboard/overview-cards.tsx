'use client';

import { DetectionRecord } from '@/lib/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverviewCardsProps {
  items: DetectionRecord[];
  copy: {
    totalAnalyses: string;
    averageAiProbability: string;
    highRiskReports: string;
    queuedJobs: string;
  };
}

const percentage = (value: number): string => `${Math.round(value * 100)}%`;

export function OverviewCards({ items, copy }: OverviewCardsProps) {
  const total = items.length;
  const averageAi = total
    ? items.reduce((sum, item) => sum + item.overallAiProbability, 0) / total
    : 0;
  const highRisk = items.filter((item) => item.overallAiProbability >= 0.65).length;
  const queued = items.filter(
    (item) => item.status === 'PENDING' || item.status === 'PROCESSING',
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">{copy.totalAnalyses}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{total}</p>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            {copy.averageAiProbability}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{percentage(averageAi)}</p>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">{copy.highRiskReports}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{highRisk}</p>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">{copy.queuedJobs}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{queued}</p>
        </CardContent>
      </Card>
    </div>
  );
}
