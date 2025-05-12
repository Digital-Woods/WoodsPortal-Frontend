const DashboardTableExistingForm = ({
  resetRef,
  setOpenModal,
  portalId,
  onSubmit,
  validationSchema,
  serverError,
  existingData,
  submitLoading,
  onChangeSelect,
}) => {
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
      console.log("response", response);
      // setOptions(response.data.results);
    },
    onError: (error) => {
      setErrorMessage(error.response.data.detailedMessage);
    },
  });

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div>
      {isLoading ? (
        <spa>Loading...</spa>
      ) : errorMessage ? (
        <div className="text-center text-warning pb-4">{errorMessage}</div>
      ) : (
        <Form
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
                  <div>
                    <h2 className="text-xl font-bold">Objects</h2>
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
                            // apiEndPoint={`/api/${hubId}/${portalId}/hubspot-object-forms/${existingData.formId}/${existingData.objectTypeId}`}
                            // optionlabel="label"
                            // optionValue="ID"
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
                </div>
                <div className="mt-4 flex justify-end items-end gap-2 flex-wrap sticky bottom-0 bg-white dark:bg-dark-200 p-4 rounded-md">
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
        </Form>
      )}
    </div>
  );
};
