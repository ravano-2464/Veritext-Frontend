/* eslint-disable react-hooks/purity */
'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { DataTable, ColumnDef } from '@/components/ops/data-table';
import { StatusBadge } from '@/components/ops/status-badge';

interface HistoricalJob {
  id: string;
  userId: string;
  queue: string;
  type: string;
  words: number;
  duration: string;
  status: 'SUCCESS' | 'WARNING';
  completedAt: string;
}

export default function JobHistoryPage() {
  const { queues } = useOpsStore();

  const completedJobs: HistoricalJob[] = React.useMemo(() => {
    const list: HistoricalJob[] = [];
    const queuesList = ['enterprise', 'business', 'pro', 'free'];
    const types = ['TEXT', 'FILE', 'BATCH'];

    for (let i = 0; i < 24; i++) {
      const q = queuesList[i % queuesList.length];
      const type = types[i % types.length];
      const words = Math.round(300 + Math.random() * 8000);
      const isWarn = i % 10 === 0;

      const durationSec = Math.round(5 + Math.random() * 45);

      list.push({
        id: `job_hist_${i}_${Math.random().toString(36).substring(2, 6)}`,
        userId: `usr_${100 + i}`,
        queue: q,
        type,
        words,
        duration: `${durationSec}s`,
        status: isWarn ? 'WARNING' : 'SUCCESS',
        completedAt: new Date(Date.now() - i * 15 * 60 * 1000).toISOString(),
      });
    }
    return list;
  }, [queues]);

  const columns: ColumnDef<HistoricalJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      monospace: true,
      sortable: true,
    },
    {
      header: 'User ID',
      accessorKey: 'userId',
      monospace: true,
      sortable: true,
    },
    {
      header: 'Queue',
      accessorKey: 'queue',
      sortable: true,
      cell: (row) => <span className="font-bold text-blue-400 uppercase">{row.queue}</span>,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (row) => (
        <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] rounded">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Word Count',
      accessorKey: 'words',
      sortable: true,
      cell: (row) => row.words.toLocaleString(),
    },
    {
      header: 'Duration',
      accessorKey: 'duration',
    },
    {
      header: 'Completed At',
      accessorKey: 'completedAt',
      sortable: true,
      cell: (row) => (
        <span className="text-neutral-500">
          {new Date(row.completedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <StatusBadge status={row.status === 'SUCCESS' ? 'healthy' : 'warning'}>
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          Job Completion History
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          History of all successfully finished analysis pipelines today.
        </p>
      </div>

      <DataTable
        data={completedJobs}
        columns={columns}
        rowIdKey="id"
        searchKey="id"
        searchPlaceholder="Search jobs by ID..."
      />
    </div>
  );
}
