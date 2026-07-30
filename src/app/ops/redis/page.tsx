'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { GaugeChart } from '@/components/ops/gauge-chart';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { HardDrive } from 'lucide-react';

export default function RedisMonitorPage() {
  const { redisMemory, redisNamespaces, redisKeys, redisCommandsTimeline } = useOpsStore();

  const memoryPercent = Math.round((redisMemory.used / redisMemory.max) * 100);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hitRate = ((redisMemory.hits / (redisMemory.hits + redisMemory.misses)) * 100).toFixed(2);

  return (
    <div className="flex flex-col gap-6 w-full">
      {}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          REDIS CACHE & QUEUE ENGINE
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          In-memory storage indicators, key allocations, and transactional command velocities.
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 items-center">
        <div className="flex justify-center md:border-r border-[#1f1f1f] py-4">
          <GaugeChart value={memoryPercent} label="Cache RAM In Use" size={130} />
        </div>

        <div className="flex flex-col gap-4 md:col-span-3 px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Redis Cache Engine Telemetry
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">Used Memory</span>
              <span className="text-lg font-bold font-mono text-[#f5f5f5]">
                {formatBytes(redisMemory.used)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">Max Memory</span>
              <span className="text-lg font-bold font-mono text-blue-400">
                {formatBytes(redisMemory.max)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                Keyspace Hit Rate
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">{hitRate}%</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#737373] uppercase">Evicted Keys</span>
              <span className="text-lg font-bold font-mono text-red-400">
                {redisMemory.evicted}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2 text-[11px] font-mono text-neutral-400 border-t border-[#1a1a1a] pt-3">
            <div className="flex justify-between">
              <span>Keyspace Hits:</span>
              <span className="text-[#f5f5f5] font-semibold">
                {redisMemory.hits.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Keyspace Misses:</span>
              <span className="text-amber-400 font-semibold">
                {redisMemory.misses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Namespace Breakdown
          </span>

          <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                  <th className="px-3.5 py-2">Pattern Prefix</th>
                  <th className="px-3.5 py-2 text-right">Key Allocation</th>
                  <th className="px-3.5 py-2 text-right">Average TTL</th>
                  <th className="px-3.5 py-2 text-right">Estimated Memory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151515] text-neutral-300">
                {redisNamespaces.map((ns) => (
                  <tr key={ns.prefix} className="hover:bg-neutral-900/30">
                    <td className="px-3.5 py-2.5 font-semibold text-[#f5f5f5]">{ns.prefix}</td>
                    <td className="px-3.5 py-2.5 text-right">{ns.keyCount.toLocaleString()}</td>
                    <td className="px-3.5 py-2.5 text-right text-neutral-500">{ns.avgTtl}</td>
                    <td className="px-3.5 py-2.5 text-right text-blue-400">{ns.memory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Operations Velocity (GET / SET / DEL Commands/sec)
          </span>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={redisCommandsTimeline}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
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
                <ChartLegend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="GET"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={false}
                  name="GET"
                />
                <Line
                  type="monotone"
                  dataKey="SET"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  dot={false}
                  name="SET"
                />
                <Line
                  type="monotone"
                  dataKey="DEL"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  dot={false}
                  name="DEL"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Memory Intensive Key Allocations
        </span>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Key Allocation Pattern</th>
                <th className="px-4 py-2.5 text-right">Data Capacity</th>
                <th className="px-4 py-2.5 text-right">Remaining TTL</th>
                <th className="px-4 py-2.5">Data Structure Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-[#f5f5f5]">
              {redisKeys.map((k) => (
                <tr key={k.pattern} className="hover:bg-neutral-900/30">
                  <td className="px-4 py-3 text-neutral-300 font-semibold">{k.pattern}</td>
                  <td className="px-4 py-3 text-right text-blue-400">{k.memory}</td>
                  <td className="px-4 py-3 text-right text-neutral-500">{k.ttl}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] rounded uppercase font-bold text-neutral-400">
                      {k.type}
                    </span>
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
