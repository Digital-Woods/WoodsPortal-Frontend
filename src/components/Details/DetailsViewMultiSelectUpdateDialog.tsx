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
import { ValidationSchemaShape } from '@/utils/ValidationSchema'

export const DetailsViewMultiSelectUpdateDialog = ({
  setEditRow,
  multiSelectDialog,
  setMultiSelectDialog,
  objectId,
  value,
  editRow,
  data,
  saveData,
  isLoading,
  setEditRowKey,
}: any) => {

  const [initialValues, setInitialValues] = useState<any>(null)

  useEffect(() => {
    let defValue: any = {}
    defValue[editRow?.key] = editRow?.value || []
    setInitialValues(defValue)
  }, [])

  const createValidationSchemaPipeline = () => {
    let schemaShape: any = {};
    if (!editRow) return z.object({});
    schemaShape = ValidationSchemaShape(editRow, "key");
    return z.object(schemaShape);
  }

  const validationSchemaPipeline = createValidationSchemaPipeline()

  const parseValue = (obj: any) => {
    const key = editRow?.key;         // dynamic key
    const value = obj[key];           // get value using dynamic key

    // If array → convert to "Item 1; Item 2"
    if (Array.isArray(value)) {
      return {
        [key]: value.map(i => i.value).join(";")
      };
    }

    // Otherwise return as-is
    return {
      [key]: value
    };
  };

  const onSubmitCheckbox = (data: any) => {
    const sValue = parseValue(data);
    saveData(sValue)
  }

  const onChangeSelect = (filled: any, selectedValue: any) => {
  }

  return (
    <Dialog
      open={editRow}
      onClose={() => setMultiSelectDialog(false)}

    >
      <div className="p-4">
        <div className="
      
       w-[100vw] h-[100vh]
                rounded-none overflow-y-auto
                md:h-auto lg:w-[480px] md:w-[410px] lg:max-h-[95vh] md:max-h-[95vh] md:rounded-md
      ">
          {/* rounded-md lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)]   */}
          <div className="
      p-4
      flex-col gap-6 flex">
            <div className="text-start text-xl dark:text-white font-semibold">
              {editRow?.label || editRow?.customLabel}
            </div>
            <div>
              <Form
                onSubmit={onSubmitCheckbox}
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
                }: any) => (
                  <div>
                    {/* {JSON.stringify(getValues())} */}
                    <div className="text-gray-800 dark:text-gray-200 text-left flex flex-col gap-2">
                      {editRow && (
                        <div>
                          <FormItem className="">
                            <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                              Select
                            </FormLabel>

                            <FormControl>
                              <Select
                                label={`Select Pipeline`}
                                name={editRow?.name}
                                options={editRow?.options || []}
                                control={control}
                                onChangeSelect={onChangeSelect}
                                isClearable={true}
                                defaultValue={editRow?.value || ''}
                                isMulti={true}
                              />
                            </FormControl>

                            {(errors[editRow?.key]) && (
                              <FormMessage className="text-red-600 dark:text-red-400">
                                {errors[editRow?.key]?.message}
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
                          setMultiSelectDialog(false)
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
        </div>
      </div>
    </Dialog>
  )
}
