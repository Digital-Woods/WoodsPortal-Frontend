const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
);

const DynamicComponent = ({ hubspotObjectTypeId, path, title, showIframe, propertyName }) => {
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId")
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  // const [param, setParam] = useState("");

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  // const param = mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
  const param = getQueryParamsFromCurrentUrl()

  // useEffect(() => {
  //   const queryParamsFromCurrentUrl = getQueryParamsFromCurrentUrl()
  //   console.log('queryParamsFromCurrentUrl', queryParamsFromCurrentUrl)
  //   if (queryParamsFromCurrentUrl) {
  //     setParam(queryParamsFromCurrentUrl)
  //   }
  // }, [getQueryParamsFromCurrentUrl()]);


  const [sidebarRightOpen, setSidebarRightOpen] = useState(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState(false); // Track user interaction

  // Sidebar show/hide logic for medium and small devices
  const toggleSidebar = () => {
    setUserToggled(true); // Mark as user-initiated
    setSidebarRightOpen((prev) => !prev);
  };

  // Automatically adjust the sidebar based on screen size
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


  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + '&isForm=true' : '?isForm=true'}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}` // concat ticketId
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const viewText =
    (activeTab === "account"
      ? `List of ${title}`
      : `List of ${title}`
    )
      .charAt(0)
      .toUpperCase() +
    (activeTab === "account"
      ? `List of ${title}`
      : `List of ${title}`
    )
      .slice(1)
      .toLowerCase();

  const objectTypeName = getParam("objectTypeName")
  const tableTitle = () => {
    return objectTypeName ? objectTypeName : title
  }

  const back = () => {
    window.location.hash = `${getParam("parentObjectTypeName")}/${getParam("parentObjectTypeId")}/${getParam("parentObjectRowId")}`;
  }

  return (
    <div className="bg-sidelayoutColor lg:max-h-[calc(100vh-90px)] max-h-[calc(100vh-110px)] dark:bg-dark-300">
      <div className={`dark:bg-dark-200 rounded-tl-xl bg-cleanWhite dark:text-white md:pl-4 md:pt-4 
      ${isLargeScreen
          ? " "
          : `${!sidebarRightOpen ? 'md:pr-4 pr-3  pl-3  pt-3' : 'pl-3 pt-3'} rounded-tr-xl`
        }
      relative`}>
        <div class={`h-8 bg-gradient-to-t to-cleanWhite dark:to-dark-300 from-transparent rounded-tl-xl absolute top-0 left-0 right-0 z-[1]
                ${isLargeScreen
            ? " "
            : "md:pr-6 pr-3 rounded-tr-xl"
          }
          `}></div>
        <div className="flex justify-between items-center relative z-[2] gap-6">
          <div className="flex items-start flex-col gap-2">
            {objectTypeName &&
              <div className="pr-2 cursor-pointer" onClick={() => back()}>
                <BackIcon />
              </div>
            }
            {hubSpotUserDetails.sideMenu[0].tabName != title ?
              <span>
                <span className="text-xl font-semibold text-[#0091AE] capitalize dark:text-white">
                  {tableTitle()}
                </span>
                <p className="text-primary  dark:text-white leading-5 text-sm">
                  {env.DATA_SOURCE_SET !== true ? viewText : viewText + 's'}
                </p>
              </span> : ''}
          </div>

          {/* <div className="centered-tab border rounded-lg p-1 bg-cleanWhite dark:bg-dark-300 border-flatGray dark:border-gray-700 ">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="rounded-md "
          >
            <TabsList>
              <TabsTrigger className="rounded-md" value="account">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentcolor"
                  className="dark:fill-white"
                >
                  <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
                </svg>
              </TabsTrigger>
              <TabsTrigger className="rounded-md" value="password">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentcolor"
                  className="dark:fill-white"
                >
                  <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
                </svg>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account"></TabsContent>
            <TabsContent value="password"></TabsContent>
          </Tabs>
        </div> */}

          {/* <div>
          <Button className="text-white">
            New Site <span className="ml-2"> + </span>{" "}
          </Button>
        </div> */}
        </div>

        {activeTab === "account" ? (
          <div className="flex gap-4 w-full overflow-hidden relative">
            {/* Main content container */}
            {hubSpotUserDetails.sideMenu[0].tabName === title &&
              !isLargeScreen &&
              !sidebarRightOpen ? (
              <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
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
              className={` ${hubSpotUserDetails.sideMenu[0].tabName === title ? `h-[calc(100vh-110px)] lg:h-[calc(100vh-90px)]` : `h-[calc(100vh-140px)] lg:h-[calc(100vh-125px)]`  } hide-scrollbar overflow-y-auto 
                ${showSidebarListDataOption &&
                hubSpotUserDetails.sideMenu[0].tabName === title
                ? isLargeScreen
                  ? "w-[calc(100%_-350px)]"
                  : "w-full max-sm:w-screen"
                : "w-full lg:pr-6 pr-0"
                }`}
            >
              {hubSpotUserDetails.sideMenu[0].tabName === title && (
                <div>
                  <HomeBanner moduleBannerDetailsOption={moduleBannerDetailsOption} />
                </div>
              )}

              <DashboardTable
                hubspotObjectTypeId={hubspotObjectTypeId}
                path={path}
                title={tableTitle() || hubSpotUserDetails.sideMenu[0].label}
                propertyName={propertyName}
                showIframe={showIframe}
                apis={apis}
                componentName="object"
              />
            </div>

            {/* Sidebar container */}
            {/* Sidebar container */}
            {showSidebarListDataOption &&
              hubSpotUserDetails.sideMenu[0].tabName === title && (
                <div
                  className={`transition-transform duration-200 ease-in-out ${isLargeScreen
                    ? "relative translate-x-0"
                    : `absolute inset-y-0 right-0 z-[55] bg-cleanWhite dark:bg-dark-200 
              ${sidebarRightOpen ? "translate-x-0" : "translate-x-full"}`
                    }`}
                >
                  {/* Close button for medium and small screens */}
                  {!isLargeScreen && sidebarRightOpen && showSidebarListDataOption && (
                    <div className="absolute z-[56] right-[14px] top-[8px]">
                      <button
                        className="rounded-full p-2 bg-sidelayoutColor dark:bg-cleanWhite text-sidelayoutTextColor dark:text-dark-200  animate-pulseEffect dark:animate-pulseEffectDark"
                        onClick={toggleSidebar}
                      >
                        <Arrow />
                      </button>
                    </div>
                  )}

                  {/* Sidebar content */}
                  <div
                    className={`${isSmallScreen ? "max-sm:w-screen w-full px-2 pb-2" : "w-[350px] pr-3"
                      } lg:max-h-[calc(100vh-90px)] max-h-[calc(100vh-110px)] hide-scrollbar overflow-y-auto`}
                  >
                    <div className="flex-col flex lg:gap-6 gap-3 h-full">
                      {sidebarListDataOption.map((option, index) => {
                        const hubspotObjectTypeId = option.hubspotObjectTypeId;
                        const sidebarDataApis = {
                          tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
                          stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`,
                          formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
                          formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
                            }`,
                          createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
                          updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`,
                        };

                        return index === 0 ? (
                          <SidebarData
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

        ) : (
          <div className="dark:text-white text-cleanWhite">
            Under Construction
          </div>
        )}
      </div>
    </div>
  );
};
