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
  setTotalRecord,
  setIsLoading,
}) => {
  const {
    view,
    setView,
    search,
    selectedPipeline,
    setDefaultPipeline,
    getTableParam,
    setSelectedPipeline,
    limit,
    setLimit,
    totalItems,
    setTotalItems,
    numOfPages,
    setNumOfPages,
    resetTableParam,
    setSelectRouteMenuConfig,
    changePipeline,
  } = useTable();

  const [apiResponse, setApiResponse] = useState(null);
  // const [tableData, setTableData] = useState([]);

  // const pageLimit = env.TABLE_PAGE_LIMIT;
  const [urlParam, setUrlParam] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  // const [numOfPages, setNumOfPages] = useState();
  // const [totalItems, setTotalItems] = useState(0);
  // const [currentItems, setCurrentItems] = useState(0);
  // const [itemsPerPage, setItemsPerPage] = useState(pageLimit);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [tableHeader, setTableHeader] = useState([]);
  // const [after, setAfter] = useState("");
  // const [sortConfig, setSortConfig] = useState("-hs_createdate");
  // const [filterPropertyName, setFilterPropertyName] = useState(null);
  // const [filterOperator, setFilterOperator] = useState(null);
  // const [filterValue, setFilterValue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [info, setInfo] = useState(null);
  // const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Pipelines
  const [pipelines, setPipelines] = useState([]);
  // const [activePipeline, setActivePipeline] = useState();

  // added for card view
  const [isLoadingHoldData, setIsLoadingHoldData] = useState(null);
  // const [activeCard, setActiveCard] = useState(null);
  // const [activeCardPrevData, setActivePrevCardData] = useState(null);
  const [activeCardData, setActiveCardData] = useState([]);
  // const [stageDataCount, setStageDataCount] = useState(true);

  const { sync, setSync } = useSync();

  useEffect(() => {
    if (specPipeLine) {
      setSelectedPipeline(pipeLineId);
      setIsLoadingHoldData(true);
      const routeMenuConfig = {
        [hubspotObjectTypeId]: {
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

  //  useEffect(() => {
  //   setNumOfPages(Math.ceil(totalItems / itemsPerPage));
  // }, [totalItems, itemsPerPage, searchTerm]);

  // useEffect(() => {
  //   const hash = location.hash; // Get the hash fragment
  //   const queryIndex = hash.indexOf("?"); // Find the start of the query string in the hash
  //   const queryParams = new URLSearchParams(hash.substring(queryIndex)); // Parse the query string

  //   setFilterPropertyName(queryParams.get("filterPropertyName"));
  //   setFilterOperator(queryParams.get("filterOperator"));
  //   setFilterValue(queryParams.get("filterValue"));
  // }, [location.search]);

  // const mapResponseData = (data) => {
  //   const results = data.data.results.rows || [];
  //   const columns = data.data.results.columns || [];
  //   setTableData(results);
  //   setTotalItems(data.data.total || 0);
  //   setItemsPerPage(results.length > 0 ? itemsPerPage : 0);
  //   setCurrentItems(results.length);
  //   setTableHeader(sortData(columns));
  // };

  // const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  // const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  // const objectTypeId = getParam("objectTypeId");
  // const objectTypeName = getParam("objectTypeName");
  const isPrimaryCompany = getParam("isPrimaryCompany");
  const parentObjectTypeId = getParam("parentObjectTypeId");
  const parentObjectRecordId = getParam("parentObjectRecordId");

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  // Get Pipelines
  const { mutate: getPipelines, isLoadingPipelines } = useMutation({
    mutationKey: ["PipelineData"],
    mutationFn: async () => {
      return await Client.Deals.pipelines({
        API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}`,
        param: {
          cache: sync ? false : true,
        },
      });
    },

    onSuccess: (data) => {
      setPipelines(data.data);
      // // Hey Get HERE //

      // let mFilterValue = "";

      // let routeMenuConfigs = getRouteMenuConfig();

      // if (
      //   routeMenuConfigs &&
      //   routeMenuConfigs.hasOwnProperty(hubspotObjectTypeId) &&
      //   routeMenuConfigs[hubspotObjectTypeId].activePipeline
      // ) {
      //   mFilterValue = routeMenuConfigs[hubspotObjectTypeId].activePipeline;
      //   setActivePipeline(routeMenuConfigs[hubspotObjectTypeId].activePipeline);
      // } else {
      //   if (activeCard && !activePipeline) {
      //     mFilterValue = pipelineSingle.pipelineId;
      //     setActivePipeline(pipelineSingle.pipelineId);

      //     const routeMenuConfig = {
      //       [hubspotObjectTypeId]: {
      //         activePipeline: pipelineSingle.pipelineId,
      //       },
      //     };
      //     setSelectRouteMenuConfig(routeMenuConfig);
      //   } else {
      //     mFilterValue =
      //       data.data.length === 1 ? pipelineSingle.pipelineId : activePipeline;
      //   }
      // }

      setDefaultPipeline(data, hubspotObjectTypeId);

      // if (activeCard || activePipeline) {
      //   // mFilterValue = filterValue || pipelineSingle.pipelineId
      //   setFilterPropertyName("hs_pipeline");
      //   setFilterOperator("eq");
      // }
      // setFilterValue(mFilterValue);
      getData({
        filterPropertyName: "hs_pipeline",
        filterOperator: "eq",
        filterValue: selectedPipeline,
      });
    },
    onError: () => {
      setPipelines([]);
      setIsLoadingHoldData(false);
    },
  });

  // Get List And Card Data
  const { mutate: getData, isLoading } = useMutation({
    mutationKey: ["TableData"],
    mutationFn: async (props) => {
      // const param = {
      //   limit: itemsPerPage || pageLimit,
      //   page: currentPage,
      //   ...(after && after.length > 0 && { after }),
      //   sort: sortConfig,
      //   search: searchTerm,
      //   filterPropertyName: props?.filterPropertyName || filterPropertyName,
      //   filterOperator: props?.filterOperator || filterOperator,
      //   filterValue:
      //     props?.filterValue || filterValue || (specPipeLine ? pipeLineId : ""),
      //   cache: sync ? false : true,
      //   isPrimaryCompany: companyAsMediator ? companyAsMediator : false,
      //   view: activeCard ? "BOARD" : "LIST",
      // };
      const param = getTableParam(companyAsMediator);
      if (companyAsMediator) param.mediatorObjectTypeId = "0-2";
      if (defPermissions?.pipeline_id && componentName === "ticket")
        param.filterValue = defPermissions?.pipeline_id;

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

    onSuccess: (data) => {
      setApiResponse(data);

      setSync(false);
      if (data.statusCode === "200") {
        // if (currentPage === 1) setGridData('reset', [])
        setInfo(data.info)

        const totalData = data?.data?.total;
        setTotalItems(totalData || 0);
        if (componentName != "ticket") {
          setIsLoading(false);
        }
        setTotalRecord(data?.data?.total || totalData || 0);
        if (view === "BOARD") {
          setActiveCardData(data?.data);
        } else {
          // const totalData = data?.data?.total;
          // setTotalItems(totalData || 0);
          // setItemsPerPage(data?.data?.total > 0 ? itemsPerPage : 0);
          // const ItemsPerPage = totalData > 0 ? limit : 0
          const ItemsPerPage = limit;
          setLimit(ItemsPerPage);
          setNumOfPages(Math.ceil(totalData / ItemsPerPage));
        }
        // setTotalRecord(data?.data?.total || 0);
        if (defPermissions === null) {
          setPermissions(data?.configurations[componentName]);
        } else {
          setPermissions(data?.configurations["object"]);
        }
      } else {
        setPermissions(null);
      }
      setIsLoadingHoldData(false);
    },
    onError: () => {
      setSync(false);
      setPermissions(null);
      setIsLoadingHoldData(false);
      if (componentName != "ticket") {
        setIsLoading(false);
      }
    },
  });

  // Handle Filter Start
  // const handleSort = (column) => {
  //   let newSortConfig = column;
  //   if (sortConfig === column) {
  //     newSortConfig = `-${column}`; // Toggle to descending if the same column is clicked again
  //   } else if (sortConfig === `-${column}`) {
  //     newSortConfig = column; // Toggle back to ascending if clicked again
  //   }
  //   setSortConfig(newSortConfig);
  //   getData();
  // };

  // const handlePageChange = async (page) => {
  //   await setCurrentPage(page);
  //   await setAfter((page - 1) * itemsPerPage);
  //   getData();
  // };

  // const handleCardPageChange = async (page) => {
  //   await setCurrentPage(page);
  //   getData();
  // };

  // useEffect(() => {
  //   if (activeCardPrevData) {
  //     setActiveCardData((prevData) => {
  //       if (!prevData) return activeCardPrevData; // If no previous data, set directly

  //       // Create a Set of unique identifiers (hs_object_id + hs_pipeline_stage.value)
  //       const existingKeys = new Set(
  //         prevData.map(
  //           (item) => `${item.hs_object_id}-${item.hs_pipeline_stage?.value}`
  //         )
  //       );

  //       // Filter out duplicates from activeCardPrevData
  //       const newData = activeCardPrevData.filter(
  //         (item) =>
  //           !existingKeys.has(
  //             `${item.hs_object_id}-${item.hs_pipeline_stage?.value}`
  //           )
  //       );

  //       setHasMoreData(newData.length > 0);

  //       // Append only new unique data
  //       return [...prevData, ...newData];
  //     });
  //   }
  // }, [activeCardPrevData]);

  // const setDialogData = (data) => {
  //   setModalData(data);
  //   setOpenModal(true);
  // };

  const handleRowHover = (row) => {
    setHoverRow(row);
  };

  const handleSearch = () => {
    // if (!searchTerm.trim()) return;
    // getData({
    //   filterPropertyName: "hs_pipeline",
    //   filterOperator: "eq",
    //   filterValue: activePipeline || filterValue,
    // });
    getData();
  };
  // Handle Filter End

  // Start Cookie RouteMenuConfig
  // const setSelectRouteMenuConfig = (routeMenuConfig) => {
  //   let routeMenuConfigs = getRouteMenuConfig();

  //   Object.keys(routeMenuConfig).forEach((key) => {
  //     if (!routeMenuConfigs) routeMenuConfigs = {};
  //     if (routeMenuConfigs && !routeMenuConfigs.hasOwnProperty(key)) {
  //       routeMenuConfigs[key] = routeMenuConfig[key];
  //     } else {
  //       if (routeMenuConfig[key]?.activeTab)
  //         routeMenuConfigs[key].activeTab = routeMenuConfig[key].activeTab;
  //       if (routeMenuConfig[key]?.activePipeline) {
  //         routeMenuConfigs[key].activePipeline =
  //           routeMenuConfig[key].activePipeline;
  //       } else {
  //         routeMenuConfigs[key].activePipeline = "";
  //       }
  //     }
  //   });
  //   setRouteMenuConfig(routeMenuConfigs);
  // };

  const setActiveTab = (selectView) => {
    setIsLoadingHoldData(true);
    // setActiveCard(status);
    const routeMenuConfig = {
      [hubspotObjectTypeId]: {
        activeTab: selectView === "BOARD" ? "grid" : "list",
      },
    };
    setSelectRouteMenuConfig(routeMenuConfig);
    setView(selectView);
  };

  useEffect(() => {
    let routeMenuConfigs = getRouteMenuConfig();

    if (
      routeMenuConfigs &&
      routeMenuConfigs.hasOwnProperty(hubspotObjectTypeId)
    ) {
      const activeTab = routeMenuConfigs[hubspotObjectTypeId].activeTab;
      setIsLoadingHoldData(true);
      // setActiveCard(activeTab === "grid" ? true : false);
      setView(activeTab === "grid" ? "BOARD" : "LIST");
      // setActivePipeline(routeMenuConfigs[hubspotObjectTypeId].activePipeline);
      setSelectedPipeline(routeMenuConfigs[hubspotObjectTypeId].activePipeline);
    } else {
      setIsLoadingHoldData(true);
      // setActiveCard(false);
      setView("LIST");
    }
  }, []);
  // End Cookie RouteMenuConfig

  // CHange Pipeline
  const handelChangePipeline = async (pipeLineId) => {
    // setCurrentPage(1);
    // let filterValue = "";
    // if (pipeLineId) {
    //   const pipelineSingle = pipelines.find(
    //     (pipeline) => pipeline.pipelineId === pipeLineId
    //   );
    //   setFilterPropertyName("hs_pipeline");
    //   setFilterOperator("eq");
    //   setFilterValue(pipelineSingle.pipelineId);
    //   setActivePipeline(pipelineSingle.pipelineId);
    //   filterValue = pipelineSingle.pipelineId;
    // } else {
    //   setFilterPropertyName(null);
    //   setFilterOperator(null);
    //   setFilterValue(null);
    //   setActivePipeline(null);
    // }
    // const routeMenuConfig = {
    //   [hubspotObjectTypeId]: {
    //     activePipeline: pipeLineId,
    //   },
    // };
    // setSelectRouteMenuConfig(routeMenuConfig);
    // getData({
    //   filterPropertyName: "hs_pipeline",
    //   filterOperator: "eq",
    //   filterValue: filterValue,
    // });
    // changePipeline(hubspotObjectTypeId, pipelines, pipeLineId);
    // getData({
    //   filterPropertyName: "hs_pipeline",
    //   filterOperator: "eq",
    //   filterValue: pipeLineId,
    // });
  };

  // Initial Call Pipeline
  // useEffect(() => {
  //   if (activeCard != null) {
  //     getPipelines();
  //   }
  // }, [activeCard]);

  useEffect(() => {
    if (view != null) {
      getPipelines();
      setLimit(pageLimit);
    }
  }, [view]);

  useEffect(() => {
    if (sync) {
      // handelChangePipeline();
      getPipelines();
      // getData()
    }
  }, [sync]);

  useEffect(() => {
    resetTableParam();
  }, []);

  useEffect(() => {
    if (!defPermissions?.pipeline_id) {
      getPipelines();
    }
  }, [selectedPipeline]);

  if (isLoadingHoldData === true) {
    return (
      <div
        className={` ${
          hubSpotUserDetails.sideMenu[0].tabName === title ||
          componentName === "ticket"
            ? "mt-0"
            : "md:mt-4 mt-3"
        } rounded-md overflow-hidden mt-2 bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
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

  return (
    <div
      className={` ${
        hubSpotUserDetails.sideMenu[0].tabName === title ||
        componentName === "ticket"
          ? "mt-0"
          : "md:mt-4 mt-3"
      } rounded-md overflow-hidden mt-2 bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
    >
      <DashboardTableHeader
        title={title}
        componentName={componentName}
        permissions={permissions}
        hubspotObjectTypeId={hubspotObjectTypeId}
        // activePipeline={activePipeline}
        view={view}
        setActiveTab={setActiveTab}
        // searchTerm={searchTerm}
        handelChangePipeline={handelChangePipeline}
        pipelines={pipelines}
        // setSearchTerm={setSearchTerm}
        // setCurrentPage={setCurrentPage}
        // setItemsPerPage={setItemsPerPage}
        handleSearch={handleSearch}
        setShowAddDialog={setShowAddDialog}
        // pageLimit={pageLimit}
        defPermissions={defPermissions}
        specPipeLine={specPipeLine}
      />

      {/* {isLoading &&
        (view === "BOARD" ? (
          !activeCardData ? (
            <BoardViewSkeleton />
          ) : null
        ) : (
          <TableSkeleton />
        ))}
         */}

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
            // getTrelloCardsData={getTrelloCardsData}
            activeCardData={activeCardData}
            pipelines={pipelines}
            // activePipeline={activePipeline}
            isLoadingPipelines={isLoadingPipelines}
            urlParam={urlParam}
            companyAsMediator={companyAsMediator}
            // handleCardPageChange={handleCardPageChange}
            getData={getData}
            // setAfter={setAfter}
            // currentPage={currentPage}
            // setCurrentPage={setCurrentPage}
            // setItemsPerPage={setItemsPerPage}
            // itemsPerPage={itemsPerPage}
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
          // currentPage={currentPage}
          // setCurrentPage={setCurrentPage}
          // sortConfig={sortConfig}
          // setSortConfig={setSortConfig}
          // setAfter={setAfter}
          // itemsPerPage={itemsPerPage}
          // setItemsPerPage={setItemsPerPage}
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
