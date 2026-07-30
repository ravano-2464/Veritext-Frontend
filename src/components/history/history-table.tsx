import Link from 'next/link';
import { DetectionRecord } from '@/lib/types/api';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface HistoryTableProps {
  items: DetectionRecord[];
  copy: {
    empty: string;
    title: string;
    status: string;
    aiProbability: string;
    language: string;
    created: string;
    open: string;
    view: string;
    untitledAnalysis: string;
  };
}

const formatPct = (value: number): string => `${Math.round(value * 100)}%`;

export function HistoryTable({ items, copy }: HistoryTableProps) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground">
        {copy.empty}
      </div>
    );
  }

  return (
    <div className="scroll-x rounded-2xl border border-border/60 bg-card/70">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.title}</TableHead>
            <TableHead>{copy.status}</TableHead>
            <TableHead>{copy.aiProbability}</TableHead>
            <TableHead>{copy.language}</TableHead>
            <TableHead>{copy.created}</TableHead>
            <TableHead className="text-right">{copy.open}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title || copy.untitledAnalysis}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'FAILED' ? 'destructive' : 'secondary'}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{formatPct(item.overallAiProbability)}</TableCell>
              <TableCell className="uppercase">{item.language}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Link
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href={`/dashboard/history?focus=${item.id}`}
                >
                  {copy.view}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
