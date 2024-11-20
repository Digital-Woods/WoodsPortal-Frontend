const Attachments = ({ attachments = [], objectId, id, isLoadingUoloading }) => {

    const [selectedFileId, setSelectedFileId] = useState(null);

    const portalId = getPortal().portalId
    const {
        data: fileDetails,
        isLoading,
        isError,
    } = useQuery(
        ["fileDetails", selectedFileId],
        () => Client.files.getDetails({
            objectId, id, portalId, rowId: selectedFileId
        }),
        {
            enabled: !!selectedFileId,
            onSuccess: (data) => {
                console.log("File Details fetched successfully:", data);
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
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" /></svg>
    );

    const getFileName = (filePath) => {
        const fileName = filePath.split('/').pop();
        return fileName
    }

    return (
        <div>
            {isLoadingUoloading && <div className="loader-line mt-2"></div>}
            <div className="flex items-start">
                <ul class="list-none inline-block max-w-full">
                    {attachments.map((attachment) => (
                        <li className="p-2 bg-slate-200 border border-slate-300 rounded-sm mt-2 flex gap-1 text-sm flex items-center">
                            <FileIcon />
                            <div class="flex gap-1">
                                <span onClick={() => setSelectedFileId(attachment.id)} class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank">{getFileName(attachment.name)}</span>
                                <span>({attachment.size})</span>
                            </div>
                        </li>
                    ))
                    }
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
