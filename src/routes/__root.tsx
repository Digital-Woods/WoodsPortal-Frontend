import { createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner';
import AppLayoutWrapper from '@/components/Layouts/AppLayoutWrapper';
import ThemeManager from '@/components/ThemeManager';


// ✅ configure queryClient here
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 👈 disable refetch on tab focus
      refetchOnReconnect: false,   // (optional) disable refetch on network reconnect
      retry: false,                // (optional) stop auto-retry if failing
    },
  },
})

// interface MyRouterContext {
//   queryClient: queryClient
// }
// export const Route = createRootRouteWithContext<MyRouterContext>()({

export const Route = createRootRouteWithContext()({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeManager />
        <AppLayoutWrapper />
        <Toaster
          position="top-center"
        />
        <TanStackRouterDevtools />

        <TanStackQueryLayout />
      </QueryClientProvider>
    </>
  ),
})
