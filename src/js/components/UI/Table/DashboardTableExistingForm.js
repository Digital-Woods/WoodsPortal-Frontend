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
  const [search, setSearch] = useState();

  const handleCheckboxChange = (value, label) => {
    setSelectedObjects((prevSelected) => {
      const exists = prevSelected.some((obj) => obj.value === value);
      if (exists) {
        return prevSelected.filter((obj) => obj.value !== value);
      } else {
        return [...prevSelected, { value, label }];
      }
    });
  };

  const { mutate: callAPI, isLoading } = useMutation({
    mutationKey: ["getExistingOptionsData"],
    mutationFn: async () => {
      try {
        const response = await Client.form.options({
          API: `/api/${hubId}/${portalId}/hubspot-object-forms/${existingData.formId}/${existingData.objectTypeId}`,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      const transformed = response?.data?.results.map(({ label, ID }) => ({
        label,
        value: ID,
      }));
      setOptions(transformed);
    },
    onError: (error) => {
      setErrorMessage(error.response.data.detailedMessage);
    },
  });

    const handleSearch = () => {
    console.log('searched');
  };

  useEffect(() => {
    if (options.length < 1) callAPI();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[230px]">
          <div className="text-center pb-4">Loading...</div>
        </div>
      ) : errorMessage ? (
        <div className="text-center text-warning pb-4">
          <span>{errorMessage}</span>
          <div className="mt-4 flex justify-end items-end gap-2 flex-wrap sticky bottom-0 bg-white dark:bg-dark-200 p-4">
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              disabled={submitLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <React.Fragment>
        {/* <Form
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          serverError={serverError}
          className="dark:bg-dark-200 !m-0"
        >
          {({ register, control, setValue, formState: { errors }, reset }) => {
            resetRef.current = reset;
            return (
              <div>
                <div className="text-gray-800 dark:text-gray-200">
                  <div key={existingData.name}>
                    <FormItem className="">
                      <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                        {existingData?.labels?.plural}
                      </FormLabel>
                      <FormControl>
                        <Select
                          label={`Select ${existingData?.labels?.plural}`}
                          name={existingData.name}
                          options={options}
                          control={control}
                          filled={existingData}
                          onChangeSelect={onChangeSelect}
                          apiEndPoint={`/api/${hubId}/${portalId}/hubspot-object-forms/${existingData.formId}/${existingData.objectTypeId}`}
                          setValue={setValue}
                        />
                      </FormControl>
                      {errors[existingData.name] && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors[existingData.name].message}
                        </FormMessage>
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="mt-4 flex justify-end items-end gap-2 flex-wrap sticky bottom-0 bg-white dark:bg-dark-200 p-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpenModal(false)}
                    disabled={submitLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className=" "
                    isLoading={submitLoading}
                    onClick={() => setAddAnother(false)}
                    disabled={submitLoading}
                  >
                    Add
                  </Button>
                </div>
              </div>
            );
          }}
        </Form> */}
          <div>
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
            <div className="flex flex-col gap-2 mb-4">
              {selectedObjects.length > 0 && 
               <div className="flex flex-col gap-4">
                <span className="dark:text-white">
                  {selectedObjects.length} selected
                </span>
                <span className="dark:text-white font-semibold text-sm">
                  Selected
                </span>
              </div>
              }
              <ExistingObjectsSelect
                optionObjects={selectedObjects}
                selectedObjects={selectedObjects}
                handleCheckboxChange={handleCheckboxChange}
                pagination={false}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="dark:text-white font-semibold text-sm">{options?.length} {title}s</span>
              <span className="text-secondary dark:text-white text-sm cursor-pointer">
                Default (Recently added) <span className="ml-1">▼</span>
              </span>
            </div>
            <ExistingObjectsSelect
              optionObjects={options}
              selectedObjects={selectedObjects}
              handleCheckboxChange={handleCheckboxChange}
              pagination={true} />
            <div className="mt-4 flex justify-end items-end gap-2 flex-wrap sticky bottom-0 bg-white dark:bg-dark-200 p-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedObjects([])
                  setOpenModal(false)
                }}
                disabled={submitLoading}>
                Cancel
              </Button>
              <Button
                className=" "
                isLoading={submitLoading}
                onClick={() => {
                  console.log('Selected deals:', selectedObjects);
                }}
                disabled={submitLoading || selectedObjects.length < 1}>
                Add
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
