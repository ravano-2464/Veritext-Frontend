'use client';

import { DetectionRecord } from '@/lib/types/api';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DetectionTrendChartProps {
  items: DetectionRecord[];
  copy: {
    title: string;
    seriesAiProbability: string;
    seriesConfidence: string;
  };
}

export function DetectionTrendChart({ items, copy }: DetectionTrendChartProps) {
  const data = [...items].reverse().map((item) => ({
    label: new Date(item.createdAt).toLocaleDateString(),
    aiProbability: Number((item.overallAiProbability * 100).toFixed(2)),
    confidence: Number((item.confidenceScore * 100).toFixed(2)),
  }));

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">{copy.title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
              }}
              labelStyle={{
                color: 'var(--foreground)',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            />
            <Line
              type="monotone"
              dataKey="aiProbability"
              name={copy.seriesAiProbability}
              stroke="#1d4ed8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              name={copy.seriesConfidence}
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
