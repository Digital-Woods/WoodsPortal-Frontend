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

const { BrowserRouter, Route, Switch, withRouter } = window.ReactRouterDOM;

const DashboardTable = ({ path, inputValue, title }) => {
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeader, setTableHeader] = useState([]);
  const [after, setAfter] = useState("");
  const [sortConfig, setSortConfig] = useState("createdAt");
  const [filterPropertyName, setFilterPropertyName] = useState(null);
  const [filterOperator, setFilterOperator] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);

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
    const results = data.data.results || [];
    if (env.DATA_SOURCE_SET === true) {
      const foundItem = results.find((item) => {
        return item.name === path.replace("/", "");
      });
      setTableData(foundItem.results);
      setTotalItems(foundItem.results.length || 0);
      setItemsPerPage(foundItem.results.length > 0 ? itemsPerPage : 0);
      if (foundItem.results.length > 0) {
        setTableHeader(sortData(foundItem.results[0], "list", title));
      } else {
        setTableHeader([]);
      }
    } else {
      setTableData(results);
      setTotalItems(data.data.total || 0);
      setItemsPerPage(results.length > 0 ? itemsPerPage : 0);

      if (results.length > 0) {
        setTableHeader(sortData(results[0], "list", title));
      } else {
        setTableHeader([]);
      }
    }
  };

  const { mutate: getData, isLoading } = useMutation({
    mutationKey: [
      "TableData",
      path,
      itemsPerPage,
      after,
      sortConfig,
      // inputValue,
      me,
      filterPropertyName,
      filterOperator,
      filterValue,
    ],
    mutationFn: async () => {
      return await Client.objects.all({
        path,
        limit: itemsPerPage || 10,
        page: currentPage,
        // after,
        ...(after &&
          after.length > 0 && {
          after,
        }),
        me,
        sort: sortConfig,
        // inputValue,
        filterPropertyName,
        filterOperator,
        filterValue,
      });
    },

    onSuccess: (data) => {
      if (data.statusCode === "200") {
        mapResponseData(data);
      }
    },
    onError: () => {
      setTableData([]);
    },
  });
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleSort = (column) => {
    let newSortConfig = column;
    if (sortConfig === column) {
      newSortConfig = `-${column}`;
    } else if (sortConfig === `-${column}`) {
      newSortConfig = column;
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

  const numOfPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (!isLivePreview() && env.DATA_SOURCE_SET !== true) getData();
  }, [inputValue]);

  useEffect(() => {
    if (isLivePreview()) {
      mapResponseData(fakeTableData);
    } else if (env.DATA_SOURCE_SET == true) {
      mapResponseData(fakeTableData);
    } else {
      getData();
    }
  }, []);

  const setDialogData = (data) => {
    setModalData(data);
    setOpenModal(true);
  };
  console.log(modalData);
  return (
    <div className="shadow-md rounded-md dark:border-gray-700 bg-cleanWhite dark:bg-dark-300">
      {isLoading && <div className="loader-line"></div>}
      {!isLoading && tableData.length === 0 && (
        <div className="text-center p-5">
          <p className="text-secondary text-2xl dark:text-gray-300">
            No records found
          </p>
        </div>
      )}
      <div className="flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-x-2 pt-3 text-sm">
          <p className="text-secondary leading-5 text-sm dark:text-gray-300">
            Showing
          </p>
          <span className="border border-2 border-black font-medium w-8 h-8 flex items-center justify-center rounded-md dark:border-white">
            {endItem}
          </span>
          <span>/</span>
          <span className="rounded-md font-medium">{totalItems}</span>
          <p className="text-secondary font-normal text-sm dark:text-gray-300">
            Results
          </p>
        </div>

        {/* {tableData.length > 0 && <Select buttonText="Order: Ascending" />} */}
      </div>

      {tableData.length > 0 && (
        <React.Fragment>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {tableHeader.map((item) => (
                    <TableHead
                      key={item.name}
                      className="whitespace-nowrap dark:text-white cursor-pointer"
                      onClick={() => handleSort(item.name)}
                    >
                      <div className="flex items-center">
                        <span className="font-semibold text-xs">
                          {item.label}
                        </span>
                        {sortConfig === item.name && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            width="24px"
                            className="dark:fill-white cursor-pointer"
                          >
                            <path d="m280-400 200-200 200 200H280Z" />
                          </svg>
                        )}
                        {sortConfig === `-${item.name}` && (
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
                  {/* <TableHead className="font-semibold text-xs">
                  Actions
                </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item.id}>
                    {tableHeader.map((row) => (
                      <TableCell
                        key={row.name}
                        className="whitespace-nowrap border-b"
                      >
                        <div className="dark:text-white">
                          {renderCellContent(
                            row.name
                              .split(".")
                              .reduce((o, k) => (o || {})[k], item),
                            item.id,
                            path
                          )}
                        </div>
                      </TableCell>
                    ))}
                    {env.DATA_SOURCE_SET === true &&
                      <TableCell>
                        <div className="flex items-center space-x-2 gap-x-5">
                          <button
                            className="text-xs px-2 py-1 border border-input rounded-md whitespace-nowrap "
                            onClick={() => setDialogData(item)}
                          >
                            View Details
                          </button>
                        </div>
                      </TableCell>
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end px-4">
            <Pagination
              numOfPages={numOfPages}
              currentPage={currentPage}
              setCurrentPage={handlePageChange}
            />
          </div>
        </React.Fragment>
      )
      }
      {env.DATA_SOURCE_SET === true &&
        <Dialog open={openModal} onClose={setOpenModal} className="bg-custom-gradient rounded-md sm:min-w-[430px]">
          <div className="rounded-md flex-col gap-6 flex">
            <h3 className="text-start text-xl font-semibold">
              Details
            </h3>
            {modalData &&
              Object.keys(modalData).map((key) => (
                <div key={key} className="flex justify-between items-center w-full gap-1 border-b">
                  <div className="text-start dark:text-white">
                    {formatKey(key)} -
                  </div>
                  <div className="dark:text-white text-end">
                    {modalData[key]}
                  </div>
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
    </div >
  );
};
