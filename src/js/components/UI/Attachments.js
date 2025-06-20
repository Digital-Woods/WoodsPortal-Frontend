const Attachments = ({
  setUploadedAttachments,
  attachments = [],
  objectId,
  id,
  isLoadingUoloading,
  uploadProgress,
  remove = true,
}) => {
  const [selectedFileId, setSelectedFileId] = useState(null);

  const portalId = getPortal()?.portalId;
  const {
    data: fileDetails,
    isLoading,
    isError,
  } = useQuery(
    ["fileDetails", selectedFileId],
    () =>
      Client.files.getDetails({
        objectId,
        id,
        portalId,
        rowId: selectedFileId,
      }),
    {
      enabled: !!selectedFileId,
      onSuccess: (data) => {
        // console.log("File Details fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error fetching file details:", error);
      },
    }
  );

  const closeModal = () => {
    setSelectedFileId(null);
  };

  const FileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
    </svg>
  );

  const getFileName = (filePath) => {
    const fileName = filePath.split("/").pop();
    return fileName;
  };

  const removeAttachment = (attachment) => {
    setUploadedAttachments((prevAttachments) =>
      prevAttachments.filter((item) => item.id !== attachment.id)
    );
  };

  return (
    <div>
      {/* Progress Bar */}
      <div
        className={`transition-all w-[100%] duration-300 ${
          isLoadingUoloading ? "opacity-100" : "opacity-0"
        } overflow-hidden`}
      >
        {isLoadingUoloading && uploadProgress < 90 ? (
          <div className="w-full bg-gray-200 rounded-sm overflow-hidden h-3 mt-2">
            <div
              className={`h-3 bg-secondary transition-all duration-300 w-[${
                uploadProgress + 10
              }%]`}
            ></div>
          </div>
        ) : null}
        {isLoadingUoloading && uploadProgress > 90 ? (
          <div class="meter">
            <span></span>
          </div>
        ) : null}
      </div>
      <div className="flex items-start">
        <ul class={`list-none ${attachments.length > 0 ? 'p-1' : ''} flex flex-wrap gap-2 max-w-full`}>
          {attachments.map((attachment) => (
            <li className="w-full p-2 bg-[#f5f8fa] dark:bg-dark-300 dark:text-white border dark:border-gray-600 rounded-sm text-sm">
              <div class="flex gap-2 items-center">
                <div class="w-[20px]">
                  <FileIcon />
                </div>
                <div className="[calc(90%_-_100px)]">
                  <span
                    onClick={() => setSelectedFileId(attachment.id)}
                    class="cursor-pointer font-semibold text-xs text-lightblue text-[#5f6368] dark:text-white hover:underline"
                    target="_blank"
                  >
                    {getFileName(attachment.name)}
                  </span>
                </div>
                <div class="w-[80px]">
                  <span className="text-xs font-normal">({attachment.size})</span>
                </div>
              </div>
              {/* {remove && (
                <div onClick={() => removeAttachment(attachment)}>X</div>
              )} */}
            </li>
          ))}
        </ul>
        {selectedFileId && (
          <FileDetailsModal
            file={fileDetails}
            onClose={closeModal}
            loading={isLoading}
            error={isError}
          />
        )}
      </div>
    </div>
  );
};
