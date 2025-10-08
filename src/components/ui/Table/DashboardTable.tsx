import { useState } from 'react';
import { env } from "@/env";
import { getParam } from '@/utils/param';
import { getPortal } from '@/data/client/auth-utils';
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { DashboardTableHeader } from '@/components/ui/Table/DashboardTableHeader'
import { DashboardTableData } from '@/components/ui/Table/DashboardTableData'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyMessageCard } from '@/components/ui/EmptyMessageCard'
import { BoardView } from '@/components/ui/Board/BoardView'
import { useTable } from '@/state/use-table';
import { DashboardTableForm } from './DashboardTableForm';
import { Button } from '../Button';
import { useAuth } from '@/state/use-auth';
import { CautionCircle } from '@/assets/icons/CautionCircle';
import { DashboardTableHeaderSkeleton } from '../skeletons/DashboardTableHeaderSkeleton';
import { BoardViewSkeleton } from '../skeletons/BoardViewSkeleton';
import { TableSkeleton } from '../skeletons/TableSkeleton';
import { useUpdateLink } from '@/utils/GenerateUrl';

export const formatKey = (key: any) => {
  return (key && typeof key === "string") ? key?.replace(/_/g, " ").replace(/\b\w/g, (l: any) => l.toUpperCase()) : "";
};

const priorityOrder: any = {
  email: 3,
  description: 4,
  city: 5,
  role: 6,
};

const getPriority = (key: any) => {
  const keyLower = key.toLowerCase();
  if (keyLower.includes("job_name")) {
    return 1;
  } else if (keyLower.includes("name")) {
    return 2;
  }

  const extractedKey = key.split(".").pop().toLowerCase();
  return priorityOrder[extractedKey] || Number.MAX_VALUE;
};

export const sortedHeaders = (headers: any) => {
  return headers.sort((a: any, b: any) => getPriority(a.name) - getPriority(b.name));
};

export const DashboardTable: any = ({
  isLoadingAPiData,
  hubspotObjectTypeId,
  path,
  inputValue,
  title,
  tableTitle,
  apis,
  detailsView = true,
  editView = false,
  viewName = "",
  detailsUrl = "",
  componentName,
  defPermissions = null,
  companyAsMediator,
  pipeLineId,
  specPipeLine,
  getData,
  states,
  isHome,
  pipelines,
  isLoadingPipelines = false,
  changeTab = null,
  errorMessage
}: any) => {
  const {
    setLimit,
    numOfPages,
    view,
    setView,
    // selectedPipeline,
    // setSelectedPipeline,
    // setDefaultPipeline,
    // setSelectRouteMenuConfig,
    // resetTableParam,
  } : any = useTable();

  const {
    isLoading,
    urlParam,
    setUrlParam,
    apiResponse,
    info,
    activeCardData,
    permissions,
    isLoadingHoldData,
    setIsLoadingHoldData,
  } = states;

  // const [apiResponse, setApiResponse] = useState(null);
  // const [urlParam, setUrlParam] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  // const [permissions, setPermissions] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  // const [info, setInfo] = useState(null);
  // Pipelines
  // const [pipelines, setPipelines] = useState([]);
  // added for card view
  // const [isLoadingHoldData, setIsLoadingHoldData] = useState(null);
  // const [activeCardData, setActiveCardData] = useState([]);

  // const { sync, setSync } = useSync();

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

  const isPrimaryCompany = getParam("isPrimaryCompany");
  const parentObjectTypeId = getParam("parentObjectTypeId");
  const parentObjectRecordId = getParam("parentObjectRecordId");

  const { subscriptionType }: any = useAuth();

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  // // Get Pipelines
  // const { mutate: getPipelines, isLoadingPipelines } = useMutation({
  //   mutationKey: ["PipelineData"],
  //   mutationFn: async () => {
  //     return await Client.Deals.pipelines({
  //       API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}`,
  //       param: {
  //         cache: sync ? false : true,
  //       },
  //     });
  //   },

  //   onSuccess: async (data) => {
  //     const objectId = isHome ? 'home' : hubspotObjectTypeId
  //     await setPipelines(data.data);
  //     await setDefaultPipeline(data, objectId);
  //     await getData();
  //   },
  //   onError: () => {
  //     setPipelines([]);
  //   },
  // });


  const handleRowHover = (row: any) => {
    setHoverRow(row);
  };

  const handleSearch = () => {
    // console.log("handleSearch", true)
    getData();
  };

  const {updateLink} = useUpdateLink();
  
  const setActiveTab = (selectView: any) => {
    const objectId = isHome ? 'home' : hubspotObjectTypeId
    setIsLoadingHoldData(true);
    // const routeMenuConfig = {
    //   [objectId]: {
    //     activeTab: selectView === "BOARD" ? "grid" : "list",
    //   },
    // };
    updateLink({v: selectView})
    // setSelectRouteMenuConfig(routeMenuConfig);
    setView(selectView);
    changeTab(selectView)
  };

  // useEffect(() => {
  //   let routeMenuConfigs = getRouteMenuConfig();
  //   const objectId = isHome ? 'home' : hubspotObjectTypeId

  //   if (
  //     routeMenuConfigs &&
  //     routeMenuConfigs.hasOwnProperty(objectId)
  //   ) {
  //     const activeTab = routeMenuConfigs[objectId].activeTab;
  //     setIsLoadingHoldData(true);
  //     setView(activeTab === "grid" ? "BOARD" : "LIST");
  //     setSelectedPipeline(routeMenuConfigs[objectId].activePipeline);
  //   } else {
  //     setIsLoadingHoldData(true);
  //     setView("LIST");
  //   }
  // }, []);
  // End Cookie RouteMenuConfig

  // CHange Pipeline
  const handelChangePipeline = async (pipeLineId: any) => {
    // console.log("handelChangePipeline", handelChangePipeline)
    getData();
  };
  
  // useEffect(async () => {
  //   if (view != null) {
  //     await setLimit(pageLimit);
  //     await hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5" ? getPipelines() : getData();
  //   }
  // }, [view]);

  // useEffect( async () => {
  //   if (sync) {
  //     await hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5" ? getPipelines() : getData();
  //   }
  // }, [sync]);

  // if (isLoadingHoldData === true) {
  //   return (
  //     <div
  //       className={` ${
  //         hubSpotUserDetails.sideMenu[0].tabName === title ||
  //         componentName === "ticket"
  //           ? "mt-0"
  //           : "md:mt-4 mt-3"
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

  return (
    <div
      className={` ${
        hubSpotUserDetails.sideMenu[0].tabName === title ||
        componentName === "ticket"
          ? "mt-0"
          : "md:mt-4 mt-3"
      } rounded-md overflow-hidden bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
    >
      <DashboardTableHeader
        key={path}
        title={title}
        componentName={componentName}
        permissions={permissions}
        hubspotObjectTypeId={hubspotObjectTypeId}
        view={view}
        setActiveTab={setActiveTab}
        handelChangePipeline={handelChangePipeline}
        pipelines={pipelines}
        handleSearch={handleSearch}
        setShowAddDialog={setShowAddDialog}
        // pageLimit={pageLimit}
        defPermissions={defPermissions}
        specPipeLine={specPipeLine}
        isHome={isHome}
      />

      {errorMessage ?
        <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
          <span className="text-yellow-600">
            <CautionCircle/>
          </span>
          {errorMessage}
        </div>
        :
        <>
          {!isLoading && ((subscriptionType === "FREE" && apiResponse?.data?.total === 0) || (apiResponse?.data?.total === 0 || apiResponse?.data?.total == null)) && (
              <div className="text-center pb-4">
                <EmptyMessageCard
                  name={
                    hubSpotUserDetails.sideMenu[0].tabName === title
                      ? "item"
                      : title
                  }
                />
                {permissions && permissions.association && (
                  <p className="text-secondary text-base md:text-2xl dark:text-gray-300 mt-3">
                    {permissions.associationMessage}
                  </p>
                )}
              </div>
            )}

          {view === "BOARD" &&
            (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
              <BoardView
                key={path}
                title={title}
                hubspotObjectTypeId={hubspotObjectTypeId}
                activeCardData={activeCardData}
                pipelines={pipelines}
                isLoadingPipelines={isLoadingPipelines}
                urlParam={urlParam}
                companyAsMediator={companyAsMediator}
                getData={getData}
                isLoading={isLoading}
                path={path}
                viewName={viewName}
                detailsUrl={detailsUrl}
                defPermissions={defPermissions}
              />
            )}

          {view === "LIST" && ((apiResponse?.data?.total > 0) || (subscriptionType === "FREE" && apiResponse?.data?.total != 0)) && (
            <DashboardTableData
              key={path}
              title={title}
              getData={getData}
              apiResponse={apiResponse}
              numOfPages={numOfPages}
              viewName={viewName}
              companyAsMediator={companyAsMediator}
              path={path}
              hubspotObjectTypeId={hubspotObjectTypeId}
              detailsView={detailsView}
              hoverRow={hoverRow}
              urlParam={urlParam}
              handleRowHover={handleRowHover}
              componentName={componentName}
              detailsUrl={detailsUrl}
              apis={apis}
            />
          )}

          {env.VITE_DATA_SOURCE_SET === true && (
            <Dialog
              open={openModal}
              onClose={setOpenModal}
              className="bg-cleanWhite dark:bg-dark-200  rounded-md sm:min-w-[430px]"
            >
              <div className="rounded-md flex-col gap-6 flex">
                <div className="text-start text-xl font-semibold">Details</div>
                {modalData &&
                  Object.keys(modalData).map((key) => (
                    <div
                      key={key}
                      className="flex justify-between items-center w-full gap-1 border-b"
                    >
                      {key !== "iframe_file" && key !== "id" ? (
                        <div className="w-full">
                          <div className="text-start dark:text-white">
                            {formatKey(key)} -
                          </div>
                          <div className="dark:text-white text-end">
                            {modalData[key]}
                          </div>
                        </div>
                      ) : key === "iframe_file" ? (
                        <div>{modalData[key]?.replace(";", ",")}</div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                <div className="pt-3 text-end">
                  <Button onClick={() => setOpenModal(false)}>Close</Button>
                </div>
              </div>
            </Dialog>
          )}
          {showAddDialog && (
            <DashboardTableForm
              componentName={componentName}
              type={parentObjectTypeId ? "association_new" : ""}
              openModal={showAddDialog}
              setOpenModal={setShowAddDialog}
              title={tableTitle}
              path={path}
              portalId={portalId}
              hubspotObjectTypeId={hubspotObjectTypeId}
              apis={apis}
              refetch={getData}
              companyAsMediator={companyAsMediator || isPrimaryCompany}
              urlParam={urlParam}
              parentObjectTypeId={parentObjectTypeId}
              parentObjectRowId={parentObjectRecordId}
              info={info}
              specPipeLine={specPipeLine}
              pipeLineId={pipeLineId}
            />
          )}
          {showEditDialog && (
            <DashboardTableForm
              openModal={showEditDialog}
              setOpenModal={setShowEditDialog}
              title={tableTitle}
              path={path}
              portalId={portalId}
              hubspotObjectTypeId={hubspotObjectTypeId}
              apis={apis}
              showEditData={showEditData}
              refetch={getData}
              urlParam={urlParam}
            />
          )}
        </>
      }
    </div>
  );
};
