import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { AuthUser, AuthResponse, Role } from '@/lib/api/auth';
import { loginWithEmail, logoutOnServer } from '@/lib/api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  role: Role;
  isLoading: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<AuthResponse | null>;
  setUserFromExternal: (payload: AuthResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY_USER = 'payupp_user';
const STORAGE_KEY_TOKEN = 'payupp_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUser = window.localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const persistAuth = useCallback((payload: AuthResponse) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(payload.user));
    window.localStorage.setItem(STORAGE_KEY_TOKEN, payload.token);
    setUser(payload.user);
  }, []);

  const loginWithCredentials = useCallback(
    async (email: string, password: string) => {
      const res = await loginWithEmail(email, password);
      persistAuth(res);
      return res;
    },
    [persistAuth]
  );

  const setUserFromExternal = useCallback(
    (payload: AuthResponse) => {
      persistAuth(payload);
    },
    [persistAuth]
  );

  const logout = useCallback(async () => {
    try {
      await logoutOnServer();
    } catch {
      // ignore network errors on logout
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY_USER);
      window.localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
    setUser(null);
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      role: user?.role ?? 'public',
      isLoading,
      loginWithCredentials,
      setUserFromExternal,
      logout
    }),
    [user, isLoading, loginWithCredentials, setUserFromExternal, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

