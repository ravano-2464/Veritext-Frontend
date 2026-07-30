'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  monospace?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T | string;
  renderExpandedRow?: (row: T) => React.ReactNode;
  bulkActions?: (selectedRows: T[]) => React.ReactNode;
  rowIdKey: keyof T;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchKey,
  renderExpandedRow,
  bulkActions,
  rowIdKey,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());
  const [expandedIds, setExpandedIds] = React.useState<Set<string | number>>(new Set());

  const hasBulkActions = typeof bulkActions === 'function';
  const hasExpandedRow = typeof renderExpandedRow === 'function';

  const filteredData = React.useMemo(() => {
    let result = [...data];

    if (searchQuery && searchKey) {
      result = result.filter((item) => {
        const value = item[searchKey as keyof T];
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = String(a[sortKey as keyof T]);
        const bVal = String(b[sortKey as keyof T]);

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = React.useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      const newSelected = new Set<string | number>();
      paginatedData.forEach((row) => {
        const val = row[rowIdKey];
        if (typeof val === 'string' || typeof val === 'number') {
          newSelected.add(val);
        }
      });
      setSelectedIds(newSelected);
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleExpandRow = (id: string | number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const selectedRows = React.useMemo(() => {
    return data.filter((row) => {
      const val = row[rowIdKey];
      return typeof val === 'string' || typeof val === 'number' ? selectedIds.has(val) : false;
    });
  }, [data, selectedIds, rowIdKey]);

  return (
    <div className="flex flex-col gap-3 w-full bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#737373]" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-[#0a0a0a] border-[#1f1f1f] text-sm text-[#f5f5f5] placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {bulkActions && selectedIds.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-md">
              <span className="text-xs text-[#737373] font-mono">{selectedIds.size} selected</span>
              {bulkActions(selectedRows)}
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-x-auto border border-[#1f1f1f] rounded-md bg-[#0d0d0d]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[11px] font-medium text-[#737373] uppercase tracking-wider">
              {hasExpandedRow && <th className="px-3 py-3 w-8" />}
              {hasBulkActions && (
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="rounded border-[#1f1f1f] bg-[#0a0a0a] text-blue-500 focus:ring-0 w-3.5 h-3.5"
                  />
                </th>
              )}

              {columns.map((col, idx) => {
                const isSorted = sortKey === col.accessorKey;
                return (
                  <th
                    key={idx}
                    className={cn(
                      'px-4 py-3 font-sans',
                      col.sortable ? 'cursor-pointer select-none hover:text-[#f5f5f5]' : '',
                      col.width,
                    )}
                    onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.header}</span>
                      {col.sortable &&
                        isSorted &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ))}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f1f]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasExpandedRow ? 1 : 0) + (hasBulkActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-[#737373] font-mono"
                >
                  NO RECORDS FOUND
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const idVal = row[rowIdKey];
                const id =
                  typeof idVal === 'string' || typeof idVal === 'number' ? idVal : String(idVal);
                const isSelected = selectedIds.has(id);
                const isExpanded = expandedIds.has(id);

                return (
                  <React.Fragment key={String(id)}>
                    <tr
                      className={cn(
                        'transition-colors duration-150 hover:bg-[#111111]/80 text-xs text-[#f5f5f5]',
                        isSelected ? 'bg-blue-950/10' : '',
                      )}
                    >
                      {hasExpandedRow && (
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => toggleExpandRow(id)}
                            className="text-[#737373] hover:text-[#f5f5f5]"
                          >
                            <ChevronRight
                              className={cn(
                                'w-4 h-4 transition-transform duration-200',
                                isExpanded ? 'transform rotate-95 text-[#f5f5f5]' : '',
                              )}
                            />
                          </button>
                        </td>
                      )}

                      {hasBulkActions && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(id)}
                            className="rounded border-[#1f1f1f] bg-[#0a0a0a] text-blue-500 focus:ring-0 w-3.5 h-3.5"
                          />
                        </td>
                      )}

                      {columns.map((col, cIdx) => {
                        const val = row[col.accessorKey as keyof T];
                        return (
                          <td
                            key={cIdx}
                            className={cn(
                              'px-4 py-3 align-middle',
                              col.monospace ? 'font-mono text-[11px] tracking-tight' : 'font-sans',
                            )}
                          >
                            {col.cell ? col.cell(row) : String(val)}
                          </td>
                        );
                      })}
                    </tr>
                    {hasExpandedRow && isExpanded && (
                      <tr className="bg-[#0b0b0b]">
                        <td
                          colSpan={
                            columns.length + (hasExpandedRow ? 1 : 0) + (hasBulkActions ? 1 : 0)
                          }
                          className="px-6 py-4 border-t border-b border-[#1f1f1f] shadow-inner"
                        >
                          {renderExpandedRow(row)}
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

      <div className="flex justify-between items-center text-xs font-mono text-[#737373] mt-1">
        <span>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
          {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 bg-neutral-900 border-[#1f1f1f] text-[#737373] hover:text-[#f5f5f5] hover:bg-neutral-850"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="px-2.5 h-8 bg-neutral-900 border-[#1f1f1f] text-[#737373] hover:text-[#f5f5f5] hover:bg-neutral-850"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="px-2 text-center text-[#f5f5f5]">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            className="px-2.5 h-8 bg-neutral-900 border-[#1f1f1f] text-[#737373] hover:text-[#f5f5f5] hover:bg-neutral-850"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 bg-neutral-900 border-[#1f1f1f] text-[#737373] hover:text-[#f5f5f5] hover:bg-neutral-850"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
