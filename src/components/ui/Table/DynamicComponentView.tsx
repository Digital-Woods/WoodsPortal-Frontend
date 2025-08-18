import { useState, useEffect } from 'react';
import { env } from "@/env";
import { getQueryParamsFromCurrentUrl, getParam, removeAllParams, updateParamsFromUrl, getParamHash } from '@/utils/param'
import { getPortal, getRouteMenuConfig, setRouteMenuConfig } from '@/data/client/auth-utils'
import { hubId } from '@/defaultData'
import { useResponsive } from '@/utils/UseResponsive'
import { useBreadcrumb } from '@/state/use-breadcrumb';
import { useSync } from '@/state/use-sync';
import { Client } from '@/data/client/index'
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { useTable } from '@/state/use-table';
import { DashboardTableHeaderSkeleton } from '../skeletons/DashboardTableHeaderSkeleton';
import { BoardViewSkeleton } from '../skeletons/BoardViewSkeleton';
import { TableSkeleton } from '../skeletons/TableSkeleton';
import { CautionCircle } from '@/assets/icons/CautionCircle';
import { TableDetails } from '@/components/Details/TableDetails';
import { Link } from '@/components/ui/link';
import { formatCustomObjectLabel } from '@/utils/DataMigration';
import { HomeCompanyCard } from '../HomeCompanyCard';
import { DetailsIcon } from '@/assets/icons/detailsIcon';
import ReactHtmlParser from 'react-html-parser';
import DOMPurify from 'dompurify';
import { DashboardTable } from './DashboardTable';


export const DynamicComponentView = ({
  hubspotObjectTypeId,
  path,
  title,
  showIframe,
  propertyName,
  companyAsMediator,
  pipeLineId,
  specPipeLine,
  objectDescription,
  componentName = null,
  defPermissions = null,
  apis,
  isShowTitle=true,
  objectUserProperties,
  objectUserPropertiesView,
  isHome = false,
  ticketTableTitle=null,
}: any) => {
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId");
  const objectTypeName = getParam("objectTypeName");
  const param = getQueryParamsFromCurrentUrl();
  const [sidebarRightOpen, setSidebarRightOpen] = useState<any>(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState<any>(false);
  // const [totalRecord, setTotalRecord] = useState<any>(0);
  // const [isLoading, setIsLoading] = useState<any>(false);
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  const [tableTitle, setTableTitle] = useState<any>(null);
  const [singularTableTitle, setSingularTableTitle] = useState<any>("");
  const [associatedtableTitleSingular, setAssociatedtableTitleSingular] = useState<any>("");
  const [errorMessage, setErrorMessage] = useState<any>("");
  // const [pageView, setPageView] = useState<any>("table");
  const { sync, setSync } = useSync();
  const [isLoadedFirstTime, setIsLoadedFirstTime] = useState<any>(false);
  const [cacheEnabled, setCacheEnabled] = useState<any>(true);
  const [userData, setUserData] = useState<any>();
  // const [page, setPage] = useState<any>(1);
  // const [view, setView] = useState<any>(null);
  // // const [getTableParam, setGetTableParam] = useState<any>(null);
  // const pageLimit = env.TABLE_PAGE_LIMIT;
  // const [limit, setLimit] = useState<any>(pageLimit);
  // const [totalItems, setTotalItems] = useState<any>(1);
  // const [numOfPages, setNumOfPages] = useState<any>(1);



  const [isLoading, setIsLoading] = useState<any>(null);
  const [urlParam, setUrlParam] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [pipelines, setPipelines] = useState<any>([]);
  const [info, setInfo] = useState<any>(null);
  const [totalRecord, setTotalRecord] = useState<any>(null);
  const [activeCardData, setActiveCardData] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [isLoadingHoldData, setIsLoadingHoldData] = useState<any>(null);
  const [pageView, setPageView] = useState<any>(null);

  const { 
    limit,
    setLimit,
    setTotalItems,
    setNumOfPages,
    setView,
    view,
    getTableParam,
    resetTableParam,
    setSelectedPipeline,
    selectedPipeline,
    setDefaultPipeline,
    setPage,
    setSelectRouteMenuConfig

   }: any = useTable();

   useEffect(() => {
    let routeMenuConfigs = getRouteMenuConfig();
    const objectId = isHome ? 'home' : hubspotObjectTypeId

    if (
      routeMenuConfigs &&
      routeMenuConfigs.hasOwnProperty(objectId)
    ) {
      const activeTab = routeMenuConfigs[objectId].activeTab;
      setIsLoadingHoldData(true);
      setView(activeTab === "grid" ? "BOARD" : "LIST");
      setSelectedPipeline(routeMenuConfigs[objectId].activePipeline);
    } else {
      setIsLoadingHoldData(true);
      setView("LIST");
    }
  }, []);

  const fetchUserProfile = async ({ portalId, cache }: any) => {
    if (!portalId) return null;

    const response: any = await Client.user.profile({ portalId, cache });
    return response?.data;
  };

  const { data: userNewData, error, isLoading:propertyIsLoading, refetch } : any = useQuery({
    queryKey: ['userProfilePage', cacheEnabled],
    queryFn: () => fetchUserProfile({ portalId, cache: sync ? false : true }),
    onSuccess: (data) => {
      if (data) {
        setUserData(data);
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

  const { mutate: getData, isLoadingAPiData }: any = useMutation({
    mutationKey: ["TableData"],
    mutationFn: async () => {
      const objectId = isHome ? 'home' : hubspotObjectTypeId
      let routeMenuConfigs = getRouteMenuConfig();
      let param;

      console.log("routeMenuConfigs", routeMenuConfigs)
      console.log("objectId", objectId)

      if(routeMenuConfigs[objectId]?.details === true){
        const details = routeMenuConfigs[objectId]?.details
        const currentPage = details?.overview?.page || 1;
        const isPage = details?.overview?.preData && currentPage > 1
        param = getTableParam(companyAsMediator, isPage ? currentPage : 1);
      } else {
        param = getTableParam(companyAsMediator, null);
      }

      if (companyAsMediator) param.mediatorObjectTypeId = "0-2";
      if (defPermissions?.pipeline_id && componentName === "ticket") {
         param.filterValue = defPermissions?.pipeline_id;
      } else {
        if (selectedPipeline && (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5")){ 
          param.filterValue = selectedPipeline
        }else if (hubspotObjectTypeId != "0-3" || hubspotObjectTypeId != "0-5"){
          param.filterValue = ''
        }
      }

      // const activePipeline = routeMenuConfigs[objectId]?.activePipeline;
      // console.log("activePipeline", activePipeline)
      // param.filterValue = activePipeline

      // console.log("selectedPipeline", selectedPipeline)
      // console.log("activePipeline", activePipeline)
      // console.log("hubspotObjectTypeId", hubspotObjectTypeId)
      // console.log("hubspotObjectTypeId", hubspotObjectTypeId)

      // const activePipeline = routeMenuConfigs[objectId]?.activePipeline;
      // console.log("activePipeline", activePipeline)
     
      
      // if(componentName === "ticket" && activePipeline === "default") param.filterValue = ""

      const API_ENDPOINT = removeAllParams(apis.tableAPI);
      if (componentName != "ticket") {
        setIsLoading(true);
      }

      setUrlParam(param);
      return await Client.objects.all({
        API_ENDPOINT: API_ENDPOINT,
        param: updateParamsFromUrl(apis.tableAPI, param),
      });
    },

    onSuccess: (data: any) => {
      const objectId = isHome ? 'home' : hubspotObjectTypeId
      setErrorMessage('')

      const tableViewIsList = data?.configurations?.object?.list_view
      setPageView(tableViewIsList === false ? "single" : "table");
      setApiResponse(data);

      setSync(false);

      let routeMenuConfigs = getRouteMenuConfig();


       if (
        tableViewIsList && (routeMenuConfigs[objectId]?.listView === false)
      ) {
        routeMenuConfigs[objectId] = {
          ...routeMenuConfigs[objectId],
          listView: tableViewIsList,
          details: null,
        };        
        getData();
      } else {
        routeMenuConfigs[objectId] = {
          ...routeMenuConfigs[objectId],
          listView: tableViewIsList
        };   
        if (data.statusCode === "200") {
          setInfo(data.info);
          const tableViewIsList = data?.configurations?.object?.list_view

          const totalData = tableViewIsList  === false
            ? data?.pagination?.total
            : data?.data?.total;

          setTotalItems(totalData || 0);
          if (componentName != "ticket") {
            setIsLoading(false);
          }
          setTotalRecord(totalData || 0);
          if (view === "BOARD") {
            setActiveCardData(data?.data);
          } else {
            const ItemsPerPage = limit;
            setLimit(ItemsPerPage);

            const totalPage = tableViewIsList  === false
              ? Math.ceil(totalData / 1)
              : Math.ceil(totalData / ItemsPerPage);
            setNumOfPages(totalPage);
          }
          if (defPermissions) {
            setPermissions(data?.configurations[componentName]);
          } else {
            setPermissions(data?.configurations["object"]);
          }
        } else {
          setPermissions(null);
        }
      }
      setRouteMenuConfig(routeMenuConfigs);
      setIsLoadingHoldData(false);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.detailedMessage || "")
      setApiResponse(null)
      setSync(false);
      setPermissions(null);
      setIsLoadingHoldData(false);
      if (componentName != "ticket") {
        setIsLoading(false);
      }
    },
  });

  let portalId: any;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  // Sidebar show/hide logic for medium and small devices
  const toggleSidebar = () => {
    setUserToggled(true); // Mark as user-initiated
    setSidebarRightOpen((prev: any) => !prev);
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

  useEffect(() => {
    if (breadcrumbs && breadcrumbs.length > 0 ) {
      const last: any = breadcrumbs[breadcrumbs.length - 1];
      const previous: any = breadcrumbs[breadcrumbs.length - 2];
      const singularLastName = last?.name?.endsWith("s")
        ? last.name.slice(0, -1)
        : last.name;
      setAssociatedtableTitleSingular(singularLastName);
      if( componentName!="ticket"){
        setTableTitle(
          previous?.name ? { last: last, previous: previous } : { last: last }
        );
        setSingularTableTitle(
          previous?.name
          ? `${singularLastName} with ${previous?.name}`
          : singularLastName
        );}else{
        const ticketTableTitleSingular = ticketTableTitle.endsWith("s")?ticketTableTitle.slice(0, -1):ticketTableTitle;
      setTableTitle(
        {last:{name:title}}
      );
      setSingularTableTitle(
        previous?.name
          ? `${ticketTableTitleSingular} with ${singularLastName} `
          : ticketTableTitleSingular
      )
    }
    }
  }, [breadcrumbs]);

  // useEffect( async () => {
  //   await setErrorMessage('')
  //   await resetTableParam();
  //   await setApiResponse(null);
  //   await setPageView(null);
  //   // if(!isHome) getData();
  // }, []);

  // useEffect( async () => {
  //   if (sync && errorMessage) {
  //     await getData();
  //   }
  // }, [sync]);

  
  // useEffect(() => {
  //     getData();
  // }, [companyAsMediator]);

  // useEffect(() => {
  //   setErrorMessage("");
  // }, []);


    // Get Pipelines
  const { mutate: getPipelines, isLoadingPipelines } : any = useMutation({
    mutationKey: ["PipelineData"],
    mutationFn: async () => {
      return await Client.Deals.pipelines({
        API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}`,
        param: {
          cache: sync ? false : true,
        },
      });
    },

    onSuccess: async (data: any) => {
      const objectId = isHome ? 'home' : hubspotObjectTypeId
      await setPipelines(data.data);
      await setDefaultPipeline(data, objectId);
      await getData();
    },
    onError: () => {
      setPipelines([]);
    },
  });

  useEffect(() => {
    if (specPipeLine) {
       const objectId = isHome ? 'home' : hubspotObjectTypeId

      setSelectedPipeline(pipeLineId);
      setIsLoadingHoldData(true);
      const routeMenuConfig = {
        [objectId]: {
          activePipeline: pipeLineId,
        },
      };
      setSelectRouteMenuConfig(routeMenuConfig);
      setUrlParam({
        filterPropertyName: "hs_pipeline",
        filterOperator: "eq",
        filterValue: pipeLineId,
      });
    }
  }, [specPipeLine]);

  // useEffect(() => {
  //   await setErrorMessage('')
  //   await resetTableParam();
  //   await setApiResponse(null);
  //   await setPageView(null);
  //   // if(!isHome) {
  //     await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  //   // }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      await setErrorMessage('');
      await resetTableParam();
      await setApiResponse(null);
      await setPageView(null);

      // if(!isHome) {
      if (
        (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
        !defPermissions?.pipeline_id
      ) {
        await getPipelines();
      } else {
        console.log(123)
        // getData();
      }
      // }
    };

    fetchData();
  }, []);


  // useEffect( async () => {
  //   // if (sync && errorMessage) {
  //   if (sync) {
  //     await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  //   }
  // }, [sync]);

  useEffect(() => {
    const fetchData = async () => {
      if (sync) {
        if (
          (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
          !defPermissions?.pipeline_id
        ) {
          await getPipelines();
        } else {
          getData();
        }
      }
    };

    fetchData();
  }, [sync, hubspotObjectTypeId, defPermissions]);


  // useEffect(async () => {
  //     setPage(1);
  //     await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  // }, [companyAsMediator]);

  useEffect(() => {
    const fetchData = async () => {
      setPage(1);

      if (
        (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
        !defPermissions?.pipeline_id
      ) {
        await getPipelines();
      } else {
        console.log(456)

      try {
        await getData();
      } catch (err) {
        console.error("Error running getData", err);
      }
      }
    };

    fetchData();
  }, [companyAsMediator, hubspotObjectTypeId, defPermissions]);


  const changeTab = async (view) => {
    // if(!isHome) {
      await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
    // }
  }


  if (isLoadingAPiData === true) {
    return (
      <div
        className={` ${
          hubSpotUserDetails.sideMenu[0].tabName === title ||
          componentName === "ticket"
            ? "mt-0"
            : "mt-[calc(var(--nav-height)-1px)]"
        } rounded-md overflow-hidden bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
      >
        <DashboardTableHeaderSkeleton
          hubspotObjectTypeId={hubspotObjectTypeId}
          title={title}
        />
        {view === "BOARD" && activeCardData ? (
          <BoardViewSkeleton />
        ) : (
          <TableSkeleton />
        )}
      </div>
    );
  }

  if(errorMessage){
    return( 
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle/>
        </span>
        {errorMessage}
      </div>
    )
  }

  return (
    <div>
      {pageView === "single" && (
        <div className="bg-sidelayoutColor mt-[calc(var(--nav-height)-1px)] dark:bg-dark-300">
          <div className={`bg-cleanWhite dark:bg-dark-200`}>
            <TableDetails
              objectId={hubspotObjectTypeId}
              getData={getData}
              states={
                {isLoading,
                setIsLoading,
                urlParam,
                setUrlParam,
                apiResponse,
                setApiResponse,
                info,
                setInfo,
                totalRecord,
                setTotalRecord,
                activeCardData,
                setActiveCardData,
                permissions,
                setPermissions,
                isLoadingHoldData,
                setIsLoadingHoldData,
                pageView,
                setPageView}
              }
            />
          </div>
        </div>
      )}
      {pageView === "table" && (
        <div className="bg-sidelayoutColor dark:bg-dark-300">
          <div className={`dark:bg-dark-200 ${isShowTitle && 'mt-[calc(var(--nav-height)-1px)] pt-3 md:pl-4 md:pt-4 md:pr-3 pl-3 pr-3'} h-[calc(100vh-var(--nav-height))] overflow-x-auto hide-scrollbar bg-cleanWhite dark:text-white`}>
            <div className="flex relative z-[2] gap-6">
              <div className="flex flex-col gap-2 flex-1">
                {isShowTitle && hubSpotUserDetails.sideMenu[0].tabName != title && (
                  <span className="flex-1">
                    <ol className="flex dark:text-white flex-wrap">
                      {tableTitle &&
                        Object.entries(tableTitle).map(
                          ([key, value]: any, index: any, array: any) => {
                            return (
                              <li key={key} className="flex items-center">
                                <Link
                                  className="text-xl font-semibold text-[#0091AE] capitalize dark:text-white hover:underline"
                                  to={value?.path}
                                >
                                  {getParamHash(
                                    formatCustomObjectLabel(value?.name)
                                  )}
                                </Link>
                                {index < array.length - 1 && (
                                  <span className="mx-1 text-xl font-semibold text-[#0091AE]">
                                    associated with
                                  </span>
                                )}
                              </li>
                            );
                          }
                        )}
                    </ol>

                    <p className="dark:text-white leading-5 text-sm flex items-center">
                      {!isLoading ? (
                        `${totalRecord} records`
                      ) : (
                        <div className="h-4 w-20 bg-gray-300 dark:bg-white dark:opacity-20 rounded-sm animate-pulse mr-1 mt-1"></div>
                      )}
                    </p>
                    <div className="dark:text-white words-break">
                      {objectDescription
                        ? ReactHtmlParser(
                            DOMPurify.sanitize(objectDescription)
                          )
                        : ""}
                    </div>
                  </span>
                )}
              </div>
            </div>

            {objectUserProperties && objectUserProperties.length > 0 && 
              <div className="mt-3">
                <HomeCompanyCard
                  companyDetailsModalOption={false}
                  propertiesList={objectUserProperties}
                  userData={userData?.response}
                  isLoading={propertyIsLoading}
                  isLoadedFirstTime={isLoadedFirstTime}
                  iframePropertyName={objectUserProperties}
                  className={`!md:px-0 !px-0 !md:p-0 !pb-0`}
                  usedInDynamicComponent={true}
                  viewStyle={objectUserPropertiesView}
                />
              </div>
            }

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

              <div className="w-full" key={hubspotObjectTypeId}>
                <DashboardTable
                  key={hubspotObjectTypeId}
                  hubspotObjectTypeId={hubspotObjectTypeId}
                  path={path}
                  title={title == 'Association' ? associatedtableTitleSingular : (title || hubSpotUserDetails.sideMenu[0].label)}
                  tableTitle={
                    singularTableTitle || hubSpotUserDetails.sideMenu[0].label
                  }
                  propertyName={propertyName}
                  showIframe={showIframe}
                  apis={apis}
                  componentName={componentName || "object"}
                  defPermissions={defPermissions}
                  companyAsMediator={companyAsMediator}
                  pipeLineId={pipeLineId}
                  specPipeLine={specPipeLine}
                  getData={getData}
                  states={
                    {isLoading,
                    setIsLoading,
                    urlParam,
                    setUrlParam,
                    apiResponse,
                    setApiResponse,
                    info,
                    setInfo,
                    totalRecord,
                    setTotalRecord,
                    activeCardData,
                    setActiveCardData,
                    permissions,
                    setPermissions,
                    isLoadingHoldData,
                    setIsLoadingHoldData,
                    pageView,
                    setPageView}
                  }
                  isHome={isHome}
                  pipelines={pipelines}
                  isLoadingPipelines={isLoadingPipelines}
                  changeTab={changeTab}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};