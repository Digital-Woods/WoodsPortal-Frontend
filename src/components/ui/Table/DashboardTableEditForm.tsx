import { Client } from "@/data/client";
import { useToaster } from "@/state/use-toaster";
import { updateParamsFromUrl, removeAllParams, addParam } from "@/utils/param";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { useState, useEffect } from "react";
import { Button } from "../Button";
import { DateTimeInput } from "../DateTime/DateTimeInput";
import { Dialog } from "../Dialog";
import { Form, FormItem, FormLabel, FormControl, Textarea, FormMessage, Input } from "../Form";
import { Select } from "../Select";
import { DashboardTableEditor } from "./DashboardTableEditor";
import { z } from 'zod';

type FormProps = {
  onSubmit: (data: any) => void;
  validationSchema?: any;
  serverError?: any;
  initialValues?: any;
  className?: string;
  children: (methods: {
    register: any;
    control: any;
    setValue: any;
    formState: { errors: any };
  }) => React.ReactNode; // ✅ Allow render function
};

export const DashboardTableEditForm = ({
  openModal,
  setOpenModal,
  title,
  path,
  portalId,
  hubspotObjectTypeId,
  apis,
  showEditData,
  refetch,
  urlParam,
}: any) => {
  const [isSata, setisData] = useState<any>(false);
  const [defaultValues, setDefaultValues] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(false);
  const [serverError, setServerError] = useState<any>(null);
  const { setToaster } = useToaster();

  const { mutate: getFormData, isLoading: stageLoadingFormData } = useMutation({
    mutationKey: ["getFormData"],
    mutationFn: async () => {
      return await Client.form.formData({
        // API: apis.formDataAPI,
        API: `${apis.formDataAPI}`,
        params: {
          objectId: showEditData.hs_object_id,
        },
      });
    },
    onSuccess: (response: any) => {
      if (response.statusCode === "200") {
        const mapData = Object.fromEntries(
          Object.entries(response.data).map(([key, value]: any) => {
            // if (key === "hs_pipeline" || key === "pipeline") {
            //   getStags(value.value.value);
            // }
            const mValue = value.value;
            return [
              key,
              typeof mValue === "object" && mValue !== null && "value" in mValue
                ? mValue.value
                : mValue,
            ];
          })
        );
        setInitialValues(mapData);
        setDefaultValues(response.data);
      }
    },
    onError: () => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
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
  //     setToaster({ message: errorMessage, type: "error" });
  //   },
  // });

  const createValidationSchema = (data: any) => {
    const schemaShape: any = {};
    data.forEach((field: any) => {
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
    onSuccess: async (response: any) => {
      // console.log('stage data', data)
      const updatedProperties: any = data.map((property: any) =>
        property.name === "hs_pipeline_stage"
          ? { ...property, options: response.data }
          : property
      );
      // console.log('updatedProperties', updatedProperties)

      setData(updatedProperties);
    },
    onError: (error: any) => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  // get form
  const { mutate: getData, isLoading } = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async () => {
      return await Client.form.fields({ API: apis.formAPI });
    },

    onSuccess: (response: any) => {
      if (response.statusCode === "200") {
        // console.log('getData', response.data.properties)
        // setData(sortFormData(response.data.properties))
        setData(response.data.properties);
        setisData(true);
        // setis1st(!is1st ? true : false)
      }
    },
    onError: () => {
      setData([]);
      setisData(false);
      // setis1st(false)
    },
  });

  const { mutate: editData, isLoading: submitLoading } = useMutation({
    mutationKey: ["editData"],
    mutationFn: async (input) => {
      try {
        const mUrlParam = updateParamsFromUrl(apis.createAPI, urlParam);
        mUrlParam.formId = showEditData.hs_object_id;
        const API_ENDPOINT = removeAllParams(apis.createAPI);
        const API = addParam(API_ENDPOINT, mUrlParam);

        const response = await Client.form.update({
          // API: apis.updateAPI.replace(":formId", showEditData.hs_object_id),
          API: API,
          data: input,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response: any) => {
      setToaster({ message: response.statusMsg, type: "success" });
      refetch({
        filterPropertyName: "hs_pipeline",
        filterOperator: "eq",
        filterValue: "",
      });
      // setSync(true)
      setOpenModal(false);
    },

    onError: (error: any) => {
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

  const onSubmit = (data: any) => {
    editData(data);
  };

  const onChangeSelect = (filled: any, selectedValue: any) => {
    if (filled.name === "hs_pipeline" || filled.name === "pipeline") {
      getStags(selectedValue);
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
    // console.log('initialValues', initialValues)
    if (initialValues) getData();
  }, [initialValues]);

  useEffect(() => {
    getFormData();
  }, []);

  useEffect(() => {
    if (isSata) {
      // console.log('defaultValues', defaultValues)
      const mapData: any = Object.fromEntries(
        Object.entries(defaultValues).map(([key, value]: any) => {
          if (key === "hs_pipeline" || key === "pipeline") {
            getStags(value.value.value);
          }
          return [
            key,
            typeof value === "object" && value !== null && "value" in value
              ? value.value
              : value,
          ];
        })
      );
      // setInitialValues(mapData)
    }
  }, [showEditData, isSata]);
  return (
    <div>
      <Dialog
        open={openModal}
        onClose={setOpenModal}
        className="rounded-md lg:w-[480px] md:w-[430px] w-[calc(100vw-28px)]"
      >
        <div className="rounded-md flex-col gap-6 flex">
          <div className="text-lg text-start font-semibold dark:text-white mb-4">
            Edit {title}
          </div>
          {isLoading || stageLoadingFormData ? (
            <div className="loader-line"></div>
          ) : (
            <div className="w-full text-left">
              <Form
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                serverError={serverError}
                initialValues={initialValues}
                className="dark:bg-dark-200 !m-0"
              >
                {({ register, control, setValue, formState: { errors } }: any) => (
                  <div>
                    <div className="text-gray-800 dark:text-gray-200">
                      {data.map((filled) => (
                        <div>
                          <FormItem className="">
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
                                {filled.fieldType == "select" ||
                                (filled.name == "dealstage" &&
                                  filled.fieldType == "radio" &&
                                  hubspotObjectTypeId ===
                                    env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.deals) ? (
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
                                    className=""
                                    {...register(filled.name)}
                                  />
                                ) : filled.fieldType === "html" ? (
                                  <DashboardTableEditor
                                    title={filled.label}
                                    value={filled.value}
                                    setValue={setValue}
                                  />
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
                                ) : (
                                  <Input
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
                    <div className="mt-4 flex items-center gap-2 justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setOpenModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button className=" " isLoading={submitLoading}>
                        Save {title}
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
