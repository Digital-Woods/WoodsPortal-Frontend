
const DetailsViewUpdateDD = ({ control, optionData, data, objectTypeId, onChangeSelect = null }) => {
  const [options, setOptions] = useState([]);

  const getValue = (value, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value.label : value.value;
    return value;
  };

  const { mutate: getStags, isLoading } = useMutation({
    mutationKey: ["getStageData1"],
    mutationFn: async (pipelineId) => {
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
      setOptions(response.data);
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    if (
      optionData?.key === "dealstage" || optionData?.key === "hs_pipeline_stage"
    ) {
      const dataLoop = (typeof data === "object" && !Array.isArray(data)) ? Object.keys(data) : data
      const found = dataLoop.find((item) => item.key === "hs_pipeline" || item.key === "pipeline");
      if (found) getStags(getValue(found.value, "value"));
    } else {
      setOptions(optionData.options);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <Select
      label={`Select`}
      size="semiMedium"
      name={optionData.key}
      options={options}
      control={control}
      filled={optionData}
      onChangeSelect={onChangeSelect}
    />
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
  const [stages, setStages] = useState(null);

  const getValue = (value, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value.label : value.value;
    return value;
  };

  const { mutate: getStags, isLoading: sdfsf } = useMutation({
    mutationKey: ["getStageData1"],
    mutationFn: async (pipelineId) => {
      try {
        const response = await Client.details.stages({
          params: {
            objectTypeId: objectId,
            pipelineId,
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      let stagesM = stages;
      stagesM.options = response.data;
      setStages(stagesM);
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    if (initialValues) {
      setPipelines(editRow);
      getStags(getValue(editRow.value, "value"));

      const dataLoop = (typeof data === "object" && !Array.isArray(data)) ? Object.keys(data) : data
      const filterStage = dataLoop.find(
        (item) =>
          item.key === "hs_pipeline_stage" || item.key === "pipeline" || item.key === "dealstage"
      );
      setStages(filterStage);
    }
  }, [initialValues]);

  useEffect(() => {
    const dataLoop = (typeof data === "object" && !Array.isArray(data)) ? Object.keys(data) : data
    const filterStage = dataLoop.find(
      (item) =>
        item.key === "hs_pipeline_stage" || item.key === "pipeline" || item.key === "dealstage"
    );

    let defValue = {};
    defValue[editRow.key] = getValue(editRow.value, "value");
    if (filterStage) {
      defValue[filterStage.key] = getValue(filterStage.value, "value");
    }
    setInitialValues(defValue);
  }, []);

  const createValidationSchemaPipeline = (data) => {
    // console.log('isObject', isObject(data))
    const schemaShape = {};
    schemaShape[value.key] = z.string().nonempty({
      message: `${value.customLabel || value.label} is required.`,
    });

    const dataLoop = (typeof data === "object" && !Array.isArray(data)) ? Object.keys(data) : data
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
    return z.object(schemaShape);
  };

  const validationSchemaPipeline = createValidationSchemaPipeline(data);

  const onSubmitPipeline = (data) => {
    saveData(data);
  };

  const onChangeSelect = (filled, value) => {
    getStags(value)
  }

  return (
    <Dialog
      open={pipelineDialog}
      onClose={() => setPipelineDialog(false)}
      className=""
    >
      <div className="rounded-md lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)]  flex-col gap-6 flex">
        <h3 className="text-start text-xl dark:text-white font-semibold">Select Pipeline</h3>

        <div>
          {initialValues && (
            <Form
              onSubmit={onSubmitPipeline}
              validationSchema={validationSchemaPipeline}
              initialValues={initialValues}
              // serverError={serverError}
              className="dark:bg-dark-500 m-0"
            >
              {({ register, control, formState: { errors } }) => (
                <div>
                  <div className="text-gray-800 dark:text-gray-200 text-left">
                    {pipelines && (
                      <div>
                        <FormItem className="mb-0">
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
                              onChangeSelect={onChangeSelect}
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
                    {stages && (
                      <div>
                        <FormItem className="mb-0">
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

const DetailsViewUpdate = ({
  renderValue,
  objectId,
  id,
  refetch,
  value,
  item,
}) => {
  const { sync, setSync } = useSync();
  const [editRow, setEditRow] = useState(null);
  const [editRowValue, setEditRowValue] = useState("");
  const [alert, setAlert] = useState(null);
  const [pipelineDialog, setPipelineDialog] = useState(false);
  const [data, setData] = useState(item);
  const [stages, setStages] = useState(null);
  const [initialValues, setInitialValues] = useState(false);
  const { z } = Zod;
  const [selectedValues, setSelectedValues] = useState();

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
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      setPipelineDialog(false);
      setEditRow(null);
      // refetch();
      setSync(true);
      setAlert({ message: data.statusMsg, type: "success" });
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
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
    if (value.fieldType == "date") {
      setInitialValues({
        [value.key]:
          typeof mValue === "object" && mValue !== null && "value" in mValue
            ? formatDate(mValue.value, 'input')
            : formatDate(mValue, 'input'),
      });
    } else {
      setInitialValues({
        [value.key]:
          typeof mValue === "object" && mValue !== null && "value" in mValue
            ? mValue.value
            : mValue,
      });
    }
  };

  // const onSubmitPipeline = (data) => {
  //   // console.log('data', data)
  //   saveData(data);
  // };

  useEffect(() => {
    // console.log(selectedValues, "selectedValues from component");
  }, [selectedValues]);

  const onSubmit = (data) => {

    if(!data && editRow.fieldType != "checkbox"){
      return
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
                          <Input
                            type="date"
                            placeholder={`Enter ${editRow.label}`}
                            height="small"
                            className=""
                            defaultValue={formatDate(
                              getValue(editRow.value),
                              "input"
                            )}
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

                      {errors[editRow.key] && (
                        <FormMessage className="text-red-600 dark:text-red-400">
                          {errors[editRow.key].message}
                        </FormMessage>
                      )}
                    </FormItem>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="hubSpot"
                      size="hubSpot"
                      isLoading={isLoading}
                      onClick={() => onSubmit()}
                    >
                      <IconTickSmall />
                    </Button>
                    <Button
                      variant="hubSpot"
                      size="hubSpot"
                      onClick={() => setEditRow(null)}
                      disabled={isLoading}
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>
        ) : (
          <div className="flex  items-center gap-2">
            <span>{renderValue}</span>
            <Button
              variant="hubSpot"
              size="hubSpot"
              onClick={() => {
                // setEditRow(value);
                setEditRowValueFunction(value);
              }}
            >
              <EditIcon />
            </Button>
          </div>
        )}
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

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
