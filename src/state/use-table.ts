import { useAtom } from "jotai";
import {
  tableSortState,
  tableLimitState,
  tableAfterState,
  tablePageState,
  tableTotalItemsState,
  tableNumOfPagesState,
  tableCurrentPageState,
  tableSearchState,
  tableFilterPropertyNameState,
  tableFilterPropertyOperatorState,
  tableFilterPropertyValueState,
  tableIsPrimaryCompanyState,
  tableViewState,
  tableSelectedPipelineState,
  tableParamState,
  tableDefPermissions,
  gridDataState,
} from "@/state/store";
import { useSync } from "@/state/use-sync";
import { getAuthSubscriptionType, getRouteMenuConfig, setRouteMenuConfig } from "@/data/client/auth-utils";
import { env } from "@/env";
import { useUpdateLink } from "@/utils/GenerateUrl";

const pageLimit = env.VITE_TABLE_PAGE_LIMIT;

export function useTable() {
  const [data, setData] = useAtom(gridDataState);
  const [sort, setSort] = useAtom(tableSortState);
  const [limit, setLimit] = useAtom(tableLimitState);
  const [after, setAfter] = useAtom(tableAfterState);
  const [page, setPage] = useAtom(tablePageState);
  const [totalItems, setTotalItems] = useAtom(tableTotalItemsState);
  const [numOfPages, setNumOfPages] = useAtom(tableNumOfPagesState);
  const [currentPage, setCurrentPage] = useAtom(tableCurrentPageState);
  const [search, setSearch] = useAtom(tableSearchState);
  const [filterPropertyName, setFilterPropertyName] = useAtom(tableFilterPropertyNameState);
  const [filterOperator, setFilterOperator] = useAtom(tableFilterPropertyOperatorState);
  const [filterValue, setFilterValue] = useAtom(tableFilterPropertyValueState);
  const [isPrimaryCompany, setIsPrimaryCompany] = useAtom(tableIsPrimaryCompanyState);
  const [view, changeView] = useAtom(tableViewState);
  const [selectedPipeline, changePipeline] = useAtom(tableSelectedPipelineState);
  const [tableParam, setTableFilterData] = useAtom(tableParamState);
  const [defPermissions, setTableDefPermissions] = useAtom(tableDefPermissions);
  const { sync } = useSync();
  const {updateLink, filterParams} = useUpdateLink();

  const setView = (mView: string | null) => {
    setPage(getAuthSubscriptionType() === "FREE" ? "" : 1);
    changeView(mView);
  };

  const resetTableParam = () => {
    setSort("-hs_createdate");
    setLimit(pageLimit);
    setAfter("");
    setPage(getAuthSubscriptionType() === "FREE" ? "" : 1);
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

  // const getTableParam = (companyAsMediator?: boolean, currentPageOverride?: number) => ({
  //   limit: limit,
  //   page: currentPageOverride || page,
  //   ...(after && after.length > 0 && { after }),
  //   sort: sort,
  //   search: search,
  //   filterPropertyName: filterPropertyName,
  //   filterOperator: filterOperator,
  //   filterValue: selectedPipeline,
  //   cache: sync ? false : true,
  //   isPrimaryCompany: companyAsMediator ? companyAsMediator : false,
  //   view: view,
  // });

  const getTableParam = (
    companyAsMediator?: boolean,
    currentPageOverride?: number
  ) => {
    const baseParams: any = {
      sort,
      search,
      filterPropertyName,
      filterOperator,
      filterValue: selectedPipeline,
      cache: sync ? false : true,
      isPrimaryCompany: companyAsMediator || false,
      view,
    };

    if (getAuthSubscriptionType() === "FREE") {
      return {
        ...baseParams,
        ...({after: page}),
      };
    }

    return {
      ...baseParams,
      limit,
      page: currentPageOverride || page,
      ...(after && after.length > 0 && { after }),
    };
  };

  const setDefaultPipeline = async (data: any, hubspotObjectTypeId: string, companyAsMediator?: boolean) => {
    if (data) {
      const params = filterParams();
      let mFilterValue: any = "";
      const excludedIds = ['0-1', '0-2', '0-3', '0-4', '0-5'];
      let defaultPipelineId = ""

      const defaultPipeline = data?.data?.find(
        (pipeline: any) => pipeline.pipelineId === data.data[0].pipelineId
      );

      if (excludedIds.includes(hubspotObjectTypeId)) {
        defaultPipelineId = defaultPipeline?.pipelineId
      }

      if (
        params &&
        params?.filterPropertyName === "hs_pipeline" &&
        params?.filterValue
      ) {
        mFilterValue = params?.filterValue;
      } else {
        if (view === "BOARD" && !selectedPipeline) {
          mFilterValue = defaultPipelineId;
          // const routeMenuConfig = {
          //   [hubspotObjectTypeId]: {
          //     activePipeline: defaultPipelineId,
          //   },
          // };
          // setSelectRouteMenuConfig(routeMenuConfig);
          updateLink({
              fV: defaultPipelineId
          })
        } else if (!excludedIds.includes(hubspotObjectTypeId)) { // for custom objects, set selected pipeline if exists else default
          mFilterValue = selectedPipeline || null
        } else {
          mFilterValue =
            data.data.length === 1
              ? defaultPipelineId
              : selectedPipeline;
        }
      }
      changePipeline(mFilterValue);
      return mFilterValue;
    } else {
      changePipeline("");
      return "";
    }
  };

  const setSelectedPipeline = (hubspotObjectTypeId: string, pipelines: any[], pipeLineId?: string) => {
    let filterValue = "all";
    if (pipeLineId) {
      const pipelineSingle = pipelines.find(
        (pipeline) => pipeline.pipelineId === pipeLineId
      );
      setFilterPropertyName("hs_pipeline");
      setFilterOperator("eq");
      filterValue = pipelineSingle.pipelineId;
      setFilterValue(filterValue);
    } else {
      setFilterPropertyName("hs_pipeline");
      setFilterOperator("eq");
      filterValue = "";
      setFilterValue(filterValue);
    }

    // const routeMenuConfig = {
    //   [hubspotObjectTypeId]: {
    //     activePipeline: filterValue,
    //   },
    // };
    changePipeline(filterValue);
    // setSelectRouteMenuConfig(routeMenuConfig);
  };

  // const setSelectRouteMenuConfig = (routeMenuConfig: Record<string, any>) => {
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

  const setGridData = async (type: string, deals: any[]) => {
    if (type === "reset") return setData([]);
    if (type === "directly") return setData(deals);

    const finalData = deals.map((deal) => {
      const cards =
        deal?.data?.results?.rows?.map((row: any) => ({
          id: row?.hs_object_id,
          ...row,
          hubspotObjectTypeId: type === "deals" ? "0-3" : "0-5",
        })) || [];

      return {
        id: deal.id,
        name: deal.label,
        count: deal?.data?.total,
        ...deal,
        cards,
      };
    });

    setData(finalData);
  };

  return {
    sort, setSort,
    limit, setLimit,
    after, setAfter,
    page, setPage,
    totalItems, setTotalItems,
    numOfPages, setNumOfPages,
    currentPage, setCurrentPage,
    search, setSearch,
    filterPropertyName, setFilterPropertyName,
    filterOperator, setFilterOperator,
    filterValue, setFilterValue,
    isPrimaryCompany, setIsPrimaryCompany,
    view, setView,
    tableParam, setTableFilterData,
    defPermissions, setTableDefPermissions,
    selectedPipeline, setSelectedPipeline,
    setDefaultPipeline,
    // setSelectRouteMenuConfig,
    resetTableParam,
    getTableParam,
    gridData: data,
    setGridData,
  };
}
