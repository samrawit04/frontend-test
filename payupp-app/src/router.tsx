import { createBrowserRouter } from 'react-router-dom';
import { UnifiedPublicLayout } from '@/layouts/UnifiedPublicLayout';
import { AgentLayout } from '@/layouts/AgentLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/guards/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { LoginRoute } from '@/pages/LoginRoute';
import { PayUppMarketplace } from '../../Main-Page/src/components/generated/PayUppMarketplace';
import { SignupPage } from '../../Main-Page/src/components/generated/SignupPage';
import BecomeAgentApplication from '../../Main-Page/src/components/generated/BecomeAgentApplication';
import AgentProfilePage from '../../Agent-Page/src/components/generated/AgentProfilePage';
import { ExchangeRateTool } from '../../Agent-Page/src/components/generated/ExchangeRateTool';
import MyBusinessPage from '../../Agent-Page/src/components/generated/MyBusinessPage';
import TransferRequestsPage from '../../Agent-Page/src/components/generated/TransferRequestsPage';
import DisputeResolutionPage from '../../Dispute-Page/src/components/generated/DisputeResolutionPage';
import AdminDashboard from '../../Payupp-Admin/src/components/generated/AdminDashboard';

export const router = createBrowserRouter([
  {
    element: <UnifiedPublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <PayUppMarketplace />
      },
      {
        path: '/login',
        element: <LoginRoute />
      },
      {
        path: '/signup',
        element: <SignupPage />
      },
      {
        path: '/become-agent',
        element: <BecomeAgentApplication />
      },
    ]
  },
  {
    path: '/agent',
    element: (
      <ProtectedRoute allowedRoles={['agent']}>
        <AgentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AgentProfilePage />
      },
      {
        path: 'profile',
        element: <AgentProfilePage />
      },
      {
        path: 'exchange-rates',
        element: <ExchangeRateTool />
      },
      {
        path: 'business',
        element: <MyBusinessPage />
      },
      {
        path: 'transfers',
        element: <TransferRequestsPage />
      },
      {
        path: 'help',
        element: <DisputeResolutionPage />
      }
    ]
  },
  {
    path: '/dispute/:id',
    element: (
      <ProtectedRoute allowedRoles={['user', 'agent']}>
        <DisputeResolutionPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

