const NoteCard = ({
  note,
  objectId,
  id,
  imageUploadUrl,
  attachmentUploadUrl,
  refetch,
  setAlert,
  permissions,
}) => {
  const { sync, setSync } = useSync();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [editorContent, setEditorContent] = useState(note.hs_note_body);
  // const [permissions, setPermissions] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const OpenIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
  );

  const openEditor = () => {};

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId;
  }

  const updateNoteMutation = useMutation(
    async (newNote) => {
      return await Client.notes.updateNote({
        objectId: objectId,
        id: id,
        note: newNote,
        note_id: note.hs_object_id,
        portalId: portalId,
      });
    },

    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["data"]);
        // refetch();
        setSync(true);
        setAlert({
          message: res.statusMsg,
          type: "success",
        });
        setIsOpenEditor(false);
      },
      onError: (error) => {
        console.error("Error creating note:", error);
        setAlert({
          message: error.response.data.errorMessage,
          type: "error",
        });
      },
    }
  );
  const { isLoading: isLoadingUpdate } = updateNoteMutation;
  const handleUpdateNote = () => {
    const payload = {
      noteBody: editorContent,
    };
    updateNoteMutation.mutate(payload);
  };

  return (
    <div key={note.hs_object_id} className="mt-2">
      <div
        className="border border-gray-200 bg-white shadow-md rounded-md mt-1 p-2 text-sm cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsOpenEditor(false);
        }}
      >
        <div>
          <div className="flex items-center">
            <div>{isOpen ? <OpenIcon /> : <CloseIcon />}</div>
            <div className="flex justify-between items-center w-full">
              <p className="text-sm font-semibold  whitespace-nowrap">Note</p>
              <div>
                <p className="text-gray-400 text-xs ">
                  <span className="mr-1">
                    {" "}
                    {formatDate(note.hs_createdate)}{" "}
                  </span>
                  {formatTime(note.hs_createdate)}
                </p>
              </div>
            </div>
          </div>
          {isOpenEditor && (permissions && permissions.update) ? (
            <div
              className="p-[16px] cursor-text"
              onClick={(e) => e.stopPropagation()}
            >
              <CKEditor
                initialData={note.hs_note_body}
                attachments={note.hs_attachment_ids || []}
                setEditorContent={setEditorContent}
                id={`editor-${note.hs_object_id}`}
                imageUploadUrl={imageUploadUrl}
                attachmentUploadUrl={`${attachmentUploadUrl}/${note.hs_object_id}`}
                attachmentUploadMethod={"PUT"}
                setAttachmentId={null}
                refetch={refetch}
                objectId={objectId}
                mainRowId={id}
              />
              <div className="flex gap-x-2 mt-2">
                <Button
                  disabled={isLoadingUpdate || editorContent === ""}
                  onClick={handleUpdateNote}
                  className="text-white"
                  size="sm"
                >
                  {isLoadingUpdate ? "Updating..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsOpenEditor(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div
                className={`p-[24px] ${
                  !isOpen
                    ? ""
                    : "border border-[#fff] hover:border-blue-500 hover:bg-gray-100 rounded-md relative group cursor-text"
                }`}
                onClick={(e) => {
                  if (isOpen) {
                    e.stopPropagation();
                    setIsOpenEditor(true);
                    openEditor();
                  }
                }}
              >
                <div className={!isOpen ? "relative line-clamp-2" : ""}>
                  <span>
                    {ReactHtmlParser.default(
                      DOMPurify.sanitize(note.hs_note_body)
                    )}
                  </span>

                  <div
                    size="32"
                    opacity="1"
                    className={!isOpen ? "text-shadow" : ""}
                  ></div>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditIcon />
                </div>
              </div>
              {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Attachments attachments={note.hs_attachment_ids || []} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Notes = ({ path, objectId, id, permissions }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { me } = useMe();
  const [editorContent, setEditorContent] = useState("");
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const [attachmentUploadUrl, setAttachmentUploadUrl] = useState("");
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState(null);
  const [attachmentId, setAttachmentId] = useState("");
  const { sync, setSync } = useSync();
  // const [permissions, setPermissions] = useState(null);

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId;
  }

  const limit = 20;
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["data", page],
    queryFn: async () =>
      await Client.notes.all({
        objectId: objectId,
        id: id,
        limit: limit,
        page: page,
        portalId: portalId,
        cache: sync ? false : true,
      }),
    onSuccess: (data) => {
      // setPermissions(data.configurations.note);
      setSync(false);
    },
    onError: (error) => {
      setSync(false);
      console.error("Error fetching file details:", error);
    },
    refetchInterval: env.NOTE_INTERVAL_TIME,
  });

  useEffect(() => {
    if (sync == true) refetch();
  }, [sync]);

  const { mutate: handleSaveNote, isLoading: isPosting } = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async () => {
      return await Client.notes.createnote({
        objectId: objectId,
        id: id,
        noteBody: editorContent,
        attachmentId: attachmentId,
        portalId: portalId,
      });
    },

    onSuccess: (response) => {
      setSync(true);
      setShowDialog(false);
      setAlert({
        message: response.statusMsg,
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      setAlert({
        message: error.response.data.errorMessage,
        type: "error",
      });
    },
  });

  useEffect(() => {
    const portalId = getPortal().portalId;
    setImageUploadUrl(
      `${env.API_BASE_URL}/api/${hubId}/${portalId}/hubspot-object-notes/images/${objectId}/${id}`
    );
    setAttachmentUploadUrl(
      `${env.API_BASE_URL}/api/${hubId}/${portalId}/hubspot-object-notes/attachments/${objectId}/${id}`
    );
  }, []);

  if (isLoading) {
    return <div className="loader-line"></div>;
  }
  if (error) {
    return <div>Error fetching notes: {error.message}</div>;
  }
  const results = data && data.data && data.data.results;
  const totalNotes = data && data.data && data.data.total;
  const numOfPages = Math.ceil(totalNotes / limit);
  return (
    <div className="rounded-lg mt-2 bg-cleanWhite dark:bg-[#212121]">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {permissions && permissions.create && (
        <div className="flex justify-end mt-2 mb-6 items-center">
          <Button className="text-white" onClick={() => setShowDialog(true)}>
            <span className="mr-2"> <IconPlus className='!w-3 !h-3'/>  </span> New Note
          </Button>
        </div>
      )}
      {results && results.rows && results.rows.length > 0 ? (
        results.rows.map((note) => (
          <NoteCard
            note={note}
            objectId={objectId}
            id={id}
            imageUploadUrl={imageUploadUrl}
            attachmentUploadUrl={attachmentUploadUrl}
            refetch={refetch}
            setAlert={setAlert}
            permissions={permissions}
          />
        ))
      ) : (
        <div className="text-primary dark:text-cleanWhite">
          No notes available.
        </div>
      )}
      {totalNotes > limit && (
        <Pagination
          numOfPages={numOfPages}
          currentPage={page}
          setCurrentPage={setPage}
        />
      )}
      <Dialog
        open={showDialog}
        onClose={setShowDialog}
        className=" relative mx-auto bg-white overflow-y-auto lg:w-[460px] md:w-[400px] w-[300px] "
      >
        <div
          className="absolute right-3 top-2 cursor-pointer"
          onClick={() => setShowDialog(false)}
        >
          <CloseIcon />
        </div>
        <div className="flex items-center mb-3">
          <p className="text-gray-600 text-xs">For</p>
          <p className="border rounded-full dark:text-white px-2 py-1 text-xs ml-2">
            {me.firstName}
          </p>
        </div>
        <CKEditor
          attachments={[]}
          setEditorContent={setEditorContent}
          imageUploadUrl={imageUploadUrl}
          attachmentUploadUrl={attachmentUploadUrl}
          attachmentUploadMethod={"POST"}
          setAttachmentId={setAttachmentId}
          refetch={refetch}
          objectId={objectId}
          mainRowId={id}
        />
        <div className="mt-4 flex justify-end">
          <Button
            disabled={isPosting || editorContent.trim() === ""}
            onClick={handleSaveNote}
            className="text-white"
          >
            {isPosting ? "Saving Post..." : "Save Post"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
