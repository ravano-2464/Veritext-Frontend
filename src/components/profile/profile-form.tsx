'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { CountryFlag } from '@/components/common/country-flag';
import { useAuth } from '@/hooks/use-auth';
import { getCountryMetadata, getEditableCountryValue } from '@/lib/utils/country';
import { userService } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  copy: {
    form: {
      fullNameLabel: string;
      fullNamePlaceholder: string;
      countryLabel: string;
      countryPlaceholder: string;
      avatarUrlLabel: string;
      avatarUrlPlaceholder: string;
      saveButton: string;
      savingButton: string;
    };
    toasts: {
      signInRequired: string;
      saved: string;
      saveFailed: string;
    };
  };
}

export function ProfileForm({ copy }: ProfileFormProps) {
  const { user, tokens } = useAuth();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = React.useState(false);
  const [countryValue, setCountryValue] = React.useState('');

  React.useEffect(() => {
    setCountryValue(getEditableCountryValue(user?.locale));
  }, [user?.id, user?.locale]);

  const countryMetadata = React.useMemo(() => getCountryMetadata(countryValue), [countryValue]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!tokens?.accessToken) {
      toast.error(copy.toasts.signInRequired);
      return;
    }

    const form = new FormData(event.currentTarget);

    const fullName = String(form.get('fullName') ?? '').trim();
    const avatarUrl = String(form.get('avatarUrl') ?? '').trim();
    const locale = countryValue.trim();

    setIsSaving(true);
    try {
      const updatedUser = await userService.update(tokens.accessToken, {
        fullName,
        avatarUrl,
        locale,
      });
      queryClient.setQueryData(['profile'], updatedUser);
      setCountryValue(getEditableCountryValue(updatedUser.locale));
      toast.success(copy.toasts.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.toasts.saveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form key={user?.id ?? 'guest'} className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">{copy.form.fullNameLabel}</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder={copy.form.fullNamePlaceholder}
            defaultValue={user?.fullName ?? ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locale">{copy.form.countryLabel}</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <CountryFlag
                countryCode={countryMetadata.code}
                countryName={countryMetadata.displayValue}
              />
            </span>
            <Input
              id="locale"
              name="locale"
              className="pl-10"
              placeholder={copy.form.countryPlaceholder}
              value={countryValue}
              onChange={(event) => {
                setCountryValue(event.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl">{copy.form.avatarUrlLabel}</Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          placeholder={copy.form.avatarUrlPlaceholder}
          defaultValue={user?.avatarUrl ?? ''}
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        <Save data-icon="inline-start" />
        {isSaving ? copy.form.savingButton : copy.form.saveButton}
      </Button>
    </form>
  );
}
