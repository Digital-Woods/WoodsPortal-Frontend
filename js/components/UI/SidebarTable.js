
const SidebarTable = ({ hubspotObjectTypeId, path, inputValue, pipeLineId, specPipeLine, title, companyAsMediator, apis, detailsView = true, editView = false }) => {

  const [showAddDialog, setShowAddDialog] = useState(false);
  // const [showEditDialog, setShowEditDialog] = useState(false);
  // const [showEditData, setShowEditData] = useState(false);
  // const { BrowserRouter, Route, Switch, withRouter } = window.ReactRouterDOM;
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
  // const [openModal, setOpenModal] = useState(false);
  // const [modalData, setModalData] = useState(null);
  const [numOfPages, setNumOfPages] = useState(Math.ceil(totalItems / itemsPerPage));
  const { sync, setSync } = useSync();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverRow, setHoverRow] = useState(null);
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
  const param = companyAsMediator
    ? `?mediatorObjectTypeId=0-2${companyAsMediator ? `&isPrimaryCompany=${companyAsMediator}` : ''}${specPipeLine ? `&filterPropertyName=hs_pipeline&filterOperator=eq&filterValue=${pipeLineId || '0'}` : ''}`
    : `?mediatorObjectTypeId=0-1${companyAsMediator ? `&isPrimaryCompany=${companyAsMediator}` : ''}${specPipeLine ? `&filterPropertyName=hs_pipeline&filterOperator=eq&filterValue=${pipeLineId || '0'}` : ''}`;

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId
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
        API_ENDPOINT: `${apis.tableAPI}${param}`,
        // API_ENDPOINT: `${apis.tableAPI}?parentObjectTypeId=${hubspotObjectTypeId}&mediatorObjectTypeId=${mediatorObjectTypeId}`,
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
        setNumOfPages(Math.ceil(data.data.total / itemsPerPage));
      }
    },
    onError: () => {
      setSync(false)
      setTableData([]);
    },
  });

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

  useEffect(() => {
    getData();
  }, [sync]);

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleRowHover = (row) => {
    setHoverRow(row)
  };

  return (
    <div className="bg-rsbackground rounded-lg px-4 pt-2 w-full max-w-md dark:bg-dark-300">
      <div onClick={toggleContent} className="cursor-pointer flex items-center justify-between gap-x-2 text-sm font-medium py-3">
        <div className="flex items-center justify-between gap-x-2 ">
          <span className="text-secondary">
            <AssociationIcon />
          </span>
          <span>
            <span className="dark:text-white text-secondary hover:underline underline-offset-4 font-bold text-xs">{title}</span>
            <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
              {totalItems}
            </span>
          </span>
        </div>
        {isExpanded ? <IconMinus className='font-semibold fill-rstextcolor dark:fill-white' /> : <IconPlus className='font-semibold fill-rstextcolor dark:fill-white' />}
      </div>
      {isLoading && <div className={``}><HomeSidebarSkeleton /></div>}
      {!isLoading && tableData.length === 0 && (
        <div className="text-center p-5">
          <EmptyMessageCard name={hubSpotUserDetails.sideMenu[0].tabName === title ? 'item' : title} type='col' className='p-0' />
          {(tableAPiData && tableAPiData.data && tableAPiData.data.configurations && tableAPiData.data.configurations.association) &&
            <p className="text-secondary text-base md:text-2xl dark:text-gray-300 mt-3">
              {tableAPiData.data.configurations.associationMessage}
            </p>
          }
        </div>
      )}
      {!isLoading && tableData.length > 0 && (
        <React.Fragment>
          <ul className={`space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? "max-h-full" : "max-h-[270px]"} overflow-hidden`}>
            {tableData.map((item) => (
              <table key={item.id} className="flex items-start text-rstextcolor bg-rscardbackhround dark:text-white dark:bg-dark-500 p-2 flex-col gap-1 border !border-transparent dark:!border-gray-600 rounded-md justify-between">
                {tableHeader.map((column) => (
                  <tr
                    key={column.value}
                    className=""
                    onMouseEnter={() => handleRowHover(item)}
                    onMouseLeave={() => handleRowHover(null)}
                  >
                    <td className="pr-1 text-xs whitespace-wrap md:w-[120px] w-[100px] align-top dark:text-white text-rstextcolor !p-[3px]">{column.value}: </td>

                    <td className="dark:text-white text-xs whitespace-wrap  text-rstextcolor break-all  !p-[3px]">
                      {/* {console.log('item', item)} */}
                      {renderCellContent(
                        companyAsMediator,
                        item[column.key],
                        column,
                        item.hs_object_id,
                        path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                        path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                        'homeList',
                        path == '/association' ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : '',
                        detailsView,
                        hoverRow
                      )}
                    </td>
                  </tr>
                ))}
              </table>

            ))}
          </ul>
          {tableData.length > 0 &&
            <div className="flex lg:flex-row flex-col justify-between items-center">
              {/* <div className="text-end">
                {env.DATA_SOURCE_SET != true &&
                  <Button variant='outline' size='sm' onClick={toggleContent}>{isExpanded ? "Show Less" : "Show More"}</Button>
                }
              </div> */}
              <Pagination
                numOfPages={numOfPages || 0}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
              />
            </div>
          }
        </React.Fragment>
      )}
      {showAddDialog && <DashboardTableForm openModal={showAddDialog} setOpenModal={setShowAddDialog} title={title} path={path} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={apis} refetch={getData} />}
    </div>
  );
};
