// const sortOptions = [
//   { label: "Created Date", value: "hs_createdate" },
//   { label: "Updated Date", value: "hs_lastmodifieddate" },
// ];

// export default function SortDropdown({ sort, setSort }) {
//   const [open, setOpen] = useState(false);
//   const [selectedField, setSelectedField] = useState("hs_createdate");
//   const [asc, setAsc] = useState(false); 

//   const handleSelect = (value) => {
//     setSelectedField(value);
//     const newSort = asc ? value : `-${value}`;
//     setSort(newSort);
//     setOpen(false);
//   };

//   const toggleOrder = () => {
//     const newAsc = !asc;
//     setAsc(newAsc);
//     const newSort = newAsc ? selectedField : `-${selectedField}`;
//     setSort(newSort);
//   };

//   return (
//     <div className="relative inline-block text-left">
//       <div
//         className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded cursor-pointer text-sm text-gray-700 dark:text-white"
//         onClick={() => setOpen(!open)}
//       >
//         <span>{sortOptions.find((opt) => opt.value === selectedField)?.label}</span>
//         <ChevronDown className="h-4 w-4" />
//       </div>

//       {open && (
//         <div className="absolute z-20 mt-1 w-48 rounded shadow bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-300">
//           {sortOptions.map((opt) => (
//             <div
//               key={opt.value}
//               className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-dark-200 ${
//                 selectedField === opt.value ? "font-medium text-teal-600" : "text-gray-800"
//               }`}
//               onClick={() => handleSelect(opt.value)}
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}

//       <button
//         onClick={toggleOrder}
//         className="ml-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-200"
//         title={`Sort ${asc ? "Descending" : "Ascending"}`}
//       >
//         {asc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
//       </button>
//     </div>
//   );
// }


const DashboardTableExistingForm = ({
  resetRef,
  setOpenModal,
  portalId,
  onSubmit,
  validationSchema,
  serverError,
  existingData,
  setAddAnother,
  submitLoading,
  onChangeSelect,
  title
}) => {
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-hs_createdate');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const numOfPages = Math.ceil(totalCount / limit);

  const handleCheckboxChange = (value, label) => {
    setSelectedObjects((prevSelected) => {
      const exists = prevSelected.some((obj) => obj.value === value);
      return exists ? prevSelected.filter(obj => obj.value !== value) : [...prevSelected, { value, label }];
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const { mutate: fetchOptions, isLoading } = useMutation({
    mutationKey: ["getExistingOptionsData", page, limit, sort, search],
    mutationFn: async () => {
      const query = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        sort,
        search
      }).toString();

      const response = await Client.form.options({
        API: `/api/${hubId}/${portalId}/hubspot-object-forms/${existingData.formId}/${existingData.objectTypeId}?${query}`,
      });

      return response;
    },
    onSuccess: (response) => {
      const transformed = response?.data?.results.map(({ label, ID }) => ({
        label,
        value: ID,
      }));

      setOptions(transformed);
      setTotalCount(response?.data?.totalCount || 0);
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.detailedMessage || 'Error fetching data.');
    },
  });
  useEffect(() => {
    fetchOptions();
  }, [page, limit, sort]);

  const handleSearch = () => {
    setPage(1); // reset page on new search
    fetchOptions();
  };

  const limitOptions = [10, 20, 100];
  const sortOptions = [
    { label: 'Created Date Asc', value: 'hs_createdate' },
    { label: 'Created Date Desc', value: '-hs_createdate' },
    { label: 'Updated Date Asc', value: 'hs_lastmodifieddate' },
    { label: 'Updated Date Desc', value: '-hs_lastmodifieddate' }
  ];

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[230px]">
          <div className="text-center pb-4">Loading...</div>
        </div>
      ) : errorMessage ? (
        <div className="text-center text-warning pb-4">
          <span>{errorMessage}</span>
          <div className="mt-4 flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-dark-200 p-4 rounded-md">
            <Button variant="outline" onClick={() => setOpenModal(false)} disabled={submitLoading}>Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <Tooltip content="Press enter to search " className="relative">
              <Input
                placeholder="Search..."
                height="semiMedium"
                icon={SearchIcon}
                value={search}
                onChange={async (e) => {
                  await setSearch(e.target.value);
                  if (e.target.value === "") handleSearch();
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pr-12"
              />
              {search && (
                <div
                  className="text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={handleSearch}
                >
                  <EnterIcon />
                </div>
              )}
            </Tooltip>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            {selectedObjects.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="dark:text-white">{selectedObjects.length} selected</span>
                <span className="font-semibold text-sm dark:text-white">Selected</span>
              </div>
            )}
            <ExistingObjectsSelect
              optionObjects={selectedObjects}
              selectedObjects={selectedObjects}
              handleCheckboxChange={handleCheckboxChange}
              pagination={false}
            />
          </div>

          <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
            <span className="dark:text-white font-semibold text-sm">{options?.length} {title}s</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-secondary dark:text-white text-sm cursor-pointer rounded px-2 py-1  focus:outline-none focus-visible:outline-none">
              {sortOptions.map(opt => <option className="text-base" key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <ExistingObjectsSelect
            optionObjects={options}
            selectedObjects={selectedObjects}
            handleCheckboxChange={handleCheckboxChange}
            pagination={false}
          />

          {/* Pagination Controls */}
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <Pagination
              numOfPages={numOfPages || 1}
              currentPage={page}
              setCurrentPage={handlePageChange}
            />

            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="text-secondary dark:text-white text-sm cursor-pointer rounded px-2 py-1  focus:outline-none focus-visible:outline-none"
            >
              {limitOptions.map(l => (
                <option key={l} value={l}>
                  {l} per page
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-dark-200 p-4">
            <Button variant="outline" onClick={() => { setSelectedObjects([]); setOpenModal(false); }} disabled={submitLoading}>
              Cancel
            </Button>
            <Button isLoading={submitLoading} onClick={() => onSubmit(selectedObjects)} disabled={submitLoading || selectedObjects.length < 1}>
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
