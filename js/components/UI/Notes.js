const Notes = ({ fileId, path }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { me } = useMe();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["data", fileId, page],
    queryFn: async () => {
      return await Client.notes.all(me, fileId, path, limit, page);
    },
  });

  const createNoteMutation = useMutation(
    async (newNote) => {
      return await Client.notes.createnote(me, fileId, path, newNote);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["data", fileId]);
        refetch();
        setShowDialog(false);
      },
      onError: (error) => {
        console.error("Error creating note:", error);
      },
    }
  );

  const handleSaveNote = (editorContent) => {
    const payload = {
      noteBody: editorContent,
    };
    createNoteMutation.mutate(payload);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching notes: {error.message}</div>;
  }

  const results = data && data.data && data.data.results;
  const totalNotes = data && data.data && data.data.total;
  const numOfPages = Math.ceil(totalNotes / limit);

  return (
    <div className="rounded-lg mt-2 bg-cleanWhite p-4">
      <div className="flex justify-between mt-2 mb-6 items-center">
        <CustomCheckbox buttonText="Sites" spanText="3" showSpan={true} />
        <Button className="text-white" onClick={() => setShowDialog(true)}>
          <span className="mr-2"> + </span> New Note
        </Button>
      </div>
      {results && results.length > 0 ? (
        results.map((note) => (
          <div key={note.id} className="mt-5">
            <p className="text-xs font-semibold">
              {formatDate(note.createdAt)}
            </p>
            <div className="border border-gray-200 shadow-md rounded-md mt-1 p-2">
              <div className="flex justify-between items-center">
                <div className="w-[40px] flex gap-x-2 items-center">
                  <img
                    src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                    alt="Profile"
                    className="rounded-full"
                  />
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    No name
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">
                    {formatTime(note.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                {ReactHtmlParser.default(DOMPurify.sanitize(note.noteBody))}
              </div>
              <div className="flex justify-end items-center">
                <div className="flex gap-x-2">
                  <PinIcon />
                  <CopyIcon />
                  <DeleteIcon />
                  <ThreeDotIcon />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No notes available.</div>
      )}

      {totalNotes > limit && (
        <Pagination
          numOfPages={numOfPages}
          currentPage={page}
          setCurrentPage={setPage}
        />
      )}

      <EditorComponent
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        handleSaveNote={handleSaveNote}
        isPosting={createNoteMutation.isLoading}
        fileId={fileId}
        path={path}
      />
    </div>
  );
};
