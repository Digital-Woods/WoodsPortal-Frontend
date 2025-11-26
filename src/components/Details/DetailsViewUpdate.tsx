import { CloseIcon } from "@/assets/icons/closeIcon";
import { EditIcon } from "@/assets/icons/editIcon";
import { IconTickSmall } from "@/assets/icons/tickIcon";
import { Client } from "@/data/client";
import { useToaster } from "@/state/use-toaster";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import z from "zod";
import { Button } from "../ui/Button";
import { CheckboxField } from "../ui/checkboxes/MultipleCheckBox";
import { DateTimeInput } from "../ui/DateTime/DateTimeInput.tsx";
import { Dialog } from "../ui/Dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage, Textarea, Input } from "../ui/Form";
import { Select } from "../ui/Select";
import { DetailsViewEditor } from "./DetailsViewEditor";
import { useUpdateLink } from "@/utils/GenerateUrl.ts";
import { isObject } from "@/utils/DataMigration.tsx";
import { useSync } from "@/state/use-sync.ts";
import { DetailsViewPipelineUpdateDialog } from "./DetailsViewPipelineUpdateDialog.tsx";
import { DetailsViewMultiSelectUpdateDialog } from "./DetailsViewMultiSelectUpdateDialog.tsx";
import { DetailsViewDateTimeDialog } from "./DetailsViewDateTimeDialog.tsx";

export const DetailsViewUpdateDD = ({
  control,
  optionData,
  data,
  objectTypeId,
  onChangeSelect = null,
}: any) => {
  const { setToaster } = useToaster();
  const [options, setOptions] = useState<any>([]);

  const getValue = (value: any, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value?.label : value?.value;
    return value;
  };

  const { mutate: getStags, isLoading }: any = useMutation({
    mutationKey: ["getStageData1"],
    mutationFn: async (props) => {
      const {pipelineId, isNewValue }: any = props
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
    onSuccess: async (response: any) => {
      setOptions([]);
      setOptions((value: any) => response?.data);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    if (
      !optionData?.apidata &&
      (optionData?.key === "dealstage" ||
        optionData?.key === "hs_pipeline_stage")
    ) {
      const dataLoop =
        typeof data === "object" && !Array.isArray(data)
          ? Object.keys(data)
          : data;
      const found = dataLoop.find(
        (item: any) => item.key === "hs_pipeline" || item.key === "pipeline"
      );
      if (found) getStags({pipelineId: getValue(found.value, "value"), isNewValue: true, setValue: null});
    } else {
      setOptions(optionData?.options);
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
        name={optionData?.key}
        options={options}
        control={control}
        filled={optionData}
        onChangeSelect={onChangeSelect}
      />
    </div>
  );
};



// Main Component Starts Here
export const DetailsViewUpdate = ({
  renderValue,
  objectId,
  id,
  refetch,
  keyName,
  value,
  item,
  urlParam,
  isUpdating,
  setIsUpdating,
  editRowKey,
  setEditRowKey,
  isAssociations = false,
  panelRef
}: any) => {
  const [editRow, setEditRow] = useState<any>(null);
  const { setToaster } = useToaster();
  const [pipelineDialog, setPipelineDialog] = useState<boolean>(false);
  const [multiSelectDialog, setMultiSelectDialog] = useState<boolean>(false);
  const [dateTimeDialog, setDateTimeDialog] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [stages, setStages] = useState<any>(null);
  const [initialValues, setInitialValues] = useState<any>(false);
  const [selectedValues, setSelectedValues] = useState<any>();
  const {updateLink} = useUpdateLink();
    const { setSync } = useSync();

  // checking if data is object
  useEffect(() => {
    // check data is object or array
    if (typeof item === "object" && !Array.isArray(item)) {
      let arrayKeys = Object.keys(item);
      let dataArray: any = [];
      arrayKeys.forEach((element) => {
        dataArray.push({ ...item[element], key: element });
      });
      setData(dataArray);
    } else {
      setData(item);
    }
  }, [item]);

  // Additional
  const getValue = (value: any, type = "label") => {
    if (value && typeof value === "object")
      return type === "label" ? value?.label : value?.value;
    return value;
  };

  // const createValidationSchema = (data: any) => {
  //   const schemaShape: any = {};
  //   schemaShape[value.key] = z.string().nonempty({
  //     message: `${value.label} is required.`,
  //   });
  //   return z.object(schemaShape);
  // };

  const createValidationSchema = (data: any) => {
  const schemaShape: any = {};

    if (!value) return z.object({});

    // Phone number validation (123-456-7890)
    if (value?.key.toLowerCase().includes("phone")) {
      schemaShape[value?.key] = z
        .string()
        .regex(
          /^\+?[0-9]{1,4}?[-.\s]?\(?[0-9]{1,5}\)?([-.\s]?[0-9]{1,5}){1,4}$/,
          {
            message: `${value?.label || "Phone number"} must be a valid phone number with optional country code`,
          }
        );
    } 
    // Domain validation (e.g., digitalwoods.io)
    else if (value?.key.toLowerCase().includes("domain")) {
      schemaShape[value?.key] = z
        .string()
        .regex(
          /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
          {
            message: `${value?.label || "Domain"} must be a valid domain (e.g., digitalwoods.io)`,
          }
        );
    } else if (value?.key.includes("email")) {
      schemaShape[value?.key] = z
        .string()
        .email({
          message: `${value?.label || "Email"} must be a valid email address`,
        });
    } else if (value?.key.toLowerCase().includes("zip") || value?.key.toLowerCase().includes("postal")) {
      schemaShape[value?.key] = z
        .string()
        .regex(
          /^[A-Za-z0-9][A-Za-z0-9\s\-]{2,10}$/,
          {
            message: `${value?.label || "Postal Code"} must be a valid ZIP/Postal code (e.g., 12345, 12345-6789, SW1A 1AA, H0H 0H0, 734426)`,
          }
        );
    }
    // Default: non-empty string
    else {
      schemaShape[value?.key] = z.string().nonempty({
        message: `${value?.label || value?.key} is required.`,
      });
    }

    return z.object(schemaShape);
  };

  const validationSchema = createValidationSchema(data);

  const { mutate: saveData, isLoading } = useMutation({
    mutationKey: ["saveData"],
    mutationFn: async (payload: any) => {
      try {
        const response = await Client.details.update({
          data: payload,
          params: {
            objectTypeId: objectId,
            recordId: id,
          },
          queryParams: urlParam,
        });
        if(value?.isPrimaryDisplayProperty) { // if is display primary then update breadcrumb name
          const value = isObject(payload) ? Object.values(payload)[0] : "";
          if(value) {
            updateLink({
              n: value
            }, "")
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data: any) => {
      setPipelineDialog(false);
      setMultiSelectDialog(false);
      setDateTimeDialog(false);
      setEditRow(null);
      setSync(true);
      // refetch();
      setToaster({ message: data?.statusMsg, type: "success" });
      setIsUpdating(false);
      setEditRowKey(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({ message: errorMessage, type: "error" });
      setIsUpdating(false);
      setEditRowKey(null);
    },
  });
  useEffect(() => {
      if (setIsUpdating){
        setIsUpdating(isLoading);
      };
  }, [isLoading,setIsUpdating]);
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

  const setEditRowValueFunction = (row: any) => {

    if (row && (row?.key === "hs_pipeline" || row?.key === "pipeline")) {
      setPipelineDialog(true);
    }
    // setEditRowValue(getValue(value.value));
    // if (row.key === "hs_pipeline_stage" || row.key === "hs_pipeline_stage") {
    //   const found = data.find((item) => item.key === "hs_pipeline");
    //   getStags(getValue(found.value, "value"));
    // }

    if (row && row?.fieldType === "checkbox") {

      if(isAssociations) setMultiSelectDialog(true);

      // setSelectedValues(
      //   Array.isArray(row?.value) ? row?.value.map((item: any) => item?.value) : []
      // );

      const sValue = row?.value.map((item: any) => item.value).join(";");
      setSelectedValues(sValue);
    }
    if (row && row?.type === "date" || row?.type === "datetime") {
      if(isAssociations) setDateTimeDialog(true)
    }
    setEditRow({...row, ...{name: keyName}});

    const mValue: any = value.value;
    // if (value.fieldType == "date") {
    //   setInitialValues({
    //     [value.key]:
    //       typeof mValue === "object" && mValue !== null && "value" in mValue
    //         ? formatDate(mValue.value, "input")
    //         : formatDate(mValue, "input"),
    //   });
    // } else {
      
      setInitialValues({
        [value?.key]:
          typeof mValue === "object" && mValue !== null && "value" in mValue
            ? mValue?.value
            : mValue,
      });
    // }
  };

  // const onSubmitPipeline = (data) => {
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

  const onSubmit = (data: any) => {
    if (!data && editRow?.fieldType != "checkbox") {
      return;
    }

    if (editRow?.fieldType === "checkbox") {
      const formattedData: any = {
        [editRow?.key]: selectedValues
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

  const onChangeSelect = (filled: any, selectedValue: any) => {
      setSelectedValues(selectedValue);
  };

  return (
    <div className="">
      <div className="gap-2">
        {editRow && !pipelineDialog ? (
          <div>
            <Form
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              initialValues={initialValues}
              // serverError={serverError}
              className=" m-0"
            >
              {({ register, control, setValue, formState: { errors } }: any) => (
                <div className="flex gap-2 w-full items-center">
                  <div className="text-gray-800 flex-1 dark:text-gray-200">
                    <FormItem className="mb-0 w-full">
                      <FormControl>
                        {editRow.fieldType === "select" ||
                        editRow.fieldType === "radio" || 
                        editRow.fieldType === "booleancheckbox" ? (
                          <DetailsViewUpdateDD
                            optionData={editRow}
                            control={control}
                            data={data}
                            objectTypeId={objectId}
                          />
                        ) : editRow.fieldType === "textarea" ? (
                          <Textarea
                            rows="4"
                            placeholder={`Enter ${editRow?.label}`}
                            defaultValue={getValue(editRow?.value)}
                            {...register(editRow?.key)}
                          ></Textarea>
                        ) : editRow?.fieldType === "html" ? (
                          <DetailsViewEditor
                            openModal={true}
                            setOpenModal={null}
                            title={editRow?.label}
                            value={editRow?.value}
                            setEditRow={setEditRow}
                            saveData={saveData}
                            control={control}
                            setValue={setValue}
                            name={editRow?.key}
                            isLoading={isLoading}
                            objectId={objectId}
                            id={id}
                            urlParam={urlParam}
                            refetch={refetch}
                            setEditRowKey={setEditRowKey}
                          />
                        ) : editRow?.fieldType === "checkbox" ? (
                          <Select
                            label={`Select ${editRow?.customLabel}`}
                            name={editRow?.name}
                            options = {(editRow?.name === "hs_pipeline" || editRow?.name === "pipeline") && specPipeLine
                              ? editRow?.options.filter((option: any) => option?.value === pipeLineId)
                              : editRow?.options}
                            control={control}
                            editRow={editRow}
                            onChangeSelect={onChangeSelect}
                            disabled={editRow?.hidden}
                            setValue={editRow?.hidden ? setValue : null}
                            isMulti={editRow?.fieldType == "checkbox" ? true : false}
                            isClearable={true}
                            defaultValue={value?.value}
                          />
                        ) : editRow.fieldType === "date" ? (
                          <DateTimeInput
                            control={control}
                            name={editRow?.name}
                            type={editRow?.type}
                            dateFormat="dd-mm-yyyy"
                            height="small"
                            className=""
                            setValue={setValue}
                            defaultValue={editRow?.value}
                            time={editRow?.type === "datetime" ? true : false}
                            {...register(editRow?.key)}
                            panelRef={panelRef}
                          />
                        ) : editRow.fieldType === "number" ? (
                          <Input
                            control={control}
                            type="number"
                            placeholder={`Enter ${editRow.label}`}
                            height="small"
                            className=""
                            defaultValue={getValue(editRow?.value)}
                            {...register(editRow?.key)}
                          />
                        ): editRow.fieldType === "phonenumber" ? (
                          <Input
                            type="tel"
                            placeholder={`Enter ${editRow?.label}`}
                            height="small"
                            className=""
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            defaultValue={getValue(editRow?.value)}
                            {...register(editRow?.key)}
                          />
                        ) : (
                          <Input
                            placeholder={`Enter ${editRow?.label}`}
                            height="small"
                            className=""
                            defaultValue={getValue(editRow?.value)}
                            {...register(editRow?.key)}
                          />
                        )}
                      </FormControl>

                      {editRow.fieldType != "checkbox" &&
                        errors[editRow.key] && (
                          <FormMessage className="text-xs text-red-600 dark:text-red-400">
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
                      disabled={isLoading && isUpdating}
                    >
                      <span className="text-secondary dark:text-white">
                        <IconTickSmall />
                      </span>
                    </Button>
                    <Button
                      variant="hubSpot"
                      size="hubSpot"
                      onClick={() => {
                        setEditRow(null);
                        setEditRowKey(null);
                      }}
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
            {value?.isEditableField &&
            (value?.key === "pipeline" || value?.key === "hs_pipeline") &&
            value?.options.length < 2 ? null : (
              <Button
                variant="hubSpot"
                size="hubSpot"
                onClick={() => {
                  setEditRowValueFunction(value);
                  setEditRowKey(value?.key);
                }}
                disabled={isUpdating || editRowKey && editRowKey !== value?.key}
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
        <DetailsViewPipelineUpdateDialog
          setEditRow={setEditRow}
          pipelineDialog={pipelineDialog}
          setPipelineDialog={setPipelineDialog}
          objectId={objectId}
          value={value}
          editRow={editRow}
          data={data}
          saveData={saveData}
          isLoading={isLoading}
          setEditRowKey={setEditRowKey}
        />
      )}

      {dateTimeDialog && (
        <DetailsViewDateTimeDialog
          setEditRow={setEditRow}
          dateTimeDialog={dateTimeDialog}
          setDateTimeDialog={setDateTimeDialog}
          objectId={objectId}
          value={value}
          editRow={editRow}
          data={data}
          saveData={saveData}
          isLoading={isLoading}
          setEditRowKey={setEditRowKey}
          isAssociations={isAssociations}
        />
      )}
    </div>
  );
};
