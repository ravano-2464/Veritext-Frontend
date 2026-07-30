'use client';

import { DetectionRecord } from '@/lib/types/api';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DetectionChartsProps {
  detection: DetectionRecord;
  copy: {
    burstinessVsComplexity: string;
    entropyDistribution: string;
    aiProbabilityHeatmapBars: string;
    burstinessLegend: string;
    complexityLegend: string;
    entropyLegend: string;
    aiProbabilityLegend: string;
  };
}

export function DetectionCharts({ detection, copy }: DetectionChartsProps) {
  const chartData = detection.sentenceAnalyses.map((item) => ({
    sentence: `S${item.sentenceIndex + 1}`,
    burstiness: Number(item.burstiness.toFixed(3)),
    complexity: Number(item.complexity.toFixed(3)),
    entropy: Number(item.entropy.toFixed(3)),
    aiProbability: Number(item.aiProbability.toFixed(3)),
  }));

  return (
    <div id="analytics" className="grid gap-4 xl:grid-cols-2">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">{copy.burstinessVsComplexity}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="sentence" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="burstiness" fill="#2463eb" name={copy.burstinessLegend} />
              <Bar dataKey="complexity" fill="#11a16f" name={copy.complexityLegend} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">{copy.entropyDistribution}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="sentence" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="entropy" name={copy.entropyLegend}>
                {chartData.map((row) => (
                  <Cell
                    key={row.sentence}
                    fill={row.entropy > 0.7 ? '#dc2626' : row.entropy > 0.5 ? '#ea580c' : '#0ea5e9'}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">{copy.aiProbabilityHeatmapBars}</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="sentence" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="aiProbability" name={copy.aiProbabilityLegend}>
                {chartData.map((row) => (
                  <Cell
                    key={`${row.sentence}-ai`}
                    fill={
                      row.aiProbability >= 0.8
                        ? '#b91c1c'
                        : row.aiProbability >= 0.65
                          ? '#d97706'
                          : row.aiProbability >= 0.45
                            ? '#eab308'
                            : '#16a34a'
                    }
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
