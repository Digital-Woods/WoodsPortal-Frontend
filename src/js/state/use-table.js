const pageLimit = env.TABLE_PAGE_LIMIT;

const tableSortState = Recoil.atom({
  key: "tableSortState",
  default: "-hs_createdate",
});

const tableLimitState = Recoil.atom({
  key: "tableLimitState",
  default: pageLimit,
});

const tableAfterState = Recoil.atom({
  key: "tableAfterState",
  default: "",
});

const tablePageState = Recoil.atom({
  key: "tablePageState",
  default: 1,
});

const tableTotalItemsState = Recoil.atom({
  key: "tableTotalItemsState",
  default: 1,
});

const tableNumOfPagesState = Recoil.atom({
  key: "tableNumOfPagesState",
  default: 1,
});

const tableCurrentPageState = Recoil.atom({
  key: "tableCurrentPageState",
  default: 1,
});

const tableSearchState = Recoil.atom({
  key: "tableSearchState",
  default: "",
});

const tableFilterPropertyNameState = Recoil.atom({
  key: "tableFilterPropertyNameState",
  default: "hs_pipeline",
});

const tableFilterPropertyOperatorState = Recoil.atom({
  key: "tableFilterPropertyOperatorState",
  default: "eq",
});

const tableFilterPropertyValueState = Recoil.atom({
  key: "tableFilterPropertyValueState",
  default: "",
});

const tableIsPrimaryCompanyState = Recoil.atom({
  key: "tableIsPrimaryCompanyState",
  default: null,
});

const tableViewState = Recoil.atom({
  key: "tableViewState",
  default: null,
});

const tableSelectedPipelineState = Recoil.atom({
  key: "tableSelectedPipelineState",
  default: "",
});

const tableParamState = Recoil.atom({
  key: "tableParamState",
  default: {},
});

const gridDataState = Recoil.atom({
  key: "gridDataState",
  default: [],
});

function useTable() {
  const [data, setData] = Recoil.useRecoilState(gridDataState);

  const [sort, setSort] = Recoil.useRecoilState(tableSortState);
  const [limit, setLimit] = Recoil.useRecoilState(tableLimitState);
  const [after, setAfter] = Recoil.useRecoilState(tableAfterState);
  const [page, setPage] = Recoil.useRecoilState(tablePageState);
  const [totalItems, setTotalItems] =
    Recoil.useRecoilState(tableTotalItemsState);
  const [numOfPages, setNumOfPages] =
    Recoil.useRecoilState(tableNumOfPagesState);
  const [currentPage, setCurrentPage] = Recoil.useRecoilState(
    tableCurrentPageState
  );
  const [search, setSearch] = Recoil.useRecoilState(tableSearchState);
  const [filterPropertyName, setFilterPropertyName] = Recoil.useRecoilState(
    tableFilterPropertyNameState
  );
  const [filterOperator, setFilterOperator] = Recoil.useRecoilState(
    tableFilterPropertyOperatorState
  );
  const [filterValue, setFilterValue] = Recoil.useRecoilState(
    tableFilterPropertyValueState
  );
  const [isPrimaryCompany, setIsPrimaryCompany] = Recoil.useRecoilState(
    tableIsPrimaryCompanyState
  );
  const [view, setView] = Recoil.useRecoilState(tableViewState);

  const [selectedPipeline, changePipeline] = Recoil.useRecoilState(
    tableSelectedPipelineState
  );

  const [tableParam, setTableFilterData] =
    Recoil.useRecoilState(tableParamState);

  // Filter Data

  // const handleSearch = async (type, deals) => {
  //   setFilterPropertyName("hs_pipeline")
  //   filterOperator: "eq",
  //   filterValue: activePipeline || filterValue,
  // };

  const resetTableParam = () => {
    setSort("-hs_createdate");
    setLimit(pageLimit);
    setAfter("");
    setPage(1);
    setTotalItems(1);
    setNumOfPages(1);
    setCurrentPage(1);
    setSearch("");
    setFilterPropertyName("hs_pipeline");
    setFilterOperator("eq");
    setFilterValue("");
    setIsPrimaryCompany(null);
    changePipeline("");
  };

  const getTableParam = (companyAsMediator) => ({
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
    limit: limit,
    page: page,
    ...(after && after.length > 0 && { after }),
    sort: sort,
    search: search,
    filterPropertyName: filterPropertyName,
    filterOperator: filterOperator,
    filterValue: selectedPipeline,
    // cache: sync ? false : true,
    isPrimaryCompany: companyAsMediator ? companyAsMediator : false,
    view: view,
  });

  const setDefaultPipeline = async (
    data,
    hubspotObjectTypeId,
    companyAsMediator
  ) => {
    if (data) {
      const routeMenuConfigs = getRouteMenuConfig();
      let mFilterValue = "";

      const defaultPipeline = data?.data?.find(
        (pipeline) => pipeline.pipelineId === data.data[0].pipelineId
      );

      if ( // if already set pipeline
        routeMenuConfigs &&
        routeMenuConfigs.hasOwnProperty(hubspotObjectTypeId) &&
        routeMenuConfigs[hubspotObjectTypeId].activePipeline
      ) {
        mFilterValue = routeMenuConfigs[hubspotObjectTypeId].activePipeline;
      } else {
        // if (activeCard && !activePipeline) {
        //   mFilterValue = defaultPipeline.pipelineId;
        // setActivePipeline(defaultPipeline.pipelineId);
        // const routeMenuConfig = {
        //   [hubspotObjectTypeId]: {
        //     activePipeline: defaultPipeline.pipelineId,
        //   },
        // };
        // setSelectRouteMenuConfig(routeMenuConfig);
        // } else {
        //   mFilterValue =
        //     data.data.length === 1 ? pipelineSingle.pipelineId : activePipeline;
        // }
        if (view === "BOARD" && !selectedPipeline) { // if view is BOARD then selected pipeline is null 
          mFilterValue = defaultPipeline.pipelineId;
          const routeMenuConfig = {
            [hubspotObjectTypeId]: {
              activePipeline: defaultPipeline.pipelineId,
            },
          };
          setSelectRouteMenuConfig(routeMenuConfig);
        } else {
          mFilterValue =
            data.data.length === 1
              ? defaultPipeline.pipelineId
              : selectedPipeline;
        }
      }
      changePipeline(mFilterValue);
    } else {
      changePipeline("");
    }
  };

  const setSelectedPipeline = (hubspotObjectTypeId, pipelines, pipeLineId) => {
    let filterValue = "";
    if (pipeLineId) {
      const pipelineSingle = pipelines.find(
        (pipeline) => pipeline.pipelineId === pipeLineId
      );
      setFilterPropertyName("hs_pipeline");
      setFilterOperator("eq");
      filterValue = pipelineSingle.pipelineId;
      setFilterValue(filterValue);
      // setActivePipeline(pipelineSingle.pipelineId);
    } else {
      setFilterPropertyName("hs_pipeline");
      setFilterOperator("eq");
      filterValue = "";
      setFilterValue(filterValue);
      // setActivePipeline(null);
    }

    const routeMenuConfig = {
      [hubspotObjectTypeId]: {
        activePipeline: filterValue,
      },
    };
    changePipeline(filterValue);
    setSelectRouteMenuConfig(routeMenuConfig);
  };

  const setSelectRouteMenuConfig = (routeMenuConfig) => {
    let routeMenuConfigs = getRouteMenuConfig();

    Object.keys(routeMenuConfig).forEach((key) => {
      if (!routeMenuConfigs) routeMenuConfigs = {};
      if (routeMenuConfigs && !routeMenuConfigs.hasOwnProperty(key)) {
        routeMenuConfigs[key] = routeMenuConfig[key];
      } else {
        if (routeMenuConfig[key]?.activeTab)
          routeMenuConfigs[key].activeTab = routeMenuConfig[key].activeTab;
        if (routeMenuConfig[key]?.activePipeline) {
          routeMenuConfigs[key].activePipeline =
            routeMenuConfig[key].activePipeline;
        } else {
          routeMenuConfigs[key].activePipeline = "";
        }
      }
    });
    setRouteMenuConfig(routeMenuConfigs);
  };

  // Grid Data
  const setGridData = async (type, deals) => {
    if (type === "reset") return setData([]);
    if (type === "directly") return setData(deals);

    let finalData = deals.map((deal) => {
      const cards =
        deal?.data?.results?.rows?.map((row) => ({
          id: row?.hs_object_id,
          ...row,
          hubspotObjectTypeId: type === "deals" ? "0-3" : "0-5",
        })) || [];

      return {
        id: deal.id,
        name: deal.label,
        count: deal?.data?.total,
        ...deal,
        cards: cards,
      };
    });

    setData(finalData);
  };

  return {
    // Filter props
    sort,
    setSort,
    limit,
    setLimit,
    after,
    setAfter,
    page,
    setPage,
    totalItems,
    setTotalItems,
    numOfPages,
    setNumOfPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    filterPropertyName,
    setFilterPropertyName,
    filterOperator,
    setFilterOperator,
    filterValue,
    setFilterValue,
    isPrimaryCompany,
    setIsPrimaryCompany,
    view,
    setView,
    tableParam,
    selectedPipeline,
    setSelectedPipeline,
    setDefaultPipeline,
    // changePipeline,
    setSelectRouteMenuConfig,
    // Data Props
    resetTableParam,
    getTableParam,
    gridData: data,
    setGridData,
  };
}
