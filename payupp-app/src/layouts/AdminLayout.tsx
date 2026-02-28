import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function AdminLayout() {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      if (typeof window !== 'undefined') {
        window.location.href = 'http://localhost:5173/';
      }
    };

    window.addEventListener('payupp-admin-logout', handleLogout);
    return () => window.removeEventListener('payupp-admin-logout', handleLogout);
  }, [logout]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex-1 overflow-auto bg-muted/30 px-3 py-4 md:px-6 md:py-6">
        <Outlet />
      </main>
    </div>
  );
}

