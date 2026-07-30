import { apiRequest } from '@/lib/api/client';
import { AuthUser } from '@/lib/types/api';

interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
  locale?: string;
}

export const userService = {
  me(accessToken: string): Promise<AuthUser> {
    return apiRequest<AuthUser>('/users/me', {
      method: 'GET',
      token: accessToken,
    });
  },

  update(accessToken: string, payload: UpdateProfilePayload): Promise<AuthUser> {
    return apiRequest<AuthUser>('/users/me', {
      method: 'PATCH',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },
};
