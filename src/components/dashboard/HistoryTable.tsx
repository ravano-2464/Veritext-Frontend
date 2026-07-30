import React, { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { FileText, Type, Download, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import * as Tooltip from '@radix-ui/react-tooltip';

export interface HistoryItem {
  id: string;
  title: string;
  sourceType: 'TEXT' | 'FILE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  overallAiProbability: number;
  aiFingerprint: string;
  createdAt: string;
}

interface HistoryTableProps {
  data: HistoryItem[];
  onExport: (id: string) => void;
}

const columnHelper = createColumnHelper<HistoryItem>();

export function HistoryTable({ data, onExport }: HistoryTableProps) {
  'use no memo';
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title / Document',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-md text-muted-foreground">
              {info.row.original.sourceType === 'FILE' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <Type className="w-4 h-4" />
              )}
            </div>
            <span className="font-medium text-foreground">{info.getValue() || 'Untitled'}</span>
          </div>
        ),
      }),
      columnHelper.accessor('overallAiProbability', {
        header: 'AI Probability',
        cell: (info) => {
          const val = info.getValue();
          const percentage = (val * 100).toFixed(1) + '%';
          let colorClass = 'text-green-600 bg-green-500/10 border-green-500/20';
          if (val > 0.4) colorClass = 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
          if (val > 0.7) colorClass = 'text-red-600 bg-red-500/10 border-red-500/20';

          return (
            <div className="flex items-center gap-2">
              <span
                className={clsx('px-2.5 py-1 rounded-md text-xs font-semibold border', colorClass)}
              >
                {percentage}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={clsx(
                'text-xs font-medium capitalize',
                status === 'COMPLETED'
                  ? 'text-green-600'
                  : status === 'FAILED'
                    ? 'text-destructive'
                    : 'text-muted-foreground',
              )}
            >
              {status.toLowerCase()}
            </span>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {format(new Date(info.getValue()), 'MMM d, yyyy HH:mm')}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => onExport(info.row.original.id)}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-sm"
                  sideOffset={4}
                >
                  Export PDF
                  <Tooltip.Arrow className="fill-popover" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ),
      }),
    ],
    [onExport],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 font-semibold tracking-wider">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-2 hover:text-foreground transition-colors'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className="w-3 h-3" />,
                          desc: <ChevronDown className="w-3 h-3" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-background border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} results
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
