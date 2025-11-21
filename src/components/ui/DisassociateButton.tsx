import { useState, useEffect } from 'react';
import { useSync } from '@/state/use-sync';
import { useBreadcrumb } from '@/state/use-breadcrumb';
import { Client } from '@/data/client/index'
import { useMutation } from "@tanstack/react-query";
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { IconUnlink } from '@/assets/icons/IconUnlink'
import { useToaster } from '@/state/use-toaster';

export const DisassociateButton = ({
  item,
  apis,
  parentObjectTypeId,
  parentObjectRecordId,
  hubspotObjectTypeId,
  refetch,
  componentName,
  setActiveDisassociatedButton
}: any) => {
    const [serverError, setServerError] = useState(null);
  const { setToaster } = useToaster();
  const [openModal, setOpenModal] = useState(false);
  const { sync, setSync } = useSync();
  const { breadcrumbs } = useBreadcrumb();
  const [parentObjectname, setParentObjectname] = useState("");
  const [objectTypeNameSingular, setObjectTypeNameSingular] = useState("");
  const [parentObjectTypeNameSingular, setParentObjectTypeNameSingular] = useState("");

useEffect(() => {
  if (!breadcrumbs?.length) return;
  const getSingular = (name: any) =>
    name?.endsWith("s") ? name.slice(0, -1) : name || "";

  const [thirdLast, secondLast, last]: any = breadcrumbs.slice(-3);
  
  if (componentName !== "ticket") {
    setParentObjectname(getSingular(thirdLast?.name));
    setObjectTypeNameSingular(getSingular(last?.name));
    setParentObjectTypeNameSingular(secondLast?.name);
  } else {
    setObjectTypeNameSingular("Ticket");
    setParentObjectname(getSingular(secondLast?.name));
    setParentObjectTypeNameSingular(last?.name || "");
  }
}, [breadcrumbs]);

  const { mutate: removeExistingData, isLoading } = useMutation({
    mutationKey: ["removeExistingData"],
    mutationFn: async ({ formData }: any) => {
      try {
        const response = await Client.form.removeExisting({
          API: apis.removeExistingAPI,
          params: {
            fromObjectTypeId: parentObjectTypeId,
            fromRecordId: parentObjectRecordId,
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
      setSync(true);
      setOpenModal(false);
    },

    onError: (error: any) => {
      let errorMessage = error?.response?.data?.errorMessage;

      if (error?.response && error?.response?.data) {
        const errorData = error?.response?.data?.detailedMessage;
        const errors = error?.response?.data?.validationErrors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setToaster({ message: errorMessage, type: "error" });
    },
  });

  const handleConfirm = () => {
    const payload = {
      removeIds: [item?.hs_object_id],
    };
    removeExistingData({ formData: payload });
    setTimeout(()=>{
      setActiveDisassociatedButton(null);
    }, 2000);
  };

  return (
    <>
      <Button
        size="xsm"
        variant="outline"
        className="hover:bg-gray-200"
        onClick={() => setOpenModal(true)}
      >
        <span className="mr-2">
          <IconUnlink fill='currentColor' className="w-[10px] h-[10px]" />
        </span>
        Disassociate
      </Button>

      <Dialog
        open={openModal}
        onClose={setOpenModal}
        className="bg-cleanWhite dark:bg-dark-200 rounded-md sm:max-w-[450px] mx-2"
      >
          <div className="mb-4">
            <div className="text-start text-xl font-semibold dark:text-white mb-2 whitespace-normal break-words">
             { `Are you sure you want to disassociate this ${objectTypeNameSingular}?`}
            </div>
            <p className="whitespace-normal break-words dark:text-white">
              This will remove the {objectTypeNameSingular} from the <span className="font-semibold">{parentObjectTypeNameSingular}</span> {parentObjectname}. 
              The {objectTypeNameSingular} will remain available, but it will no longer be linked to this {parentObjectname}.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => {  setOpenModal(false);  setActiveDisassociatedButton(null); }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              Confirm
            </Button>
          </div>
      </Dialog>
    </>
  );
};
