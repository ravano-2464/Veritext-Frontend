'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Check, Copy, Loader2, WandSparkles } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { HumanizerResponse } from '@/lib/types/api';
import { formatInteger } from '@/lib/utils';
import { HumanizeTextValues, humanizeTextSchema } from '@/lib/validators/detection.schemas';
import { detectionService } from '@/services/detection.service';

const percent = (value: number) => Math.round(value * 100);
const characterLimit = 25000;

const intensityOptions = [
  { value: 1, key: 'light' },
  { value: 2, key: 'balanced' },
  { value: 3, key: 'strong' },
] as const;

const styleOptions = [
  { value: 'balanced', key: 'balanced' },
  { value: 'casual', key: 'casual' },
  { value: 'professional', key: 'professional' },
] as const;

const languageOptionKeys = ['auto', 'en', 'id', 'es', 'fr', 'de', 'ar', 'zh'] as const;
type LanguageOptionKey = (typeof languageOptionKeys)[number];

const resolveIntensityKey = (value: string): (typeof intensityOptions)[number]['key'] | null =>
  intensityOptions.find((option) => String(option.value) === String(value))?.key ?? null;

const resolveStyleKey = (value: string): (typeof styleOptions)[number]['key'] | null =>
  styleOptions.find((option) => option.value === value)?.key ?? null;

export default function HumanizerPage() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('humanizer');
  const [result, setResult] = React.useState<HumanizerResponse | null>(null);
  const [copied, setCopied] = React.useState(false);

  const form = useForm<HumanizeTextValues>({
    resolver: zodResolver(humanizeTextSchema),
    defaultValues: {
      text: '',
      language: 'auto',
      intensity: 2,
      style: 'balanced',
    },
  });
  const currentText = useWatch({
    control: form.control,
    name: 'text',
  });

  const humanizeMutation = useMutation({
    mutationFn: (payload: HumanizeTextValues) =>
      detectionService.humanizeText(tokens!.accessToken, payload),
    onSuccess: (data) => {
      setResult(data);
      toast.success(copy.toasts.humanizedSuccess);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : copy.toasts.humanizedFailed;
      toast.error(message);
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!tokens?.accessToken) {
      toast.error(copy.toasts.signInRequired);
      return;
    }

    setCopied(false);
    await humanizeMutation.mutateAsync(values);
  });

  const copyOutput = async () => {
    if (!result?.humanizedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.humanizedText);
      setCopied(true);
      toast.success(copy.toasts.copiedSuccess);
    } catch {
      toast.error(copy.toasts.copiedFailed);
    }
  };

  const applyOutputAsInput = () => {
    if (!result?.humanizedText) {
      return;
    }

    form.setValue('text', result.humanizedText, { shouldValidate: true });
    toast.success(copy.toasts.outputMoved);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WandSparkles className="size-5" />
              {copy.cards.inputTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="humanizerLanguage">{copy.form.languageLabel}</Label>
                  <Controller
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? 'auto'}
                        onValueChange={field.onChange}
                        disabled={humanizeMutation.isPending}
                      >
                        <SelectTrigger id="humanizerLanguage">
                          <SelectValue placeholder={copy.form.languagePlaceholder}>
                            {(value) =>
                              copy.options.languages[value as LanguageOptionKey] ??
                              copy.form.languagePlaceholder
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptionKeys.map((value) => (
                            <SelectItem key={value} value={value}>
                              {copy.options.languages[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humanizerIntensity">{copy.form.intensityLabel}</Label>
                  <Controller
                    control={form.control}
                    name="intensity"
                    render={({ field }) => (
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={humanizeMutation.isPending}
                      >
                        <SelectTrigger id="humanizerIntensity">
                          <SelectValue placeholder={copy.form.intensityPlaceholder}>
                            {(value) => {
                              const intensityKey = resolveIntensityKey(String(value));
                              return intensityKey
                                ? copy.options.intensity[intensityKey]
                                : copy.form.intensityPlaceholder;
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {intensityOptions.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {copy.options.intensity[option.key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humanizerStyle">{copy.form.styleLabel}</Label>
                  <Controller
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={humanizeMutation.isPending}
                      >
                        <SelectTrigger id="humanizerStyle">
                          <SelectValue placeholder={copy.form.stylePlaceholder}>
                            {(value) => {
                              const styleKey = resolveStyleKey(String(value));
                              return styleKey
                                ? copy.options.style[styleKey]
                                : copy.form.stylePlaceholder;
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {styleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {copy.options.style[option.key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="humanizerText">{copy.form.textLabel}</Label>
                <Textarea
                  id="humanizerText"
                  className="min-h-[280px] resize-y"
                  placeholder={copy.form.textPlaceholder}
                  {...form.register('text')}
                  aria-invalid={!!form.formState.errors.text}
                  disabled={humanizeMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  {formatInteger(currentText?.length ?? 0)} / {formatInteger(characterLimit)}{' '}
                  {copy.form.charactersLabel}
                </p>
                {form.formState.errors.text?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={humanizeMutation.isPending || form.formState.isSubmitting}
              >
                {(humanizeMutation.isPending || form.formState.isSubmitting) && (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                )}
                {copy.form.submitButton}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{copy.cards.outputTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={result?.humanizedText ?? ''}
              readOnly
              className="min-h-[280px] resize-y"
              placeholder={copy.output.placeholder}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void copyOutput();
                }}
                disabled={!result?.humanizedText}
              >
                {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                {copied ? copy.output.copiedButton : copy.output.copyButton}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={applyOutputAsInput}
                disabled={!result?.humanizedText}
              >
                {copy.output.reEditButton}
              </Button>
            </div>

            {result && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.metrics.aiProbability}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {percent(result.before.overallAiProbability)}% →{' '}
                    {percent(result.after.overallAiProbability)}%
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.metrics.suspiciousSentences}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {result.before.suspiciousSentenceIndexes.length} →{' '}
                    {result.after.suspiciousSentenceIndexes.length}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.metrics.rewrittenSentences}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {result.rewriteStats.rewrittenSentences} / {result.targetedSentenceCount}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.metrics.rewriteActions}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {result.rewriteStats.phraseReplacements +
                      result.rewriteStats.contractionsApplied +
                      result.rewriteStats.sentenceSplits}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
