'use client';

import { useQuery } from '@tanstack/react-query';
import { CountryFlag } from '@/components/common/country-flag';
import { ProfileForm } from '@/components/profile/profile-form';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { getCountryMetadata } from '@/lib/utils/country';
import { userService } from '@/services/user.service';

export default function ProfilePage() {
  const { tokens, user } = useAuth();
  const copy = useDashboardCopy('profile');

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.me(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken),
  });

  const profile = profileQuery.data ?? user;
  const countryMetadata = getCountryMetadata(profile?.locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>{copy.cards.accountOverview}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">{copy.accountLabels.name}: </span>
            {profile?.fullName ?? '-'}
          </p>
          <p>
            <span className="text-muted-foreground">{copy.accountLabels.email}: </span>
            {profile?.email ?? '-'}
          </p>
          <p>
            <span className="text-muted-foreground">{copy.accountLabels.role}: </span>
            {profile?.role ?? '-'}
          </p>
          <p>
            <span className="text-muted-foreground">{copy.accountLabels.country}: </span>
            {countryMetadata.displayValue ? (
              <span className="inline-flex items-center gap-2">
                <CountryFlag
                  countryCode={countryMetadata.code}
                  countryName={countryMetadata.displayValue}
                  className="h-[18px] w-[26px]"
                />
                <span>{countryMetadata.displayValue}</span>
              </span>
            ) : (
              '-'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>{copy.cards.updateProfile}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm copy={copy} />
        </CardContent>
      </Card>
    </div>
  );
}
