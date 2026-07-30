import { apiBaseUrl, apiRequest } from '@/lib/api/client';
import {
  AuthResponse,
  AuthTokens,
  AuthUser,
  FindAccountResponse,
  ForgotPasswordResponse,
} from '@/lib/types/api';
import {
  FindAccountValues,
  ForgotPasswordValues,
  LoginValues,
  RegisterValues,
} from '@/lib/validators/auth.schemas';

export const authService = {
  login(payload: LoginValues): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register(payload: RegisterValues): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  refresh(refreshToken: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  findAccount(payload: FindAccountValues): Promise<FindAccountResponse> {
    return apiRequest<FindAccountResponse>('/auth/find-account', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  forgotPassword(payload: ForgotPasswordValues): Promise<ForgotPasswordResponse> {
    return apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  resetPassword(token: string, password: string): Promise<{ ok: true }> {
    return apiRequest<{ ok: true }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  me(accessToken: string): Promise<AuthUser> {
    return apiRequest<AuthUser>('/auth/me', {
      method: 'GET',
      token: accessToken,
    });
  },

  logout(accessToken: string, refreshToken?: string): Promise<{ ok: true }> {
    return apiRequest<{ ok: true }>('/auth/logout', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ refreshToken }),
    });
  },

  googleOauthUrl(): string {
    return `${apiBaseUrl}/auth/google`;
  },

  githubOauthUrl(): string {
    return `${apiBaseUrl}/auth/github`;
  },
};

export const persistTokens = (tokens: AuthTokens): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('veritext.tokens', JSON.stringify(tokens));
};

export const readStoredTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem('veritext.tokens');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
};

export const clearStoredTokens = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('veritext.tokens');
};
