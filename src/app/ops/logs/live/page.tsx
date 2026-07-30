'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { Terminal } from '@/components/ops/terminal';

export default function LiveLogsPage() {
  const {
    logs,
    isLiveLogsStreaming,
    setLiveLogsStreaming,
    clearLogs,
    logLevelFilter,
    setLogLevelFilter,
    logServiceFilter,
    setLogServiceFilter,
    logSearchQuery,
    setLogSearchQuery,
  } = useOpsStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          Live System Logs
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          Real-time terminal output stream from backend containers.
        </p>
      </div>

      <Terminal
        logs={logs}
        isLive={isLiveLogsStreaming}
        onToggleLive={() => setLiveLogsStreaming(!isLiveLogsStreaming)}
        onClear={clearLogs}
        levelFilter={logLevelFilter}
        onLevelFilterChange={setLogLevelFilter}
        serviceFilter={logServiceFilter}
        onServiceFilterChange={setLogServiceFilter}
        searchQuery={logSearchQuery}
        onSearchQueryChange={setLogSearchQuery}
        availableServices={['system']}
        maxHeight="h-[550px]"
        showErrorAggregation={true}
      />
    </div>
  );
}
