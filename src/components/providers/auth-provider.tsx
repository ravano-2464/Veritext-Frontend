'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { AuthResponse, AuthTokens, AuthUser } from '@/lib/types/api';
import { LoginValues, RegisterValues } from '@/lib/validators/auth.schemas';
import {
  authService,
  clearStoredTokens,
  persistTokens,
  readStoredTokens,
} from '@/services/auth.service';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (payload: LoginValues) => Promise<AuthResponse>;
  register: (payload: RegisterValues) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthTokens | null>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const applyAuthResponse = (response: AuthResponse) => {
  persistTokens(response.tokens);
  return response;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [tokens, setTokens] = React.useState<AuthTokens | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>('loading');

  const resetAuth = React.useCallback(() => {
    clearStoredTokens();
    setTokens(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const hydrateUser = React.useCallback(async (incomingTokens: AuthTokens) => {
    try {
      const profile = await authService.me(incomingTokens.accessToken);
      setUser(profile);
      setTokens(incomingTokens);
      setStatus('authenticated');
      return true;
    } catch {
      return false;
    }
  }, []);

  React.useEffect(() => {
    const bootstrap = async () => {
      const stored = readStoredTokens();

      if (!stored) {
        setStatus('unauthenticated');
        return;
      }

      const valid = await hydrateUser(stored);

      if (valid) {
        return;
      }

      try {
        const refreshed = await authService.refresh(stored.refreshToken);
        applyAuthResponse(refreshed);
        setUser(refreshed.user);
        setTokens(refreshed.tokens);
        setStatus('authenticated');
      } catch {
        resetAuth();
      }
    };

    void bootstrap();
  }, [hydrateUser, resetAuth]);

  const login = React.useCallback(async (payload: LoginValues) => {
    try {
      const response = await authService.login(payload);
      const applied = applyAuthResponse(response);
      setTokens(applied.tokens);
      setUser(applied.user);
      setStatus('authenticated');
      toast.success('Login successful. Welcome back.');
      return applied;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Sign in failed.');
    }
  }, []);

  const register = React.useCallback(async (payload: RegisterValues) => {
    try {
      return await authService.register(payload);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed.');
    }
  }, []);

  const refresh = React.useCallback(async () => {
    if (!tokens?.refreshToken) {
      resetAuth();
      return null;
    }

    try {
      const response = await authService.refresh(tokens.refreshToken);
      const applied = applyAuthResponse(response);
      setTokens(applied.tokens);
      setUser(applied.user);
      setStatus('authenticated');
      return applied.tokens;
    } catch {
      toast.error('Your session expired. Please sign in again.');
      resetAuth();
      return null;
    }
  }, [resetAuth, tokens?.refreshToken]);

  const logout = React.useCallback(async () => {
    try {
      if (tokens?.accessToken) {
        await authService.logout(tokens.accessToken, tokens.refreshToken);
      }
      toast.success('Signed out successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed.';
      toast.error(message);
      throw error;
    } finally {
      resetAuth();
    }
  }, [resetAuth, tokens?.accessToken, tokens?.refreshToken]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      tokens,
      status,
      isAuthenticated: status === 'authenticated' && !!tokens,
      login,
      register,
      logout,
      refresh,
    }),
    [user, tokens, status, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
