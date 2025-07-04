const formatKey = (key) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const priorityOrder = {
  email: 3,
  description: 4,
  city: 5,
  role: 6,
};

const getPriority = (key) => {
  const keyLower = key.toLowerCase();
  if (keyLower.includes("job_name")) {
    return 1;
  } else if (keyLower.includes("name")) {
    return 2;
  }

  const extractedKey = key.split(".").pop().toLowerCase();
  return priorityOrder[extractedKey] || Number.MAX_VALUE;
};

const sortedHeaders = (headers) => {
  return headers.sort((a, b) => getPriority(a.name) - getPriority(b.name));
};

const DashboardTable = ({
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
}) => {
  const {
    setLimit,
    numOfPages,
    view,
    setView,
    selectedPipeline,
    setSelectedPipeline,
    setDefaultPipeline,
    setSelectRouteMenuConfig,
    resetTableParam,
  } = useTable();

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

  const { sync, setSync } = useSync();

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

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
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


  const handleRowHover = (row) => {
    setHoverRow(row);
  };

  const handleSearch = () => {
    // console.log("handleSearch", true)
    getData();
  };

  const setActiveTab = (selectView) => {
    const objectId = isHome ? 'home' : hubspotObjectTypeId
    setIsLoadingHoldData(true);
    const routeMenuConfig = {
      [objectId]: {
        activeTab: selectView === "BOARD" ? "grid" : "list",
      },
    };
    setSelectRouteMenuConfig(routeMenuConfig);
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
  const handelChangePipeline = async (pipeLineId) => {
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
      {!isLoading &&
        !view != "BOARD" &&
        (apiResponse?.data?.total === 0 ||
          apiResponse?.data?.total == null) && (
          <div className="text-center pb-4">
            <EmptyMessageCard
              name={
                hubSpotUserDetails.sideMenu[0].tabName === title
                  ? "item"
                  : title
              }
            />
            {permissions && permissions.association && (
              <p className="text-secondary text-base md:text-2xl dark:text-gray-300mt-3">
                {permissions.associationMessage}
              </p>
            )}
          </div>
        )}

      {view === "BOARD" &&
        (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
          <BoardView
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

      {!isLoading && view === "LIST" && apiResponse?.data?.total > 0 && (
        <DashboardTableData
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

      {env.DATA_SOURCE_SET === true && (
        <Dialog
          open={openModal}
          onClose={setOpenModal}
          className="bg-cleanWhite dark:bg-dark-200  rounded-md sm:min-w-[430px]"
        >
          <div className="rounded-md flex-col gap-6 flex">
            <h3 className="text-start text-xl font-semibold">Details</h3>
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
                    <div>Hello {modalData[key].replace(";", ",")}</div>
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
        />
      )}
      {showEditDialog && (
        <DashboardTableEditForm
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
    </div>
  );
};

DashboardTable.propTypes = {
  hubspotObjectTypeId: PropTypes.string.isRequired, // or PropTypes.number
  path: PropTypes.string,
  inputValue: PropTypes.any,
  title: PropTypes.string,
  tableTitle: PropTypes.string,
  apis: PropTypes.object,
  detailsView: PropTypes.bool,
  editView: PropTypes.bool,
  viewName: PropTypes.string,
  detailsUrl: PropTypes.string,
  componentName: PropTypes.string,
  defPermissions: PropTypes.any,
  companyAsMediator: PropTypes.bool,
  pipeLineId: PropTypes.string,
  specPipeLine: PropTypes.any,
  getData: PropTypes.func,
  states: PropTypes.object,
  pipelines: PropTypes.any,
  changeTab: PropTypes.any,
};