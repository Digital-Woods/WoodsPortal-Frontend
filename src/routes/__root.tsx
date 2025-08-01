import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'

import { Toaster } from 'sonner';
import { RecoilRoot } from 'recoil';

import AppLayoutWrapper from '@/components/Layouts/AppLayoutWrapper';

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <RecoilRoot>
        <AppLayoutWrapper />
      </RecoilRoot>

      <Toaster
        position="top-center"
      />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  ),
})
