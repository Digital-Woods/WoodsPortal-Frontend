const ApiDetails = ({ path, objectId, id, propertyName, showIframe, getPreData = null, preData = null, states ={isLoading : false} }) => {
  const [item, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [info, setInfo] = useState(null);
  const [associations, setAssociations] = useState({});
  const { me } = useMe();
  const [configurations, setConfigurations] = useState({
    fileManager: false,
    note: false,
    ticket: false,
  });
  const param = getParam("t");
  const companyAsMediator = getParam("isPrimaryCompany") || false;
  // const [activeTab, setActiveTab] = useState(param || "overview");
  const [activeTab, setActiveTab] = useState("overview");
  const [permissions, setPermissions] = useState(null);
  const urlParam = getQueryParamsFromCurrentUrl();
  const [galleryDialog, setGalleryDialog] = useState(false);
  const { sync, setSync } = useSync();
  const [sidebarDetailsOpen, setSidebarDetailsOpen] = useState(false);
  const { isLargeScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState(false); // Track user interaction
  const [isLoadedFirstTime, setIsLoadedFirstTime] = useState(false); 
  const {
    totalRecord
  } = useTable();

  const {isLoading: isLoadingList} = states

  // Automatically adjust the sidebar based on screen size
  useEffect(() => {
    if (!userToggled) {
      setSidebarDetailsOpen(isLargeScreen);
    }
  }, [isLargeScreen, userToggled]);

  // Function to toggle sidebar manually
  const toggleSidebar = () => {
    setUserToggled(true); // Mark as user-initiated
    setSidebarDetailsOpen((prev) => !prev);
  };

  // Reset user preference when screen size changes significantly
  useEffect(() => {
    const resetOnResize = () => {
      setUserToggled(false);
    };

    window.addEventListener("resize", resetOnResize);
    return () => window.removeEventListener("resize", resetOnResize);
  }, []);

  const availableTabs = [
    "overview",
    permissions?.fileManager?.display && "files",
    permissions?.note?.display && "notes",
    permissions?.ticket?.display && "tickets",
  ].filter(Boolean);

  const setActiveTabFucntion = (active) => {
    setActiveTab(active);
    setSelectRouteMenuConfig(objectId, active);
  };

  // Start Cookie RouteMenuConfig
  const setSelectRouteMenuConfig = (key, activeTab) => {
    const routeMenuConfigs = getRouteMenuConfig();
    let detailsConfig = {
      activeTab: activeTab,
      overview: routeMenuConfigs[key]?.details?.overview ||  null
    }
    routeMenuConfigs[key] = { ...routeMenuConfigs[key], details: detailsConfig};
    setRouteMenuConfig(routeMenuConfigs);
  };

  useEffect(() => {
    let routeMenuConfigs = getRouteMenuConfig();
    if (
      routeMenuConfigs &&
      routeMenuConfigs.hasOwnProperty(objectId)
    ) {
      const activeTab = routeMenuConfigs[objectId]?.details?.activeTab;
      setActiveTab((activeTab === 'list' || !activeTab) ? "overview" : activeTab);
    } else {
      setActiveTab("overview");
    }
  }, []);

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const setSuccessResponse = (data) => {
    setSync(false);
    const associations = data?.data?.associations;
    setAssociations(associations);

    const mConfigurations = data?.configurations;
    setConfigurations(mConfigurations);

    const mInfo = data?.info;
    setInfo(mInfo);

    const details = data?.data;
    const sortedItems = sortData(details, "details");
    setItems(sortedItems);
    setPermissions(data.configurations);
    setIsLoadedFirstTime(true);
  }

  const {
    mutate: getDetails,
    error,
    isLoading,
  } = useMutation({
    mutationKey: ["DetailsData", path, id],
    mutationFn: async () =>
      await Client.objects.byObjectId({
        objectId: objectId,
        id: id,
        urlParam,
        portalId,
        hubId,
        cache: sync ? false : true,
      }),
    onSuccess: (data) => {
      setSuccessResponse(data)
    },
    onError: (error) => {
      setSync(false);
      setIsLoadedFirstTime(true);
      console.error("Error fetching file details:", error);
    },
  });

  const getData = () => {
    if(preData) {
      setSuccessResponse(preData)
    } else {
      getDetails()
    }
  }

  useEffect(() => {
    let routeMenuConfigs = getRouteMenuConfig();
    if(preData === null && routeMenuConfigs[objectId]?.details?.preData) {
      getPreData()
    } else {
      getData();
    }
  }, [preData]);

  useEffect(() => {
    if (sync) getData();
  }, [sync]);

  const refetchGetData = () => {
    setSync(true);
  }

  const back = () => {
    let breadcrumbItems =
      JSON.parse(localStorage.getItem("breadcrumbItems")) || [];
    let path = breadcrumbItems[breadcrumbItems.length - 1];
    return path.path;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center text-center p-4  h-[calc(100%-var(--nav-height))] justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle/>
        </span>
        {error?.response?.data?.detailedMessage || ""}
      </div>
    );
  }

  if (!isLoadedFirstTime || (sync === true && isLoading) ) {
    return (
      <div>
        <div className=" flex relative z-[1] bg-cleanWhite h-[calc(98vh-var(--nav-height))] dark:bg-dark-200 overflow-hidden  md:p-4 p-3">
          <div
            className={`${isLargeScreen ? "w-[calc(100%_-330px)]  pr-4 pb-4" : "w-full"
              } lg:h-[calc(100vh-var(--nav-height))] hide-scrollbar overflow-y-auto overflow-x-hidden`}
          >
            <DetailsSkeleton />
          </div>
          <div
            className={` bg-cleanWhite transition-transform duration-200 ease-in-out 
        lg:h-[calc(100vh-100px)] h-full hide-scrollbar overflow-visible z-50 
        ${isLargeScreen
                ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 "
                : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform translate-x-full"
              } 
        ${!isLargeScreen && sidebarDetailsOpen ? "translate-x-0" : ""}`}
          >
            <div className="h-full hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 max-w-[350px] overflow-visible">
              <DetailsSidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dark:bg-dark-200 w-[100%] md:p-4 p-3 !pt-0 md:pb-0 rounded-tl-xl hide-scrollbar h-[calc(100vh-var(--nav-height))] overflow-hidden `}
    >
      {item.length > 0 && (
        <div className=" flex relative bg-cleanWhite  h-full dark:bg-dark-200 overflow-hidden">
          {associations && !isLargeScreen && !sidebarDetailsOpen && (
            <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
              <button
                className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                onClick={toggleSidebar}
              >
                <DetailsIcon />
              </button>
            </div>
          )}

          {/* main content code start */}
          <div
            id="details-scrollable-container"
            className={`${isLargeScreen ? "w-[calc(100%_-330px)]  pr-4 pb-4" : "w-full"
              } lg:h-full hide-scrollbar overflow-y-auto overflow-x-hidden md:pt-4 pt-3`}
          >
            <div className={``}>
              <DetailsHeaderCard
                bgImageClass="bg-custom-bg"
                path={path}
                item={item}
                objectId={objectId}
              />
              <IframeViewDialog />
              <div className="border dark:border-none rounded-lg  bg-graySecondary dark:bg-dark-300 border-flatGray w-fit dark:border-gray-700 my-4">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTabFucntion}
                  onValueChange={setActiveTabFucntion}
                  className="rounded-md "
                >
                  <TabsList>
                    <TabsTrigger className="rounded-md" value="overview">
                      <p className="text-black dark:text-white">Overview</p>
                    </TabsTrigger>
                    {permissions && permissions?.fileManager?.display && (
                      <TabsTrigger className="rounded-md" value="files">
                        <p className="text-black dark:text-white">Files</p>
                      </TabsTrigger>
                    )}
                    {permissions && permissions?.note?.display && (
                      <TabsTrigger className="rounded-md" value="notes">
                        <p className="text-black dark:text-white">Notes</p>
                      </TabsTrigger>
                    )}
                    {permissions && permissions?.ticket?.display && (
                      <TabsTrigger className="rounded-md" value="tickets">
                        <p className="text-black dark:text-white">
                          {permissions?.ticket?.display_label
                            ? permissions?.ticket?.display_label
                            : "Tickets"}
                          {/* {associations?.TICKET && associations.TICKET?.total > 0 && (
                            <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                              {associations.TICKET.total}
                            </span>
                          )} */}
                          {totalRecord > 0 && (
                            <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                              {totalRecord}
                            </span>
                          )}
                        </p>
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="overview"></TabsContent>
                  <TabsContent value="files"></TabsContent>
                  <TabsContent value="notes"></TabsContent>
                </Tabs>
              </div>
              {activeTab === "overview" && (
                <DetailsView
                  propertyName={propertyName}
                  showIframe={showIframe}
                  item={item}
                  objectId={objectId}
                  id={id}
                  refetch={refetchGetData}
                  permissions={permissions ? permissions.object : null}
                  isLoading={isLoading}
                  urlParam={urlParam}
                />
              )}
              {activeTab === "files" && (
                <Files
                  fileId={id}
                  path={path}
                  objectId={objectId}
                  id={id}
                  permissions={permissions ? permissions.fileManager : null}
                />
              )}

              {activeTab === "notes" && (
                <Notes
                  item={item}
                  path={path}
                  objectId={objectId}
                  id={id}
                  permissions={permissions ? permissions.note : null}
                />
              )}

              {activeTab === "tickets" && (
                <Tickets
                  path={path}
                  objectId={objectId}
                  id={id}
                  parentObjectTypeId={objectId}
                  parentObjectRowId={id}
                  permissions={permissions ? permissions.ticket : null}
                  companyAsMediator={companyAsMediator}
                  title={permissions?.ticket?.display_label || "Tickets"}
                />
              )}

              {images.length > 0 && activeTab === "photos" && (
                <DetailsGallery
                  images={images}
                  setGalleryDialog={setGalleryDialog}
                />
              )}

              {preData && activeTab === "overview" && 
                <div>
                  {isLoadingList ?
                    <div className="loader">
                      <div className="loader-line"></div>
                    </div>
                  : 
                    <hr className="w-full" />
                  }
                  <DetailsPagination objectId={objectId} states={states} />
                </div>
              }

            </div>
          </div>
          {/* main content code end */}

          {/* sidebar code start */}
          {/* Sidebar */}
          <div
            className={` bg-cleanWhite transition-transform duration-200 ease-in-out 
            lg:h-[calc(100vh-var(--nav-height))] h-full hide-scrollbar overflow-visible max-lg:z-[52] lg:mt-[1px]
            ${isLargeScreen
                ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 "
                : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform translate-x-full"
              } 
            ${!isLargeScreen && sidebarDetailsOpen ? "translate-x-0" : ""}`}
          >
            {/* Close Button for Small Devices */}
            {!isLargeScreen && sidebarDetailsOpen && (
              <div className="rounded-full dark:bg-dark-200 z-50 absolute right-[10px] top-[60px]">
                <button
                  className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                  onClick={() => setSidebarDetailsOpen(false)}
                >
                  <Arrow />
                </button>
              </div>
            )}

            {/* Sidebar Content */}
            <div className="h-full hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 max-w-[350px] overflow-visible md:!py-4">
              {associations &&
                Object.entries(associations)
                  .filter(
                    ([, association]) =>
                      association?.objectTypeId !== "0-5"
                  )
                  .map(([key, association]) => (
                    <DetailsAssociations
                      key={key}
                      association={association}
                      isActive={true}
                      parentObjectTypeName={path}
                      parentObjectTypeId={objectId}
                      parentObjectRowId={id}
                      refetch={getData}
                      objectId={objectId}
                      id={id}
                      companyAsMediator={companyAsMediator}
                      urlParam={urlParam}
                      parentPermissions={permissions}
                      info={info}
                    />
                  ))}
            </div>
          </div>

          {/* sidebar code end */}

          <Dialog
            open={galleryDialog}
            onClose={setGalleryDialog}
            className="w-[50%]"
          >
            <div className=" bg-cleanWhite dark:bg-dark-200 dark:text-white rounded-md flex-col justify-start items-center gap-6 inline-flex">
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto"
                  />
                ))}
              </div>
            </div>
          </Dialog>
        </div>
      ) 
      // : (
      //   <div>
      //     <div className=" flex relative bg-cleanWhite h-[calc(98vh-var(--nav-height))] dark:bg-dark-200 overflow-hidden md:pt-4 pt-3">
      //       <div
      //         className={`${isLargeScreen ? "w-[calc(100%_-330px)]  pr-4 pb-4" : "w-full"
      //           } lg:h-[calc(100vh-var(--nav-height))] hide-scrollbar overflow-y-auto overflow-x-hidden`}
      //       >
      //         <DetailsSkeleton />
      //       </div>
      //       <div
      //         className={` bg-cleanWhite transition-transform duration-200 ease-in-out 
      //       lg:h-[calc(100vh-100px)] h-full hide-scrollbar overflow-visible z-50 
      //       ${isLargeScreen
      //             ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 "
      //             : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform translate-x-full"
      //           } 
      //       ${!isLargeScreen && sidebarDetailsOpen ? "translate-x-0" : ""}`}
      //       >
      //         <div className="h-full hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 max-w-[350px] overflow-visible">
      //           <DetailsSidebarSkeleton />
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // )
      }
    </div>
  );
};
