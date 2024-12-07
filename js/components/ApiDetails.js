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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const param = getParam("t");
  const [activeTab, setActiveTab] = useState(param || "overview");
  const [permissions, setPermissions] = useState(null);

  // const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  // const mediatorObjectRecordId = getParam("mediatorObjectRecordId")

  const urlParam = getQueryParamsFromCurrentUrl();

  const [galleryDialog, setGalleryDialog] = useState(false);

  const { sync, setSync } = useSync();

  const setActiveTabFucntion = (active) => {
    setParam("t", active);
    setActiveTab(active);
  };
  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId;
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
      const associations = data.data.associations;
      setAssociations(associations);

      const mConfigurations = data.configurations;
      setConfigurations(mConfigurations);

      const details = data.data;
      const sortedItems = sortData(details, "details");
      setItems(sortedItems);

      // console.log('data', data.configurations.object)
      setPermissions(data.configurations)


      // if (data.data) {
      //   const finalData = JSON.parse(
      //     JSON.stringify(sortData(data.data, "details", path))
      //   );
      //   setSortItems(finalData);
      // }
      // if (data.data.associations) {
      //   const finalData = data.data.associations;
      //   setAssociations(finalData);
      // }
      // setItems(data.data);
      // getImages(data.data);
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

  const getImages = (data) => {
    if (data && data.image) {
      let urlArray = data.image.split(",");
      setImages(urlArray);
    }
    // setImages([]);
  };

  const back = () => {
    let breadcrumbItems =
      JSON.parse(localStorage.getItem("breadcrumbItems")) || [];
    let path = breadcrumbItems[breadcrumbItems.length - 1];
    return path.path;
  };
  
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  useEffect(() => {
    if (isLargeScreen) setSidebarOpen(false);
  }, [isLargeScreen]);


  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-lightblue text-2xl font-semibold">
        Error fetching data
      </div>
    );
  }

  if (isLoading && !item) {
    return <div className="loader-line"></div>;
  }

  return (
    <div className="dark:bg-dark-200 w-[100%] md:p-6 p-3 overflow-hidden rounded-tl-xl">
      {isLoading && item && <div className="loader-line"></div>}

      {item.length > 0 ? (
        <div className=" flex relative overflow-hidden bg-cleanWhite dark:bg-dark-200 ">

          {associations && !isLargeScreen &&
            !sidebarOpen ? (
            <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
              <button
                className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  viewBox="0 0 64 64"
                  fill="currentColor"
                  height="1.5em"
                  width="1.5em"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit={20}
                    strokeWidth={3}
                    d="M0 21h6M16 21h48M0 33h6M16 33h48M0 45h6M16 45h48"
                  />
                </svg>
              </button>
            </div>
          ) : (
            ""
          )}

          <div className={`${isLargeScreen ? 'w-[calc(100%_-330px)]  pr-4' : 'w-full'} lg:max-h-[calc(100vh-82px)] max-h-[calc(100vh-110px)] hide-scrollbar overflow-y-auto`}>
            <div className={``}>
              <DetailsHeaderCard
                bgImageClass="bg-custom-bg"
                date="17/01/2024"
                serviceName="AquaFlow Service"
                following="Following"
                path={path}
                item={item}
              />

              <div className="border rounded-lg  bg-graySecondary dark:bg-dark-300 border-flatGray w-fit dark:border-gray-700 my-4">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTabFucntion}
                  className="rounded-md "
                >
                  <TabsList>
                    <TabsTrigger value="overview">
                      <p className="text-black dark:text-white">Overview</p>
                    </TabsTrigger>
                    {permissions && permissions.fileManager.show && (
                      <TabsTrigger value="files">
                        <p className="text-black dark:text-white">Files</p>
                      </TabsTrigger>
                    )}
                    {permissions && permissions.note.show && (
                      <TabsTrigger value="notes">
                        <p className="text-black dark:text-white">Notes</p>
                      </TabsTrigger>
                    )}
                    {permissions && permissions.ticket.show && (
                      <TabsTrigger value="tickets">
                        <p className="text-black dark:text-white">Tickets</p>
                      </TabsTrigger>
                    )}
                    {/* <TabsTrigger value="photos">
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
                <Notes path={path} objectId={objectId} id={id} permissions={permissions ? permissions.note : null} />
              )}

              {activeTab === "tickets" && (
                <Tickets
                  path={path}
                  objectId={objectId}
                  id={id}
                  parentObjectTypeId={objectId}
                  parentObjectRowId={id}
                  permissions={permissions ? permissions.ticket : null}
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
          <div className={`${isLargeScreen
            ? " translate-x-0  w-[330px]"
            : " md:w-[350px] absolute translate-x-full w-full md:p-3 px-2 pb-2 z-50"
            } ${sidebarOpen ? "translate-x-0 pt-2" : "translate-x-full"}
            rounded-md bg-cleanWhite dark:bg-dark-200  right-0 transform transition duration-200 ease-in-out
            lg:h-[calc(100vh-82px)] h-[calc(100vh-110px)] hide-scrollbar overflow-y-auto`}>
            {associations && !isLargeScreen && sidebarOpen ?
              <div className=" rounded-full dark:bg-dark-200 z-50 absolute right-[15px] top-[16px]">
                <button className='rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark' onClick={() => setSidebarOpen(false)}>
                  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z" />
                  </svg>
                </button>
              </div>
              : ''
            }
            {associations &&
              Object.entries(associations).map(
                ([key, association], index) => (
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
                  />
                )
              )}
          </div>

          <Dialog
            open={galleryDialog}
            onClose={setGalleryDialog}
            className="w-[50%]"
          >
            <div className=" bg-cleanWhite dark:bg-dark-100 dark:text-white rounded-md flex-col justify-start items-center gap-6 inline-flex">
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
        <div className="h-[calc(100vh_-136px)] flex flex-col justify-center items-center">
          <span>See the Jobs associated with this record.</span>
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
