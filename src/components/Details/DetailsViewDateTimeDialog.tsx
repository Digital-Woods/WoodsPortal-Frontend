import { useState, useEffect, useRef } from 'react'
import z from 'zod'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
} from '../ui/Form'
import { DateTimeInput } from '../ui/DateTime/DateTimeInput'

export const DetailsViewDateTimeDialog = ({
  setEditRow,
  dateTimeDialog,
  setDateTimeDialog,
  objectId,
  value,
  editRow,
  data,
  saveData,
  isLoading,
  setEditRowKey,
  isAssociations
}: any) => {

  const [initialValues, setInitialValues] = useState<any>(null)

  useEffect(() => {
    let defValue: any = {}
    defValue[editRow?.key] = editRow?.value || []
    setInitialValues(defValue)
  }, [])

  const createValidationSchemaPipeline = () => {
    const schemaShape: any = {}
    schemaShape[editRow?.key] = z.any()
    return z.object(schemaShape)
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

  const onSubmit = (data: any) => {
    const sValue = parseValue(data);
    saveData(sValue)
  }

  const onChangeSelect = (filled: any, selectedValue: any) => {
  }

  const panelRef = useRef(null);

  return (
    <Dialog
      open={editRow}
      onClose={() => setDateTimeDialog(false)}
      className="p-4"
      ref={panelRef}
    >
      <div className="rounded-md lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)]  flex-col gap-6 flex">
        <div className="text-start text-xl dark:text-white font-semibold">
          {editRow?.label || editRow?.customLabel}
        </div>
        <div>
          {initialValues && (
            <Form
              onSubmit={onSubmit}
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
                          <FormControl>
                            <DateTimeInput
                              panelRef={panelRef}
                              control={control}
                              name={editRow?.name}
                              type={editRow?.type}
                              dateFormat="dd-mm-yyyy"
                              height="small"
                              className=""
                              defaultValue={editRow?.value}
                              time={editRow?.type === "datetime" ? true : false}
                              isAssociations={isAssociations}
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
                        setDateTimeDialog(false)
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
          )}
        </div>
      </div>
    </Dialog>
  )
}
