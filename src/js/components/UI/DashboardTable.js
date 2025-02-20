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
}) => {
  const [urlParam, setUrlParam] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  // const { BrowserRouter, Route, Switch, withRouter } = window.ReactRouterDOM;
  const [tableData, setTableData] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  // const [currentTableData, setCurrentTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeader, setTableHeader] = useState([]);
  const [after, setAfter] = useState("");
  const [sortConfig, setSortConfig] = useState("-hs_createdate");
  const [filterPropertyName, setFilterPropertyName] = useState(null);
  const [filterOperator, setFilterOperator] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const [pipelines, setPipelines] = useState([]);
  const [activePipeline, setActivePipeline] = useState();

  // added for card view
  const [activeCard, setActiveCard] = useState(false);
  const [activeCardPrevData, setActivePrevCardData] = useState(null);
  const [activeCardData, setActiveCardData] = useState([]);
  const [view, setView] = useState('list');
  const [hasMoreData, setHasMoreData] = useState(true);

  // const numOfPages = Math.ceil(totalItems / itemsPerPage);
  const { sync, setSync } = useSync();

  const { me } = useMe();

  useEffect(() => {
    setNumOfPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage, searchTerm]);

  useEffect(() => {
    const hash = location.hash; // Get the hash fragment
    const queryIndex = hash.indexOf("?"); // Find the start of the query string in the hash
    const queryParams = new URLSearchParams(hash.substring(queryIndex)); // Parse the query string

    setFilterPropertyName(queryParams.get("filterPropertyName"));
    setFilterOperator(queryParams.get("filterOperator"));
    setFilterValue(queryParams.get("filterValue"));
  }, [location.search]);

  const mapResponseData = (data) => {
    const results = data.data.results.rows || [];
    const columns = data.data.results.columns || [];
    setTableData(results);
    setTotalItems(data.data.total || 0);
    setItemsPerPage(results.length > 0 ? itemsPerPage : 0);
    setCurrentItems(results.length);
    setTableHeader(sortData(columns));
  };

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  const parentObjectTypeName = getParam("parentObjectTypeName");
  const objectTypeId = getParam("objectTypeId");
  const objectTypeName = getParam("objectTypeName");
  const isPrimaryCompany = getParam("isPrimaryCompany");
  const parentObjectTypeId = getParam("parentObjectTypeId");
  const parentObjectRecordId = getParam("parentObjectRecordId");

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  // Get Pipelines
  const {
    mutate: getPipelines,
    isLoadingPipelines,
  } = useMutation({
    mutationKey: ["PipelineData"],
    mutationFn: async () => {
      return await Client.Deals.pipelines({
        API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}`,
        param: {
          cache: sync ? false : true,
        }
      });
    },

    onSuccess: (data) => {
      setPipelines(data.data);
      // // Hey Get HERE //
      const pipelineSingle = data.data.find(
        (pipeline) => pipeline.pipelineId === data.data[0].pipelineId
      );

      let filterValue = "";

      let routeMenuConfigs = getRouteMenuConfig();
      
      if (routeMenuConfigs && routeMenuConfigs.hasOwnProperty(hubspotObjectTypeId) && routeMenuConfigs[hubspotObjectTypeId].activePipeline) {
        setActivePipeline(routeMenuConfigs[hubspotObjectTypeId].activePipeline);
      } else {

        if (activeCard && !activePipeline) {
          filterValue = pipelineSingle.pipelineId;
          setActivePipeline(pipelineSingle.pipelineId);

          const routeMenuConfig = {
            [hubspotObjectTypeId] : {
              activePipeline: pipelineSingle.pipelineId,
            }
          }
          setSelectRouteMenuConfig(routeMenuConfig)
          
        } else {
          filterValue = activePipeline;

        }
      }

      if (activeCard || activePipeline) {
        setFilterPropertyName('hs_pipeline')
        setFilterOperator('eq')
        setFilterValue(pipelineSingle.pipelineId)
      }
      getData({
        filterPropertyName: 'hs_pipeline',
        filterOperator: 'eq',
        filterValue: filterValue
      });
    },
    onError: () => {
      setPipelines([]);
    },
  });

  // Get List And Card Data
  const {
    mutate: getData,
    isLoading,
  } = useMutation({
    mutationKey: [
      "TableData",
    ],
    mutationFn: async (props) => {
      const param = {
        limit: itemsPerPage || 10,
        page: currentPage,
        ...(after && after.length > 0 && { after }),
        sort: sortConfig,
        search: searchTerm,
        filterPropertyName: props?.filterPropertyName || filterPropertyName,
        filterOperator: props?.filterOperator || filterOperator,
        filterValue: props?.filterValue || filterValue || (specPipeLine ? pipeLineId : ''),
        cache: sync ? false : true,
        isPrimaryCompany: companyAsMediator ? companyAsMediator : false,
        view: activeCard ? 'card' : 'list',
      }
      if (companyAsMediator) param.mediatorObjectTypeId = '0-2'

      const API_ENDPOINT = removeAllParams(apis.tableAPI)

      setUrlParam(param)
      return await Client.objects.all({
        API_ENDPOINT: API_ENDPOINT,
        param: updateParamsFromUrl(apis.tableAPI, param)
      });
    },

    onSuccess: (data) => {
      setSync(false);
      if (data.statusCode === "200") {
        if (activeCard) {
          setActivePrevCardData(data?.data?.results?.rows)
        } else {
          mapResponseData(data);
          if (defPermissions === null) {
            setPermissions(data.configurations[componentName]);
          } else {
            setPermissions(data.configurations["object"]);
          }
        }
      } else {
        setPermissions(null);
      }
    },
    onError: () => {
      setSync(false);
      setTableData([]);
      setPermissions(null);
    },
  });

  // Handle Filter Start
  const handleSort = (column) => {
    let newSortConfig = column;
    if (sortConfig === column) {
      newSortConfig = `-${column}`; // Toggle to descending if the same column is clicked again
    } else if (sortConfig === `-${column}`) {
      newSortConfig = column; // Toggle back to ascending if clicked again
    }
    setSortConfig(newSortConfig);
    getData();
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    setAfter((page - 1) * itemsPerPage);
    await wait(100);
    getData();
  };

  const handleCardPageChange = async (page) => {
    setCurrentPage(page);
    await wait(100);
    getData();
  };
  // Handle Filter End

  useEffect(() => {
    if (activeCardPrevData) {
      setActiveCardData((prevData) => {
        if (!prevData) return activeCardPrevData; // If no previous data, set directly
  
        // Create a Set of unique identifiers (hs_object_id + hs_pipeline_stage.value)
        const existingKeys = new Set(
          prevData.map(item => `${item.hs_object_id}-${item.hs_pipeline_stage?.value}`)
        );
  
        // Filter out duplicates from activeCardPrevData
        const newData = activeCardPrevData.filter(
          item => !existingKeys.has(`${item.hs_object_id}-${item.hs_pipeline_stage?.value}`)
        );

        setHasMoreData(newData.length > 0);
  
        // Append only new unique data
        return [...prevData, ...newData];
      });
    }
  }, [activeCardPrevData]);
  
  // const setDialogData = (data) => {
  //   setModalData(data);
  //   setOpenModal(true);
  // };

  const handleRowHover = (row) => {
    setHoverRow(row);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    getData({
      filterPropertyName: 'hs_pipeline',
      filterOperator: 'eq',
      filterValue: filterValue
    });
  };

  useEffect(() => {
    if (searchTerm === "") {
      getData();
      setItemsPerPage(10);
    }
  }, [searchTerm]);

  // Start Cookie RouteMenuConfig
  const setSelectRouteMenuConfig = (routeMenuConfig) => {
    let routeMenuConfigs = getRouteMenuConfig();

    Object.keys(routeMenuConfig).forEach((key) => {
      if(!routeMenuConfigs) routeMenuConfigs = {}; 
      if (routeMenuConfigs && !routeMenuConfigs.hasOwnProperty(key)) {
        routeMenuConfigs[key] = routeMenuConfig[key];
      } else {
        if(routeMenuConfig[key]?.activeTab) routeMenuConfigs[key].activeTab = routeMenuConfig[key].activeTab;
        if(routeMenuConfig[key]?.activePipeline) routeMenuConfigs[key].activePipeline = routeMenuConfig[key].activePipeline;
      }
    });

    setRouteMenuConfig(routeMenuConfigs)
  }

  const setActiveTab = (status) => {
    setActiveCard(status)
    const routeMenuConfig = {
      [hubspotObjectTypeId] : {
        activeTab: status ? 'grid' : 'list',
      }
    }
    setSelectRouteMenuConfig(routeMenuConfig)
  }

  useEffect(() => {
    let routeMenuConfigs = getRouteMenuConfig();
   
    if (routeMenuConfigs && routeMenuConfigs.hasOwnProperty(hubspotObjectTypeId)) {
      const activeTab = routeMenuConfigs[hubspotObjectTypeId].activeTab
      setActiveCard(activeTab === 'grid' ? true : false)
    } else {
      setActiveCard(false)
    }

  }, []);
  // End Cookie RouteMenuConfig

  // CHange Pipeline
  const handelChangePipeline = (pipeLineId) => {
    let filterValue = "";
    if (pipeLineId) {
      const pipelineSingle = pipelines.find(
        (pipeline) => pipeline.pipelineId === pipeLineId
      );
      setFilterPropertyName('hs_pipeline')
      setFilterOperator('eq')
      setFilterValue(pipelineSingle.pipelineId)
      setActivePipeline(pipelineSingle.pipelineId);
      filterValue = pipelineSingle.pipelineId

      const routeMenuConfig = {
        [hubspotObjectTypeId] : {
          activePipeline: pipelineSingle.pipelineId,
        }
      }
      setSelectRouteMenuConfig(routeMenuConfig)

    } else {
      setFilterPropertyName(null)
      setFilterOperator(null)
      setFilterValue(null)
      setActivePipeline(null);

      const routeMenuConfig = {
        [hubspotObjectTypeId] : {
          activePipeline: null,
        }
      }
      setSelectRouteMenuConfig(routeMenuConfig)
    }
 
    getData({
      filterPropertyName: 'hs_pipeline',
      filterOperator: 'eq',
      filterValue: filterValue
    });
  }

  // Initial Call Pipeline
  useEffect(() => {
    getPipelines();
  }, [activeCard]);

  // If click sync button
  useEffect(() => {
    if (env.DATA_SOURCE_SET != true && sync === true) {
      getPipelines();
    }
  }, [sync]);


  return (
    <div
      className={` ${hubSpotUserDetails.sideMenu[0].tabName === title ||
        componentName === "ticket"
        ? "mt-0"
        : "md:mt-4 mt-3"
        } rounded-md overflow-hidden mt-2 bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0 md:mb-4 mb-2`}
    >
      <div className="flex justify-between mb-6 items-center max-sm:flex-col-reverse max-sm:items-end gap-2">
        <div className="flex gap-2 justify-between">
          {(hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
            <div className="inline-flex p-1 bg-graySecondary dark:bg-dark-200 rounded-md gap-x-2">
              <button
                type="button"
                onClick={() => setActiveTab(false)}
                className={`py-1 px-3 inline-flex dark:text-gray-200 items-center gap-x-2 -ms-px first:ms-0 first:rounded-s-md hover:bg-gray-50 dark:hover:bg-dark-500 last:rounded-e-md text-sm font-medium text-gray-800 ${activeCard ? ' bg-graySecondary dark:bg-dark-200' : 'bg-white dark:bg-dark-400'}`}
              >

                <svg
                  fill="currentcolor"
                  width="20px"
                  height="23px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>list</title>
                  <path d="M8 8v4h16v-4h-16zM8 18h16v-4h-16v4zM8 24h16v-4h-16v4z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(true)}
                className={`py-1 px-3 inline-flex dark:text-gray-200 items-center gap-x-2 -ms-px first:ms-0 hover:bg-gray-50 dark:hover:bg-dark-500 first:rounded-s-md last:rounded-e-md text-sm font-medium text-gray-800 ${activeCard ? 'bg-white dark:bg-dark-400' : ' bg-graySecondary dark:bg-dark-200'}`}
              >

                <svg
                  width="15px"
                  height="15px"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M7 1H1V5H7V1Z" fill="currentcolor"></path>{" "}
                    <path d="M7 7H1V15H7V7Z" fill="currentcolor"></path>{" "}
                    <path d="M9 1H15V9H9V1Z" fill="currentcolor"></path>{" "}
                    <path d="M15 11H9V15H15V11Z" fill="currentcolor"></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          )}

          {(hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
            <div className="w-[180px]">
              <select
                className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2 py-2"
                value={activePipeline}
                onChange={(e) => handelChangePipeline(e.target?.value)}
              >
                <option value="" disabled={activeCard} selected >All Pipelines</option>
                {pipelines.map((item) => (
                  <option value={item.pipelineId}>{item.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className=" flex items-center gap-2">
            <Tooltip content="Press enter to search " className="relative">
              <Input
                placeholder="Search..."
                height="semiMedium"
                icon={SearchIcon}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(); // Trigger search when Enter is pressed
                  }
                }}
                className="pr-12"
              />
              {searchTerm && (
                <div
                  className="text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={handleSearch} // Trigger search on button click
                >
                  <EnterIcon />
                </div>
              )}
            </Tooltip>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant='link' size='link'>Clear All</Button>
            )}
          </div>
        </div>

        {hubSpotUserDetails.sideMenu[0].tabName !== title &&
          (componentName === "ticket"
            ? permissions?.create && defPermissions?.create
            : permissions?.create) && (
            <div className="text-end">
              <Button variant="create" onClick={() => setShowAddDialog(true)}>
                <span className="mr-2">
                  <IconPlus className="!w-3 !h-3" />
                </span>
                Create {title}
              </Button>
            </div>
          )}
      </div>
      {isLoading && (activeCard ? <BoardViewSkeleton /> : <TableSkeleton />)}

      {!isLoading && (!activeCard && tableData.length === 0) && (
        <div className="text-center pb-4">
          <EmptyMessageCard
            name={
              hubSpotUserDetails.sideMenu[0].tabName === title ? "item" : title
            }
          />
          {permissions && permissions.association && (
            <p className="text-secondary text-base md:text-2xl dark:text-gray-300mt-3">
              {permissions.associationMessage}
            </p>
          )}
        </div>
      )}

      {!isLoading && activeCard &&
        (hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
          <TrelloCards
            hubspotObjectTypeId={hubspotObjectTypeId}
            // getTrelloCardsData={getTrelloCardsData}
            activeCardData={activeCardData}
            pipelines={pipelines}
            activePipeline={activePipeline}
            isLoadingPipelines={isLoadingPipelines}
            urlParam={urlParam}
            companyAsMediator={companyAsMediator}
            handleCardData={handleCardPageChange}
            currentPage={currentPage}
            hasMoreData={hasMoreData}
          />
        )}

      {!isLoading && !activeCard && tableData.length > 0 && (
        <React.Fragment>
          <div className="overflow-x-auto rounded-md  dark:bg-dark-300">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {tableHeader.map((column) => (
                    <TableHead
                      key={column.key}
                      className="whitespace-nowrap dark:text-white dark:bg-dark-500 cursor-pointer"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex columns-center">
                        <span className="font-semibold text-xs">
                          {formatColumnLabel(column.value)}
                        </span>
                        {sortConfig === column.key && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            width="24px"
                            className="dark:fill-white cursor-pointer"
                          >
                            <path d="m280-400 200-200 200 200H280Z" />
                          </svg>
                        )}
                        {sortConfig === `-${column.key}` && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            width="24px"
                            className="dark:fill-white cursor-pointer"
                          >
                            <path d="M480-360 280-560h400L480-360Z" />
                          </svg>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {/* {env.DATA_SOURCE_SET === true && (
                    <TableHead className="whitespace-nowrap dark:text-white dark:bg-dark-500 cursor-pointer"></TableHead>
                  )}
                  {editView && permissions && permissions.update && (
                    <TableHead className="whitespace-nowrap dark:text-white dark:bg-dark-500 cursor-pointer"></TableHead>
                  )} */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow
                    key={item.id}
                    onMouseEnter={() => handleRowHover(item)}
                    onMouseLeave={() => handleRowHover(null)}
                  >
                    {tableHeader.map((column) => (
                      <TableCell
                        key={column.value}
                        className="whitespace-nowrap dark:border-gray-600  text-sm dark:bg-dark-300 border-b"
                      >
                        <div className="dark:text-white">
                          {/* {renderCellContent(
                            column.value
                              .split(".")
                              .reduce((o, k) => (o || {})[k], item),
                            item.id,
                            path
                          )} */}
                          {/* {renderCellContent(
                            item[column.key],
                            column,
                            item.hs_object_id,
                            path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                            path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                            'list',
                            path == '/association' ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${hubspotObjectTypeId}&parentObjectRecordId=${item.hs_object_id}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : '',
                            detailsView
                          )} */}

                          {viewName === "ticket"
                            ? renderCellContent(
                              companyAsMediator,
                              item[column.key],
                              column,
                              item.hs_object_id,
                              path == "/association"
                                ? `/${getParam("objectTypeName")}`
                                : item[column.key],
                              path == "/association"
                                ? getParam("objectTypeId")
                                : hubspotObjectTypeId,
                              "list",
                              `/${item[column.key]}/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets
                              }/${item.hs_object_id}${detailsUrl}`,
                              detailsView,
                              hoverRow,
                              null,
                              toQueryString(urlParam)
                            )
                            : renderCellContent(
                              companyAsMediator,
                              item[column.key],
                              column,
                              item.hs_object_id,
                              path == "/association"
                                ? `/${getParam("objectTypeName")}`
                                : item[column.key],
                              path == "/association"
                                ? getParam("objectTypeId")
                                : hubspotObjectTypeId,
                              "list",
                              path == "/association"
                                ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRecordId}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}&isPrimaryCompany=${isPrimaryCompany}`
                                : "",
                              detailsView,
                              hoverRow,
                              null,
                              toQueryString(urlParam)
                            )}
                        </div>
                      </TableCell>
                    ))}
                    {/* {env.DATA_SOURCE_SET === true && (
                      <TableCell className=" whitespace-nowrap dark:border-gray-600  text-sm dark:bg-dark-300 border-b">
                        <div className="flex items-center space-x-2  gap-x-5">
                          <Link
                            className="text-xs px-2 py-1 border border-input dark:text-white rounded-md whitespace-nowrap "
                            to={`${path}/${hubspotObjectTypeId}/${item.id}`}
                          >
                            View Details
                          </Link>
                        </div>
                      </TableCell>
                    )}
                    {editView && permissions && permissions.update && (
                      <TableCell className=" whitespace-nowrap dark:border-gray-600  text-sm dark:bg-dark-300 border-b">
                        <div className="flex items-center space-x-2 gap-x-5">
                          <Button
                            size="sm"
                            className="text-white"
                            onClick={() => {
                              setShowEditDialog(true);
                              setShowEditData(item);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between max-md:flex-col  md:px-4 px-3 gap-x-2 max-sm:mt-3 text-sm">
            <div className="flex items-center gap-x-2 text-sm">
              <p className="text-secondary leading-5 text-sm dark:text-gray-300">
                Showing
              </p>
              <span className="border border-2 border-secondary dark:text-gray-300 font-medium w-8 h-8 flex items-center justify-center rounded-md dark:border-white">
                {currentItems || 0}
              </span>
              <span className="text-secondary dark:text-gray-300">/</span>
              <span className="rounded-md font-medium dark:text-gray-300">
                {totalItems}
              </span>
              <p className="text-secondary font-normal text-sm dark:text-gray-300">
                Results
              </p>
            </div>
            <div className="flex justify-end">
              <Pagination
                numOfPages={numOfPages || 1}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
              />
            </div>
          </div>
        </React.Fragment>
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
          openModal={showAddDialog}
          setOpenModal={setShowAddDialog}
          title={title}
          path={path}
          portalId={portalId}
          hubspotObjectTypeId={hubspotObjectTypeId}
          apis={apis}
          refetch={getData}
          companyAsMediator={companyAsMediator || isPrimaryCompany}
          urlParam={urlParam}
        />
      )}
      {showEditDialog && (
        <DashboardTableEditForm
          openModal={showEditDialog}
          setOpenModal={setShowEditDialog}
          title={title}
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
