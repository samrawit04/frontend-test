import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Send, X } from 'lucide-react';

type MarketplacePage =
  | 'home'
  | 'browse-offers'
  | 'how-it-works'
  | 'become-agent'
  | 'transfers'
  | 'help'
  | 'profile';

export function UnifiedPublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<MarketplacePage>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigateMarketplace = (page: MarketplacePage) => {
    setActivePage(page);

    const dispatch = () => {
      window.dispatchEvent(
        new CustomEvent('payupp:navigate', {
          detail: { page }
        })
      );
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(dispatch, 0);
    } else {
      dispatch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                type="button"
                onClick={() => navigateMarketplace('home')}
                className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Send className="text-white" size={18} />
                </div>
                <span>Payupp</span>
              </button>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => navigateMarketplace('browse-offers')}
                  className={`transition-colors ${
                    activePage === 'browse-offers'
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Browse Offers
                </button>
                <button
                  type="button"
                  onClick={() => navigateMarketplace('how-it-works')}
                  className={`transition-colors ${
                    activePage === 'how-it-works'
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  How it Works
                </button>
                <button
                  type="button"
                  onClick={() => navigateMarketplace('become-agent')}
                  className={`transition-colors ${
                    activePage === 'become-agent'
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Become An Agent
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => navigateMarketplace('transfers')}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors hidden sm:block ${
                  activePage === 'transfers'
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                Transfers
              </button>
              <button
                type="button"
                onClick={() => navigateMarketplace('help')}
                className={`text-sm font-medium hidden sm:block transition-colors relative ${
                  activePage === 'help'
                    ? 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Help
              </button>
              <button
                type="button"
                onClick={() => navigateMarketplace('profile')}
                className={`text-sm font-medium hidden sm:block transition-colors relative ${
                  activePage === 'profile'
                    ? 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Profile
              </button>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 hidden sm:block"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hidden sm:block"
              >
                Sign up
              </Link>
              <button
                type="button"
                onClick={() => setShowMobileMenu((open) => !open)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <nav className="md:hidden border-t border-gray-200 py-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  navigateMarketplace('browse-offers');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'browse-offers'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Browse Offers
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateMarketplace('how-it-works');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'how-it-works'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                How it Works
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateMarketplace('become-agent');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'become-agent'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Become An Agent
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateMarketplace('transfers');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg font-medium"
              >
                Transfers
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateMarketplace('help');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'help'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Help Center
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateMarketplace('profile');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'profile'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setShowMobileMenu(false)}
                className="block w-full text-left px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign up
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PayUpp. All rights reserved.</p>
          <div className="flex gap-3">
            <button type="button" className="hover:text-foreground">
              Privacy
            </button>
            <button type="button" className="hover:text-foreground">
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

