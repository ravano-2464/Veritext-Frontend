import React from 'react';
import { clsx } from 'clsx';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60 bg-muted/10',
        className,
      )}
    >
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/5 text-primary">
        <FileSearch className="w-10 h-10 opacity-80" />
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="max-w-sm mb-6 text-sm text-muted-foreground">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
