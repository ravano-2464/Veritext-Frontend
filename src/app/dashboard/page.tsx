'use client';

import { useQuery } from '@tanstack/react-query';
import { DetectionTrendChart } from '@/components/dashboard/detection-trend-chart';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { detectionService } from '@/services/detection.service';

export default function DashboardOverviewPage() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('overview');

  const historyQuery = useQuery({
    queryKey: ['detection-history-overview'],
    queryFn: () => detectionService.history(tokens!.accessToken, 1, 12),
    enabled: Boolean(tokens?.accessToken),
  });

  const items = historyQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <OverviewCards items={items} copy={copy.cards} />
      <DetectionTrendChart items={items} copy={copy.trend} />

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">{copy.notes.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{copy.notes.body}</CardContent>
      </Card>
    </div>
  );
}
