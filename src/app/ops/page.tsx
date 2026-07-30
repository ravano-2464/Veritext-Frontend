'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { MetricCard } from '@/components/ops/metric-card';
import { QueueProgressBar } from '@/components/ops/queue-progress-bar';
import { StatusBadge } from '@/components/ops/status-badge';
import { cn } from '@/lib/utils';
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Play,
  Server,
  AlertCircle,
  Database,
  Layers,
  ArrowUpRight,
  Cpu,
} from 'lucide-react';
import Link from 'next/link';

export default function OpsDashboardPage() {
  const {
    metrics,
    requestsTimeline,
    errorsTimeline,
    queues,
    workers,
    recentErrors,
    timelineEvents,
  } = useOpsStore();

  const [expandedErrorId, setExpandedErrorId] = React.useState<string | null>(null);

  const statusCards = [
    {
      label: 'API Uptime',
      value: '99.97%',
      trend: { direction: 'up' as const, value: '0.01%', positive: true },
      status: 'healthy' as const,
      sparkline: [99.95, 99.96, 99.96, 99.97, 99.97, 99.97, 99.97],
    },
    {
      label: 'Req/min',
      value: metrics.requestsPerMin.value,
      trend: metrics.requestsPerMin.trend,
      status: metrics.requestsPerMin.status,
      sparkline: metrics.requestsPerMin.sparkline,
    },
    {
      label: 'P95 Latency',
      value: metrics.p95Latency.value,
      unit: 'ms',
      trend: metrics.p95Latency.trend,
      status: metrics.p95Latency.status,
      sparkline: metrics.p95Latency.sparkline,
    },
    {
      label: 'Error Rate',
      value: metrics.errorRate.value,
      unit: '%',
      trend: metrics.errorRate.trend,
      status:
        metrics.errorRate.value > 1.0
          ? ('critical' as const)
          : metrics.errorRate.value > 0.5
            ? ('warning' as const)
            : ('healthy' as const),
      sparkline: metrics.errorRate.sparkline,
    },
    {
      label: 'Active Jobs',
      value: metrics.activeJobs.value,
      trend: metrics.activeJobs.trend,
      status: metrics.activeJobs.status,
      sparkline: metrics.activeJobs.sparkline,
    },
    {
      label: 'DB Connections',
      value: metrics.dbConnections.value,
      trend: metrics.dbConnections.trend,
      status: metrics.dbConnections.status,
      sparkline: metrics.dbConnections.sparkline,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono">
            OPERATIONS DESK
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Real-time telemetry and infrastructure health summaries.
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusCards.map((card, idx) => (
          <MetricCard key={idx} {...card} />
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
              Request Volume (Last 24 Hours)
            </span>
            <span className="text-xs font-mono font-semibold text-blue-400">
              Avg:{' '}
              {Math.round(
                requestsTimeline.reduce((acc, curr) => acc + curr.value, 0) /
                  requestsTimeline.length,
              )}{' '}
              req/hr
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={requestsTimeline}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="reqColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#151515" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#404040"
                  fontSize={10}
                  fontFamily="monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#404040"
                  fontSize={10}
                  fontFamily="monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#1f1f1f',
                    borderRadius: '4px',
                  }}
                  labelStyle={{ fontFamily: 'monospace', color: '#737373', fontSize: '10px' }}
                  itemStyle={{ fontFamily: 'monospace', color: '#f5f5f5', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#reqColor)"
                  name="Requests"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
              Error Rate (Last 24 Hours)
            </span>
            <span className="text-xs font-mono font-semibold text-red-400">
              Avg:{' '}
              {(
                errorsTimeline.reduce((acc, curr) => acc + curr.value, 0) / errorsTimeline.length
              ).toFixed(2)}
              %
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={errorsTimeline}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#151515" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#404040"
                  fontSize={10}
                  fontFamily="monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#404040"
                  fontSize={10}
                  fontFamily="monospace"
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  unit="%"
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#1f1f1f',
                    borderRadius: '4px',
                  }}
                  labelStyle={{ fontFamily: 'monospace', color: '#737373', fontSize: '10px' }}
                  itemStyle={{ fontFamily: 'monospace', color: '#f5f5f5', fontSize: '11px' }}
                />
                <ReferenceLine
                  y={1.0}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{
                    value: '1% Threshold',
                    fill: '#f59e0b',
                    fontSize: 9,
                    position: 'top',
                    fontFamily: 'monospace',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Error Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-4 lg:col-span-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
              Queue Status
            </span>
            <Link
              href="/ops/queues"
              className="text-[10px] font-mono text-blue-400 hover:underline flex items-center"
            >
              Monitor <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {queues.map((q) => (
              <div
                key={q.name}
                className="flex flex-col gap-1.5 border-b border-[#151515] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase text-[#f5f5f5]">
                      {q.name} <span className="text-[#737373] text-[10px]">queue</span>
                    </span>
                    <span className="text-[9px] font-mono px-1 bg-neutral-900 border border-neutral-800 text-[#737373] rounded">
                      P{q.priority}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#737373]">
                    {q.throughput}/min throughput
                  </span>
                </div>
                <QueueProgressBar
                  active={q.active}
                  concurrency={q.concurrency}
                  waiting={q.waiting}
                />
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3 lg:col-span-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
              Active Workers
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              Count: {workers.filter((w) => w.status === 'active').length} / {workers.length}
            </span>
          </div>

          <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d] flex-1">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase">
                  <th className="px-2.5 py-2">Worker ID</th>
                  <th className="px-2.5 py-2 text-center">Status</th>
                  <th className="px-2.5 py-2 text-right">CPU</th>
                  <th className="px-2.5 py-2 text-right">Mem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151515]">
                {workers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-neutral-900/40 text-neutral-300">
                    <td
                      className="px-2.5 py-2 font-semibold text-[#f5f5f5] max-w-[90px] truncate"
                      title={worker.id}
                    >
                      {worker.id.replace('worker-', 'w-')}
                    </td>
                    <td className="px-2.5 py-2 text-center">
                      <StatusBadge status={worker.status} className="scale-75 origin-center" />
                    </td>
                    <td className="px-2.5 py-2 text-right">{worker.cpu}%</td>
                    <td className="px-2.5 py-2 text-right">{worker.memory}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3 lg:col-span-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
              Recent Errors
            </span>
            <Link
              href="/ops/logs/errors"
              className="text-[10px] font-mono text-blue-400 hover:underline"
            >
              Analyze
            </Link>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px] no-scrollbar">
            {recentErrors.slice(0, 10).map((err) => {
              const isExpanded = expandedErrorId === err.id;
              return (
                <div
                  key={err.id}
                  className="flex flex-col border border-[#1f1f1f] rounded bg-[#0d0d0d] overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedErrorId(isExpanded ? null : err.id)}
                    className="flex items-start justify-between gap-1.5 p-2 cursor-pointer hover:bg-neutral-900/30 transition-colors"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-1 bg-red-950/40 text-red-400 border border-red-900/30 rounded uppercase">
                          {err.code}
                        </span>
                        <span
                          className="text-[10px] font-mono text-neutral-400 truncate max-w-[130px]"
                          title={err.endpoint}
                        >
                          {err.endpoint}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-sans text-red-400 truncate max-w-[180px]"
                        title={err.message}
                      >
                        {err.message}
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-3.5 h-3.5 mt-0.5 text-[#737373] transition-transform shrink-0',
                        isExpanded ? 'transform rotate-90' : '',
                      )}
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-[#1f1f1f]"
                      >
                        <pre className="text-[9px] font-mono leading-tight p-2 text-[#737373] bg-black overflow-x-auto whitespace-pre-wrap">
                          {err.stackTrace}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          System Activity Timeline (Last 2 Hours)
        </span>

        <div className="relative flex items-center justify-between gap-4 overflow-x-auto pb-2 min-h-[75px] no-scrollbar">
          {}
          <div className="absolute left-4 right-4 top-[14px] h-[1px] bg-[#1f1f1f] z-0" />

          {timelineEvents.map((ev, idx) => {
            const colors = {
              success: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
              info: 'border-blue-500 bg-blue-500/10 text-blue-400',
              warning: 'border-amber-500 bg-amber-500/10 text-amber-400',
              error: 'border-red-500 bg-red-500/10 text-red-400',
            };

            const nodeStyle = colors[ev.severity] || colors.info;

            return (
              <div
                key={ev.id}
                className="relative z-10 flex flex-col items-center flex-1 min-w-[200px] text-center"
              >
                {}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-bold shadow-lg',
                    nodeStyle,
                  )}
                >
                  {ev.type.substring(0, 1).toUpperCase()}
                </div>

                <span className="text-[10px] font-mono text-neutral-500 mt-2">{ev.timeLabel}</span>
                <span className="text-xs font-bold text-[#f5f5f5] mt-1 line-clamp-1 px-2">
                  {ev.title}
                </span>
                <span className="text-[10px] text-[#737373] line-clamp-1 px-3">
                  {ev.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
