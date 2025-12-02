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
import { ProseMirrorEditor } from '../ui/ProseMirror/ProseMirrorEditor'
import { ShrinkIcon } from '@/assets/icons/ShrinkIcon'
import { ExpandIcon } from '@/assets/icons/ExpandIcon'
import { CloseIcon } from "@/assets/icons/closeIcon";
import { ValidationSchemaShape } from '@/utils/ValidationSchema'

export const DetailsViewEditorDialog = ({
  setEditRow,
  editorDialog,
  setEditorDialog,
  objectId,
  value,
  editRow,
  data,
  saveData,
  isLoading,
  setEditRowKey,
  isAssociations
}: any) => {
  const editorRef = useRef(null);
  const [initialValues, setInitialValues] = useState<any>(null)
  const [expandDialog, setExpandDialog] = useState(false);
  const menuConfig = {
    imageUploader: false,
    attachmentUploader: false,
    proseMirrorMenuDecreaseIndent: true,
    proseMirrorMenuIncreaseIndent: true,
    proseMirrorMenuEmoji: true,
  };

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


  const onSubmit = (data: any) => {
    saveData(data)
  }

  const expandToggleButton = () => {
    setExpandDialog(!expandDialog);
  };

  return (
    <Dialog
      open={editRow}
      onClose={() => setEditorDialog(false)}
      className={`!p-0 relative mx-auto bg-white dark:bg-white overflow-y-auto max-h-[95vh] ${expandDialog
        ? "lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]"
        : "lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] "
        } `}
    >
      <div >

        <div className="flex justify-between items-center mb-4 bg-[#516f90] p-4">
          <div className="text-lg font-semibold text-white dark:text-white mb-0">
            Edit {'title'}
          </div>
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              disabled={isLoading}
              variant="outline"
              onClick={expandToggleButton}
              className="text-white dark:text-white cursor-pointer"
            >
              {expandDialog ? (
                <div title="Shrink window">
                  <ShrinkIcon width="22px" height="22px" />
                </div>
              ) : (
                <div title="Make window expand">
                  <ExpandIcon width="22px" height="22px" />
                </div>
              )}
            </Button>
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                setEditRow(null);
                setExpandDialog(false);
                setEditRowKey(null);
              }}
              className="text-white dark:text-white"
            >
              <CloseIcon width="24px" height="24px" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-4 CUSTOM-updateRichText">
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
              setValue
            }: any) => (
              <div>
                <div className="text-gray-800 dark:text-gray-200 text-left flex flex-col gap-2">
                  {editRow && (
                    <div>
                      <FormItem className="">
                        <FormControl>
                          <ProseMirrorEditor
                            ref={editorRef}
                            key={'title'}
                            initialData={editRow?.value || ''}
                            {...register(editRow?.key)}
                            setEditorContent={(v: string) => setValue(editRow?.key, v)}
                            id={`editor-${12}`}
                            menuConfig={menuConfig}
                            isLoading={isLoading}
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
                      setEditorDialog(false)
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
