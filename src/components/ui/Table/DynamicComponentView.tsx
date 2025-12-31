import { useState, useEffect } from 'react';
import { env } from "@/env";
import { getQueryParamsFromCurrentUrl, getParam, removeAllParams, updateParamsFromUrl, getParamHash } from '@/utils/param'
import { getPortal, getRouteMenuConfig, setRouteMenuConfig } from '@/data/client/auth-utils'
import { hubId } from '@/data/hubSpotData'
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
import { HtmlParser } from '@/components/HtmlParser';
import DOMPurify from 'dompurify';
import { DashboardTable } from './DashboardTable';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/state/use-auth';
import { getParamDetails, getRouteDetails, getTableTitle, useUpdateLink } from '@/utils/GenerateUrl';
import { isAuthenticateApp } from '@/data/client/token-store';
import { DashboardTitleSkeleton } from '../skeletons/DashboardTitleSkeleton';


export const DynamicComponentView = ({
  hubspotObjectTypeId,
  path,
  title = "",
  showIframe,
  propertyName,
  companyAsMediator,
  pipeLineId,
  specPipeLine,
  objectDescription,
  componentName = null,
  defaultPermissions = null,
  apis,
  isShowTitle=true,
  objectUserProperties,
  objectUserPropertiesView,
  isHome = false,
  ticketTableTitle=null,
}: any) => {
  const [defPermissions, setDefPermissions] = useState<any>();
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId");
  const objectTypeName = getParam("objectTypeName");
  const param = getQueryParamsFromCurrentUrl();
  const [sidebarRightOpen, setSidebarRightOpen] = useState<any>(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState<any>(false);
  // const [totalRecord, setTotalRecord] = useState<any>(0);
  // const [isLoading, setIsLoading] = useState<any>(false);
  // const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  // const [tableTitle, setTableTitle] = useState<any>(null);
  // const [singularTableTitle, setSingularTableTitle] = useState<any>("");
  // const [associatedtableTitleSingular, setAssociatedtableTitleSingular] = useState<any>("");
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [errorMessageCategory, setErrorMessageCategory] = useState<any>("");
  // const [pageView, setPageView] = useState<any>("table");
  const { sync, setSync, apiSync, setApiSync } = useSync();
  const [isLoadedFirstTime, setIsLoadedFirstTime] = useState<any>(true);

  const {associatedtableTitleSingular, tableTitle, singularTableTitle} = getTableTitle(componentName, title, ticketTableTitle)

  // const [cacheEnabled, setCacheEnabled] = useState<any>(true);
  const [userData, setUserData] = useState<any>();
  // const [page, setPage] = useState<any>(1);
  // const [view, setView] = useState<any>(null);
  // // const [getTableParam, setGetTableParam] = useState<any>(null);
  // const pageLimit = env.TABLE_PAGE_LIMIT;
  // const [limit, setLimit] = useState<any>(pageLimit);
  // const [totalItems, setTotalItems] = useState<any>(1);
  // const [numOfPages, setNumOfPages] = useState<any>(1);

  const {updateLink, getLinkParams, filterParams} = useUpdateLink();
  const { paramsObject} = getParamDetails({type: componentName});

  const router = useRouter()
  const { pathname } = router.state.location

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
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [isFristTimeLoadData, setIsFristTimeLoadData] = useState<any>(true);
  const [isLoadedUserProfile, setIsLoadedUserProfile] = useState<any>(false);

  const { subscriptionType }: any = useAuth();

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
    setTableFilterData,
    setTableDefPermissions
   }: any = useTable();

  //  useEffect(() => {
  //   if (defaultPermissions) {
  //     setDefPermissions(defaultPermissions);
  //   }
  //  }, [defaultPermissions]);

   const {routeDetails} = getRouteDetails()

    const { setPagination }: any = useAuth();

    const fetchUserProfile = async ({ portalId, cache }: any) => {
      if (!portalId) return null;

      const response: any = await Client.user.profile({ portalId, cache });
      return response?.data;
    };

    const {isLoading : isLoadingFetchUserProfile, refetch: refetchFetchUserProfile } = useQuery({
      queryKey: ['userProfilePage'],
      queryFn: () => fetchUserProfile({ portalId, cache: sync ? false : true }),
      onSuccess: (data) => {
        if (data) {
          setUserData(data);
          // if(!isHome && companyAsMediator && hubspotObjectTypeId === "0-5") setDefPermissions(data?.response?.associations?.COMPANY?.configurations?.ticket)
          if(!isHome && companyAsMediator && hubspotObjectTypeId === "0-5") setPermissions(data?.response?.associations?.COMPANY?.configurations?.ticket)
          setIsLoadedUserProfile(true)
        }
        setSync(false);
        // setIsLoadedFirstTime(true);
      },
      onError: (error) => {
        console.error("Error fetching profile:", error);
        setSync(false);
        setIsLoadedUserProfile(true)
        // setIsLoadedFirstTime(true);
      },
      enabled: isAuthenticateApp(),
    });

    useEffect(() => {
      const fetchData = async () => {
        if(!isLoadedUserProfile) return
        let pipeline = ""
        // set configurations
        await setPagination([])
        // let routeMenuConfigs = getRouteMenuConfig();
        // const objectId = isHome ? 'home' : hubspotObjectTypeId

        // if (
        //   routeMenuConfigs &&
        //   routeMenuConfigs.hasOwnProperty(objectId)
        // ) {
        //   const activeTab = routeMenuConfigs[objectId].activeTab;
        //   await setView(activeTab === "grid" ? "BOARD" : "LIST");
        //   pipeline = routeMenuConfigs[objectId].activePipeline;
        //   await setSelectedPipeline(routeMenuConfigs[objectId].activePipeline);
        // } else {
        //   await setView("LIST");
        // }

        await setView(filterParams()?.view || "LIST");
        await setSelectedPipeline(filterParams()?.activePipeline || "");

        if (specPipeLine) {
          pipeline = specPipeLine;
          const objectId = isHome ? 'home' : hubspotObjectTypeId
          await setSelectedPipeline(pipeLineId);
          // const routeMenuConfig = {
          //   [objectId]: {
          //     activePipeline: pipeLineId,
          //   },
          // };
          // await setSelectRouteMenuConfig(routeMenuConfig);
          
          // updateLink({aPip: pipeLineId})
          await setUrlParam({
            filterPropertyName: "hs_pipeline",
            filterOperator: "eq",
            filterValue: pipeLineId,
          });
          // updateLink({
          //   fPName: "hs_pipeline",
          //   fO: "eq",
          //   fV: pipeLineId,
          // })
        }

        // reset and fetch data
        await setErrorMessage('');
        await setErrorMessageCategory('');
        await resetTableParam();
        await setApiResponse(null);
        await setPageView(null);

        // setSelectedPipeline is not async so i pass manualy pipeline value

        if (
          // (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
          // (!defPermissions?.pipeline_id && !routeDetails?.defPermissions?.pipeline_id && !specPipeLine)
          (!routeDetails?.defPermissions?.pipeline_id && !specPipeLine)
        ) {
          await getPipelines();
        } else {
          await getData(pipeline);
        }
      };
      setIsLoadingHoldData(true);
      fetchData();
    }, [isLoadedUserProfile]);

  const { mutate: getData, isLoading: isLoadingAPiData }: any = useMutation({
    mutationKey: ["TableData"],
    mutationFn: async ( variables: {
      pipeline?: any;
      mPipelines?: any;
    } = {}) => {
      const { pipeline, mPipelines } = variables;
      // const objectId = isHome ? 'home' : hubspotObjectTypeId
      // let routeMenuConfigs = getRouteMenuConfig();
      let param;

      // off details view logic
      // if(routeMenuConfigs[objectId]?.details === true){
      //   const details = routeMenuConfigs[objectId]?.details
      //   const currentPage = details?.overview?.page || 1;
      //   const isPage = details?.overview?.preData && currentPage > 1
      //   param = getTableParam(companyAsMediator, isPage ? currentPage : 1);
      // } else {
      //   param = getTableParam(companyAsMediator, null);
      // }

      param = getTableParam(companyAsMediator, null);

      const mSelectedPipeline = pipeline !== undefined ? pipeline : selectedPipeline;


      // if (companyAsMediator) param.mediatorObjectTypeId = "0-2";
      
      // if ((defPermissions?.pipeline_id || routeDetails?.defPermissions?.pipeline_id) && (componentName === "ticket" || hubspotObjectTypeId === "0-5")) {
      //    param.filterValue = defPermissions?.pipeline_id || routeDetails?.defPermissions?.pipeline_id;
      // } else {
      //   if (mSelectedPipeline){ 
      //     param.filterValue = mSelectedPipeline
      //   }else if(specPipeLine && pipeLineId){
      //     param.filterValue = pipeLineId
      //   }
      //   else if (hubspotObjectTypeId != "0-3" || hubspotObjectTypeId != "0-5"){
      //     param.filterValue = ''
      //   }
      // }

      if (mSelectedPipeline){ 
        param.filterValue = mSelectedPipeline
      }else if(specPipeLine && pipeLineId){
        param.filterValue = pipeLineId
      }
      else if (hubspotObjectTypeId != "0-3" || hubspotObjectTypeId != "0-5"){
        param.filterValue = ''
      }

      // const activePipeline = routeMenuConfigs[objectId]?.activePipeline;
      // param.filterValue = activePipeline

      // const activePipeline = routeMenuConfigs[objectId]?.activePipeline;
     
      
      // if(componentName === "ticket" && activePipeline === "default") param.filterValue = ""

      // const API_ENDPOINT = removeAllParams(apis.tableAPI);
      const API_ENDPOINT = apis.tableAPI;
      if (componentName != "ticket") {
        setIsLoading(true);
      }
      // let params = param

      const fParams = getLinkParams()

      param = {...(isFristTimeLoadData && fParams && !isHome ? fParams : param), ...paramsObject}


      // setUrlParam(param);
      

      if(!isFristTimeLoadData || !fParams) {
        updateLink({
          "sort": param?.sort,
          "s": param?.search,
          "fPn": param?.filterPropertyName,
          "fO": param?.filterOperator,
          "fV": param?.filterValue,
          "c": param?.cache,
          "isPC": param?.isPrimaryCompany,
          "v": param?.view,
          "l": param?.limit,
          "p": param?.page,
          "a": param?.after,
        })
      }
      
      // if(defPermissions) {
      //   setTableDefPermissions({
      //     "cT": defPermissions?.create,
      //     "dP": defPermissions?.display,
      //     "dL": defPermissions?.display_label,
      //     "pId": defPermissions?.pipeline_id,
      //   })
      // }

      setTableFilterData(param)

      if(mPipelines != undefined && mPipelines?.length === 0 && !specPipeLine) { // if pipelines empty then set filter value is empty (n-a)
        param.filterValue = ""
        updateLink({
          "fV": param?.filterValue,
        })
      }

      if(mPipelines != undefined && mPipelines?.length === 1 && !specPipeLine && mSelectedPipeline != null) { // if pipelines length is 0 then forcefully set 0 index pipeline
        param.filterValue = mPipelines[0].pipelineId
        updateLink({
          "fV": param?.filterValue,
        })
      }

      //  if(defPermissions?.pipeline_id) { // if ticket added pipeline ID
      //   param.filterValue = defPermissions?.pipeline_id
      //   updateLink({
      //     "fV": defPermissions?.pipeline_id
      //   })
      // }

      if(isHome) { // Only for home tickets
        let parentObjectTypeId = ""
        if (userData?.info?.objectTypeId && !param?.isPrimaryCompany) {
          parentObjectTypeId = userData?.info?.objectTypeId
        } else if (userData?.info?.objectTypeId && param?.isPrimaryCompany) {
          parentObjectTypeId = "0-2"
        }
        param.parentObjectTypeId = parentObjectTypeId
      }

      return await Client.objects.all({
        API_ENDPOINT: API_ENDPOINT,
        // param: updateParamsFromUrl(apis.tableAPI, params),
        param: param,
      });
    },

    onSuccess: (data: any) => {
      // const objectId = isHome ? 'home' : hubspotObjectTypeId
      setErrorMessage('')
      setErrorMessageCategory('')

      // const tableViewIsList = data?.configurations?.object?.list_view
      // setPageView(tableViewIsList === false ? "single" : "table");
      setPageView("table");
      setApiResponse(data);

      setSync(false);
      setApiSync(false);

      // let routeMenuConfigs = getRouteMenuConfig();

      setCurrentPage(data?.pagination)
      setIsLoadedFirstTime(false)
      setIsFristTimeLoadData(false)

      // if (
      //   tableViewIsList && (routeMenuConfigs[objectId]?.listView === false)
      // ) {
      //   routeMenuConfigs[objectId] = {
      //     ...routeMenuConfigs[objectId],
      //     listView: tableViewIsList,
      //     details: null,
      //   };        
      //   getData();
      // } else {
        // routeMenuConfigs[objectId] = {
        //   ...routeMenuConfigs[objectId],
        //   listView: tableViewIsList
        // };   
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
          if ((routeDetails?.defPermissions)) {
            setPermissions(data?.configurations[componentName]);
          } else if(componentName === "ticket") {
            setPermissions(data?.configurations?.ticket);
          } else {
            setPermissions(data?.configurations?.object);
          }
        } else {
          setPermissions(null);
        }
      // }
      // setRouteMenuConfig(routeMenuConfigs);
      setIsLoadingHoldData(false);
    },
    onError: (error: any) => {
      setPageView("table");
      setErrorMessage(error?.response?.data?.errorMessage || "")
      setErrorMessageCategory(error?.response?.data?.category || "")
      setApiResponse(null)
      setSync(false);
      setApiSync(false);
      setPermissions(null);
      setIsLoadedFirstTime(false)
      setIsFristTimeLoadData(false)
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

  // useEffect(() => {
  //   if (breadcrumbs && breadcrumbs.length > 0 ) {
  //     const last: any = breadcrumbs[breadcrumbs.length - 1];
  //     const previous: any = breadcrumbs[breadcrumbs.length - 2];
  //     const singularLastName = last?.name?.endsWith("s")
  //       ? last.name.slice(0, -1)
  //       : last.name;
  //     setAssociatedtableTitleSingular(singularLastName);
  //     if( componentName!="ticket"){
  //       setTableTitle(
  //         previous?.name ? { last: last, previous: previous } : { last: last }
  //       );
  //       setSingularTableTitle(
  //         previous?.name
  //         ? `${singularLastName} with ${previous?.name}`
  //         : singularLastName
  //       );}else{
  //       const ticketTableTitleSingular = ticketTableTitle.endsWith("s")?ticketTableTitle.slice(0, -1):ticketTableTitle;
  //     setTableTitle(
  //       {last:{name:title}}
  //     );
  //     setSingularTableTitle(
  //       previous?.name
  //         ? `${ticketTableTitleSingular} with ${singularLastName} `
  //         : ticketTableTitleSingular
  //     )
  //   }
  //   }
  // }, [breadcrumbs]);

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
      const param = getTableParam(companyAsMediator, null);
      const apiParams: any = {}
      
      if(paramsObject?.parentObjectTypeId) {
        apiParams.parentObjectTypeId = paramsObject?.parentObjectTypeId;
      } else if (isHome && userData?.info?.objectTypeId && !param?.isPrimaryCompany) {
        apiParams.parentObjectTypeId = userData?.info?.objectTypeId;
      } else if (isHome && userData?.info?.objectTypeId && param?.isPrimaryCompany) {
        apiParams.parentObjectTypeId = "0-2";
      }
      
      apiParams.isPrimaryCompany = param?.isPrimaryCompany;
      apiParams.cache = sync ? false : true;

      const pipelineEndpoint = `api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}`;

      return await Client.Deals.pipelines({
        API_ENDPOINT: pipelineEndpoint,
        param: apiParams,
      });
    },

    onSuccess: async (data: any) => {
      const objectId = isHome ? 'home' : hubspotObjectTypeId
      await setPipelines(data.data);
      const pipeline = await setDefaultPipeline(data, objectId);
      await getData({
        pipeline,
        mPipelines: data.data,
      });
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.errorMessage)
      setErrorMessageCategory(error?.response?.data?.errorCode)
      setPipelines([]);
      setIsLoadedFirstTime(false)
    },
  });

  // useEffect(() => {
  //   if (specPipeLine) {
  //      const objectId = isHome ? 'home' : hubspotObjectTypeId
  //     setSelectedPipeline(pipeLineId);
  //     setIsLoadingHoldData(true);
  //     const routeMenuConfig = {
  //       [objectId]: {
  //         activePipeline: pipeLineId,
  //       },
  //     };
  //     setSelectRouteMenuConfig(routeMenuConfig);
  //     setUrlParam({
  //       filterPropertyName: "hs_pipeline",
  //       filterOperator: "eq",
  //       filterValue: pipeLineId,
  //     });
  //   }
  // }, [specPipeLine]);

  // useEffect(() => {
  //   await setErrorMessage('')
  //   await resetTableParam();
  //   await setApiResponse(null);
  //   await setPageView(null);
  //   // if(!isHome) {
  //     await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  //   // }
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await setErrorMessage('');
  //     await setErrorMessageCategory('');
  //     await resetTableParam();
  //     await setApiResponse(null);
  //     await setPageView(null);

  //     // if(!isHome) {
  //     if (
  //       (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
  //       !defPermissions?.pipeline_id
  //     ) {
  //       await getPipelines();
  //     } else {
  //       getData();
  //     }
  //     // }
  //   };

  //   fetchData();
  // }, []);


  // useEffect( async () => {
  //   // if (sync && errorMessage) {
  //   if (sync) {
  //     await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  //   }
  // }, [sync]);

  useEffect(() => {
    const fetchData = async () => {
      if(!isLoadedUserProfile) return
      if (sync || apiSync) {
        if (
          // (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
          // (!defPermissions?.pipeline_id && !routeDetails?.defPermissions?.pipeline_id && !specPipeLine)
          (routeDetails?.defPermissions?.pipeline_id && !specPipeLine)
        ) {
          await getPipelines();
        } else {
          getData({mPipelines: pipelines});
        }
      }
    };

    fetchData();
  }, [sync, apiSync, hubspotObjectTypeId, isLoadedUserProfile]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if(!isLoadedUserProfile) return
  //     setPage(1);
  //     if (
  //       // (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") &&
  //       (!defPermissions?.pipeline_id && !routeDetails?.defPermissions?.pipeline_id && !specPipeLine)
  //     ) {
  //       await getPipelines();
  //     } else {
  //       await getData();
  //     }
  //   };
  //   if (!isFristTimeLoadData && isHome) fetchData();
  // }, [companyAsMediator, hubspotObjectTypeId, defPermissions, isLoadedUserProfile]);

  // useEffect(() => {
    // if(isLoadingHoldData) getData();
  // }, [selectedPipeline]);

  // useEffect( () => {
  //   setErrorMessage('')
  //   resetTableParam();
  //   setApiResponse(null);
  //   setPageView(null);
  //   // if(!isHome) {
  //     ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  //   // }
  // }, []);

  // useEffect( () => {
  //   // if (sync && errorMessage) {
  //   if (sync) {
  //     ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  //   }
  // }, [sync]);

  // useEffect(() => {
  //     setPage(1);
  //     ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
  // }, [companyAsMediator]);


  const changeTab = async (view: any) => {
    await setLimit(10);
    // if(!isHome) {
      // await ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (!defPermissions?.pipeline_id)) ? getPipelines() : getData();
      await (!specPipeLine) ? getPipelines() : getData();
    // }
  }

  // if (isLoadingAPiData === true) {
  //   return (
  //     <div
  //       className={` ${
  //         hubSpotUserDetails.sideMenu[0].tabName === title ||
  //         componentName === "ticket"
  //           ? "mt-0"
  //           : "mt-[calc(var(--nav-height)-1px)]"
  //       } rounded-md overflow-hidden bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
  //     >
  //       <DashboardTableHeaderSkeleton
  //         hubspotObjectTypeId={hubspotObjectTypeId}
  //         title={title}
  //       />
  //       {view === "BOARD" && activeCardData ? (
  //         <BoardViewSkeleton />
  //       ) : (
  //         <TableSkeleton />
  //       )}
  //     </div>
  //   );
  // }


  // if (isLoadingAPiData === true && isLoadedFirstTime === true) {
  if (isLoadedFirstTime === true && isLoadingAPiData === true) {
    return (
      <div
        className={` ${
          hubSpotUserDetails.sideMenu[0]?.tabName === title ||
          componentName === "ticket"
            ? "mt-0"
            : "mt-[calc(var(--nav-height)-1px)]"
        } rounded-md overflow-hidden bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
      >
        {componentName !== "ticket" &&<DashboardTitleSkeleton />}
        <div className={`${componentName === "ticket" ? "" : "md:mt-4 mt-3 rounded-md overflow-hidden bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2"}`}>
        <DashboardTableHeaderSkeleton/>
        {view === "BOARD" && activeCardData ? (
          <BoardViewSkeleton />
        ) : (
          <TableSkeleton />
        )}
        </div>
      </div>
    );
  }

  if(errorMessage && (errorMessageCategory !== "ACCESS" || errorMessageCategory !== "ACCESS_DENIED")){
    return( 
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px] justify-center gap-4 dark:text-white">
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
        <div className="bg-[var(--sidebar-background-color)] mt-[calc(var(--nav-height)-1px)] dark:bg-dark-300">
          <div className={`bg-cleanWhite dark:bg-dark-200`}>
            <TableDetails
              key={pathname}
              objectId={hubspotObjectTypeId}
              getData={getData}
              currentPage={currentPage}
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
        <div className="bg-[var(--sidebar-background-color)] dark:bg-dark-300" key={pathname}>
          <div className={`dark:bg-dark-200 ${isShowTitle && 'mt-[calc(var(--nav-height)-1px)] pt-3 md:pl-4 md:pt-4 md:pr-3 pl-3 pr-3'} h-[calc(100vh-var(--nav-height))] overflow-x-auto CUSTOM-hide-scrollbar bg-cleanWhite dark:text-white`}>
            <div className="flex relative z-[2] gap-6">
              <div className="flex flex-col gap-2 flex-1">
                {isShowTitle && hubSpotUserDetails?.sideMenu[0]?.tabName != title && (
                  <span className="flex-1">
                    <ol className="flex dark:text-white flex-wrap">
                      {tableTitle &&
                        Object.entries(tableTitle).map(
                          ([key, value]: any, index: any, array: any) => {
                            return (
                              <li key={key} className="flex items-center break-all">
                                <Link
                                  className="text-xl font-semibold text-[#0091AE] capitalize dark:text-white hover:underline"
                                  to={value?.path}
                                >
                                  {/* {getParamHash(
                                    formatCustomObjectLabel(value?.n)
                                  )} */}
                                  <span className="line-clamp-1">
                                    {value?.name}
                                  </span>
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
                      {
                      // subscriptionType != 'FREE' && (
                        !isLoading ? (
                          // `${totalRecord} records`
                          (totalRecord || totalRecord != null) ? `${totalRecord} records` : ""
                        ) : (
                          <div className="h-4 w-20 bg-gray-300 dark:bg-white dark:opacity-20 rounded-sm animate-pulse mr-1 mt-1"></div>
                        )
                      // )
                      }
                    </p>
                    <div className="dark:text-white CUSTOM-words-break">
                      {objectDescription
                        ? <HtmlParser html={DOMPurify.sanitize(objectDescription)} className="ProseMirror p-0" />
                        : ""}
                    </div>
                  </span>
                )}
              </div>
            </div>

            {objectUserProperties && objectUserProperties.length > 0 && 
              <div className="mt-3">
                <HomeCompanyCard
                  key={pathname}
                  portalId={portalId}
                  companyDetailsModalOption={false}
                  propertiesList={objectUserProperties}
                  userData={userData?.response}
                  isLoading={isLoadingFetchUserProfile}
                  isLoadedFirstTime={isLoadedFirstTime}
                  iframePropertyName={objectUserProperties}
                  className={`md:px-0 px-0 md:p-0 pb-0`}
                  usedInDynamicComponent={true}
                  viewStyle={objectUserPropertiesView}
                />
              </div>
            }

            <div className="flex gap-4 w-full overflow-hidden relative">
              {/* Main content container */}
              {hubSpotUserDetails?.sideMenu[0]?.tabName === title &&
              !isLargeScreen &&
              !sidebarRightOpen ? (
                <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
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

              <div className="w-full" key={hubspotObjectTypeId}>
                <DashboardTable
                  isLoadingAPiData={isLoadingAPiData}
                  key={pathname}
                  hubspotObjectTypeId={hubspotObjectTypeId}
                  path={path}
                  title={title == 'Association' ? associatedtableTitleSingular : (title || hubSpotUserDetails?.sideMenu[0]?.label)}
                  tableTitle={
                    singularTableTitle || hubSpotUserDetails.sideMenu[0].label
                  }
                  propertyName={propertyName}
                  showIframe={showIframe}
                  apis={apis}
                  componentName={componentName || "object"}
                  defPermissions={routeDetails?.defPermissions}
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
                  errorMessage={errorMessage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};