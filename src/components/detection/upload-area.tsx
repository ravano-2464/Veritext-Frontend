'use client';

import * as React from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UploadAreaProps {
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
  copy: {
    title: string;
    description: string;
    chooseFile: string;
    uploadAriaLabel: string;
    removeFileAriaLabel: string;
  };
}

export function UploadArea({ onFileSelected, selectedFile, copy }: UploadAreaProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    onFileSelected(file);
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed p-5 transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card/60',
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{copy.title}</p>
          <p className="text-xs text-muted-foreground">{copy.description}</p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
          <UploadCloud className="size-4" />
          {copy.chooseFile}
          <input
            aria-label={copy.uploadAriaLabel}
            type="file"
            className="hidden"
            accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
            onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
          <p className="truncate text-sm">{selectedFile.name}</p>
          <Button
            variant="ghost"
            size="icon"
            aria-label={copy.removeFileAriaLabel}
            onClick={() => onFileSelected(null)}
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  );
}
