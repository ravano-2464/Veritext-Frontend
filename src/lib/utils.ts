import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInteger(value: number) {
  return integerFormatter.format(value);
}

export function formatAiFingerprint(fingerprint: string) {
  const map: Record<string, string> = {
    CHATGPT: 'ChatGPT',
    CLAUDE: 'Claude',
    GEMINI: 'Gemini',
    LLAMA: 'LLaMA',
    MIXED: 'Mixed',
    UNKNOWN: 'Unknown',
  };
  return map[fingerprint.toUpperCase()] ?? fingerprint;
}
