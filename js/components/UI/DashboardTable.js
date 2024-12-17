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
  viewName = '',
  detailsUrl = '',
  componentName,
  defPermissions = null
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  const { BrowserRouter, Route, Switch, withRouter } = window.ReactRouterDOM;
  const [tableData, setTableData] = useState([]);
  const [currentTableData, setCurrentTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
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
  const [permissions, setPermissions] = useState(defPermissions);

  const numOfPages = Math.ceil(totalItems / itemsPerPage);
  const { sync, setSync } = useSync();

  const { me } = useMe();

  useEffect(() => {
    const hash = location.hash; // Get the hash fragment
    const queryIndex = hash.indexOf("?"); // Find the start of the query string in the hash
    const queryParams = new URLSearchParams(hash.substring(queryIndex)); // Parse the query string

    setFilterPropertyName(queryParams.get("filterPropertyName"));
    setFilterOperator(queryParams.get("filterOperator"));
    setFilterValue(queryParams.get("filterValue"));
  }, [location.search]);

  const mapResponseData = (data) => {
    if (env.DATA_SOURCE_SET === true) {
      const results = data.data.results || [];

      const foundItem = results.find((item) => {
        return item.name === path.replace("/", "");
      });
      setCurrentTableData(foundItem.results.rows);
      setTotalItems(foundItem.results.rows.length || 0);
      setItemsPerPage(foundItem.results.rows.length > 0 ? itemsPerPage : 0);
      if (foundItem.results.rows.length > 0) {
        setTableHeader(sortData(foundItem.results.columns));
      } else {
        setTableHeader([]);
      }

    } else {
      const results = data.data.results.rows || [];
      const columns = data.data.results.columns || [];
      setTableData(results);
      setTotalItems(data.data.total || 0);
      setItemsPerPage(results.length > 0 ? itemsPerPage : 0);

      // if (results.length > 0) {
      //   setTableHeader(sortData(results[0], "list", title));
      // } else {
      //   setTableHeader([]);
      // }
      setTableHeader(sortData(columns));
    }
  };

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  const parentObjectTypeName = getParam("parentObjectTypeName")
  const objectTypeId = getParam("objectTypeId")
  const objectTypeName = getParam("objectTypeName")

  // const param = path === '/association' ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const { mutate: getData, data: tableAPiData, isLoading } = useMutation({
    mutationKey: [
      "TableData",
      path,
      itemsPerPage,
      after,
      sortConfig,
      me,
      // portalId,
      // hubspotObjectTypeId,
      apis.tableAPI,
      filterPropertyName,
      filterOperator,
      filterValue,
    ],
    mutationFn: async () => {
      return await Client.objects.all({
        path,
        limit: itemsPerPage || 10,
        page: currentPage,
        ...(after && after.length > 0 && { after }),
        me,
        // portalId,
        // hubspotObjectTypeId: path === '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
        // param: param,
        API_ENDPOINT: apis.tableAPI,
        sort: sortConfig,
        filterPropertyName,
        filterOperator,
        filterValue,
        cache: sync ? false : true
      });
    },

    onSuccess: (data) => {
      setSync(false)
      if (data.statusCode === "200") {
        mapResponseData(data);
        if (defPermissions === null) setPermissions(data.configurations[componentName])
      }
    },
    onError: () => {
      setSync(false)
      setTableData([]);
    },
  });



  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleSort = (column) => {
    let newSortConfig = column;
    if (sortConfig === column) {
      newSortConfig = `-${column}`; // Toggle to descending if the same column is clicked again
    } else if (sortConfig === `-${column}`) {
      newSortConfig = column; // Toggle back to ascending if clicked again
    }
    setSortConfig(newSortConfig);

    if (env.DATA_SOURCE_SET === true) {
      // Handle sorting for local data (currentTableData)
      const sortedData = [...currentTableData].sort((a, b) => {
        const columnValueA = getValueByPath(a, column);
        const columnValueB = getValueByPath(b, column);

        if (newSortConfig.startsWith('-')) {
          return columnValueA > columnValueB ? -1 : columnValueA < columnValueB ? 1 : 0;
        }
        return columnValueA < columnValueB ? -1 : columnValueA > columnValueB ? 1 : 0;
      });
      setTableData(sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ));
    } else {
      getData();
    }
  };

  // Helper function to get the value by key from nested objects
  const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };


  const handlePageChange = async (page) => {
    if (env.DATA_SOURCE_SET === true) {
      setCurrentPage(page);
    } else {
      setCurrentPage(page);
      setAfter((page - 1) * itemsPerPage);
      await wait(100);
      getData();
    }
  };
  useEffect(() => {
    if (env.DATA_SOURCE_SET === true) {
      setTableData(currentTableData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ));
    }
  }, [currentTableData, currentPage, itemsPerPage]);
  // useEffect(() => {
  //   if (!isLivePreview() && env.DATA_SOURCE_SET !== true) getData();
  // }, [inputValue]);

  useEffect(() => {
    if (env.DATA_SOURCE_SET != true) {
      getData();
    } else {
      mapResponseData(hubSpotTableData);
    }
  }, []);

  useEffect(() => {
    if (env.DATA_SOURCE_SET != true && sync === true) {
      getData();
    }
  }, [sync]);

  const setDialogData = (data) => {
    setModalData(data);
    setOpenModal(true);
  };

  return (
    <div className={` ${hubSpotUserDetails.sideMenu[0].tabName === title ? 'mt-0' : 'md:mt-4 mt-3'} rounded-md overflow-hidden`}>
      {isLoading && <div className="loader-line m-2"></div>}
      {hubSpotUserDetails.sideMenu[0].tabName === title
        ? null
        : (permissions && permissions.create) && (
          <div className="text-end md:py-4 py-3 md:pr-4 pr-3">
            <Button variant="create" onClick={() => setShowAddDialog(true)}>
              <span className="mr-2"> <IconPlus className='!w-3 !h-3' />  </span> Create {title}
            </Button>
          </div>
        )
      }
      {!isLoading && tableData.length === 0 && (
        <div className="text-center pb-4">
          <EmptyMessageCard name={hubSpotUserDetails.sideMenu[0].tabName === title ? 'item' : title} />
          {(permissions && permissions.association) &&
            <p className="text-primary text-base md:text-2xl dark:text-gray-300mt-3">
              {permissions.associationMessage}
            </p>
          }
        </div>
      )}
      {
        tableData.length > 0 && (
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
                    {env.DATA_SOURCE_SET === true &&
                      <TableHead className="font-semibold text-xs">

                      </TableHead>
                    }
                    {editView && (permissions && permissions.update) &&
                      <TableHead className="font-semibold text-xs">
                        Actions
                      </TableHead>
                    }
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow key={item.id}>
                      {tableHeader.map((column) => (
                        <TableCell
                          key={column.value}
                          className="whitespace-nowrap dark:border-gray-600 border-b"
                        >
                          <div className="dark:text-white">
                            {/* {renderCellContent(
                            column.value
                              .split(".")
                              .reduce((o, k) => (o || {})[k], item),
                            item.id,
                            path
                          )} */}
                            {/* {console.log('item', item)} */}
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

                            {
                              viewName === 'ticket'
                                ? renderCellContent(
                                  item[column.key],
                                  column,
                                  item.hs_object_id,
                                  path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                                  path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                                  'list',
                                  `/${item[column.key]}/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/${item.hs_object_id}${detailsUrl}`,
                                  detailsView
                                )
                                : renderCellContent(
                                  item[column.key],
                                  column,
                                  item.hs_object_id,
                                  path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                                  path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                                  'list',
                                  path == '/association' ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${hubspotObjectTypeId}&parentObjectRecordId=${item.hs_object_id}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : '',
                                  detailsView
                                )
                            }

                          </div>
                        </TableCell>
                      ))}
                      {env.DATA_SOURCE_SET === true &&
                        <TableCell>
                          <div className="flex items-center space-x-2 gap-x-5">
                            <Link
                              className="text-xs px-2 py-1 border border-input dark:text-white rounded-md whitespace-nowrap "
                              to={`${path}/${hubspotObjectTypeId}/${item.id}`}
                            >
                              View Details
                            </Link>
                          </div>
                        </TableCell>
                      }
                      {editView && (permissions && permissions.update) &&
                        <TableCell>
                          <div className="flex items-center space-x-2 gap-x-5">
                            <Button size="sm" className="text-white" onClick={() => {
                              setShowEditDialog(true);
                              setShowEditData(item);
                            }}>
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between max-md:flex-col  md:px-4 px-3 gap-x-2 max-sm:mt-3 text-sm">
              <div className="flex items-center gap-x-2 text-sm">
                <p className="text-primary leading-5 text-sm dark:text-gray-300">
                  Showing
                </p>
                <span className="border border-2 border-black dark:text-gray-300 font-medium w-8 h-8 flex items-center justify-center rounded-md dark:border-white">
                  {endItem}
                </span>
                <span className="text-primary dark:text-gray-300">/</span>
                <span className="rounded-md font-medium dark:text-gray-300">{totalItems}</span>
                <p className="text-primary font-normal text-sm dark:text-gray-300">
                  Results
                </p>
              </div>
              <div className="flex justify-end">
                <Pagination
                  numOfPages={numOfPages}
                  currentPage={currentPage}
                  setCurrentPage={handlePageChange}
                />
              </div>
            </div>
          </React.Fragment>
        )
      }
      {
        env.DATA_SOURCE_SET === true &&
        <Dialog open={openModal} onClose={setOpenModal} className="bg-custom-gradient rounded-md sm:min-w-[430px]">
          <div className="rounded-md flex-col gap-6 flex">
            <h3 className="text-start text-xl font-semibold">
              Details
            </h3>
            {modalData &&
              Object.keys(modalData).map((key) => (
                <div key={key} className="flex justify-between items-center w-full gap-1 border-b">
                  {key !== 'iframe_file' && key !== 'id' ? (
                    <div className="w-full">
                      <div className="text-start dark:text-white">
                        {formatKey(key)} -
                      </div>
                      <div className="dark:text-white text-end">
                        {modalData[key]}
                      </div>
                    </div>
                  ) : key === 'iframe_file' ? (
                    <div>
                      Hello {modalData[key].replace(";", ',')}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ))}
            <div className="pt-3 text-end">
              <Button
                onClick={() => setOpenModal(false)}
              >
                Close

              </Button>
            </div>
          </div>
        </Dialog>
      }
      {showAddDialog && <DashboardTableForm openModal={showAddDialog} setOpenModal={setShowAddDialog} title={title} path={path} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={apis} refetch={getData} />}
      {showEditDialog && <DashboardTableEditForm openModal={showEditDialog} setOpenModal={setShowEditDialog} title={title} path={path} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={apis} showEditData={showEditData} refetch={getData} />}
    </div >
  );
};
