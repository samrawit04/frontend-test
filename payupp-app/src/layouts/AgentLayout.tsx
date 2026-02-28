import { Outlet } from 'react-router-dom';
import NavigationMenu from '../../../Agent-Page/src/components/generated/NavigationMenu';

export function AgentLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavigationMenu />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

