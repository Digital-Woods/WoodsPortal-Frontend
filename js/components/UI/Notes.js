const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
);

const NoteCard = ({ note, objectId, id, imageUploadUrl, attachmentUploadUrl, refetch, setAlert }) => {
  const { sync, setSync } = useSync();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [editorContent, setEditorContent] = useState(note.hs_note_body);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
  );
  const OpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>
  );

  const openEditor = () => {

  }

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const updateNoteMutation = useMutation(
    async (newNote) => {
      return await Client.notes.updateNote({
        objectId: objectId,
        id: id,
        note: newNote,
        note_id: note.hs_object_id,
        portalId: portalId
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
      <div className="border border-gray-200 bg-white shadow-md rounded-md mt-1 p-2 text-sm cursor-pointer" onClick={() => {
        setIsOpen(!isOpen);
        setIsOpenEditor(false)
      }
      }>
        <div >
          <div className="flex items-center">
            <div>
              {isOpen ?
                <OpenIcon />
                :
                <CloseIcon />
              }
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-sm font-semibold  whitespace-nowrap">
                Note
              </p>
              <div>
                <p className="text-gray-400 text-xs ">
                  <span className="mr-1"> {formatDate(note.hs_createdate)} </span>
                  {formatTime(note.hs_createdate)}
                </p>
              </div>
            </div>
          </div>
          {!isOpenEditor ?
            <div>
              <div className={`p-[24px] ${!isOpen ? '' : 'border border-[#fff] hover:border-blue-500 hover:bg-gray-100 rounded-md relative group cursor-text'}`}
                onClick={(e) => {

                  if (isOpen) {
                    e.stopPropagation();
                    setIsOpenEditor(true);
                    openEditor()
                  }
                }}
              >
                <div className={!isOpen ? 'relative line-clamp-2' : ''}>
                  <span>
                    {ReactHtmlParser.default(DOMPurify.sanitize(note.hs_note_body))}
                  </span>

                  <div
                    size="32"
                    opacity="1"
                    className={!isOpen ? 'text-shadow' : ''}
                  ></div>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditIcon />
                </div>
              </div>
              {isOpen &&
                <div onClick={(e) => e.stopPropagation()}>
                  <Attachments attachments={note.hs_attachment_ids || []} />
                </div>
              }
            </div>
            :
            <div className="p-[24px] cursor-text"
              onClick={(e) => e.stopPropagation()}
            >
              <CKEditor
                initialData={note.hs_note_body}
                attachments={note.hs_attachment_ids || []}
                setEditorContent={setEditorContent}
                id={`editor-${note.hs_object_id}`}
                imageUploadUrl={imageUploadUrl}
                attachmentUploadUrl={`${attachmentUploadUrl}/${note.hs_object_id}`}
                attachmentUploadMethod={'PUT'}
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
          }
        </div>
      </div>
    </div>
  )
}

const Notes = ({ path, objectId, id }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { me } = useMe();
  const [editorContent, setEditorContent] = useState("");
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const [attachmentUploadUrl, setAttachmentUploadUrl] = useState("");
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState(null);
  const [attachmentId, setAttachmentId] = useState("");
  const { sync, setSync } = useSync();

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
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
        cache: sync ? false : true
      }),
    onSuccess: (data) => {
      setSync(false)
    },
    onError: (error) => {
      setSync(false)
      console.error("Error fetching file details:", error);
    },
    refetchInterval: env.NOTE_INTERVAL_TIME,
  });
  // const createNoteMutation = useMutation(
  //   async (newNote) => {
  //     return await Client.notes.createnote({
  //       objectId: objectId,
  //       id: id,
  //       noteBody: newNote,
  //       attachmentId: attachmentId
  //     });
  //   },

  //   {
  //     onSuccess: (res) => {
  //       queryClient.invalidateQueries(["data"]);
  //       refetch();
  //       setShowDialog(false);
  //       setAlert({
  //         message: res.statusMsg,
  //         type: "success",
  //       });
  //     },
  //     onError: (error) => {
  //       console.error("Error creating note:", error);
  //       setAlert({
  //         message: "Failed to upload the note.",
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  // const { isLoading: isPosting } = createNoteMutation;
  // const handleSaveNote = () => {
  //   const payload = {
  //     noteBody: editorContent,
  //   };
  //   createNoteMutation.mutate();
  // };

  useEffect(() => {
    if (sync == true) refetch()
  }, [sync]);

  const { mutate: handleSaveNote, isLoading: isPosting } = useMutation({
    mutationKey: [
      "TableFormData"
    ],
    mutationFn: async () => {
      return await Client.notes.createnote({
        objectId: objectId,
        id: id,
        noteBody: editorContent,
        attachmentId: attachmentId,
        portalId: portalId
      });
    },

    onSuccess: (response) => {
      setSync(true)
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
    const portalId = getPortal().portalId
    setImageUploadUrl(`${env.API_BASE_URL}/api/${hubId}/${portalId}/hubspot-object-notes/images/${objectId}/${id}`)
    setAttachmentUploadUrl(`${env.API_BASE_URL}/api/${hubId}/${portalId}/hubspot-object-notes/attachments/${objectId}/${id}`)
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
    <div className="rounded-lg mt-2 bg-cleanWhite dark:bg-[#212121] p-4">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="flex justify-end mt-2 mb-6 items-center">
        <Button className="text-white" onClick={() => setShowDialog(true)}>
          <span className="mr-2"> + </span> New Note
        </Button>
      </div>
      {results && results.rows && results.rows.length > 0 ? (
        results.rows.map((note) => (
          <NoteCard note={note} objectId={objectId} id={id} imageUploadUrl={imageUploadUrl} attachmentUploadUrl={attachmentUploadUrl} refetch={refetch} setAlert={setAlert} />
        ))
      ) : (
        <div className="text-primary dark:text-cleanWhite">No notes available.</div>
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
        className=" relative mx-auto bg-white overflow-y-auto w-[50%]"
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
          attachmentUploadMethod={'POST'}
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
