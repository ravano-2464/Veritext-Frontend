import { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

const isFieldError = (value: unknown): value is FieldError =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof (value as { message?: unknown }).message === 'string';

export const getFirstFormErrorMessage = <TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string | null => {
  const queue: unknown[] = Object.values(errors);

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (isFieldError(current)) {
      return current.message ?? null;
    }

    if (typeof current === 'object') {
      queue.push(...Object.values(current as Record<string, unknown>));
    }
  }

  return null;
};
