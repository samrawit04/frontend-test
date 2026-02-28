import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginPage } from '../../../Main-Page/src/components/generated/LoginPage';
import { useAuth } from '@/context/AuthContext';
import type { AuthResponse, Role } from '@/lib/api/auth';

const MOCK_USERS: Record<string, Role> = {
  'agent@payupp.com': 'agent',
  'admin@payupp.com': 'admin'
};

export function LoginRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUserFromExternal } = useAuth();

  const handleLoginSuccess = useCallback(
    (_method: string, email?: string) => {
      if (!email) return;

      const normalized = email.toLowerCase();
      const role: Role = MOCK_USERS[normalized] ?? 'user';

      const payload: AuthResponse = {
        user: {
          id: `mock-${role}`,
          name: role === 'admin' ? 'Admin User' : role === 'agent' ? 'Agent User' : 'PayUpp User',
          email,
          role
        },
        token: `mock-token-${role}`
      };

      setUserFromExternal(payload);

      let destination = '/';
      if (role === 'admin') {
        destination = '/admin/dashboard';
      } else if (role === 'agent') {
        destination = '/agent';
      }

      const redirect = searchParams.get('redirect');
      navigate(redirect || destination, { replace: true });
    },
    [navigate, searchParams, setUserFromExternal]
  );

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}

