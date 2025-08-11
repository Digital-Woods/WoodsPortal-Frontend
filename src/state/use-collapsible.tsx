import { useAtom } from 'jotai';
import { isCollapsibleState, isOpenState } from '@/state/store';

export const useCollapsible = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useAtom(isCollapsibleState);
  const [sidebarOpen, setSidebarOpen] = useAtom(isOpenState);

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
  };
}
