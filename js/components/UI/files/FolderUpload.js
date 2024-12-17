const FolderUpload = ({
  isOpen,
  onClose,
  refetch,
  folderId,
  fileId,
  setAlert,
  objectId,
  id
}) => {
  const { sync, setSync } = useSync();
  const { me } = useMe();
  const [newFolderName, setNewFolderName] = useState("");

  const portalId = getPortal().portalId

  const createFolderMutation = useMutation({
    mutationFn: async (payload) => {
      await Client.files.createAfolder({
        objectId: objectId,
        id: id,
        portalId: portalId,
        fileData: payload
      });
    },
    onSuccess: () => {
      setAlert({
        message: "Folder created successfully!",
        type: "success",
        show: true,
      });
      // refetch();
      setSync(true)
      setNewFolderName("");
      onClose(); // Close modal after folder creation
    },
    onError: (error) => {
      console.error("Error creating folder:", error);
      setAlert({
        message: "Error creating folder!",
        type: "error",
        show: true,
      });

      onClose();
    },
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      setAlert({
        message: "Folder name cannot be empty!",
        type: "error",
        show: true,
      });
      return;
    }

    const parentFolder = fileId === folderId ? "obj-root" : folderId;
    const payload = {
      parentFolderId: parentFolder,
      folderName: newFolderName,
    };

    createFolderMutation.mutate(payload);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => { } /* Disable closing on backdrop click */}
    >
      <div
        className="flex relative items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on modal content
      >
        <div className="bg-cleanWhite lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)] flex flex-col justify-start dark:bg-dark-200">
          <h3 className="text-lg text-start font-semibold mb-4 dark:text-white">
            New Folder
          </h3>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border text-dark-200 border-gray-300 dark:bg-dark-100 p-2 w-full rounded"
            placeholder="Folder Name"
          />
          <div className="mt-4 flex items-center gap-3 justify-between">
            <Button
              className='dark:text-white'
              onClick={onClose}
              variant="outline"
              disabled={createFolderMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={
                createFolderMutation.isLoading || newFolderName.trim() === ""
              }
            >
              {createFolderMutation.isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
