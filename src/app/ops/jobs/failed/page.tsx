'use client';

import React from 'react';
import { useOpsStore, FailedJob } from '@/lib/ops-mock-data';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FailedJobsPage() {
  const {
    failedJobsList,
    retryFailedJob,
    deleteFailedJob,
    retryAllFailedJobs,
    deleteAllFailedJobs,
  } = useOpsStore();

  const [expandedJobId, setExpandedJobId] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
            Failed Jobs Recovery
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Diagnose job faults, inspect application stacks, and retry failed analysis.
          </p>
        </div>

        {failedJobsList.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={retryAllFailedJobs}
              className="bg-emerald-950/20 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/30 text-xs h-8 px-3"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Retry All ({failedJobsList.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deleteAllFailedJobs}
              className="bg-red-950/20 text-red-400 border-red-900/40 hover:bg-red-950/30 text-xs h-8 px-3"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete All
            </Button>
          </div>
        )}
      </div>

      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5 w-8" />
                <th className="px-4 py-2.5">Job ID</th>
                <th className="px-4 py-2.5">Queue</th>
                <th className="px-4 py-2.5">Failed At</th>
                <th className="px-4 py-2.5">Attempts</th>
                <th className="px-4 py-2.5">Failure Reason</th>
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
                  const isExpanded = expandedJobId === job.jobId;

                  return (
                    <React.Fragment key={job.jobId}>
                      <tr className="hover:bg-neutral-900/30">
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setExpandedJobId(isExpanded ? null : job.jobId)}
                            className="text-[#737373] hover:text-[#f5f5f5]"
                          >
                            <span className="block w-4 text-center text-xs">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3 font-semibold">{job.jobId}</td>
                        <td className="px-4 py-3 text-blue-400 uppercase font-bold">{job.queue}</td>
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
                          className="px-4 py-3 text-red-400 max-w-[250px] truncate"
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
    </div>
  );
}
