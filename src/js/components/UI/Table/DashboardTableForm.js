const DashboardTableForm = ({ openModal, setOpenModal, title, path, portalId, hubspotObjectTypeId, apis, refetch, companyAsMediator, urlParam }) => {

  const { sync, setSync } = useSync();
  const [data, setData] = useState([]);
  const [addAnother, setAddAnother] = useState(false);
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
        // return setData(response.data.properties)
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
  const resetRef = useRef(null);

  const createValidationSchema = (data) => {
    const schemaShape = {};

    data.forEach((field) => {
      const isDomain = field.name === 'domain'
      if ((field.requiredField || field.primaryProperty) && !isDomain) {
        schemaShape[field.name] = z.string().nonempty({
          message: `${field.customLabel || field.label} is required.`,
        });
      } else if (isDomain) {
        schemaShape[field.name] = z.string().refine(
          (value) => {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return domainRegex.test(value);
          },
          {
            message: "Invalid domain format",
          }
        );
      } else {
        schemaShape[field.name] = z.string().nullable();
      }
    });
    return z.object(schemaShape);
  };

  const validationSchema = createValidationSchema(data);

  const { mutate: addData, isLoading: submitLoading } = useMutation({
    mutationKey: ["addData"],
    mutationFn: async ({ formData, addAnother }) => {
      try {
        const mUrlParam = updateParamsFromUrl(apis.createAPI, { ...getQueryParamsToObject(urlParam), addAnother: addAnother ? "true" : "false" })
        const API_ENDPOINT = removeAllParams(apis.createAPI)
        const API = addParam(API_ENDPOINT, mUrlParam)
        const response = await Client.form.create({
          // API: `${apis.createAPI}${ apis.createAPI.includes('isPrimaryCompany') || !companyAsMediator ? `` : `?isPrimaryCompany=${companyAsMediator}`}`,
          API: API,
          data: formData
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response, variables) => {
      setAlert({ message: response.statusMsg, type: "success" });
      if (!variables.addAnother) {
        setOpenModal(false);
      } else {
        resetRef.current?.(); // Reset form after successful submission
      }
    },

    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        const errors = error.response.data.validationErrors;
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
        property.name === "hs_pipeline_stage" || property.name === "dealstage"
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

  const onSubmit = (formData) => {
    addData({ formData, addAnother });
  };

  const onChangeSelect = (filled, selectedValue) => {
    if (filled.name === "hs_pipeline" || filled.name === "pipeline") {
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
      <Dialog open={openModal} onClose={setOpenModal} className="bg-cleanWhite dark:bg-dark-200  rounded-md sm:min-w-[600px] min-w-[305px] max-h-[95vh] overflow-y-auto">
        <div>
          <h3 className="text-start text-xl dark:text-white font-semibold mb-4">
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
                className="dark:bg-dark-200 !m-0"
              >
                {({ register, control, formState: { errors }, reset }) => {
                  resetRef.current = reset;
                  return (
                    <div>
                      <div className="text-gray-800 dark:text-gray-200">
                        {data.map((filled) => (
                          <div>
                            <FormItem className=''>
                              <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                                {filled.customLabel}
                              </FormLabel>
                              {/* {filled.fieldType == 'select' || (filled.name == 'dealstage' && filled.fieldType == 'radio' && hubspotObjectTypeId === env.HUBSPOT_DEFAULT_OBJECT_IDS.deals) ?
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
                            } */}

                              <FormControl>
                                <div>
                                  {
                                    filled.fieldType == 'select' || (filled.name == 'dealstage' && filled.fieldType == 'radio' && hubspotObjectTypeId === env.HUBSPOT_DEFAULT_OBJECT_IDS.deals) ? (
                                      <Select
                                        label={`Select ${filled.customLabel}`}
                                        name={filled.name}
                                        options={filled.options}
                                        control={control}
                                        filled={filled}
                                        onChangeSelect={onChangeSelect}
                                      />
                                    ) : filled.fieldType === 'textarea' ? (
                                      <Textarea
                                        height="medium"
                                        placeholder={filled.customLabel}
                                        className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
                                        {...register(filled.name)}
                                      />
                                    ) : filled.fieldType === 'date' ? (
                                      <Input
                                        type="date"
                                        placeholder={`Enter ${filled.customLabel}`}
                                        height="small"
                                        className=""
                                        defaultValue={''}
                                        {...register(filled.name)}
                                      />
                                    )
                                      : filled.fieldType === 'number' ? (
                                        <Input
                                          type="number"
                                          placeholder={filled.customLabel}
                                          className=""
                                          {...register(filled.name)}
                                        />
                                      ) : (
                                        <Input
                                          // type={filled.fieldType}
                                          placeholder={filled.customLabel}
                                          className=""
                                          {...register(filled.name)}
                                        />
                                      )
                                  }
                                </div>
                              </FormControl>

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
                          disabled={submitLoading}
                        >
                          Cancel
                        </Button>

                        <Button
                          className=" "
                          isLoading={submitLoading && !addAnother}
                          onClick={() => setAddAnother(false)}
                          disabled={submitLoading}
                        >
                          Create
                        </Button>

                        <Button
                          className=" "
                          isLoading={submitLoading && addAnother}
                          onClick={() => setAddAnother(true)}
                          disabled={submitLoading}
                        >
                          Create and add another
                        </Button>
                      </div>
                    </div>
                  )
                }}
              </Form>
            </div>
          }
        </div>
      </Dialog>
    </div>
  );
};
