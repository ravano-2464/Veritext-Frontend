import { apiRequest } from '@/lib/api/client';

export interface AdminOverview {
  totals: {
    users: number;
    organizations: number;
    detections: number;
    activeApiKeys: number;
    flaggedDetections: number;
    failedDetections: number;
  };
  usage: Array<{ type: string; quantity: number }>;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  provider: string;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export const adminService = {
  overview(accessToken: string): Promise<AdminOverview> {
    return apiRequest<AdminOverview>('/admin/overview', {
      method: 'GET',
      token: accessToken,
    });
  },

  users(accessToken: string, page = 1, limit = 10): Promise<AdminUser[]> {
    return apiRequest<AdminUser[]>(`/admin/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      token: accessToken,
    });
  },

  updateUserRole(accessToken: string, userId: string, role: AdminUser['role']): Promise<AdminUser> {
    return apiRequest<AdminUser>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      token: accessToken,
      body: JSON.stringify({ role }),
    });
  },

  deleteUser(accessToken: string, userId: string): Promise<{ ok: true; id: string }> {
    return apiRequest<{ ok: true; id: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
      token: accessToken,
    });
  },

  flaggedContent(accessToken: string): Promise<unknown[]> {
    return apiRequest<unknown[]>('/admin/flagged-content', {
      method: 'GET',
      token: accessToken,
    });
  },

  apiMonitoring(accessToken: string, page = 1, limit = 10): Promise<unknown[]> {
    return apiRequest<unknown[]>(`/admin/api-monitoring?page=${page}&limit=${limit}`, {
      method: 'GET',
      token: accessToken,
    });
  },

  system(accessToken: string): Promise<unknown> {
    return apiRequest<unknown>('/admin/system', {
      method: 'GET',
      token: accessToken,
    });
  },
};
