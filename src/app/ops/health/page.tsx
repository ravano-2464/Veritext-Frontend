'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { UptimeBar } from '@/components/ops/uptime-bar';
import { GaugeChart } from '@/components/ops/gauge-chart';
import { SparklineChart } from '@/components/ops/sparkline-chart';
import { StatusBadge } from '@/components/ops/status-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function SystemHealthPage() {
  const {
    servicesHealth,
    metrics,
    diskUsage,
    cpuTimeline,
    memTimeline,
    diskTimeline,
    latencyHeatmap,
  } = useOpsStore();

  const getHeatmapColor = (serviceName: string, lat: number) => {
    if (serviceName === 'OpenAI API') {
      if (lat > 2500) return 'bg-red-500/80 shadow-[0_0_2px_rgba(239,68,68,0.5)]';
      if (lat > 1500) return 'bg-amber-500/80';
      return 'bg-emerald-500/80';
    }
    if (serviceName === 'NLP Microservice') {
      if (lat > 350) return 'bg-red-500/80 shadow-[0_0_2px_rgba(239,68,68,0.5)]';
      if (lat > 250) return 'bg-amber-500/80';
      return 'bg-emerald-500/80';
    }

    if (lat > 80) return 'bg-red-500/80 shadow-[0_0_2px_rgba(239,68,68,0.5)]';
    if (lat > 30) return 'bg-amber-500/80';
    return 'bg-emerald-500/80';
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          SYSTEM HEALTH & INFRASTRUCTURE
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          Comprehensive uptime statistics, hardware resource meters, and latency heatmaps.
        </p>
      </div>

      {}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Container Microservice Standings
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesHealth.map((svc) => (
            <div
              key={svc.name}
              className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col justify-between gap-4 hover:border-[#2f2f2f] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-sm font-bold font-mono text-[#f5f5f5]">{svc.name}</span>
                  <span className="text-[10px] font-mono text-[#737373] mt-0.5">
                    {svc.endpoint}
                  </span>
                </div>
                <StatusBadge status={svc.status} pulse={svc.status !== 'HEALTHY'} />
              </div>

              <UptimeBar history={svc.uptimeHistory} />

              <div className="flex justify-between items-center text-[10px] font-mono text-[#737373] border-t border-[#1a1a1a] pt-3">
                <span>
                  Latency: <span className="text-blue-400 font-semibold">{svc.latency}ms</span>
                </span>
                <span>
                  Uptime: <span className="text-emerald-400 font-semibold">{svc.uptime}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Server Resources Utilized
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
          {}
          <div className="flex flex-col items-center justify-between border-r border-[#1f1f1f] last:border-r-0 py-2">
            <GaugeChart value={metrics.cpuUsage.value} label="CPU Core Load" size={120} />
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                30 Min Velocity
              </span>
              <SparklineChart data={cpuTimeline} color="#10b981" />
            </div>
          </div>

          {}
          <div className="flex flex-col items-center justify-between border-r border-[#1f1f1f] last:border-r-0 py-2">
            <GaugeChart value={metrics.memoryUsage.value} label="RAM Usage" size={120} />
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                30 Min Velocity
              </span>
              <SparklineChart data={memTimeline} color="#3b82f6" />
            </div>
          </div>

          {}
          <div className="flex flex-col items-center justify-between py-2">
            <GaugeChart value={diskUsage} label="SSD Space" size={120} />
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-[#737373] uppercase">
                30 Min Velocity
              </span>
              <SparklineChart data={diskTimeline} color="#a855f7" />
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Service Latency Heatmap Grid (Last 24 Hours)
          </span>
          <div className="flex items-center gap-3 text-[10px] font-mono text-[#737373]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500/80 rounded-[1px]" /> Fast
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-500/80 rounded-[1px]" /> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-red-500/80 rounded-[1px]" /> Delayed
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d] p-4">
          <div className="flex flex-col gap-3 min-w-[700px]">
            <TooltipProvider delay={100}>
              {servicesHealth.map((svc) => {
                const hourList = latencyHeatmap[svc.name] || Array(24).fill(50);

                return (
                  <div key={svc.name} className="flex items-center gap-3">
                    <span
                      className="w-32 text-xs font-bold text-neutral-300 font-mono truncate text-left"
                      title={svc.name}
                    >
                      {svc.name}
                    </span>

                    <div className="flex flex-1 justify-between gap-[3px] h-[16px]">
                      {hourList.map((lat, hourIdx) => {
                        const cellColor = getHeatmapColor(svc.name, lat);
                        const hourLabel = `${String(hourIdx).padStart(2, '0')}:00 - ${String((hourIdx + 1) % 24).padStart(2, '0')}:00`;

                        return (
                          <Tooltip key={hourIdx}>
                            <TooltipTrigger>
                              <div
                                className={cn(
                                  'flex-1 h-full rounded-[1px] cursor-crosshair transition-all hover:scale-y-125',
                                  cellColor,
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#111111] border border-[#1f1f1f] text-[11px] font-mono p-2 text-[#f5f5f5] rounded shadow-lg">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-[#3b82f6]">{svc.name}</span>
                                <span className="text-[#737373]">{hourLabel}</span>
                                <span className="font-semibold mt-0.5">
                                  Avg Latency: <span className="text-[#f5f5f5]">{lat}ms</span>
                                </span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </TooltipProvider>

            {}
            <div className="flex justify-between items-center text-[9px] text-[#737373] font-mono pl-32 mt-1">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
