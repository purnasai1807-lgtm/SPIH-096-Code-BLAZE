import type { LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { apiClient, isMockEnabled } from './client';
import { mockLogin, mockRegister } from './mockData';

const MOCK_DELAY = 800;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    if (!credentials.email.includes('@')) {
      throw { code: 'VALIDATION_ERROR', message: 'Please enter a valid email address.' };
    }
    if (credentials.password.length < 6) {
      throw { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters.' };
    }
    return mockLogin(credentials.email);
  }
  return apiClient.post<AuthResponse>('/api/auth/login', credentials);
}

export async function register(data: RegisterData): Promise<{ success: boolean }> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return mockRegister(data.name, data.email);
  }
  return apiClient.post<{ success: boolean }>('/api/auth/register', data);
}

export async function logout(): Promise<void> {
  if (isMockEnabled()) {
    await delay(200);
    return;
  }
  await apiClient.post('/api/auth/logout');
}
