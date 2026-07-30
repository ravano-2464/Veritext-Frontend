import { apiRequest } from '@/lib/api/client';
import { ApiKeyRecord, CreatedApiKey } from '@/lib/types/api';

export const apiKeyService = {
  list(accessToken: string): Promise<ApiKeyRecord[]> {
    return apiRequest<ApiKeyRecord[]>('/api-keys', {
      method: 'GET',
      token: accessToken,
    });
  },

  create(
    accessToken: string,
    payload: {
      name: string;
      organizationId?: string;
      scopes?: string[];
      rateLimitPerMinute?: number;
    },
  ): Promise<CreatedApiKey> {
    return apiRequest<CreatedApiKey>('/api-keys', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },

  revoke(accessToken: string, apiKeyId: string): Promise<{ ok: true }> {
    return apiRequest<{ ok: true }>('/api-keys/revoke', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ apiKeyId }),
    });
  },
};
