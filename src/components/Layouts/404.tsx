import React from 'react';
import { Button } from '../ui/Button';
import { formatPath } from '@/utils/DataMigration';
import { useRouter } from '@tanstack/react-router';
import { addHomeTabOption, hubSpotUserDetails } from '@/data/hubSpotData';

const NotFound: React.FC<{ children?: React.ReactNode }> = () => {
  const router: any = useRouter()

  const goToDashboard = () => {
    let path = formatPath(hubSpotUserDetails?.sideMenu[0]?.label && !addHomeTabOption ? hubSpotUserDetails?.sideMenu[0]?.label : hubSpotUserDetails?.sideMenu[0]?.tabName)
    if (router.state.location?.search?.r) {
      path = router.state.location?.search?.r
    }
    router.navigate({ to: `/${path}` });
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-50px)] text-center space-y-4">
      <h1 className="text-7xl font-semibold dark:text-white mb-2">404</h1>
      <div>
        <p className="text-lg dark:text-white">Page Not Found</p>
      </div>

      <Button size="sm" onClick={() => goToDashboard()}>
        Go to Dashboard
      </Button>

    </div>
  );
};

export default NotFound;
