import { Arrow } from "@/assets/icons/arrow";
import { CautionCircle } from "@/assets/icons/CautionCircle";
import { DetailsIcon } from "@/assets/icons/detailsIcon";
import { Client } from "@/data/client";
import { getRouteMenuConfig, setRouteMenuConfig, getPortal } from "@/data/client/auth-utils";
import { useMe } from "@/data/user";
import { hubId } from "@/data/hubSpotData";
import { useSync } from "@/state/use-sync";
import { useTable } from "@/state/use-table";
import { sanitizeForBase64, sortData } from "@/utils/DataMigration";
import { getParam, getQueryParamsFromCurrentUrl } from "@/utils/param";
import { useResponsive } from "@/utils/UseResponsive";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { useState, useEffect} from "react";
import { Dialog } from "./ui/Dialog";
import { Notes } from "./ui/Notes";
import { Files } from "./ui/files/Files";
import { IframeViewDialog } from "./ui/IframeViewDialog";
import { DetailsSidebarSkeleton } from "./ui/skeletons/DetailsSidebarSkeleton";
import { DetailsSkeleton } from "./ui/skeletons/DetailsSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { Tickets } from "./ui/Tickets";
import { DetailsAssociations } from "./Details/DetailsAssociations";
import { DetailsGallery } from "./Details/DetailsGallery";
import { DetailsHeaderCard } from "./Details/DetailsHeaderCard";
import { DetailsPagination } from "./Details/DetailsPagination";
import { DetailsView } from "./Details/DetailsView";
import { useRouter } from "@tanstack/react-router";
import { getParamDetails, useUpdateLink } from "@/utils/GenerateUrl";
import NotFound from "./Layouts/404";
import { useNavHeight } from "@/utils/UseNavHeight";

export const ApiDetails = ({ path, objectId, id, propertyName, showIframe, getPreData = null, preData = null, states ={isLoading : false} }: any) => {
  useNavHeight();
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
  const companyAsMediator = getParam("isPrimaryCompany") || false;
  // const [activeTab, setActiveTab] = useState(param || "overview");
  const [activeTab, setActiveTab] = useState<any>("overview");
  const [permissions, setPermissions] = useState<any>(null);
  const urlParam = getQueryParamsFromCurrentUrl();
  const [galleryDialog, setGalleryDialog] = useState<any>(false);
  const { sync, setSync, apiSync } = useSync();
  const [sidebarDetailsOpen, setSidebarDetailsOpen] = useState<any>(false);
  const { isLargeScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState<any>(false); // Track user interaction
  const [isLoadedFirstTime, setIsLoadedFirstTime] = useState<any>(false); 

  const {isLoading: isLoadingList} = states

  const router = useRouter()
  const { pathname } = router.state.location

  // Automatically adjust the sidebar based on screen size
  useEffect(() => {
    if (!userToggled) {
      setSidebarDetailsOpen(isLargeScreen);
    }
  }, [isLargeScreen, userToggled]);

  // Function to toggle sidebar manually
  const toggleSidebar = () => {
    setUserToggled(true); // Mark as user-initiated
    setSidebarDetailsOpen((prev: any) => !prev);
  };

  // Reset user preference when screen size changes significantly
  useEffect(() => {
    const resetOnResize = () => {
      setUserToggled(false);
    };
    window.addEventListener("resize", resetOnResize);
    return () => window.removeEventListener("resize", resetOnResize);
  }, [pathname]);

  const {updateLink, filterParams} = useUpdateLink();

  const setActiveTabFucntion = (active: any) => {
    setActiveTab(active);
    updateLink({
      aT: active
    }, "")
    // setSelectRouteMenuConfig(objectId, active);
  };


  // Start Cookie RouteMenuConfig
  // const setSelectRouteMenuConfig = (key: any, activeTab: any) => {
    // const routeMenuConfigs = getRouteMenuConfig();
    // let detailsConfig = {
    //   activeTab: activeTab,
    //   overview: routeMenuConfigs[key]?.details?.overview ||  null
    // }
    // routeMenuConfigs[key] = { ...routeMenuConfigs[key], details: detailsConfig};
    // setRouteMenuConfig(routeMenuConfigs);
  // };

  // useEffect(() => {
  //   setTab()
  //   getData();
  // }, []);

   useEffect(() => {
      const fetchData = async () => {
        await setTab()
        getData();
      };
      fetchData();
    }, []);

  const setTab = async (value?: any) => {
    let tabName = "overview"
    const activeTab = filterParams("")?.activeTab;
    if (
      activeTab
    ) {
      const active = value || activeTab;
      tabName = (active === 'list' || !active) ? "overview" : active
      await setActiveTabFucntion(tabName);
    } else {
      await setActiveTabFucntion(tabName);
    }
    return tabName
  }


  const onChangeTab = (value: any) => {
    setTab(value)
  }

  let portalId: any;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const setSuccessResponse = (data: any) => {
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
    setPermissions(data?.configurations);
    setIsLoadedFirstTime(true);
  }

  const {params} = getParamDetails()

  const {
    mutate: getDetails,
    error,
    isLoading,
  }: any = useMutation({
    mutationKey: ["DetailsData", path, id],
    mutationFn: async () =>
      await Client.objects.byObjectId({
        objectId: objectId,
        id: id,
        urlParam: params,
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
    getDetails()
  }

  useEffect(() => {
    if (sync || apiSync) getData();
  }, [sync, apiSync]);

  const refetchGetData = () => {
    setSync(true);
  }

  if (error) {
    return (<NotFound message={error?.response?.data?.errorMessage || ""} type="details"/>);
    {/* return (
      <div className="flex flex-col items-center text-center p-4  h-[calc(100%-var(--nav-height))] justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle/>
        </span>
        {error?.response?.data?.errorMessage || ""}
      </div>
    ); */}
  }

  if (!isLoadedFirstTime || (sync === true && isLoading) ) {
    return (
      <div>
        <div className=" flex relative z-[1] bg-cleanWhite h-[calc(98vh-var(--nav-height))] dark:bg-dark-200 overflow-hidden  md:p-4 p-3">
          <div
            className={`${isLargeScreen ? "w-[calc(100%_-330px)]  pr-4 pb-4" : "w-full"
              } lg:h-[calc(100vh-var(--nav-height))] CUSTOM-hide-scrollbar overflow-y-auto overflow-x-hidden`}
          >
            <DetailsSkeleton />
          </div>
          <div className={` bg-cleanWhite transition-transform duration-200 ease-in-out lg:h-[calc(100vh-100px)] h-full CUSTOM-hide-scrollbar overflow-visible z-50 ${isLargeScreen ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 " : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform"} ${isLargeScreen && sidebarDetailsOpen ? " " :!isLargeScreen && sidebarDetailsOpen ? `translate-x-0` : "translate-x-full"}`}>
            <div className="h-full CUSTOM-hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 md:max-w-[350px] max-w-[100vw] overflow-visible">
              <DetailsSidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dark:bg-dark-200 w-[100%] md:p-4 p-3 !pt-0 md:pb-0 rounded-tl-xl CUSTOM-hide-scrollbar h-[calc(100vh-var(--nav-height))] overflow-hidden `}
    >
      {item.length > 0 && (
        <div className=" flex relative bg-cleanWhite  h-full dark:bg-dark-200 overflow-hidden">
          {(associations && typeof associations === "object" && Object.keys(associations).length > 0) && !isLargeScreen && !sidebarDetailsOpen && (
            <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
              <button
                className="rounded-full p-2 dark:bg-cleanWhite bg-[var(--sidebar-background-color)] text-[var(--sidebar-text-color)] dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                onClick={toggleSidebar}
              >
                <DetailsIcon />
              </button>
            </div>
          )}

          {/* main content code start */}
          <div
            id="details-scrollable-container"
            className={`${isLargeScreen ? "w-[calc(100%_-330px)]  pr-4 pb-4" : "w-full md:pt-4 pt-3"
              } lg:h-full CUSTOM-hide-scrollbar overflow-y-auto overflow-x-hidden`}
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
                  setActiveTab={onChangeTab}
                  onValueChange={onChangeTab}
                  className="rounded-md "
                >
                  <TabsList>
                    <TabsTrigger className="rounded-md" value="overview">
                      <div className="text-black dark:text-white">Overview</div>
                    </TabsTrigger>
                    {permissions && permissions?.fileManager?.display && (
                      <TabsTrigger className="rounded-md" value="files">
                        <div className="text-black dark:text-white">Files</div>
                      </TabsTrigger>
                    )}
                    {permissions && permissions?.note?.display && (
                      <TabsTrigger className="rounded-md" value="notes">
                        <div className="text-black dark:text-white">Notes</div>
                      </TabsTrigger>
                    )}
                    {permissions && permissions?.ticket?.display && (
                      <TabsTrigger className="rounded-md" value="tickets">
                        <div className="text-black dark:text-white">
                          {permissions?.ticket?.display_label
                            ? permissions?.ticket?.display_label
                            : "Tickets"}
                          {/* {associations?.TICKET && associations.TICKET?.total > 0 && (
                            <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                              {associations.TICKET.total}
                            </span>
                          )} */}
                          {/* {totalRecord > 0 && (
                            <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                              {totalRecord}
                            </span>
                          )} */}
                        </div>
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="overview"></TabsContent>
                  <TabsContent value="files"></TabsContent>
                  <TabsContent value="notes"></TabsContent>
                  <TabsContent value="tickets"></TabsContent>
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
                  permissions={permissions ? permissions?.object : null}
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
                  permissions={permissions ? permissions?.fileManager : null}
                />
              )}

              {activeTab === "notes" && (
                <Notes
                  item={item}
                  path={path}
                  objectId={objectId}
                  id={id}
                  permissions={permissions ? permissions?.note : null}
                />
              )}

              {activeTab === "tickets" && (
                <Tickets
                  path={path}
                  objectId={objectId}
                  id={id}
                  parentObjectTypeId={objectId}
                  parentObjectRowId={id}
                  permissions={permissions ? permissions?.ticket : null}
                  companyAsMediator={companyAsMediator}
                  title={permissions?.ticket?.display_label || "Tickets"}
                  ticketTableTitle={permissions?.ticket?.display_label || "Tickets"}
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
                      <div className="CUSTOM-loader-line"></div>
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
          <div className={` bg-cleanWhite transition-transform duration-200 ease-in-out lg:h-[calc(100vh-100px)] h-full CUSTOM-hide-scrollbar overflow-visible z-50 ${isLargeScreen ? "w-[330px] right-0 static rounded-md dark:bg-dark-200 " : "fixed w-full inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter right-0 top-0 bottom-0 transform"} ${isLargeScreen && sidebarDetailsOpen ? " " :!isLargeScreen && sidebarDetailsOpen ? `translate-x-0` : "translate-x-full"}`}>
            {/* Close Button for Small Devices */}
            {!isLargeScreen && sidebarDetailsOpen && (
              <div className="rounded-full dark:bg-dark-200 z-50 absolute right-[10px] top-[60px]">
                <button
                  className="rounded-full p-2 dark:bg-cleanWhite bg-[var(--sidebar-background-color)] text-[var(--sidebar-text-color)] dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                  onClick={() => setSidebarDetailsOpen(false)}
                >
                  <Arrow />
                </button>
              </div>
            )}

            {/* Sidebar Content */}
            <div className="h-full CUSTOM-hide-scrollbar ml-auto lg:max-w-auto lg:p-0 p-3 bg-cleanWhite dark:bg-dark-200 md:max-w-[350px] max-w-[100vw] overflow-y-auto md:!py-4">
              {associations &&
                Object.entries(associations)
                  .filter(
                    ([, association]: any) =>
                      association?.objectTypeId !== "0-5"
                  )
                  .map(([key, association]) => (
                    <DetailsAssociations
                      key={key}
                      association={association}
                      isActive={true}
                      parentObjectTypeName={sanitizeForBase64(path)}
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
      )}
    </div>
  );
};
