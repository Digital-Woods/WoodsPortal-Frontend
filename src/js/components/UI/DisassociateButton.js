const DisassociateButton = ({
  item,
  apis,
  parentObjectTypeId,
  parentObjectRecordId,
  hubspotObjectTypeId,
  refetch,
}) => {
  const [alert, setAlert] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { sync, setSync } = useSync();

  const { mutate: removeExistingData, isLoading } = useMutation({
    mutationKey: ["removeExistingData"],
    mutationFn: async ({ formData }) => {
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
    onSuccess: async (response) => {
      await setAlert({ message: response?.statusMsg, type: "success" });
      setSync(true);
      setOpenModal(false);
    },

    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";

      if (error.response && error.response.data) {
        const errorData = error.response.data.detailedMessage;
        const errors = error.response.data.validationErrors;
        setServerError(errors);

        errorMessage =
          typeof errorData === "object" ? JSON.stringify(errorData) : errorData;
      }

      setAlert({ message: errorMessage, type: "error" });
    },
  });

  const handleConfirm = () => {
    const payload = {
      removeIds: [item.hs_object_id],
    };
    removeExistingData({ formData: payload });
  };

  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Button
        size="xsm"
        variant="outline"
        className="hover:bg-gray-200"
        onClick={() => setOpenModal(true)}
      >
        <span className="mr-2">
          <IconUnlink className="w-[10px] h-[10px]" />
        </span>
        Disassociate
      </Button>

      <Dialog
        open={openModal}
        onClose={setOpenModal}
        className="bg-cleanWhite dark:bg-dark-200 rounded-md sm:min-w-[430px]"
      >
        <div className="rounded-md flex-col gap-6 flex">
          <h3 className="text-start text-xl font-semibold dark:text-white">
            Are you sure you want to disassociate?
          </h3>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
