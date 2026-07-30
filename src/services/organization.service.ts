import { apiRequest } from '@/lib/api/client';
import { Organization } from '@/lib/types/api';

export const organizationService = {
  list(accessToken: string): Promise<Organization[]> {
    return apiRequest<Organization[]>('/organizations', {
      method: 'GET',
      token: accessToken,
    });
  },

  create(accessToken: string, payload: { name: string; domain?: string }): Promise<Organization> {
    return apiRequest<Organization>('/organizations', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },
};
