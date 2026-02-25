import { useMemo, useState, useEffect } from 'react';
import { Container, Theme } from './settings/types';
import AgentProfilePage from './components/generated/AgentProfilePage';
import { ExchangeRateTool } from './components/generated/ExchangeRateTool';
import NavigationMenu from './components/generated/NavigationMenu';
import MyBusinessPage from './components/generated/MyBusinessPage';
import TransferRequestsPage from './components/generated/TransferRequestsPage';

let theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
let container: Container = 'none';

function App() {
  const [currentView, setCurrentView] = useState<'profile' | 'exchangeRate' | 'myBusiness' | 'transferRequests'>('profile');

  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  // Listen for navigation event from AgentProfilePage
  useEffect(() => {
    const handleNavigateExchangeRate = () => {
      setCurrentView('exchangeRate');
    };

    window.addEventListener('navigate-exchange-rate', handleNavigateExchangeRate);

    return () => {
      window.removeEventListener('navigate-exchange-rate', handleNavigateExchangeRate);
    };
  }, []);

  const generatedComponent = useMemo(() => {
    // Mock agent data for the agent profile
    const mockAgentData = {
      name: 'Jane Smith',
      email: 'jane.smith@agent.com',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      joinedDate: 'November 2023',
      avatar: undefined,
      agentId: 'AGT-2024-001'
    };

    return (
      <>
        <NavigationMenu 
          onNavigate={(section) => {
            if (section === 'profile') {
              setCurrentView('profile');
            } else if (section === 'exchangeRate') {
              setCurrentView('exchangeRate');
            } else if (section === 'myBusiness') {
              setCurrentView('myBusiness');
            } else if (section === 'transferRequests') {
              setCurrentView('transferRequests');
            }
          }}
          currentView={currentView}
        />
        {currentView === 'exchangeRate' ? (
          <ExchangeRateTool onBack={() => setCurrentView('profile')} />
        ) : currentView === 'myBusiness' ? (
          <MyBusinessPage onBack={() => setCurrentView('profile')} />
        ) : currentView === 'transferRequests' ? (
          <TransferRequestsPage 
            agentName={mockAgentData.name}
            onBack={() => setCurrentView('profile')}
            onLogout={() => console.log('Logout clicked')}
          />
        ) : (
          <AgentProfilePage 
            agentData={mockAgentData}
            onBack={() => console.log('Back clicked')}
          />
        )}
      </>
    );
  }, [currentView]);

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
      </div>
    );
  } else {
    return generatedComponent;
  }
}

export default App;