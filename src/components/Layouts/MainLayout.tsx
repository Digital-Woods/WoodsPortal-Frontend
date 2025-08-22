import React from 'react';
import { Drawer } from '@/components/Layouts/SiteLayout/Drawer';
import { useCollapsible } from '@/state/use-collapsible';
import { HeaderLayout } from '@/components/Layouts/SiteLayout/HeaderLayout';
import { useRoute } from '@/state/use-route';
import { apiRoutes } from '@/data/hubSpotData';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useCollapsible();
  const { routes, setRoutes } = useRoute();
  setRoutes(apiRoutes)

  return (
    <div className="dark:bg-dark-200 bg-cleanWhite lg:flex-col flex lg:h-[100vh] h-[100vh]">
      <Drawer
        className={`relative lg:fixed min-h-screen w-full inset-0 ${sidebarCollapsed ? "lg:w-[75px]" : "lg:w-[250px]"
          }`}
      />

      <div
        className={`dark:bg-dark-200  lg:h-[100vh] h-[100vh] bg-cleanWhite ml-auto w-full ${sidebarCollapsed ? "lg:w-[calc(100%_-_75px)]" : "lg:w-[calc(100%_-_250px)]"
          }`}
      >
        <HeaderLayout />
        <div className="bg-[var(--sidebar-background-color)] mt-[calc(var(--nav-height)-1px)] dark:bg-dark-300">
          <div className={`bg-cleanWhite dark:bg-dark-200`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
