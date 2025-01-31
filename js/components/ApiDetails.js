const ApiDetails = ({ path, objectId, id, propertyName, showIframe }) => {
  const [item, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [sortItems, setSortItems] = useState([]);
  const [associations, setAssociations] = useState({});
  const { me } = useMe();
  const [configurations, setConfigurations] = useState({
    fileManager: false,
    note: false,
    ticket: false
  });
  const param = getParam("t");
  const companyAsMediator = getParam("isPrimaryCompany");
  const [activeTab, setActiveTab] = useState(param || "overview");
  const [permissions, setPermissions] = useState(null);
  const urlParam = getQueryParamsFromCurrentUrl();
  const [galleryDialog, setGalleryDialog] = useState(false);
  const { sync, setSync } = useSync();
  const [sidebarDetailsOpen, setSidebarDetailsOpen] = useState(false);
  const { isLargeScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState(false); // Track user interaction

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

  const setActiveTabFucntion = (active) => {
    setParam("t", active);
    setActiveTab(active);
  };
  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const {
    mutate: getData,
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
      setSync(false);
      const associations = data?.data?.associations;
      setAssociations(associations);

      const mConfigurations = data?.configurations;
      setConfigurations(mConfigurations);

      const details = data?.data;
      const sortedItems = sortData(details, "details");
      setItems(sortedItems);
      setPermissions(data.configurations)
    },
    onError: (error) => {
      setSync(false);
      console.error("Error fetching file details:", error);
    },
  });

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (sync) getData();
  }, [sync]);

  const back = () => {
    let breadcrumbItems =
      JSON.parse(localStorage.getItem("breadcrumbItems")) || [];
    let path = breadcrumbItems[breadcrumbItems.length - 1];
    return path.path;
  };

  if (error) {
    return (
      <div className="w-full h-[calc(100vh_-110px)] flex flex-col items-center justify-center dark:text-white text-dark-300 bg-cleanWhite dark:bg-dark-200 md:text-2xl text-base font-semibold">
        Error fetching data
      </div>
    );
  }

  if (isLoading && !item) {
    return <div className="loader-line"></div>;
  }

  return (
    <div className={`dark:bg-dark-200 w-[100%] md:p-4 p-3 md:pb-0 rounded-tl-xl hide-scrollbar h-[calc(100vh-var(--nav-height))] overflow-hidden `}
    >
      {isLoading && item && <div className="loader-line"></div>}

      {item.length > 0 ? (
        <div className=" flex relative bg-cleanWhite h-[calc(98vh-var(--nav-height))] dark:bg-dark-200 overflow-hidden">

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
          <div className={`${isLargeScreen ? 'w-[calc(100%_-330px)]  pr-4 pb-4' : 'w-full'} lg:h-[calc(100vh-var(--nav-height))] hide-scrollbar overflow-y-auto overflow-x-hidden`}>
            <div className={``}>
              <DetailsHeaderCard
                bgImageClass="bg-custom-bg"
                date="17/01/2024"
                serviceName="AquaFlow Service"
                following="Following"
                path={path}
                item={item}
              />
              <IframeViewDialog />
              <div className="border rounded-lg  bg-graySecondary dark:bg-dark-300 border-flatGray w-fit dark:border-gray-700 my-4">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTabFucntion}
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
                        <p className="text-black dark:text-white">Tickets</p>
                      </TabsTrigger>
                    )}
                    {/* <TabsTrigger className="rounded-md" value="photos">
                    <p className="text-black dark:text-white">Photos</p>
                  </TabsTrigger> */}
                  </TabsList>

                  <TabsContent value="overview"></TabsContent>
                  <TabsContent value="files"></TabsContent>
                  <TabsContent value="notes">{/* <Notes /> */}</TabsContent>
                  {/* <TabsContent value="photos"></TabsContent> */}
                </Tabs>
              </div>

              {/* {(path === "/sites" || path === "/assets") && <DetailsMapsCard />} */}

              {/* {path === "/jobs" && (
              <div className="col-span-4">
                <DetailsTable item={item} path={path} />
              </div>
            )} */}
              {/* {sortItems && activeTab === "overview" && (
              <DetailsView item={item} sortItems={sortItems} />
            )} */}

              {activeTab === "overview" && (
                <DetailsView
                  propertyName={propertyName}
                  showIframe={showIframe}
                  item={item}
                  objectId={objectId}
                  id={id}
                  refetch={getData}
                  permissions={permissions ? permissions.object : null}
                />
              )}

              {activeTab === "files" && (
                <Files fileId={id} path={path} objectId={objectId} id={id} permissions={permissions ? permissions.fileManager : null} />
              )}

              {activeTab === "notes" && (
                <Notes item={item} path={path} objectId={objectId} id={id} permissions={permissions ? permissions.note : null} />
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
                />
              )}

              {images.length > 0 && activeTab === "photos" && (
                <DetailsGallery
                  images={images}
                  setGalleryDialog={setGalleryDialog}
                />
              )}
            </div>
          </div>
          {/* main content code end */}

          {/* sidebar code start */}
          {/* Sidebar */}
          <div
            className={` bg-cleanWhite transition-transform duration-200 ease-in-out 
            lg:h-[calc(100vh-100px)] h-full hide-scrollbar overflow-visible z-50 
            ${isLargeScreen ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 " : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform translate-x-full"} 
            ${!isLargeScreen && sidebarDetailsOpen ? "translate-x-0" : ""}`}
          >
            {/* Close Button for Small Devices */}
            {!isLargeScreen && sidebarDetailsOpen && (
              <div className="rounded-full dark:bg-dark-200 z-50 absolute right-[15px] top-[16px]">
                <button
                  className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                  onClick={() => setSidebarDetailsOpen(false)}
                >
                  <Arrow />
                </button>
              </div>
            )}

            {/* Sidebar Content */}
            <div className="h-full hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 max-w-[350px] overflow-visible">
              {associations &&
                Object.entries(associations).map(([key, association]) => (
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
      ) : (
        <div className="h-[calc(100vh_-136px)]">
          <DetailsSkeleton />
          {/* <Link
            className="capitalize"
            to={back}
          >
            Back
          </Link> */}
        </div>
      )}
    </div>
  );
};
