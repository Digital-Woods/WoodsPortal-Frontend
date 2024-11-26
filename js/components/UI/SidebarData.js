
const SidebarData = ({ hubspotObjectTypeId, path, inputValue, title, apis, detailsView = true, editView = false }) => {

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
  const numOfPages = Math.ceil(totalItems / itemsPerPage);
  const { sync, setSync } = useSync();
  const [isExpanded, setIsExpanded] = useState(false);


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
    // const results = data.data.results.rows || [];
    // const columns = data.data.results.columns || [];


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

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-md px-4 pt-4 w-full max-w-md dark:bg-dark-300">
      {isLoading && <div className="loader-line"></div>}
      {!isLoading && tableData.length === 0 && (
        <div className="text-center p-5">
          <p className="text-primary text-2xl dark:text-gray-300">
            No records found
          </p>
          {(tableAPiData && tableAPiData.data && tableAPiData.data.configurations && tableAPiData.data.configurations.association) &&
            <p className="text-primary text-2xl dark:text-gray-300">
              {tableAPiData.data.configurations.associationMessage}
            </p>
          }
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">{title} <span className="text-blue-500">{totalItems}</span></h2>
        {(tableAPiData && tableAPiData.data && tableAPiData.data.configurations && tableAPiData.data.configurations.createFormButton) &&
          <Button variant='outline' size='sm' onClick={() => setShowAddDialog(true)}>+ {title}</Button>
        }
      </div>

      {tableData.length > 0 && (
        <React.Fragment>
          <ul className={`space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? "max-h-full" : "max-h-[400px] "} overflow-hidden`}>
            {tableData.map((item) => (
              <li key={item.id} className="flex items-start text-primary dark:text-white p-2 flex-col gap-1 border rounded-md justify-between">
                {tableHeader.map((column) => (
                  <div
                    key={column.value}
                    className="flex items-start space-x-1"
                  >
                    <div className="pr-1 text-sm whitespace-nowrap align-top dark:text-white">{column.value}:</div>

                    <div className="dark:text-white text-xs ">
                      {/* {console.log('item', item)} */}
                      {renderCellContent(
                        item[column.key],
                        column,
                        item.hs_object_id,
                        path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                        path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                        'list',
                        path == '/association' ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : '',
                        detailsView
                      )}
                    </div>
                  </div>
                ))}
                {/* {env.DATA_SOURCE_SET === true &&
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
                    {editView &&
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
                    } */}
              </li>

            ))}
          </ul>
          {tableData.length > 0 &&
            <div className="flex justify-between mt-3 items-center">
              <div className="text-end">
                {env.DATA_SOURCE_SET != true &&
                  <Button variant='outline' size='sm' onClick={toggleContent}>{isExpanded ? "Show Less" : "Show More"}</Button>
                }
              </div>
              <Pagination
                numOfPages={numOfPages}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
              />
            </div>
          }
        </React.Fragment>
      )
      }
      {showAddDialog && <DashboardTableForm openModal={showAddDialog} setOpenModal={setShowAddDialog} title={title} path={path} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={apis} refetch={getData} />}
    </div >
  );
};


