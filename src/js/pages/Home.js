const Home = ({
  hubspotObjectTypeId,
  path,
  title,
  showIframe,
  propertyName,
  companyAsMediator,
  pipeLineId,
  specPipeLine
}) => {
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId");
  const param = getQueryParamsFromCurrentUrl();
  const [sidebarRightOpen, setSidebarRightOpen] = useState(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState(false); // Track user interaction
  const [userData, setUserData] = useState();
  const [userId, setUserId] = useState();
  const [userObjectId, setUserObjectId] = useState();
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const portalId = getPortal()?.portalId;
  const { sync, setSync } = useSync();
  const [isLoadedFirstTime, setIsLoadedFirstTime] = useState(false);

  const fetchUserProfile = async ({ portalId, cache }) => {
    if (!portalId) return null;

    const response = await Client.user.profile({ portalId, cache });
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
    setSidebarRightOpen((prev) => !prev);
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
    <div className="bg-sidelayoutColor h-[calc(100vh-var(--nav-height))] dark:bg-dark-300 ">
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
                className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                onClick={toggleSidebar}
              >
                <DetailsIcon />
              </button>
            </div>
          ) : (
            ""
          )}

          <div
            className={` h-[calc(100vh-var(--nav-height))] hide-scrollbar overflow-y-auto  md:py-4 py-3 
                ${showSidebarListDataOption && isLargeScreen
                ? "w-[calc(100%_-350px)]"
                : "w-full"
              } ${!showSidebarListDataOption && isLargeScreen ? 'md:pr-4 pr-3 ' : ''}`}
          >
            <div className={`${companyDetailsCard == 'true' ? `flex ${moduleStylesOptions.homeTabStyles.cards.direction} items-stretch flex-col` : ' '}  md:gap-4 gap-3`}>
              <div className="flex-1 grid">
                <HomeBanner moduleBannerDetailsOption={moduleBannerDetailsOption} userData={userData} />
              </div>
              {companyDetailsCard == 'true' ? (
                <div className="flex-1 grid">
                  <HomeCompanyCard userData={userData} isLoading={isLoading} isLoadedFirstTime={isLoadedFirstTime} />
                </div>
              ) : null}
            </div>

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
            <UserDetails userPermissions={userData?.configurations} objectId={userObjectId} id={userId} isLoading={isLoading} isLoadedFirstTime={isLoadedFirstTime} />

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
                      className="rounded-full p-2 bg-sidelayoutColor dark:bg-cleanWhite text-sidelayoutTextColor dark:text-dark-200  animate-pulseEffect dark:animate-pulseEffectDark"
                      onClick={toggleSidebar}
                    >
                      <Arrow />
                    </button>
                  </div>
                )}

              {/* Sidebar content */}
              <div className="h-full md:!pt-4 hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 max-w-[350px] overflow-visible">
                <div className="flex-col flex lg:gap-6 gap-3 lg:pb-4">
                  {sidebarListDataOption.map((option, index) => {
                    const hubspotObjectTypeId = option.hubspotObjectTypeId;
                    const sidebarDataApis = {
                      tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
                      stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
                      formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
                      formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
                        }`,
                      createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
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
