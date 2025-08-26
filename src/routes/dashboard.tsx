import { Arrow } from '@/assets/icons/arrow';
import { DetailsIcon } from '@/assets/icons/detailsIcon';
import { HomeBanner } from '@/components/ui/HomeBanner';
import { HomeCompanyCard } from '@/components/ui/HomeCompanyCard';
import { UserDetails } from '@/components/ui/profile/UserDetails';
import { SidebarTable } from '@/components/ui/SidebarTable';
import { Client } from '@/data/client';
import { getPortal } from '@/data/client/auth-utils';
import { showSidebarListDataOption, enableDashboardCards, dashboardCards, moduleStylesOptions, sidebarListDataOption, hubId } from '@/data/hubSpotData';
import { useAuth } from '@/state/use-auth';
import { useSync } from '@/state/use-sync';
import { formatPath } from '@/utils/DataMigration';
import { getParam, getQueryParamsFromCurrentUrl, getRouteMenu } from '@/utils/param';
import { useResponsive } from '@/utils/UseResponsive';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter()
  const { pathname } = router?.state?.location
  let { homeCardsView }: any = getRouteMenu(pathname)
  

  const param = getQueryParamsFromCurrentUrl();
  const [sidebarRightOpen, setSidebarRightOpen] = useState<any>(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState<any>(false); // Track user interaction
  const [userData, setUserData] = useState<any>();
  const [userId, setUserId] = useState<any>();
  const [userCompanyId, setUserCompanyId] = useState<any>();
  const [userObjectId, setUserObjectId] = useState<any>();
  const [cacheEnabled, setCacheEnabled] = useState<any>(true);
  const portalId = getPortal()?.portalId;
  const { sync, setSync } = useSync();
  const [isLoadedFirstTime, setIsLoadedFirstTime] = useState<any>(false);

  const { setPagination }: any = useAuth();
  
  useEffect(() => {
    setPagination([])
  }, []);

  const fetchUserProfile = async ({ portalId, cache }: any) => {
    if (!portalId) return null;

    const response: any = await Client.user.profile({ portalId, cache });
    return response?.data;
  };

  const { data: userNewData, error, isLoading, refetch } = useQuery({
    queryKey: ['userProfilePage', portalId, cacheEnabled],
    queryFn: () => fetchUserProfile({ portalId, cache: sync ? false : true }),
    onSuccess: (data) => {
      if (data) {
        setUserData(data);
        setUserId(data?.response?.hs_object_id?.value);
        setUserObjectId(data?.info?.objectTypeId);
        setUserCompanyId(data?.response?.associations?.COMPANY?.hs_object_id?.value)
      }
      setSync(false);
      setIsLoadedFirstTime(true);
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
      setSync(false);
      setIsLoadedFirstTime(true);
    }
  });

  useEffect(() => {
    if (sync) {
      refetch();
    }
  }, [sync]);

  const toggleSidebar = () => {
    setUserToggled(true);
    setSidebarRightOpen((prev: any) => !prev);
  };

  useEffect(() => {
    if (!userToggled) {
      if (isLargeScreen) {
        setSidebarRightOpen(true); // Always open on large screens
      } else if (isMediumScreen || isSmallScreen) {
        setSidebarRightOpen(false); // Closed by default on smaller screens
      }
    }
  }, [isLargeScreen, isMediumScreen, isSmallScreen, userToggled]);

  // Reset user preference when screen size changes significantly
  useEffect(() => {
    const resetOnResize = () => {
      setUserToggled(false);
    };

    window.addEventListener("resize", resetOnResize);
    return () => window.removeEventListener("resize", resetOnResize);
  }, []);
  
  // console.log(enableDashboardCards,'enableDashboardCards hello')
  // const apis = {
  //   tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
  //   stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
  //   formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
  //   formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
  //     }`,
  //   createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
  //   updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`, // concat ticketId
  // };

  // const objectTypeName = getParam("objectTypeName");
  // const tableTitle = () => {
  //   return objectTypeName ? objectTypeName : title;
  // };

  return (
    <div className="bg-[var(--sidebar-background-color)] h-[calc(100vh-var(--nav-height))] dark:bg-dark-300 ">
      <div
        className={`dark:bg-dark-200 mt-[calc(var(--nav-height)-1px)] h-[calc(100vh-var(--nav-height))] bg-cleanWhite dark:text-white md:pl-4 
      ${isLargeScreen
            ? " "
            : `${!sidebarRightOpen ? "md:pr-4 pr-3  pl-3 " : "pl-3"
            }`
          }`}
      >
        <div className="flex gap-4 w-full overflow-hidden relative">
          {/* Main content container */}
          {showSidebarListDataOption && !isLargeScreen && !sidebarRightOpen ? (
            <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] lg:top-[10px] md:top-[60px] top-[10px]">
              <button
                className="rounded-full p-2 dark:bg-cleanWhite bg-[var(--sidebar-background-color)] text-[var(--sidebar-text-color)] dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                onClick={toggleSidebar}
              >
                <DetailsIcon />
              </button>
            </div>
          ) : (
            ""
          )}

          <div className={` h-[calc(100vh-var(--nav-height))] hide-scrollbar overflow-y-auto ${enableDashboardCards ? ' md:py-4 py-3':' md:pb-4 pb-3'}
                ${showSidebarListDataOption && isLargeScreen
              ? "w-[calc(100%_-350px)]"
              : "w-full"
            } ${!showSidebarListDataOption && isLargeScreen ? 'md:pr-4 pr-3 ' : ''}`}>
            {enableDashboardCards && 
            <div className={`grid grid-cols-12 md:gap-4 gap-3`}>
              {dashboardCards.map((card: any, index: any) => {
                const isLast = index === dashboardCards.length - 1;
                const isOdd = dashboardCards.length % 2 !== 0;
                const isOnly = dashboardCards.length === 1;

                const colSpan = (isOnly || (isLast && isOdd)) ? 'col-span-12' : 'md:col-span-6 col-span-12';

                return (
                  <div
                    key={index}
                    className={`${ homeCardsView != 'list' ? colSpan : 'col-span-12'} grid border dark:border-none dark:border-gray-600 rounded-lg overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]
                      ${moduleStylesOptions.homeTabStyles.overlayer.color != '' ? `bg-[var(--home-tab-overlayer-color)]`:'bg-[var(--banner-overlayer-color)]'} dark:bg-dark-300 relative`}
                  >
                    <div
                      className={`absolute bottom-0 right-0 z-1 ${moduleStylesOptions.homeTabStyles.svgColor.color  != '' ? `text-[var(--home-tab-svg-color)]`:'text-[var(--primary-color)]'} dark:text-gray-500`}
                    >
                      <svg width="151" height="125" viewBox="0 0 151 125" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_7211_3894)">
                          <circle cx="116" cy="116" r="116" fill="currentColor" opacity="0.1" />
                          <circle cx="116" cy="116" r="77" fill="currentColor" opacity="0.3" />
                          <circle cx="116" cy="116" r="35" fill="currentColor" opacity="0.5" />
                        </g>
                        <defs>
                          <clipPath id="clip0_7211_3894">
                            <rect width="151" height="125" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    <div className="">
                        <HomeBanner moduleBannerDetailsOption={card} userData={userData} />
                        {card?.properties && card?.properties.length > 0 && (
                        <HomeCompanyCard
                          companyDetailsModalOption={card?.add_details_modal}
                          propertiesList={card?.properties}
                          userData={userData?.response}
                          isLoading={isLoading}
                          isLoadedFirstTime={isLoadedFirstTime}
                          iframePropertyName={card?.properties}
                          viewStyle={card?.view}
                        />
                        )}
                    </div>
                  </div>
                );
              })}
            </div>}
            {/* <DashboardTable
              hubspotObjectTypeId={hubspotObjectTypeId}
              path={path}
              title={tableTitle() || hubSpotUserDetails.sideMenu[0].label}
              propertyName={propertyName}
              showIframe={showIframe}
              apis={apis}
              componentName="object"
              companyAsMediator={companyAsMediator}
              pipeLineId={pipeLineId}
              specPipeLine={specPipeLine}
            /> */}
            <UserDetails userCompanyId={userCompanyId} userPermissions={userData?.configurations} objectId={userObjectId} id={userId} isLoading={isLoading} isLoadedFirstTime={isLoadedFirstTime} />

          </div>

          {/* Sidebar container */}
          {showSidebarListDataOption && (
            <div
              className={` bg-cleanWhite transition-transform duration-200 ease-in-out lg:h-[calc(100vh-var(--nav-height))] h-[100vh] hide-scrollbar overflow-visible max-lg:z-[52] lg:mt-[1px]
                ${isLargeScreen
                  ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 "
                  : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform translate-x-full"
                } 
                ${!isLargeScreen && sidebarRightOpen ? "translate-x-0 mb-4" : ""
                }`}
            >
              {/* Close button for medium and small screens */}
              {!isLargeScreen &&
                sidebarRightOpen &&
                showSidebarListDataOption && (
                  <div className="absolute z-[59] right-[9px] top-[60px]">
                    <button
                      className="rounded-full p-2 bg-[var(--sidebar-background-color)] dark:bg-cleanWhite text-[var(--sidebar-text-color)] dark:text-dark-200  animate-pulseEffect dark:animate-pulseEffectDark"
                      onClick={toggleSidebar}
                    >
                      <Arrow />
                    </button>
                  </div>
                )}

              {/* Sidebar content */}
              <div className="h-full md:!pt-4 hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 max-w-[350px] overflow-visible">
                <div className="flex-col flex lg:gap-6 gap-3 lg:pb-4">
                  {sidebarListDataOption.map((option: any, index: any) => {
                    const hubspotObjectTypeId = option.hubspotObjectTypeId;
                    const sidebarDataApis = {
                      tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
                      stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
                      formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
                      formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
                        }`,
                      createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
                      createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${param}`,
                      removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${param}`,
                      updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`, // concat ticketId
                    };

                    return index === 0 ? (
                      <SidebarTable
                        key={index}
                        hubspotObjectTypeId={hubspotObjectTypeId}
                        path={`/${formatPath(option.label)}`}
                        title={option.label}
                        apis={sidebarDataApis}
                        companyAsMediator={option.companyAsMediator}
                        pipeLineId={option.pipeLineId}
                        specPipeLine={option.specPipeLine}
                      />
                    ) : (
                      <SidebarTable
                        key={index}
                        hubspotObjectTypeId={hubspotObjectTypeId}
                        path={`/${formatPath(option.label)}`}
                        title={option.label}
                        apis={sidebarDataApis}
                        companyAsMediator={option.companyAsMediator}
                        pipeLineId={option.pipeLineId}
                        specPipeLine={option.specPipeLine}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard

// export const Route = createFileRoute('/dashboard')({
//   component: Dashboard,
//   beforeLoad: () => {
//     return {
//       layout: "MainLayout",
//       requiresAuth: true,
//     }
//   },
// })
