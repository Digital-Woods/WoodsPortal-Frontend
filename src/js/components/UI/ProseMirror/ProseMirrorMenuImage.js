const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const insertImage = (view, src, width, height) => {
  const { state, dispatch } = view;
  const { selection } = state;
  const position = selection.$cursor ? selection.$cursor.pos : selection.from;

  const transaction = state.tr.insert(
    position,
    state.schema.nodes.image.create({ src, width, height, class: `w-${width} h-${height}` })
  );
  dispatch(transaction);
};

const EditorImageUploadMenu = ({ editorView, imageUploadUrl, setisLoadingUoloading, setUploadProgress}) => {
  const token = getAuthToken();
  const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>`;
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
    console.log("image", image)


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
    }


  };

  const uploadImageToAPI = async (pmView, formData, width, height) => {
    setisLoadingUoloading(true)
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
    <div className="note-menuitem">
      <div
        className="ProseMirror-icon"
        title="Insert image"
        ref={boldButtonRef}
        onClick={uploadImage}
      >
        <SvgRenderer svgContent={boldIcon} />
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

const renderReactImageUploadComponent = (editorView, imageUploadUrl, setisLoadingUoloading, setUploadProgress) => {
  const container = document.createElement("div");
  ReactDOM.render(<EditorImageUploadMenu editorView={editorView} imageUploadUrl={imageUploadUrl} setisLoadingUoloading={setisLoadingUoloading} setUploadProgress={setUploadProgress} />, container);
  return container;
};

const customMenuItemImage = (imageUploadUrl, setisLoadingUoloading, setUploadProgress) => new MenuItem2({
  title: `Insert image`,
  run: () => {},
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactImageUploadComponent(editorView, imageUploadUrl, setisLoadingUoloading, setUploadProgress),
});
