import { useState, useRef, useEffect } from 'react';
import { env } from "@/env";
import { z } from 'zod';
import { Dialog } from '@/components/ui/Dialog'
import { useSync } from '@/state/use-sync';
import { useBreadcrumb } from '@/state/use-breadcrumb';
import { useMutation } from "@tanstack/react-query";
import { Client } from '@/data/client/index'
import { Form, FormItem, FormLabel, FormControl, Input, FormMessage, Textarea } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { DashboardTableExistingForm } from '@/components/ui/Table/DashboardTableExistingForm'
import { Select } from '@/components/ui/Select'
import { DateTimeInput } from '@/components/ui/DateTime/DateTimeInput.tsx'
import { hubId } from '@/data/hubSpotData'
import { addParam, getQueryParamsToObject, removeAllParams, updateParamsFromUrl } from '@/utils/param';
import { useToaster } from '@/state/use-toaster';
import { DashboardTableEditor } from './DashboardTableEditor';
import { formatCustomObjectLabel } from '@/utils/DataMigration';
import { getFormTitle, getParamDetails, useUpdateLink } from '@/utils/GenerateUrl';
import { ValidationSchemaShape } from '@/utils/ValidationSchema';

export const DashboardTableForm = ({
  componentName = '',
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
  isShowExistingRecord = false,
  specPipeLine,
  pipeLineId,
}: any) => {
  // const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState<any>("addNew");
  const [validationSchema, setValidationSchema] = useState<any>([]);
  const [properties, setProperties] = useState<any>([]);
  const [objects, setObjects] = useState<any>([]);
  const [existingData, setExistingData] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [addAnother, setAddAnother] = useState<any>(false);
  // const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  // const [addNewTitle, setAddNewTitle] = useState<any>(false);
  // const [addExistingTitle, setAddExistingTitle] = useState<any>(false);
  // const [dialogTitle, setDialogTitle] = useState<any>("");
  // const [objectName, setObjectName] = useState<any>("");
  const { setSync, setApiSync } = useSync();
  const { setToaster } = useToaster();

  // const {filterParams} = useUpdateLink();

  const { params } = getParamDetails({ type: componentName });
  const nParams = componentName === 'sidebarTable' ? urlParam : params

  // console.log("params", params)
  // console.log("nParams", nParams)
  // console.log("componentName", componentName)

  const queryString = new URLSearchParams(nParams as any).toString()
  let mParams: any = queryString ? `?${queryString}` : ''

  const { objectName, dialogTitle } = getFormTitle(componentName, title, activeTab);

  const [serverError, setServerError] = useState<any>(null);
  const resetRef = useRef<any>(null);
  const { mutate: getData, isLoading } = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async () => {
      const API = `${apis.formAPI}${mParams}`;
      return await Client.form.fields({ API: API });
    },

    onSuccess: (response: any) => {
      if (response.statusCode === "200") {
        setData(response.data.results);
        setValidationSchema(createValidationSchema(response?.data?.results));
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

  const createValidationSchema: any = (data: any) => {
    let schemaShape: any = {};

    // data.forEach((field: any) => {
      // const isDomain = field.name === "domain";
      // const isNumber = field.fieldType === "number";
      // const isDate = field.fieldType === "date";

      // if (field?.requiredField && field?.fieldRole === "OBJECTS") {
      //   schemaShape[field.name] = z
      //     .any()
      //     .refine((val) => Array.isArray(val) && val.length > 0, {
      //       message: `${field?.labels?.plural || field?.customLabel || field?.label
      //         } must be a non-empty list.`,
      //     });
      // } else if ((field?.requiredField || field?.primaryProperty) && !isDomain && !isNumber && !isDate) {
      //   schemaShape[field.name] = z.string().nonempty({
      //     message: `${field?.labels?.plural || field?.customLabel || field?.label
      //       } is required.`,
      //   });
      // } else if (isNumber) {
      //   let fieldName = field?.labels?.plural || field?.customLabel || field?.label
      //   if (field?.requiredField) {
      //     // REQUIRED number
      //     schemaShape[field?.name] = z
      //       .string()
      //       .nonempty({
      //         message: `${fieldName
      //           } is required`,
      //       })
      //       .refine(
      //         (value: any) => value === null || value === "" || /^\d+$/.test(value),
      //         {
      //           message: `Invalid ${fieldName}`,
      //         }
      //       );
      //   } else {
      //     // OPTIONAL number
      //     schemaShape[field?.name] = z
      //       .string()
      //       .nullable()
      //       .optional()
      //       .refine(
      //         (value: any) => value === null || value === "" || /^\d+$/.test(value),
      //         {
      //           message: `Invalid ${fieldName}`,
      //         }
      //       );
      //   }
      // } else if (isDate) {
      //   let fieldName = field?.labels?.plural || field?.customLabel || field?.label

      //   if (field?.requiredField) {
      //     schemaShape[field?.name] = z
      //       .any()
      //       .refine(val => val !== null && val !== undefined && val !== "", {
      //         message: `${fieldName} is required`,
      //       });
      //   } else {
      //     schemaShape[field?.name] = z
      //       .any()
      //       .nullable()
      //       .optional();
      //   }
      // } else if (isDomain) {
      //   schemaShape[field?.name] = z.string().refine(
      //     (value) => {
      //       const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      //       return domainRegex.test(value);
      //     },
      //     {
      //       message: "Invalid domain format",
      //     }
      //   );
      // } else {
      //   if (field?.fieldRole === "OBJECTS") {
      //     schemaShape[field?.name] = z.any().nullable();
      //   } else {
      //     schemaShape[field?.name] = z.string().nullable();
      //   }
      // }
    // });
    schemaShape = ValidationSchemaShape(data, "name");
    return z.object(schemaShape);
  };

  const { mutate: addData, isLoading: submitLoading } = useMutation({
    mutationKey: ["addData"],
    mutationFn: async ({ formData, addAnother }: any) => {
      try {
        // const mUrlParam = updateParamsFromUrl(apis.createAPI, {
        //   ...getQueryParamsToObject(urlParam),
        //   addAnother: addAnother ? "true" : "false",
        // });
        // const API_ENDPOINT = removeAllParams(apis.createAPI);
        // const API = addParam(API_ENDPOINT, mUrlParam);
        const mAddAnother = addAnother ? "&addAnother=true" : "&addAnother=false"
        const API = `${apis?.createAPI}${mParams ? mParams + mAddAnother : mParams}`;
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
    onSuccess: async (response: any, variables: any) => {
      setToaster({ message: response?.statusMsg, type: "success" });
      if (!addAnother) {
        // setSync(true);
        // refetch({
        //   filterPropertyName: "hs_pipeline",
        //   filterOperator: "eq",
        //   filterValue: ""
        // });
        // refetch(response);
        // setSync(true);
        if (componentName === 'association') {
          setSync(true);
        } else {
          setApiSync(true);
        }
        // refetch();
        // setApiSync(true); // Keeping this as it might be used for other purposes
      }
      if (!variables.addAnother) {
        setOpenModal(false);
      } else {
        resetRef.current?.(); // Reset form after successful submission
      }
    },

    onError: (error: any) => {
      let errorMessage = error?.response?.data?.errorMessage;

      if (error?.response && error?.response?.data) {
        const errorData = error?.response?.data?.errorMessage;
        const errors = error?.response?.data?.validationErrors;
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
      mutationFn: async ({ formData }: any) => {
        try {
          const API = `${apis?.createExistingAPI}${mParams}`;
          const response = await Client.form.createExisting({
            // API: apis.createExistingAPI,
            API: API,
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
      onSuccess: async (response: any) => {
        await setToaster({ message: response?.statusMsg, type: "success" });
        // setSync(true);
        setApiSync(true);
        setOpenModal(false);
        resetRef.current?.(); // Reset form after successful submission
      },

      onError: (error: any) => {
        let errorMessage = error?.response?.data?.errorMessage;

        if (error?.response && error?.response?.data) {
          const errorData = error?.response?.data?.errorMessage;
          const errors = error?.response?.data?.validationErrors;
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
          API: `${apis?.stagesAPI}${pipelineId}/stages`,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response: any) => {
      const updatedProperties = data.map((property: any) =>
        property?.name === "hs_pipeline_stage" || property?.name === "dealstage"
          ? { ...property, options: response?.data }
          : property
      );
      setData(updatedProperties);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  function formPaylod(data1: any, data2: any) {
    const propertyNames = data1
      .filter((item: any) => item?.fieldRole === "PROPERTIES")
      .map((item: any) => item?.name);

    const objectNames = data1
      .filter((item: any) => item.fieldRole === "OBJECTS")
      .map((item: any) => item.name);
    const objects = data1.filter((item: any) => item?.fieldRole === "OBJECTS");

    const objectTypeMap = objects.reduce((acc: any, obj: any) => {
      acc[obj?.name] = obj?.objectTypeId;
      return acc;
    }, {});

    const propertyPayload: any = {};
    const objectPayload: any = [];

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
    objects.forEach((obj: any) => {
      if (!objectPayload.find((o: any) => o?.objectTypeId === obj?.objectTypeId)) {
        objectPayload.push({
          objectTypeId: obj?.objectTypeId,
          recordId: [],
        });
      }
    });

    return {
      propertyPayload,
      objectPayload,
    };
  }

  const onSubmit = (formData: any) => {
    if (activeTab === "addExisting") {
      const key = Object.keys(formData)[0];
      const payload = {
        addIds: formData[key].map((item: any) => Number(item?.value)),
      };
      // const payload = {
      //   addIds: formData.map((item) => Number(item.value)),
      // };
      addExistingData({ formData: payload });
    } else {
      const payload = formPaylod(data, formData);
      addData({ formData: payload, addAnother });
    }
  };

  const onChangeSelect = (filled: any, selectedValue: any) => {
    if (filled.name === "hs_pipeline" || filled?.name === "pipeline") {
      getStags(selectedValue);
    }
  };

  const onChangeActiveTab = (active: any) => {
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
        fieldRole: "OBJECTS",
      };
      setExistingData(data);
      setValidationSchema(createValidationSchema([{ ...data }]));
    }
  };

  // useEffect(() => {
  //   const last: any = breadcrumbs[breadcrumbs.length - 1];
  //   const lastName = formatCustomObjectLabel(last?.name)
  //   const mTitle = formatCustomObjectLabel(title)
  //   if (type === "association" && breadcrumbs && breadcrumbs.length > 0) {
  //     setObjectName(title);
  //     setDialogTitle(`${activeTab == 'addNew' ? `Create a new ${mTitle} for ${nameTrancate(lastName)}`: `Associate an Existing ${mTitle} with ${nameTrancate(lastName)}`}`);
  //   } else {
  //     const singularLastName = lastName?.endsWith("s")
  //       ? lastName.slice(0, -1)
  //       : lastName;
  //     setObjectName(singularLastName);
  //     setDialogTitle(`${activeTab == 'addNew' ? `Create a new ${mTitle.includes('with') ? nameTrancate(mTitle?.replace('with', 'for')) : nameTrancate(mTitle)}` : `Associate an Existing ${nameTrancate(mTitle)}`}`);
  //   }
  // }, [breadcrumbs, activeTab]);

  const panelRef = useRef(null);

  return (
    <div>
      <Dialog

        open={openModal}
        onClose={setOpenModal}
        className="bg-cleanWhite dark:bg-dark-200 lg:max-h-[90vh] md:max-h-[90vh] max-h-[100vh] lg:w-[830px] md:w-[720px] w-[calc(100vw)] overflow-hidden !py-0 CUSTOM-object-create-form"
      >
        <div>
          <div className=" py-4 sticky top-0 bg-white dark:bg-dark-200 z-[15] px-4">
            <div className="text-start text-xl dark:text-white font-semibold  break-all">
              {dialogTitle}
            </div>
            {(type === "association" || type === "association_new") && (isShowExistingRecord) && (
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
                <Button
                  onClick={() => onChangeActiveTab("addNew")}
                  variant={activeTab == "addNew" ? "default" : "outline"}
                  className={`w-full !rounded-none ${activeTab != "addNew"
                      ? "dark:hover:!bg-dark-500 dark:!bg-dark-300 border-primary dark:border-[#e5e7eb]"
                      : ""
                    }`}
                >
                  Create New {objectName}
                </Button>
                <Button
                  onClick={() => onChangeActiveTab("addExisting")}
                  variant={activeTab == "addExisting" ? "default" : "outline"}
                  className={`w-full !rounded-none ${activeTab != "addExisting"
                      ? "dark:hover:!bg-dark-500 dark:!bg-dark-300 border-primary dark:border-[#e5e7eb]"
                      : ""
                    }`}
                >
                  Add Existing {objectName}
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="CUSTOM-loader-line"></div>
          ) : (
            <div className="w-full text-left overflow-hidden">
              {activeTab === "addNew" ? (
                <Form
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                  serverError={serverError}
                  className="dark:bg-dark-200 !m-0 overflow-hidden"
                >
                  {({
                    register,
                    control,
                    setValue,
                    formState: { errors },
                    reset,
                    getValues
                  }: any) => {
                    resetRef.current = () => {
                      const currentValues = getValues();
                      const defaultValues: any = {};
                      data.forEach((field: any) => {
                        if (field.hidden) {
                          defaultValues[field.name] = currentValues[field.name];
                        } else {
                          defaultValues[field.name] = "";
                        }
                      });
                      reset(defaultValues);
                    };
                    return (
                      <div className='pl-4 pr-2'>
                        <div className='relative '>
                          <div ref={panelRef} className="text-gray-800 dark:text-gray-200 relative overflow-auto lg:max-h-[70vh] md:max-h-[60vh] max-h-[90vh] px-2">
                            {/* {data.map((group) => ( */}
                            <div className="mb-4 grid gap-3">
                              {/* <div className="text-[15px] font-bold">
                                  {group.groupName}
                                </div> */}

                              {data.map((filled: any) => (
                                <div key={filled.name}>
                                  {filled?.fieldRole === "PROPERTIES" ? (
                                    <FormItem className={`${filled?.hidden ? 'hidden' : 'visible'}`}>
                                      <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                                        {filled?.customLabel}
                                      </FormLabel>
                                      <FormControl>
                                        <div>
                                          {filled?.fieldType == "select" ||
                                            filled?.fieldType == "checkbox" ||
                                            filled?.fieldType == "booleancheckbox" ||
                                            filled?.fieldType == "radio" ||
                                            (filled?.name == "dealstage" &&
                                              filled?.fieldType == "radio" &&
                                              hubspotObjectTypeId ===
                                              env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS
                                                .deals) ? (
                                            <Select
                                              label={`Select ${filled?.customLabel}`}
                                              name={filled?.name}
                                              options={(filled?.name === "hs_pipeline" || filled?.name === "pipeline") && specPipeLine
                                                ? filled?.options.filter((option: any) => option?.value === pipeLineId)
                                                : filled?.options}
                                              control={control}
                                              filled={filled}
                                              onChangeSelect={onChangeSelect}
                                              disabled={filled?.hidden}
                                              setValue={filled?.hidden ? setValue : null}
                                              isMulti={filled?.fieldType == "checkbox" ? true : false}
                                            />
                                          ) : filled.fieldType === "textarea" ? (
                                            <Textarea
                                              height="medium"
                                              placeholder={filled?.customLabel}
                                              className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
                                              {...register(filled?.name)}
                                            />
                                          ) : filled?.fieldType === "html" ? (
                                            <div className="CUSTOM-create-object-editor">
                                              <DashboardTableEditor
                                                title={filled?.label}
                                                value={filled?.value}
                                                setValue={setValue}
                                                {...register(filled?.name)}
                                              />
                                            </div>
                                          ) : filled?.fieldType === "date" ? (
                                            <DateTimeInput
                                              panelRef={panelRef}
                                              name={filled?.name}
                                              control={control}
                                              filled={filled}
                                              type={filled?.type}
                                              dateFormat="dd-mm-yyyy"
                                              height="small"
                                              className=""
                                              setValue={setValue}
                                              defaultValue={""}
                                              time={filled?.type === "datetime" ? true : false}
                                              {...register(filled?.name)}
                                            />
                                          ) : filled?.fieldType === "number" ? (
                                            <Input
                                              type="number"
                                              placeholder={filled?.customLabel}
                                              className=""
                                              control={control}
                                              {...register(filled?.name)}
                                            />
                                          ) : (
                                            <Input
                                              // type={filled?.fieldType}
                                              placeholder={filled?.customLabel}
                                              className=""
                                              {...register(filled?.name)}
                                            />
                                          )}
                                        </div>
                                      </FormControl>

                                      {errors[filled?.name] && (
                                        <FormMessage className="text-red-600 dark:text-red-400">
                                          {errors[filled?.name].message}
                                        </FormMessage>
                                      )}
                                    </FormItem>
                                  ) : (
                                    <FormItem className="">
                                      <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                                        {filled?.label || filled?.labels?.plural}
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          label={`Select ${filled?.label ||
                                            filled?.labels?.plural
                                            }`}
                                          name={filled.name}
                                          options={[]}
                                          control={control}
                                          filled={filled}
                                          onChangeSelect={onChangeSelect}
                                          apiEndPoint={`/api/${hubId}/${portalId}/hubspot-object-forms/${filled?.formId}/${filled?.objectTypeId}`}
                                          optionlabel="label"
                                          optionValue="ID"
                                          setValue={setValue}
                                          isMulti={filled?.fieldType == "checkbox" ? true : false}
                                        />
                                      </FormControl>
                                      {errors[filled?.name] && (
                                        <FormMessage className="text-red-600 dark:text-red-400">
                                          {errors[filled?.name]?.message}
                                        </FormMessage>
                                      )}
                                    </FormItem>
                                  )}
                                </div>
                              ))}
                            </div>
                            {/* ))} */}
                          </div>
                        </div>
                        <div className="z-[10] flex justify-end items-end gap-2 flex-wrap sticky bottom-0 bg-white dark:bg-dark-200 p-4">
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
                  title={title.includes('with') ? title.replace('with', '') : title}
                />
              )}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
