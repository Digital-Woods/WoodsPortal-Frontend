const DashboardTableForm = ({
  type = "create",
  openModal,
  setOpenModal,
  title,
  path,
  portalId,
  hubspotObjectTypeId,
  apis,
  refetch,
  companyAsMediator,
  urlParam,
  parentObjectTypeId,
  parentObjectRowId,
  info,
}) => {
  // const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("addNew");
  const [validationSchema, setValidationSchema] = useState([]);
  const [properties, setProperties] = useState([]);
  const [objects, setObjects] = useState([]);
  const [existingData, setExistingData] = useState(null);
  const [data, setData] = useState(null);
  const [addAnother, setAddAnother] = useState(false);
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  // const [addNewTitle, setAddNewTitle] = useState(false);
  // const [addExistingTitle, setAddExistingTitle] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [objectName, setObjectName] = useState("");
  const { setSync } = useSync();
  const { setToaster } = useToaster();

  const [serverError, setServerError] = useState(null);
  const { z } = Zod;
  const resetRef = useRef(null);

  useEffect(() => {
    if (data) {
      const groupedProperties = Object.values(
        data.properties.reduce((acc, prop) => {
          const group = prop.groupName;
          if (!acc[group]) {
            acc[group] = {
              groupName: group
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              properties: [],
            };
          }
          acc[group].properties.push(prop);
          return acc;
        }, {})
      );
      setProperties(groupedProperties);
      setObjects(data.objects);
    }
  }, [data]);

  const { mutate: getData, isLoading } = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async () => {
      return await Client.form.fields({ API: apis.formAPI });
    },

    onSuccess: (response) => {
      if (response.statusCode === "200") {
        setData(response.data);

        const properties = response?.data?.properties
          ? response.data.properties.map((data) => ({
              ...data,
              type: "properties",
            }))
          : [];

        const objects = response?.data?.objects
          ? response.data.objects.map((data) => ({
              ...data,
              type: "objects",
            }))
          : [];

        setValidationSchema(
          createValidationSchema([...properties, ...objects])
        );
      }
    },
    onError: () => {
      setProperties([]);
      setObjects([]);
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const createValidationSchema = (data) => {
    const schemaShape = {};

    data.forEach((field) => {
      const isDomain = field.name === "domain";
      if (field.requiredField && field.type === "objects") {
        schemaShape[field.name] = z
          .any()
          .refine((val) => Array.isArray(val) && val.length > 0, {
            message: `${
              field?.labels?.plural || field?.customLabel || field?.label
            } must be a non-empty list.`,
          });
      } else if ((field.requiredField || field.primaryProperty) && !isDomain) {
        schemaShape[field.name] = z.string().nonempty({
          message: `${
            field?.labels?.plural || field?.customLabel || field?.label
          } is required.`,
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
        if (field.type === "objects") {
          schemaShape[field.name] = z.any().nullable();
        } else {
          schemaShape[field.name] = z.string().nullable();
        }
      }
    });
    return z.object(schemaShape);
  };

  const { mutate: addData, isLoading: submitLoading } = useMutation({
    mutationKey: ["addData"],
    mutationFn: async ({ formData, addAnother }) => {
      try {
        const mUrlParam = updateParamsFromUrl(apis.createAPI, {
          ...getQueryParamsToObject(urlParam),
          addAnother: addAnother ? "true" : "false",
        });
        const API_ENDPOINT = removeAllParams(apis.createAPI);
        const API = addParam(API_ENDPOINT, mUrlParam);
        const response = await Client.form.create({
          // API: `${apis.createAPI}${ apis.createAPI.includes('isPrimaryCompany') || !companyAsMediator ? `` : `?isPrimaryCompany=${companyAsMediator}`}`,
          API: API,
          data: formData,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response, variables) => {
      setToaster({ message: response?.statusMsg, type: "success" });
      if (!addAnother) {
        // setSync(true);
        // refetch({
        //   filterPropertyName: "hs_pipeline",
        //   filterOperator: "eq",
        //   filterValue: ""
        // });
        refetch(response);
      }
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

      setToaster({ message: errorMessage, type: "error" });
    },
  });

  const { mutate: addExistingData, isLoading: submitExistingDataLoading } =
    useMutation({
      mutationKey: ["addExistingData"],
      mutationFn: async ({ formData }) => {
        try {
          const response = await Client.form.createExisting({
            API: apis.createExistingAPI,
            params: {
              fromObjectTypeId: parentObjectTypeId,
              fromRecordId: parentObjectRowId,
              toObjectTypeId: hubspotObjectTypeId,
            },
            data: formData,
          });
          return response;
        } catch (error) {
          throw error;
        }
      },
      onSuccess: async (response) => {
        await setToaster({ message: response?.statusMsg, type: "success" });
        setSync(true);
        setOpenModal(false);
        resetRef.current?.(); // Reset form after successful submission
      },

      onError: (error) => {
        let errorMessage = "An unexpected error occurred.";

        if (error.response && error.response.data) {
          const errorData = error.response.data.detailedMessage;
          const errors = error.response.data.validationErrors;
          setServerError(errors);

          errorMessage =
            typeof errorData === "object"
              ? JSON.stringify(errorData)
              : errorData;
        }

        setToaster({ message: errorMessage, type: "error" });
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
      const updatedProperties = {
        ...data,
        properties: data.properties.map((property) =>
          property.name === "hs_pipeline_stage" || property.name === "dealstage"
            ? { ...property, options: response.data }
            : property
        ),
      };
      setData(updatedProperties);
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  function formPaylod(data1, data2) {
    const propertyNames = data1.properties.map((prop) => prop.name);
    const objectNames = data1.objects.map((obj) => obj.name);
    const objectTypeMap = data1.objects.reduce((acc, obj) => {
      acc[obj.name] = obj.objectTypeId;
      return acc;
    }, {});

    const propertyPayload = {};
    const objectPayload = [];

    for (const key in data2) {
      if (propertyNames.includes(key) && !objectNames.includes(key)) {
        propertyPayload[key] = data2[key];
      } else if (objectNames.includes(key)) {
        const value = data2[key];
        const recordId = Array.isArray(value) ? value.map((v) => v.ID) : [];

        objectPayload.push({
          objectTypeId: objectTypeMap[key],
          recordId,
        });
      }
    }

    // Ensure all objects from data1.objects are represented
    data1.objects.forEach((obj) => {
      if (!objectPayload.find((o) => o.objectTypeId === obj.objectTypeId)) {
        objectPayload.push({
          objectTypeId: obj.objectTypeId,
          recordId: [],
        });
      }
    });

    return {
      propertyPayload,
      objectPayload,
    };
  }

  const onSubmit = (formData) => {
    if (activeTab === "addExisting") {
      const key = Object.keys(formData)[0];
      const payload = {
        addIds: formData[key].map((item) => Number(item.value)),
      };

      addExistingData({ formData: payload });
    } else {
      const payload = formPaylod(data, formData);
      addData({ formData: payload, addAnother });
    }
  };

  const onChangeSelect = (filled, selectedValue) => {
    if (filled.name === "hs_pipeline" || filled.name === "pipeline") {
      getStags(selectedValue);
    }
  };

  const onChangeActiveTab = (active) => {
    setActiveTab(active);
    if (active === "addExisting") {
      const data = {
        name: title,
        labels: {
          singular: title,
          plural: title,
        },
        objectTypeId: hubspotObjectTypeId,
        requiredField: true,
        formId: info?.parentDefaultForm || info?.defaultForm,
        type: "objects",
      };
      setExistingData(data);
      setValidationSchema(createValidationSchema([{ ...data }]));
    }
  };

  useEffect(() => {
    const last = breadcrumbs[breadcrumbs.length - 1];
    if (type === "association" && breadcrumbs && breadcrumbs.length > 0) {
      setObjectName(title);
      setDialogTitle(`${activeTab == 'addNew' ? 'Create New' : 'Add New'} ${title} of ${last.name}`);
    } else {
      const singularLastName = last.name.endsWith("s")
        ? last.name.slice(0, -1)
        : last.name;
      setObjectName(singularLastName);
      setDialogTitle(`${activeTab == 'addNew' ? 'Create New' : 'Add New'} ${title}`);
    }
  }, [breadcrumbs, activeTab]);

  return (
    <div>
      <Dialog
        open={openModal}
        onClose={setOpenModal}
        className="bg-cleanWhite dark:bg-dark-200  rounded-md max-h-[95vh] lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] overflow-y-auto px-4 !py-0 object-create-form"
      >
        <div>
          <div className=" py-4 sticky top-0 bg-white dark:bg-dark-200 z-[15]">
          <h3 className="text-start text-xl dark:text-white font-semibold ">
            {dialogTitle}
          </h3>
          {(type === "association" || type === "association_new") && (
            // <div className="border dark:border-none rounded-lg  bg-graySecondary dark:bg-dark-300 border-flatGray w-fit dark:border-gray-700 my-4">
            //   <Tabs
            //     activeTab={activeTab}
            //     setActiveTab={onChangeActiveTab}
            //     onValueChange={onChangeActiveTab}
            //     className="rounded-md "
            //   >
            //     <TabsList>
            //       <TabsTrigger className="rounded-md !bg-primary" value="addNew">
            //         <p className="text-black dark:text-white">
            //           Create New {objectName}
            //         </p>
            //       </TabsTrigger>
            //       <TabsTrigger className="rounded-md !bg-primary" value="addExisting">
            //         <p className="text-black dark:text-white">
            //           Add Existing {objectName}
            //         </p>
            //       </TabsTrigger>
            //     </TabsList>
            //     <TabsContent value="addNew"></TabsContent>
            //     <TabsContent value="addExisting"></TabsContent>
            //   </Tabs>
            // </div>
             <div className=" grid grid-cols-2">
              <Button onClick={()=>onChangeActiveTab('addNew')} variant={activeTab == 'addNew' ? 'default' : 'outline'} className={`w-full !rounded-none ${activeTab != 'addNew' ? 'dark:hover:!bg-dark-500 dark:!bg-dark-300 border-primary dark:border-[#e5e7eb]' : ''}`}>
                Create New {objectName}
              </Button>
              <Button onClick={()=>onChangeActiveTab('addExisting')} variant={activeTab == 'addExisting' ? 'default' : 'outline'} className={`w-full !rounded-none ${activeTab != 'addExisting' ? 'dark:hover:!bg-dark-500 dark:!bg-dark-300 border-primary dark:border-[#e5e7eb]' : ''}`}>
                Add Existing {objectName}
              </Button>
            </div>
          )}
          </div>

          {isLoading ? (
            <div className="loader-line"></div>
          ) : (
            <div className="w-full text-left">
              {activeTab === "addNew" ? (
                <Form
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                  serverError={serverError}
                  className="dark:bg-dark-200 !m-0"
                >
                  {({
                    register,
                    control,
                    setValue,
                    formState: { errors },
                    reset,
                  }) => {
                    resetRef.current = reset;
                    return (
                      <div>
                        <div className="text-gray-800 dark:text-gray-200">
                          {properties.map((group) => (
                            <div key={group.groupName} className="mb-4">
                              <h2 className="text-[15px] font-bold">
                                {group.groupName}
                              </h2>
                              {group.properties.map((filled) => (
                                <div>
                                  <FormItem className="">
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
                                        {filled.fieldType == "select" ||
                                        filled.fieldType == "checkbox" ||
                                        filled.fieldType == "radio" ||
                                        (filled.name == "dealstage" &&
                                          filled.fieldType == "radio" &&
                                          hubspotObjectTypeId ===
                                            env.HUBSPOT_DEFAULT_OBJECT_IDS
                                              .deals) ? (
                                          <Select
                                            label={`Select ${filled.customLabel}`}
                                            name={filled.name}
                                            options={filled.options}
                                            control={control}
                                            filled={filled}
                                            onChangeSelect={onChangeSelect}
                                          />
                                        ) : filled.fieldType === "textarea" ? (
                                          <Textarea
                                            height="medium"
                                            placeholder={filled.customLabel}
                                            className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
                                            {...register(filled.name)}
                                          />
                                        ) : filled.fieldType === "html" ? (
                                          <div className="create-object-editor">
                                            <DashboardTableEditor
                                              title={filled.label}
                                              value={filled.value}
                                              setValue={setValue}
                                              {...register(filled.name)}
                                            />
                                          </div>
                                        ) : filled.fieldType === "date" ? (
                                          <DateTimeInput
                                            type={filled.type}
                                            dateFormat="dd-mm-yyyy"
                                            height="small"
                                            className=""
                                            setValue={setValue}
                                            defaultValue={""}
                                            {...register(filled.name)}
                                          />
                                        ) : filled.fieldType === "number" ? (
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
                                        )}
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
                          ))}

                          {objects.length > 0 && (
                            <div>
                              <h2 className="text-[15px] font-bold">Objects</h2>
                              {objects.map((association) => (
                                <div key={association.name}>
                                  <FormItem className="">
                                    <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                                      {association?.labels?.plural}
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        label={`Select ${association?.labels?.plural}`}
                                        name={association.name}
                                        options={[]}
                                        control={control}
                                        filled={association}
                                        onChangeSelect={onChangeSelect}
                                        apiEndPoint={`/api/${hubId}/${portalId}/hubspot-object-forms/${association.formId}/${association.objectTypeId}`}
                                        optionlabel="label"
                                        optionValue="ID"
                                        setValue={setValue}
                                      />
                                    </FormControl>
                                    {errors[association.name] && (
                                      <FormMessage className="text-red-600 dark:text-red-400">
                                        {errors[association.name].message}
                                      </FormMessage>
                                    )}
                                  </FormItem>
                                </div>
                              ))}
                            </div>
                          )}
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
                    );
                  }}
                </Form>
              ) : (
                <DashboardTableExistingForm
                  resetRef={resetRef}
                  setOpenModal={setOpenModal}
                  portalId={portalId}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                  serverError={serverError}
                  existingData={existingData}
                  setAddAnother={setAddAnother}
                  submitLoading={submitExistingDataLoading}
                  onChangeSelect={onChangeSelect}
                />
              )}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
