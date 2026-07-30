'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { Terminal } from '@/components/ops/terminal';

export default function ErrorLogsPage() {
  const {
    logs,
    clearLogs,
    logServiceFilter,
    setLogServiceFilter,
    logSearchQuery,
    setLogSearchQuery,
  } = useOpsStore();

  const errorLogsOnly = React.useMemo(() => {
    return logs.filter((log) => log.level === 'ERROR');
  }, [logs]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          Error Telemetry & Diagnostics
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          Filtered repository of error logs, stack traces, and client impact stats.
        </p>
      </div>

      <Terminal
        logs={errorLogsOnly}
        isLive={true}
        onToggleLive={() => {}}
        onClear={clearLogs}
        levelFilter="ERROR"
        onLevelFilterChange={() => {}}
        serviceFilter={logServiceFilter}
        onServiceFilterChange={setLogServiceFilter}
        searchQuery={logSearchQuery}
        onSearchQueryChange={setLogSearchQuery}
        availableServices={['system']}
        maxHeight="h-[400px]"
        showErrorAggregation={true}
      />
    </div>
  );
}
