import { useAtom } from 'jotai';
import { routeState } from '@/state/store';

export function useRoute() {
  const [routes, setRoutes] = useAtom(routeState);

  return {
    routes,
    setRoutes
  };
}
