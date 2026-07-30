'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  PageSizeOption,
  PaginationControls,
  paginateItems,
} from '@/components/common/pagination-controls';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { formatAiFingerprint } from '@/lib/utils';
import { analyticsService } from '@/services/analytics.service';
import { organizationService } from '@/services/organization.service';
import { useWorkspaceStore } from '@/store/workspace-store';

const pct = (value: number) => `${Math.round(value * 100)}%`;
const tooltipContentStyle = {
  backgroundColor: 'var(--card)',
  borderColor: 'var(--border)',
  color: 'var(--foreground)',
  borderRadius: '8px',
};
const tooltipLabelStyle = {
  color: 'var(--foreground)',
  fontWeight: 600,
  marginBottom: '4px',
};
const tooltipItemStyle = {
  color: 'var(--foreground)',
};

export default function AnalyticsPage() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('analytics');
  const { organizationId, setOrganizationId } = useWorkspaceStore();
  const [usagePage, setUsagePage] = React.useState(1);
  const [usagePageSize, setUsagePageSize] = React.useState<PageSizeOption>(10);
  const [recentPage, setRecentPage] = React.useState(1);
  const [recentPageSize, setRecentPageSize] = React.useState<PageSizeOption>(10);

  const organizationsQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.list(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken),
  });
  const analyticsQuery = useQuery({
    queryKey: ['analytics', organizationId],
    queryFn: () => analyticsService.dashboard(tokens!.accessToken, organizationId ?? undefined),
    enabled: Boolean(tokens?.accessToken),
  });
  const analytics = analyticsQuery.data;
  const fingerprintData = (analytics?.fingerprints ?? []).map((item) => ({
    fingerprint: formatAiFingerprint(item.style),
    count: item.count,
  }));
  const usageItems = analytics?.usage ?? [];
  const recentDetections = analytics?.recentDetections ?? [];
  const visibleUsageItems = paginateItems(usageItems, usagePage, usagePageSize);
  const visibleRecentDetections = paginateItems(recentDetections, recentPage, recentPageSize);

  React.useEffect(() => {
    if (usagePage > 1 && visibleUsageItems.length === 0) {
      setUsagePage((currentPage) => Math.max(1, currentPage - 1));
    }
  }, [usagePage, visibleUsageItems.length]);

  React.useEffect(() => {
    if (recentPage > 1 && visibleRecentDetections.length === 0) {
      setRecentPage((currentPage) => Math.max(1, currentPage - 1));
    }
  }, [recentPage, visibleRecentDetections.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.description}</p>
        </div>
        <div className="w-full md:w-72">
          <Select
            value={organizationId ?? 'personal'}
            onValueChange={(value) => {
              setOrganizationId(value === 'personal' ? null : value);
              setUsagePage(1);
              setRecentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={copy.selectScopePlaceholder}>
                {(value) => {
                  if (value === 'personal') {
                    return copy.personalWorkspace;
                  }
                  const org = (organizationsQuery.data ?? []).find((o) => o.id === value);
                  return org ? org.name : copy.selectScopePlaceholder;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">{copy.personalWorkspace}</SelectItem>
              {(organizationsQuery.data ?? []).map((organization) => (
                <SelectItem key={organization.id} value={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {analyticsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [copy.stats.detections, analytics?.totals.detections ?? 0],
            [copy.stats.completion, pct(analytics?.totals.completionRate ?? 0)],
            [copy.stats.avgAiScore, pct(analytics?.scores.averageAiProbability ?? 0)],
            [copy.stats.avgConfidence, pct(analytics?.scores.averageConfidence ?? 0)],
          ].map(([label, value]) => (
            <Card key={label as string} className="border-border/60 bg-card/80">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.charts.detectionTrend}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.trend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 1]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Line yAxisId="left" type="monotone" dataKey="detections" stroke="#2563eb" />
                <Line yAxisId="right" type="monotone" dataKey="aiProbability" stroke="#d97706" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.charts.aiFingerprints}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fingerprintData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#047857" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                <XAxis dataKey="fingerprint" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Bar dataKey="count" fill="url(#colorCount)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.cards.usageEvents}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleUsageItems.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No data available</p>
            ) : (
              visibleUsageItems.map((item) => {
                const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const typeLabels: Record<string, string> = {
                  DETECTION: 'Content Detection',
                  FILE_UPLOAD: 'File Ingestion',
                  EXPORT: 'Report Export',
                  API_CALL: 'API Request',
                  WEBHOOK: 'Webhook Delivery',
                };

                const titleText =
                  item.type === 'DETECTION'
                    ? item.detectionTitle || 'Untitled Detector'
                    : item.detectionTitle || typeLabels[item.type] || item.type;
                const metaText = `${typeLabels[item.type] || item.type}${
                  item.apiKeyName ? ` via ${item.apiKeyName}` : ''
                } • ${dateStr}`;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border-b pb-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{titleText}</p>
                      <p className="text-xs text-muted-foreground">{metaText}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-primary">+{item.quantity}</span>
                      {typeof item.overallAiProbability === 'number' && (
                        <p className="text-xs text-muted-foreground">
                          {pct(item.overallAiProbability)} AI
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <PaginationControls
              page={usagePage}
              pageSize={usagePageSize}
              canPrevious={usagePage > 1}
              canNext={usagePage * usagePageSize < usageItems.length}
              disabled={analyticsQuery.isFetching}
              totalItems={usageItems.length}
              onPageChange={setUsagePage}
              onPageSizeChange={(nextPageSize) => {
                setUsagePageSize(nextPageSize);
                setUsagePage(1);
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.cards.recentDetections}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleRecentDetections.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No data available</p>
            ) : (
              visibleRecentDetections.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b pb-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.title || 'Untitled Detector'}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.language} - {formatAiFingerprint(item.aiFingerprint)}
                    </p>
                  </div>
                  <span>{pct(item.overallAiProbability)}</span>
                </div>
              ))
            )}
            <PaginationControls
              page={recentPage}
              pageSize={recentPageSize}
              canPrevious={recentPage > 1}
              canNext={recentPage * recentPageSize < recentDetections.length}
              disabled={analyticsQuery.isFetching}
              totalItems={recentDetections.length}
              onPageChange={setRecentPage}
              onPageSizeChange={(nextPageSize) => {
                setRecentPageSize(nextPageSize);
                setRecentPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
