import axios, { AxiosError, AxiosRequestHeaders, Method } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestConfig extends RequestInit {
  token?: string;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const extractErrorMessage = (payload: unknown): string | null => {
  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    const messages = payload
      .map((item) => extractErrorMessage(item))
      .filter((message): message is string => Boolean(message));

    return messages.length > 0 ? messages.join(', ') : null;
  }

  if (typeof payload === 'object' && payload !== null) {
    if ('message' in payload) {
      return extractErrorMessage((payload as { message?: unknown }).message);
    }

    if ('error' in payload) {
      return extractErrorMessage((payload as { error?: unknown }).error);
    }
  }

  return null;
};

export async function apiRequest<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const headers = new Headers(config.headers);

  if (!headers.has('Content-Type') && !(config.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (config.token) {
    headers.set('Authorization', `Bearer ${config.token}`);
  }

  try {
    const response = await apiClient.request<T>({
      url: path,
      method: (config.method ?? 'GET') as Method,
      data: config.body,
      headers: Object.fromEntries(headers.entries()) as AxiosRequestHeaders,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const payload = error.response?.data;
      const status = error.response?.status ?? 500;
      const message = extractErrorMessage(payload) ?? `Request failed with status ${status}`;

      throw new ApiError(message, status, payload);
    }

    throw error;
  }
}

export const apiBaseUrl = API_BASE_URL;
