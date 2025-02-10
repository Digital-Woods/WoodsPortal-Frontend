
const UserDetails = ({ path, objectId, id, userPermissions, isLoading }) => {
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
    // const param = getParam("t");
    const param = getQueryParamsFromCurrentUrl();
    const [activeTab, setActiveTab] = useState("files");
    const [permissions, setPermissions] = useState(userPermissions);
    const urlParam = getQueryParamsFromCurrentUrl();
    const [galleryDialog, setGalleryDialog] = useState(false);
    const { sync, setSync } = useSync();
    const [sidebarDetailsOpen, setSidebarDetailsOpen] = useState(false);
    const { isLargeScreen } = useResponsive();
    const [userToggled, setUserToggled] = useState(false); // Track user interaction
    // console.log(path,'=path', objectId,"=objectId", id,'=id');
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

    useEffect(() => {
        setConfigurations(userPermissions);
        setPermissions(userPermissions);
    }, [userPermissions]);

    const setActiveTabFucntion = (active) => {
        // setParam("t", active);
        setActiveTab(active);
    };
    let portalId;
    if (env.DATA_SOURCE_SET != true) {
        portalId = getPortal()?.portalId;
    }

    // console.log(permissions, 'permissions');

    // const {
    //     mutate: getData,
    //     error,
    //     isLoading,
    // } = useMutation({
    //     mutationKey: ["DetailsData", path, id],
    //     mutationFn: async () =>
    //         await Client.objects.byObjectId({
    //             objectId: objectId,
    //             id: id,
    //             urlParam,
    //             portalId,
    //             hubId,
    //             cache: sync ? false : true,
    //         }),
    //     onSuccess: (data) => {
    //         setSync(false);
    //         const associations = data?.data?.associations;
    //         setAssociations(associations);

    //         const mConfigurations = data?.configurations;
    //         setConfigurations(mConfigurations);

    //         const details = data?.data;
    //         const sortedItems = sortData(details, "details");
    //         setItems(sortedItems);
    //         console.log(sortedItems,'sortedItems');
    //         setPermissions(data.configurations)
    //     },
    //     onError: (error) => {
    //         setSync(false);
    //         console.error("Error fetching file details:", error);
    //     },
    // });

    // useEffect(() => {
    //     getData();
    // }, []);

    // useEffect(() => {
    //     setSync(true);
    // }, [objectId, id]);

    // const back = () => {
    //     let breadcrumbItems =
    //         JSON.parse(localStorage.getItem("breadcrumbItems")) || [];
    //     let path = breadcrumbItems[breadcrumbItems.length - 1];
    //     return path.path;
    // };

    // if (error) {
    //     return (
    //         <div className="w-full h-[calc(100vh_-110px)] flex flex-col items-center justify-center dark:text-white text-dark-300 bg-cleanWhite dark:bg-dark-200 md:text-2xl text-base font-semibold">
    //             Error fetching data
    //         </div>
    //     );
    // }
    const apis = {
        tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}${param}`,
        stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/`, // concat pipelineId
        formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields`,
        formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
            }`,
        createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields${param}`,
        updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields/:formId${param}`, // concat ticketId
    };

    // if (!item) {
    //     return <div className="loader-line"></div>;
    // }
console.log(isLoading,'isLoading');
    return (
        <div className={`dark:bg-dark-200 w-[100%] rounded-tl-xl hide-scrollbar overflow-hidden `}
        >
            {!isLoading ? (
                <div className=" flex relative bg-cleanWhite  dark:bg-dark-200 overflow-hidden">

                    {/* main content code start */}
                    <div className={`w-full hide-scrollbar overflow-y-auto overflow-x-hidden`}>
                        <div className={``}>
                            <div className="border rounded-lg dark:border-none bg-graySecondary dark:bg-dark-300 border-flatGray w-fit my-4">
                                <Tabs
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTabFucntion}
                                    className="rounded-md "
                                >
                                    <TabsList>
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

                            {activeTab === "files" && (
                                <Files fileId={id} path={path} objectId={objectId} id={id} permissions={permissions ? permissions.fileManager : null} />
                            )}

                            {activeTab === "notes" && (
                                <Notes item={item} path={path} objectId={objectId} id={id} permissions={permissions ? permissions.note : null} />
                            )}

                            {activeTab === "tickets" && (
                                // <Tickets
                                //     path={path}
                                //     objectId={objectId}
                                //     id={id}
                                //     parentObjectTypeId={objectId}
                                //     parentObjectRowId={id}
                                //     permissions={permissions ? permissions.ticket : null}
                                //     companyAsMediator={false}
                                //     profileTicket={true}
                                // />

                                <DashboardTable
                                    hubspotObjectTypeId={'0-5'}
                                    path={path}
                                    title={'Tickets'}
                                    apis={apis}
                                    componentName="object"
                                    defPermissions={permissions ? permissions.ticket : null}
                                    editView={true}

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
                    <div className="mt-4">
                        <DetailsSkeleton header={false} tabs={3} active={'file'} />
                    </div>
                </div>
            )}
        </div>
    );
};
