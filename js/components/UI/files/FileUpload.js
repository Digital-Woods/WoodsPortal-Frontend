const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    className="fill-black dark:fill-white"
  >
    <path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
  </svg>
);

const FileUpload = ({ fileId, refetch, folderId, onClose, setAlert, objectId,
  id }) => {
  const { sync, setSync } = useSync();
  const [selectedFile, setSelectedFile] = useState([]);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { me } = useMe();

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const inputChange = (e) => {
    let validFilesArray = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      validFilesArray.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile((prevValue) => [
          ...prevValue,
          {
            id: generateUniqueId(),
            filename: file.name,
            filetype: file.type,
            fileimage: reader.result,
          },
        ]);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }

    if (validFilesArray.length > 0) {
      e.target.value = "";
    }
  };

  const deleteSelectFile = (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const result = selectedFile.filter((data) => data.id !== id);
      setSelectedFile(result);
    }
  };

  const portalId = getPortal().portalId
  const uploadFileMutation = useMutation({
    mutationFn: async (fileData) => {
      const parentFolder = folderId === fileId ? "obj-root" : folderId;

      const payload = {
        parentFolderId: parentFolder,
        fileName: fileData.fileName,
        fileData: fileData.fileData,
      };

      await Client.files.uploadFile({
        objectId: objectId,
        id: id,
        portalId: portalId,
        fileData: payload
      });
    },
    onSuccess: () => {
      setFiles((prevValue) => [...prevValue, ...selectedFile]);
      setSelectedFile([]);
      setIsUploading(false);
      setAlert({
        message: "Files uploaded successfully!",
        type: "success",
        show: true,
      });
      // refetch();
      setSync(true)
      onClose();
    },
    onError: (error) => {
      console.error("Error uploading files:", error);
      setIsUploading(false);
      setAlert({
        message: "Error uploading files!",
        type: "error",
        show: true,
      });
      onClose();
    },
  });

  const fileUploadSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();

    if (selectedFile.length > 0) {
      setIsUploading(true);
      for (const file of selectedFile) {
        const fileData = {
          fileName: file.filename,
          fileData: file.fileimage.split(",")[1],
        };

        try {
          await uploadFileMutation.mutateAsync(fileData);
        } catch (err) {
          console.error("Error during file upload:", err);
        }
      }
    } else {
      alert("Please select a file");
    }
  };

  const deleteFile = (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const result = files.filter((data) => data.id !== id);
      setFiles(result);
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="fileupload-view relative">
      <div className="row justify-content-center m-0">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title">
                    <div
                      className="absolute right-0 top-[-20px] cursor-pointer"
                      onClick={onClose}
                    >
                      <CloseIcon />
                    </div>

                    <h6>File Upload</h6>
                  </div>
                </div>
                <form onSubmit={fileUploadSubmit}>
                  <div className="kb-file-upload">
                    <div className="file-upload-box">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="40px"
                          viewBox="0 -960 960 960"
                          width="40px"
                          className="fill-black dark:fill-white my-3"
                        >
                          <path d="..." />
                        </svg>
                      </div>
                      <input
                        type="file"
                        id="fileupload"
                        className="file-upload-input"
                        onChange={inputChange}
                        multiple
                      />
                      <p> Drag and drop </p>
                      <p> or </p>
                      <p className="border-2 border-black text-black p-2 rounded-lg !mt-3 font-semibold">
                        Browse
                      </p>
                    </div>
                  </div>
                  <div className="kb-attach-box mb-3 max-h-[100px] overflow-y-scroll scrollbar">
                    {selectedFile.map((data) => {
                      const { id, filename } = data;
                      return (
                        <div
                          className="file-atc-box border border-gray-300 rounded-lg shadow-md p-2 mb-2"
                          key={id}
                        >
                          <div className="file-detail flex items-center">
                            <div className="">{getIcon(filename)}</div>
                            <div className="ml-2 text-sm font-medium">
                              {filename}
                            </div>
                            <div className="file-actions ml-auto">
                              <button
                                type="button"
                                className="file-action-btn text-red-600"
                                onClick={() => deleteSelectFile(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    type="submit"
                    disabled={selectedFile.length === 0 || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
