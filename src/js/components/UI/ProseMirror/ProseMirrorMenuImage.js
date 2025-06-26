const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const insertImage = (view, src, width, height) => {
//   const { state, dispatch } = view;
//   const { selection } = state;
//   const position = selection.$cursor ? selection.$cursor.pos : selection.from;

//   const transaction = state.tr.insert(
//     position,
//     state.schema.nodes.image.create({ src, width, height, class: `w-${width} h-${height}` })
//   );
//   dispatch(transaction);
// };

const insertImage = (view, src, width, height) => {
  const { state, dispatch } = view;
  const { schema } = state;
  const { selection } = state;
  const position = selection.$cursor ? selection.$cursor.pos : selection.from;

  // Create the image node with a wrapper div
  const imageNode = schema.nodes.image.create({
    src,
    width,
    height,
    class: `w-${width} h-${height}`,
  });

  const newParagraphNode = schema.nodes.paragraph.create({}, "");

  // Create a transaction to insert the image and the paragraph
  const transaction = state.tr
    .insert(position, imageNode)
    .insert(position + imageNode.nodeSize + 1, newParagraphNode);

  // Dispatch the transaction
  dispatch(transaction);
};

const EditorImageUploadMenu = ({
  editorView,
  imageUploadUrl,
  setisLoadingUoloading,
  setUploadProgress,
}) => {
  const token = getAuthToken();
  const boldButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      const maxWidth = 1000; // Maximum width
      const maxHeight = 1000; // Maximum height

      let width = image.width;
      let height = image.height;

      // Maintain aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }
      await uploadImageToAPI(editorView, formData, width, height);
    };
  };

  const uploadImageToAPI = async (pmView, formData, width, height) => {
    setisLoadingUoloading(true);
    try {
      const response = await axios({
        method: "POST",
        url: imageUploadUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update the progress
        },
      });

      const imageUrl = response.data.data.url;
      const imageName = response.data.data.name;

      insertImage(pmView, imageUrl, width, height);

      setUploadProgress(0);
      setisLoadingUoloading(false);
      // setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      setisLoadingUoloading(false);
      // setIsUploading(false);
    }
  };

  return (
    <div className="">
      <div
        className="ProseMirror-icon note-menuitem"
        title="Insert image"
        ref={boldButtonRef}
        onClick={uploadImage}
      >
        {/* <SvgRenderer svgContent={boldIcon} /> */}
        <ImageIcon/>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

const renderReactImageUploadComponent = (
  editorView,
  imageUploadUrl,
  setisLoadingUoloading,
  setUploadProgress
) => {
  const container = document.createElement("div");
  ReactDOM.render(
    <EditorImageUploadMenu
      editorView={editorView}
      imageUploadUrl={imageUploadUrl}
      setisLoadingUoloading={setisLoadingUoloading}
      setUploadProgress={setUploadProgress}
    />,
    container
  );
  return container;
};

const customMenuItemImage = (
  imageUploadUrl,
  setisLoadingUoloading,
  setUploadProgress
) =>
  new MenuItem2({
    title: `Insert image`,
    run: () => {},
    select: (state) => {
      return true;
    },
    render: (editorView) =>
      renderReactImageUploadComponent(
        editorView,
        imageUploadUrl,
        setisLoadingUoloading,
        setUploadProgress
      ),
  });
