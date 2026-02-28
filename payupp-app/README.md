### PayUpp Unified SPA (`payupp-app`)

This app merges the existing standalone SPAs (`Main-Page`, `Agent-Page`, `Dispute-Page`, `Payupp-Admin`) into a single production-ready Vite + React + TypeScript application.

### Folder structure

- **root**
  - `.env.development`, `.env.production` – API base URL and app env
  - `tsconfig*.json` – strict TypeScript configuration (including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`)
  - `eslint.config.js` – flat ESLint config with React Hooks and React Refresh plugins
  - `.prettierrc` – Prettier formatting rules
- **src**
  - `main.tsx` – entrypoint with `QueryClientProvider`, `AuthProvider`, `ErrorBoundary`, `RouterProvider`
  - `router.tsx` – React Router v6 configuration
  - `index.css` – Tailwind CSS + PayUpp brand palette (indigo primary, coral accent)
  - `layouts/`
    - `UnifiedPublicLayout.tsx` – public marketplace header/footer wrapper
    - `AgentLayout.tsx` – agent navigation wrapper
    - `AdminLayout.tsx` – admin wrapper (uses Admin dashboard header)
  - `context/`
    - `AuthContext.tsx` – user, role, `loginWithCredentials`, `logout`
  - `guards/`
    - `ProtectedRoute.tsx` – role-based route guard
  - `lib/`
    - `queryClient.ts` – TanStack Query client with tuned stale/gc times per domain
    - `api/axios.ts` – Axios instance with auth interceptors
    - `api/auth.ts`, `api/agent.ts`, `api/dispute.ts`, `api/admin.ts` – domain API helpers
  - `pages/`
    - `NotFoundPage.tsx`, `ErrorPage.tsx` – 404 and error boundary fallbacks
  - `components/shared/ErrorBoundary.tsx` – root error boundary

### Routing strategy

All routing is handled via `src/router.tsx`:

| Path                   | Layout / Guard                             | Component                                                |
| ---------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `/`                    | `UnifiedPublicLayout`                      | `PayUppMarketplace` (from `Main-Page`)                  |
| `/login`               | `UnifiedPublicLayout`                      | `LoginRoute` wrapper around `LoginPage`                 |
| `/signup`              | `UnifiedPublicLayout`                      | `SignupPage` (from `Main-Page`)                         |
| `/become-agent`        | `UnifiedPublicLayout`                      | `BecomeAgentApplication` (from `Main-Page`)             |
| `/agent`               | `ProtectedRoute(roles=['agent'])` + layout| `AgentProfilePage`                                      |
| `/agent/profile`       | same as `/agent`                           | `AgentProfilePage` (from `Agent-Page`)                  |
| `/agent/exchange-rates`| same as `/agent`                           | `ExchangeRateTool` (from `Agent-Page`)                  |
| `/agent/business`      | same as `/agent`                           | `MyBusinessPage` (from `Agent-Page`)                    |
| `/agent/transfers`     | same as `/agent`                           | `TransferRequestsPage` (from `Agent-Page`)              |
| `/dispute/:id`         | `ProtectedRoute(roles=['user','agent'])`  | `DisputeResolutionPage` (from `Dispute-Page`)           |
| `/admin/dashboard`     | `ProtectedRoute(roles=['admin'])` + layout| `AdminDashboard` (from `Payupp-Admin`)                  |
| `*`                    | –                                          | `NotFoundPage`                                          |

Layouts use React Router nested routes (`Outlet`) so navigation is not prop-drilled.

### Caching strategy (TanStack Query v5)

Configured in `src/lib/queryClient.ts` using `setQueryDefaults`:

| Data type          | Query key prefix     | `staleTime` | `gcTime`  |
| ------------------ | -------------------- | ----------- | --------- |
| Exchange rates     | `['exchangeRates']`  | 2 min       | 5 min     |
| Agent profile      | `['agentProfile']`   | 5 min       | 10 min    |
| Transfer requests  | `['transferRequests']`| 30 sec     | 2 min     |
| Admin metrics      | `['adminMetrics']`   | 1 min       | 5 min     |
| Auth/user          | `['auth','user']`    | Infinity    | Infinity  |

Mutations inherit a global `onError` handler that surfaces toast notifications via `sonner`.

### API layer

- **`src/lib/api/axios.ts`**
  - Uses `VITE_API_BASE_URL`
  - Attaches `Authorization: Bearer <token>` from `localStorage`
  - On `401`, clears auth storage and redirects to `/login?redirect=...`
- **Domain helpers**
  - `auth.ts`: `loginWithEmail`, `signupWithEmail`, `refreshToken`, `logoutOnServer`
  - `agent.ts`: `getAgentProfile`, `updateAgentProfile`, `getExchangeRates`, `getTransferRequests`
  - `dispute.ts`: `getDispute`, `submitDispute`, `updateDisputeStatus`
  - `admin.ts`: `getAllUsers`, `getAllAgents`, `getPlatformMetrics`

### Environment setup

```bash
cd payupp-app
cp .env.development .env.local # optional override for local dev
```

`VITE_API_BASE_URL` and `VITE_APP_ENV` are read via `import.meta.env`.

### Running locally

```bash
cd payupp-app
npm install
npm run dev
```

### Quality tooling

- **TypeScript** – strict mode with additional safety flags in `tsconfig.app.json`
- **ESLint** – flat config (`eslint.config.js`) using:
  - `@eslint/js` recommended
  - `@typescript-eslint` recommended
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`
- **Prettier** – enforced via `npm run format` / `format:check`

### Verification checklist

After `npm run dev`:

1. `/` – PayUpp marketplace in `UnifiedPublicLayout`
2. `/login` – login page using PayUpp brand colors
3. `/agent` (unauthenticated) – redirected to `/login?redirect=/agent`
4. `/agent/profile` (agent) – agent profile inside `AgentLayout`
5. `/agent/exchange-rates` – exchange-rate tool view
6. `/admin` as non-admin – redirected to `/`
7. `/admin/dashboard` as admin – admin dashboard inside `AdminLayout`
8. `/dispute/123` – dispute resolution page
9. `/nonexistent` – `NotFoundPage`
10. Trigger a thrown error in any component – `ErrorBoundary` shows fallback UI
11. Open React Query Devtools – verify per-query stale times
12. Brand audit – primary buttons indigo, accents coral

