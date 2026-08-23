import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/auth';
import { setAuthToken, getAuthToken, ApiError } from '@/api/client';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginDemo: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USER: User = {
  id: 'u-demo',
  name: 'Demo Administrator',
  email: 'demo@delayguard.ai',
  role: 'Administrator',
  organization: 'City Government',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('delayguard_user');
    const token = getAuthToken();
    if (stored && token) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiLogin({ email, password });
      setAuthToken(res.token);
      setUser(res.user);
      localStorage.setItem('delayguard_user', JSON.stringify(res.user));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : (err as { message?: string })?.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiRegister({ name, email, password });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : (err as { message?: string })?.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout().catch(() => {});
    setAuthToken(null);
    localStorage.removeItem('delayguard_user');
    setUser(null);
  }, []);

  const loginDemo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiLogin({ email: 'demo@delayguard.ai', password: 'demo123' });
      setAuthToken(res.token);
      setUser(res.user);
      localStorage.setItem('delayguard_user', JSON.stringify(res.user));
    } catch {
      setAuthToken('demo-token');
      setUser(DEMO_USER);
      localStorage.setItem('delayguard_user', JSON.stringify(DEMO_USER));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!getAuthToken(),
        isLoading,
        error,
        login,
        register,
        logout,
        loginDemo,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
