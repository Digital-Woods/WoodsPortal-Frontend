const DashboardTableForm = ({ openModal, setOpenModal, title, path, portalId, hubspotObjectTypeId, apis, refetch }) => {
  const { sync, setSync } = useSync();
  const [data, setData] = useState([]);
  const { mutate: getData, isLoading } = useMutation({
    mutationKey: [
      "TableFormData"
    ],
    mutationFn: async () => {
      return await Client.form.fields({ API: apis.formAPI });
    },

    onSuccess: (response) => {
      if (response.statusCode === "200") {
        return setData(sortFormData(response.data.properties))
      }
    },
    onError: () => {
      setData([]);
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const { z } = Zod;

  const createValidationSchema = (data) => {
    const schemaShape = {};

    data.forEach((field) => {
      // if (field.requiredProperty && field.fieldType === 'string') {
      if (field.requiredProperty) {
        // Add validation for required fields based on your criteria
        schemaShape[field.name] = z.string().nonempty({
          message: `${field.customLabel || field.label} is required.`,
        });
      } else {
        schemaShape[field.name] = z.string().nullable();
      }
      // Add more field types as needed, such as numbers, booleans, etc.
      // Example:
      // if (field.type === 'number') {
      //   schemaShape[field.name] = z.number().min(1, {
      //     message: `${field.customLabel || field.label} must be at least 1.`,
      //   });
      // }
    });
    // if (Object.keys(schemaShape).length != 0) return z.object(schemaShape);
    return z.object(schemaShape);
  };

  const validationSchema = createValidationSchema(data);

  const { mutate: addData, isLoading: submitLoading } = useMutation({
    mutationKey: ["addData"],
    mutationFn: async (input) => {
      try {
        const response = await Client.form.create({
          API: apis.createAPI,
          data: input
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      setAlert({ message: response.statusMsg, type: "success" });
      setSync(true)
      setOpenModal(false)
    },

    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        const errors = error.response.data.errors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setAlert({ message: errorMessage, type: "error" });
    },
  });

  const { mutate: getStags, isLoading: stageLoading } = useMutation({
    mutationKey: ["getStageData"],
    mutationFn: async (pipelineId) => {
      try {
        const response = await Client.form.stages({
          API: `${apis.stagesAPI}${pipelineId}/stages`,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      const updatedProperties = data.map((property) =>
        property.name === "hs_pipeline_stage"
          ? { ...property, options: response.data }
          : property
      );
      setData(updatedProperties)
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
    },
  });

  const onSubmit = (data) => {
    addData(data);
  };

  const onChangeSelect = (filled, selectedValue) => {
    if (filled.name === "hs_pipeline") {
      getStags(selectedValue)
    }
  };

  return (
    <div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Dialog open={openModal} onClose={setOpenModal} className="bg-custom-gradient rounded-md sm:min-w-[600px]">
        <div className="rounded-md flex-col gap-6 flex">
          <h3 className="text-start text-xl dark:text-white font-semibold">
            Add {title}
          </h3>
          {isLoading ?
            <div className="loader-line"></div>
            :
            <div className="w-full text-left">
              <Form
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                serverError={serverError}
                className="dark:bg-[#181818]"
              >
                {({ register, control, formState: { errors } }) => (
                  <div>
                    <div className={`text-gray-800 dark:text-gray-200 grid gap-x-4 ${data.length == 2 ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
                      {data.map((filled) => (
                        <div className={filled.fieldType == 'textarea' ? "col-span-2" : ""}>
                          <FormItem className="mb-0">
                            <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                              {filled.customLabel}
                            </FormLabel>
                            {filled.fieldType == 'select' ?
                              <Select label={`Select ${filled.customLabel}`} name={filled.name} options={filled.options} control={control} filled={filled} onChangeSelect={onChangeSelect} />
                              :
                              <FormControl>
                                <div>
                                  {filled.fieldType == 'textarea' ?
                                    <Textarea
                                      height="medium"
                                      placeholder={filled.customLabel}
                                      className=""
                                      {...register(filled.name)}
                                    />
                                    :
                                    <Input
                                      height="medium"
                                      placeholder={filled.customLabel}
                                      className=""
                                      {...register(filled.name)}
                                    />
                                  }
                                </div>
                              </FormControl>
                            }

                            {errors[filled.name] && (
                              <FormMessage className="text-red-600 dark:text-red-400">
                                {errors[filled.name].message}
                              </FormMessage>
                            )}
                          </FormItem>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end items-end gap-1">
                      <Button
                        variant="outline"
                        onClick={() => setOpenModal(false)}
                      >
                        Close
                      </Button>
                      <Button
                        className=" "
                        isLoading={submitLoading}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          }
        </div>
      </Dialog>
    </div>
  );
};
