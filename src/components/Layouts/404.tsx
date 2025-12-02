import React from 'react';
import { Button } from '../ui/Button';
import { formatPath, isArray } from '@/utils/DataMigration';
import { useRouter } from '@tanstack/react-router';
import { addHomeTabOption, hubSpotUserDetails, makeLink } from '@/data/hubSpotData';
import { CautionCircle } from '@/assets/icons/CautionCircle';

const NotFound = ({ message = "", type = "404" }: any) => {
  const router: any = useRouter()

  const goToDashboard = () => {
    let path = isArray(hubSpotUserDetails?.sideMenu) && hubSpotUserDetails?.sideMenu.length > 0 ? makeLink(hubSpotUserDetails?.sideMenu[0]) : "/"
    if (router.state.location?.search?.r) {
      path = router.state.location?.search?.r
    }
    router.navigate({ to: `/${path}` });
  }

  const dashboardLabel = () => {
    if(isArray(hubSpotUserDetails?.sideMenu) && hubSpotUserDetails?.sideMenu.length > 0) {
      return hubSpotUserDetails?.sideMenu[0]?.label && !addHomeTabOption ? hubSpotUserDetails?.sideMenu[0]?.label : hubSpotUserDetails?.sideMenu[0]?.tabName
    }
    return ""
  }

  return (
    <>
      {type === "404" ?
        <div className="flex flex-col items-center justify-center h-[calc(100vh-50px)] text-center space-y-4">
          <h1 className="text-7xl font-semibold dark:text-white mb-2">404</h1>
          <div>
            <p className="text-lg dark:text-white">Page Not Found</p>
          </div>
          <Button size="sm" onClick={() => goToDashboard()}>
            Go to {dashboardLabel()}
          </Button>
        </div>
        :
        <div className="flex flex-col items-center justify-center h-[calc(100vh-50px)] text-center space-y-4">
          <span className="text-yellow-600">
            <CautionCircle />
          </span>
          <p className="text-lg dark:text-white">{message}</p>
        </div>
      }
    </>
  );
};

export default NotFound;
