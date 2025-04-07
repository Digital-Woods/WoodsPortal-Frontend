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

const DashboardTableData = ({
  getData,
  apiResponse,
  // numOfPages,
  viewName,
  companyAsMediator,
  path,
  hubspotObjectTypeId,
  detailsView,
  hoverRow,
  urlParam,
  handleRowHover,
  // currentPage,
  // setCurrentPage,
  // sortConfig,
  // setSortConfig,
  // setAfter,
  // itemsPerPage,
  // setItemsPerPage,
  detailsUrl
}) => {
  const {
    page,
    setPage,
    sort,
    setSort,
    after,
    setAfter,
    limit,
    setLimit,
    numOfPages
  } = useTable();


  // console.log('DashboardTableData', true)
  const mUrlParam = Object.fromEntries(
    Object.entries(urlParam || {}).filter(([key]) => key !== "cache" && key !== "limit")
  );
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  const objectTypeId = getParam("objectTypeId");
  const objectTypeName = getParam("objectTypeName");
  const isPrimaryCompany = getParam("isPrimaryCompany");
  const parentObjectTypeId = getParam("parentObjectTypeId");
  const parentObjectRecordId = getParam("parentObjectRecordId");

  const [tableHeader, setTableHeader] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentItems, setCurrentItems] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  // const [itemsPerPage, setItemsPerPage] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [sortConfig, setSortConfig] = useState("-hs_createdate");

  const mapResponseData = (data) => {
    const results = data.data.results.rows || [];
    const columns = data.data.results.columns || [];
    setTableData(results);
    setTotalItems(data.data.total || 0);
    // setItemsPerPage(results.length > 0 ? itemsPerPage : 0);
    setLimit(results.length > 0 ? limit : 0);
    setCurrentItems(results.length);
    setTableHeader(sortData(columns));
  };

  useEffect(() => {
    mapResponseData(apiResponse);
  }, [apiResponse]);

  const handleSort = (column) => {
    let newSortConfig = column;
    if (sort === column) {
      newSortConfig = `-${column}`; // Toggle to descending if the same column is clicked again
    } else if (sort === `-${column}`) {
      newSortConfig = column; // Toggle back to ascending if clicked again
    }
    setSort(newSortConfig);

    // console.log("call get data", sort)

    // setSortConfig(newSortConfig);
    // getData({
    //   filterPropertyName: "hs_pipeline",
    //   filterOperator: "eq",
    //   filterValue: ""
    // });
    getData()
  };

  const handlePageChange = async (page) => {
    await setPage(page);
    await setAfter((page - 1) * limit);
    // getData({
    //   filterPropertyName: "hs_pipeline",
    //   filterOperator: "eq",
    //   filterValue: ""
    // });
    getData()
    // console.log("call get data", currentPage)
  };

  return (
    <React.Fragment>
      <div className="overflow-x-auto rounded-md  dark:bg-dark-300">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {tableHeader.filter((column) => !column.hidden).map((column) => (
                <TableHead
                  key={column.key}
                  className="whitespace-nowrap dark:text-white dark:bg-dark-500 cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex columns-center">
                    <span className="font-semibold text-xs">
                      {formatColumnLabel(column.value)}
                    </span>
                    {sort === column.key && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        width="24px"
                        className="dark:fill-white cursor-pointer"
                      >
                        <path d="m280-400 200-200 200 200H280Z" />
                      </svg>
                    )}
                    {sort === `-${column.key}` && (
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
                {tableHeader.filter((column) => !column.hidden).map((column) => (
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

                      {renderCellContent({
                        companyAsMediator: companyAsMediator,
                        value: item[column.key],
                        column: column,
                        itemId: item.hs_object_id,
                        path: path == "/association" ? `/${getParam("objectTypeName")}` : item[column.key],
                        hubspotObjectTypeId: path == "/association" ? getParam("objectTypeId") : hubspotObjectTypeId,
                        type: "list",
                        // associationPath: viewName === "ticket" ? `/${item[column.key]}/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/${item.hs_object_id}${detailsUrl}` : (path == "/association" ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRecordId}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}&isPrimaryCompany=${isPrimaryCompany}` : ""),
                        associationPath: viewName === "ticket" ? `/${item[column.key]}/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/${item.hs_object_id}${detailsUrl}` : (path == "/association" ? `/${item[column.key]}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRecordId}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}&isPrimaryCompany=${isPrimaryCompany}` : ""),
                        detailsView: detailsView,
                        hoverRow: hoverRow,
                        item: item,
                        urlParam: toQueryString(mUrlParam),
                      })}

                      {/* {viewName === "ticket"
                        ? renderCellContent(
                            companyAsMediator,
                            item[column.key],
                            column,
                            item.hs_object_id,
                            path == "/association" ? `/${getParam("objectTypeName")}` : item[column.key],
                            path == "/association" ? getParam("objectTypeId") : hubspotObjectTypeId,
                            "list",
                            `/${item[column.key]}/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/${item.hs_object_id}${detailsUrl}`,
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
                            path == "/association" ? `/${getParam("objectTypeName")}` : item[column.key],
                            path == "/association" ? getParam("objectTypeId") : hubspotObjectTypeId,
                            "list",
                            path == "/association" ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRecordId}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}&isPrimaryCompany=${isPrimaryCompany}` : "",
                            detailsView,
                            hoverRow,
                            null,
                            toQueryString(urlParam)
                          )} */}
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
          <span className="border border-secondary dark:text-gray-300 font-medium w-8 h-8 flex items-center justify-center rounded-md dark:border-white">
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
            currentPage={page}
            setCurrentPage={handlePageChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
