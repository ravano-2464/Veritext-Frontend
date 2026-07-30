'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DetectionCharts } from '@/components/detection/detection-charts';
import { DetectorForm } from '@/components/detection/detector-form';
import { DetectionResultSkeleton } from '@/components/detection/detection-result-skeleton';
import { DetectionSummary } from '@/components/detection/detection-summary';
import { SentenceHeatmap } from '@/components/detection/sentence-heatmap';
import { UploadArea } from '@/components/detection/upload-area';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { DetectionRecord } from '@/lib/types/api';
import { DetectionTextValues } from '@/lib/validators/detection.schemas';
import { detectionService } from '@/services/detection.service';

const splitSentences = (text: string): string[] =>
  (text.match(/[^.!?\n]+[.!?]?/g) ?? []).map((sentence) => sentence.trim()).filter(Boolean);

const createOptimisticRecord = (payload: DetectionTextValues): DetectionRecord => {
  const now = new Date().toISOString();
  const sentences = splitSentences(payload.text);

  return {
    id: `optimistic-${Date.now()}`,
    userId: 'current-user',
    title: payload.title ?? 'Pending analysis',
    language: payload.language ?? 'auto',
    sourceType: 'TEXT',
    status: 'PROCESSING',
    content: payload.text,
    fileName: null,
    fileMimeType: null,
    fileSize: null,
    overallAiProbability: 0,
    confidenceScore: 0,
    humanLikelihoodScore: 1,
    perplexityScore: 0,
    burstinessScore: 0,
    stylometryScore: 0,
    semanticScore: 0,
    entropyScore: 0,
    complexityScore: 0,
    tokenProbabilityScore: 0,
    readabilityScore: 0,
    aiFingerprint: 'UNKNOWN',
    fingerprintConfidence: 0,
    processingLatencyMs: null,
    suspiciousSentences: [],
    createdAt: now,
    updatedAt: now,
    sentenceAnalyses: sentences.map((sentence, index) => ({
      sentenceIndex: index,
      sentence,
      aiProbability: 0,
      confidence: 0,
      perplexity: 0,
      burstiness: 0,
      stylometry: 0,
      semantic: 0,
      entropy: 0,
      complexity: 0,
      tokenProbability: 0,
      readability: 0,
      isSuspicious: false,
    })),
    modelVerifications: [],
  };
};

export default function DetectorPage() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('detector');
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = React.useState('');
  const [uploadLanguage, setUploadLanguage] = React.useState('auto');
  const [activeResult, setActiveResult] = React.useState<DetectionRecord | null>(null);

  const textMutation = useMutation({
    mutationFn: (values: DetectionTextValues) =>
      detectionService.detectText(tokens!.accessToken, values),
    onSuccess: (data) => {
      setActiveResult(data);
      toast.success(copy.toasts.textAnalyzed);
      void queryClient.invalidateQueries({ queryKey: ['detection-history-overview'] });
      void queryClient.invalidateQueries({ queryKey: ['detection-history'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : copy.toasts.detectionFailed);
      setActiveResult(null);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      detectionService.uploadTextFile(tokens!.accessToken, file, {
        title: uploadTitle || undefined,
        language: uploadLanguage || undefined,
      }),
    onSuccess: (data) => {
      setActiveResult(data);
      setSelectedFile(null);
      toast.success(copy.toasts.fileAnalyzed);
      void queryClient.invalidateQueries({ queryKey: ['detection-history-overview'] });
      void queryClient.invalidateQueries({ queryKey: ['detection-history'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : copy.toasts.uploadFailed);
      setActiveResult(null);
    },
  });

  const onSubmitText = async (values: DetectionTextValues) => {
    if (!tokens?.accessToken) {
      toast.error(copy.toasts.signInRequired);
      return;
    }

    setActiveResult(createOptimisticRecord(values));
    await textMutation.mutateAsync(values);
  };

  const onAnalyzeFile = async () => {
    if (!selectedFile) {
      toast.error(copy.toasts.selectFileFirst);
      return;
    }

    if (!tokens?.accessToken) {
      toast.error(copy.toasts.signInRequired);
      return;
    }

    setActiveResult(null);
    await uploadMutation.mutateAsync(selectedFile);
  };

  const isBusy = textMutation.isPending || uploadMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{copy.cards.analyzeTextInput}</CardTitle>
          </CardHeader>
          <CardContent>
            <DetectorForm disabled={isBusy} onSubmit={onSubmitText} copy={copy.detectorForm} />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{copy.cards.uploadForAnalysis}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadArea
              selectedFile={selectedFile}
              onFileSelected={setSelectedFile}
              copy={copy.uploadArea}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="uploadTitle">{copy.uploadFields.titleLabel}</Label>
                <Input
                  id="uploadTitle"
                  placeholder={copy.uploadFields.titlePlaceholder}
                  value={uploadTitle}
                  onChange={(event) => setUploadTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uploadLanguage">{copy.uploadFields.languageLabel}</Label>
                <Input
                  id="uploadLanguage"
                  placeholder={copy.uploadFields.languagePlaceholder}
                  value={uploadLanguage}
                  onChange={(event) => setUploadLanguage(event.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              disabled={isBusy || !selectedFile}
              onClick={() => {
                void onAnalyzeFile();
              }}
            >
              {copy.buttons.analyzeUploadedFile}
            </Button>
          </CardContent>
        </Card>
      </div>

      {isBusy && <DetectionResultSkeleton />}

      {activeResult && activeResult.status === 'COMPLETED' && (
        <div className="space-y-6">
          <DetectionSummary detection={activeResult} copy={copy.summary} />
          <DetectionCharts detection={activeResult} copy={copy.charts} />
          <SentenceHeatmap detection={activeResult} copy={copy.heatmap} />
        </div>
      )}
    </div>
  );
}
