import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      gcTime: 5 * 60_000
    },
    mutations: {
      retry: 0,
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        toast.error(message);
      }
    }
  }
});

// Tune cache per domain
queryClient.setQueryDefaults(['exchangeRates'], {
  staleTime: 2 * 60_000,
  gcTime: 5 * 60_000
});

queryClient.setQueryDefaults(['agentProfile'], {
  staleTime: 5 * 60_000,
  gcTime: 10 * 60_000
});

queryClient.setQueryDefaults(['transferRequests'], {
  staleTime: 30_000,
  gcTime: 2 * 60_000
});

queryClient.setQueryDefaults(['adminMetrics'], {
  staleTime: 60_000,
  gcTime: 5 * 60_000
});

queryClient.setQueryDefaults(['auth', 'user'], {
  staleTime: Infinity,
  gcTime: Infinity
});

export { queryClient };

