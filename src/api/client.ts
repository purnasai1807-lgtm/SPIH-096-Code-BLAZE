import type { ApiResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

let authToken: string | null = localStorage.getItem('delayguard_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('delayguard_token', token);
  } else {
    localStorage.removeItem('delayguard_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function isMockEnabled(): boolean {
  return USE_MOCK;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setAuthToken(null);
    throw new ApiError('UNAUTHORIZED', 'Your session has expired. Please log in again.');
  }

  let body: ApiResponse<T>;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('PARSE_ERROR', 'Failed to parse server response.');
  }

  if (!response.ok || !body.success) {
    const message =
      (body as unknown as { error?: { message?: string } }).error?.message ||
      'An unexpected error occurred.';
    const code =
      (body as unknown as { error?: { code?: string } }).error?.code || 'UNKNOWN_ERROR';
    throw new ApiError(code, message);
  }

  return body.data;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  upload: <T>(endpoint: string, formData: FormData) => {
    const headers: Record<string, string> = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (res) => {
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new ApiError(
          body.error?.code || 'UPLOAD_ERROR',
          body.error?.message || 'Upload failed.',
        );
      }
      return body.data as T;
    });
  },
};
