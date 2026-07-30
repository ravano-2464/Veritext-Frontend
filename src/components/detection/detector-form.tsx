'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { DetectionTextValues, detectionTextSchema } from '@/lib/validators/detection.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatInteger } from '@/lib/utils';

interface DetectorFormProps {
  disabled?: boolean;
  onSubmit: (values: DetectionTextValues) => Promise<void>;
  copy: {
    analysisTitleLabel: string;
    analysisTitlePlaceholder: string;
    languageLabel: string;
    languagePlaceholder: string;
    languageOptions: {
      auto: string;
      en: string;
      id: string;
      es: string;
      fr: string;
      de: string;
      ar: string;
      zh: string;
    };
    textLabel: string;
    textPlaceholder: string;
    charactersLabel: string;
    submitButton: string;
  };
}

const languageOptionKeys = ['auto', 'en', 'id', 'es', 'fr', 'de', 'ar', 'zh'] as const;
type LanguageOptionKey = (typeof languageOptionKeys)[number];
const characterLimit = 25000;

export function DetectorForm({ disabled, onSubmit, copy }: DetectorFormProps) {
  const form = useForm<DetectionTextValues>({
    resolver: zodResolver(detectionTextSchema),
    defaultValues: {
      title: '',
      language: 'auto',
      text: '',
    },
  });
  const selectedLanguage = useWatch({
    control: form.control,
    name: 'language',
  });
  const textValue = useWatch({
    control: form.control,
    name: 'text',
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">{copy.analysisTitleLabel}</Label>
          <Input
            id="title"
            placeholder={copy.analysisTitlePlaceholder}
            {...form.register('title')}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{copy.languageLabel}</Label>
          <Select
            value={selectedLanguage ?? 'auto'}
            onValueChange={(value) =>
              form.setValue('language', value ?? 'auto', {
                shouldValidate: true,
              })
            }
            disabled={disabled}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder={copy.languagePlaceholder}>
                {(value) =>
                  copy.languageOptions[value as LanguageOptionKey] ?? copy.languagePlaceholder
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptionKeys.map((value) => (
                <SelectItem key={value} value={value}>
                  {copy.languageOptions[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">{copy.textLabel}</Label>
        <Textarea
          id="text"
          className="min-h-[220px] resize-y"
          placeholder={copy.textPlaceholder}
          {...form.register('text')}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          {formatInteger(textValue?.length ?? 0)} / {formatInteger(characterLimit)}{' '}
          {copy.charactersLabel}
        </p>
        {form.formState.errors.text && (
          <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={disabled || form.formState.isSubmitting}>
        {form.formState.isSubmitting && (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        )}
        {copy.submitButton}
      </Button>
    </form>
  );
}
