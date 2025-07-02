const DetailsViewUpdateDD = ({
  control,
  optionData,
  data,
  objectTypeId,
  onChangeSelect = null,
}) => {
  const { setToaster } = useToaster();
  const [options, setOptions] = useState([]);

  const getValue = (value, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value.label : value.value;
    return value;
  };

  const { mutate: getStags, isLoading } = useMutation({
    mutationKey: ["getStageData1"],
    mutationFn: async (props) => {
      const {pipelineId, isNewValue } = props
      try {
        const response = await Client.details.stages({
          params: {
            objectTypeId: objectTypeId,
            pipelineId,
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      setOptions([]);
      setOptions((value) => response.data);
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    if (
      !optionData.apidata &&
      (optionData?.key === "dealstage" ||
        optionData?.key === "hs_pipeline_stage")
    ) {
      const dataLoop =
        typeof data === "object" && !Array.isArray(data)
          ? Object.keys(data)
          : data;
      const found = dataLoop.find(
        (item) => item.key === "hs_pipeline" || item.key === "pipeline"
      );
      if (found) getStags({pipelineId: getValue(found.value, "value"), isNewValue: true, setValue: null});
    } else {
      // console.log("comes here in else");
      // console.log(optionData.options);
      setOptions(optionData.options);
    }
  }, [data, optionData]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      {/* {JSON.stringify(options)} */}
      <Select
        label={`Select`}
        size="semiMedium"
        name={optionData.key}
        options={options}
        control={control}
        filled={optionData}
        onChangeSelect={onChangeSelect}
      />
    </div>
  );
};

const DetailsViewUpdateDialog = ({
  setEditRow,
  pipelineDialog,
  setPipelineDialog,
  objectId,
  value,
  editRow,
  data,
  saveData,
  isLoading,
}) => {
  const [initialValues, setInitialValues] = useState(null);
  const [pipelines, setPipelines] = useState(null);
  const [stages, setStages] = useState({ options: [], key: "" });
  const [isDealEdit, setIsDealEdit] = useState(false);

  const getValue = (value, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value.label : value.value;
    return value;
  };

  const { mutate: getStags, isLoading: sdfsf } = useMutation({
    mutationKey: ["getStageData1"],
    mutationFn: async (props) => {
      const {pipelineId, isNewValue, setValue } = props
      try {
        const response = await Client.details.stages({
          params: {
            objectTypeId: objectId,
            pipelineId,
          },
        });
        return { response, pipelineId, isNewValue, setValue };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async ({ response, pipelineId, isNewValue, setValue }) => {
      // let stagesM = stages;
      // stagesM.options = response.data;
      const key = isDealEdit ? "dealstage" : "hs_pipeline_stage"
      setStages({
        options: response.data,
        // "isSecondaryDisplayProperty":true,
        // "label":"Ticket status",
        // value: { label: "New", value: "987017750" },
        // "isEditableField":true,
        // "fieldType":"select",
        // "isPrimaryDisplayProperty":false,
        key: key,
        apidata: true,
      });


      if(isNewValue) {
        const defaultItem = response.data.find(item => item.defaultItem === true);
        console.log("defaultItem", defaultItem)
        setValue(key, defaultItem?.value || "")
      }

    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    if (initialValues) {
      setPipelines(editRow);
      if (editRow.value) {
        // console.log(data);

        // getStags(getValue(editRow.value, "value"));
        const dataLoop =
          typeof data === "object" && !Array.isArray(data)
            ? Object.keys(data)
            : data;
        const filterStage = dataLoop.find(
          (item) =>
            // item.key === "hs_pipeline_stage" || item.key === "dealstage" || item.key === "pipeline"
            item.key === "hs_pipeline_stage" || item.key === "dealstage"
        );

        // console.log(filterStage);

        if (filterStage?.key == "dealstage") {
          setIsDealEdit(true);
        }
        // console.log(filterStage);
        setStages(filterStage);
      }
    } else {
      setPipelines(editRow);
    }
  }, [initialValues]);

  useEffect(() => {
    const dataLoop =
      typeof data === "object" && !Array.isArray(data)
        ? Object.keys(data)
        : data;
    const filterStage = dataLoop.find(
      (item) =>
        // item.key === "hs_pipeline_stage" || item.key === "pipeline" || item.key === "dealstage"
        item.key === "hs_pipeline_stage" || item.key === "dealstage"
    );

    let defValue = {};
    defValue[editRow.key] = getValue(editRow.value, "value");
    if (filterStage) {
      defValue[filterStage.key] = getValue(filterStage.value, "value");
    } else {
      defValue["hs_pipeline_stage"] = null;
    }
    setInitialValues(defValue);
  }, []);

  const createValidationSchemaPipeline = (data) => {
    // console.log('isObject', isObject(data))
    const schemaShape = {};
    schemaShape[value.key] = z.string().nonempty({
      message: `${value.customLabel || value.label} is required.`,
    });

    const dataLoop =
      typeof data === "object" && !Array.isArray(data)
        ? Object.keys(data)
        : data;
    dataLoop.forEach((field) => {
      if (
        field.key === "hs_pipeline_stage" ||
        field.key === "pipeline" ||
        field.key === "dealstage"
      ) {
        schemaShape[field.key] = z.string().nonempty({
          message: `${field.customLabel || field.label} is required.`,
        });
      }
    });

    if (
      !Object.prototype.hasOwnProperty.call(schemaShape, "dealstage") &&
      !Object.prototype.hasOwnProperty.call(schemaShape, "hs_pipeline_stage")
    ) {
      schemaShape["hs_pipeline_stage"] = z.string().nonempty({
        message: `Stage is required.`,
      });
    }
    // console.log(schemaShape);
    return z.object(schemaShape);
  };

  const validationSchemaPipeline = createValidationSchemaPipeline(data);

  const onSubmitPipeline = (data) => {
    // console.log(data);
    saveData(data);
  };

  const onChangeSelect = (value, setValue) => {
    getStags({pipelineId: value, isNewValue: true, setValue});

    // const dataLoop = (typeof data === "object" && !Array.isArray(data)) ? Object.keys(data) : data
    // const filterStage = dataLoop.find(
    //   (item) =>
    //     item.key === "hs_pipeline_stage" || item.key === "pipeline" || item.key === "dealstage"
    // );

    // console.log(filterStage);

    // setStages(filterStage);
  };

  return (
    <Dialog
      open={pipelineDialog}
      onClose={() => setPipelineDialog(false)}
      className=""
    >
      <div className="rounded-md lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)]  flex-col gap-6 flex">
        <h3 className="text-start text-xl dark:text-white font-semibold">
          Select Pipeline
        </h3>
        {/* {JSON.stringify(initialValues)} */}
        <div>
          {initialValues && (
            <Form
              onSubmit={onSubmitPipeline}
              validationSchema={validationSchemaPipeline}
              initialValues={initialValues}
              // serverError={serverError}
              className="dark:bg-dark-500 m-0"
            >
              {({
                getValues,
                register,
                control,
                watch,
                formState: { errors },
                setValue
              }) => (
                <div>
                  {/* {JSON.stringify(getValues())} */}
                  <div className="text-gray-800 dark:text-gray-200 text-left flex flex-col gap-2">
                    {pipelines && (
                      <div>
                        <FormItem className="">
                          <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                            Select Pipeline
                          </FormLabel>

                          <FormControl>
                            <DetailsViewUpdateDD
                              label={`Select Pipeline`}
                              optionData={pipelines}
                              control={control}
                              data={data}
                              objectTypeId={objectId}
                              onChangeSelect={(fvalue, value) => onChangeSelect(value, setValue)}
                            />
                          </FormControl>

                          {errors.hs_pipeline && (
                            <FormMessage className="text-red-600 dark:text-red-400">
                              {errors.hs_pipeline.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      </div>
                    )}

                    {/* {JSON.stringify(stages)} */}

                    {stages && (
                      <div>
                        <FormItem className="">
                          <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                            Select Stage
                          </FormLabel>

                          <FormControl>
                            <DetailsViewUpdateDD
                              label={`Select Stage`}
                              optionData={stages}
                              control={control}
                              data={data}
                              objectTypeId={objectId}
                            />
                          </FormControl>

                          {errors.hs_pipeline_stage && (
                            <FormMessage className="text-red-600 dark:text-red-400">
                              {errors.hs_pipeline_stage.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end items-end gap-1">
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => {
                        setPipelineDialog(false);
                        setEditRow(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className=" " isLoading={isLoading}>
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </div>
      </div>
    </Dialog>
  );
};

// Main Component Starts Here
const DetailsViewUpdate = ({
  renderValue,
  objectId,
  id,
  refetch,
  value,
  item,
  urlParam,
}) => {
  const [editRow, setEditRow] = useState(null);
  const { setToaster } = useToaster();
  const [pipelineDialog, setPipelineDialog] = useState(false);
  const [data, setData] = useState([]);
  const [stages, setStages] = useState(null);
  const [initialValues, setInitialValues] = useState(false);
  const { z } = Zod;
  const [selectedValues, setSelectedValues] = useState();

  // checking if data is object
  useEffect(() => {
    // console.log("item updated", item);
    // check data is object or array
    if (typeof item === "object" && !Array.isArray(item)) {
      let arrayKeys = Object.keys(item);
      let dataArray = [];
      arrayKeys.forEach((element) => {
        dataArray.push({ ...item[element], key: element });
      });
      setData(dataArray);
    } else {
      setData(item);
    }
    // console.log(selectedValues, "selectedValues from component");
  }, [item]);

  // Additional
  const getValue = (value, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value.label : value.value;
    return value;
  };

  const createValidationSchema = (data) => {
    const schemaShape = {};
    schemaShape[value.key] = z.string().nonempty({
      message: `${value.label} is required.`,
    });
    return z.object(schemaShape);
  };
  const validationSchema = createValidationSchema(data);

  const { mutate: saveData, isLoading } = useMutation({
    mutationKey: ["saveData"],
    mutationFn: async (payload) => {
      try {
        const response = await Client.details.update({
          data: payload,
          params: {
            objectTypeId: objectId,
            recordId: id,
          },
          queryParams: urlParam,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      // console.log(data);
      setPipelineDialog(false);
      setEditRow(null);
      // setSync(true);
      refetch();
      setToaster({ message: data.statusMsg, type: "success" });
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  // useEffect(() => {
  //   const filterStage = data.find(
  //     (item) =>
  //       item.key === "hs_pipeline_stage" || item.key === "hs_pipeline_stage"
  //   );
  //   setStages(filterStage);
  // }, [item]);

  // useEffect(() => {
  //   // set default value
  //   const mValue = value.value;
  //   setInitialValues({
  //     [value.key] : typeof mValue === 'object' && mValue !== null && 'value' in mValue ? mValue.value : mValue
  //   })

  // }, [value]);

  const setEditRowValueFunction = (row) => {
    if (row && (row.key === "hs_pipeline" || row.key === "pipeline")) {
      setPipelineDialog(true);
    }
    // setEditRowValue(getValue(value.value));
    // console.log("item", item);
    // if (row.key === "hs_pipeline_stage" || row.key === "hs_pipeline_stage") {
    //   const found = data.find((item) => item.key === "hs_pipeline");
    //   getStags(getValue(found.value, "value"));
    // }
    if (row && row.fieldType === "checkbox") {
      setSelectedValues(
        Array.isArray(row.value) ? row.value.map((item) => item.value) : []
      );
    }

    setEditRow(row);

    const mValue = value.value;
    // if (value.fieldType == "date") {
    //   setInitialValues({
    //     [value.key]:
    //       typeof mValue === "object" && mValue !== null && "value" in mValue
    //         ? formatDate(mValue.value, "input")
    //         : formatDate(mValue, "input"),
    //   });
    // } else {
      setInitialValues({
        [value.key]:
          typeof mValue === "object" && mValue !== null && "value" in mValue
            ? mValue.value
            : mValue,
      });
    // }
  };

  // const onSubmitPipeline = (data) => {
  //   // console.log('data', data)
  //   saveData(data);
  // };

  useEffect(() => {}, [selectedValues]);

  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  //   const year = d.getFullYear();
  //   return `${year}/${month}/${day}`;
  // };

  const onSubmit = (data) => {
    if (!data && editRow.fieldType != "checkbox") {
      return;
    }

    if (editRow.fieldType === "checkbox") {
      const formattedData = {
        [editRow.key]: selectedValues
          .map(
            (value) =>
              editRow.options.find((option) => option.value === value)?.value
          )
          .join(";"),
      };
      saveData(formattedData);
    // } else if (editRow.type === "date" || editRow.type === "datetime") {
    //   const formattedDate = Object.fromEntries(
    //     Object.entries(data).map(([key, value]) => {
    //       return [key, parseISTToTimestamp(value)];
    //     })
    //   );
    //   saveData(formattedDate);
    } else {
      saveData(data);
    }
  };

  return (
    <div className="">
      <div className="gap-2">
        {editRow && !pipelineDialog ? (
          <div>
            {/* {console.log("initialValues", initialValues)} */}
            <Form
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              initialValues={initialValues}
              // serverError={serverError}
              className=" m-0"
            >
              {({ register, control, setValue, formState: { errors } }) => (
                <div className="flex gap-2 w-full items-center">
                  <div className="text-gray-800 flex-1 dark:text-gray-200">
                    <FormItem className="!mb-0 w-full">
                      <FormControl>
                        {editRow.fieldType === "select" ||
                        editRow.fieldType === "radio" ? (
                          <DetailsViewUpdateDD
                            optionData={editRow}
                            control={control}
                            data={data}
                            objectTypeId={objectId}
                          />
                        ) : editRow.fieldType === "textarea" ? (
                          <Textarea
                            rows="4"
                            placeholder={`Enter ${editRow.label}`}
                            defaultValue={getValue(editRow.value)}
                            {...register(editRow.key)}
                          ></Textarea>
                        ) : editRow.fieldType === "html" ? (
                          <DetailsViewEditor
                            openModal={true}
                            setOpenModal={null}
                            title={editRow.label}
                            value={editRow.value}
                            setEditRow={setEditRow}
                            saveData={saveData}
                            control={control}
                            setValue={setValue}
                            name={editRow.key}
                            isLoading={isLoading}
                            objectId={objectId}
                            id={id}
                            urlParam={urlParam}
                            refetch={refetch}
                          />
                        ) : editRow.fieldType === "checkbox" ? (
                          <CheckboxField
                            editRow={editRow}
                            saveData={saveData}
                            control={control}
                            setValue={setValue}
                            name={editRow.key}
                            setSelectedValues={setSelectedValues}
                            selectedValues={selectedValues || []}
                          />
                        ) : editRow.fieldType === "date" ? (
                          <DateTimeInput
                            type={editRow.type}
                            dateFormat="dd-mm-yyyy"
                            height="small"
                            className=""
                            setValue={setValue}
                            defaultValue={editRow.value}
                            {...register(editRow.key)}
                          />
                        ) : editRow.fieldType === "number" ? (
                          <Input
                            type="number"
                            placeholder={`Enter ${editRow.label}`}
                            height="small"
                            className=""
                            defaultValue={getValue(editRow.value)}
                            {...register(editRow.key)}
                          />
                        ) : (
                          <Input
                            placeholder={`Enter ${editRow.label}`}
                            height="small"
                            className=""
                            defaultValue={getValue(editRow.value)}
                            {...register(editRow.key)}
                          />
                        )}
                      </FormControl>

                      {editRow.fieldType != "checkbox" &&
                        errors[editRow.key] && (
                          <FormMessage className="text-red-600 dark:text-red-400">
                            {errors[editRow.key]?.message}
                          </FormMessage>
                        )}
                    </FormItem>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="hubSpot"
                      size="hubSpot"
                      isLoading={isLoading}
                      onClick={() => onSubmit()}
                    >
                      <span className="text-secondary dark:text-white">
                        <IconTickSmall />
                      </span>
                    </Button>
                    <Button
                      variant="hubSpot"
                      size="hubSpot"
                      onClick={() => setEditRow(null)}
                      disabled={isLoading}
                    >
                      <span className="text-secondary dark:text-white">
                        <CloseIcon />
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{renderValue || "--"}</span>
            {value.isEditableField &&
            (value.key === "pipeline" || value.key === "hs_pipeline") &&
            value.options.length < 2 ? null : (
              <Button
                variant="hubSpot"
                size="hubSpot"
                onClick={() => setEditRowValueFunction(value)}
              >
                <span className="text-secondary dark:text-white">
                  <EditIcon />
                </span>
              </Button>
            )}
          </div>
        )}
      </div>

      {pipelineDialog && (
        <DetailsViewUpdateDialog
          setEditRow={setEditRow}
          pipelineDialog={pipelineDialog}
          setPipelineDialog={setPipelineDialog}
          objectId={objectId}
          value={value}
          editRow={editRow}
          data={data}
          saveData={saveData}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
