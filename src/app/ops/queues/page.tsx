'use client';

import React from 'react';
import { useOpsStore, QueueInfo, JobRow, FailedJob } from '@/lib/ops-mock-data';
import { StatusBadge } from '@/components/ops/status-badge';
import { SparklineChart } from '@/components/ops/sparkline-chart';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Trash2, XCircle, ArrowUpRight } from 'lucide-react';
import {
  AreaChart as RechartAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function QueueMonitorPage() {
  const {
    queues,
    activeJobsList,
    failedJobsList,
    queueThroughputTimeline,
    cancelActiveJob,
    retryFailedJob,
    deleteFailedJob,
    retryAllFailedJobs,
    deleteAllFailedJobs,
  } = useOpsStore();

  const [refreshInterval, setRefreshInterval] = React.useState<number>(15);
  const [expandedFailedJobId, setExpandedFailedJobId] = React.useState<string | null>(null);

  const queueColorConfig = {
    enterprise: {
      text: 'text-blue-400',
      border: 'border-blue-900/40',
      bg: 'bg-blue-950/20',
      fill: '#3b82f6',
    },
    business: {
      text: 'text-purple-400',
      border: 'border-purple-900/40',
      bg: 'bg-purple-950/20',
      fill: '#a855f7',
    },
    pro: {
      text: 'text-pink-400',
      border: 'border-pink-900/40',
      bg: 'bg-pink-950/20',
      fill: '#ec4899',
    },
    free: {
      text: 'text-amber-400',
      border: 'border-amber-900/40',
      bg: 'bg-amber-950/20',
      fill: '#f59e0b',
    },
  };

  const getQueueColor = (name: string) => {
    return (
      queueColorConfig[name.toLowerCase() as keyof typeof queueColorConfig] || queueColorConfig.free
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {}
      <div className="flex justify-between items-center bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono">
            QUEUE MONITOR
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Manage work queue priorities, active nodes, and job recoveries.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#737373]">
          <span>Refresh Interval:</span>
          <div className="flex items-center rounded border border-[#1f1f1f] bg-[#0a0a0a] p-0.5">
            {[5, 15, 30, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => setRefreshInterval(sec)}
                className={cn(
                  'px-2 py-0.5 text-[10px] rounded transition-colors',
                  refreshInterval === sec
                    ? 'bg-neutral-900 text-blue-400 font-semibold'
                    : 'hover:text-[#f5f5f5]',
                )}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {queues.map((q) => {
          const cfg = getQueueColor(q.name);
          const activePercent = Math.min(100, Math.round((q.active / q.concurrency) * 100));

          return (
            <div
              key={q.name}
              className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col justify-between hover:border-[#2f2f2f] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5">
                  <span className={cn('text-sm font-bold font-mono uppercase', cfg.text)}>
                    {q.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#737373]">
                    Priority Level {q.priority}
                  </span>
                </div>
                <StatusBadge status={q.active > 0 ? 'active' : 'idle'} pulse={q.active > 0} />
              </div>

              {}
              <div className="mt-4 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-[#737373]">
                  <span>Worker Load ({activePercent}%)</span>
                  <span>
                    {q.active}/{q.concurrency} Nodes
                  </span>
                </div>
                <Progress value={activePercent} className="h-1.5 bg-[#0a0a0a]" />
              </div>

              {}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4 pt-4 border-t border-[#1a1a1a]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#737373] uppercase">Waiting</span>
                  <span className="text-sm font-semibold font-mono text-[#f5f5f5] mt-0.5">
                    {q.waiting.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#737373] uppercase">Throughput</span>
                  <span className="text-sm font-semibold font-mono text-[#f5f5f5] mt-0.5">
                    {q.throughput}{' '}
                    <span className="text-[9px] text-[#737373] font-normal">j/m</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#737373] uppercase">Completed</span>
                  <span className="text-sm font-semibold font-mono text-emerald-400 mt-0.5">
                    {q.completed.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#737373] uppercase">Failed</span>
                  <span className="text-sm font-semibold font-mono text-red-400 mt-0.5">
                    {q.failed.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-4 pt-3 border-t border-[#1a1a1a]">
                <span className="text-[9px] font-mono text-[#737373]">
                  Avg Proc: {q.avgProcessingTime}ms
                </span>
                <SparklineChart data={q.sparkline} color={cfg.fill} />
              </div>
            </div>
          );
        })}
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Currently Processing Jobs ({activeJobsList.length})
        </h2>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Job ID</th>
                <th className="px-4 py-2.5">Queue</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Word Count</th>
                <th className="px-4 py-2.5 w-48">Progress</th>
                <th className="px-4 py-2.5">Stage</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-[#f5f5f5]">
              {activeJobsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#737373]">
                    NO ACTIVE JOBS RUNNING
                  </td>
                </tr>
              ) : (
                activeJobsList.map((job) => {
                  const cfg = getQueueColor(job.queue);
                  return (
                    <tr key={job.jobId} className="hover:bg-neutral-900/30">
                      <td className="px-4 py-3 font-semibold text-[#f5f5f5]">{job.jobId}</td>
                      <td className="px-4 py-3">
                        <span className={cn('uppercase font-bold', cfg.text)}>{job.queue}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] rounded">
                          {job.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{job.wordCount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={job.progress} className="h-2 flex-1 bg-black" />
                          <span className="text-[10px] text-blue-400 font-bold shrink-0">
                            {job.progress}%
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-neutral-400 max-w-[180px] truncate"
                        title={job.stage}
                      >
                        {job.stage}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelActiveJob(job.jobId)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/20 px-2 h-7 rounded text-[11px]"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Failed Jobs Recovery Panel ({failedJobsList.length})
          </h2>
          {failedJobsList.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={retryAllFailedJobs}
                className="bg-emerald-950/20 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/30 text-[11px] h-7 px-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Retry All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteAllFailedJobs}
                className="bg-red-950/20 text-red-400 border-red-900/40 hover:bg-red-950/30 text-[11px] h-7 px-2"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5 w-8" />
                <th className="px-4 py-2.5">Job ID</th>
                <th className="px-4 py-2.5">Queue</th>
                <th className="px-4 py-2.5">Failed At</th>
                <th className="px-4 py-2.5">Attempts</th>
                <th className="px-4 py-2.5">Error Reason</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-[#f5f5f5]">
              {failedJobsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#737373]">
                    NO FAILED JOBS DETECTED
                  </td>
                </tr>
              ) : (
                failedJobsList.map((job) => {
                  const isExpanded = expandedFailedJobId === job.jobId;
                  const cfg = getQueueColor(job.queue);

                  return (
                    <React.Fragment key={job.jobId}>
                      <tr className="hover:bg-neutral-900/30">
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setExpandedFailedJobId(isExpanded ? null : job.jobId)}
                            className="text-[#737373] hover:text-[#f5f5f5]"
                          >
                            <span className="block w-4 text-center text-xs">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3 font-semibold">{job.jobId}</td>
                        <td className="px-4 py-3">
                          <span className={cn('uppercase font-bold', cfg.text)}>{job.queue}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {new Date(job.failedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          {job.attempts}/{job.maxAttempts}
                        </td>
                        <td
                          className="px-4 py-3 text-red-400 max-w-[200px] truncate"
                          title={job.error}
                        >
                          {job.error}
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryFailedJob(job.jobId)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20 px-2 h-7 rounded text-[11px]"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Retry
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFailedJob(job.jobId)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/20 px-2 h-7 rounded text-[11px]"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0b0b0b]">
                          <td colSpan={7} className="px-6 py-3 border-t border-b border-[#1f1f1f]">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                Exception Stack Trace
                              </span>
                              <pre className="text-[10px] leading-tight font-mono text-[#737373] bg-black p-3 rounded border border-[#1f1f1f] overflow-x-auto whitespace-pre">
                                {job.stackTrace}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Queue Throughput History (Last 60 Minutes - jobs/min)
        </span>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartAreaChart
              data={queueThroughputTimeline}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke="#151515" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#404040"
                fontSize={9}
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#404040"
                fontSize={9}
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
                labelStyle={{ fontFamily: 'monospace', color: '#737373', fontSize: '9px' }}
                itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }}
              />
              <Area
                type="monotone"
                dataKey="enterprise"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.25}
                name="Enterprise"
              />
              <Area
                type="monotone"
                dataKey="business"
                stackId="1"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.2}
                name="Business"
              />
              <Area
                type="monotone"
                dataKey="pro"
                stackId="1"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.15}
                name="Pro"
              />
              <Area
                type="monotone"
                dataKey="free"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.1}
                name="Free"
              />
            </RechartAreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
