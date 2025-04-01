const DetailsViewEditor = ({
  openModal,
  setOpenModal,
  title,
  value,
  setEditRow,
  name,
  setValue,
  objectId,
  id,
  urlParam,
  refetch
}) => {
  const editorRef = useRef(null);
  const [expandDialog, setExpandDialog] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editorContent, setEditorContent] = useState(value);
  const menuConfig = {
    imageUploader: false,
    attachmentUploader: false,
    proseMirrorMenuDecreaseIndent: true,
    proseMirrorMenuIncreaseIndent: true,
    proseMirrorMenuEmoji: true,
  };

  const { mutate: saveData, isLoading } = useMutation({
    mutationKey: ["saveData"],
    mutationFn: async (payload) => {
      try {
        const response = await Client.details.update({
          data: {
            [name]: editorContent,
          },
          params: {
            objectTypeId: objectId,
            recordId: id,
          },
          queryParams:urlParam
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      refetch();
      setEditRow(null)
      setAlert({ message: data.statusMsg, type: "success" });
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setAlert({ message: errorMessage, type: "error" });
    },
  });

  const expandToggleButton = () => {
    setExpandDialog(!expandDialog);
  };

  return (
    <div>
       {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Dialog
        open={openModal}
        onClose={setOpenModal}
        className={`!p-0 relative mx-auto bg-white dark:bg-white overflow-y-auto max-h-[95vh] ${
          expandDialog
            ? "lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]"
            : "lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] "
        } `}
      >
        <div className="flex justify-between items-center mb-4 bg-[#516f90] p-4">
          <h2 className="text-lg font-semibold text-white dark:text-white">
            Edit {title}
          </h2>
          <div className="flex gap-2 items-center">
            <button
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
            </button>
            <button
              disabled={isLoading}
              variant="outline"
              onClick={() => setEditRow(null)}
              className="text-white dark:text-white"
            >
              <CloseIcon width="24px" height="24px" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <ProseMirrorEditor
            ref={editorRef}
            key={title}
            initialData={editorContent}
            setEditorContent={setEditorContent}
            id={`editor-${title}`}
            menuConfig={menuConfig}
          />
          <div className="mt-4 flex justify-end gap-3 darkbg-[#516f90] ">
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                setEditRow(null);
                setExpandDialog(false);
              }}
              className={`dark:!text-white`}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => saveData()}
              isLoading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
