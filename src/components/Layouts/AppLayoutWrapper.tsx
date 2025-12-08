import { Outlet, useMatches } from '@tanstack/react-router';
import { layoutMap } from './index';
import PrivateRoute from '@/utils/private-route';
import PublicRoute from '@/utils/public-route';
import { Toaster } from '../ui/Toaster';
import ErrorBoundary from '@/utils/ErrorBoundary';

export default function AppLayoutWrapper() {
  const matches = useMatches();

  // Find the deepest matched route with `context.layout`
  const component: any =
    [...matches].reverse().find((m: any) => m.context?.layout);

  const requiresAuth = component?.context?.requiresAuth || false;
  const RoteComponent = requiresAuth ? PrivateRoute : PublicRoute;
  const LayoutComponent = layoutMap[component?.context?.layout] || layoutMap.DefaultLayout;

  return (
    <ErrorBoundary>
      <RoteComponent>
        <LayoutComponent>
          <Outlet />
        </LayoutComponent>
        <Toaster />
      </RoteComponent >
    </ErrorBoundary>

  );
}
