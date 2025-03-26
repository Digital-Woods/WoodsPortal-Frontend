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
  const [isUploading, setIsUploading] = useState(false);

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
    portalId = getPortal()?.portalId;
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
        refetch();
        // setSync(true);
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

  const noteViewConfig = {
    ADD_ATTR: ['target'],
    // ALLOWED_ATTR: ["style", "src", "width", "height", "alt"],
    // ALLOWED_TAGS: ["p", "a", "figure", "img", "br"],
    // ALLOW_DATA_ATTR: true, // If data attributes are required
    // KEEP_CONTENT: true // Keep empty tags
  };

  return (
    <div key={note.hs_object_id} className="mt-2">
      <div
        className="border border-gray-200 dark:border-gray-600 dark:bg-dark-500 bg-white shadow-md rounded-md mt-1 p-2 dark:text-white text-sm cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsOpenEditor(false);
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <div>
              {isOpen ? (
                <Chevron transform="rotate(270)" />
              ) : (
                <Chevron transform="rotate(180)" />
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-sm font-semibold  whitespace-nowrap">Note</p>
              <div>
                <p className="text-gray-400 dark:text-white text-xs ">
                  <span className="mr-1">
                    {" "}
                    {formatDate(note.hs_createdate)}{" "}
                  </span>
                  {formatTime(note.hs_createdate)}
                </p>
              </div>
            </div>
          </div>
          {isOpenEditor && permissions && permissions.update ? (
            <div
              className={`p-4 cursor-text ${
                isOpenEditor ? "" : "dark:text-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <ProseMirrorEditor
                key={id}
                initialData={escapeHTML(note.hs_note_body)}
                attachments={note.hs_attachment_ids || []}
                setEditorContent={setEditorContent}
                id={`editor-${note.hs_object_id}`}
                imageUploadUrl={imageUploadUrl}
                attachmentUploadUrl={`${attachmentUploadUrl}/${note.hs_object_id}`}
                attachmentUploadMethod={"PUT"}
                setAttachmentId={null}
                refetch={refetch}
                objectId={objectId}
                setIsUploading={setIsUploading}
              />
              <div className="flex gap-x-2 mt-2">
                <Button
                  disabled={
                    isLoadingUpdate || editorContent === "" || isUploading
                  }
                  onClick={handleUpdateNote}
                  className="text-white"
                  size="sm"
                  isLoading={isLoadingUpdate}
                >
                  Save
                </Button>
                <Button
                  disabled={isLoadingUpdate || isUploading}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsOpenEditor(false);
                    setIsOpen(!isOpen);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={
                !isOpen
                  ? "relative line-clamp-2 max-h-[120px] overflow-hidden"
                  : ""
              }
            >
              <div
                className={`py-3 pr-3 pl-6 ${
                  !isOpen
                    ? ""
                    : `${
                        permissions.update ? "cursor-text" : "cursor-auto"
                      } hover:border-blue-500 hover:bg-gray-100 hover:dark:bg-gray-600 rounded-md relative group`
                } EditorView`}
                onClick={(e) => {
                  if (isOpen) {
                    e.stopPropagation();
                    setIsOpenEditor(true);
                    openEditor();
                  }
                }}
              >
                <div className="break-words">
                  <span>
                    {/* {ReactHtmlParser.default(
                      DOMPurify.sanitize(note.hs_note_body, {
                        ADD_ATTR: ['target'],
                      })
                    )} */}
                    {ReactHtmlParser.default(
                      DOMPurify.sanitize(note.hs_note_body, noteViewConfig)
                    )}
                  </span>
                </div>
                {permissions.update === true ? (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-secondary transition-opacity">
                    <EditIcon />
                  </div>
                ) : null}
              </div>
              {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Attachments
                    attachments={note.hs_attachment_ids || []}
                    remove={false}
                  />
                </div>
              )}
              <div
                className={`${
                  !isOpen
                    ? "bg-gradient-to-t from-white dark:from-dark-500 to-transparent h-8 absolute bottom-0 right-0 left-0"
                    : ""
                }`}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Notes = ({ item, path, objectId, id, permissions }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { me } = useMe();
  const [editorContent, setEditorContent] = useState("");
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const [attachmentUploadUrl, setAttachmentUploadUrl] = useState("");
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState(null);
  const [attachmentId, setAttachmentId] = useState("");
  const { sync, setSync } = useSync();
  const [expandDialog, setExpandDialog] = useState(false);

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const limit = 10;
  const { data, error, isLoading, refetch, isFetching } = useQuery({
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
    refetchInterval: sync ? env.NOTE_INTERVAL_TIME : false,
  });

  useEffect(() => {
    if (sync) refetch();
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
      // setSync(true);
      refetch();
      setShowDialog(false);
      setAlert({
        message: response.statusMsg,
        type: "success",
      });
      setExpandDialog(false);
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      setAlert({
        message: error.response.data.errorMessage,
        type: "error",
      });
    },
  });

  const expandToggleButton = () => {
    setExpandDialog(!expandDialog);
  };

  useEffect(() => {
    const portalId = getPortal()?.portalId;
    setImageUploadUrl(
      `${env.API_BASE_URL}/api/${hubId}/${portalId}/hubspot-object-notes/images/${objectId}/${id}`
    );
    setAttachmentUploadUrl(
      `${env.API_BASE_URL}/api/${hubId}/${portalId}/hubspot-object-notes/attachments/${objectId}/${id}`
    );
  }, []);

  if (error) {
    return (
      <div className="flex items-center text center p-4 h-28">
        Error fetching notes: {error.message}
      </div>
    );
  }
  const results = data && data.data && data.data.results;
  const totalNotes = data && data.data && data.data.total;
  const numOfPages = Math.ceil(totalNotes / limit);

  if (isLoading || isFetching) {
    return <NoteSkeleton />;
  }

  const getObjectName = () => {
    let displayValue = "";

    if (item) {
      for (const key of Object.keys(item)) {
        const valueObject = item[key];
        if (
          valueObject &&
          valueObject.isPrimaryDisplayProperty &&
          valueObject.value
        ) {
          displayValue = isObject(valueObject.value)
            ? valueObject.value.label
            : valueObject.value;
        }
      }
    }
    return displayValue || me.firstName;
  };

  return (
    <div className="border dark:border-none dark:bg-dark-300 md:p-4 p-2 rounded-lg bg-cleanWhite ">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {permissions && permissions.create && (
        <div className="flex justify-end mb-6 items-center">
          <Button variant="create" onClick={() => setShowDialog(true)}>
            <span className="mr-2">
              {" "}
              <IconPlus className="!w-3 !h-3" />{" "}
            </span>{" "}
            Create Note
          </Button>
        </div>
      )}
      {results && results.rows && results.rows.length > 0 ? (
        results.rows.map((note, index) => (
          <NoteCard
            key={index}
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
        <EmptyMessageCard name="note" />
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
        className={`!p-0 relative mx-auto bg-white dark:bg-white overflow-y-auto max-h-[95vh] ${
          expandDialog
            ? "lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]"
            : "lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] "
        } `}
      >
        <div className="flex justify-between items-center mb-4 bg-[#516f90] p-4">
          <h2 className="text-lg font-semibold text-white dark:text-white">
            Note
          </h2>
          <div className="flex gap-2 items-center">
            <button
              disabled={isPosting || isUploading}
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
              disabled={isPosting || isUploading}
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="text-white dark:text-white"
            >
              <CloseIcon width="24px" height="24px" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center px-4">
            <p className="text-gray-600 dark:!text-gray-600 text-xs">For</p>
            <p className="border rounded-full px-2 py-1 text-xs ml-2 dark:!text-gray-600">
              {getObjectName()}
            </p>
          </div>
          <ProseMirrorEditor
            attachments={[]}
            setEditorContent={setEditorContent}
            imageUploadUrl={imageUploadUrl}
            attachmentUploadUrl={attachmentUploadUrl}
            attachmentUploadMethod={"POST"}
            setAttachmentId={setAttachmentId}
            refetch={refetch}
            objectId={objectId}
            setIsUploading={setIsUploading}
          />
          <div className="mt-4 flex justify-end gap-3 darkbg-[#516f90] ">
            <Button
              disabled={isPosting || isUploading}
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setExpandDialog(false);
              }}
              className={`dark:!text-white`}
            >
              Cancel
            </Button>
            <Button
              disabled={isPosting || editorContent.trim() === "" || isUploading}
              onClick={handleSaveNote}
              isLoading={isPosting}
            >
              Create Note
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
