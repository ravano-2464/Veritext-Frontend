'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Download, Search, ChevronRight } from 'lucide-react';
import { LiveIndicator } from './live-indicator';
import { LogLine } from '@/lib/ops-mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TerminalProps {
  logs: LogLine[];
  isLive: boolean;
  onToggleLive: () => void;
  onClear: () => void;
  levelFilter: string;
  onLevelFilterChange: (level: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  availableServices?: string[];
  maxHeight?: string;
  showErrorAggregation?: boolean;
}

export function Terminal({
  logs,
  isLive,
  onToggleLive,
  onClear,
  levelFilter,
  onLevelFilterChange,
  serviceFilter,
  onServiceFilterChange,
  searchQuery,
  onSearchQueryChange,
  availableServices = ['api', 'queue', 'worker', 'auth', 'detection'],
  maxHeight = 'h-[450px]',
  showErrorAggregation = false,
}: TerminalProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [autoscroll, setAutoscroll] = React.useState(true);
  const [expandedLogId, setExpandedLogId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (autoscroll && viewportRef.current && isLive) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [logs, autoscroll, isLive]);

  const handleScroll = () => {
    if (!viewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
    setAutoscroll(isAtBottom);
  };

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (levelFilter !== 'ALL' && log.level !== levelFilter) return false;

      if (serviceFilter !== 'ALL' && log.service !== serviceFilter) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const msgMatch = log.message.toLowerCase().includes(query);
        const serviceMatch = log.service.toLowerCase().includes(query);
        const reqMatch = log.requestId?.toLowerCase().includes(query);
        return msgMatch || serviceMatch || reqMatch;
      }
      return true;
    });
  }, [logs, levelFilter, serviceFilter, searchQuery]);

  const handleDownload = () => {
    const text = filteredLogs
      .map(
        (l) =>
          `[${l.timestamp}] ${l.level.padEnd(5)} [${l.service}]${
            l.requestId ? ` [${l.requestId}]` : ''
          } ${l.message}${l.meta ? ` ${JSON.stringify(l.meta)}` : ''}`,
      )
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `veritext-ops-${new Date().toISOString()}.log`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return (
        d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) +
        '.' +
        String(d.getMilliseconds()).padStart(3, '0')
      );
    } catch {
      return isoString;
    }
  };

  const renderLogLine = (log: LogLine) => {
    const isExpanded = expandedLogId === log.id;
    const timeStr = formatTime(log.timestamp);

    const levelStyles = {
      ERROR: { levelText: 'text-red-500 font-bold', msgText: 'text-red-400' },
      WARN: { levelText: 'text-amber-500 font-semibold', msgText: 'text-amber-400' },
      INFO: { levelText: 'text-blue-400', msgText: 'text-neutral-200' },
      DEBUG: { levelText: 'text-purple-400', msgText: 'text-neutral-500' },
      VERBOSE: { levelText: 'text-neutral-500', msgText: 'text-neutral-500' },
    };

    const style = levelStyles[log.level] || levelStyles.INFO;

    return (
      <div
        key={log.id}
        className={cn(
          'border-b border-[#151515] hover:bg-neutral-900/30 transition-colors',
          isExpanded ? 'bg-neutral-900/40' : '',
        )}
      >
        <div
          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
          className="flex items-start gap-2 px-3 py-1.5 cursor-pointer select-text font-mono text-[11px] leading-relaxed"
        >
          <ChevronRight
            className={cn(
              'w-3.5 h-3.5 mt-0.5 text-[#737373] transition-transform shrink-0',
              isExpanded ? 'transform rotate-90' : '',
            )}
          />

          <span className="text-[#737373] shrink-0">[{timeStr}]</span>

          <span className={cn('shrink-0 w-12', style.levelText)}>{log.level}</span>

          <span className="text-blue-500 shrink-0">[{log.service}]</span>

          {log.requestId && <span className="text-neutral-600 shrink-0">[{log.requestId}]</span>}

          <span className={cn('flex-1 break-all', style.msgText)}>{log.message}</span>
        </div>

        {isExpanded && log.meta && (
          <div className="pl-8 pr-4 pb-3 pt-1 border-t border-[#151515]">
            <pre className="text-[10px] text-emerald-500 font-mono bg-black/60 p-2 rounded border border-[#1f1f1f] overflow-x-auto">
              {JSON.stringify(log.meta, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const errorAggregates = React.useMemo(() => {
    const counts: Record<
      string,
      { count: number; first: string; last: string; msg: string; service: string }
    > = {};
    logs.forEach((l) => {
      if (l.level !== 'ERROR') return;
      const key = `${l.service}:${l.message}`;
      if (!counts[key]) {
        counts[key] = {
          count: 0,
          first: l.timestamp,
          last: l.timestamp,
          msg: l.message,
          service: l.service,
        };
      }
      counts[key].count++;
      if (new Date(l.timestamp) < new Date(counts[key].first)) counts[key].first = l.timestamp;
      if (new Date(l.timestamp) > new Date(counts[key].last)) counts[key].last = l.timestamp;
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [logs]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111111] border border-[#1f1f1f] rounded-lg p-3">
        <div className="flex flex-wrap items-center gap-3">
          <LiveIndicator active={isLive} onClick={onToggleLive} />

          {}
          <div className="flex items-center rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-0.5">
            {['ALL', 'ERROR', 'WARN', 'INFO', 'DEBUG'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onLevelFilterChange(lvl)}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-mono rounded transition-colors',
                  levelFilter === lvl
                    ? 'bg-neutral-900 text-[#f5f5f5] font-semibold border border-neutral-800'
                    : 'text-[#737373] hover:text-[#f5f5f5]',
                )}
              >
                {lvl}
              </button>
            ))}
          </div>

          {}
          <div className="flex items-center gap-1.5 text-xs text-[#737373] font-mono">
            <span>Service:</span>
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className="bg-[#0a0a0a] border border-[#1f1f1f] text-[#f5f5f5] rounded px-2 py-1 text-[11px] focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">ALL</option>
              {availableServices.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#737373]" />
            <Input
              type="text"
              placeholder="Filter by message..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-8 h-8 w-44 bg-[#0a0a0a] border-[#1f1f1f] text-xs text-[#f5f5f5] focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {}
          <Button
            variant="outline"
            size="icon"
            onClick={onClear}
            className="w-8 h-8 bg-neutral-900 border-[#1f1f1f] text-[#737373] hover:text-red-400 hover:bg-neutral-850"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {}
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="w-8 h-8 bg-neutral-900 border-[#1f1f1f] text-[#737373] hover:text-[#f5f5f5] hover:bg-neutral-850"
            title="Download log file"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {}
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className={cn(
          'relative w-full overflow-y-auto bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg shadow-inner flex flex-col no-scrollbar',
          maxHeight,
        )}
      >
        <div className="flex-1 flex flex-col">
          {filteredLogs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[#737373] font-mono text-xs py-10 select-none">
              NO STREAMING LOG LINES MATCHING CRITERIA
            </div>
          ) : (
            filteredLogs.map(renderLogLine)
          )}
        </div>
      </div>

      {}
      {showErrorAggregation && errorAggregates.length > 0 && (
        <div className="flex flex-col gap-2 bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 mt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono mb-2">
            Top Error Aggregations (Last 1 Hour)
          </h3>
          <div className="overflow-x-auto border border-[#1f1f1f] rounded-md bg-[#0d0d0d]">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Error Message</th>
                  <th className="px-3 py-2 text-right">Count</th>
                  <th className="px-3 py-2">First Seen</th>
                  <th className="px-3 py-2">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151515]">
                {errorAggregates.map((agg, idx) => (
                  <tr key={idx} className="hover:bg-neutral-900/30 text-neutral-300">
                    <td className="px-3 py-2 text-blue-500">[{agg.service}]</td>
                    <td className="px-3 py-2 text-red-400 max-w-md truncate" title={agg.msg}>
                      {agg.msg}
                    </td>
                    <td className="px-3 py-2 text-right text-[#f5f5f5] font-semibold">
                      {agg.count}
                    </td>
                    <td className="px-3 py-2 text-[#737373]">
                      {new Date(agg.first).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2 text-[#737373]">
                      {new Date(agg.last).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
