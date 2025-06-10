const DetailsPagination = ({ objectId, states }) => {
  const {
    limit,
    setAfter,
    page,
    setPage,
    totalItems,
    numOfPages,
  } = useTable();

  const handlePageChange = async (page) => {
    await setPage(page);
    await setAfter((page - 1) * limit);
    setActivePageFucntion(page);
  };

  const setActivePageFucntion = (page) => {
    setSelectRouteMenuConfig(objectId, page);
  };

  // Start Cookie RouteMenuConfig
  const setSelectRouteMenuConfig = (key, page) => {
    let routeMenuConfigs = getRouteMenuConfig();
    routeMenuConfigs[key] = {
      ...routeMenuConfigs[key],
      details: {
        overview: {
          page: page,
          preData: true
        },
        activeTab: routeMenuConfigs[key]?.activeTab || "overview",
      },
    };
    setRouteMenuConfig(routeMenuConfigs);
  };

  useEffect(() => {
    let routeMenuConfigs = getRouteMenuConfig();
    const activePage = routeMenuConfigs[objectId]?.details?.overview?.page || 1;
    handlePageChange(activePage);
  }, []);

  return (
    <div className="flex items-center justify-between max-md:flex-col px-3 gap-x-2 max-sm:mt-3 text-sm">
      <div className="flex items-center gap-x-2 text-sm">
        {/* <p className="text-secondary leading-5 text-sm dark:text-gray-300">
          Showing
        </p>
        <span className="border border-secondary dark:text-gray-300 font-medium w-8 h-8 flex items-center justify-center rounded-md dark:border-white">
          {currentItems || 0}
        </span>
        <span className="text-secondary dark:text-gray-300">/</span> */}
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
  );
};
