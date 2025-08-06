import { useAtom } from 'jotai';
import { breadcrumbState } from '@/state/store';


export function useBreadcrumb() {
  const [breadcrumbs, setBreadcrumbs] = useAtom(breadcrumbState);

  return {
    breadcrumbs,
    setBreadcrumbs,
  };
}