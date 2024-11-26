const DashboardTableEditForm = ({ openModal, setOpenModal, title, path, portalId, hubspotObjectTypeId, apis, showEditData, refetch }) => {
  const { sync, setSync } = useSync();
  const [isSata, setisData] = useState(false);
  const [is1st, setis1st] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [alert, setAlert] = useState(null);
  const { z } = Zod;

  const { mutate: getFormData, isLoading: stageLoadingFormData } = useMutation({
    mutationKey: [
      "getFormData"
    ],
    mutationFn: async () => {
      return await Client.form.formData(
        {
          API: apis.formDataAPI,
          params: {
            objectId: showEditData.hs_object_id
          }
        }
      );
    },
    onSuccess: (response) => {
      if (response.statusCode === "200") {
        const mapData = Object.fromEntries(
          Object.entries(response.data).map(([key, value]) => {
            // if (key === "hs_pipeline" || key === "pipeline") {
            //   getStags(value.value.value);
            // }
            const mValue = value.value;
            return [
              key,
              typeof mValue === 'object' && mValue !== null && 'value' in mValue ? mValue.value : mValue
            ];
          })
        );
        setInitialValues(mapData)
        setDefaultValues(response.data)
      }
    },
    onError: () => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
    },
  });

  // const { mutate: getFormData, isLoading: stageLoadingFormData } = useMutation({
  //   mutationKey: ["getFormData"],
  //   mutationFn: async () => {
  //     try {
  //       const response = await Client.form.formData({
  //         API: apis.formDataAPI,
  //         params: {
  //           objectId: showEditData.hs_object_id
  //         }
  //       });
  //       return response;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   onSuccess: async (response) => {

  //   },
  //   onError: (error) => {
  //     let errorMessage = "An unexpected error occurred.";
  //     setAlert({ message: errorMessage, type: "error" });
  //   },
  // });

  const createValidationSchema = (data) => {
    const schemaShape = {};
    data.forEach((field) => {
      if (field.requiredField || field.primaryProperty) {
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
          API: `${apis.stagesAPI}${pipelineId}/stages`,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      console.log('stage data', data)
      const updatedProperties = data.map((property) =>
        property.name === "hs_pipeline_stage"
          ? { ...property, options: response.data }
          : property
      );
      console.log('updatedProperties', updatedProperties)

      setData(updatedProperties)
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
    },
  });

  // get form
  const { mutate: getData, isLoading } = useMutation({
    mutationKey: [
      "TableFormData"
    ],
    mutationFn: async () => {
      return await Client.form.fields({ API: apis.formAPI });
    },

    onSuccess: (response) => {
      if (response.statusCode === "200") {
        // console.log('getData', response.data.properties)
        // setData(sortFormData(response.data.properties))
        setData(response.data.properties)
        setisData(true)
        // setis1st(!is1st ? true : false)
      }
    },
    onError: () => {
      setData([]);
      setisData(false)
      // setis1st(false)
    },
  });

  const { mutate: editData, isLoading: submitLoading } = useMutation({
    mutationKey: ["editData"],
    mutationFn: async (input) => {
      try {
        const response = await Client.form.update({
          API: apis.updateAPI.replace(":formId", showEditData.hs_object_id),
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
    if (filled.name === "hs_pipeline" || filled.name === "pipeline") {
      getStags(selectedValue)
    }
  };

  // useEffect(() => {
  //   if (isSata) {
  //     const mapData = Object.fromEntries(
  //       Object.entries(showEditData).map(([key, value]) => {
  //         if (key === "hs_pipeline" || key === "pipeline") {
  //           getStags(value.value);
  //         }
  //         return [
  //           key,
  //           typeof value === 'object' && value !== null && 'value' in value ? value.value : value
  //         ];
  //       })
  //     );
  //     console.log('mapData', mapData)
  //     setInitialValues(mapData)
  //   }
  // }, [showEditData, isSata]);
  useEffect(() => {
    console.log('initialValues', initialValues)
    if (initialValues) getData();
  }, [initialValues,]);

  useEffect(() => {
    getFormData();

  }, []);

  useEffect(() => {
    if (isSata) {
      console.log('defaultValues', defaultValues)
      const mapData = Object.fromEntries(
        Object.entries(defaultValues).map(([key, value]) => {
          if (key === "hs_pipeline" || key === "pipeline") {
            getStags(value.value.value);
          }
          return [
            key,
            typeof value === 'object' && value !== null && 'value' in value ? value.value : value
          ];
        })
      );
      // setInitialValues(mapData)
    }
  }, [showEditData, isSata]);
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
          {isLoading || stageLoadingFormData ?
            <div className="loader-line"></div>
            :
            <div className="w-full text-left">
              <Form
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                serverError={serverError}
                initialValues={initialValues}
                className="dark:bg-[#181818] m-0"
              >
                {({ register, control, formState: { errors } }) => (
                  <div>
                    <div className="text-gray-800 dark:text-gray-200">
                      {data.map((filled) => (
                        <div>
                          <FormItem className="mb-0">
                            <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                              {filled.customLabel}
                            </FormLabel>
                            {/* {filled.fieldType == 'select' ?
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
                                      className=""
                                      {...register(filled.name)}
                                    />
                                  ) : (
                                    <Input
                                      height="medium"
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
                      >
                        Calcel
                      </Button>
                      <Button
                        className=" "
                        isLoading={submitLoading}
                      >
                        Save {title}
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
