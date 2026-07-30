'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { Organization } from '@/lib/types/api';
import { billingService } from '@/services/billing.service';
import { organizationService } from '@/services/organization.service';

export default function BillingPage() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('billing');
  const queryClient = useQueryClient();
  const [organizationId, setOrganizationId] = React.useState('');
  const [workspaceName, setWorkspaceName] = React.useState('');

  React.useEffect(() => {
    if (copy?.newWorkspaceDefault) {
      setWorkspaceName(copy.newWorkspaceDefault);
    }
  }, [copy]);

  const organizationsQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.list(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken),
  });
  const plansQuery = useQuery({
    queryKey: ['billing-plans'],
    queryFn: billingService.plans,
  });

  const createOrganizationMutation = useMutation({
    mutationFn: () => organizationService.create(tokens!.accessToken, { name: workspaceName }),
    onSuccess: (organization) => {
      setOrganizationId(organization.id);
      toast.success(copy.toasts.workspaceCreated);
      void queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (tier: Organization['planTier']) =>
      billingService.checkout(tokens!.accessToken, { organizationId, tier }),
    onSuccess: (response) => {
      if (response.message) {
        toast.message(response.message);
      }

      if (response.url) {
        window.location.href = response.url;
      }
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.toasts.checkoutFailed),
  });

  const portalMutation = useMutation({
    mutationFn: () => billingService.portal(tokens!.accessToken, organizationId),
    onSuccess: (response) => {
      if (response.url) {
        window.location.href = response.url;
      }
    },
  });

  const organizations = organizationsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{copy.workspaceLabel}</Label>
              <Select
                value={organizationId}
                onValueChange={(value) => {
                  if (value) {
                    setOrganizationId(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={copy.workspacePlaceholder}>
                    {(value) => {
                      const org = organizations.find((o) => o.id === value);
                      return org ? org.name : copy.workspacePlaceholder;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspaceName">{copy.newWorkspaceLabel}</Label>
              <Input
                id="workspaceName"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!workspaceName || createOrganizationMutation.isPending}
              onClick={() => createOrganizationMutation.mutate()}
            >
              <Plus data-icon="inline-start" />
              {copy.buttons.create}
            </Button>
            <Button
              type="button"
              disabled={!organizationId || portalMutation.isPending}
              onClick={() => portalMutation.mutate()}
            >
              <CreditCard data-icon="inline-start" />
              {copy.buttons.portal}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {(plansQuery.data ?? []).map((plan) => (
          <Card key={plan.tier} className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">{plan.tier}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-semibold">
                  {plan.priceMonthlyUsd === null ? copy.customPrice : `$${plan.priceMonthlyUsd}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {plan.monthlyDetectionLimit.toLocaleString()} {copy.detectionsPerMonth}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button
                type="button"
                className="w-full"
                variant={plan.tier === 'FREE' ? 'outline' : 'default'}
                disabled={!organizationId || plan.tier === 'FREE' || checkoutMutation.isPending}
                onClick={() => checkoutMutation.mutate(plan.tier)}
              >
                {plan.tier === 'FREE' ? copy.buttons.currentStarter : copy.buttons.upgrade}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
