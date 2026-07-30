import { apiRequest } from '@/lib/api/client';
import { AnalyticsResponse } from '@/lib/types/api';

export const analyticsService = {
  dashboard(accessToken: string, organizationId?: string): Promise<AnalyticsResponse> {
    const params = new URLSearchParams();

    if (organizationId) {
      params.set('organizationId', organizationId);
    }

    const suffix = params.toString() ? `?${params.toString()}` : '';

    return apiRequest<AnalyticsResponse>(`/analytics${suffix}`, {
      method: 'GET',
      token: accessToken,
    });
  },
};
