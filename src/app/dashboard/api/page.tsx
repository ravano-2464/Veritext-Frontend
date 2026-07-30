'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, KeyRound, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  PageSizeOption,
  PaginationControls,
  paginateItems,
} from '@/components/common/pagination-controls';
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
import { CreatedApiKey } from '@/lib/types/api';
import { apiKeyService } from '@/services/api-key.service';
import { organizationService } from '@/services/organization.service';

export default function ApiPage() {
  const { tokens } = useAuth();
  const copy = useDashboardCopy('api');
  const queryClient = useQueryClient();
  const [name, setName] = React.useState('');
  const [organizationId, setOrganizationId] = React.useState<string>('personal');
  const [createdKey, setCreatedKey] = React.useState<CreatedApiKey | null>(null);
  const [apiKeyPage, setApiKeyPage] = React.useState(1);
  const [apiKeyPageSize, setApiKeyPageSize] = React.useState<PageSizeOption>(10);

  // Set the default key name translation once loaded
  React.useEffect(() => {
    if (copy?.fields?.namePlaceholder) {
      setName(copy.fields.namePlaceholder);
    }
  }, [copy]);

  const apiKeysQuery = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => apiKeyService.list(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken),
  });
  const organizationsQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.list(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiKeyService.create(tokens!.accessToken, {
        name,
        organizationId: organizationId === 'personal' ? undefined : organizationId,
        scopes: ['detect:write', 'history:read', 'analytics:read'],
        rateLimitPerMinute: 120,
      }),
    onSuccess: (data) => {
      setCreatedKey(data);
      toast.success(copy.toasts.apiKeyCreated);
      void queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.toasts.apiKeyFailed),
  });

  const revokeMutation = useMutation({
    mutationFn: (apiKeyId: string) => apiKeyService.revoke(tokens!.accessToken, apiKeyId),
    onSuccess: () => {
      toast.success(copy.toasts.apiKeyRevoked);
      void queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
  const apiKeys = apiKeysQuery.data ?? [];
  const visibleApiKeys = paginateItems(apiKeys, apiKeyPage, apiKeyPageSize);

  React.useEffect(() => {
    if (apiKeyPage > 1 && visibleApiKeys.length === 0) {
      setApiKeyPage((currentPage) => Math.max(1, currentPage - 1));
    }
  }, [apiKeyPage, visibleApiKeys.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound /> {copy.cards.createApiKey}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">{copy.fields.nameLabel}</Label>
              <Input id="keyName" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{copy.fields.workspaceLabel}</Label>
              <Select
                value={organizationId}
                onValueChange={(value) => {
                  if (value) {
                    setOrganizationId(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">{copy.fields.workspacePersonal}</SelectItem>
                  {(organizationsQuery.data ?? []).map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              disabled={!name || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              <KeyRound data-icon="inline-start" />
              {copy.buttons.issueKey}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.cards.keys}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {createdKey && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
                <p className="font-medium">{copy.warning}</p>
                <div className="mt-2 flex gap-2">
                  <Input readOnly value={createdKey.key} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Copy key"
                    onClick={() => {
                      void navigator.clipboard.writeText(createdKey.key);
                      toast.success(copy.toasts.copied);
                    }}
                  >
                    <Copy />
                  </Button>
                </div>
              </div>
            )}

            {visibleApiKeys.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No data available</p>
            ) : (
              visibleApiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{apiKey.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {apiKey.keyPrefix}... - {apiKey.status} - {apiKey.rateLimitPerMinute}/min
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={apiKey.status === 'REVOKED' || revokeMutation.isPending}
                    onClick={() => revokeMutation.mutate(apiKey.id)}
                  >
                    <Trash2 data-icon="inline-start" />
                    {copy.buttons.revoke}
                  </Button>
                </div>
              ))
            )}
            <PaginationControls
              page={apiKeyPage}
              pageSize={apiKeyPageSize}
              canPrevious={apiKeyPage > 1}
              canNext={apiKeyPage * apiKeyPageSize < apiKeys.length}
              disabled={apiKeysQuery.isFetching}
              totalItems={apiKeys.length}
              onPageChange={setApiKeyPage}
              onPageSizeChange={(nextPageSize) => {
                setApiKeyPageSize(nextPageSize);
                setApiKeyPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">{copy.cards.restApi}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="scroll-x rounded-lg bg-muted p-4 text-sm">
            {`curl -X POST "$NEXT_PUBLIC_API_URL/detect" \\
  -H "x-api-key: vt_live_..." \\
  -H "content-type: application/json" \\
  -d '{"text":"Paste at least 60 characters of content for analysis","language":"auto"}'`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
