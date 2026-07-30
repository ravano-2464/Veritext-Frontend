'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const pageSizeOptions = [10, 50, 100] as const;
export type PageSizeOption = (typeof pageSizeOptions)[number];

interface PaginationControlsProps {
  page: number;
  pageSize: PageSizeOption;
  canPrevious: boolean;
  canNext: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSizeOption) => void;
  disabled?: boolean;
  totalItems?: number;
}

export function PaginationControls({
  page,
  pageSize,
  canPrevious,
  canNext,
  onPageChange,
  onPageSizeChange,
  disabled,
  totalItems,
}: PaginationControlsProps) {
  const totalPages = typeof totalItems === 'number' ? Math.ceil(totalItems / pageSize) : null;

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            onPageSizeChange(Number(value) as PageSizeOption);
          }}
          disabled={disabled}
        >
          <SelectTrigger size="sm" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="min-w-16 text-center text-sm text-muted-foreground">
          Page {page} {totalPages !== null ? `of ${totalPages}` : ''}
        </span>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          aria-label="Previous page"
          disabled={disabled || !canPrevious}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          aria-label="Next page"
          disabled={disabled || !canNext}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
