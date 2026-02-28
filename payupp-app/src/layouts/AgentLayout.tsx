import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '../../../Agent-Page/src/components/generated/NavigationMenu';
import { useAuth } from '@/context/AuthContext';

export function AgentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const pathname = location.pathname;
  let currentView: string = 'profile';

  if (pathname.startsWith('/agent/business')) {
    currentView = 'myBusiness';
  } else if (pathname.startsWith('/agent/transfers')) {
    currentView = 'transferRequests';
  } else if (pathname.startsWith('/agent/help')) {
    currentView = 'help';
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavigationMenu
        currentView={currentView}
        onNavigate={async (section) => {
          if (section === 'profile') {
            navigate('/agent/profile');
          } else if (section === 'myBusiness') {
            navigate('/agent/business');
          } else if (section === 'transferRequests') {
            navigate('/agent/transfers');
          } else if (section === 'help') {
            navigate('/agent/help');
          } else if (section === 'logout') {
            await logout();
            if (typeof window !== 'undefined') {
              window.location.href = 'http://localhost:5173/';
            }
          }
        }}
      />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

