import { AlertTriangle, BadgeCheck, BrainCircuit } from 'lucide-react';
import { DetectionRecord } from '@/lib/types/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatAiFingerprint } from '@/lib/utils';

interface DetectionSummaryProps {
  detection: DetectionRecord;
  copy: {
    title: string;
    aiLikelihoodSuffix: string;
    mixedSignalLabel: string;
    aiHeavyLabel: string;
    humanHeavyLabel: string;
    aiProbabilityLabel: string;
    confidenceLabel: string;
    humanLikelihoodLabel: string;
    suspiciousRatioLabel: string;
    modelInterpretationTitle: string;
    modelInterpretationMixed: string;
    modelInterpretationAiHeavy: string;
    modelInterpretationHumanHeavy: string;
    riskControlsTitle: string;
    riskControlsBody: string;
    multilayerScoringBadge: string;
    explainabilityBadge: string;
  };
}

const scoreToPct = (value: number) => Math.round(value * 100);

export function DetectionSummary({ detection, copy }: DetectionSummaryProps) {
  const aiScore = scoreToPct(detection.overallAiProbability);
  const confidence = scoreToPct(detection.confidenceScore);
  const humanLikelihood = scoreToPct(detection.humanLikelihoodScore);
  const suspiciousRatio = detection.sentenceAnalyses.length
    ? detection.suspiciousSentences.length / detection.sentenceAnalyses.length
    : 0;
  const isMixedAuthorship =
    aiScore >= 38 &&
    aiScore <= 72 &&
    confidence <= 78 &&
    suspiciousRatio > 0.12 &&
    suspiciousRatio < 0.88;

  const badgeVariant: 'destructive' | 'secondary' = aiScore >= 65 ? 'destructive' : 'secondary';
  const summaryLabel = isMixedAuthorship
    ? copy.mixedSignalLabel
    : aiScore >= 65
      ? copy.aiHeavyLabel
      : copy.humanHeavyLabel;

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-3 text-xl">
          <BrainCircuit />
          {copy.title}
          <Badge variant={badgeVariant}>
            {aiScore}% {copy.aiLikelihoodSuffix} - {summaryLabel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {copy.aiProbabilityLabel}
            </p>
            <p className="mt-2 text-3xl font-semibold">{aiScore}%</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {copy.confidenceLabel}
            </p>
            <p className="mt-2 text-3xl font-semibold">{confidence}%</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {copy.humanLikelihoodLabel}
            </p>
            <p className="mt-2 text-3xl font-semibold">{humanLikelihood}%</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              AI fingerprint
            </p>
            <p className="mt-2 text-lg font-semibold">
              {formatAiFingerprint(detection.aiFingerprint)}
            </p>
            <p className="text-xs text-muted-foreground">
              {scoreToPct(detection.fingerprintConfidence)}% confidence
            </p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Readability</p>
            <p className="mt-2 text-lg font-semibold">{scoreToPct(detection.readabilityScore)}%</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Token probability
            </p>
            <p className="mt-2 text-lg font-semibold">
              {scoreToPct(detection.tokenProbabilityScore)}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{copy.suspiciousRatioLabel}</span>
              <span>
                {detection.suspiciousSentences.length} / {detection.sentenceAnalyses.length}
              </span>
            </div>
            <Progress value={detection.sentenceAnalyses.length ? suspiciousRatio * 100 : 0} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 p-3">
              <p className="mb-1 text-sm font-medium">{copy.modelInterpretationTitle}</p>
              <p className="text-xs text-muted-foreground">
                {isMixedAuthorship
                  ? copy.modelInterpretationMixed
                  : aiScore >= 65
                    ? copy.modelInterpretationAiHeavy
                    : copy.modelInterpretationHumanHeavy}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-3">
              <p className="mb-1 text-sm font-medium">{copy.riskControlsTitle}</p>
              <p className="text-xs text-muted-foreground">{copy.riskControlsBody}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
              <BadgeCheck className="size-3" /> {copy.multilayerScoringBadge}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
              <AlertTriangle className="size-3" /> {copy.explainabilityBadge}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
