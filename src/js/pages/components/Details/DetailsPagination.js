const DetailsPagination = ({}) => {
  // const [numOfPages, setNumOfPages] = useState(100);
  // const [page, setPage] = useState(1);
  // const [after, setAfter] = useState(0);
  // const [currentItems, setCurrentItems] = useState(1);
  // const [totalItems, setTotalItems] = useState(100);
  // const [limit, setLimit] = useState(1);

  const {
    page,
    setPage,
    sort,
    setSort,
    after,
    setAfter,
    limit,
    setLimit,
    numOfPages,
    totalItems,
    setTotalItems,
  } = useTable();

  const handlePageChange = async (page) => {
    await setPage(page);
    await setAfter((page - 1) * limit);
  };

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
