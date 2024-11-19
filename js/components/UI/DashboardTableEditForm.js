const DashboardTableEditForm = ({ openModal, setOpenModal, title, path, portalId, hubspotObjectTypeId, apis, showEditData, refetch }) => {
  const { sync, setSync } = useSync();
  const [isSata, setisData] = useState(false);
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const { z } = Zod;

  const createValidationSchema = (data) => {
    const schemaShape = {};
    data.forEach((field) => {
      if (field.requiredProperty) {
        schemaShape[field.name] = z.string().nonempty({
          message: `${field.customLabel || field.label} is required.`,
        });
      } else {
        schemaShape[field.name] = z.string().nullable();
      }

    });
    return z.object(schemaShape);
  };

  const validationSchema = createValidationSchema(data);

  const { mutate: getStags, isLoading: stageLoading } = useMutation({
    mutationKey: ["getStageData"],
    mutationFn: async (pipelineId) => {
      try {
        const response = await Client.form.stages({
          API: `${apis.stagesAPI}${pipelineId}`,
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

  const { mutate: getData, isLoading } = useMutation({
    mutationKey: [
      "TableFormData"
    ],
    mutationFn: async () => {
      return await Client.form.fields({ API: apis.formAPI });
    },

    onSuccess: (response) => {
      if (response.statusCode === "200") {
        setData(
          response.data.sort((a, b) => {
            if (a.primaryDisplayProperty) return -1;
            if (b.primaryDisplayProperty) return 1;
            if (a.secondaryDisplayProperty) return -1;
            if (b.secondaryDisplayProperty) return 1;
            return 0;
          })
        )
        setisData(true)
      }
    },
    onError: () => {
      setData([]);
      setisData(false)
    },
  });

  const { mutate: editData, isLoading: submitLoading } = useMutation({
    mutationKey: ["editData"],
    mutationFn: async (input) => {
      try {
        const response = await Client.form.update({
          API: `${apis.updateAPI}${showEditData.hs_object_id}`,
          data: input
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      setAlert({ message: response.statusMsg, type: "success" });
      // refetch()
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

  const onSubmit = (data) => {
    editData(data);
  };

  const onChangeSelect = (filled, selectedValue) => {
    if (filled.name === "hs_pipeline") {
      getStags(selectedValue)
    }
  };

  useEffect(() => {
    if (isSata) {
      const mapData = Object.fromEntries(
        Object.entries(showEditData).map(([key, value]) => {
          if (key === "hs_pipeline") {
            getStags(value.value);
          }
          return [
            key,
            typeof value === 'object' && value !== null && 'value' in value ? value.value : value
          ];
        })
      );
      setInitialValues(mapData)
    }
  }, [showEditData, isSata]);

  useEffect(() => {
    getData();
  }, []);

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
            Edit {title}
          </h3>
          {isLoading ?
            <div className="loader-line"></div>
            :
            <div className="w-full text-left">
              <Form
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                serverError={serverError}
                initialValues={initialValues}
                className="dark:bg-[#181818]"
              >
                {({ register, control, formState: { errors } }) => (
                  <div>
                    <div className="text-gray-800 dark:text-gray-200 grid gap-x-4 grid-cols-2">
                      {data.map((filled) => (
                        <div>
                          <FormItem className="mb-0">
                            <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                              {filled.customLabel}
                            </FormLabel>
                            {filled.fieldType == 'select' ?
                              <Select label={`Select ${filled.customLabel}`} name={filled.name} options={filled.options} control={control} filled={filled} onChangeSelect={onChangeSelect} />
                              :
                              <FormControl>
                                <div>
                                  <Input
                                    height="medium"
                                    placeholder={filled.customLabel}
                                    className=""
                                    {...register(filled.name)}
                                  />
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
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          }
        </div>
      </Dialog >
    </div >
  );
};
