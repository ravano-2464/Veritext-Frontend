'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { GaugeChart } from '@/components/ops/gauge-chart';
import { Progress } from '@/components/ui/progress';
import { DataTable, ColumnDef } from '@/components/ops/data-table';
import { StatusBadge } from '@/components/ops/status-badge';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DatabaseMonitorPage() {
  const { dbPool, slowQueries, tableStats, migrations } = useOpsStore();

  const [expandedQueryHash, setExpandedQueryHash] = React.useState<string | null>(null);

  const poolPercentage = Math.round((dbPool.active / dbPool.total) * 100);

  const queryLatencyData = [
    { name: 'P50 Latency', value: 8, fill: '#10b981' },
    { name: 'P95 Latency', value: 45, fill: '#f59e0b' },
    { name: 'P99 Latency', value: 180, fill: '#ef4444' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          DATABASE DIAGNOSTICS & TELEMETRY
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          PostgreSQL read/write replicas, connection pools, and query performance profiles.
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 items-center">
        <div className="flex justify-center md:border-r border-[#1f1f1f] py-4">
          <GaugeChart value={poolPercentage} label="Pool In Use" size={130} />
        </div>

        <div className="flex flex-col gap-4 md:col-span-3 px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Pool Stats Breakdown
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                Max Connections
              </span>
              <span className="text-lg font-bold font-mono text-[#f5f5f5]">{dbPool.total}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                Active Sessions
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">{dbPool.active}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">Idle Sessions</span>
              <span className="text-lg font-bold font-mono text-blue-400">{dbPool.idle}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                Avg Acquire Time
              </span>
              <span className="text-lg font-bold font-mono text-[#f5f5f5]">
                {dbPool.avgAcquireTime}{' '}
                <span className="text-xs text-[#737373] font-normal">ms</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between text-[10px] font-mono text-[#737373]">
              <span>Active capacity ({poolPercentage}%)</span>
              {dbPool.waiting > 0 ? (
                <span className="text-red-400 font-bold animate-pulse">
                  {dbPool.waiting} queries waiting for connection!
                </span>
              ) : (
                <span>0 queries waiting</span>
              )}
            </div>
            <Progress value={poolPercentage} className="h-1.5 bg-[#0a0a0a]" />
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3 lg:col-span-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Query Latency Percentiles (Last 1 Hour)
          </span>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={queryLatencyData}
                margin={{ top: 15, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid stroke="#151515" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
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
                  unit="ms"
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#1f1f1f',
                    borderRadius: '4px',
                  }}
                  labelStyle={{ fontFamily: 'monospace', color: '#737373', fontSize: '10px' }}
                  itemStyle={{ fontFamily: 'monospace', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3 lg:col-span-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Slowest Query Profiler (Last 1 Hour)
          </span>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[230px] no-scrollbar">
            {slowQueries.map((q) => {
              const isExpanded = expandedQueryHash === q.hash;
              return (
                <div
                  key={q.hash}
                  className="flex flex-col border border-[#1f1f1f] rounded bg-[#0d0d0d] overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedQueryHash(isExpanded ? null : q.hash)}
                    className="flex items-start justify-between gap-1.5 p-2.5 cursor-pointer hover:bg-neutral-900/30 transition-colors font-mono text-[11px]"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 flex-1 min-w-0">
                      <span className="text-blue-500 font-bold shrink-0">#{q.hash}</span>
                      <span className="text-emerald-400 shrink-0 font-bold">{q.avgTime}ms avg</span>
                      <span className="text-neutral-500 shrink-0">{q.callCount} calls</span>
                      <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-[#737373] rounded uppercase shrink-0">
                        {q.table}
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 text-[#737373] transition-transform shrink-0',
                        isExpanded ? 'transform rotate-90' : '',
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#1f1f1f] bg-black/50 p-3">
                      <pre className="text-[10px] text-emerald-500 font-mono leading-tight whitespace-pre-wrap select-text">
                        {q.queryText}
                      </pre>
                      <div className="flex justify-between items-center text-[9px] text-[#737373] mt-2 font-mono border-t border-[#151515] pt-1.5">
                        <span>Max Execution Time: {q.maxTime}ms</span>
                        <span>Table Targeted: {q.table}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Relation Sizing & Table Health
        </span>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Table Relation</th>
                <th className="px-4 py-2.5 text-right">Approx Row Count</th>
                <th className="px-4 py-2.5 text-right">Data Size</th>
                <th className="px-4 py-2.5 text-right">Index Size</th>
                <th className="px-4 py-2.5">Last Vacuum / Analyze</th>
                <th className="px-4 py-2.5 text-right">Alert Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-neutral-300">
              {tableStats.map((tbl) => {
                const needsVacuumWarning = tbl.rowCount > 500000;
                return (
                  <tr key={tbl.table} className="hover:bg-neutral-900/30">
                    <td className="px-4 py-3 font-semibold text-[#f5f5f5]">{tbl.table}</td>
                    <td className="px-4 py-3 text-right">{tbl.rowCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{tbl.size}</td>
                    <td className="px-4 py-3 text-right">{tbl.indexSize}</td>
                    <td className="px-4 py-3 text-neutral-500">{tbl.lastVacuum}</td>
                    <td className="px-4 py-3 text-right">
                      {needsVacuumWarning ? (
                        <div className="inline-flex items-center gap-1.5 text-amber-500 text-[10px] font-bold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          VACUUM ADVISED
                        </div>
                      ) : (
                        <span className="text-emerald-500 font-bold text-[10px]">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Prisma Schema Migration Log
        </span>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Migration Name</th>
                <th className="px-4 py-2.5">Applied Timestamp</th>
                <th className="px-4 py-2.5">Execution Duration</th>
                <th className="px-4 py-2.5 text-right">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-[#f5f5f5]">
              {migrations.map((mig) => (
                <tr key={mig.name} className="hover:bg-neutral-900/30">
                  <td className="px-4 py-3 text-neutral-300 font-semibold">{mig.name}</td>
                  <td className="px-4 py-3 text-neutral-500">{mig.appliedAt}</td>
                  <td className="px-4 py-3">{mig.duration}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={mig.status === 'success' ? 'healthy' : 'failed'}>
                      {mig.status === 'success' ? '✓ success' : '✗ failed'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
