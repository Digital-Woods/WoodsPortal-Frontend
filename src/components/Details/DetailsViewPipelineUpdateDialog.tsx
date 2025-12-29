import { Client } from '@/data/client'
import { useToaster } from '@/state/use-toaster'
import { useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import z from 'zod'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Textarea,
  Input,
} from '../ui/Form'
import { Select } from '../ui/Select'

export const DetailsViewPipelineUpdateDialog = ({
  setEditRow,
  pipelineDialog,
  setPipelineDialog,
  objectId,
  value,
  editRow,
  data,
  saveData,
  isLoading,
  setEditRowKey,
}: any) => {
  const [initialValues, setInitialValues] = useState<any>(null)

  const [pipelines, setPipelines] = useState<any>(null)
  const [pipeline, setPipeline] = useState<any>(null)

  const [stages, setStages] = useState<any>({ options: [], key: '' })
  const [stage, setStage] = useState<any>(null)

  const [isDealEdit, setIsDealEdit] = useState<any>(false)
  const { setToaster } = useToaster()

  const selectPipelines = () => {
    setPipelines(editRow)
    setPipeline(editRow?.value)
  }

  useEffect(() => {
    selectPipelines()
  }, [])

  const selectStages = () => {
    const dataLoop =
      typeof data === 'object' && !Array.isArray(data)
        ? Object.keys(data)
        : data
    const filterStage = dataLoop.find(
      (item: any) =>
        item?.key === 'hs_pipeline_stage' || item?.key === 'dealstage',
    )

    if (filterStage?.key == 'dealstage') {
      setIsDealEdit(true)
    }
    setStages(filterStage)
    setStage(filterStage?.value)
  }

  useEffect(() => {
    if (pipeline?.value) selectStages()
  }, [pipeline])

  const { mutate: getStags, isLoading: ld }: any = useMutation({
    mutationKey: ['getStageData1'],
    mutationFn: async (props) => {
      const { pipelineId, isNewValue, tValue }: any = props
      try {
        const response = await Client.details.stages({
          params: {
            objectTypeId: objectId,
            pipelineId,
          },
        })
        return { response, pipelineId, isNewValue }
      } catch (error) {
        throw error
      }
    },
    onSuccess: async ({ response }: any) => {
      const key = isDealEdit ? 'dealstage' : 'hs_pipeline_stage'
      setStages({
        options: response.data,
        key: key,
        apidata: true,
      })

      setDefaultData()
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage
      setToaster({ message: errorMessage, type: 'error' })
    },
  })

  useEffect(() => {
    if (pipeline?.value && stage && stages?.options?.length < 1) {
      getStags({ pipelineId: pipeline?.value, isNewValue: true })
    }
  }, [pipeline, stage])

  const getValue = (value: any, type = 'label') => {
    if (value && typeof value === 'object')
      return type === 'label' ? value?.label : value?.value
    return value
  }

  const setDefaultData = () => {
    const dataLoop =
      typeof data === 'object' && !Array.isArray(data)
        ? Object.keys(data)
        : data
    const filterStage = dataLoop.find(
      (item: any) =>
        item.key === 'hs_pipeline_stage' || item.key === 'dealstage',
    )

    let defValue: any = {}
    defValue[editRow?.key] = getValue(editRow?.value, 'value')
    if (filterStage) {
      defValue[filterStage?.key] = getValue(filterStage?.value, 'value')
    } else {
      defValue['hs_pipeline_stage'] = null
    }
    setInitialValues(defValue)
  }

  const createValidationSchemaPipeline = (data: any) => {
    const schemaShape: any = {}
    schemaShape[value?.key] = z.string().nonempty({
      message: `${value.customLabel || value.label} is required.`,
    })

    const dataLoop =
      typeof data === 'object' && !Array.isArray(data)
        ? Object.keys(data)
        : data

    dataLoop.forEach((field: any) => {
      if (
        field?.key === 'hs_pipeline_stage' ||
        field?.key === 'dealstage' ||
        field?.key === 'hs_pipeline' ||
        field?.key === 'pipeline'
      ) {
        schemaShape[field?.key] = z.any()
        .refine((val) => val !== null && val !== undefined && val !== '', {
          message: `${field?.customLabel || field?.label} is required`,
        })
      }
    })

    if (
      !Object.prototype.hasOwnProperty.call(schemaShape, 'dealstage') &&
      !Object.prototype.hasOwnProperty.call(schemaShape, 'hs_pipeline_stage')
    ) {
      schemaShape['hs_pipeline_stage'] = z.string().nonempty({
        message: `Stage is required.`,
      })
    }
    return z.object(schemaShape)
  }

  const validationSchemaPipeline = createValidationSchemaPipeline(data)

  const onSubmitPipeline = (data: any) => {
    saveData(data)
  }

  const onChangeSelect = (filled: any, selectedValue: any, stagesKey: any, setValue: any) => {
    getStags({ pipelineId: selectedValue, isNewValue: true })
    setValue(stagesKey, null)
  }

  return (
    <Dialog
      open={pipelineDialog}
      onClose={() => setPipelineDialog(false)}
      className="p-4"
    >
      <div className="rounded-md lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)]  flex-col gap-6 flex">
        <div className="text-start text-xl dark:text-white font-semibold">
          Select Pipeline
        </div>
        {/* {JSON.stringify(initialValues)} */}
        <div>
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
              setValue,
            }: any) => (
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
                          <Select
                            label={`Select Pipeline`}
                            name={pipelines?.name}
                            options={pipelines?.options || []}
                            control={control}
                            onChangeSelect={(filled: any, selectedValue: any) => onChangeSelect(filled, selectedValue, stages?.key, setValue)}
                            isClearable={true}
                            defaultValue={pipeline?.value || ''}
                          />
                        </FormControl>

                        {(errors?.hs_pipeline || errors?.pipeline) && (
                          <FormMessage className="text-red-600 dark:text-red-400">
                            {errors?.hs_pipeline?.message || errors?.pipeline?.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    </div>
                  )}

                  {stages?.options?.length > 0 && (
                    <div>
                      <FormItem className="">
                        <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                          Select Stage
                        </FormLabel>

                        <FormControl>
                          <Select
                            label={`Select Stage`}
                            name={stages?.key}
                            options={stages?.options || []}
                            control={control}
                            isClearable={true}
                            defaultValue={stage?.value || ''}
                          />
                        </FormControl>

                        {(errors?.hs_pipeline_stage || errors?.dealstage) && (
                          <FormMessage className="text-red-600 dark:text-red-400">
                            {errors?.hs_pipeline_stage?.message || errors?.dealstage?.message}
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
                      setPipelineDialog(false)
                      setEditRow(null)
                      setEditRowKey(null)
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
        </div>
      </div>
    </Dialog>
  )
}
