import { apiRequest } from '@/lib/api/client';
import { CheckoutResponse, Organization, Plan } from '@/lib/types/api';

export const billingService = {
  plans(): Promise<Plan[]> {
    return apiRequest<Plan[]>('/billing/plans', {
      method: 'GET',
    });
  },

  checkout(
    accessToken: string,
    payload: { organizationId: string; tier: Organization['planTier'] },
  ): Promise<CheckoutResponse> {
    return apiRequest<CheckoutResponse>('/billing/checkout', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },

  portal(accessToken: string, organizationId: string): Promise<CheckoutResponse> {
    return apiRequest<CheckoutResponse>('/billing/portal', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ organizationId }),
    });
  },
};
