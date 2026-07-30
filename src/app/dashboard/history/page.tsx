'use client';

import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { PageSizeOption, PaginationControls } from '@/components/common/pagination-controls';
import { DetectionCharts } from '@/components/detection/detection-charts';
import { DetectionSummary } from '@/components/detection/detection-summary';
import { SentenceHeatmap } from '@/components/detection/sentence-heatmap';
import { HistoryTable } from '@/components/history/history-table';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { detectionService } from '@/services/detection.service';
import { reportService } from '@/services/report.service';

function HistoryPageContent() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('history');
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('focus');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  const historyQuery = useQuery({
    queryKey: ['detection-history', page, pageSize],
    queryFn: () => detectionService.history(tokens!.accessToken, page, pageSize),
    enabled: Boolean(tokens?.accessToken),
  });

  const focusedResultQuery = useQuery({
    queryKey: ['detection-result', selectedId],
    queryFn: () => detectionService.byId(tokens!.accessToken, selectedId!),
    enabled: Boolean(tokens?.accessToken && selectedId),
  });

  const items = historyQuery.data?.items ?? [];
  const downloadReport = async (format: 'pdf' | 'docx' | 'csv') => {
    if (!tokens?.accessToken || !focusedResultQuery.data) {
      return;
    }

    try {
      await reportService.download(tokens.accessToken, focusedResultQuery.data.id, format);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Report export failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <HistoryTable items={items} copy={copy.table} />
      <PaginationControls
        page={page}
        pageSize={pageSize}
        canPrevious={page > 1}
        canNext={items.length === pageSize}
        disabled={historyQuery.isFetching}
        onPageChange={setPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
      />

      {selectedId && focusedResultQuery.data && (
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl">
                {copy.focusedReportPrefix}: {focusedResultQuery.data.title ?? copy.untitled}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {(['pdf', 'docx', 'csv'] as const).map((format) => (
                  <Button
                    key={format}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void downloadReport(format);
                    }}
                  >
                    <Download data-icon="inline-start" />
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <DetectionSummary detection={focusedResultQuery.data} copy={copy.summary} />
            <DetectionCharts detection={focusedResultQuery.data} copy={copy.charts} />
            <SentenceHeatmap detection={focusedResultQuery.data} copy={copy.heatmap} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HistoryPageFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <Card className="border-border/60 bg-card/80">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryPageFallback />}>
      <HistoryPageContent />
    </Suspense>
  );
}
