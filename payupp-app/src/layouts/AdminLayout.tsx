import { Link, Outlet, useLocation } from 'react-router-dom';

export function AdminLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border bg-sidebar text-sidebar-foreground hidden md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="text-lg font-bold">P</span>
          </div>
          <span className="ml-2 text-sm font-semibold tracking-tight">PayUpp Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm">
          <Link
            to="/admin/dashboard"
            className={`block rounded-lg px-3 py-2 font-medium ${
              isDashboard ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'
            }`}
          >
            Dashboard
          </Link>
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white/80 px-4">
          <span className="text-sm font-medium">Admin Console</span>
        </header>
        <main className="flex-1 overflow-auto bg-muted/30 px-3 py-4 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

