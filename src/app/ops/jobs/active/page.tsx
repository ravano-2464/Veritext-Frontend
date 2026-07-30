'use client';

import React from 'react';
import { useOpsStore } from '@/lib/ops-mock-data';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActiveJobsPage() {
  const { activeJobsList, cancelActiveJob, manualRefresh } = useOpsStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          Active Processing Jobs
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          Live feed of running text and file analysis.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-4">
        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Job ID</th>
                <th className="px-4 py-2.5">User ID</th>
                <th className="px-4 py-2.5">Queue</th>
                <th className="px-4 py-2.5">Job Type</th>
                <th className="px-4 py-2.5">Tokens/Words</th>
                <th className="px-4 py-2.5 w-64">Processing Progress</th>
                <th className="px-4 py-2.5">Started At</th>
                <th className="px-4 py-2.5">Duration</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-[#f5f5f5]">
              {activeJobsList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#737373]">
                    NO ACTIVE JOBS RUNNING
                  </td>
                </tr>
              ) : (
                activeJobsList.map((job) => (
                  <tr key={job.jobId} className="hover:bg-neutral-900/30">
                    <td className="px-4 py-3 font-semibold text-[#f5f5f5]">{job.jobId}</td>
                    <td className="px-4 py-3 text-neutral-400">{job.userId}</td>
                    <td className="px-4 py-3 uppercase font-bold text-blue-400">{job.queue}</td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] rounded">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{job.wordCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[9px] text-[#737373]">
                          <span className="truncate max-w-[150px]">{job.stage}</span>
                          <span className="font-bold text-blue-400">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-1.5 bg-black" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {new Date(job.startedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">{job.duration}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelActiveJob(job.jobId)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20 px-2 h-7 rounded text-[11px]"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Kill Job
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
